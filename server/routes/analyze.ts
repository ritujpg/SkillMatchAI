import { GoogleGenAI, Type } from "@google/genai";
import dns from "node:dns/promises";
import net from "node:net";
import { RequestHandler } from "express";
import { z } from "zod";
import { AnalysisResult } from "@shared/api";

const requestSchema = z.object({
  imageBase64: z.string().min(1),
  mediaType: z.enum(["image/jpeg", "image/png"]),
  jobDescription: z.string().trim().min(1).max(50000),
});

const resultSchema = z.object({
  matchScore: z.number().min(0).max(100),
  breakdown: z.record(z.string(), z.number().min(0).max(100)),
  summary: z.string(),
  matchedSkills: z.array(z.string()),
  missingSkills: z.array(z.string()),
  strengths: z.array(z.string()),
  recommendations: z.array(z.object({ title: z.string(), description: z.string() })),
  jobTitle: z.string(),
  companyName: z.string().nullable().optional(),
});

const URL_FETCH_TIMEOUT_MS = 10000;
const MAX_HTML_BYTES = 2_000_000;
const MAX_REDIRECTS = 3;

function isPrivateAddress(address: string) {
  const normalized = address.toLowerCase().replace(/^\[|\]$/g, "").replace(/^::ffff:/, "");
  if (net.isIPv4(normalized)) {
    const octets = normalized.split(".").map(Number);
    const value = octets[0] * 0x1000000 + octets[1] * 0x10000 + octets[2] * 0x100 + octets[3];
    return octets[0] === 0 || octets[0] === 10 || octets[0] === 127 ||
      (octets[0] === 100 && octets[1] >= 64 && octets[1] <= 127) ||
      (octets[0] === 169 && octets[1] === 254) ||
      (octets[0] === 172 && octets[1] >= 16 && octets[1] <= 31) ||
      (octets[0] === 192 && (octets[1] === 168 || (octets[1] === 0 && octets[2] === 0))) ||
      (octets[0] === 192 && octets[1] === 0 && octets[2] === 2) ||
      (octets[0] === 198 && octets[1] === 18) || (octets[0] === 198 && octets[1] === 51 && octets[2] === 100) ||
      (octets[0] === 203 && octets[1] === 0 && octets[2] === 113) || value >= 0xe0000000;
  }
  if (net.isIPv6(normalized)) {
    const groups = normalized.split("::");
    const left = groups[0] ? groups[0].split(":") : [];
    const right = groups[1] ? groups[1].split(":") : [];
    const expanded = [...left, ...Array(8 - left.length - right.length).fill("0"), ...right];
    const value = expanded.reduce((total, group) => (total << 16n) + BigInt(parseInt(group || "0", 16)), 0n);
    const first = value >> 112n;
    return value === 0n || value === 1n || first === 0xffn ||
      (first >= 0xfe80n && first <= 0xfeffn) || (first >= 0xfc00n && first <= 0xfdffn) ||
      (first === 0x2001n && ((value >> 96n) & 0xffffn) === 0xdb8n);
  }
  return false;
}

async function assertPublicUrl(value: string) {
  const url = new URL(value);
  if (!["http:", "https:"].includes(url.protocol) || !url.hostname) throw new Error("Only public HTTP(S) URLs are supported.");
  if (url.hostname === "localhost" || net.isIP(url.hostname) && isPrivateAddress(url.hostname)) throw new Error("Private or internal URLs are not allowed.");
  const addresses = await dns.lookup(url.hostname, { all: true });
  if (!addresses.length || addresses.some(({ address }) => isPrivateAddress(address))) throw new Error("Private or internal URLs are not allowed.");
  return url;
}

function decodeHtml(value: string) {
  return value.replace(/&nbsp;|&#160;/gi, " ").replace(/&amp;/gi, "&").replace(/&lt;/gi, "<").replace(/&gt;/gi, ">").replace(/&quot;/gi, '"').replace(/&#39;|&apos;/gi, "'");
}

function extractReadableText(html: string) {
  const mainMatch = html.match(/<(?:main|article)[^>]*>([\s\S]*?)<\/(?:main|article)>/i);
  const source = mainMatch?.[1] ?? html;
  const withoutNoise = source
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/<(script|style|noscript|svg|nav|header|footer|aside|form|iframe)[^>]*>[\s\S]*?<\/\1>/gi, "")
    .replace(/<(?:div|section|p|li|h[1-6]|br|tr)[^>]*>/gi, "\n")
    .replace(/<[^>]+>/g, " ");
  const text = decodeHtml(withoutNoise).replace(/[ \t\r\f]+/g, " ").replace(/\s*\n\s*/g, "\n").trim();
  if (text.length < 80) throw new Error("The job page did not contain enough readable content.");
  const lines = text.split("\n").map((line) => line.trim()).filter(Boolean);
  const useful = lines.filter((line) => /job|role|responsibil|qualif|require|skill|experience|education|about the|salary|location|apply/i.test(line));
  return (useful.length >= 4 ? useful : lines).join("\n").slice(0, 50000);
}

async function readResponseText(response: Response) {
  const contentLength = Number(response.headers.get("content-length") ?? 0);
  if (contentLength > MAX_HTML_BYTES) throw new Error("The job page is too large to process.");
  if (!response.body) throw new Error("The job page returned no content.");
  const reader = response.body.getReader();
  const chunks: Uint8Array[] = [];
  let total = 0;
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    total += value.byteLength;
    if (total > MAX_HTML_BYTES) {
      await reader.cancel();
      throw new Error("The job page is too large to process.");
    }
    chunks.push(value);
  }
  const bytes = new Uint8Array(total);
  let offset = 0;
  for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.byteLength; }
  return new TextDecoder().decode(bytes);
}

async function fetchJobDescription(value: string) {
  let currentUrl = value;
  for (let redirect = 0; redirect <= MAX_REDIRECTS; redirect++) {
    const url = await assertPublicUrl(currentUrl);
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), URL_FETCH_TIMEOUT_MS);
    try {
      const response = await fetch(url, { signal: controller.signal, redirect: "manual", headers: { Accept: "text/html,application/xhtml+xml" } });
      if (response.status >= 300 && response.status < 400) {
        const location = response.headers.get("location");
        if (!location || redirect === MAX_REDIRECTS) throw new Error("The job page redirected too many times.");
        currentUrl = new URL(location, url).toString();
        continue;
      }
      if (!response.ok) throw new Error(`The job page returned HTTP ${response.status}.`);
      if (!response.headers.get("content-type")?.includes("text/html")) throw new Error("The job URL did not return an HTML page.");
      return extractReadableText(await readResponseText(response));
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") throw new Error("The job page request timed out.");
      throw error;
    } finally {
      clearTimeout(timeout);
    }
  }
  throw new Error("The job page could not be fetched.");
}

function parseJson(text: string): unknown {
  const cleaned = text.trim().replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/, "");
  return JSON.parse(cleaned);
}

export const handleAnalyze: RequestHandler = async (req, res) => {
  const parsedRequest = requestSchema.safeParse(req.body);
    console.log("[analyze] request received");
  if (!parsedRequest.success) {
    res.status(400).json({ error: "Please provide a valid resume image and job description." });
    return;
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    res.status(503).json({ error: "GEMINI_API_KEY is not configured on the server." });
    return;
  }

  const { imageBase64, mediaType, jobDescription } = parsedRequest.data;
  const ai = new GoogleGenAI({ apiKey });
  console.log(`[analyze] model=gemini-3.6-flash mediaType=${mediaType} imageBase64Chars=${imageBase64.length} jobDescriptionChars=${jobDescription.length}`);

  try {
    let resolvedJobDescription = jobDescription;
    if (/^https?:\/\//i.test(jobDescription.trim())) {
      try {
        resolvedJobDescription = await fetchJobDescription(jobDescription.trim());
      } catch (error) {
        console.error("[analyze] job URL extraction failed", error);
        res.status(422).json({ error: error instanceof Error ? error.message : "The job page could not be extracted." });
        return;
      }
    }
    if (resolvedJobDescription !== jobDescription) console.log(`[analyze] extracted job page chars=${resolvedJobDescription.length}`);
    console.log("[analyze] sending request to Gemini");
    const geminiStartedAt = Date.now();
    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: [{
        role: "user",
        parts: [
          { inlineData: { mimeType: mediaType, data: imageBase64 } },
          { text: `Analyze this resume image against the following job description. Return grounded, specific results. Include companyName only when the job description names a company.\n\nJob description:\n${resolvedJobDescription}` },
        ],
      }],
      config: {
        httpOptions: { timeout: 120000 },
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            matchScore: { type: Type.NUMBER, description: "Overall match percentage from 0 to 100." },
            breakdown: { type: Type.OBJECT, additionalProperties: { type: Type.NUMBER } },
            summary: { type: Type.STRING },
            matchedSkills: { type: Type.ARRAY, items: { type: Type.STRING } },
            missingSkills: { type: Type.ARRAY, items: { type: Type.STRING } },
            strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
            recommendations: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { title: { type: Type.STRING }, description: { type: Type.STRING } }, required: ["title", "description"] } },
            jobTitle: { type: Type.STRING },
            companyName: { type: Type.STRING, nullable: true },
          },
          required: ["matchScore", "breakdown", "summary", "matchedSkills", "missingSkills", "strengths", "recommendations", "jobTitle"],
        },
      },
    });
    console.log(`[analyze] Gemini generateContent completed in ${Date.now() - geminiStartedAt}ms`);

    const text = response.text;
    if (!text) throw new Error("Gemini returned no text content.");
    const parsedResult = resultSchema.parse(parseJson(text));
    const result: AnalysisResult = parsedResult.companyName == null
      ? { ...parsedResult, companyName: undefined }
      : parsedResult;
    console.log("[analyze] Gemini response received");
    res.json(result);
  } catch (error) {
    console.error("Gemini analysis failed", error);
    res.status(502).json({ error: "The resume analysis could not be completed. Please try again." });
  }
};
# AI Workflow

## Information Sent to Gemini

The server sends two content parts to `gemini-3.6-flash`:

1. The resume image as inline base64 data with its validated MIME type (`image/jpeg` or `image/png`).
2. Text containing the job description, either the manually entered text or cleaned text extracted from a public job URL.

The prompt asks Gemini to compare the resume with the job description, remain grounded in the supplied content, and include a company name only when the job description names one.

## Structured Response

The request enables:

```ts
responseMimeType: "application/json"
```

and supplies a response schema for:

- `matchScore`
- `breakdown`
- `summary`
- `matchedSkills`
- `missingSkills`
- `strengths`
- `recommendations` with `title` and `description`
- `jobTitle`
- nullable or optional `companyName`

The server parses Gemini's text as JSON and validates it with Zod. A null company name is normalized to an omitted property before the response is sent. `Results.tsx` conditionally renders the company name.

## Timeouts and Errors

The GenAI HTTP request has a 120-second SDK timeout. The browser request has a 125-second abort timeout. Invalid responses, missing text, and failed Gemini calls return an error response instead of silently producing a report.

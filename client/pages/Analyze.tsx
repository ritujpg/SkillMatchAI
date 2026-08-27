import { useState } from "react";
import { ArrowRight, BriefcaseBusiness, FileText, Link as LinkIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button, ErrorAlert, Navbar, UploadDropzone } from "@/components/skillmatch";

const MIN_WORDS = 50;

function countWords(value: string) {
  const trimmed = value.trim();
  return trimmed ? trimmed.split(/\s+/).length : 0;
}

function isValidUrl(value: string) {
  try {
    const url = new URL(value.trim());
    return ["http:", "https:"].includes(url.protocol) && Boolean(url.hostname);
  } catch {
    return false;
  }
}

export default function Analyze() {
  const navigate = useNavigate();
  const [file, setFile] = useState<File | null>(null);
  const [tab, setTab] = useState<"description" | "url">("description");
  const [jobInput, setJobInput] = useState("");
  const [error, setError] = useState("");
  const wordCount = countWords(jobInput);
  const descriptionValid = wordCount >= MIN_WORDS;
  const urlValid = isValidUrl(jobInput);
  const jobInputValid = tab === "description" ? descriptionValid : urlValid;
  const formValid = Boolean(file) && jobInputValid;

  const setResume = (candidate: File | null) => {
    if (candidate && !["image/jpeg", "image/png"].includes(candidate.type)) {
      setFile(null);
      setError("Please upload a JPG, JPEG, or PNG resume image.");
      return;
    }
    setFile(candidate);
    setError("");
  };

  const analyze = () => {
    if (formValid) navigate("/analyzing");
  };

  return <div className="min-h-screen bg-slate-50"><Navbar /><main className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14"><div className="max-w-2xl"><p className="text-xs font-bold tracking-[.14em] text-blue-600">NEW ANALYSIS</p><h1 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-950">Analyze your job match</h1><p className="mt-3 text-sm leading-6 text-slate-600">Upload your resume image and provide a job opportunity to receive your match report.</p></div><div className="mt-8 grid gap-5 lg:grid-cols-2"><section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6"><div className="flex items-center gap-3"><span className="grid h-9 w-9 place-items-center rounded-xl bg-blue-50 text-blue-600"><FileText className="h-4 w-4" /></span><h2 className="font-bold text-slate-900">Your Resume</h2></div><div className="mt-6"><UploadDropzone file={file} error={error} onFile={setResume} /><p className="mt-4 text-xs leading-5 text-slate-500">For best results, upload a clear, high-resolution resume.</p></div></section><section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6"><div className="flex items-center gap-3"><span className="grid h-9 w-9 place-items-center rounded-xl bg-blue-50 text-blue-600"><BriefcaseBusiness className="h-4 w-4" /></span><h2 className="font-bold text-slate-900">Job Opportunity</h2></div><div className="mt-6 flex rounded-xl bg-slate-100 p-1"><button onClick={() => { setTab("description"); setJobInput(""); }} className={`flex-1 rounded-lg px-3 py-2 text-sm font-semibold transition ${tab === "description" ? "bg-white text-blue-700 shadow-sm" : "text-slate-500"}`}>Paste Job Description</button><button onClick={() => { setTab("url"); setJobInput(""); }} className={`flex-1 rounded-lg px-3 py-2 text-sm font-semibold transition ${tab === "url" ? "bg-white text-blue-700 shadow-sm" : "text-slate-500"}`}>Job URL</button></div>{tab === "description" ? <div className="mt-5"><textarea value={jobInput} onChange={(e) => setJobInput(e.target.value)} placeholder="Paste the job description here..." className="min-h-48 w-full resize-none rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-800 outline-none placeholder:text-slate-400 focus:border-blue-400 focus:ring-4 focus:ring-blue-50" /><div className="mt-2 flex items-center justify-between text-xs"><span className={descriptionValid ? "font-medium text-emerald-600" : "text-slate-500"}>{wordCount} / {MIN_WORDS} words</span><span className="text-slate-400">{jobInput.length.toLocaleString()} characters</span></div>{jobInput.trim() && !descriptionValid && <p className="mt-2 text-xs text-amber-600">Please enter at least 50 words for a meaningful match analysis.</p>}</div> : <div className="mt-5"><div className="relative"><LinkIcon className="pointer-events-none absolute left-4 top-3.5 h-4 w-4 text-slate-400" /><input value={jobInput} onChange={(e) => setJobInput(e.target.value)} placeholder="Paste a job posting URL..." type="url" className="h-11 w-full rounded-xl border border-slate-200 pl-10 pr-4 text-sm outline-none placeholder:text-slate-400 focus:border-blue-400 focus:ring-4 focus:ring-blue-50" /></div><p className="mt-3 text-xs leading-5 text-slate-500">Paste a public job posting URL to analyze its role requirements.</p>{jobInput && !urlValid && <ErrorAlert message="Enter a valid job posting URL to continue." />}</div>}</section></div><div className="mt-6 flex justify-end"><Button size="lg" className="w-full sm:w-auto" disabled={!formValid} onClick={analyze}>Analyze Match <ArrowRight className="h-4 w-4" /></Button></div></main></div>;
}

import { ChangeEvent, ReactNode, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, BriefcaseBusiness, Check, FileImage, LoaderCircle, Sparkles, Upload, X } from "lucide-react";
import { cn } from "@/lib/utils";

export function Logo() {
  return <Link to="/" className="flex items-center gap-2 font-bold tracking-tight text-slate-950"><span className="grid h-9 w-9 place-items-center rounded-xl bg-blue-600 text-white shadow-sm"><Sparkles className="h-4 w-4" /></span><span>SkillMatch<span className="text-blue-600">AI</span></span></Link>;
}

export function Navbar() {
  const navigate = useNavigate();
  return <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/90 backdrop-blur"><div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6"><Logo /><nav className="hidden items-center gap-7 text-sm font-medium text-slate-600 md:flex"><a href="#how-it-works" className="hover:text-blue-600">How It Works</a><a href="#features" className="hover:text-blue-600">Features</a></nav><Button size="sm" onClick={() => navigate("/analyze")}>Analyze Resume <ArrowRight className="h-4 w-4" /></Button></div></header>;
}

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary" | "secondary" | "ghost"; size?: "sm" | "md" | "lg" };
export function Button({ className, variant = "primary", size = "md", children, ...props }: ButtonProps) {
  const styles = { primary: "bg-blue-600 text-white shadow-sm hover:bg-blue-700", secondary: "border border-slate-200 bg-white text-slate-700 hover:border-blue-200 hover:bg-blue-50", ghost: "text-slate-600 hover:bg-slate-100" };
  const sizes = { sm: "h-9 px-3.5 text-sm", md: "h-11 px-4 text-sm", lg: "h-12 px-5 text-base" };
  return <button className={cn("inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-all focus:outline-none focus:ring-4 focus:ring-blue-100 disabled:cursor-not-allowed disabled:opacity-45", styles[variant], sizes[size], className)} {...props}>{children}</button>;
}

export function FeatureCard({ icon, title, description }: { icon: ReactNode; title: string; description: string }) {
  return <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_8px_26px_-18px_rgba(15,23,42,.35)]"><div className="mb-4 grid h-11 w-11 place-items-center rounded-xl bg-blue-50 text-blue-600">{icon}</div><h3 className="text-base font-bold text-slate-900">{title}</h3><p className="mt-2 text-sm leading-6 text-slate-600">{description}</p></article>;
}

export function UploadDropzone({ file, error, onFile }: { file: File | null; error?: string; onFile: (file: File | null) => void }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const selectFile = (event: ChangeEvent<HTMLInputElement>) => onFile(event.target.files?.[0] ?? null);
  if (file) return <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4"><div className="flex items-center gap-3"><div className="grid h-12 w-12 place-items-center rounded-xl bg-blue-100 text-blue-600"><FileImage className="h-5 w-5" /></div><div className="min-w-0 flex-1"><p className="truncate text-sm font-semibold text-slate-800">{file.name}</p><p className="mt-0.5 text-xs text-slate-500">{(file.size / 1024 / 1024).toFixed(2)} MB · Ready to analyze</p></div><Button variant="ghost" size="sm" aria-label="Remove resume" onClick={() => onFile(null)}><X className="h-4 w-4" /></Button></div><div className="mt-4 flex gap-2"><Button size="sm" variant="secondary" onClick={() => inputRef.current?.click()}>Replace</Button><Button size="sm" variant="ghost" onClick={() => onFile(null)}>Remove</Button></div><input ref={inputRef} type="file" accept="image/jpeg,image/png" onChange={selectFile} className="hidden" /></div>;
  return <><button type="button" onClick={() => inputRef.current?.click()} className="flex min-h-56 w-full flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/60 px-5 text-center transition hover:border-blue-300 hover:bg-blue-50/40"><span className="mb-3 grid h-12 w-12 place-items-center rounded-full bg-white text-blue-600 shadow-sm"><Upload className="h-5 w-5" /></span><span className="text-sm font-semibold text-slate-800">Drop your resume here or <span className="text-blue-600">browse</span></span><span className="mt-1 text-xs text-slate-500">JPG, JPEG or PNG</span></button><input ref={inputRef} type="file" accept="image/jpeg,image/png" onChange={selectFile} className="hidden" />{error && <ErrorAlert message={error} />}</>;
}

export function ErrorAlert({ message }: { message: string }) { return <div className="mt-3 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs font-medium text-red-700">{message}</div>; }
export function SkillChip({ children, type = "positive" }: { children: ReactNode; type?: "positive" | "warning" }) { return <span className={cn("inline-flex items-center rounded-lg px-2.5 py-1 text-sm font-medium", type === "positive" ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700")}>{children}</span>; }
export function ProgressBar({ value, color = "blue" }: { value: number; color?: "blue" | "emerald" }) { return <div className="h-2 overflow-hidden rounded-full bg-slate-100"><div className={cn("h-full rounded-full transition-all duration-700", color === "blue" ? "bg-blue-600" : "bg-emerald-500")} style={{ width: `${value}%` }} /></div>; }
export function MatchScoreCircle({ score }: { score: number }) { return <div className="relative grid h-36 w-36 place-items-center rounded-full" style={{ background: `conic-gradient(#2563eb ${score * 3.6}deg, #e8efff 0deg)` }}><div className="grid h-28 w-28 place-items-center rounded-full bg-white"><span className="text-3xl font-extrabold tracking-tight text-slate-950">{score}%</span></div></div>; }
export function LoadingState() { return <LoaderCircle className="h-5 w-5 animate-spin" />; }
export { BriefcaseBusiness, Check, Sparkles };

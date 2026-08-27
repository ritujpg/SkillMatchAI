import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  BriefcaseBusiness,
  CheckCircle2,
  RotateCcw,
  Target,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AnalysisResult } from "@shared/api";
import {
  Button,
  MatchScoreCircle,
  Navbar,
  ProgressBar,
  SkillChip,
} from "@/components/skillmatch";

const recommendationIcons = [BriefcaseBusiness, Target, BookOpen];

export default function Results() {
  const navigate = useNavigate();
  const [result, setResult] = useState<AnalysisResult | null>(null);

  useEffect(() => {
    const storedResult = sessionStorage.getItem("skillmatch.analysisResult");
    if (!storedResult) {
      navigate("/analyze");
      return;
    }
    try {
      setResult(JSON.parse(storedResult) as AnalysisResult);
    } catch {
      sessionStorage.removeItem("skillmatch.analysisResult");
      navigate("/analyze");
    }
  }, [navigate]);

  if (!result) return null;

  const score = Math.round(result.matchScore);
  const metrics = [
    "Skills Match",
    "Experience Match",
    "Education Match",
    "Requirements Match",
  ].map((label) => [label, `${score}%`]);
  const breakdown = [
    "Technical Skills",
    "Experience",
    "Education",
    "Other Requirements",
  ].map((label) => [label, score]);

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <div className="mb-6">
          <Button variant="ghost" size="sm" onClick={() => navigate("/analyze")}>
            <ArrowLeft className="h-4 w-4" /> Back
          </Button>
        </div>
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-start">
          <div>
            <p className="text-xs font-bold tracking-[.14em] text-blue-600">
              MATCH REPORT
            </p>
            <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-950">
              Your Job Match
            </h1>
            <div className="mt-3 flex items-center gap-2 text-sm text-slate-600">
              <span className="font-semibold text-slate-800">
                {result.jobTitle}
              </span>
              {result.companyName && (
                <>
                  <span className="text-slate-300">•</span>
                  <span>{result.companyName}</span>
                </>
              )}
            </div>
          </div>
          <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700">
            <CheckCircle2 className="h-3.5 w-3.5" /> Analysis completed
          </div>
        </div>
        <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="flex flex-col items-center gap-7 md:flex-row">
            <MatchScoreCircle score={score} />
            <div className="text-center md:text-left">
              <p className="text-sm font-semibold text-blue-600">
                Overall Match
              </p>
              <h2 className="mt-1 text-2xl font-bold tracking-tight text-slate-950">
                {score >= 75
                  ? "Strong fit for this role"
                  : score >= 50
                    ? "Promising fit for this role"
                    : "Opportunity to strengthen your fit"}
              </h2>
              <p className="mt-3 max-w-xl text-sm leading-6 text-slate-600">
                {result.strengths.join(" ")}
              </p>
            </div>
          </div>
          <div className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-4">
            {metrics.map(([label, value]) => (
              <div
                key={label}
                className="rounded-xl border border-slate-100 bg-slate-50 p-4"
              >
                <p className="text-xs font-medium text-slate-500">{label}</p>
                <p className="mt-1 text-xl font-bold text-slate-900">{value}</p>
              </div>
            ))}
          </div>
        </section>
        <div className="mt-5 grid gap-5 lg:grid-cols-2">
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="font-bold text-slate-900">Skills Analysis</h2>
            <div className="mt-5 grid gap-5 sm:grid-cols-2">
              <div>
                <h3 className="text-sm font-semibold text-slate-700">
                  Matching Skills
                </h3>
                <div className="mt-3 flex flex-wrap gap-2">
                  {result.matchedSkills.map((skill) => (
                    <SkillChip key={skill}>{skill}</SkillChip>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-slate-700">
                  Skill Gaps
                </h3>
                <div className="mt-3 flex flex-wrap gap-2">
                  {result.missingSkills.map((skill) => (
                    <SkillChip type="warning" key={skill}>
                      {skill}
                    </SkillChip>
                  ))}
                </div>
              </div>
            </div>
          </section>
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="font-bold text-slate-900">
              Experience & Qualifications
            </h2>
            <div className="mt-5 space-y-4">
              <div>
                <div className="mb-2 flex justify-between text-sm">
                  <span className="font-medium text-slate-700">
                    Experience match
                  </span>
                  <span className="font-bold text-slate-900">{score}%</span>
                </div>
                <ProgressBar value={score} />
              </div>
              <div className="flex items-center justify-between border-t border-slate-100 pt-4 text-sm">
                <span className="text-slate-600">Education match</span>
                <span className="font-semibold text-emerald-600">
                  {score >= 70 ? "Strong match" : "Review recommended"}
                </span>
              </div>
              <p className="text-sm leading-6 text-slate-600">
                {result.strengths.join(" ")}
              </p>
            </div>
          </section>
        </div>
        <section className="mt-5 grid gap-5 lg:grid-cols-[1.05fr_.95fr]">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="font-bold text-slate-900">Match Breakdown</h2>
            <div className="mt-6 space-y-5">
              {breakdown.map(([label, value]) => (
                <div key={String(label)}>
                  <div className="mb-2 flex justify-between text-sm">
                    <span className="font-medium text-slate-700">{label}</span>
                    <span className="font-bold text-slate-900">{value}%</span>
                  </div>
                  <ProgressBar value={Number(value)} />
                </div>
              ))}
              <div className="border-t border-slate-100 pt-5">
                <div className="flex justify-between text-sm font-bold text-slate-950">
                  <span>Overall Match</span>
                  <span className="text-blue-600">{score}%</span>
                </div>
              </div>
            </div>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="font-bold text-slate-900">AI Recommendations</h2>
            <div className="mt-4 space-y-3">
              {result.recommendations.map((recommendation, index) => {
                const Icon =
                  recommendationIcons[index % recommendationIcons.length];
                return (
                  <div
                    key={`${recommendation.title}-${index}`}
                    className="flex gap-3 rounded-xl bg-blue-50/60 p-3"
                  >
                    <span className="mt-0.5 text-blue-600">
                      <Icon className="h-5 w-5" />
                    </span>
                    <div>
                      <h3 className="text-sm font-semibold text-slate-800">
                        {recommendation.title}
                      </h3>
                      <p className="mt-1 text-xs leading-5 text-slate-600">
                        {recommendation.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
        <div className="mt-8 flex flex-col justify-end gap-3 sm:flex-row">
          <Button variant="secondary" onClick={() => navigate("/")}>
            <RotateCcw className="h-4 w-4" /> Start Over
          </Button>
          <Button onClick={() => navigate("/analyze")}>
            Analyze Another Job <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </main>
    </div>
  );
}

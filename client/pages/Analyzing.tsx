import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AnalysisResult } from "@shared/api";
import { ArrowLeft } from "lucide-react";
import {
  Button,
  Check,
  ErrorAlert,
  Logo,
  LoadingState,
} from "@/components/skillmatch";

const stages = [
  "Reading your resume",
  "Comparing job requirements",
  "Identifying skill gaps",
  "Generating recommendations",
];
const REQUEST_TIMEOUT_MS = 125000;

export default function Analyzing() {
  const navigate = useNavigate();
  const [stage, setStage] = useState(0);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    const input = sessionStorage.getItem("skillmatch.analysisInput");
    if (!input) {
      navigate("/analyze");
      return;
    }

    const stageTimer = window.setInterval(
      () => setStage((current) => Math.min(current + 1, stages.length - 1)),
      900,
    );
    const controller = new AbortController();
    const timeout = window.setTimeout(
      () => controller.abort(),
      REQUEST_TIMEOUT_MS,
    );

    fetch("/api/analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: input,
      signal: controller.signal,
    })
      .then(async (response) => {
        const data = await response.json();
        if (!response.ok) throw new Error(data.error ?? "Analysis failed.");
        if (!active) return;
        sessionStorage.setItem(
          "skillmatch.analysisResult",
          JSON.stringify(data as AnalysisResult),
        );
        setStage(stages.length);
        navigate("/results");
      })
      .catch((reason: unknown) => {
        if (!active) return;
        setError(
          reason instanceof DOMException && reason.name === "AbortError"
            ? "The analysis timed out. Please try again."
            : reason instanceof Error
              ? reason.message
              : "Analysis failed. Please try again.",
        );
      })
      .finally(() => {
        window.clearInterval(stageTimer);
        window.clearTimeout(timeout);
      });

    return () => {
      active = false;
      controller.abort();
      window.clearInterval(stageTimer);
      window.clearTimeout(timeout);
    };
  }, [navigate]);

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex h-16 max-w-6xl items-center px-4 sm:px-6">
          <Logo />
        </div>
      </header>
      <main className="grid min-h-[calc(100vh-65px)] place-items-center px-4">
        <section className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-7 text-center shadow-[0_15px_45px_-25px_rgba(15,23,42,.3)] sm:p-9">
          <div className="mb-5 flex justify-start">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/analyze")}
          >
            <ArrowLeft className="h-4 w-4" /> Back
          </Button>
          </div>
          <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-blue-50 text-blue-600">
            <LoadingState />
          </div>
          <h1 className="mt-6 text-2xl font-bold tracking-tight text-slate-950">
            {error
              ? "Analysis could not be completed"
              : "Analyzing your match..."}
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            {error
              ? "Check your API configuration or try again."
              : "We’re mapping your experience to this opportunity."}
          </p>
          {error ? (
            <ErrorAlert message={error} />
          ) : (
            <>
              <div className="mt-8 space-y-4 text-left">
                {stages.map((item, index) => (
                  <div key={item} className="flex items-center gap-3 text-sm">
                    <span
                      className={`grid h-6 w-6 place-items-center rounded-full ${index < stage ? "bg-emerald-500 text-white" : index === stage ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-400"}`}
                    >
                      {index < stage ? (
                        <Check className="h-3.5 w-3.5" />
                      ) : index === stage ? (
                        <LoadingState />
                      ) : (
                        index + 1
                      )}
                    </span>
                    <span
                      className={
                        index <= stage
                          ? "font-medium text-slate-800"
                          : "text-slate-400"
                      }
                    >
                      {item}
                    </span>
                  </div>
                ))}
              </div>
              <div className="mt-8 h-1.5 overflow-hidden rounded-full bg-slate-100">
                <div
                  className="h-full rounded-full bg-blue-600 transition-all duration-500"
                  style={{
                    width: `${Math.min((stage / stages.length) * 100, 100)}%`,
                  }}
                />
              </div>
            </>
          )}
        </section>
      </main>
    </div>
  );
}

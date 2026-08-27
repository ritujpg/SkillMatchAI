# SkillMatchAI

> Resume-to-job matching with Gemini vision analysis.

## Dashboard

- [[Project Overview]] - Product scope and current capabilities
- [[Architecture]] - Frontend, backend, and request flow
- [[AI Workflow]] - Gemini inputs and structured output
- [[Job URL Scraping]] - Public job-page fetching and cleanup
- [[Security]] - SSRF, limits, and validation controls
- [[Technical Decisions]] - Key implementation choices
- [[Challenges & Solutions]] - Issues encountered during development
- [[Future Improvements]] - Implemented scope and possible next steps

## Current Stack

- React 18, React Router, TypeScript, Vite, Tailwind CSS
- Express server integrated with Vite
- Google GenAI SDK (`@google/genai`)
- Gemini model: `gemini-3.6-flash`
- Zod for request and response validation
- Vitest for tests

## Primary Entry Points

- `client/pages/Analyze.tsx`
- `client/pages/Analyzing.tsx`
- `server/routes/analyze.ts`
- `client/pages/Results.tsx`
- `shared/api.ts`

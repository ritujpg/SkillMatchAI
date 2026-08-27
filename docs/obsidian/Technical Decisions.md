# Technical Decisions

| Decision | Reason |
|---|---|
| Server-side URL extraction | Keeps page fetching and SSRF controls away from browser code and avoids exposing a scraping implementation to clients. |
| Existing `POST /api/analyze` contract | Preserves the established frontend flow and supports both manual text and URL input through the same endpoint. |
| Gemini vision input | Lets the model inspect the resume image directly without adding a separate OCR dependency. |
| Structured Gemini JSON | Makes the analysis predictable for the report UI and allows server-side schema validation. |
| Zod request and response validation | Rejects malformed input and prevents unvalidated model output from crossing the API boundary. |
| Native static HTML extraction | Avoids JavaScript execution and keeps the scraper dependency-free and simple. |
| Explicit timeouts and size limits | Prevents slow pages, large responses, and stalled model calls from holding the workflow indefinitely. |
| Server-only `GEMINI_API_KEY` | Prevents the credential from being exposed in browser bundles or client storage. |
| Session storage handoff | Keeps the existing three-page user flow without changing the API contract or introducing a global state dependency. |

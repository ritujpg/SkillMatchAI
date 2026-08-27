# Future Improvements

## Implemented Features

- Resume JPG/JPEG/PNG image upload
- Manual job-description analysis
- Public job URL fetching and static extraction
- SSRF and redirect validation
- Gemini `gemini-3.6-flash` vision analysis
- Structured match results with score, skills, strengths, gaps, recommendations, and job metadata
- Loading, timeout, error, and navigation handling

## Possible Future Work

These are not currently implemented:

- Retrieval-augmented generation (RAG) using a curated skills or labor-market knowledge base
- AI agents for specialized tasks such as resume parsing, job normalization, and coaching
- Multi-agent workflows with independent evaluators and an aggregation step
- Better job-site extraction using robust HTML parsing, schema.org JobPosting data, and site-specific adapters that remain compliant with access rules
- Result and page-content caching with expiration and privacy controls
- Database-backed job history, saved reports, and comparison across opportunities
- More granular score breakdowns tied directly to model-evaluated criteria
- Automated tests for SSRF ranges, redirects, extraction quality, and API contracts

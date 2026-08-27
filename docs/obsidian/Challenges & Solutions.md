# Challenges & Solutions

## Gemini Model Configuration Issue

The initial model configuration used an unavailable Gemini model and produced a 404. The route was updated to use the configured `gemini-3.6-flash` model.

## Gemini Request Appearing to Hang

The server log reached the Gemini call but did not show completion. Timing logs were added around `generateContent()`, and both the SDK request and browser fetch received bounded timeouts.

## Missing Timeout Handling

Without a model or browser timeout, a stalled upstream request left the Analyzing page waiting indefinitely. The server now uses a 120-second HTTP timeout and the browser aborts after 125 seconds.

## `companyName: null` Validation

Gemini could return `null` when no company was named, while the server initially accepted only strings. The Zod schema now accepts nullable values and the server omits null company names in its API response.

## URL Mode Validation

URL mode originally used the manual description validation, so a valid URL could leave Analyze Match disabled. Validation now uses the active mode while preserving the 35-word requirement for manual descriptions.

## Public Hostname Classified as Private

The SSRF helper initially treated every non-IP hostname as private before DNS lookup. A legitimate Microsoft Careers hostname was rejected. Hostnames now proceed to DNS resolution, and the resolved destination IPs are validated instead.

## Job URL Extraction

Passing an entire URL directly to Gemini was not enough to reliably isolate job content. The server now fetches public HTML, removes common page chrome and executable content, filters readable job-related lines, enforces limits, and passes cleaned text to the unchanged analysis call.

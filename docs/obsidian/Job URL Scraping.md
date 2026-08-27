# Job URL Scraping

URL mode uses the existing `jobDescription` request field to carry the URL. The server detects an `http://` or `https://` value before the Gemini call.

## Fetching

`fetchJobDescription()`:

- Resolves and validates the hostname before every request.
- Uses native `fetch` with JavaScript execution disabled by design.
- Requests HTML or XHTML content only.
- Uses a 10-second request timeout.
- Follows redirects manually, with a maximum of three redirects.
- Revalidates every redirect destination for SSRF safety.
- Rejects non-2xx responses and non-HTML content.
- Limits the response body to 2 MB, including streamed-body enforcement.

## Cleaning

`extractReadableText()`:

1. Prefers the first `<main>` or `<article>` region when present.
2. Removes comments, scripts, styles, noscript blocks, SVGs, navigation, headers, footers, sidebars, forms, and iframes.
3. Converts common block elements to line boundaries.
4. Removes remaining HTML tags.
5. Decodes common HTML entities.
6. Keeps lines likely to contain job information, such as responsibilities, qualifications, requirements, skills, experience, education, salary, location, and application details.
7. Truncates the cleaned text to 50,000 characters.

Pages with too little readable content, failed requests, oversized responses, unsafe destinations, or unsupported content return a clear error and are not sent to Gemini.

This is static HTML extraction. It does not run page JavaScript, scrape authenticated pages, bypass anti-bot systems, or use a private job-board API.

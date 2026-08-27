# Security

## API Key

The Gemini key is read only on the server from `GEMINI_API_KEY`. It is not included in frontend code or browser requests.

## Request Validation

Zod validates the incoming image base64 value, allowed image MIME types, and job-description field length. Gemini's response is also validated before it is returned.

## SSRF Protection

URL fetching is server-side, so an attacker could otherwise submit a URL targeting services reachable from the server. `assertPublicUrl()` protects the fetch path by:

- Allowing only `http:` and `https:` URLs.
- Rejecting localhost and direct non-public IP literals.
- Resolving hostnames with DNS before connecting.
- Rejecting resolved loopback, RFC1918 private, link-local, shared-address, documentation, reserved, multicast, and other non-public IPv4/IPv6 destinations.
- Checking every redirect destination again.

## Resource Limits

- Job-page fetch timeout: 10 seconds
- Maximum redirects: 3
- Maximum HTML response: 2 MB
- Gemini HTTP timeout: 120 seconds
- Frontend request abort timeout: 125 seconds
- Extracted text limit: 50,000 characters

The scraper does not execute JavaScript and does not bypass authentication or anti-bot controls. Manual job descriptions do not invoke the URL-fetching path.

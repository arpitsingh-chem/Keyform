# Security and Privacy Plan

## MVP defaults
- No account, no personal data collection, no third-party analytics by default.
- User progress stays in browser storage; disclose that it may be lost if browser data is cleared.
- Treat user text as untrusted; render as text, never inject HTML.
- Validate question data at build time and at runtime boundaries.
- Keep dependencies limited, pinned in lockfile and update deliberately.

## Optional cloud requirements
- Explicit opt-in, clear privacy notice and data deletion/export path.
- Enforce authentication and per-user row-level authorization in database policies.
- Do not rely on client-side scoring for trusted shared rankings.
- No service-role or admin secrets in JavaScript, repository, logs or public build.
- Rate-limit and validate writes; define retention and incident response.
- Review third-party processor terms, data location, quotas and account deletion.

## Release checks
Dependency audit, secret scan, XSS review, authorization tests, production asset inspection, HTTPS verification and error-path tests. Follow applicable OWASP guidance; do not claim formal security certification from these checks.

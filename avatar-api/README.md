# avatar-api

Backend for the portfolio AI avatar — a grounded conversational agent that answers questions about Sreenivas Gurram and can navigate the site.

Frontend lives in `../sreenivas-portfolio/`. This is a monorepo on purpose: both halves are public, and the API contract changes on both sides in a single commit.

## Status

Not implemented. This directory currently holds decisions only.

## Decided

| | |
|---|---|
| Model | Gemini 3.5 Flash-Lite (confirmed available on Vertex AI) |
| Provider surface | **Vertex AI**, not the AI Studio Gemini API |
| Auth | Service-account identity — **no API key anywhere in this repo** |
| Runtime | Cloud Run |
| GCP project | Its own project, on Blaze. Deliberately *not* `sreenivas-portfolio`, which stays on Spark with no billing account attached so the live site cannot incur charges. |
| Language | Python |

**Why Vertex over AI Studio:** the AI Studio free tier states "Content used to improve our products: Yes" — every visitor conversation would feed Google's product improvement, which is not acceptable for a public site where recruiters type identifying information. Vertex doesn't, authenticates via IAM rather than a long-lived key, and bills through the existing GCP billing account. Cost is negligible either way (~$1–2/month at realistic traffic), so there is no reason to accept the free tier's data terms.

## Open — design before writing code

- **Abuse protection.** This is the real risk, not legitimate traffic. A public unauthenticated LLM endpoint is someone else's free compute. Needs at minimum: per-IP and per-session rate limiting, a hard token cap per message, a max conversation length, and a max messages per session.
- **Budget alerts.** GCP budgets are notification-only — they do not cap spend. Decide whether a hard kill switch (budget → Pub/Sub → disable billing) is warranted, or whether a spend-cap budget covers it.
- **Grounding.** The corpus is `../sreenivas-portfolio/src/data/*.js` (experience, projects, skills) plus `../Resume.tex`. Decide whether to read it directly, generate a build artifact, or embed it. **Non-negotiable requirement: the agent must refuse rather than invent.** A fabricated job or credential is worse than no avatar at all — a recruiter who catches one invented claim is the whole downside of this project.
- **Site navigation.** Tool-calling that lets the agent scroll to a section or open a project. Needs a tool surface the frontend can execute.
- **Streaming.** Non-negotiable for perceived latency.
- **Context caching.** The grounding corpus is a fixed prefix on every request — the single largest cost lever.
- **CORS / origin allowlist.** Served from `sreenivasgurram.com`; lock it down.

## Intended structure

Provisional, pending the design pass:

```
avatar-api/
├── app/
│   ├── main.py          # FastAPI app, routes
│   ├── agent.py         # Vertex client, tool definitions, agent loop
│   ├── grounding.py     # corpus loading and retrieval
│   └── limits.py        # rate limiting, token and turn caps
├── tests/
├── requirements.txt
└── Dockerfile           # Cloud Run
```

Dependencies are deliberately unpinned until the design is settled.

## Local development

To be written once there is something to run.

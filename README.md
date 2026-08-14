# sreenivasgurram.com

Personal site of **Sreenivas Gurram** — AI/ML engineer, Bangalore. Live at **[sreenivasgurram.com](https://sreenivasgurram.com)**.

Also home to **Tuk**, an avatar that lives on the page: a small robot with a screen for a face who wanders, builds, and — eventually — will talk to you about the work.

## Layout

A monorepo with two deployable halves.

| Path | What | Runs on |
|---|---|---|
| `sreenivas-portfolio/` | React frontend | Firebase Hosting |
| `avatar-api/` | Conversational agent backend — not yet implemented | Cloud Run + Vertex AI |

Read `CLAUDE.md` for the working notes and `docs/avatar-spec.md` for the character's design rationale.

## Tuk

A boxy robot with an oversized screen face, two detached floating hands, and no arms. Chosen from ten candidates because a screen face turns emotion into a swapped glyph rather than a rigged jaw, and floating hands turn a gesture into two coordinates rather than an inverse-kinematics problem. He hops rather than walks.

Expression is composed on three orthogonal axes — 12 faces × 9 hand poses × 6 head motions — which is 576 readings from 26 definitions. His locomotion reads the page's real DOM: elements tagged `data-avatar-platform` become surfaces he can stand on, so he's hopping across actual cards rather than a painted floor.

There's a physics bench at `/avatar-lab`. It's unlinked and disallowed in `robots.txt`.

## Licensing — please read before copying

This repository is **public to read, not to reuse.** Public on GitHub is not the same as open source.

| | |
|---|---|
| **Source code** | [PolyForm Strict 1.0.0](https://polyformproject.org/licenses/strict/1.0.0) — see [`LICENSE`](LICENSE) |
| **Character, story, art, world data** | CC BY-NC-ND 4.0 — see [`LICENSE-CONTENT`](LICENSE-CONTENT) |

**You may** read the code, learn from it, and use it for noncommercial personal study.

**You may not** redistribute it, modify it, build derivative works from it, use it commercially, or use the Tuk character, name, or story in your own project.

Making this repository public grants you the right to view and fork it on GitHub under GitHub's Terms of Service. It grants nothing beyond that.

If you want to do something the licenses don't allow — including collaborating on it — **just ask**: [me@sreenivasgurram.com](mailto:me@sreenivasgurram.com). The answer is often yes.

## Contact

**[me@sreenivasgurram.com](mailto:me@sreenivasgurram.com)** · [LinkedIn](https://www.linkedin.com/in/sreenivas-gurram-363528289/) · [GitHub](https://github.com/LSG-hub)

# Avatar spec — Tuk

The portfolio's AI avatar. A small robot that lives on the page, hops between cards, and fronts the conversational agent.

Spans both halves of the monorepo: the character is `sreenivas-portfolio/src/components/avatar/`, and the scene vocabulary below is the contract the `avatar-api` backend drives.

---

## Character

**Tuk** — boxy body, two stub legs, an antenna, a **screen for a face**, and **two detached floating hands**. No arms.

Chosen from ten candidates. Reasons, in order of weight:

1. **The screen face is the cheapest expressiveness available.** Emotion is a swapped glyph, not a rigged jaw. Twelve faces cost 3–6 SVG primitives each and zero rigging, and the set naturally covers states a chat agent actually needs — thinking dots, listening bars, a working spinner, an error face.
2. **Floating hands delete the rigging problem.** A gesture is two coordinates. No shoulder, no elbow, no inverse kinematics. Props (a sword, a pointer, a lantern) nest inside the hand group and inherit its transform for free.
3. **Both survive the scale test.** On the real page he renders around 40–64px. Two solid circles stay legible; a 2px arm stroke becomes a grey smudge.

Rejected alternatives and why: noodle arms look best at full size but vanish when small; jointed pincers grip most convincingly but need IK; stub arms can't reach far enough to gesture.

### He hops, he does not walk

Stub legs plus detached hands make a gait look wrong. Hopping is cuter, dramatically cheaper, and delivers **squash-and-stretch** — which is Kindchenschema feature 06, *soft-elastic surface*, the one cuteness feature you get from motion rather than drawing. Proportions and cheapest animation happen to agree.

### Why it looks cute, concretely

Per Lorenz's *Kindchenschema* and the studies that followed, **large eyes and rounded body shapes** do most of the work. Tuk's screen is oversized relative to his torso and his glyph eyes are large and set low. If the character is ever redrawn, keep those two properties and the rest is negotiable.

---

## ⚠️ The layer rule

**Position transitions. Local motion animates. They never share an element.**

A CSS animation overrides a presentation attribute. A hand carrying both `transform: translate()` for position and `transform: rotate()` for a wave loses its position entirely and pivots around the SVG origin — the top-left corner of the viewBox. This was a real bug during design; the fix is structural, not a tweak.

```
.tuk-hand-pos    outer — position, CSS transition only.  NEVER animate this.
  .tuk-hand-spin inner — local motion, CSS animation only. NEVER transition this.
```

Every prop, limb, or accessory added later follows the same split.

---

## Three orthogonal axes

Expression is composed, not enumerated. 12 × 8 × 6 = **576 readings from 26 definitions**; adding one face adds 48 readings.

| Axis | Count | Values |
|---|---|---|
| **Face** | 12 | neutral, happy, wink, surprise, heart, determined, sad, sleepy, thinking, listening, loading, error |
| **Hands** | 9 | rest, wave, point, thumbs, shrug, chin, cheer, reach, sword |
| **Head** | 6 | still, nod, shake, tilt, lean, perk |

Head motion is not decoration — **nod and shake do something no face can: they answer.** `shake` + `sad` + `shrug` reads unmistakably as "I genuinely don't know," which given how hard the agent leans on refusing rather than inventing is the most important thing this character has to communicate well.

---

## Scene vocabulary — the backend contract

The agent triggers **semantic states**, never individual axes. `setState('thinking')`, not `setFace()` + `setHands()`. The frontend owns the mapping, so the model never needs to know what a head motion is — and the mapping can be re-tuned without touching the backend.

| Scene | When the agent uses it |
|---|---|
| `idle` | nothing happening |
| `greeting` | first contact |
| `listening` | user is typing |
| `thinking` | request sent, awaiting first token |
| `answering` | streaming a response |
| `working` | running a tool |
| `navigating` | scrolling the user to a section |
| `unsure` | **refusing rather than inventing** |
| `delighted` | user reacted well |
| `error` | request failed |
| `asleep` | long inactivity |

Defined in `src/components/avatar/expressions.js` as `SCENES`. Keep that file the single source of truth — the backend's tool definitions should be generated from or validated against it.

### Priority rule

**Directed interrupts ambient; ambient resumes when the scene clears.** Ambient behaviour (hopping, noticing the cursor, idling) runs autonomously and is what keeps the character alive between messages. A scene from the agent overrides it. Build only ambient and it's a toy; build only directed and it's dead between turns.

---

## Locomotion

`useAvatarLife` derives the world from the real DOM: every element tagged `data-avatar-platform` contributes its **top edge** as a standable surface. The character stands on actual cards, not a painted floor — that's the whole Animator-vs-Animation trick.

- **The loop never touches React state.** Position and squash are written straight to the node's `transform`; only `phase` and `noticing` (which change rarely) go through `setState`. A 60fps `setState` re-renders the subtree every frame.
- Platforms are re-measured twice a second and on resize — layout shifts, fonts swap, images load.
- `prefers-reduced-motion` freezes him into a static pose with no rAF loop at all.
- The character layer is `pointer-events: none`. **Non-negotiable** — the instant it can eat a click on the Contact link it costs more than it earns.

Tune it at **`/avatar-lab`** — same rect-harvesting and same glass cards as the real page, without scrolling past the hero on every reload. Unlinked, and `Disallow`ed in `robots.txt`.

---

## Open

- **Pathfinding.** He picks a direction and hops; landing is opportunistic and falling out of the world respawns him. `navigating` needs real targeting, not luck.
- **Coordinate space.** Container-relative today. The real page needs document coordinates plus a viewport-sticky mode, so he can either ride the page or stay visible in a corner. Decide before mounting on `HomePage`.
- **Hiding and peeking.** The z-index tricks that let him duck behind the navbar pill aren't built.
- **Mobile.** No cursor, so `noticing` never fires. Taps need to become pokes, and he probably shrinks below a breakpoint.
- **Dismiss control.** A recruiter who finds him distracting must be able to kill him in one click rather than leaving. Not built.
- **Attention budget.** A recruiter gives the page 30–90 seconds. The character has to be delightful *and ignorable* — if it competes with "what did he build," it costs more than it wins.

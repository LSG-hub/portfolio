# Tuk's World — design spec

The ambient half of the avatar. A single global world that every visitor watches simultaneously, running on real time, in which an immortal robot builds a civilisation, outlives it, and starts again.

Read `docs/avatar-spec.md` first for the character itself. This document covers the world he lives in.

**Status: specification. Nothing here is implemented.**

---

## 1 · Thesis

> Tuk cannot die. Everything he builds and everyone he loves does.

Every mechanic below either expresses that or is decoration. The test for any new feature is: *does this make the immortality felt?*

The structural consequence, and it's deliberately unusual: **Tuk never progresses. The world does.** No skill tree, no upgrades, no levelling. His hands in era seven are the hands from era one. What changes is what surrounds him — and what surrounds him always ends. This inverts the normal idle-game shape where the player character grows; here the character is the fixed point that everything else moves past.

---

## 2 · Non-negotiable constraints

Violating any of these is a rewrite, not a fix.

**2.1 · The simulation is deterministic.** No `Math.random()` anywhere in sim code. Every stochastic choice draws from a seeded PRNG threaded through state. No `Date.now()` inside the sim — time enters as a parameter. This is what makes a global world possible without a server, and it cannot be retrofitted.

**2.2 · The simulation is pure and has no idea it's in a browser.**

```
tick(state, dtSeconds) → state          // no DOM, no canvas, no React
render(ctx, state, camera)              // reads state, draws nothing back
```

The save file *is* the state object. The sim is testable in Node. The renderer is replaceable.

**2.3 · The world exists in world coordinates; views are cameras.**

```
state → camera { x, y, width, height, zoom } → render
```

The ribbon, the expanded overlay, and `/tuk` are **three camera configurations on one world**, not three implementations. This is also the seam if 3D ever happens.

**2.4 · Content lives in data, not code.** Eras, structures, costs, actions, dialogue, name pools — all JSON tables the sim reads. Adding an era must be a table entry. Content will outweigh code roughly four to one, and it has to be pourable without touching the loop.

**2.5 · It pauses when unseen.** `visibilitychange` for tab switches, `IntersectionObserver` for the ribbon scrolled out of view. A simulation people leave running for an hour must not cook a phone. (Note: pausing *rendering* only — world time still advances, because the world is a function of the wall clock. See §3.)

**2.6 · `prefers-reduced-motion` renders a static scene**, not a frozen game — the world as it currently stands, no animation.

**2.7 · The ribbon never causes layout shift and is dismissible in one click.** A recruiter who doesn't care about games must be able to remove it.

---

## 3 · Time

### 3.1 · The world runs on the real clock

State is a pure function of a seed and elapsed real time since the world's epoch:

```
worldAt(seed, elapsedSeconds) → state
```

Nobody interacts with the world — they only watch — so there is no input to reconcile and nothing to store. Every visitor computes the same world from the same seed and the same clock. **Global costs nothing: no database, no server process, no per-user state.**

Time comes from the server, not the visitor's machine — clock skew and people changing their system time would otherwise desync the shared world. One tiny endpoint returning a timestamp, or a `Date` header from a request already being made.

### 3.2 · Two clocks, deliberately incoherent

**The day clock is cosmetic.** One world day ≈ **8 minutes** of real time. Sun and moon arc, dusk, night, dawn. Pleasant ambient rhythm.

**Everything else is measured in real time.** Era durations, NPC lifespans, and build times are defined in real hours — *not* in world days.

These two do not reconcile, and that's intentional. Making the calendar coherent would force either absurd day counts or a day/night cycle too slow to watch. Nobody counts sunrises. Documented so a future contributor doesn't "fix" it.

### 3.3 · Action density is the pacing rule

**Something visible must complete every 10–25 seconds.** A visitor who stays two minutes has to see four or five things happen. Classic idle-game "wait for the meter to fill" would mean a short visit shows nothing, which defeats the entire premise.

Macro progression is slow; micro activity is constant. Watching a farmer farm repeatedly is fine — that's the genre. The *change* is what's authored, and change is bounded.

### 3.4 · Day/night rendering differs per view

Per the owner's call:

| View | Behaviour |
|---|---|
| **Ribbon** on portfolio pages | Sun and moon cross the sky *inside the canvas*. World light shifts — shadows lengthen, parallax layers warm and cool, windows light at night. **The page theme stays cream.** Day/night lives in the world, not the site. |
| **`/tuk`** | Full commitment. Page background follows world time. Night is genuinely dark, cool palette, stars, lit windows. |

### 3.5 · The arc: 30 days, then collapse

| Era | Duration | Cumulative |
|---|---|---|
| 1 · Arrival | 6h | 6h |
| 2 · Stone | 24h | 30h |
| 3 · Settlement | 72h | ~4 days |
| 4 · Village | 144h | ~10 days |
| 5 · Kingdom | 168h | ~17 days |
| 6 · Industry | 168h | ~24 days |
| 7 · Futuristic | 120h | ~29 days |
| Collapse + rebuild | ~18h | 30 days |

Early eras are short so visible change comes fast; late eras are long because they have the most content. A monthly cycle is a rhythm people learn.

**The collapse is scheduled and therefore predictable.** That is a feature, not a spoiler: *"the Fall is Sunday"* is an event people show up for, and there's a new world on Monday.

### 3.6 · Development time controls

**Development builds only.** Gate on `process.env.NODE_ENV === 'development'`, which CRA replaces at build time — so production bundles cannot contain the controls at all. This is a compile-time guarantee, not a runtime check.

Because state is a pure function of elapsed time, all of the following are free:

| Control | Implementation |
|---|---|
| Speed ×1 / ×2 / ×5 / ×10 / ×100 | multiply `elapsed` |
| Jump to day N / era N | set `elapsed` |
| Scrub timeline | set `elapsed` continuously |
| Pause / step | freeze / increment `elapsed` |
| Reseed | change `seed` |

A dev overlay on `/avatar-lab` exposes these. Deployed builds follow the real clock with no override — including no URL parameter, so a shared link can't desync someone's view of the global world.

### 3.7 · Catch-up cost

Simulating 30 days from the epoch on every page load may be fine — at one action per 15s that's ~173,000 ticks of a small state update, plausibly tens of milliseconds. **Measure before optimising.**

If it isn't fine: precompute **checkpoint snapshots** every 4 real hours, ship them as static JSON on Firebase Hosting (CDN-cached, effectively free), and simulate forward from the nearest one — at most 4 hours, ~960 actions. No server process either way.

---

## 4 · State shape

```jsonc
{
  "version": 1,              // bump on every schema change or saves corrupt
  "seed": "tuk-genesis-01",
  "epoch": 1767225600,       // unix seconds; world t=0
  "elapsed": 431982,         // seconds since epoch
  "cycle": 1,                // increments after each collapse
  "era": 4,
  "rng": 2463534242,         // PRNG cursor — part of state, never global

  "resources": { "wood": 210, "stone": 96, "ore": 12, "food": 74, "knowledge": 31 },

  "tuk": {
    "x": 1240, "y": 0,
    "action": { "type": "mine", "startedAt": 431960, "duration": 18, "target": "vein-3" },
    "buried": 47             // cumulative across ALL cycles. Never resets.
  },

  "structures": [
    { "id": "hut-1", "type": "hut", "x": 900, "builtAt": 4210, "state": "standing" },
    { "id": "keep-1", "type": "keep", "x": 1500, "builtAt": 380000, "state": "building", "progress": 0.4 }
  ],

  "npcs": [
    { "id": "n-12", "name": "Mira", "role": "mason", "bornAt": 210400,
      "lifespan": 262000, "x": 1010, "action": "build" }
  ],

  "graves": [
    { "id": "g-1", "name": "Wanderer", "bornAt": null, "diedAt": 96400,
      "cycle": 1, "role": "the first", "x": 860, "epitaph": "came from the east" }
  ],

  "ruins": [ { "type": "keep", "x": 1500, "cycle": 1 } ],   // survives collapse

  "chronicle": [
    { "at": 96400, "text": "The wanderer died. Tuk buried him by the elm." }
  ]
}
```

**What survives a collapse:** `graves`, `ruins`, `knowledge`, `tuk.buried`, `chronicle`, and `cycle`. Everything else resets. **Memory persists; materials don't.** That is the design decision that makes rebuilding meaningful rather than a reset.

---

## 5 · Eras

Each era needs new terrain, new architecture, a new activity, and an emotional beat. **The beats are the point; the buildings are the delivery mechanism.**

### 1 · Arrival — 6h
Bare ground, no people. He wakes and learns to gather.
**Beat:** curiosity, and a solitude he doesn't yet know is permanent.

### 2 · Stone — 24h
First shelter, first fire. A human wanderer arrives from the east and stays.
**Beat:** the first friendship.

### 3 · Settlement — 72h
Huts, a tilled field, the first domesticated animals. The wanderer has a family. Then **the wanderer dies old, and Tuk buries him.** The first grave.
**Beat:** the thesis stops being a tagline. Everything after is coloured by it.

### 4 · Village — 144h
Masonry, a well, a smithy. Mining expeditions into the mountain. Several families, multiple generations.
**Beat:** nobody alive remembers the wanderer except Tuk.

### 5 · Kingdom — 168h
Walls, a keep, a market, a crown. Someone declares themselves king and summons the old machine to serve.
**Beat:** he is a relic to people whose grandparents he taught to farm.

### 6 · Industry — 168h
Rails, smoke, machines. The forest recedes visibly.
**Beat:** they finally build things that outlast people — but not him.

### 7 · Futuristic — 120h
Spires, and **other robots**. Who break down.
**Beat:** he meets his own kind and outlives them too. The cruelest note available; spend it here.

### Collapse — ~18h
**Self-inflicted.** After an industrial and technological era, a meteor is arbitrary; a collapse the civilisation caused is thematically inevitable. It converts the reset from a mechanic into the thesis: *they always destroy themselves, he always rebuilds.*

Cycle 2 begins with ruins in the terrain, a deeper graveyard, and accumulated `knowledge` — so it moves faster and starts further along. **Replay variety at almost no content cost.**

---

## 6 · Resources

**wood · stone · ore · food · knowledge**

Five. Enough for a real cost curve, few enough to read at a glance; more turns the ribbon into a spreadsheet.

**`knowledge` is special** — the only resource that survives a collapse. It's why cycle 2 is faster.

---

## 7 · Actions

`gather` · `mine` · `hunt` · `farm` · `build` · `repair` · `bury` · `rest`

Each is an animation, a duration (10–25s), and a resource delta. Data-driven per era, so `gather` in the Stone era and `gather` in the Industry era look different and yield differently.

- **`mine`** requires physically travelling to the mountain. That trip is what makes the parallax world feel like a place rather than a backdrop.
- **`bury`** is not about efficiency and should be the slowest action in the game.

---

## 8 · NPCs, death, and the graveyard

Each villager has a **name, birth, lifespan, role, and relationship to Tuk**. They perform actions too, so the village visibly works rather than merely existing.

At ~12px you cannot show ageing, so don't try. They're present, then they're gone, and a stone appears.

**The graveyard is the emotional ledger of the entire game, and it is cheap — it's a list.** On `/tuk`, hovering a stone shows who they were, when they lived, what they did, and what Tuk remembers about them. This single feature will do more work than any building.

`tuk.buried` accumulates across every cycle and never resets. When it reads 211, the premise is doing its own arguing.

---

## 9 · Dialogue

State-driven templates, not a static pool. Keyed to what he's doing and what just happened.

| Source | Example |
|---|---|
| Current action | "Mining. The vein runs deep here." |
| Recent event | "Mira died this morning. Her grandson doesn't know my name." |
| Era awareness | "They call me ancient now. I remember when this was forest." |
| Milestone | "Fourth palace. This one has better foundations." |
| Cycle memory | "I have buried two hundred and eleven people." |

The last kind is where the premise pays off, and it's free — the sim already knows the number.

Selection uses a shuffle bag per category (see `dialogue.js`) so nothing repeats before the pool is exhausted. **This is where most of the content volume lives**, it's cheap to author, and it's the highest-impact content in the design.

---

## 10 · The chronicle

A generated history log, produced as a side effect of the sim running:

```
Day 3    A wanderer arrived from the east.
Day 40   Mira was born.
Day 61   The well was finished.
Day 88   Mira died. Tuk buried her by the elm.
```

Zero authoring cost, enormous depth-feeling, the first thing a returning visitor reads — and **ready-made content for the channel.**

It also solves the mid-story-context problem completely. An arrival card gives instant orientation:

> **Day 214 · The Kingdom Era**
> Tuk has buried 47 people. The palace is unfinished.

Generated, not authored. Arriving mid-story is *better* than day zero — a world with visible history is more interesting than an empty field.

---

## 11 · Views

| View | Camera | Where |
|---|---|---|
| **Ribbon** | ~140px tall, follows Tuk, 3 parallax layers | fixed bottom strip, all portfolio pages |
| **Expanded** | ~60vh overlay, more sky and mountain | click the ribbon |
| **World page** | full viewport, plus chronicle and graveyard | `/tuk` |

**Scale, not space.** A 140px strip contains a mountain range because the mountains are *far away* — parallax depth, not vertical real estate:

```
far    ▁▂▃▂▁  mountain silhouettes   ~40px   drift 0.1×
mid    ▁▃▄▃▁  hills and forest       ~70px   drift 0.4×
ground ▔▔▔▔▔  terrain, props, Tuk    full    drift 1.0×
```

A palace at that scale is ~70px and reads as monumental because the villagers are 12px. Scale is relative — a consistent diorama, not real height.

---

## 12 · Content inventory

Code is roughly 20% of this project. The rest, and it's the honest bottleneck:

| Item | Estimate |
|---|---|
| Structure silhouettes | ~8 per era × 7 = **~56** |
| Action animations | ~30 variants |
| Terrain / parallax sets | 7 (one per era) |
| Dialogue lines | **300–500** |
| NPC name pools + roles | ~200 names, ~15 roles |
| Chronicle event templates | ~40 |
| Cost curve tuning | ongoing |

Which is why §2.4 exists. Adding an era must be authoring a table, not writing code.

---

## 13 · Open

- **Cost curve.** Untuned. The rule is that nothing may ever feel like waiting.
- **Mobile.** Ribbon height, whether the expanded view exists at all, touch instead of hover for graves.
- **Sound.** Almost certainly off by default. Probably not v1.
- **Other robots in era 7.** How many, and do they get names and graves? (If they get graves, that's the strongest single beat in the game.)
- **Animals.** Wild in early eras, domesticated later. Do they die and get remembered? Probably not — dilutes the graveyard.
- **The dynamic/agent mode.** Deliberately deferred until ambient is done. When it arrives, Tuk leaves the world to act on the page and returns; the world pauses rather than continuing without him, because he is not two places at once.

---

## 14 · Build order

1. **Deterministic sim core** — `tick`, seeded PRNG, state shape, `worldAt`. Node-testable, no rendering.
2. **Dev time controls** — speed, scrub, jump, reseed on `/avatar-lab`. Build these *second*, because everything after is unobservable without them.
3. **Camera + parallax renderer** — canvas, three layers, Tuk composited as the existing SVG.
4. **Eras 1–3 only**, data-driven, through the first death. That beat is the proof the design works.
5. **The ribbon** — fixed, collapsible, pause-when-unseen.
6. **Chronicle + graveyard**, then `/tuk`.
7. **Pour in eras 4–7.**

Stop after 4 and evaluate honestly. If the wanderer's death doesn't land, no amount of era seven fixes it.

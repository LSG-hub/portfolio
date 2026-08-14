/**
 * Tuk's ambient dialogue.
 *
 * Short lines only — the bubble is small and a visitor reads it in passing.
 * Eventually the agent drives the same bubble with real responses; these are
 * the idle-time lines that keep him alive between conversations.
 */

export const GREETINGS = [
  'Hello, visitor!',
  'Oh, hi there.',
  'You found me.',
  'I live down here.',
  'Company. Finally.',
  'Mind the furniture.',
  'Need a tour?',
  'Ask me about Juno.',
  'Sreenivas built me.',
  'I know all his projects.',
  'Hi again.',
  'Nice cursor.',
  'Stay as long as you like.',
  'Do not mind the mess.',
  // Two of these exist to hint that the hovercraft is there at all: nothing else
  // on the page tells a visitor that lingering does anything.
  'Come a little closer.',
  'Hold still a moment.'
];

/**
 * Aboard the hovercraft.
 *
 * The chase lines are the only place a shuffle bag is right for non-greeting
 * dialogue: the visitor is driving, so the lines are reactions and randomness
 * reads as spontaneity rather than sloppiness.
 *
 * Catching the cursor is the END of a flight, so `caught` plays once, on the spot,
 * while he celebrates. Move the pointer and he never gets there.
 */
export const FLIGHT_LINES = {
  chase: [
    'Hold still.',
    'Nearly.',
    'You are quick.',
    'Come back here.',
    'Almost had it.',
    'This is my favourite part.',
    'Left a bit.',
    'Faster than you look.'
  ],
  caught: ['Got it.', 'Caught you.', 'Ha. Mine.', 'Gotcha.']
};

/**
 * What he says, keyed to the ACTION he is performing.
 *
 * Per action, not per room. Keying it to the furniture meant one set played
 * across a whole visit, so "Fully charged" could land while he was already
 * asleep on the pad, and there was nothing to say about the kettle as distinct
 * from the mug he was holding. The line has to belong to the moment.
 *
 * SILENCE IS CONTENT. Beats missing from this table say nothing, and that is
 * deliberate for every one of them: he does not talk with a full mug, he does
 * not narrate what is on the television, and he does not chat in his sleep.
 * Those quiet stretches are what make the talking ones read as thoughts rather
 * than a ticker.
 *
 * Sets, not a shuffle bag. A bag is right for greetings, where the visitor
 * triggers each line and randomness reads as spontaneity. Here the lines are a
 * small scene, so order matters: "Mostly." only lands after "Mostly they
 * behave." Each visit to an action plays the next set and wraps, so a second
 * cycle through his day is not a rerun.
 *
 * House style: NO em-dashes. Full stops and short sentences carry his cadence
 * better anyway, given he is a robot reading his own lines off a screen.
 */
export const ACTION_LINES = {
  // ── waking on the charging pad ──
  wake:  [['Morning.', 'I think.'], ['Oh. Already.']],
  rise:  [['Fully charged.', 'Good as new. Well. Good as old.'], ['All systems nominal.', 'Whatever that means.']],
  ready: [['Right. Where was I.'], ['Day one hundred and nine.', 'Of what, I could not say.']],

  // ── kitchen. Fewer words with his hands full, not none. ──
  boil:  [["Kettle's on.", 'I do not drink tea.', 'I like the sound it makes.'],
          ['Third brew today.', 'Nobody is counting.', 'Except me.']],
  pour:  [['Careful. Hot.'], ['There we go.']],
  sip:   [['Warm.'], ['That is the good part.']],

  // ── the plant ──
  water: [['You are doing well, little one.', 'You are not my first plant.'],
          ['Steady on. Not too much.', 'I drowned the last one.']],
  gaze:  [['The light lands here at this hour.', 'It still gets me.'],
          ['Someone is out there.', 'There usually is.']],
  tidy:  [['That is better.'], ['Dust. Always dust.']],

  // ── the desk ──
  type:  [['He builds agents. I read the logs.', 'Mostly they behave.', 'Mostly.'],
          ['Two hundred lines to review.', 'I have the time.']],
  think: [['Hmm.'], ['There is a cleaner way to do this.']],
  book:  [['This chapter is about mortality.', 'Research, you understand.'],
          ['Page four hundred.', 'It gets no easier.']],
  type2: [['Right. Ship it.'], ['Fixed. Probably.']],

  // ── housework ──
  sweep: [['Nobody sees the floor.', 'I see the floor.'],
          ['Two hundred years of sweeping.', 'Still satisfying.']],

  // ── the sofa. Reactions only: he watches it, he does not describe it. ──
  tv:    [['Oh.', 'Of course he does.'], ['Hm.', 'Bold choice.']],
  laugh: [['Ha.'], ['Every time.']],

  // ── turning in ──
  yawn:  [['Powering down.'], ['See you next loop.', 'There is always a next loop.']]
};

/**
 * A third tier, drawn occasionally instead of the rotating set.
 *
 * This is where the story lives. Tuk's premise is that he is the one who does not
 * die, and a line about that lands once and haunts; the same line on every visit
 * to the kettle is wallpaper. Rare means a visitor who stays two minutes may never
 * see one and someone who stays twenty gets a handful, which is the right shape
 * for an easter egg.
 *
 * It also resolves the television: a glimpse of the civilisation he watches is
 * worth having, but only as something you catch, never as narration.
 *
 * `sleep` appears here with no entry in the table above, so he is silent 88% of
 * the time and talks in his sleep the rest.
 */
export const RARE_CHANCE = 0.12;

export const RARE_LINES = {
  boil:  ['I have boiled this kettle eleven thousand times.'],
  sip:   ['I cannot taste it.', 'I make it anyway.'],
  water: ['Everything in this room is temporary.', 'Except me.'],
  gaze:  ['One of them waved back once.'],
  type:  ['Nine projects planned.', 'He is not slowing down.'],
  sweep: ['Someone will live here after me.', 'They always do.'],
  tv:    ['That world again.', 'Stone tools, then towers.', 'Then it starts over.'],
  sleep: ['Still here.']
};

/**
 * What he says this time. Usually the next set in rotation; occasionally the rare
 * one. Math.random is fine here — this is dialogue, not the deterministic world
 * simulation, where an unseeded call would desync every visitor.
 */
export function linesForVisit(action, visit) {
  const rare = RARE_LINES[action];
  if (rare && Math.random() < RARE_CHANCE) return rare;
  const sets = ACTION_LINES[action];
  if (!sets || !sets.length) return [];
  return sets[visit % sets.length];
}

/**
 * Shuffle bag — draws without replacement, reshuffles when empty.
 *
 * Plain Math.random() repeats itself often enough to be noticeable, and a
 * character that says "Hi again" twice in a row reads as broken. A bag
 * guarantees you see every line before any line comes back.
 */
export function createShuffleBag(items) {
  let bag = [];

  const refill = () => {
    bag = items.slice();
    for (let i = bag.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [bag[i], bag[j]] = [bag[j], bag[i]];
    }
  };

  return {
    draw() {
      if (!bag.length) refill();
      return bag.pop();
    }
  };
}

export default GREETINGS;

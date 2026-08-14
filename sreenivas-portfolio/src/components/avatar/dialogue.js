/**
 * Tuk's ambient dialogue.
 *
 * Short lines only — the bubble is small and a visitor reads it in passing.
 * Eventually the agent drives the same bubble with real responses; these are
 * the idle-time lines that keep him alive between conversations.
 */

export const GREETINGS = [
  'Hello, visitor!',
  'Oh — hi there.',
  'You found me.',
  'Careful, I hop.',
  'Ask me about Juno.',
  'Sreenivas built me.',
  'Need a tour?',
  'Mind the gap.',
  'Hi again.',
  'Nice cursor.',
  'Recruiter? Keep scrolling.',
  'I know all his projects.',
  'Still hopping.',
  'That card looks climbable.',
  'Try clicking one.',
  'Long way down.'
];

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

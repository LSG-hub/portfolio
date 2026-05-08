import { useEffect, useRef, useState } from 'react';

export const useTypingEffect = (texts, options = {}) => {
  const { typingSpeed = 100, deletingSpeed = 50, pauseMs = 2000 } = options;
  const [text, setText] = useState('');

  const textsRef = useRef(texts);
  textsRef.current = texts;

  useEffect(() => {
    let cancelled = false;
    let timeoutId;
    let i = 0;
    let phase = 'typing';
    let current = '';

    const schedule = (delay) => {
      timeoutId = setTimeout(loop, delay);
    };

    const loop = () => {
      if (cancelled) return;
      const target = textsRef.current[i];

      if (phase === 'typing') {
        if (current.length < target.length) {
          current = target.slice(0, current.length + 1);
          setText(current);
          schedule(typingSpeed);
        } else {
          phase = 'deleting';
          schedule(pauseMs);
        }
      } else {
        if (current.length > 0) {
          current = current.slice(0, -1);
          setText(current);
          schedule(deletingSpeed);
        } else {
          i = (i + 1) % textsRef.current.length;
          phase = 'typing';
          schedule(typingSpeed);
        }
      }
    };

    schedule(typingSpeed);
    return () => {
      cancelled = true;
      clearTimeout(timeoutId);
    };
  }, [typingSpeed, deletingSpeed, pauseMs]);

  return text;
};

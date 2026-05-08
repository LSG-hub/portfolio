

import React from 'react';

const TOKEN_REGEX = /\*\*([^*]+?)\*\*|\*([^*]+?)\*/g;

export function richText(text) {
  if (!text) return text;
  const parts = [];
  let lastIndex = 0;
  let match;
  let key = 0;
  while ((match = TOKEN_REGEX.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }
    if (match[1] !== undefined) {
      parts.push(<strong key={`b-${key++}`}>{match[1]}</strong>);
    } else {
      parts.push(<em key={`i-${key++}`}>{match[2]}</em>);
    }
    lastIndex = TOKEN_REGEX.lastIndex;
  }
  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }
  TOKEN_REGEX.lastIndex = 0;
  return parts;
}

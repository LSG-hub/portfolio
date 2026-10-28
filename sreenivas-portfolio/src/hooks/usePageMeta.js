import { useEffect } from 'react';

/**
 * Keeps the tab title and meta description in step with in-app navigation.
 * A direct load already has the right ones baked into that page's prerendered
 * HTML; this only matters once React Router has moved between pages.
 */
export function usePageMeta({ title, description }) {
  useEffect(() => {
    document.title = title;
    const tag = document.querySelector('meta[name="description"]');
    if (tag && description) tag.setAttribute('content', description);
  }, [title, description]);
}

export default usePageMeta;

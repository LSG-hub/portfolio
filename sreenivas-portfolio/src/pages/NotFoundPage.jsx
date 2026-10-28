import React from 'react';
import { Link } from 'react-router-dom';
import { profile } from '../data/profile';
import { projectsData } from '../data/projects';
import { notFoundMeta } from '../utils/seo';
import usePageMeta from '../hooks/usePageMeta';
import '../styles/components/not-found.css';

/**
 * Any URL that isn't a page. Hosting now answers these with a real 404 status
 * (build/404.html) instead of the home page with a 200, so search engines stop
 * indexing typos and broken links surface instead of hiding.
 */
const NotFoundPage = () => {
  usePageMeta(notFoundMeta(profile));

  return (
    <div className="not-found">
      <div className="container-prose">
        <span className="eyebrow">404</span>
        <h1 className="not-found-title">Page not found</h1>
        <p className="not-found-lede">
          There is nothing at this address. It may have moved, or the link may be mistyped.
        </p>
        <ul className="not-found-links">
          <li><Link to="/">Back to the portfolio &rarr;</Link></li>
          {projectsData.map((p) => (
            <li key={p.slug}><Link to={`/projects/${p.slug}`}>{p.title}: {p.subtitle}</Link></li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default NotFoundPage;

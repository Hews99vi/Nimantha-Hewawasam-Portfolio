"use client";
export default function ContentError({ reset }: { reset: () => void }) {
  return <main id="content" className="container-shell page-intro"><h1>Content is unavailable.</h1><p>Please try again in a moment.</p><button type="button" className="button" onClick={reset}>Try again</button></main>;
}

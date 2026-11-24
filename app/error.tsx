"use client";
export default function ErrorPage({ reset }: { reset: () => void }) {
  return <main className="container-shell page-intro" id="content"><h1>Temporarily unavailable.</h1><p>Content could not be loaded. Please retry in a moment.</p><button className="button" type="button" onClick={reset}>Try again</button></main>;
}

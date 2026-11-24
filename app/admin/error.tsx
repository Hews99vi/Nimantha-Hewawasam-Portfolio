"use client";
export default function AdminError({ reset }: { reset: () => void }) {
  return <main className="p-8"><h1 className="text-2xl font-bold">Admin content could not be loaded</h1><p>No editable fallback content has been substituted. Please retry.</p><button className="button" type="button" onClick={reset}>Retry loading</button></main>;
}

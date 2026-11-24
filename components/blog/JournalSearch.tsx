import Form from "next/form";
import { Search } from "lucide-react";

export function JournalSearch({ query, topic }: { query: string; topic: string }) {
  return (
    <Form action="/blog#articles" className="journal-search" role="search">
      <label htmlFor="journal-search" className="sr-only">Search articles</label>
      <input id="journal-search" type="search" name="q" placeholder="Search the journal" defaultValue={query} maxLength={120} />
      {topic && <input type="hidden" name="topic" value={topic} />}
      <button type="submit" aria-label="Search articles"><Search size={20} aria-hidden="true" /></button>
    </Form>
  );
}

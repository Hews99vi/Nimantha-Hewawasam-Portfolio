import Link from "next/link";
export default function NotFound() {
  return (
    <main id="content" className="page-intro container-shell section-bottom">
      <h1>This page isn’t here.</h1>
      <p>The link may have changed, or this project is no longer public.</p>
      <Link className="text-action" href="/work">
        Explore the work
      </Link>
    </main>
  );
}

import Link from "next/link";

export default function NotFound() {
  return (
    <div className="notfound">
      <div className="notfound__wrap">
        <span className="notfound__num" aria-hidden="true">404</span>
        <h1 className="notfound__title">Page not found.</h1>
        <p className="notfound__sub">This URL doesn&rsquo;t exist on Parakletus Hub Nigeria.</p>
        <Link href="/" className="notfound__back">← Back to home</Link>
      </div>
    </div>
  );
}

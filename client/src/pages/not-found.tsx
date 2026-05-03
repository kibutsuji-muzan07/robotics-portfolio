import { Link } from "wouter";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center h-full py-24 text-center">
      <div className="text-5xl font-bold font-mono text-muted-foreground mb-4">404</div>
      <div className="text-sm text-muted-foreground mb-4">Page not found</div>
      <Link href="/">
        <a className="text-sm text-primary hover:underline">Back to overview</a>
      </Link>
    </div>
  );
}

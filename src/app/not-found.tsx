import Link from "next/link";
import Footer from "@/app/components/Footer";

export default function NotFound() {
  return (
    <main className="animate-fade mx-auto w-full max-w-2xl px-6 pt-14 md:pt-20 pb-16">
      <h1 className="font-serif text-4xl font-normal text-foreground">404</h1>
      <p className="mt-4 text-[15px] leading-[1.6] text-muted">
        It looks like you&apos;ve taken a wrong turn. This page doesn&apos;t
        exist.
      </p>
      <p className="mt-6 text-[15px] leading-[1.6]">
        <Link
          href="/"
          className="underline underline-offset-[3px] decoration-[1.5px] decoration-faint hover:decoration-current transition-colors"
        >
          Back home
        </Link>
      </p>
      <Footer />
    </main>
  );
}

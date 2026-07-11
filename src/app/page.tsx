import Link from "next/link";
import { getBlogPosts } from "@/lib/blog";
import { formatDate } from "@/lib/utils";
import { postsDirectory, projectsDirectory } from "@/lib/types";
import Footer from "@/app/components/Footer";
import CopyEmail from "@/app/components/home/CopyEmail";

export const dynamic = "force-static";

const linkClass =
  "text-accent underline underline-offset-[3px] decoration-[1.5px] decoration-faint hover:decoration-current transition-colors";

export default function Home() {
  // Writing and projects live together as "projects" (empty-title stubs hidden)
  const featuredProjects = [
    ...getBlogPosts(projectsDirectory),
    ...getBlogPosts(postsDirectory),
  ]
    .filter((p) => p.title)
    .sort((a, b) => (a.timestamp < b.timestamp ? 1 : -1))
    .slice(0, 3);

  return (
    <main className="animate-fade mx-auto w-full max-w-2xl px-6 pt-14 md:pt-20 pb-16">
      {/* Wordmark + tagline */}
      <header>
        <h1 className="font-serif text-4xl font-normal text-foreground">
          Tharun Kumar
        </h1>
        <p className="mt-3 text-[15px] leading-[1.6] text-foreground">
          Princeton University &apos;26
        </p>
        <p className="mt-4 text-[14px] leading-[1.6] text-muted">
          <a
            href="https://github.com/tharunkumartk"
            target="_blank"
            rel="noopener noreferrer"
            className={linkClass}
          >
            GitHub
          </a>
          {" · "}
          <a
            href="https://linkedin.com/in/tharuntk"
            target="_blank"
            rel="noopener noreferrer"
            className={linkClass}
          >
            LinkedIn
          </a>
          {" · "}
          <a
            href="https://instagram.com/tharunnn.kumar"
            target="_blank"
            rel="noopener noreferrer"
            className={linkClass}
          >
            Instagram
          </a>
          {" · "}
          <a
            href="https://x.com/tiruppali"
            target="_blank"
            rel="noopener noreferrer"
            className={linkClass}
          >
            X
          </a>
          {" · "}
          <a
            href="/resume.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className={linkClass}
          >
            Resume
          </a>
        </p>
      </header>

      {/* About */}
      <section className="mt-8">
        <div className="space-y-4 text-[15px] leading-[1.6] text-foreground">
          <p>
            I&apos;m a <strong className="font-medium">researcher and engineer</strong>{" "}
            interested in training large models to reason about the world. I
            graduated from{" "}
            <strong className="font-medium">Princeton University</strong> in
            2026, where I studied CS and math, and researched mech-interp, SSMs,
            and LLM pre-training under{" "}
            <a
              href="https://www.ehazan.com/"
              target="_blank"
              rel="noopener noreferrer"
              className={`font-medium ${linkClass}`}
            >
              Professor Elad Hazan
            </a>{" "}
            in the{" "}
            <a
              href="https://sites.google.com/view/gbrainprinceton/home"
              target="_blank"
              rel="noopener noreferrer"
              className={`font-medium ${linkClass}`}
            >
              Google DeepMind @ Princeton
            </a>{" "}
            lab.
          </p>
          <p>
            Previously, I worked on state-of-the-art AI agents for Fortune 500
            companies as a founding engineer at{" "}
            <a
              href="https://www.universalagi.com/"
              target="_blank"
              rel="noopener noreferrer"
              className={linkClass}
            >
              Universal AGI
            </a>
            , increased availability of distributed systems at{" "}
            <a
              href="https://aws.amazon.com/"
              target="_blank"
              rel="noopener noreferrer"
              className={linkClass}
            >
              AWS
            </a>
            , and researched generative video models at Hooglee under mentorship
            from{" "}
            <a
              href="https://en.wikipedia.org/wiki/Sebastian_Thrun"
              target="_blank"
              rel="noopener noreferrer"
              className={linkClass}
            >
              Sebastian Thrun
            </a>
            .
          </p>
          <p>
            In my spare time, I&apos;m usually drumming, playing volleyball,
            lifting weights, or making new things (ask me about how I hem my
            clothes).
          </p>
        </div>
        <p className="mt-4 text-[15px] leading-[1.6] text-subtle">
          <strong className="font-medium text-foreground">
            I love meeting new people.
          </strong>{" "}
          Feel free to reach out if you have questions or just want to chat :)
        </p>
        <div className="mt-4 inline-block rounded-md border border-faint/60 bg-surface/40 px-1.5 py-1.5">
          <CopyEmail />
        </div>
      </section>

      {/* Work */}
      <section className="mt-10">
        <h2 className="font-serif text-xl font-normal text-foreground">Work</h2>
        <p className="mt-4 text-[15px] leading-[1.6] text-foreground">
          Working on something new ;)
        </p>
        <p className="mt-4 text-[15px] leading-[1.6]">
          <Link href="/work" className={linkClass}>
            Previous work →
          </Link>
        </p>
      </section>

      {/* Projects (writing included) */}
      <section className="mt-10">
        <h2 className="font-serif text-xl font-normal text-foreground">
          Projects
        </h2>
        <ul className="mt-4 list-disc pl-5 space-y-3 text-[15px] leading-[1.6] text-foreground">
          {featuredProjects.map((project) => (
            <li key={project.slug} className="relative">
              <Link href={`/blog/${project.slug}`} className={linkClass}>
                {project.title}
              </Link>
              {project.badge && (
                <span className="ml-2 whitespace-nowrap text-[12px] text-muted">
                  {project.badge}
                </span>
              )}
              <span className="block text-[14px] text-muted">
                {project.summary}
              </span>
              <span className="absolute bottom-0 right-0 text-[12px] text-muted/60">
                {formatDate(project.timestamp)}
              </span>
            </li>
          ))}
        </ul>
        <p className="mt-4 text-[15px] leading-[1.6]">
          <Link href="/blog" className={linkClass}>
            All projects →
          </Link>
        </p>
      </section>

      <Footer />
    </main>
  );
}

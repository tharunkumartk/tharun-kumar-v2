import Link from "next/link";
import { getAllWorkExperiences } from "@/lib/work";
import Footer from "@/app/components/Footer";

export const dynamic = "force-static";

const linkClass =
  "underline underline-offset-[3px] decoration-[1.5px] decoration-faint hover:decoration-current transition-colors";

function yearRange(startDate: string, endDate: string): string {
  const startYear = new Date(startDate).getFullYear().toString();
  const endYear =
    endDate === "present"
      ? "present"
      : new Date(endDate).getFullYear().toString();
  return startYear === endYear ? startYear : `${startYear}–${endYear}`;
}

export const metadata = {
  title: "Work — Tharun Kumar",
  description: "Work experience of Tharun Kumar",
};

export default function WorkPage() {
  const workExperiences = getAllWorkExperiences();

  return (
    <main className="animate-fade mx-auto w-full max-w-2xl px-6 pt-14 md:pt-20 pb-16">
      <Link href="/" className={`text-[13px] text-muted ${linkClass}`}>
        ← Home
      </Link>

      <h1 className="font-serif text-4xl font-normal text-foreground mt-8">
        Work
      </h1>

      <div className="mt-10 space-y-8">
        {workExperiences.map((experience) => (
          <article key={experience.slug}>
            <h2 className="font-serif text-lg text-foreground">
              {experience.position},{" "}
              <a
                href={experience.companyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={linkClass}
              >
                {experience.company}
              </a>
            </h2>
            <p className="mt-1 text-[13px] text-muted">
              {yearRange(experience.startDate, experience.endDate)}
            </p>
            <div
              className="mt-2 text-[14px] leading-[1.6] text-muted [&>p+p]:mt-2"
              dangerouslySetInnerHTML={{ __html: experience.content }}
            />
          </article>
        ))}
      </div>

      <p className="mt-6 text-[15px] leading-[1.6]">
        <a
          href="/resume.pdf"
          target="_blank"
          rel="noopener noreferrer"
          className={linkClass}
        >
          View full resume
        </a>
      </p>

      <Footer />
    </main>
  );
}

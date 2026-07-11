import { WorkExperience } from "@/lib/types";
import { formatDateRange } from "@/lib/utils";

interface WorkExperienceProps {
  experience: WorkExperience;
}

const WorkExperienceCard = ({ experience }: WorkExperienceProps) => {
  const dateRange = formatDateRange(experience.startDate, experience.endDate);

  return (
    <a
      href={experience.companyUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="block"
    >
      <div className="grid grid-cols-1 xl:grid-cols-[150px_1fr] gap-2 xl:gap-8 xl:p-4 xl:rounded-lg xl:transition-colors xl:duration-300 xl:hover:bg-stone-100 xl:dark:hover:bg-stone-800/50 xl:cursor-pointer">
        {/* Date - left column on xl, or hidden if we use eyebrow on small screens */}
        <div className="hidden xl:block text-[11px] font-bold uppercase tracking-widest text-stone-400 dark:text-stone-500 mt-1.5">
          {dateRange}
        </div>

        {/* Content */}
        <div className="space-y-4">
          <div className="space-y-1">
            {/* Date Eyebrow for mobile only */}
            <div className="xl:hidden text-[11px] font-bold uppercase tracking-widest text-stone-400 dark:text-stone-500">
              {dateRange}
            </div>

            {/* Position title */}
            <h3 className="text-2xl font-medium text-stone-900 dark:text-stone-100 leading-tight">
              {experience.position} <span className="text-stone-400 mx-1">@</span> {experience.company}
            </h3>
          </div>

          {/* Content */}
          <div
            className="text-sm text-stone-600 dark:text-stone-400 leading-relaxed prose prose-sm max-w-none prose-stone dark:prose-invert [&>p]:mb-4 [&>p:last-child]:mb-0"
            dangerouslySetInnerHTML={{ __html: experience.content }}
          />

          {/* Skills */}
          <div className="flex flex-wrap gap-2 pt-1">
            {experience.skills.slice(0, 5).map((skill) => (
              <span
                key={skill}
                className="px-2 py-0.5 bg-stone-100 dark:bg-stone-800/50 text-stone-500 dark:text-stone-400 text-[10px] font-bold uppercase tracking-wider rounded border border-stone-200 dark:border-stone-700/50"
              >
                {skill}
              </span>
            ))}
            {experience.skills.length > 5 && (
              <span className="text-[10px] text-stone-400 dark:text-stone-600 self-center font-medium">
                +{experience.skills.length - 5}
              </span>
            )}
          </div>
        </div>
      </div>
    </a>
  );
};

export default WorkExperienceCard;

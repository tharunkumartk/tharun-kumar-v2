import Hero from "./components/landing/Hero";
import AboutColumn from "./components/landing/AboutColumn";
import WorkExperienceColumn from "./components/landing/WorkExperienceColumn";
import Navbar from "./components/landing/Navbar";
import SocialIcons from "./components/landing/SocialIcons";
import Spotify from "./components/landing/Spotify";
import ScrollDetector from "./components/landing/ScrollDetector";
// import BlogColumn from "./components/landing/BlogColumn";
import ProjectColumn from "./components/landing/ProjectColumn";
import MeetingNewPeopleColumn from "./components/landing/MeetingNewPeopleColumn";
import FooterColumn from "./components/landing/FooterColumn";

export const dynamic = "force-static";

export default function Home() {
  return (
    <ScrollDetector>
      <div className="flex flex-col md:flex-row md:h-screen">
        {/* Fixed Left Column on md+, stacked on smaller screens */}
        <div className="relative w-full px-8 py-8 space-y-8 md:fixed md:left-0 md:top-0 md:w-1/2 md:h-[100vh] md:z-10 md:pl-32 md:px-16 md:py-20 md:space-y-20">
          <Hero />
          {/* Hide Navbar on md and smaller screens */}
          <div className="hidden md:block">
            <Navbar />
          </div>
          <div className="md:mt-30">
            <SocialIcons />
            <div className="mt-4">
              <Spotify />
            </div>
          </div>
        </div>

        {/* Scrollable Right Column */}
        <div className="w-full ml-0 px-8 md:ml-[50%] md:w-1/2 md:pr-16">
          <div className="min-h-screen md:px-8">
            <AboutColumn />
            <WorkExperienceColumn />
            <ProjectColumn />
            {/* <BlogColumn /> commented until i have more non-project blogs */}
            <MeetingNewPeopleColumn />
            <FooterColumn />
          </div>
        </div>
      </div>
    </ScrollDetector>
  );
}

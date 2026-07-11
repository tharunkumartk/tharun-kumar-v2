const AboutColumn = () => {
  return (
    <div
      className="flex flex-col justify-start items-center pt-20 pb-20"
      id="about"
    >
      <div className="">
        <p
          className={`
            font-light text-stone-600 dark:text-stone-400 text-lg
            opacity-0 animate-fadeIn-mobile md:animate-fadeIn-desktop
            motion-reduce:opacity-100 motion-reduce:animate-none
          `}
        >
          I&apos;m an{" "}
          <span className="font-medium text-stone-900 dark:text-white">
            engineer and researcher
          </span>{" "}
          driven by a passion for building impactful AI systems that bridge
          cutting-edge research and real-world applications. Previously, I
          worked on state-of-the-art AI agents for Fortune 500 companies as a
          founding engineer at{" "}
          <a
            href="https://www.universalagi.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-stone-900 dark:text-white underline hover:opacity-70"
          >
            Universal AGI
          </a>
          , increased availability of distributed systems at{" "}
          <a
            href="https://aws.amazon.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-stone-900 dark:text-white underline hover:opacity-70"
          >
            AWS
          </a>
          , and researched generative video models at Hooglee under mentorship
          from{" "}
          <a
            href="https://en.wikipedia.org/wiki/Sebastian_Thrun"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-stone-900 dark:text-white underline hover:opacity-70"
          >
            Sebastian Thrun
          </a>
          .
          <br />
          <br />
          Currently, I&apos;m a senior at{" "}
          <span className="font-medium text-stone-900 dark:text-white">
            Princeton University
          </span>
          , studying CS and math. I&apos;m looking for full-time opportunities
          in AI research and engineering. Aside from working on fun projects and
          learning as much as I can about the world,{" "}
          <span className="font-medium text-stone-900 dark:text-white">
            I&apos;m looking for intense and fast-paced environments where I can
            ship products and push boundaries towards AGI
          </span>
          .
          <br />
          <br />
          In my spare time, I&apos;m usually drumming, playing volleyball,
          lifting weights, or making new things (ask me about how I hem my
          clothes).
        </p>
      </div>
    </div>
  );
};

export default AboutColumn;

const FooterColumn = () => {
  return (
    <div
      className="flex flex-col justify-start items-center pt-20 pb-10"
      id="footer"
    >
      <div className="">
        <p
          className="font-light text-stone-500 dark:text-stone-500 opacity-0 animate-fadeIn"
          style={{
            fontSize: "14px",
            animationDelay: "100ms",
            animationFillMode: "forwards",
          }}
        >
          {
            "Made with <3 by Tharun Kumar with Next.js and Tailwind using Cursor. Design inspiration from "
          }
          <a
            href="https://brittanychiang.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-stone-600 dark:text-stone-600 underline hover:opacity-70"
          >
            Brittany Chiang
          </a>
          {" and "}
          <a
            href="https://openai.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-stone-600 dark:text-stone-600 underline hover:opacity-70"
          >
            OpenAI
          </a>
          .
          <br />
          <br />
          View the source code on{" "}
          <a
            href="https://github.com/tharunkumartk/tharun-kumar-v1"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-stone-600 dark:text-stone-600 underline hover:opacity-70"
          >
            GitHub
          </a>
          .
        </p>
      </div>
    </div>
  );
};

export default FooterColumn;

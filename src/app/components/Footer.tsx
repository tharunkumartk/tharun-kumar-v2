const Footer = () => {
  return (
    <footer className="mt-12 border-t border-faint pt-6 pb-2">
      <p className="text-[13px] text-muted">
        Made with {"<3"} by Tharun Kumar with Next.js. View the source code on{" "}
        <a
          href="https://github.com/tharunkumartk/tharun-kumar-v1"
          target="_blank"
          rel="noopener noreferrer"
          className="underline underline-offset-[3px] decoration-[1.5px] decoration-faint hover:decoration-current transition-colors"
        >
          GitHub
        </a>
        .
      </p>
    </footer>
  );
};

export default Footer;

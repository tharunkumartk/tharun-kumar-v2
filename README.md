<h1 align="center">
<a href="https://tharuntk.com/" target="_blank"> 
  tharuntk.com
  </a>
</h1>
<p align="center">
  A modern, responsive personal website with blog built with <a href="https://nextjs.org/" target="_blank">Next.js</a> and <a href="https://www.typescriptlang.org/" target="_blank">TypeScript</a>
</p>

Light mode:

![demo](public/preview.png)

Dark mode:

![demo-dark](public/preview-dark.png)


## Development setup

1. Install dependencies

   ```sh
   npm install
   ```

2. Start the development server

   ```sh
   npm run dev
   ```

3. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result

## Building and Running for Production

1. Generate a full static production build

   ```sh
   npm run build
   ```

2. Start the production server

   ```sh
   npm start
   ```


## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **Typography**: Inter (sans) and Source Serif 4 (serif) via `next/font`
- **Content**: Markdown with gray-matter frontmatter parsing
- **Rendering**: react-markdown with remark-gfm for GitHub-flavored markdown
- **Math**: KaTeX with remark-math and rehype-katex
- **Syntax Highlighting**: highlight.js with rehype-highlight
- **Themes**: Automatic dark/light mode via CSS `prefers-color-scheme`

## Content Management

- **Blog Posts**: Add markdown files to `content/blog/`
- **Projects**: Add project details to `content/projects/`
- **Work Experience**: Update work history in `content/work/`

Each content type supports frontmatter for metadata and full markdown syntax for content.

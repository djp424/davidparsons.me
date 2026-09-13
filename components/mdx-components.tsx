import type { MDXComponents } from "mdx/types";

/**
 * Prose styles for migrated posts. These are mostly deep outline lists, so the
 * list rules carry more weight here than the paragraph ones.
 */
export const mdxComponents: MDXComponents = {
  h2: (props) => (
    <h2
      className="pt-6 text-[26px] leading-[1.3] font-normal tracking-[-0.01em] text-ink"
      {...props}
    />
  ),
  h3: (props) => (
    <h3 className="pt-4 text-[21px] leading-[1.35] font-normal text-ink" {...props} />
  ),
  p: (props) => <p className="text-pretty" {...props} />,
  a: (props) => <a className="lk" {...props} />,
  strong: (props) => <strong className="font-medium text-ink" {...props} />,
  ul: (props) => (
    <ul
      className="flex list-disc flex-col gap-[7px] pl-[22px] marker:text-hair [&_ul]:mt-[7px] [&_ul]:pl-[22px]"
      {...props}
    />
  ),
  ol: (props) => (
    <ol
      className="flex list-decimal flex-col gap-[7px] pl-[22px] marker:font-mono marker:text-[14px] marker:text-faint [&_ol]:mt-[7px]"
      {...props}
    />
  ),
  li: (props) => <li className="leading-[1.7] text-pretty" {...props} />,
  code: (props) => (
    <code
      className="border border-rule bg-white px-[5px] py-[1px] font-mono text-[15px]"
      {...props}
    />
  ),
  blockquote: (props) => (
    <blockquote className="border-l border-hair pl-5 text-muted italic" {...props} />
  ),
  hr: () => <hr className="border-rule" />,
};

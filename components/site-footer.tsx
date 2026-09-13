import { site } from "@/lib/site";

const [twitter, github, linkedin] = site.elsewhere;

export function SiteFooter() {
  return (
    <footer className="mx-auto mt-auto w-full max-w-[720px] px-6 pt-18 pb-14 sm:px-0">
      <p className="text-[15px] leading-[1.7] text-muted">
        You can also find me on{" "}
        <a className="lk text-body" href={twitter.href}>
          {twitter.label}
        </a>
        ,{" "}
        <a className="lk text-body" href={github.href}>
          {github.label}
        </a>{" "}
        and{" "}
        <a className="lk text-body" href={linkedin.href}>
          {linkedin.label}
        </a>
        .
      </p>
    </footer>
  );
}

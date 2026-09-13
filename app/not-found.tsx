import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { PageHeading } from "@/components/page-heading";

export default function NotFound() {
  return (
    <>
      <SiteHeader />
      <main
        id="content"
        className="mx-auto w-full max-w-[720px] px-6 pt-16 sm:px-0 sm:pt-22"
      >
        <PageHeading label="404" title="Nothing here.">
          That page doesn&rsquo;t exist. Try the{" "}
          <Link className="lk" href="/notes">
            notes
          </Link>
          , the{" "}
          <Link className="lk" href="/speaking">
            talks
          </Link>
          , or go{" "}
          <Link className="lk" href="/">
            home
          </Link>
          .
        </PageHeading>
      </main>
      <SiteFooter />
    </>
  );
}

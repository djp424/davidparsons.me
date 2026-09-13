import type { Metadata } from "next";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { PageHeading, Gutter } from "@/components/page-heading";
import { ContactForm } from "./contact-form";

export const metadata: Metadata = {
  title: "Contact",
  description: "Send David Parsons a note.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <>
      <SiteHeader current="/contact" />
      <main
        id="content"
        className="mx-auto w-full max-w-[720px] px-6 pt-16 sm:px-0 sm:pt-22"
      >
        <PageHeading label="Contact" title="You know what to do!">
          Write below and it lands in my inbox. I read everything.
        </PageHeading>

        <div className="pt-13">
          <Gutter>
            <ContactForm />
          </Gutter>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}

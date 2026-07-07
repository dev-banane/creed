import type { Metadata } from "next";
import { ContextFilePageView } from "@/components/marketing/context-file-page-view";
import { JsonLd } from "@/components/marketing/json-ld";
import { contextFileFaqItems } from "@/lib/marketing/faq";
import {
  breadcrumbSchema,
  faqPageSchema,
  graph,
  webPageSchema,
} from "@/lib/seo/structured-data";

const PATH = "/context";
const TITLE = "What is a context file?";
const DESCRIPTION =
  "A personal context file is one structured profile that every AI reads before it answers you. Learn what goes in it, how agents keep it current, and how it differs from a chatbot's memory.";
const DATE_MODIFIED = "2026-07-07";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: PATH },
  openGraph: {
    type: "article",
    url: PATH,
    title: TITLE,
    description: DESCRIPTION,
  },
};

export default function ContextFilePage() {
  return (
    <>
      <JsonLd
        data={graph(
          webPageSchema({
            path: PATH,
            name: TITLE,
            description: DESCRIPTION,
            dateModified: DATE_MODIFIED,
          }),
          breadcrumbSchema(PATH, [
            { name: "Creed", path: "/home" },
            { name: "Context file", path: PATH },
          ]),
          faqPageSchema(contextFileFaqItems)
        )}
      />
      <ContextFilePageView />
    </>
  );
}

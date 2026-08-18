import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { getPolicy, POLICY_SLUGS, type PolicySlug } from "@/lib/api";

type Params = { slug: string };

export function generateStaticParams() {
  return POLICY_SLUGS.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const policy = await getPolicy(slug);

  if (!policy) {
    return { title: "Page Not Found — RevvMotiv" };
  }

  return {
    title: `${policy.title} — RevvMotiv`,
  };
}

function formatUpdatedDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-IN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default async function PolicyPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;

  if (!POLICY_SLUGS.includes(slug as PolicySlug)) {
    notFound();
  }

  const policy = await getPolicy(slug);

  if (!policy) {
    notFound();
  }

  return (
    <div className="pt-6 sm:pt-8 md:pt-12 pb-20 px-6 max-w-screen-2xl mx-auto w-full">
      <div className="max-w-2xl mx-auto">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-bold text-ink-muted uppercase tracking-widest hover:text-[var(--brand-red)] transition-colors mb-10"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </Link>

        <h1 className="text-3xl md:text-4xl font-black text-ink uppercase tracking-tight mb-2">
          {policy.title}
        </h1>
        <p className="text-xs text-ink-subtle uppercase tracking-widest mb-10">
          Last updated {formatUpdatedDate(policy.updated_at)}
        </p>

        <ReactMarkdown
          components={{
            h1: ({ children }) => (
              <h2 className="text-xl md:text-2xl font-black text-ink uppercase tracking-tight mt-10 mb-4 first:mt-0">
                {children}
              </h2>
            ),
            h2: ({ children }) => (
              <h2 className="text-xl md:text-2xl font-black text-ink uppercase tracking-tight mt-10 mb-4 first:mt-0">
                {children}
              </h2>
            ),
            h3: ({ children }) => (
              <h3 className="text-lg font-bold text-ink mt-6 mb-2">
                {children}
              </h3>
            ),
            p: ({ children }) => (
              <p className="text-sm text-ink-muted leading-relaxed mb-4">
                {children}
              </p>
            ),
            ul: ({ children }) => (
              <ul className="list-disc pl-5 space-y-2 text-sm text-ink-muted leading-relaxed mb-4">
                {children}
              </ul>
            ),
            ol: ({ children }) => (
              <ol className="list-decimal pl-5 space-y-2 text-sm text-ink-muted leading-relaxed mb-4">
                {children}
              </ol>
            ),
            li: ({ children }) => <li>{children}</li>,
            strong: ({ children }) => (
              <strong className="font-bold text-ink">{children}</strong>
            ),
            a: ({ href, children }) => (
              <a
                href={href}
                className="text-[var(--brand-red)] hover:text-red-400 underline underline-offset-2 transition-colors"
              >
                {children}
              </a>
            ),
          }}
        >
          {policy.content}
        </ReactMarkdown>
      </div>
    </div>
  );
}

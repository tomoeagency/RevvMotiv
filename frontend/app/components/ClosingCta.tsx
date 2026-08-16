import { PrimaryCtaLink } from "@/app/components/PrimaryCtaButton";
import { TalkToUsButton } from "@/app/components/TalkToUsButton";

// Reused at the bottom of every main content page (home, products,
// product detail, work, work detail, about) — same shape, different
// heading/body per page so it reads as page-relevant rather than a
// copy-pasted banner.
export function ClosingCta({
  heading,
  body,
}: {
  heading: string;
  body: string;
}) {
  return (
    <section className="border-t border-hairline max-w-screen-2xl mx-auto px-6 py-24 text-center">
      <h2 className="text-2xl md:text-3xl font-black text-ink uppercase tracking-tight mb-4">
        {heading}
      </h2>
      <p className="text-sm text-ink-muted max-w-md mx-auto mb-8">{body}</p>
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
        <PrimaryCtaLink href="/shop" className="w-full sm:w-auto px-12 py-4 text-sm text-center">
          Shop Parts
        </PrimaryCtaLink>
        <TalkToUsButton />
      </div>
    </section>
  );
}

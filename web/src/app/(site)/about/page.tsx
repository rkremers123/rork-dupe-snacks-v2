import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Our Story",
  description:
    "We built Dupe Snacks for our daughter Mack after her celiac diagnosis — so no family has to feel helpless in the gluten-free aisle.",
};

export default function AboutPage() {
  return (
    <article className="mx-auto max-w-5xl">
      <div className="grid items-start gap-8 md:grid-cols-[minmax(0,440px)_1fr] md:gap-12">
        {/* Image — left */}
        <div className="overflow-hidden rounded-3xl border border-border bg-surface-2 md:sticky md:top-28">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/our-story.jpg"
            alt="Mack, gluten-free and thriving, playing at the playground"
            className="h-full w-full object-cover"
          />
        </div>

        {/* Copy — right */}
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-teal">
            Our Story
          </p>
          <h1 className="mt-2 text-3xl font-extrabold leading-tight md:text-4xl">
            We built Dupe Snacks for Mack
          </h1>

          <div className="mt-6 flex flex-col gap-5 text-lg leading-relaxed text-foreground/90">
            <p>
              When our daughter was 11 months old, we noticed something was
              wrong. She was losing weight, getting weaker. Within months, we
              found ourselves in the ER. Terrified.
            </p>
            <p>
              When we got the diagnosis—celiac disease—everything clicked. We
              changed her diet. Within days, she came alive. She was our
              daughter again.
            </p>
            <p>
              But the first gluten-free grocery trip was a nightmare. Dee spent
              three hours in the store, crying. Every snack aisle felt like a
              minefield.
            </p>
            <p className="text-xl font-semibold text-teal">
              We created Dupe Snacks because no one should feel that helpless.
            </p>
            <p>
              No more three-hour shopping trips. No more watching your kid miss
              out on snacks everyone else gets to enjoy. No more feeling like you
              have to say goodbye to normal life.
            </p>
            <p className="font-semibold">
              One tap. A snack you actually want. Right now. Because gluten-free
              doesn&apos;t mean joyless.
            </p>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/dupes"
              className="rounded-xl bg-magenta px-5 py-3 font-semibold text-white hover:brightness-110"
            >
              Browse the dupes
            </Link>
            <Link
              href="/search"
              className="rounded-xl border border-teal px-5 py-3 font-semibold text-teal hover:bg-teal/10"
            >
              Shop all gluten-free
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}

import Image from "next/image";
import { ButtonLink } from "@/components/ui/Button";
import type { HeroData } from "./types";

export function Hero({ data }: { data: HeroData }) {
  const [badgeStat, ...restStats] = data.stats ?? [];

  return (
    <section className="grid gap-10 py-10 md:grid-cols-2 md:items-center md:py-16">
      <div>
        {data.eyebrow && (
          <span className="inline-flex rounded-full bg-ink px-4 py-1.5 text-label-md text-white">{data.eyebrow}</span>
        )}
        <h1 className="mt-4 text-headline-xl-mobile md:text-headline-xl">{data.headline}</h1>
        {data.body && <p className="mt-6 max-w-[560px] text-body-lg text-ink-muted">{data.body}</p>}
        <div className="mt-8 flex flex-wrap gap-4">
          {data.primaryCta && (
            <ButtonLink href={data.primaryCta.href} variant="primary">
              {data.primaryCta.label}
            </ButtonLink>
          )}
          {data.secondaryCta && (
            <ButtonLink href={data.secondaryCta.href} variant="ghost">
              {data.secondaryCta.label}
            </ButtonLink>
          )}
        </div>
        {restStats.length > 0 && (
          <div className="mt-10 flex flex-wrap gap-6 rounded-2xl border border-ink bg-surface p-6 md:gap-8">
            {restStats.map((stat, i) => (
              <div key={i}>
                <p className="text-metric-display">{stat.value}</p>
                <p className="mt-1 text-label-sm text-ink-muted">{stat.label}</p>
              </div>
            ))}
          </div>
        )}
      </div>
      {data.imageUrl && (
        <div className="relative mb-6 md:mb-0">
          <div className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl border border-ink">
            <Image src={data.imageUrl} alt="" fill className="object-cover" sizes="(max-width: 768px) 100vw, 50vw" />
          </div>
          {badgeStat && (
            <div className="absolute -bottom-6 -left-4 flex flex-col items-center rounded-full border border-ink bg-surface px-6 py-4 text-center shadow-soft md:-left-8">
              <p className="text-headline-md">{badgeStat.value}</p>
              <p className="mt-0.5 text-label-sm text-ink-muted">{badgeStat.label}</p>
            </div>
          )}
        </div>
      )}
    </section>
  );
}


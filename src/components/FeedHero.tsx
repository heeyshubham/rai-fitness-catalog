interface FeedHeroProps {
  count: number;
}

export default function FeedHero({ count }: FeedHeroProps) {
  return (
    <div className="px-5 desk:px-0 pt-2 pb-[22px]">
      <h1 className="font-display font-bold text-[clamp(28px,9.5vw,38px)] tracking-[-0.025em] leading-[1.02] m-0 [text-wrap:balance] break-words">
        Build your <em className="not-italic text-accent font-display">floor.</em><br />Machine by machine.
      </h1>
      <p className="mt-[10px] mb-0 text-text-dim text-[14px] max-w-[32ch]">
        Browse {count} commercial-grade pieces. Tap to inspect, save the ones that fit, and we&apos;ll prepare a tailored quote.
      </p>
    </div>
  );
}

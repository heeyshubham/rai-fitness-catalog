interface FeedHeroProps {
  count: number;
}

export default function FeedHero({ count }: FeedHeroProps) {
  return (
    <div className="feed-hero">
      <h1>Build your <em>floor.</em><br />Machine by machine.</h1>
      <p>Browse {count} commercial-grade pieces. Tap to inspect, save the ones that fit, and we&apos;ll prepare a tailored quote.</p>
    </div>
  );
}

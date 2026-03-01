import { getLatestNoticesForMarquee } from "@/lib/queries/marquee-notices";

export async function Marquee() {
  const notices = await getLatestNoticesForMarquee();

  if (notices.length === 0) return null;

  const items = [...notices, ...notices]; // duplicate for seamless loop

  return (
    <div className="marquee-bar" role="region" aria-label="Latest notices ticker">
      <div className="marquee-label">
        <span>हाइलाइटहरू</span>
      </div>
      <div className="marquee-track-wrap">
        <div className="marquee-track animate-marquee">
          {items.map((notice, i) => (
            <a key={`${notice.id}-${i}`} href={`/notices/${notice.id}`} className="marquee-item">
              {typeof notice.title === "string" ? notice.title : String(notice.title)}
              <span className="marquee-sep" aria-hidden="true">
                {" "}
                ||{" "}
              </span>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}

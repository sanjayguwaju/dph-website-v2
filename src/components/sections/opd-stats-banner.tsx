type OpdStatsData = {
  opdMale?: number | null;
  opdFemale?: number | null;
  opdTotal?: number | null;
  inpatientMale?: number | null;
  inpatientFemale?: number | null;
  inpatientTotal?: number | null;
  totalBeds?: number | null;
  bedOccupancy?: number | null;
  lastUpdatedDate?: string | null;
};

export function OpdStatsBanner({ stats }: { stats: OpdStatsData }) {
  const statItems = [
    { label: "बाह्य रोगी (पुरुष)", value: stats.opdMale ?? 0, color: "blue" },
    { label: "बाह्य रोगी (महिला)", value: stats.opdFemale ?? 0, color: "pink" },
    { label: "बाह्य रोगी (जम्मा)", value: stats.opdTotal ?? 0, color: "purple", highlight: true },
    { label: "भर्ना (पुरुष)", value: stats.inpatientMale ?? 0, color: "blue" },
    { label: "भर्ना (महिला)", value: stats.inpatientFemale ?? 0, color: "pink" },
    { label: "भर्ना (जम्मा)", value: stats.inpatientTotal ?? 0, color: "purple", highlight: true },
    { label: "कुल शय्या", value: stats.totalBeds ?? 0, color: "green" },
    { label: "शय्या अधिभोग", value: stats.bedOccupancy ?? 0, color: "orange" },
  ];

  return (
    <section className="opd-banner">
      <div className="opd-banner-header">
        <span className="opd-banner-title">📊 दैनिक तथ्याङ्क</span>
        {stats.lastUpdatedDate && (
          <span className="opd-banner-updated">
            अपडेट:{" "}
            {new Date(stats.lastUpdatedDate).toLocaleDateString("ne-NP", {
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
          </span>
        )}
      </div>
      <div className="opd-stats-grid">
        {statItems.map((item) => (
          <div key={item.label} className={`opd-stat-card${item.highlight ? "highlight" : ""}`}>
            <span className="opd-stat-value">{item.value.toLocaleString()}</span>
            <span className="opd-stat-label">{item.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

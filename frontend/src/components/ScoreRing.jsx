/**
 * Animated SVG circular score ring component.
 * Props:
 *  - score: number (0-100)
 *  - size?: number (default 160)
 */
export default function ScoreRing({ score = 0, size = 160 }) {
  const strokeWidth = 12;
  const radius = (size - strokeWidth * 2) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const cx = size / 2;
  const cy = size / 2;

  const color =
    score >= 75 ? "#16a34a" : score >= 50 ? "#d97706" : "#dc2626";
  const gradId =
    score >= 75 ? "grad-green" : score >= 50 ? "grad-amber" : "grad-red";
  const label =
    score >= 75 ? "Strong Match" : score >= 50 ? "Good Match" : "Weak Match";

  // gradient stops
  const stops =
    score >= 75
      ? ["#4ade80", "#16a34a"]
      : score >= 50
      ? ["#fbbf24", "#d97706"]
      : ["#f87171", "#dc2626"];

  return (
    <div className="flex flex-col items-center gap-1 select-none">
      <div style={{ position: "relative", width: size, height: size }}>
        <svg
          width={size}
          height={size}
          style={{ transform: "rotate(-90deg)" }}
        >
          <defs>
            <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={stops[0]} />
              <stop offset="100%" stopColor={stops[1]} />
            </linearGradient>
          </defs>
          {/* Background track */}
          <circle
            cx={cx}
            cy={cy}
            r={radius}
            fill="none"
            stroke="#e2e8f0"
            strokeWidth={strokeWidth}
          />
          {/* Animated progress arc */}
          <circle
            cx={cx}
            cy={cy}
            r={radius}
            fill="none"
            stroke={`url(#${gradId})`}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            style={{ transition: "stroke-dashoffset 1.2s cubic-bezier(0.4,0,0.2,1)" }}
          />
        </svg>

        {/* Centered text — absolutely positioned so it's truly centered */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "2px",
          }}
        >
          <span
            style={{
              fontSize: "2rem",
              fontWeight: 800,
              lineHeight: 1,
              color,
            }}
          >
            {score}%
          </span>
          <span
            style={{
              fontSize: "0.7rem",
              fontWeight: 600,
              color: "#64748b",
              letterSpacing: "0.03em",
              textTransform: "uppercase",
            }}
          >
            {label}
          </span>
        </div>
      </div>
    </div>
  );
}

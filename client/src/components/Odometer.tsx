import { useEffect, useRef, useState } from "react";

interface OdometerProps {
  percentage: number; // 0-100
  label?: string;
  size?: number;
}

export function Odometer({ percentage, label = "Overall Progress", size = 280 }: OdometerProps) {
  const [animated, setAnimated] = useState(0);
  const rafRef = useRef<number>();
  const startTimeRef = useRef<number>();

  useEffect(() => {
    const duration = 1800;
    const target = Math.min(100, Math.max(0, percentage));

    const animate = (timestamp: number) => {
      if (!startTimeRef.current) startTimeRef.current = timestamp;
      const elapsed = timestamp - startTimeRef.current;
      const progress = Math.min(elapsed / duration, 1);
      // Ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setAnimated(Math.round(eased * target));
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(animate);
      }
    };

    startTimeRef.current = undefined;
    rafRef.current = requestAnimationFrame(animate);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [percentage]);

  // Gauge arc: starts at 220deg, sweeps 280deg (like a car speedometer)
  const cx = size / 2;
  const cy = size / 2;
  const radius = (size / 2) * 0.74;
  const strokeWidth = (size / 2) * 0.12;

  const startAngle = 220; // degrees from 3 o'clock (SVG convention)
  const totalSweep = 280; // degrees

  const toRad = (deg: number) => (deg * Math.PI) / 180;

  function describeArc(startDeg: number, endDeg: number) {
    const start = toRad(startDeg);
    const end = toRad(endDeg);
    const x1 = cx + radius * Math.cos(start);
    const y1 = cy + radius * Math.sin(start);
    const x2 = cx + radius * Math.cos(end);
    const y2 = cy + radius * Math.sin(end);
    const largeArc = endDeg - startDeg > 180 ? 1 : 0;
    return `M ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2}`;
  }

  // Map 0-100 to arc angles
  const angleStart = startAngle;
  const angleEnd = startAngle + (animated / 100) * totalSweep;
  const bgAngleEnd = startAngle + totalSweep;

  // Needle
  const needleAngle = startAngle + (animated / 100) * totalSweep;
  const needleRad = toRad(needleAngle);
  const needleLength = radius * 0.85;
  const needleTailLength = radius * 0.18;
  const nx = cx + needleLength * Math.cos(needleRad);
  const ny = cy + needleLength * Math.sin(needleRad);
  const tailX = cx - needleTailLength * Math.cos(needleRad);
  const tailY = cy - needleTailLength * Math.sin(needleRad);

  // Color zones: green 80-100, yellow 40-80, red 0-40
  const fillColor =
    animated >= 80
      ? "hsl(142 71% 45%)"
      : animated >= 40
      ? "hsl(38 95% 55%)"
      : "hsl(0 72% 55%)";

  // Tick marks
  const ticks = [0, 25, 50, 75, 100];

  return (
    <div className="flex flex-col items-center select-none" data-testid="odometer">
      <svg
        width={size}
        height={size * 0.72}
        viewBox={`0 0 ${size} ${size}`}
        style={{ overflow: "visible" }}
      >
        {/* Outer subtle ring */}
        <circle
          cx={cx}
          cy={cy}
          r={radius + strokeWidth / 2 + 6}
          fill="none"
          stroke="hsl(var(--border))"
          strokeWidth={1}
          opacity={0.4}
        />

        {/* Background arc (track) */}
        <path
          d={describeArc(angleStart, bgAngleEnd)}
          fill="none"
          stroke="hsl(var(--muted))"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
        />

        {/* Progress arc */}
        {animated > 0 && (
          <path
            d={describeArc(angleStart, angleEnd)}
            fill="none"
            stroke={fillColor}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            style={{ filter: `drop-shadow(0 0 6px ${fillColor}88)` }}
          />
        )}

        {/* Tick marks */}
        {ticks.map((t) => {
          const tickAngle = toRad(startAngle + (t / 100) * totalSweep);
          const innerR = radius - strokeWidth / 2 - 2;
          const outerR = radius + strokeWidth / 2 + 2;
          return (
            <g key={t}>
              <line
                x1={cx + innerR * Math.cos(tickAngle)}
                y1={cy + innerR * Math.sin(tickAngle)}
                x2={cx + outerR * Math.cos(tickAngle)}
                y2={cy + outerR * Math.sin(tickAngle)}
                stroke="hsl(var(--foreground))"
                strokeWidth={2}
                opacity={0.35}
              />
              <text
                x={cx + (radius + strokeWidth / 2 + 16) * Math.cos(tickAngle)}
                y={cy + (radius + strokeWidth / 2 + 16) * Math.sin(tickAngle)}
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize={size * 0.045}
                fill="hsl(var(--muted-foreground))"
                fontFamily="monospace"
              >
                {t}
              </text>
            </g>
          );
        })}

        {/* Needle */}
        <line
          x1={tailX}
          y1={tailY}
          x2={nx}
          y2={ny}
          stroke="hsl(var(--foreground))"
          strokeWidth={strokeWidth * 0.18}
          strokeLinecap="round"
          style={{ transition: "none" }}
        />

        {/* Needle pivot */}
        <circle
          cx={cx}
          cy={cy}
          r={strokeWidth * 0.32}
          fill="hsl(var(--foreground))"
        />

        {/* Center percentage display */}
        <text
          x={cx}
          y={cy + radius * 0.38}
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize={size * 0.18}
          fontWeight="700"
          fill={fillColor}
          fontFamily="monospace"
          style={{ transition: "fill 0.5s" }}
        >
          {animated}%
        </text>
        <text
          x={cx}
          y={cy + radius * 0.58}
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize={size * 0.055}
          fill="hsl(var(--muted-foreground))"
        >
          complete
        </text>
      </svg>
      <p className="text-sm font-medium text-muted-foreground mt-1">{label}</p>
    </div>
  );
}

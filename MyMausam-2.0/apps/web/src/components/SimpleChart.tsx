"use client";

import React from "react";

interface SimpleChartProps {
  data: { label: string; value: number }[];
  color?: string;
  height?: number;
  unit?: string;
  title?: string;
}

/**
 * Lightweight SVG bar chart — zero dependencies.
 * Used for historical weather trends in the AI chat.
 */
export const SimpleChart: React.FC<SimpleChartProps> = ({
  data,
  color = "#00DDE5",
  height = 120,
  unit = "",
  title,
}) => {
  if (!data.length) return null;

  const maxVal = Math.max(...data.map((d) => d.value), 1);
  const barWidth = Math.min(40, Math.floor(300 / data.length));
  const gap = Math.max(4, Math.floor(16 / data.length));
  const totalWidth = data.length * (barWidth + gap) - gap;

  return (
    <div className="bg-white/5 p-3 rounded-2xl border border-white/10 space-y-2">
      {title && (
        <span className="text-[10px] font-bold text-white/70 block">
          {title}
        </span>
      )}

      <div className="overflow-x-auto scrollbar-none">
        <svg
          width={Math.max(totalWidth, 200)}
          height={height + 28}
          viewBox={`0 0 ${Math.max(totalWidth, 200)} ${height + 28}`}
          className="block"
        >
          {/* Grid lines */}
          {[0, 0.25, 0.5, 0.75, 1].map((pct) => (
            <line
              key={pct}
              x1={0}
              y1={height - pct * height}
              x2={Math.max(totalWidth, 200)}
              y2={height - pct * height}
              stroke="rgba(255,255,255,0.06)"
              strokeWidth={1}
            />
          ))}

          {/* Bars */}
          {data.map((d, i) => {
            const barHeight = (d.value / maxVal) * height;
            const x = i * (barWidth + gap);
            const y = height - barHeight;

            return (
              <g key={i}>
                {/* Bar */}
                <rect
                  x={x}
                  y={y}
                  width={barWidth}
                  height={barHeight}
                  rx={4}
                  fill={color}
                  opacity={0.85}
                  className="transition-all duration-500"
                />

                {/* Value on top */}
                <text
                  x={x + barWidth / 2}
                  y={y - 4}
                  textAnchor="middle"
                  fill="white"
                  fontSize={9}
                  fontWeight={700}
                  opacity={0.8}
                >
                  {d.value.toFixed(1)}
                </text>

                {/* Label below */}
                <text
                  x={x + barWidth / 2}
                  y={height + 14}
                  textAnchor="middle"
                  fill="rgba(255,255,255,0.5)"
                  fontSize={8}
                  fontWeight={600}
                >
                  {d.label}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {unit && (
        <span className="text-[8px] text-white/40 block text-right">
          Unit: {unit}
        </span>
      )}
    </div>
  );
};

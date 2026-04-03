interface DataPoint {
  label: string;
  value: number;
}

interface LineChartProps {
  data: DataPoint[];
  height?: number;
  color?: string;
  showGrid?: boolean;
}

export default function LineChart({
  data,
  height = 200,
  color = '#3b82f6',
  showGrid = true
}: LineChartProps) {
  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-gray-400 dark:text-gray-600">
        No data available
      </div>
    );
  }

  const maxValue = Math.max(...data.map(d => d.value));
  const minValue = Math.min(...data.map(d => d.value), 0);
  const valueRange = maxValue - minValue || 1;
  const padding = 40;
  const width = 600;

  const points = data.map((d, i) => {
    const x = padding + (i * (width - padding * 2)) / (data.length - 1 || 1);
    const y = height - padding - ((d.value - minValue) / valueRange) * (height - padding * 2);
    return { x, y, ...d };
  });

  const pathD = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');

  const gradientId = `gradient-${Math.random().toString(36).substr(2, 9)}`;
  const areaPath = `${pathD} L ${points[points.length - 1].x} ${height - padding} L ${points[0].x} ${height - padding} Z`;

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full">
      <defs>
        <linearGradient id={gradientId} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={color} stopOpacity="0.3" />
          <stop offset="100%" stopColor={color} stopOpacity="0.05" />
        </linearGradient>
      </defs>

      {showGrid && (
        <g className="text-gray-200 dark:text-gray-700">
          {[0, 1, 2, 3, 4].map(i => {
            const y = padding + (i * (height - padding * 2)) / 4;
            return (
              <line
                key={i}
                x1={padding}
                y1={y}
                x2={width - padding}
                y2={y}
                stroke="currentColor"
                strokeWidth="1"
                strokeDasharray="4"
                opacity="0.5"
              />
            );
          })}
        </g>
      )}

      <path d={areaPath} fill={`url(#${gradientId})`} />

      <path
        d={pathD}
        fill="none"
        stroke={color}
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {points.map((point, i) => (
        <g key={i}>
          <circle
            cx={point.x}
            cy={point.y}
            r="5"
            fill="white"
            stroke={color}
            strokeWidth="3"
            className="transition-all hover:r-6"
          />
          <text
            x={point.x}
            y={height - 10}
            textAnchor="middle"
            className="text-xs fill-gray-600 dark:fill-gray-400"
          >
            {point.label}
          </text>
        </g>
      ))}

      <text
        x={padding - 10}
        y={padding - 10}
        className="text-sm fill-gray-700 dark:fill-gray-300 font-medium"
      >
        ${Math.round(maxValue).toLocaleString()}
      </text>
      <text
        x={padding - 10}
        y={height - padding + 20}
        className="text-sm fill-gray-700 dark:fill-gray-300 font-medium"
      >
        ${Math.round(minValue).toLocaleString()}
      </text>
    </svg>
  );
}

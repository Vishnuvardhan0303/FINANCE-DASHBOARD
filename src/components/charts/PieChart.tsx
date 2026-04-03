interface PieSlice {
  label: string;
  value: number;
  color: string;
}

interface PieChartProps {
  data: PieSlice[];
  size?: number;
}

export default function PieChart({ data, size = 200 }: PieChartProps) {
  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-gray-400 dark:text-gray-600">
        No data available
      </div>
    );
  }

  const total = data.reduce((sum, item) => sum + item.value, 0);
  const center = size / 2;
  const radius = size / 2 - 10;

  let currentAngle = -90;
  const slices = data.map(item => {
    const percentage = (item.value / total) * 100;
    const angle = (item.value / total) * 360;
    const startAngle = currentAngle;
    const endAngle = currentAngle + angle;

    currentAngle = endAngle;

    const startRad = (startAngle * Math.PI) / 180;
    const endRad = (endAngle * Math.PI) / 180;

    const x1 = center + radius * Math.cos(startRad);
    const y1 = center + radius * Math.sin(startRad);
    const x2 = center + radius * Math.cos(endRad);
    const y2 = center + radius * Math.sin(endRad);

    const largeArc = angle > 180 ? 1 : 0;

    const path = [
      `M ${center} ${center}`,
      `L ${x1} ${y1}`,
      `A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2}`,
      'Z',
    ].join(' ');

    return {
      ...item,
      path,
      percentage,
    };
  });

  return (
    <div className="flex flex-col lg:flex-row items-center gap-6">
      <svg viewBox={`0 0 ${size} ${size}`} className="w-full max-w-[200px]">
        {slices.map((slice, i) => (
          <g key={i} className="transition-all hover:opacity-80">
            <path
              d={slice.path}
              fill={slice.color}
              className="cursor-pointer"
            />
          </g>
        ))}
      </svg>

      <div className="flex-1 space-y-2 w-full">
        {slices.map((slice, i) => (
          <div key={i} className="flex items-center gap-3">
            <div
              className="w-3 h-3 rounded-full flex-shrink-0"
              style={{ backgroundColor: slice.color }}
            />
            <div className="flex-1 min-w-0">
              <div className="text-sm text-gray-700 dark:text-gray-300 truncate">
                {slice.label}
              </div>
            </div>
            <div className="text-sm font-medium text-gray-900 dark:text-white">
              {slice.percentage.toFixed(1)}%
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

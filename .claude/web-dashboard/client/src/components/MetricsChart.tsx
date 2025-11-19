import {
  LineChart,
  Line,
  BarChart,
  Bar,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { useStore } from '../store/useStore';

interface MetricsChartProps {
  data: any[];
  type?: 'line' | 'bar' | 'area';
  dataKeys: {
    key: string;
    name: string;
    color: string;
  }[];
  xAxisKey: string;
  title?: string;
  height?: number;
}

export function MetricsChart({
  data,
  type = 'line',
  dataKeys,
  xAxisKey,
  title,
  height = 300,
}: MetricsChartProps) {
  const { theme } = useStore();
  const isDark = theme === 'dark';

  const chartConfig = {
    stroke: isDark ? '#374151' : '#e5e7eb',
    text: isDark ? '#9ca3af' : '#6b7280',
    tooltip: {
      background: isDark ? '#1f2937' : '#ffffff',
      border: isDark ? '#374151' : '#e5e7eb',
    },
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div
          className="p-3 rounded-lg border shadow-lg"
          style={{
            backgroundColor: chartConfig.tooltip.background,
            borderColor: chartConfig.tooltip.border,
          }}
        >
          <p className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
            {label}
          </p>
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center justify-between gap-4 text-xs">
              <span className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: entry.color }}
                />
                <span className="text-gray-700 dark:text-gray-300">{entry.name}:</span>
              </span>
              <span className="font-semibold text-gray-900 dark:text-gray-100">
                {typeof entry.value === 'number' ? entry.value.toLocaleString() : entry.value}
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  const renderChart = () => {
    const commonProps = {
      data,
      margin: { top: 5, right: 30, left: 20, bottom: 5 },
    };

    switch (type) {
      case 'bar':
        return (
          <BarChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" stroke={chartConfig.stroke} />
            <XAxis dataKey={xAxisKey} stroke={chartConfig.text} />
            <YAxis stroke={chartConfig.text} />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            {dataKeys.map((dataKey) => (
              <Bar
                key={dataKey.key}
                dataKey={dataKey.key}
                name={dataKey.name}
                fill={dataKey.color}
              />
            ))}
          </BarChart>
        );

      case 'area':
        return (
          <AreaChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" stroke={chartConfig.stroke} />
            <XAxis dataKey={xAxisKey} stroke={chartConfig.text} />
            <YAxis stroke={chartConfig.text} />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            {dataKeys.map((dataKey) => (
              <Area
                key={dataKey.key}
                type="monotone"
                dataKey={dataKey.key}
                name={dataKey.name}
                stroke={dataKey.color}
                fill={dataKey.color}
                fillOpacity={0.3}
              />
            ))}
          </AreaChart>
        );

      case 'line':
      default:
        return (
          <LineChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" stroke={chartConfig.stroke} />
            <XAxis dataKey={xAxisKey} stroke={chartConfig.text} />
            <YAxis stroke={chartConfig.text} />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            {dataKeys.map((dataKey) => (
              <Line
                key={dataKey.key}
                type="monotone"
                dataKey={dataKey.key}
                name={dataKey.name}
                stroke={dataKey.color}
                strokeWidth={2}
                dot={{ fill: dataKey.color, r: 4 }}
                activeDot={{ r: 6 }}
              />
            ))}
          </LineChart>
        );
    }
  };

  return (
    <div className="w-full">
      {title && (
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
          {title}
        </h3>
      )}
      <ResponsiveContainer width="100%" height={height}>
        {renderChart()}
      </ResponsiveContainer>
    </div>
  );
}

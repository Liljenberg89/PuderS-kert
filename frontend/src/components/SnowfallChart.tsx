import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface ChartDatum {
  week: number;
  primary: number;
  compare?: number;
}

interface SnowfallChartProps {
  data: ChartDatum[];
  selectedWeek: number | "all";
  bestWeek: number | null;
  primaryLabel: string;
  compareLabel?: string;
}

const DEFAULT_COLOR = "#52616f";
const SELECTED_COLOR = "#d95926";
const BEST_COLOR = "#2f9e44";
const COMPARE_COLOR = "#4c94d9";

function SnowfallChart({
  data,
  selectedWeek,
  bestWeek,
  primaryLabel,
  compareLabel,
}: SnowfallChartProps) {
  const isComparing = Boolean(compareLabel);

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="week" tickFormatter={(w) => `v.${w}`} interval={1} />
        <YAxis unit=" cm" />
        <Tooltip
          formatter={(value, key) => [
            `${value} cm`,
            key === "compare" ? compareLabel ?? "" : primaryLabel,
          ]}
          labelFormatter={(w) => `Vecka ${w}`}
        />
        {isComparing && (
          <Legend
            formatter={(key) => (key === "compare" ? compareLabel ?? "" : primaryLabel)}
          />
        )}
        <Bar dataKey="primary" name={primaryLabel} fill={DEFAULT_COLOR}>
          {!isComparing &&
            data.map((entry) => {
              let color = DEFAULT_COLOR;
              if (entry.week === bestWeek) color = BEST_COLOR;
              if (entry.week === selectedWeek) color = SELECTED_COLOR;
              return <Cell key={entry.week} fill={color} />;
            })}
        </Bar>
        {isComparing && (
          <Bar dataKey="compare" name={compareLabel} fill={COMPARE_COLOR} />
        )}
      </BarChart>
    </ResponsiveContainer>
  );
}

export default SnowfallChart;

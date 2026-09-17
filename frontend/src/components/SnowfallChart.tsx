import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { WeeklyAverageSnowfall } from "../api";

interface SnowfallChartProps {
  data: WeeklyAverageSnowfall[];
  selectedWeek: number | "all";
  bestWeek: number | null;
}

const DEFAULT_COLOR = "#52616f";
const SELECTED_COLOR = "#d95926";
const BEST_COLOR = "#2f9e44";

function SnowfallChart({ data, selectedWeek, bestWeek }: SnowfallChartProps) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="week" tickFormatter={(w) => `v.${w}`} interval={1} />
        <YAxis unit=" cm" />
        <Tooltip
          formatter={(value: number) => [`${value} cm`, "Snitt nysnö"]}
          labelFormatter={(w) => `Vecka ${w}`}
        />
        <Bar dataKey="avgSnowfallCm">
          {data.map((entry) => {
            let color = DEFAULT_COLOR;
            if (entry.week === bestWeek) color = BEST_COLOR;
            if (entry.week === selectedWeek) color = SELECTED_COLOR;
            return <Cell key={entry.week} fill={color} />;
          })}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

export default SnowfallChart;

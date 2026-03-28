import { BarChart, Bar, ResponsiveContainer } from "recharts";

function MiniBar({ spent, budget }: any) {
  const data = [
    { name: "Spent", value: spent },
    { name: "Remaining", value: Math.max(budget - spent, 0) },
  ];

  return (
    <div className="h-16">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <Bar dataKey="value" fill="#3b82f6" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default MiniBar;
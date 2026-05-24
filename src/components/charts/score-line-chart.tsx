"use client";

import { Bar, BarChart, CartesianGrid, Cell, LabelList, Line, LineChart, ResponsiveContainer, XAxis, YAxis } from "recharts";

export function ScoreLineChart({ data }: { data: Array<{ name: string; score: number | null }> }) {
  return (
    <div className="h-64 w-full">
      <ResponsiveContainer>
        <LineChart data={data} margin={{ top: 25, right: 20, bottom: 5, left: 0 }}>
          <CartesianGrid stroke="#F1D7D7" vertical={false} />
          <XAxis dataKey="name" tick={{ fontSize: 12, fill: "#766363" }} />
          <YAxis domain={[0, 100]} tick={{ fontSize: 12, fill: "#766363" }} />
          <Line type="monotone" dataKey="score" stroke="#B91C1C" strokeWidth={2} dot={{ r: 4, fill: "#B91C1C" }}>
            <LabelList dataKey="score" position="top" style={{ fontSize: 11, fontWeight: 600, fill: "#44403c" }} />
          </Line>
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export function SimpleBarChart({ data }: { data: Array<{ name: string; score?: number; value?: number }> }) {
  const dataKey = data[0]?.score === undefined ? "value" : "score";
  return (
    <div className="h-64 w-full">
      <ResponsiveContainer>
        <BarChart data={data} margin={{ top: 25, right: 20, bottom: 5, left: 0 }}>
          <CartesianGrid stroke="#F1D7D7" vertical={false} />
          <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#766363" }} />
          <YAxis domain={[0, 100]} tick={{ fontSize: 12, fill: "#766363" }} />
          <Bar dataKey={dataKey} fill="#B91C1C" radius={[6, 6, 0, 0]}>
            <LabelList dataKey={dataKey} position="top" style={{ fontSize: 11, fontWeight: 600, fill: "#44403c" }} />
            {data.map((_, index) => (
              <Cell key={index} fill="#B91C1C" />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

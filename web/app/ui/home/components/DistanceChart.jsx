"use client";
import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

const DistanceChart = ({ machineRunnings }) => {
  const data = machineRunnings.map((run) => ({
    time: new Date(run.TimeStamp).toLocaleTimeString(),
    distance: run.DistanceTraveled,
  }));

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data}>
        <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
        <XAxis
          dataKey="time"
          label={{ value: "Horário", position: "insideBottomRight", offset: -5 }}
        />
        <YAxis
          label={{ value: "Distância (cm)", angle: -90, position: "insideLeft" }}
        />
        <Tooltip />
        <Line
          type="monotone"
          dataKey="distance"
          stroke="#005B92"
          dot={false}
          name="Distance Traveled"
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default DistanceChart;

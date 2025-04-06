import { BarChart } from "@mui/x-charts/BarChart";
import { axisClasses } from "@mui/x-charts/ChartsAxis";
import { dataset, valueFormatter } from "./weather";
import { Paper } from "@mui/material";

const chartSetting = {
  yAxis: [
    {
      label: "Count",
    },
  ],
  series: [
    {
      dataKey: "partnerships",
      label: "Partnerships",
      valueFormatter,
      color: "#4CAF50", // Green
    },
    {
      dataKey: "usersRegistered",
      label: "Users Registered",
      valueFormatter,
      color: "#2196F3", // Blue
    },
    {
      dataKey: "inprogress",
      label: "In Progress",
      valueFormatter,
      color: "#FF9800", // Orange
    },
  ],
  height: 450,
  sx: {
    borderRadius: "12px",
    boxShadow: "0 5px 15px rgba(0, 0, 0, 0.15)",
    backgroundColor: "#fff",
    padding: 3,
    [`& .${axisClasses.directionY} .${axisClasses.label}`]: {
      transform: "translateX(-10px)",
      fontSize: "14px",
      fontWeight: "bold",
    },
    [`& .${axisClasses.directionX} .${axisClasses.label}`]: {
      fontSize: "14px",
      fontWeight: "bold",
    },
  },
};

export default function EnhancedBarChart() {
  return (
    <Paper
      elevation={4}
      sx={{ padding: 4, backgroundColor: "#f9f9f9", borderRadius: "12px" }}
    >
      <h2
        style={{
          textAlign: "center",
          color: "#333",
          marginBottom: "16px",
          fontWeight: "600",
        }}
      >
        Performance Overview
      </h2>
      <BarChart
        dataset={dataset}
        xAxis={[{ scaleType: "band", dataKey: "month", label: "Month" }]}
        {...chartSetting}
      />
    </Paper>
  );
}

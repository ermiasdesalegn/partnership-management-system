import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const SimpleLineChart = ({ monthlyStats }) => {
  if (!monthlyStats) return null;

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart
        data={monthlyStats}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
      }}
    >
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        <XAxis 
          dataKey="month" 
          stroke="#666"
          tick={{ fill: '#666' }}
        />
        <YAxis 
          stroke="#666"
          tick={{ fill: '#666' }}
        />
        <Tooltip 
          contentStyle={{
            backgroundColor: 'white',
            border: '1px solid #ccc',
            borderRadius: '4px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}
        />
        <Legend 
          wrapperStyle={{
            paddingTop: '20px'
          }}
        />
        <Line
          type="monotone"
          dataKey="requests"
          stroke="#8884d8"
          name="Requests"
          activeDot={{ r: 8 }}
          strokeWidth={2}
        />
        <Line
          type="monotone"
          dataKey="signedPartners"
          stroke="#82ca9d"
          name="Signed Partners"
          strokeWidth={2}
        />
        <Line
          type="monotone"
          dataKey="unsignedPartners"
          stroke="#ffc658"
          name="Unsigned Partners"
          strokeWidth={2}
        />
        <Line
          type="monotone"
          dataKey="activePartners"
          stroke="#ff8042"
          name="Active Partners"
          strokeWidth={2}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default SimpleLineChart;

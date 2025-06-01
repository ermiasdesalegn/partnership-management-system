import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const TickPlacementBars = ({ monthlyStats }) => {
  if (!monthlyStats) return null;

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
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
        <Bar 
          dataKey="requests" 
          name="Requests" 
          fill="#8884d8" 
          radius={[4, 4, 0, 0]}
        />
        <Bar 
          dataKey="signedPartners" 
          name="Signed Partners" 
          fill="#82ca9d" 
          radius={[4, 4, 0, 0]}
        />
        <Bar 
          dataKey="unsignedPartners" 
          name="Unsigned Partners" 
          fill="#ffc658" 
          radius={[4, 4, 0, 0]}
        />
        <Bar 
          dataKey="activePartners" 
          name="Active Partners" 
          fill="#ff8042" 
          radius={[4, 4, 0, 0]}
      />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default TickPlacementBars;

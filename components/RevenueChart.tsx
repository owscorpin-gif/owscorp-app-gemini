import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import type { Sale } from '../data/salesData';

interface RevenueChartProps {
  data: Omit<Sale, 'developerId'>[];
}

const RevenueChart: React.FC<RevenueChartProps> = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart
        data={data}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
        <XAxis dataKey="date" stroke="#6b7280" />
        <YAxis 
          stroke="#6b7280" 
          tickFormatter={(value: number) => `$${(value / 1000)}k`} 
        />
        <Tooltip
          contentStyle={{
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            border: '1px solid #ccc',
            borderRadius: '0.5rem',
          }}
          formatter={(value: number) => [`$${value.toLocaleString()}`, 'Revenue']}
        />
        <Legend />
        <Line type="monotone" dataKey="revenue" stroke="#1E3A8A" strokeWidth={3} activeDot={{ r: 8 }} dot={{ r: 4 }} />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default RevenueChart;
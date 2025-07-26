import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import '../css/TransferChart.css';

const TransferChart = () => {
  // Sample data for transfer statistics
  const transferData = [
    {
      name: 'Own Account Transfer',
      success: 35,
      pending: 10,
      failed: 5
    },
    {
      name: 'Swift',
      success: 25,
      pending: 45,
      failed: 13
    },
    {
      name: 'RTGS',
      success: 27,
      pending: 12,
      failed: 9
    },
    {
      name: 'NEFT',
      success: 8,
      pending: 18,
      failed: 34
    }
  ];

  return (
    <div className="transfer-chart-container">
      <div className="chart-header">
        <h2>Transfer Statistics Overview</h2>
        <p>Success, Pending, and Failed transactions by transfer type</p>
      </div>
      
      <div className="chart-wrapper">
        <ResponsiveContainer width="100%" height={400}>
          <BarChart
            data={transferData}
            margin={{
              top: 20,
              right: 30,
              left: 20,
              bottom: 5,
            }}
            barCategoryGap="20%"
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
            <XAxis 
              dataKey="name" 
              tick={{ fontSize: 12 }}
              angle={-45}
              textAnchor="end"
              height={80}
            />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip 
              contentStyle={{
                backgroundColor: '#fff',
                border: '1px solid #ccc',
                borderRadius: '8px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
              }}
            />
            <Legend 
              wrapperStyle={{ paddingTop: '20px' }}
            />
            <Bar 
              dataKey="success" 
              fill="#0F2655" 
              name="Success"
              radius={[2, 2, 0, 0]}
            />
            <Bar 
              dataKey="pending" 
              fill="#caf0f8" 
              name="Pending"
              radius={[2, 2, 0, 0]}
            />
            <Bar 
              dataKey="failed" 
              fill="#7f9fe08e" 
              name="Failed"
              radius={[2, 2, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default TransferChart;

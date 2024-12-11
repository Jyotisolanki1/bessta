import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend ,PieChart, Pie, Cell} from 'recharts';


export const LineCharts = () => {
    const data = [
        { month: 'Jan', revenue: 1000 },
        { month: 'Feb', revenue: 500 },
        { month: 'Mar', revenue: 2000 },
        // Add more data for other months
        { month: 'April', revenue: 1000 },
        { month: 'MAy', revenue: 500 },
        { month: 'June', revenue: 2000 },
      ];          

  return (
    <div style = {{display:"flex",justifyContent:"center",width:"100%"}}>
    <LineChart width={600} height={400} data={data} >
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="month" />
      <YAxis />
      <Tooltip />
      <Legend />
      <Line type="monotone" dataKey="revenue" stroke="#8884d8" />
    </LineChart>
    </div>
  );
};




export const PieCharts = () => {
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28'];
  const data = [
    { name: 'Events', value: 30 },
    { name: 'Total Revenue', value: 60 },
    { name: 'Commission', value: 10 },
  ];
  return (
    <div style = {{display:"flex",justifyContent:"center",width:"100%"}}>
        <PieChart width={400} height={400} style={{flex:1}}>
        <Pie
            data={data}
            dataKey="value"
            cx={200}
            cy={200}
            innerRadius={80}
            outerRadius={150}
            fill="#8884d8"
            label
        >
            {data.map((entry, index) => (
            <Cell key={index} fill={COLORS[index % COLORS.length]} />
            ))}
        </Pie>
        <Tooltip />
        <Legend />
        </PieChart>
    </div>
  );
};



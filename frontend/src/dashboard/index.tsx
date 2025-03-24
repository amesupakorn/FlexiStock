import React, { useEffect, useState } from 'react';


import OrderChart from './orderChart';
import TopChart from './topChart';
import ForeCast from './forecast';


const DashboardPage = () => {

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <TopChart/>

      <OrderChart />

      <ForeCast/>
      
    </div>
    
  );
};

export default DashboardPage;
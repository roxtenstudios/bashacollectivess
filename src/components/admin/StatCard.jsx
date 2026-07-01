import React from 'react';

const StatCard = ({ title, value, icon: Icon, trend }) => {
  return (
    <div className="bg-white border border-gray-200 p-6 rounded-lg shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-gray-500 text-sm font-medium">{title}</h3>
        <div className="p-2 bg-[#FAF9F6] rounded-md text-[#D4AF37]">
          <Icon size={20} />
        </div>
      </div>
      <div className="flex items-end gap-4">
        <div className="text-3xl font-light text-gray-900">{value}</div>
        {trend && (
          <div className={`text-sm mb-1 ${trend.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
            {trend}
          </div>
        )}
      </div>
    </div>
  );
};

export default StatCard;

import React from 'react';
import StatCard from '../../components/admin/StatCard';
import { DollarSign, ShoppingBag, Users, Activity } from 'lucide-react';

const Dashboard = () => {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Revenue" value="₹45,231.89" icon={DollarSign} trend="+20.1%" />
        <StatCard title="Total Orders" value="356" icon={ShoppingBag} trend="+12.5%" />
        <StatCard title="Active Customers" value="2,403" icon={Users} trend="+5.2%" />
        <StatCard title="Conversion Rate" value="3.2%" icon={Activity} trend="-1.1%" />
      </div>

      {/* Recent Orders Table Skeleton */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
        <h2 className="text-xl font-serif mb-4 text-gray-900">Recent Orders</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="text-xs text-gray-500 uppercase bg-[#FAF9F6] border-b border-gray-200">
              <tr>
                <th className="px-6 py-3">Order ID</th>
                <th className="px-6 py-3">Customer</th>
                <th className="px-6 py-3">Date</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Total</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-gray-100 hover:bg-gray-50">
                <td className="px-6 py-4 font-medium text-gray-900">#ORD-092</td>
                <td className="px-6 py-4">Emma Watson</td>
                <td className="px-6 py-4">Oct 24, 2026</td>
                <td className="px-6 py-4"><span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">Delivered</span></td>
                <td className="px-6 py-4 text-gray-900">₹1,299.00</td>
              </tr>
              <tr className="border-b border-gray-100 hover:bg-gray-50">
                <td className="px-6 py-4 font-medium text-gray-900">#ORD-091</td>
                <td className="px-6 py-4">John Doe</td>
                <td className="px-6 py-4">Oct 23, 2026</td>
                <td className="px-6 py-4"><span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium">Processing</span></td>
                <td className="px-6 py-4 text-gray-900">₹450.00</td>
              </tr>
              <tr className="border-b border-gray-100 hover:bg-gray-50">
                <td className="px-6 py-4 font-medium text-gray-900">#ORD-090</td>
                <td className="px-6 py-4">Sarah Smith</td>
                <td className="px-6 py-4">Oct 22, 2026</td>
                <td className="px-6 py-4"><span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium">Cancelled</span></td>
                <td className="px-6 py-4 text-gray-900">₹890.00</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

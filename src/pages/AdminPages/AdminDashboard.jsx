import './AdminDashboard.scss';
import { useEffect, useState } from 'react';
import { FaUsers, FaQuoteLeft, FaUserCheck } from 'react-icons/fa';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const AdminDashboard = () => {
  const [stats, setStats] = useState({});
  const [dailyQuotes, setDailyQuotes] = useState([]);

  useEffect(() => {
    // Set dummy data instead of fetching from API
    setStats({
      totalUsers: 1200,
      totalQuotes: 875,
      activeUsers: 342,
    });

    setDailyQuotes([
      { _id: 'Mon', count: 120 },
      { _id: 'Tue', count: 150 },
      { _id: 'Wed', count: 130 },
      { _id: 'Thu', count: 180 },
      { _id: 'Fri', count: 200 },
      { _id: 'Sat', count: 90 },
      { _id: 'Sun', count: 75 },
    ]);
  }, []);

  const chartData = {
    labels: dailyQuotes.map(item => item._id),
    datasets: [
      {
        label: 'Quotes per Day',
        data: dailyQuotes.map(item => item.count),
        fill: false,
        borderColor: '#3534FF',
        tension: 0.3,
      }
    ],
  };

  return (
    <div className="admin-dashboard">
      <h1>Admin Dashboard</h1>
      <div className="stats">
        <div className="card">
          <FaUsers />
          <div>
            <h3>{stats.totalUsers || 0}</h3>
            <p>Total Users</p>
          </div>
        </div>
        <div className="card">
          <FaQuoteLeft />
          <div>
            <h3>{stats.totalQuotes || 0}</h3>
            <p>Total Quotes</p>
          </div>
        </div>
        <div className="card">
          <FaUserCheck />
          <div>
            <h3>{stats.activeUsers || 0}</h3>
            <p>Active Users</p>
          </div>
        </div>
      </div>
      <div className="chart-section">
        <h2>Quote Activity (Last 7 Days)</h2>
        <Line data={chartData} />
      </div>
    </div>
  );
};

export default AdminDashboard;

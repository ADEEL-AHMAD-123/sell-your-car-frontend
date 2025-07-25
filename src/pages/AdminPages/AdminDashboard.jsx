import './AdminDashboard.scss';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FaUsers, FaQuoteLeft, FaUserCheck } from 'react-icons/fa';
import { Line } from 'react-chartjs-2';
import {
  fetchAdminStats,
  fetchDailyQuoteAnalytics,
} from '../../redux/slices/adminSlice';

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
  const dispatch = useDispatch();
  const { stats, analytics, loading, error } = useSelector((state) => state.admin);

  useEffect(() => {
    dispatch(fetchAdminStats());
    dispatch(fetchDailyQuoteAnalytics());
  }, [dispatch]);

  const isStatsEmpty = !stats || Object.keys(stats).length === 0;
  const isAnalyticsEmpty = !analytics || analytics.length === 0;
  console.log("analytics",analytics)

  const chartData = {
    labels: analytics.map((item) =>
      new Date(item._id).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      })
    ),
    datasets: [
      {
        label: 'Quotes per Day',
        data: analytics.map((item) => Number(item.count)), // force number
        fill: false,
        borderColor: '#3534FF',
        backgroundColor: '#3534FF',
        tension: 0.3,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
    ],
  };
  
  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          precision: 0, 
        },
      },
    },
  };
  

  return (
    <div className="admin-dashboard">
      <h1>Admin Dashboard</h1>

      {loading && <p className="info-message">Loading...</p>}
      {error && <p className="error-message">Error: {error}</p>}

      {!loading && !error && (
        <>
          <div className="stats">
            <div className="card">
              <FaUsers />
              <div>
                <h3>{stats?.totalUsers ?? 0}</h3>
                <p>Total Users</p>
              </div>
            </div>
            <div className="card">
              <FaQuoteLeft />
              <div>
                <h3>{stats?.totalQuotes ?? 0}</h3>
                <p>Total Quotes</p>
              </div>
            </div>
            <div className="card">
              <FaUserCheck />
              <div>
                <h3>{stats?.activeUsers ?? 0}</h3>
                <p>Active Users</p>
              </div>
            </div>
          </div>

          <div className="chart-section">
            <h2>Quote Activity (Last 7 Days)</h2>
            {isAnalyticsEmpty ? (
              <p className="empty-message">No quote activity data available.</p>
            ) : (
              <Line data={chartData} />
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default AdminDashboard;

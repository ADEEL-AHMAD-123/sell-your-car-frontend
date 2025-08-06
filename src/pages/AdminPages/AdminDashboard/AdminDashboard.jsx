import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, 
  Tooltip, Legend, ResponsiveContainer, LineChart, Line, AreaChart, Area,
  RadialBarChart, RadialBar
} from 'recharts';
import { fetchAnalyticsOverview } from '../../../redux/slices/adminSlice';
import { 
  FaCar, FaCheckCircle, FaMoneyBillWave, FaUsers, FaClock, FaChartLine, 
  FaExchangeAlt, FaDollarSign, FaUserPlus, FaUsersCog, FaCarCrash,
  FaSync, FaArrowUp, FaArrowDown, FaMinus, FaEye, FaCalendarAlt
} from 'react-icons/fa';
import './AdminDashboard.scss';

// Enhanced StatCard with trend indicators and animations
const StatCard = ({ 
  title, 
  value, 
  unit = '', 
  icon, 
  description, 
  trend = null, 
  className = '',
  onClick = null 
}) => {
  const getTrendIcon = () => {
    if (!trend) return null;
    if (trend > 0) return <FaArrowUp />;
    if (trend < 0) return <FaArrowDown />;
    return <FaMinus />;
  };

  const getTrendClass = () => {
    if (!trend) return 'neutral';
    return trend > 0 ? 'positive' : trend < 0 ? 'negative' : 'neutral';
  };

  return (
    <div 
      className={`stat-card ${className}`} 
      onClick={onClick}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
    >
      <div className="stat-card__header">
        <div className="stat-card__icon">{icon}</div>
        {trend !== null && (
          <div className={`stat-card__trend ${getTrendClass()}`}>
            {getTrendIcon()}
            {Math.abs(trend)}%
          </div>
        )}
      </div>
      <div className="stat-card__content">
        <div className="stat-card__value">
          {typeof value === 'number' && value >= 1000 
            ? value.toLocaleString() 
            : value
          }
          <span className="stat-card__unit">{unit}</span>
        </div>
        <div className="stat-card__title">{title}</div>
        <div className="stat-card__description">{description}</div>
      </div>
    </div>
  );
};

// Enhanced ChartCard with better styling
const ChartCard = ({ title, description, children, className = '' }) => (
  <div className={`chart-card ${className}`}>
    <div className="chart-card__header">
      <h3 className="chart-card__title">{title}</h3>
      <p className="chart-card__description">{description}</p>
    </div>
    <div className="chart-card__content">
      {children}
    </div>
  </div>
);

// Enhanced custom tooltip component with better styling
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="custom-tooltip">
        <div className="tooltip-label">{label}</div>
        <div className="tooltip-content">
          {payload.map((entry, index) => (
            <div key={index}>
              <span 
                style={{ 
                  backgroundColor: entry.color,
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  display: 'inline-block',
                  marginRight: '8px'
                }}
              />
              {entry.name}: <span className="tooltip-value">
                {typeof entry.value === 'number' ? entry.value.toLocaleString() : entry.value}
              </span>
              {data.percentage && ` (${data.percentage}%)`}
            </div>
          ))}
        </div>
      </div>
    );
  }
  return null;
};

// Dark theme compatible color schemes for charts
const CHART_COLORS = {
  primary: ['#6366f1', '#818cf8', '#a5b4fc', '#c7d2fe', '#e0e7ff'],
  success: ['#10b981', '#34d399', '#6ee7b7', '#9deccd', '#c6f6d5'],
  warning: ['#f59e0b', '#fbbf24', '#fcd34d', '#fde68a', '#fef3c7'],
  mixed: ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#84cc16'],
  gradient: ['#6366f1', '#8b5cf6', '#d946ef', '#ec4899', '#f43f5e']
};

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const { analyticsOverview, loading, error } = useSelector((state) => state.admin);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Fetch data when component mounts
  useEffect(() => {
    handleRefresh();
  }, [dispatch]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await dispatch(fetchAnalyticsOverview()).unwrap();
      setLastUpdated(new Date());
    } catch (err) {
      console.error('Failed to refresh analytics:', err);
    } finally {
      setIsRefreshing(false);
    }
  };

  // Memoized chart data with enhanced colors
  const chartData = useMemo(() => {
    if (!analyticsOverview) return {};
    
    const manualQuotesCount = analyticsOverview.quoteCountsByType?.find(item => item._id === 'manual')?.count || 0;

    const aggregatedQuotesByType = analyticsOverview.quoteCountsByType?.reduce((acc, current) => {
      const name = current._id === 'auto' ? 'Auto Generated' : 'Manual Request';
      const existingEntry = acc.find(item => item.name === name);
      if (existingEntry) {
        existingEntry.value += current.count;
      } else {
        acc.push({ name, value: current.count });
      }
      return acc;
    }, []) || [];

    const quotesByTypeFinal = aggregatedQuotesByType.map((item, index) => ({
      ...item,
      percentage: ((item.value / analyticsOverview.totalQuotes) * 100).toFixed(1),
      fill: CHART_COLORS.primary[index % CHART_COLORS.primary.length]
    }));
    
    // DVLA checks with proper colors
    const dvlaChecksSummary = analyticsOverview.dvlaChecksDistribution?.map(item => {
      const name = item.hasChecksLeft ? 'Users with Checks Remaining' : 'Users with 0 Checks Left';
      const fill = item.hasChecksLeft ? '#10b981' : '#ef4444';
      return {
        name,
        count: Math.round(item.count),
        fill
      };
    }) || [];
    
    return {
      quotesByType: quotesByTypeFinal,

      quotesByDecision: analyticsOverview.quoteCountsByDecision?.map((item, index) => ({
        name: item._id ? (item._id.charAt(0).toUpperCase() + item._id.slice(1)) : 'Unknown',
        count: item.count,
        percentage: ((item.count / analyticsOverview.totalQuotes) * 100).toFixed(1),
        fill: CHART_COLORS.mixed[index % CHART_COLORS.mixed.length]
      })) || [],

      monthlyTrend: analyticsOverview.monthlyQuotes?.map(m => ({
        month: m._id ? `${m._id.month || 'N/A'}/${(m._id.year || new Date().getFullYear()).toString().slice(-2)}` : 'Unknown',
        quotes: m.total || 0,
        revenue: m.monthlyRevenue || 0
      })) || [],

      dvlaChecksSummary,
      
      conversionFunnel: [
        { stage: 'Total Quotes', value: analyticsOverview.totalQuotes, fill: '#6366f1' },
        { stage: 'Manual Requests', value: manualQuotesCount, fill: '#8b5cf6' },
        { stage: 'Accepted', value: analyticsOverview.quotesAccepted, fill: '#10b981' },
        { stage: 'Collected', value: analyticsOverview.quotesCollected, fill: '#059669' }
      ]
    };
  }, [analyticsOverview]);

  // Calculate conversion rates and trends
  const metrics = useMemo(() => {
    if (!analyticsOverview) return {
      acceptanceRate: '0.0',
      collectionRate: '0.0', 
      userEngagementRate: '0.0',
      avgRevenuePerQuote: '0.00'
    };

    const acceptanceRate = analyticsOverview.totalQuotes > 0 
      ? ((analyticsOverview.quotesAccepted / analyticsOverview.totalQuotes) * 100).toFixed(1)
      : '0.0';
    
    const collectionRate = analyticsOverview.quotesAccepted > 0
      ? ((analyticsOverview.quotesCollected / analyticsOverview.quotesAccepted) * 100).toFixed(1)
      : '0.0';

    const userEngagementRate = analyticsOverview.totalUsers > 0
      ? ((analyticsOverview.usersWithQuotes / analyticsOverview.totalUsers) * 100).toFixed(1)
      : '0.0';

    return {
      acceptanceRate,
      collectionRate,
      userEngagementRate,
      avgRevenuePerQuote: analyticsOverview.avgRevenuePerQuote?.toFixed(2) || '0.00'
    };
  }, [analyticsOverview]);

  if (loading && !analyticsOverview) {
    return (
      <div className="admin-dashboard">
        <div className="admin-dashboard__loading">
          <div className="loading-spinner"></div>
          <div className="loading-text">Loading analytics dashboard...</div>
        </div>
      </div>
    );
  }

  if (error && !analyticsOverview) {
    return (
      <div className="admin-dashboard">
        <div className="admin-dashboard__error">
          <FaExchangeAlt size={48} />
          <h2>Unable to load analytics</h2>
          <p>{error}</p>
          <button onClick={handleRefresh} className="refresh-btn">
            <FaSync /> Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!analyticsOverview) {
    return (
      <div className="admin-dashboard">
        <div className="admin-dashboard__empty">
          <FaChartLine size={64} />
          <h2>No Data Available</h2>
          <p>Analytics data is not available at the moment.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      {/* Enhanced Header */}
      <div className="admin-dashboard__header">
        <div className="header-content">
          <div className="title-section">
            <h1>Analytics Dashboard</h1>
            <p>Comprehensive insights into your scrap car platform performance, user engagement, and revenue metrics.</p>
          </div>
          <div className="header-actions">
            <button 
              onClick={handleRefresh} 
              disabled={isRefreshing}
              className={`refresh-btn ${isRefreshing ? 'loading' : ''}`}
            >
              <FaSync className="refresh-icon" />
              {isRefreshing ? 'Refreshing...' : 'Refresh'}
            </button>
            {lastUpdated && (
              <div className="last-updated">
                <FaClock />
                Updated: {lastUpdated.toLocaleTimeString()}
              </div>
            )}
          </div>
        </div>

        {/* Quick Insights */}
        <div className="quick-insights">
          <div className="insight">
            <div className="insight-value">{metrics.acceptanceRate}%</div>
            <div className="insight-label">Quote Acceptance</div>
          </div>
          <div className="insight">
            <div className="insight-value">{metrics.collectionRate}%</div>
            <div className="insight-label">Collection Rate</div>
          </div>
          <div className="insight">
            <div className="insight-value">{metrics.userEngagementRate}%</div>
            <div className="insight-label">User Engagement</div>
          </div>
          <div className="insight">
            <div className="insight-value">£{metrics.avgRevenuePerQuote}</div>
            <div className="insight-label">Avg Revenue/Quote</div>
          </div>
        </div>
      </div>

      {/* Key Performance Metrics */}
      <div className="section-header">
        <h2>Key Performance Metrics</h2>
        <p>Primary indicators of platform success and business health</p>
      </div>
      
      <div className="stats-grid">
        <StatCard
          title="Total Revenue"
          value={parseFloat(analyticsOverview.totalRevenue).toFixed(2)}
          unit="£"
          icon={<FaMoneyBillWave />}
          description="Total revenue from all collected quotes. This is your primary success metric."
          trend={null}
          className="revenue-card"
        />
        
        <StatCard
          title="Total Quotes"
          value={analyticsOverview.totalQuotes}
          icon={<FaCar />}
          description="All quotes generated on the platform, including auto and manual requests."
          trend={null}
        />
        
        <StatCard
          title="Quotes Accepted"
          value={analyticsOverview.quotesAccepted}
          icon={<FaCheckCircle />}
          description="Quotes that clients have formally accepted. Key conversion metric."
          trend={null}
          className="conversion-card"
        />
        
        <StatCard
          title="Quotes Collected"
          value={analyticsOverview.quotesCollected}
          icon={<FaCheckCircle />}
          description="Successfully completed transactions. Final stage of the sales funnel."
          trend={null}
        />
      </div>

      {/* User Engagement Metrics */}
      <div className="section-header">
        <h2>User Engagement & Growth</h2>
        <p>Understanding user behavior and platform adoption</p>
      </div>
      
      <div className="stats-grid">
        <StatCard
          title="Total Users"
          value={analyticsOverview.totalUsers}
          icon={<FaUsers />}
          description="Total registered users on the platform."
          trend={null}
        />
        
        <StatCard
          title="Active Users"
          value={analyticsOverview.usersWithQuotes}
          icon={<FaCarCrash />}
          description="Users who have generated at least one quote. Shows platform engagement."
          trend={null}
        />
        
        <StatCard
          title="New Users (Month)"
          value={analyticsOverview.newUsersThisMonth}
          icon={<FaUserPlus />}
          description="New user acquisitions this month. Tracks marketing effectiveness."
          trend={null}
        />
        
        <StatCard
          title="Avg Quotes/User"
          value={analyticsOverview.averageQuotesPerUser}
          icon={<FaUsersCog />}
          description="Average quotes per user. Higher values may indicate multiple vehicles."
          trend={null}
        />
      </div>

      {/* Conversion Analysis */}
      <div className="section-header">
        <h2>Conversion Analysis</h2>
        <p>Deep dive into quote conversion rates and pricing effectiveness</p>
      </div>
      
      <div className="stats-grid">
        <StatCard
          title="Manual Quote Acceptance"
          value={analyticsOverview.manualQuoteAcceptedConversion}
          unit="%"
          icon={<FaChartLine />}
          description="Percentage of manual quotes accepted. Measures pricing accuracy."
          trend={null}
          className="conversion-card"
        />
        
        <StatCard
          title="Auto → Manual Rate"
          value={analyticsOverview.manualQuoteRequestConversion}
          unit="%"
          icon={<FaExchangeAlt />}
          description="Auto quotes escalated to manual review. High rates may indicate pricing issues."
          trend={null}
        />
        
        <StatCard
          title="Price Difference"
          value={Math.abs(analyticsOverview.averageFinalPriceVsEstimatedDifference).toFixed(2)}
          unit="£"
          icon={<FaDollarSign />}
          description="Average difference between estimated and final prices."
          trend={null}
        />
        
        <StatCard
          title="Conversion Funnel"
          value={`${metrics.acceptanceRate}%`}
          icon={<FaEye />}
          description="Overall quote to acceptance conversion rate across all channels."
          trend={null}
          className="conversion-card"
        />
      </div>

      {/* Charts Section */}
      <div className="section-header">
        <h2>Data Visualization</h2>
        <p>Visual insights into platform performance and user behavior patterns</p>
      </div>

      {/* Conversion Funnel Chart */}
      <div className="full-width-chart">
        <ChartCard
          title="Sales Conversion Funnel"
          description="Track users through the complete journey from quote generation to successful collection"
          className="full-width"
        >
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData.conversionFunnel} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis type="category" dataKey="stage" width={120} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                {chartData.conversionFunnel.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Chart Grid */}
      <div className="charts-grid">
        <ChartCard
          title="Quote Generation Methods"
          description="Distribution of auto-generated vs manually requested quotes"
        >
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={chartData.quotesByType}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label={({ name, percentage }) => `${name}: ${percentage}%`}
              >
                {chartData.quotesByType.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard
          title="Quote Status Distribution"
          description="Current status breakdown of all quotes in the system"
        >
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData.quotesByDecision}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                {chartData.quotesByDecision.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Monthly Trends */}
      <div className="full-width-chart">
        <ChartCard
          title="Monthly Performance Trends"
          description="Track quote volume and revenue trends over time to identify seasonal patterns"
          className="full-width"
        >
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={chartData.monthlyTrend}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis yAxisId="quotes" orientation="left" />
              <YAxis yAxisId="revenue" orientation="right" />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar 
                yAxisId="quotes" 
                dataKey="quotes" 
                fill="#6366f1" 
                name="Quotes" 
                opacity={0.7} 
              />
              <Line 
                yAxisId="revenue" 
                type="monotone" 
                dataKey="revenue" 
                stroke="#10b981" 
                strokeWidth={3}
                name="Revenue (£)"
                dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, fill: '#10b981' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* DVLA Checks Distribution */}
      <div className="full-width-chart">
        <ChartCard
          title="DVLA Checks Usage Summary"
          description="High-level view of users with checks vs. those who have exhausted their checks."
          className="full-width"
        >
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={chartData.dvlaChecksSummary} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis type="category" dataKey="name" width={200} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                {chartData.dvlaChecksSummary.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Usage Analytics Radial Chart */}
      <div className="charts-grid">
        <ChartCard
          title="User Engagement Breakdown"
          description="Visual representation of user activity levels"
        >
          <ResponsiveContainer width="100%" height={300}>
            <RadialBarChart 
              cx="50%" 
              cy="50%" 
              innerRadius="20%" 
              outerRadius="80%" 
              data={[
                { name: 'Active Users', value: parseFloat(metrics.userEngagementRate), fill: '#6366f1' },
                { name: 'Quote Acceptance', value: parseFloat(metrics.acceptanceRate), fill: '#10b981' },
                { name: 'Collection Rate', value: parseFloat(metrics.collectionRate), fill: '#f59e0b' }
              ]}
            >
              <RadialBar 
                dataKey="value" 
                cornerRadius={10} 
                label={{ position: 'insideStart', fill: '#fff', fontSize: 12 }} 
              />
              <Legend />
              <Tooltip content={<CustomTooltip />} />
            </RadialBarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard
          title="Revenue vs Volume Analysis"
          description="Correlation between quote volume and revenue generation"
        >
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={chartData.monthlyTrend}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Area 
                type="monotone" 
                dataKey="revenue" 
                stackId="1" 
                stroke="#10b981" 
                fill="#10b981" 
                fillOpacity={0.6}
                name="Revenue (£)"
              />
              <Area 
                type="monotone" 
                dataKey="quotes" 
                stackId="2" 
                stroke="#6366f1" 
                fill="#6366f1" 
                fillOpacity={0.6}
                name="Quote Volume"
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Footer Summary */}
      <div className="section-header" style={{ marginTop: '3rem', textAlign: 'center' }}>
        <h2>Platform Health Summary</h2>
        <p>
          Your platform is processing <strong>{analyticsOverview.totalQuotes}</strong> quotes 
          with a <strong>{metrics.acceptanceRate}%</strong> acceptance rate, 
          generating <strong>£{parseFloat(analyticsOverview.totalRevenue).toLocaleString()}</strong> in total revenue 
          from <strong>{analyticsOverview.totalUsers}</strong> registered users.
        </p>
      </div>
    </div>
  );
};

export default AdminDashboard;
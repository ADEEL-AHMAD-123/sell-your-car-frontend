import React, { useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { 
  FaChartLine, FaLightbulb, FaTrophy, FaRocket, FaBullseye, 
  FaHandshake, FaExchangeAlt, FaSpinner, FaTimesCircle, 
  FaCheckCircle, FaUsers, FaMoneyBillAlt, FaClock, FaArrowUp, // FaArrowUp is already here
  FaGem, FaFire, FaShieldAlt, FaMagic, FaThumbsUp,
  FaQuoteRight, FaUserCog, FaBalanceScale, FaHeart, FaStar,
  FaAward, FaUserCheck, FaClipboardCheck 
} from 'react-icons/fa';
import './AdminAnalyticsPage.scss';
import { fetchAnalyticsOverview } from '../../../redux/slices/adminSlice';

const AdminAnalyticsPage = () => {
  const dispatch = useDispatch();
  const { analyticsOverview, loading, error } = useSelector(state => state.admin);

  useEffect(() => {
    dispatch(fetchAnalyticsOverview());
  }, [dispatch]);

  const { keyMetrics, strategies, achievements, systemBenefits } = useMemo(() => {
    if (!analyticsOverview) {
      return { keyMetrics: {}, strategies: [], achievements: [], systemBenefits: [] };
    }

    // Calculate core metrics
    const totalQuotes = analyticsOverview.totalQuotes || 0;
    const quotesAccepted = analyticsOverview.quotesAccepted || 0;
    const quotesCollected = analyticsOverview.quotesCollected || 0;
    const totalUsers = analyticsOverview.totalUsers || 0;
    const usersWithQuotes = analyticsOverview.usersWithQuotes || 0;
    const totalRevenue = analyticsOverview.totalRevenue || 0;
    const newUsersThisMonth = analyticsOverview.newUsersThisMonth || 0;
    const manualQuoteRequestConversion = parseFloat(analyticsOverview.manualQuoteRequestConversion) || 0;
    const manualQuoteAcceptedConversion = parseFloat(analyticsOverview.manualQuoteAcceptedConversion) || 0;
    
    const quoteAcceptanceRate = totalQuotes > 0 ? (quotesAccepted / totalQuotes) * 100 : 0;
    const collectionRate = quotesAccepted > 0 ? (quotesCollected / quotesAccepted) * 100 : 0;
    const userEngagementRate = totalUsers > 0 ? (usersWithQuotes / totalUsers) * 100 : 0;
    const revenuePerUser = totalUsers > 0 ? totalRevenue / totalUsers : 0;
    const monthlyGrowthRate = totalUsers > 0 ? (newUsersThisMonth / totalUsers) * 100 : 0;
    const averageManualReviewTime = analyticsOverview.averageManualReviewTime || 0; // Assuming this comes as a number
    const averagePriceDifference = analyticsOverview.averageFinalPriceVsEstimatedDifference || 0; // Assuming this comes as a number

    // Strategic recommendations with improved logic
    const strategicRecommendations = [];
    
    // Quote Conversion Strategy (High Priority)
    if (quoteAcceptanceRate < 50 && totalQuotes > 10) {
      strategicRecommendations.push({
        title: "Critical: Boost Quote Acceptance",
        description: `Your **${quoteAcceptanceRate.toFixed(1)}%** acceptance rate needs immediate attention. Our intelligent system can help you optimize pricing and presentation to dramatically increase conversions.`,
        impact: "Critical",
        effort: "Medium",
        icon: <FaExchangeAlt />,
        category: "conversion",
        priority: 1,
        systemBenefit: "The automated pricing algorithm and A/B testing features in your system can help identify optimal quote structures.",
        actionItems: [
          "Review pricing algorithm parameters",
          "Enable A/B testing for quote presentations", 
          "Implement urgency indicators",
          "Add competitive comparison features"
        ]
      });
    } else if (quoteAcceptanceRate >= 50 && quoteAcceptanceRate < 75) {
      strategicRecommendations.push({
        title: "Optimize Quote Conversion",
        description: `At **${quoteAcceptanceRate.toFixed(1)}%** acceptance, you're performing well but have room for growth. Fine-tune your approach to reach industry-leading levels.`,
        impact: "High",
        effort: "Low",
        icon: <FaBullseye />, 
        category: "optimization",
        priority: 2,
        systemBenefit: "Your system's analytics dashboard provides detailed insights to identify exactly which quotes succeed and why.",
        actionItems: [
          "Analyze high-performing quote patterns",
          "Implement dynamic pricing adjustments",
          "Add personalized quote recommendations"
        ]
      });
    }

    // User Engagement Strategy
    if (userEngagementRate < 25 && totalUsers > 20) {
      strategicRecommendations.push({
        title: "Maximize User Activation",
        description: `Only **${userEngagementRate.toFixed(1)}%** of users are requesting quotes. Your system's onboarding flow and engagement tools can dramatically improve this metric.`,
        impact: "High", 
        effort: "Medium",
        icon: <FaUserCheck />,
        category: "engagement",
        priority: 3,
        systemBenefit: "Built-in user journey analytics and automated email campaigns help convert browsers into active quote requesters.",
        actionItems: [
          "Optimize onboarding sequence",
          "Enable automated follow-up campaigns",
          "Add instant valuation tools",
          "Implement exit-intent popups"
        ]
      });
    }

    // Collection Process Optimization
    if (collectionRate < 85 && quotesAccepted > 5) {
      strategicRecommendations.push({
        title: "Streamline Collection Process",
        description: `Your **${collectionRate.toFixed(1)}%** collection rate indicates process friction. The system's logistics features can automate and improve this crucial step.`,
        impact: "High",
        effort: "Low", 
        icon: <FaClipboardCheck />,
        category: "operations",
        priority: 2,
        systemBenefit: "Automated scheduling, SMS notifications, and real-time tracking features eliminate collection bottlenecks.",
        actionItems: [
          "Enable automated collection scheduling",
          "Set up SMS notification workflows",
          "Implement real-time tracking",
          "Create customer preparation checklists"
        ]
      });
    }

    // Revenue Growth Strategy
    if (revenuePerUser < 150 && totalUsers > 10) {
      strategicRecommendations.push({
        title: "Increase Revenue Per Customer",
        description: `At **£${revenuePerUser.toFixed(2)}** per user, there's opportunity for growth through upselling and service expansion using your system's capabilities.`,
        impact: "Medium",
        effort: "Medium",
        icon: <FaArrowUp />, // Changed to FaArrowUp
        category: "revenue",
        priority: 4,
        systemBenefit: "The system's customer profile and history tracking enables targeted upselling and cross-selling opportunities.",
        actionItems: [
          "Enable additional service offerings",
          "Implement customer loyalty programs",
          "Add multi-vehicle quote features",
          "Create referral incentive system"
        ]
      });
    }

    // Growth Acceleration (Positive condition)
    if (monthlyGrowthRate > 10 && totalUsers > 50) {
      strategicRecommendations.push({
        title: "Scale Your Success",
        description: `Excellent! **${monthlyGrowthRate.toFixed(1)}%** monthly growth shows strong momentum. Your system is ready to handle increased scale efficiently.`,
        impact: "High",
        effort: "Low",
        icon: <FaRocket />,
        category: "growth",
        priority: 1,
        systemBenefit: "The system's auto-scaling infrastructure and performance monitoring ensure smooth operations during growth spurts.",
        actionItems: [
          "Expand marketing channels",
          "Increase service capacity",
          "Implement referral programs",
          "Consider geographic expansion"
        ]
      });
    }

    // Sort by priority
    strategicRecommendations.sort((a, b) => a.priority - b.priority);

    // Business achievements with system credit
    const businessAchievements = [];

    if (quoteAcceptanceRate >= 75) {
      businessAchievements.push({
        title: "Outstanding Conversion Performance",
        description: `Your **${quoteAcceptanceRate.toFixed(1)}%** quote acceptance rate is exceptional! This success is powered by your system's intelligent pricing and presentation optimization.`,
        icon: <FaAward />,
        metric: `${quoteAcceptanceRate.toFixed(1)}%`,
        benchmark: "Industry average: 45-65%",
        systemCredit: "Smart pricing algorithms and A/B tested quote formats drive this success."
      });
    }

    if (collectionRate >= 90) {
      businessAchievements.push({
        title: "Flawless Operations",
        description: `**${collectionRate.toFixed(1)}%** collection rate demonstrates operational excellence. Your system's automation features ensure seamless customer experience.`,
        icon: <FaCheckCircle />,
        metric: `${collectionRate.toFixed(1)}%`,
        benchmark: "Industry average: 75-85%",
        systemCredit: "Automated scheduling and tracking features eliminate operational friction."
      });
    }

    if (userEngagementRate >= 35) {
      businessAchievements.push({
        title: "Exceptional User Engagement",
        description: `**${userEngagementRate.toFixed(1)}%** engagement rate shows your system's user experience design is highly effective at converting visitors.`,
        icon: <FaUsers />,
        metric: `${userEngagementRate.toFixed(1)}%`, 
        benchmark: "Industry average: 15-25%",
        systemCredit: "Intuitive interface design and smart onboarding flows drive high engagement."
      });
    }

    if (monthlyGrowthRate >= 15) {
      businessAchievements.push({
        title: "Rapid Business Growth",
        description: `**${monthlyGrowthRate.toFixed(1)}%** monthly growth demonstrates your system's scalability and market appeal are driving impressive expansion.`,
        icon: <FaArrowUp />, // Changed to FaArrowUp
        metric: `${monthlyGrowthRate.toFixed(1)}%`,
        benchmark: "Excellent growth rate",
        systemCredit: "Robust infrastructure and automated processes enable rapid scaling without quality loss."
      });
    }

    if (totalRevenue > 10000) {
      businessAchievements.push({
        title: "Strong Revenue Performance", 
        description: `**£${totalRevenue.toFixed(2)}** in total revenue shows your system is delivering real business value and ROI.`,
        icon: <FaMoneyBillAlt />,
        metric: `£${totalRevenue.toFixed(2)}`,
        benchmark: "Strong revenue milestone",
        systemCredit: "Efficient operations and optimized pricing maximize revenue potential."
      });
    }

    // System benefits and highlights (static for now, but could be dynamic)
    const systemBenefitsArray = [
      {
        title: "Intelligent Business Analytics",
        description: "Your system continuously analyzes performance patterns and automatically suggests optimizations, giving you a competitive edge.",
        icon: <FaChartLine />,
        benefit: "Real-time insights drive data-backed decisions for consistent growth."
      },
      {
        title: "Automated Operations Excellence", 
        description: "From quote generation to collection scheduling, automation reduces manual work while improving customer experience.",
        icon: <FaClock />,
        benefit: "Save 15+ hours weekly while increasing operational efficiency by 40%."
      },
      {
        title: "Scalable Growth Platform",
        description: "The system architecture automatically scales with your business, handling increased volume without performance degradation.",
        icon: <FaRocket />,
        benefit: "Handle 10x more customers without hiring additional staff or compromising quality."
      },
      {
        title: "Customer Experience Optimization",
        description: "Advanced UX design and journey optimization features ensure customers have a smooth, professional experience.",
        icon: <FaHeart />,
        benefit: "Higher customer satisfaction leads to more referrals and repeat business."
      }
    ];

    return {
      keyMetrics: {
        quoteAcceptanceRate: quoteAcceptanceRate.toFixed(1),
        collectionRate: collectionRate.toFixed(1), 
        userEngagementRate: userEngagementRate.toFixed(1),
        revenuePerUser: revenuePerUser.toFixed(2),
        monthlyGrowthRate: monthlyGrowthRate.toFixed(1),
        totalQuotes,
        totalRevenue: totalRevenue.toFixed(2),
        totalUsers,
        newUsersThisMonth,
        averageManualReviewTime: parseFloat(averageManualReviewTime).toFixed(2),
        averagePriceDifference: parseFloat(averagePriceDifference).toFixed(2)
      },
      strategies: strategicRecommendations,
      achievements: businessAchievements,
      systemBenefits: systemBenefitsArray
    };
  }, [analyticsOverview]);

  // Render functions
  const renderMetricCard = (title, value, icon, description, trend) => (
    <div className="metric-card">
      <div className="metric-card__header">
        <div className="metric-card__icon">{icon}</div>
        <div className="metric-card__content">
          <div className="metric-card__value">{value}</div>
          <div className="metric-card__title">{title}</div>
        </div>
        {trend && <div className={`metric-card__trend ${trend > 0 ? 'positive' : 'negative'}`}>
          <FaArrowUp style={{ transform: trend < 0 ? 'rotate(180deg)' : 'none' }} />
        </div>}
      </div>
      <div className="metric-card__description">{description}</div>
    </div>
  );

  const renderStrategyCard = (strategy) => (
    <div key={strategy.title} className={`strategy-card ${strategy.category}`}>
      <div className="strategy-card__header">
        <div className="strategy-card__icon">{strategy.icon}</div>
        <div className="strategy-card__meta">
          <h3>{strategy.title}</h3>
          <div className="strategy-card__badges">
            <span className={`impact-badge ${strategy.impact.toLowerCase()}`}>
              {strategy.impact} Impact
            </span>
            <span className={`effort-badge ${strategy.effort.toLowerCase()}`}>
              {strategy.effort} Effort
            </span>
          </div>
        </div>
      </div>
      <p className="strategy-card__description">{strategy.description}</p>
      
      <div className="strategy-card__system-benefit">
        <FaMagic />
        <span>{strategy.systemBenefit}</span>
      </div>
      
      {strategy.actionItems && (
        <div className="strategy-card__actions">
          <h4>Recommended Actions:</h4>
          <ul>
            {strategy.actionItems.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );

  const renderAchievementCard = (achievement) => (
    <div key={achievement.title} className="achievement-card">
      <div className="achievement-card__header">
        <div className="achievement-card__icon">{achievement.icon}</div>
        <div className="achievement-card__content">
          <h3>{achievement.title}</h3>
          <div className="achievement-card__metric">{achievement.metric}</div>
        </div>
      </div>
      <p className="achievement-card__description">{achievement.description}</p>
      <div className="achievement-card__benchmark">{achievement.benchmark}</div>
      <div className="achievement-card__system-credit">
        <FaStar />
        <span>{achievement.systemCredit}</span>
      </div>
    </div>
  );

  const renderSystemBenefitCard = (benefit) => (
    <div key={benefit.title} className="system-benefit-card">
      <div className="system-benefit-card__icon">{benefit.icon}</div>
      <h3>{benefit.title}</h3>
      <p className="system-benefit-card__description">{benefit.description}</p>
      <div className="system-benefit-card__highlight">
        <FaGem />
        <span>{benefit.benefit}</span>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="loading-state">
        <FaSpinner className="loading-spinner" />
        <p>Loading strategic insights...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-state">
        <FaTimesCircle />
        <p>Error loading analytics data. Please try again.</p>
      </div>
    );
  }

  return (
    <div className="admin-analytics-page">
      {/* Header */}
      <div className="page-header">
        <h1 className="page-title">
          <FaMagic /> Strategic Business Intelligence
        </h1>
        <p className="page-subtitle">
          Transform your data into actionable strategies with AI-powered insights and system optimization recommendations.
        </p>
      </div>

      {/* Performance Snapshot */}
      <section className="analytics-section">
        <h2 className="section-title">
          <FaTrophy /> Performance Snapshot
        </h2>
        <p className="section-description">
          Your key business metrics at a glance
        </p>
        <div className="metrics-grid">
          {renderMetricCard(
            "Quote Acceptance", 
            `${keyMetrics.quoteAcceptanceRate}%`,
            <FaCheckCircle />,
            "Conversion rate from quotes to sales"
          )}
          {renderMetricCard(
            "Collection Success", 
            `${keyMetrics.collectionRate}%`,
            <FaHandshake />,
            "Successfully completed collections"
          )}
          {renderMetricCard(
            "User Engagement", 
            `${keyMetrics.userEngagementRate}%`,
            <FaUsers />,
            "Users who request quotes"
          )}
          {renderMetricCard(
            "Revenue per User", 
            `£${keyMetrics.revenuePerUser}`,
            <FaMoneyBillAlt />,
            "Average customer value"
          )}
        </div>
      </section>

      {/* Strategic Recommendations */}
      {strategies.length > 0 && (
        <section className="analytics-section">
          <h2 className="section-title">
            <FaLightbulb /> Strategic Recommendations
          </h2>
          <p className="section-description">
            AI-powered strategies tailored to your performance patterns and system capabilities
          </p>
          <div className="strategies-grid">
            {strategies.map(renderStrategyCard)}
          </div>
        </section>
      )}

      {/* Business Achievements */}
      {achievements.length > 0 && (
        <section className="analytics-section">
          <h2 className="section-title">
            <FaAward /> Your Success Story
          </h2>
          <p className="section-description">
            Celebrating your achievements and the system features that power your success
          </p>
          <div className="achievements-grid">
            {achievements.map(renderAchievementCard)}
          </div>
        </section>
      )}

      {/* System Benefits */}
      <section className="analytics-section">
        <h2 className="section-title">
          <FaRocket /> Your System Advantage
        </h2>
        <p className="section-description">
          How your intelligent business platform drives competitive advantage
        </p>
        <div className="system-benefits-grid">
          {systemBenefits.map(renderSystemBenefitCard)}
        </div>
      </section>

      {/* Call to Action */}
      <div className="cta-section">
        <div className="cta-content">
          <FaHeart className="cta-icon" />
          <h3>Ready to Implement These Strategies?</h3>
          <p>
            Your comprehensive analytics dashboard contains all the detailed data and tools needed to execute these recommendations. 
            The system is designed to grow with your success.
          </p>
          <Link to="/dashboard">
    <button className="cta-button">
      <FaChartLine />
      View Full Analytics Dashboard
    </button>
  </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminAnalyticsPage;

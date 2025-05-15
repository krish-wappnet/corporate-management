import React, { useEffect, useState, useCallback } from 'react';
import { Card, Row, Col, Statistic, Spin, Typography, Progress, Table } from 'antd';
import { 
  MessageOutlined, 
  CheckCircleOutlined, 
  ClockCircleOutlined,
  StarOutlined,
  StarFilled,
  UserOutlined
} from '@ant-design/icons';
import { useAuth } from '../../hooks/useAuth';
import { useSnackbar } from 'notistack';
import { Bar, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title as ChartTitle,
  Tooltip,
  Legend,
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  ChartTitle,
  Tooltip,
  Legend
);

const { Title } = Typography;

interface FeedbackStats {
  total: number;
  pending: number;
  completed: number;
  categories: Record<string, number>;
  averageRating?: number;
}

interface RatingData {
  rating: number;
  count: number;
  percentage: number;
}

interface FeedbackRating {
  _id: number;
  count: number;
  percentage: number;
}

const FeedbackAnalytics: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [stats, setStats] = useState<FeedbackStats>({
    total: 0,
    pending: 0,
    completed: 0,
    categories: {},
    averageRating: 0
  });
  
  const [ratings, setRatings] = useState<RatingData[]>([
    { rating: 5, count: 0, percentage: 0 },
    { rating: 4, count: 0, percentage: 0 },
    { rating: 3, count: 0, percentage: 0 },
    { rating: 2, count: 0, percentage: 0 },
    { rating: 1, count: 0, percentage: 0 },
  ]);
  
  const { user } = useAuth();
  const { enqueueSnackbar } = useSnackbar();

  const fetchAnalytics = useCallback(async () => {
    if (!user?.id) {
      console.log('No user ID available');
      return;
    }
    
    try {
      console.log('Starting to fetch analytics data...');
      setLoading(true);
      
      const API_URL = import.meta.env.VITE_API_URL;
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('No authentication token found');
      }
      
      const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      };
      
      // Fetch stats
      console.log('Fetching stats from:', `${API_URL}/feedback/analytics/stats?userId=${user.id}`);
      const [statsResponse, ratingsResponse] = await Promise.all([
        fetch(
          `${API_URL}/feedback/analytics/stats?userId=${user.id}`, 
          { headers }
        ).then(async (res) => {
          if (!res.ok) {
            const error = await res.text();
            console.error('Stats API error:', error);
            throw new Error(`Stats API error: ${res.status} ${res.statusText}`);
          }
          return res.json();
        }),
        fetch(
          `${API_URL}/feedback/analytics/ratings/${user.id}`, 
          { headers }
        ).then(async (res) => {
          if (!res.ok) {
            const error = await res.text();
            console.error('Ratings API error:', error);
            throw new Error(`Ratings API error: ${res.status} ${res.statusText}`);
          }
          return res.json();
        })
      ]);
      
      console.log('API responses received:', { statsResponse, ratingsResponse });
      
      // Process the responses
      const [statsData, ratingsData] = [statsResponse, ratingsResponse];
      
      // Process stats data
      setStats({
        ...statsData,
        averageRating: statsData.averageRating || 0
      });
      
      // Process ratings data
      if (Array.isArray(ratingsData)) {
        const ratingMap = new Map<number, FeedbackRating>();
        let totalRatings = 0;
        
        // Initialize rating map
        for (let i = 1; i <= 5; i++) {
          ratingMap.set(i, { _id: i, count: 0, percentage: 0 });
        }
        
        // Update counts from API
        ratingsData.forEach((item: FeedbackRating) => {
          ratingMap.set(item._id, item);
          totalRatings += item.count;
        });
        
        // Calculate percentages
        const processedRatings = Array.from(ratingMap.values())
          .sort((a, b) => b._id - a._id)
          .map(rating => ({
            rating: rating._id,
            count: rating.count,
            percentage: totalRatings > 0 ? Math.round((rating.count / totalRatings) * 100) : 0
          }));
          
        setRatings(processedRatings);
      }
    } catch (error) {
      console.error('Error in fetchAnalytics:', error);
      enqueueSnackbar(
        error instanceof Error ? error.message : 'Failed to load analytics data', 
        { variant: 'error' }
      );
    } finally {
      console.log('Finished loading analytics data');
      setLoading(false);
    }
  }, [user?.id, enqueueSnackbar]);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <Spin size="large" tip="Loading analytics data..." />
        <p className="mt-4 text-gray-500">Please wait while we load your feedback analytics</p>
      </div>
    );
  }

  // Prepare data for charts
  const ratingDistributionData = {
    labels: ['5 Stars', '4 Stars', '3 Stars', '2 Stars', '1 Star'],
    datasets: [
      {
        label: 'Number of Ratings',
        data: ratings.map(r => r.count).reverse(),
        backgroundColor: [
          'rgba(75, 192, 192, 0.6)',
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 206, 86, 0.6)',
          'rgba(255, 159, 64, 0.6)',
          'rgba(255, 99, 132, 0.6)'
        ],
        borderColor: [
          'rgba(75, 192, 192, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(255, 159, 64, 1)',
          'rgba(255, 99, 132, 1)'
        ],
        borderWidth: 1,
      },
    ],
  };

  const categoryData = {
    labels: Object.keys(stats.categories).map(cat => 
      cat.charAt(0).toUpperCase() + cat.slice(1)
    ),
    datasets: [
      {
        label: 'Feedback by Category',
        data: Object.values(stats.categories),
        backgroundColor: [
          'rgba(53, 162, 235, 0.5)',
          'rgba(255, 99, 132, 0.5)',
          'rgba(75, 192, 192, 0.5)',
          'rgba(255, 159, 64, 0.5)',
          'rgba(153, 102, 255, 0.5)',
        ],
        borderColor: [
          'rgba(53, 162, 235, 1)',
          'rgba(255, 99, 132, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(255, 159, 64, 1)',
          'rgba(153, 102, 255, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const ratingColumns = [
    {
      title: 'Rating',
      dataIndex: 'rating',
      key: 'rating',
      render: (rating: number) => (
        <div className="flex items-center">
          {Array(5).fill(0).map((_, i) => (
            <StarFilled 
              key={i} 
              className={i < rating ? 'text-yellow-400' : 'text-gray-200'} 
            />
          ))}
          <span className="ml-2">{rating} Star{rating > 1 ? 's' : ''}</span>
        </div>
      ),
    },
    {
      title: 'Count',
      dataIndex: 'count',
      key: 'count',
      sorter: (a: RatingData, b: RatingData) => a.count - b.count,
    },
    {
      title: 'Percentage',
      dataIndex: 'percentage',
      key: 'percentage',
      render: (percentage: number) => (
        <div className="flex items-center">
          <Progress 
            percent={percentage} 
            showInfo={false} 
            strokeColor={
              percentage > 70 ? '#52c41a' : 
              percentage > 40 ? '#1890ff' : '#faad14'
            }
            className="w-24 mr-2"
          />
          <span>{percentage}%</span>
        </div>
      ),
      sorter: (a: RatingData, b: RatingData) => a.percentage - b.percentage,
    },
  ];

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <Title level={2} className="mb-0">Feedback Analytics</Title>
        <div className="flex items-center">
          <UserOutlined className="mr-2 text-gray-500" />
          <span className="text-gray-600">{user?.firstName || 'Your'} Dashboard</span>
        </div>
      </div>
      
      <Row gutter={[16, 16]} className="mb-6">
        <Col xs={24} sm={12} lg={6}>
          <Card className="h-full hover:shadow-md transition-shadow duration-300">
            <Statistic
              title="Total Feedback"
              value={stats.total}
              prefix={<MessageOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        
        <Col xs={24} sm={12} lg={6}>
          <Card className="h-full hover:shadow-md transition-shadow duration-300">
            <Statistic
              title="Completed"
              value={stats.completed}
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        
        <Col xs={24} sm={12} lg={6}>
          <Card className="h-full hover:shadow-md transition-shadow duration-300">
            <Statistic
              title="Pending"
              value={stats.pending}
              prefix={<ClockCircleOutlined />}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        
        <Col xs={24} sm={12} lg={6}>
          <Card className="h-full hover:shadow-md transition-shadow duration-300">
            <Statistic
              title="Average Rating"
              value={stats.averageRating?.toFixed(1) || 'N/A'}
              prefix={<StarOutlined />}
              valueStyle={{ color: '#fadb14' }}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} className="mb-6">
        <Col xs={24} lg={12}>
          <Card 
            title="Rating Distribution" 
            className="h-full"
            bodyStyle={{ height: 'calc(100% - 56px)' }}
          >
            <div className="h-64 flex items-center justify-center">
              {ratings.some(r => r.count > 0) ? (
                <Pie 
                  data={ratingDistributionData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        position: 'right',
                      },
                    },
                  }}
                />
              ) : (
                <div className="text-gray-400 text-center">No rating data available</div>
              )}
            </div>
          </Card>
        </Col>
        
        <Col xs={24} lg={12}>
          <Card 
            title="Feedback by Category"
            className="h-full"
            bodyStyle={{ height: 'calc(100% - 56px)' }}
          >
            <div className="h-64 flex items-center justify-center">
              {Object.keys(stats.categories).length > 0 ? (
                <Bar
                  data={categoryData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                      y: {
                        beginAtZero: true,
                        ticks: {
                          stepSize: 1,
                        },
                      },
                    },
                  }}
                />
              ) : (
                <div className="text-gray-400 text-center">No category data available</div>
              )}
            </div>
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} className="mb-6">
        <Col span={24}>
          <Card title="Detailed Rating Breakdown">
            <Table 
              columns={ratingColumns} 
              dataSource={ratings} 
              rowKey="rating"
              pagination={false}
              loading={loading}
            />
          </Card>
        </Col>
      </Row>
      
      <div className="mt-6">
        <Card title="Performance Summary">
          <div className="text-center py-8">
            <div className="text-5xl font-bold text-gray-800 mb-2">
              {stats.averageRating?.toFixed(1) || 'N/A'}
              <span className="text-2xl text-gray-500">/5</span>
            </div>
            <div className="flex justify-center mb-4">
              {Array(5).fill(0).map((_, i) => (
                <StarFilled 
                  key={i} 
                  className={
                    i < Math.round(stats.averageRating || 0) 
                      ? 'text-yellow-400 text-2xl' 
                      : 'text-gray-200 text-2xl'
                  } 
                />
              ))}
            </div>
            <div className="text-gray-600">
              Based on {stats.completed} completed feedbacks
            </div>
            {stats.completed > 0 && (
              <div className="mt-4">
                <div className="text-sm text-gray-500 mb-1">
                  {stats.averageRating && stats.averageRating >= 4 ? (
                    <span className="text-green-500">Excellent!</span>
                  ) : stats.averageRating && stats.averageRating >= 3 ? (
                    <span className="text-blue-500">Good job!</span>
                  ) : (
                    <span className="text-yellow-500">Room for improvement</span>
                  )}
                </div>
                <Progress 
                  percent={stats.averageRating ? (stats.averageRating / 5) * 100 : 0} 
                  showInfo={false} 
                  strokeColor={
                    stats.averageRating && stats.averageRating >= 4 ? '#52c41a' : 
                    stats.averageRating && stats.averageRating >= 3 ? '#1890ff' : '#faad14'
                  }
                />
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default FeedbackAnalytics;

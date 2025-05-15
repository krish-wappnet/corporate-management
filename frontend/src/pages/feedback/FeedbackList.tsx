import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Button, 
  Card, 
  Input, 
  Select, 
  Table, 
  Tag, 
  Badge, 
  Space, 
  Tooltip,
  Typography,
  Dropdown,
  Menu,
  message,
  Modal
} from 'antd';
import { 
  SearchOutlined, 
  PlusOutlined, 
  EyeOutlined, 
  EditOutlined, 
  DeleteOutlined,
  MoreOutlined
} from '@ant-design/icons';
import { getFeedbackRequests } from '../../api/feedbackApi';
import type { FeedbackRequest, RequestStatus } from '../../types/feedback.types';
import { FeedbackType } from '../../types/feedback.types';
import dayjs from 'dayjs';
import { useAuth } from '../../hooks/useAuth';

const getTypeLabel = (type: FeedbackType): string => {
  switch (type) {
    case FeedbackType.PEER:
      return 'Peer';
    case FeedbackType.MANAGER:
      return 'Manager';
    case FeedbackType.SELF:
      return 'Self';
    case FeedbackType.UPWARD:
      return 'Upward';
    case FeedbackType.THREE_SIXTY:
      return '360°';
    default:
      return type;
  }
};

const FeedbackList: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [requests, setRequests] = useState<FeedbackRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchFeedbackRequests = async () => {
    try {
      setLoading(true);
      const response = await getFeedbackRequests({
        page,
        limit: pageSize
      });
      
      console.log('=== API Response ===');
      console.log('Current User ID:', user?.id);
      console.log('All Requests:', response.items);
      
      // Filter for completed requests
      const userCompletedRequests = response.items.filter(
        (request: FeedbackRequest) => {
          const isCompleted = request.status === 'completed';
          
          console.log('--- Request ---');
          console.log('Request ID:', request.id);
          console.log('Status:', request.status, isCompleted ? '✅' : '❌');
          console.log('Should Show:', isCompleted ? '✅' : '❌');
          
          return isCompleted;
        }
      );
      
      console.log('=== Filtered Results ===');
      console.log('Total Requests:', response.items.length);
      console.log('Completed Requests:', userCompletedRequests.length);
      console.log('Filtered Requests:', userCompletedRequests);
      
      setRequests(userCompletedRequests);
      setTotal(userCompletedRequests.length);
    } catch (error) {
      console.error('Error fetching feedback requests:', error);
      message.error('Failed to load feedback requests');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeedbackRequests();
  }, [page, pageSize]);



  const columns = [
    {
      title: 'Requested By',
      dataIndex: 'requester',
      key: 'requester',
      render: (requester: any) => (
        <span>{requester ? `${requester.firstName} ${requester.lastName}` : 'N/A'}</span>
      ),
    },
    {
      title: 'Subject',
      dataIndex: 'subject',
      key: 'subject',
      render: (subject: any) => (
        <span>{subject ? `${subject.firstName} ${subject.lastName}` : 'N/A'}</span>
      ),
    },
    {
      title: 'Message',
      dataIndex: 'message',
      key: 'message',
      render: (message: string) => message || 'No message',
    },
    {
      title: 'Due Date',
      dataIndex: 'dueDate',
      key: 'dueDate',
      render: (date: string) => dayjs(date).format('MMM D, YYYY'),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={
          status === 'completed' ? 'green' : 
          status === 'declined' ? 'red' : 
          status === 'expired' ? 'default' : 'orange'
        }>
          {status.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: FeedbackRequest) => (
        <Button 
          type="primary" 
          onClick={() => navigate(`/feedback/new?requestId=${record.id}`)}
          disabled={record.status !== 'completed'}
        >
          Write Feedback
        </Button>
      ),
    },
  ];

  console.log('Rendering with requests:', requests);
  
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <Typography.Title level={2} className="mb-1">Feedback Requests</Typography.Title>
          <Typography.Text type="secondary">Approved feedback requests for you to provide feedback</Typography.Text>
        </div>
      </div>



      <Card>
        <Table
          columns={columns}
          dataSource={requests}
          rowKey="id"
          loading={loading}
          pagination={{
            current: page,
            pageSize: pageSize,
            total,
            showSizeChanger: true,
            pageSizeOptions: ['5', '10', '25'],
            onChange: (page, pageSize) => {
              setPage(page);
              setPageSize(pageSize);
            },
          }}
          locale={{
            emptyText: 'No feedback found'
          }}
        />
      </Card>
    </div>
  );
};

export default FeedbackList;

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
import { getFeedbackList } from '../../api/feedbackApi';
import type { Feedback } from '../../types/feedback.types';
import { FeedbackStatus, FeedbackType } from '../../types/feedback.types';
import dayjs from 'dayjs';

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
  
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [total, setTotal] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    type: '',
    status: '',
    fromUserId: '',
    toUserId: '',
    cycleId: ''
  });

  const fetchFeedbacks = async () => {
    try {
      setLoading(true);
      const params = {
        page: page + 1,
        limit: rowsPerPage,
        ...(searchTerm && { search: searchTerm }),
        ...(filters.type && { type: (filters.type as FeedbackType) || undefined }),
        ...(filters.status && { status: (filters.status as FeedbackStatus) || undefined }),
        ...(filters.fromUserId && { fromUserId: filters.fromUserId }),
        ...(filters.toUserId && { toUserId: filters.toUserId }),
        ...(filters.cycleId && { cycleId: filters.cycleId }),
      };
      
      const data = await getFeedbackList(params);
      setFeedbacks(data.items);
      setTotal(data.total);
    } catch (error) {
      console.error('Error fetching feedbacks:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeedbacks();
  }, [page, rowsPerPage, filters]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchFeedbacks();
    }, 500);
    
    return () => clearTimeout(timer);
  }, [searchTerm, filters]);

  const getTypeLabel = (type: FeedbackType) => {
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

  const columns = [
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      render: (type: FeedbackType) => (
        <Tag color={type === FeedbackType.MANAGER ? 'blue' : 'default'} className="capitalize">
          {getTypeLabel(type)}
        </Tag>
      ),
    },
    {
      title: 'From',
      dataIndex: 'fromUser',
      key: 'from',
      render: (fromUser: any, record: Feedback) => (
        <span>{record.isAnonymous ? 'Anonymous' : fromUser?.firstName || 'N/A'}</span>
      ),
    },
    {
      title: 'To',
      dataIndex: 'toUser',
      key: 'to',
      render: (toUser: any) => (
        <span>{toUser ? `${toUser.firstName} ${toUser.lastName}` : 'N/A'}</span>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: FeedbackStatus) => {
        const statusConfig = {
          [FeedbackStatus.DRAFT]: { color: 'default', text: 'Draft' },
          [FeedbackStatus.SUBMITTED]: { color: 'processing', text: 'Submitted' },
          [FeedbackStatus.ACKNOWLEDGED]: { color: 'success', text: 'Acknowledged' },
        }[status] || { color: 'default', text: status };
        
        return <Badge status={statusConfig.color as any} text={statusConfig.text} />;
      },
    },
    {
      title: 'Date',
      dataIndex: 'createdAt',
      key: 'date',
      render: (date: string) => dayjs(date).format('MMM D, YYYY'),
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 120,
      render: (_: any, record: Feedback) => {
        const menu = (
          <Menu>
            <Menu.Item 
              key="view" 
              icon={<EyeOutlined />}
              onClick={() => navigate(`/feedback/${record.id}`)}
            >
              View Details
            </Menu.Item>
            <Menu.Item 
              key="edit" 
              icon={<EditOutlined />}
              onClick={() => navigate(`/feedback/${record.id}/edit`)}
              disabled={record.status !== FeedbackStatus.DRAFT}
            >
              Edit
            </Menu.Item>
            <Menu.Item 
              key="delete" 
              icon={<DeleteOutlined />}
              danger
              disabled={record.status !== FeedbackStatus.DRAFT}
              onClick={() => {
                Modal.confirm({
                  title: 'Delete Feedback',
                  content: 'Are you sure you want to delete this feedback?',
                  okText: 'Yes, delete it',
                  okType: 'danger',
                  cancelText: 'No, keep it',
                  onOk: async () => {
                    // Implement delete functionality
                    // await deleteFeedback(record.id);
                    message.success('Feedback deleted successfully');
                    fetchFeedbacks();
                  },
                });
              }}
            >
              Delete
            </Menu.Item>
          </Menu>
        );
        
        return (
          <Space size="middle">
            <Tooltip title="View">
              <Button 
                type="text" 
                icon={<EyeOutlined />} 
                onClick={() => navigate(`/feedback/${record.id}`)}
              />
            </Tooltip>
            <Dropdown overlay={menu} trigger={['click']}>
              <Button type="text" icon={<MoreOutlined />} />
            </Dropdown>
          </Space>
        );
      },
    },
  ];

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <Typography.Title level={2} className="mb-1">Feedback</Typography.Title>
          <Typography.Text type="secondary">Manage and review feedback</Typography.Text>
        </div>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => navigate('/feedback/new')}
          className="bg-blue-600 hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 rounded-lg"
        >
          New Feedback
        </Button>
      </div>

      <Card className="mb-6">
        <div className="flex flex-col md:flex-row gap-4 p-4">
          <Input
            placeholder="Search feedback..."
            prefix={<SearchOutlined className="text-gray-400" />}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full md:w-64"
          />
          <Select
            placeholder="Type"
            className="w-full md:w-48"
            value={filters.type || undefined}
            onChange={(value) => setFilters({...filters, type: value})}
            allowClear
          >
            {Object.entries(FeedbackType).map(([key, value]) => (
              <Select.Option key={key} value={value}>
                {getTypeLabel(value)}
              </Select.Option>
            ))}
          </Select>
          <Select
            placeholder="Status"
            className="w-full md:w-48"
            value={filters.status || undefined}
            onChange={(value) => setFilters({...filters, status: value})}
            allowClear
          >
            {Object.entries(FeedbackStatus).map(([key, value]) => (
              <Select.Option key={key} value={value}>
                {value.charAt(0).toUpperCase() + value.slice(1)}
              </Select.Option>
            ))}
          </Select>
        </div>
      </Card>

      <Card>
        <Table
          columns={columns}
          dataSource={feedbacks}
          rowKey="id"
          loading={loading}
          pagination={{
            current: page + 1,
            pageSize: rowsPerPage,
            total,
            showSizeChanger: true,
            pageSizeOptions: ['5', '10', '25'],
            onChange: (page, pageSize) => {
              setPage(page - 1);
              setRowsPerPage(pageSize);
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

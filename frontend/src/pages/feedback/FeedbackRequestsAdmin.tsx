import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Table, 
  Button, 
  Space, 
  message, 
  Input, 
  Tag, 
  Spin,
  Popconfirm,
  Tooltip,
  Select,
  Modal
} from 'antd';
import { 
  SearchOutlined, 
  ReloadOutlined, 
  CheckCircleOutlined, 
  CloseCircleOutlined,
  EyeOutlined
} from '@ant-design/icons';
import type { PaginationProps } from 'antd';
import type { 
  RequestStatus, 
  FeedbackRequest,
  User
} from '../../types/feedback.types';
import { 
  getFeedbackRequests, 
  respondToFeedbackRequest
} from '../../api/feedbackApi';

const FeedbackRequestsAdmin: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filterLoading, setFilterLoading] = useState(false);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 });
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState<RequestStatus | undefined>(undefined);
  // State for tracking the selected request (currently not used but kept for future use)
  const [selectedRequest, setSelectedRequest] = useState<FeedbackRequest | null>(null);
  // Keep this state for future use when implementing the view modal
  const [, setIsViewModalVisible] = useState(false);
  const [isDeclineModalVisible, setIsDeclineModalVisible] = useState(false);
  const [declineReason, setDeclineReason] = useState('');
  const [data, setData] = useState<FeedbackRequest[]>([]);
  const navigate = useNavigate();

  const fetchRequests = useCallback(async (page = 1, pageSize = 10) => {
    try {
      setLoading(true);
      setRefreshing(true);
      
      console.log('Fetching requests with:', { page, pageSize, status: statusFilter });
      
      const response = await getFeedbackRequests({
        page,
        limit: pageSize,
        status: statusFilter,
      });

      console.log('API Response:', response);

      // Apply client-side search if searchText is not empty
      let filteredData = response.items || [];
      if (searchText) {
        const searchLower = searchText.toLowerCase();
        filteredData = filteredData.filter(
          (request: FeedbackRequest) =>
            (request.requester?.name || '').toLowerCase().includes(searchLower) ||
            (request.recipient?.name || '').toLowerCase().includes(searchLower) ||
            (request.subject?.name || '').toLowerCase().includes(searchLower) ||
            (request.message || '').toLowerCase().includes(searchLower)
        );
      }

      setData(filteredData);
      setPagination(prev => ({
        ...prev,
        total: response.total,
        current: page,
        pageSize: pageSize,
      }));
    } catch (error) {
      console.error('Error fetching feedback requests:', error);
      message.error('Failed to fetch feedback requests. Please try again.');
      setData([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [searchText, statusFilter]);

  // Add this effect to log the current user's roles
  useEffect(() => {
    console.log('Current user roles:');
    // Initial fetch
    fetchRequests(1, 10);
  }, [fetchRequests]);

  const handleApprove = async (id: string): Promise<void> => {
    try {
      setLoading(true);
      const response = await respondToFeedbackRequest(id, true);
      console.log('Approve response:', response);
      
      if (response.success) {
        message.success(response.message || 'Feedback request approved successfully');
        fetchRequests(pagination.current, pagination.pageSize);
      } else {
        message.warning(response.message || 'Failed to approve feedback request');
      }
    } catch (error) {
      console.error('Error approving feedback request:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to approve feedback request';
      message.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleDecline = async (id: string, reason: string = ''): Promise<void> => {
    try {
      setLoading(true);
      const response = await respondToFeedbackRequest(id, false, reason);
      console.log('Decline response:', response);
      
      if (response.success) {
        message.success(response.message || 'Feedback request declined successfully');
        fetchRequests(pagination.current, pagination.pageSize);
        setIsDeclineModalVisible(false);
        setDeclineReason('');
      } else {
        message.warning(response.message || 'Failed to decline feedback request');
      }
    } catch (error) {
      console.error('Error declining feedback request:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to decline feedback request';
      message.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const showDeclineModal = (record: FeedbackRequest) => {
    setSelectedRequest(record);
    setIsDeclineModalVisible(true);
  };

  const handleDeclineConfirm = () => {
    if (selectedRequest) {
      handleDecline(selectedRequest.id, declineReason);
    }
  };

  const handleTableChange: PaginationProps['onChange'] = (page, pageSize) => {
    fetchRequests(page, pageSize);
  };

  const handleStatusFilterChange = (value: RequestStatus | undefined): void => {
    setStatusFilter(value);
    setFilterLoading(true);
    fetchRequests(1, pagination.pageSize).finally(() => {
      setFilterLoading(false);
    });
  };

  const handleSearch = () => {
    fetchRequests(1, pagination.pageSize);
  };

  const handleRefresh = () => {
    fetchRequests(pagination.current, pagination.pageSize);
  };

  const getUserDisplayName = (user: Partial<User> | string | undefined): string => {
    if (!user) return 'N/A';
    if (typeof user === 'string') return user;
    if (user.firstName || user.lastName) {
      return `${user.firstName || ''} ${user.lastName || ''}`.trim();
    }
    return user.email || 'Unknown User';
  };

  const columns = [
    {
      title: 'Requester',
      dataIndex: 'requesterId',
      key: 'requester',
      render: (_: any, record: FeedbackRequest) => (
        <span>{getUserDisplayName(record.requester) || `User (${record.requesterId})`}</span>
      ),
    },
    {
      title: 'Recipient',
      dataIndex: 'recipientId',
      key: 'recipient',
      render: (_: any, record: FeedbackRequest) => (
        <span>{getUserDisplayName(record.recipient) || `User (${record.recipientId})`}</span>
      ),
    },
    {
      title: 'Subject',
      dataIndex: 'subjectId',
      key: 'subject',
      render: (_: any, record: FeedbackRequest) => (
        <span>{getUserDisplayName(record.subject) || `User (${record.subjectId})`}</span>
      ),
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      render: (type: FeedbackType) => <Tag color="blue">{type}</Tag>,
      filters: [
        { text: 'Peer', value: FeedbackType.PEER },
        { text: 'Manager', value: FeedbackType.MANAGER },
        { text: 'Self', value: FeedbackType.SELF },
        { text: 'Upward', value: FeedbackType.UPWARD },
        { text: '360°', value: FeedbackType.THREE_SIXTY },
      ],
      onFilter: (value: any, record) => record.type === value,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: RequestStatus) => <Tag color="blue">{status}</Tag>,
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }: any) => (
        <div style={{ padding: 8 }}>
          <Select
            style={{ width: 200, marginBottom: 8, display: 'block' }}
            placeholder="Select status"
            value={selectedKeys[0]}
            onChange={value => {
              setSelectedKeys(value ? [value] : []);
              confirm();
              handleStatusFilterChange(value || undefined);
            }}
            allowClear
            loading={filterLoading}
            disabled={loading}
          >
            <Select.Option value="pending">Pending</Select.Option>
            <Select.Option value="approved">Approved</Select.Option>
            <Select.Option value="declined">Declined</Select.Option>
            <Select.Option value="completed">Completed</Select.Option>
            <Select.Option value="expired">Expired</Select.Option>
          </Select>
          <Button
            size="small"
            style={{ width: 90, marginRight: 8 }}
            onClick={() => {
              clearFilters();
              handleStatusFilterChange(undefined);
            }}
          >
            Reset
          </Button>
        </div>
      ),
    },
    {
      title: 'Due Date',
      dataIndex: 'dueDate',
      key: 'dueDate',
      render: (date: string) => date,
      sorter: (a: FeedbackRequest, b: FeedbackRequest) => 
        new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime(),
    },
    {
      title: 'Requested On',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: string) => date,
      sorter: (a: FeedbackRequest, b: FeedbackRequest) => 
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: FeedbackRequest) => (
        <Space size="middle">
          {record.status === 'pending' && (
            <>
              <Tooltip title="Approve">
                <Button 
                  type="text" 
                  icon={<CheckCircleOutlined style={{ color: '#52c41a' }} />} 
                  onClick={() => handleApprove(record.id)}
                  disabled={loading}
                />
              </Tooltip>
              <Tooltip title="Decline">
                <Button 
                  type="text" 
                  danger 
                  icon={<CloseCircleOutlined />}
                  onClick={() => showDeclineModal(record)}
                  disabled={loading}
                />
              </Tooltip>
            </>
          )}
          <Button 
            type="link" 
            onClick={() => navigate(`/feedback/requests/${record.id}`)}
            icon={<EyeOutlined />}
          >
            View
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div style={{ marginBottom: 16, display: 'flex', gap: 8 }}>
        <Input
          placeholder="Search by name or message"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          style={{ width: 300 }}
          onPressEnter={handleSearch}
          disabled={loading}
        />
        <Button 
          type="primary" 
          icon={<SearchOutlined />} 
          onClick={handleSearch}
          loading={loading}
        >
          Search
        </Button>
        <Button 
          onClick={() => {
            setSearchText('');
            setStatusFilter(undefined);
            fetchRequests(1, pagination.pageSize);
          }}
          disabled={loading}
        >
          Reset
        </Button>
        <Button 
          icon={<ReloadOutlined spin={refreshing} />} 
          onClick={handleRefresh}
          disabled={loading}
        >
          Refresh
        </Button>
      </div>
      <div style={{ position: 'relative' }}>
        {loading && !refreshing && (
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(255, 255, 255, 0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 10 }}>
            <Spin size="large" />
          </div>
        )}
        <Table
          columns={columns}
          dataSource={data}
          rowKey="id"
          pagination={{
            ...pagination,
            showSizeChanger: true,
            showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
            onChange: (page, pageSize) => handleTableChange(page, pageSize as number),
            onShowSizeChange: (current, size) => handleTableChange(1, size)
          }}
          loading={loading && !refreshing}
          locale={{
            emptyText: loading ? 'Loading...' : 'No data'
          }}
          scroll={{ x: 1300 }}
        />
      </div>

      {/* Decline Confirmation Modal */}
      <Modal
        title="Decline Feedback Request"
        open={isDeclineModalVisible}
        onOk={handleDeclineConfirm}
        onCancel={() => {
          setIsDeclineModalVisible(false);
          setDeclineReason('');
        }}
        confirmLoading={loading}
        okText="Confirm Decline"
        okButtonProps={{ danger: true }}
      >
        <p>Are you sure you want to decline this feedback request?</p>
        <p>Please provide a reason (optional):</p>
        <Input.TextArea
          rows={3}
          value={declineReason}
          onChange={(e) => setDeclineReason(e.target.value)}
          placeholder="Reason for declining..."
          disabled={loading}
        />
      </Modal>
    </div>
  );
};

export default FeedbackRequestsAdmin;

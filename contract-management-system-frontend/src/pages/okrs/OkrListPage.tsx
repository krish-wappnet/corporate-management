import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Table, Card, Button, Input, Select, Row, Col, Badge, message, Typography } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import type { TablePaginationConfig } from 'antd/es/table';
import type { ColumnsType } from 'antd/es/table';
import type { Okr, OkrFilterParams, OkrStatus, OkrType } from '../../types/okr';

// Mock user data for display
const mockUsers: Record<string, { name: string; email: string }> = {
  user1: { name: 'John Doe', email: 'john@example.com' },
  user2: { name: 'Jane Smith', email: 'jane@example.com' },
  user3: { name: 'Robert Johnson', email: 'robert@example.com' },
  user4: { name: 'Emily Chen', email: 'emily@example.com' },
  user5: { name: 'Michael Brown', email: 'michael@example.com' },
};

// Mock data for OKRs with status values matching OkrStatus type
const mockOkrs: Okr[] = [
  {
    id: '1',
    title: 'Increase Product Adoption',
    description: 'Improve product adoption rate by 30%',
    type: 'company',
    status: 'active',
    startDate: '2025-01-01',
    endDate: '2025-12-31',
    userId: 'user1',
    frequency: 'annual',
    keyResults: [],
    progress: 45,
    createdAt: '2024-12-15',
    updatedAt: '2025-05-15',
  },
  {
    id: '2',
    title: 'Enhance Customer Support',
    description: 'Achieve 95% customer satisfaction rate',
    type: 'team',
    status: 'completed',
    startDate: '2025-01-15',
    endDate: '2025-06-30',
    userId: 'user2',
    frequency: 'quarterly',
    keyResults: [],
    progress: 100,
    createdAt: '2024-12-20',
    updatedAt: '2025-05-10',
  },
  {
    id: '3',
    title: 'Expand to New Markets',
    description: 'Launch product in 3 new countries',
    type: 'company',
    status: 'active',
    startDate: '2025-03-01',
    endDate: '2025-09-30',
    userId: 'user3',
    frequency: 'custom',
    keyResults: [],
    progress: 30,
    createdAt: '2025-02-10',
    updatedAt: '2025-05-18',
  },
  {
    id: '4',
    title: 'Improve Code Quality',
    description: 'Reduce critical bugs by 50%',
    type: 'team',
    status: 'active',
    startDate: '2025-02-15',
    endDate: '2025-08-31',
    userId: 'user4',
    frequency: 'quarterly',
    keyResults: [],
    progress: 65,
    createdAt: '2025-01-20',
    updatedAt: '2025-05-12',
  },
  {
    id: '5',
    title: 'Team Training Program',
    description: 'Train team on new technologies',
    type: 'team',
    status: 'draft',
    startDate: '2025-04-01',
    endDate: '2025-10-31',
    userId: 'user5',
    frequency: 'custom',
    keyResults: [],
    progress: 0,
    createdAt: '2025-03-15',
    updatedAt: '2025-05-01',
  },
];

const { Option } = Select;

const OkrListPage: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, setError] = useState<string | null>(null);
  const [okrs, setOkrs] = useState<Okr[]>([]);
  const [search, setSearch] = useState("");
  const [pagination, setPagination] = useState<TablePaginationConfig>({
    current: 1,
    pageSize: 10,
    total: 0,
    showSizeChanger: true,
    pageSizeOptions: ["10", "20", "50", "100"],
  });
  const [filters, setFilters] = useState<OkrFilterParams>({
    page: 1,
    limit: 10,
    status: undefined,
    type: undefined,
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 500));
        setOkrs(mockOkrs);
      } catch (err) {
        setError('Failed to load OKRs');
        message.error('Failed to load OKRs');
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setSearch(value);
      setPagination(prev => ({ ...prev, current: 1 }));
    },
    []
  );

  const handleStatusChange = useCallback(
    (status: string) => {
      setFilters(prev => ({
        ...prev,
        status: status as OkrStatus || undefined,
      }));
      setPagination(prev => ({ ...prev, current: 1 }));
    },
    []
  );

  const handleTypeChange = useCallback(
    (type: string) => {
      setFilters(prev => ({
        ...prev,
        type: type as OkrType || undefined,
      }));
      setPagination(prev => ({ ...prev, current: 1 }));
    },
    []
  );

  const handleTableChange = useCallback(
    (newPagination: TablePaginationConfig) => {
      const currentPage = newPagination.current || 1;
      const pageSize = newPagination.pageSize || 10;

      // Update pagination state
      if (
        pagination.current !== currentPage ||
        pagination.pageSize !== pageSize
      ) {
        setPagination((prev) => ({
          ...prev,
          current: currentPage,
          pageSize: pageSize,
        }));
      }
    },
    [pagination]
  );

  const filteredOkrs = useMemo(() => {
    let result = [...okrs];

    // Apply search filter
    if (search) {
      const searchLower = search.toLowerCase();
      result = result.filter(okr =>
        okr.title.toLowerCase().includes(searchLower) ||
        (okr.description?.toLowerCase().includes(searchLower) || false)
      );
    }

    // Apply status filter
    if (filters.status) {
      result = result.filter(okr => okr.status === filters.status);
    }

    // Apply type filter
    if (filters.type) {
      result = result.filter(okr => okr.type === filters.type);
    }

    // Apply pagination
    const start = ((pagination.current || 1) - 1) * (pagination.pageSize || 10);
    const end = start + (pagination.pageSize || 10);

    return {
      data: result.slice(start, end),
      total: result.length
    };
  }, [search, filters.status, filters.type, pagination.current, pagination.pageSize, okrs]);

  const columns: ColumnsType<Okr> = [
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
      render: (text: string, record: Okr) => (
        <Link to={`/okrs/${record.id}`}>{text}</Link>
      ),
    },
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
      render: (type: string) => type.charAt(0).toUpperCase() + type.slice(1),
    },
    {
      title: "Owner",
      dataIndex: "userId",
      key: "owner",
      render: (userId: string) => mockUsers[userId]?.name || 'Unknown',
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: string) => (
        <Badge
          status={
            status === "completed"
              ? "success"
              : status === "active"
              ? "processing"
              : status === "draft"
              ? "default"
              : "warning"
          }
          text={status.charAt(0).toUpperCase() + status.slice(1)}
        />
      ),
    },
    {
      title: "Progress",
      dataIndex: "progress",
      key: "progress",
      render: (progress?: number) => `${progress || 0}%`,
    },
    {
      title: "Start Date",
      dataIndex: "startDate",
      key: "startDate",
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
    {
      title: "End Date",
      dataIndex: "endDate",
      key: "endDate",
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: unknown, record: Okr) => (
        <div className="space-x-2">
          <Button
            type="link"
            size="small"
            onClick={() => navigate(`/okrs/${record.id}`)}
          >
            View
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => navigate(`/okrs/${record.id}/edit`)}
          >
            Edit
          </Button>
        </div>
      ),
    },
  ];

  return (
    <Card>
      <div className="flex justify-between items-center mb-4">
        <Typography.Title level={4} className="mb-0">
          OKRs
        </Typography.Title>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => navigate("/okrs/new")}
        >
          Create OKR
        </Button>
      </div>

      <div className="mb-4">
        <Row gutter={16}>
          <Col span={8}>
            <Input
              placeholder="Search OKRs..."
              value={search}
              onChange={handleSearchChange}
              style={{ width: '100%' }}
              allowClear
            />
          </Col>
          <Col span={8}>
            <Select
              placeholder="Filter by status"
              allowClear
              style={{ width: '100%' }}
              onChange={handleStatusChange}
              value={filters.status}
            >
              <Option value="draft">Draft</Option>
              <Option value="active">Active</Option>
              <Option value="completed">Completed</Option>
              <Option value="cancelled">Cancelled</Option>
            </Select>
          </Col>
          <Col span={8}>
            <Select
              placeholder="Filter by type"
              allowClear
              style={{ width: '100%' }}
              onChange={handleTypeChange}
              value={filters.type}
            >
              <Option value="individual">Individual</Option>
              <Option value="team">Team</Option>
              <Option value="company">Company</Option>
              <Option value="department">Department</Option>
            </Select>
          </Col>
        </Row>
      </div>

      <Table
        columns={columns}
        dataSource={filteredOkrs.data}
        rowKey="id"
        loading={loading}
        pagination={{
          ...pagination,
          total: filteredOkrs.total,
          showTotal: (total) => `Total ${total} items`,
          pageSizeOptions: ['10', '20', '50', '100'],
        }}
        onChange={handleTableChange}
      />
    </Card>
  );
};

export default OkrListPage;

import React, { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import type { AppDispatch } from '../../store/store';
import { fetchOKRs, selectOKRs, selectOKRsLoading, selectOKRsError, selectTotalOKRs, selectOKRFilters } from '../../store/slices/okrSlice';
import type { Okr, OkrFilterParams } from '../../types/okr';
import { Table, Button, Input, Select, Card, Typography, Badge, message, Row, Col } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import type { TablePaginationConfig } from 'antd/es/table/interface';

const { Title } = Typography;
const { Option } = Select;

const OkrListPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  // Status filter is now handled by filters.status
  const [pagination, setPagination] = useState<TablePaginationConfig>({
    current: 1, 
    pageSize: 10,
    total: 0,
    showSizeChanger: true,
    pageSizeOptions: ['10', '20', '50', '100']
  });
  
  // Get filters from Redux store with proper type and default values
  const reduxFilters = useSelector(selectOKRFilters) as OkrFilterParams | undefined;
  // Memoize filters to prevent unnecessary re-renders
  const filters: OkrFilterParams = React.useMemo(() => ({
    ...(reduxFilters || {}),
    page: reduxFilters?.page || 1,
    limit: reduxFilters?.limit || 10,
    search: reduxFilters?.search,
    status: reduxFilters?.status
  } as OkrFilterParams), [reduxFilters]);
  const okrs = useSelector(selectOKRs) as Okr[];
  const loading = useSelector(selectOKRsLoading);
  const error = useSelector(selectOKRsError);
  const total = useSelector(selectTotalOKRs);

  useEffect(() => {
    dispatch(fetchOKRs(filters));
  }, [dispatch, filters]);

  useEffect(() => {
    if (error) {
      message.error(error.toString());
    }
  }, [error]);

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearch(value);
    
    // Create new filters without search and page to avoid circular dependencies
    const { search, page, ...restFilters } = filters;
    
    setPagination(prev => ({ ...prev, current: 1 }));
    dispatch(fetchOKRs({ ...restFilters, search: value, page: 1 }));
  }, [dispatch, filters.search, filters.page]);

  const handleStatusChange = useCallback((status: string) => {
    // Create new filters without status and page to avoid circular dependencies
    const { status: _, page, ...restFilters } = filters;
    
    const updatedFilters: OkrFilterParams = { 
      ...restFilters, 
      status: status,
      page: 1 // Reset to first page when changing status
    };
    
    setPagination(prev => ({ ...prev, current: 1 }));
    dispatch(fetchOKRs(updatedFilters));
  }, [dispatch, filters.status, filters.page]);

  const handleTableChange = useCallback((newPagination: TablePaginationConfig) => {
    const currentPage = newPagination.current || 1;
    const pageSize = newPagination.pageSize || 10;
    
    // Create new filters without page and limit to avoid circular dependencies
    const { page, limit, ...restFilters } = filters;
    
    const updatedFilters: OkrFilterParams = { 
      ...restFilters, 
      page: currentPage, 
      limit: pageSize
    };
    
    // Only update pagination if the values have actually changed
    if (pagination.current !== currentPage || pagination.pageSize !== pageSize) {
      setPagination(prev => ({
        ...prev,
        current: currentPage,
        pageSize: pageSize
      }));
      
      dispatch(fetchOKRs(updatedFilters));
    }
  }, [dispatch, filters, pagination.current, pagination.pageSize]);

  const columns: ColumnsType<Okr> = [
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
      render: (text: string, record: Okr) => (
        <Link to={`/okrs/${record.id}`}>{text}</Link>
      ),
    },
    {
      title: 'Owner',
      dataIndex: ['owner', 'name'],
      key: 'owner',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Badge
          status={
            status === 'Completed' ? 'success' :
            status === 'In Progress' ? 'processing' :
            status === 'At Risk' ? 'warning' : 'default'
          }
          text={status}
        />
      ),
    },
    {
      title: 'Progress',
      dataIndex: 'progress',
      key: 'progress',
      render: (progress: number) => `${progress}%`,
    },
    {
      title: 'Start Date',
      dataIndex: 'startDate',
      key: 'startDate',
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
    {
      title: 'End Date',
      dataIndex: 'endDate',
      key: 'endDate',
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: any) => (
        <div className="space-x-2">
          <Button type="link" size="small" onClick={() => window.location.href = `/okrs/${record.id}`}>
            View
          </Button>
          <Button type="link" size="small" onClick={() => window.location.href = `/okrs/${record.id}/edit`}>
            Edit
          </Button>
        </div>
      ),
    },
  ];

  return (
    <Card>
      <div className="flex justify-between items-center mb-4">
        <Title level={4} className="mb-0">OKRs</Title>
        <Button 
          type="primary" 
          icon={<PlusOutlined />}
          onClick={() => navigate('/okrs/new')}
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
              style={{ width: 200, marginRight: 16 }}
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
              defaultValue={undefined}
            >
              <Option value="draft">Draft</Option>
              <Option value="active">Active</Option>
              <Option value="completed">Completed</Option>
              <Option value="cancelled">Cancelled</Option>
            </Select>
          </Col>
        </Row>
      </div>

      <Table<Okr>
        columns={columns}
        dataSource={okrs || []}
        rowKey="id"
        loading={loading as boolean}
        pagination={{
          current: pagination.current,
          pageSize: pagination.pageSize,
          total: total || 0,
          showSizeChanger: true,
          pageSizeOptions: ['10', '20', '50', '100'],
        }}
        onChange={handleTableChange}
      />
    </Card>
  );
};

export default OkrListPage;

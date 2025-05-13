import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../store/store';
import { 
  fetchKpis, 
  setFilters, 
  fetchCategories,
  deleteKpi 
} from '../../store/slices/kpiSlice';
import type { Kpi } from '../../types/kpi';
import type { PaginationParams } from '../../types/kpi';
import { KpiStatus } from '../../types/kpi';
import { Button, Table, Space, Tag, Select, Input, DatePicker, Card, Row, Col, Typography, Popconfirm, message } from 'antd';
import { PlusOutlined, SearchOutlined, FilterOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

const { Title } = Typography;
const { RangePicker } = DatePicker;
const { Option } = Select;

const KpiListPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { kpis, loading, pagination, filters, categories } = useAppSelector((state) => state.kpis);

  // Debug log the data
  useEffect(() => {
    console.log('KPI Data:', kpis);
    console.log('Categories:', categories);
    console.log('Loading:', loading);
    console.log('Pagination:', pagination);
    console.log('Filters:', filters);
  }, [kpis, categories, loading, pagination, filters]);
  
  const [searchText, setSearchText] = useState('');
  const [dateRange, setDateRange] = useState<any>(null);
  
  const loadKpis = useCallback(async () => {
    try {
      console.log('Fetching KPIs with params:', { 
        page: pagination.page, 
        limit: pagination.limit,
        filters 
      });
      
      const resultAction = await dispatch(fetchKpis({ 
        pagination: { 
          page: pagination.page, 
          limit: pagination.limit 
        },
        filters
      }));
      
      if (fetchKpis.fulfilled.match(resultAction)) {
        console.log('Fetched KPIs:', resultAction.payload);
      } else if (fetchKpis.rejected.match(resultAction)) {
        console.error('Failed to fetch KPIs:', resultAction.payload || resultAction.error);
      }
    } catch (error) {
      console.error('Error in loadKpis:', error);
    }
  }, [dispatch, pagination.page, pagination.limit, filters]);
  
  useEffect(() => {
    loadKpis();
    dispatch(fetchCategories());
  }, [loadKpis]);

  const handleTableChange = (tablePagination: any, _: any, sorter: any) => {
    console.log('Table changed:', { tablePagination, sorter });
    
    // Update pagination with sorting
    const paginationParams: PaginationParams = {
      page: tablePagination.current,
      limit: tablePagination.pageSize,
    };
    
    // Add sorting if specified
    if (sorter.field) {
      paginationParams.sortBy = sorter.field;
      paginationParams.sortOrder = sorter.order === 'ascend' ? 'asc' : 'desc';
    }
    
    // Dispatch fetch with updated pagination and filters
    dispatch(fetchKpis({
      pagination: paginationParams,
      filters: { ...filters }, // Keep existing filters
    }));
  };

  const handleSearch = () => {
    dispatch(
      setFilters({
        ...filters,
        search: searchText,
        startDate: dateRange?.[0]?.format('YYYY-MM-DD'),
        endDate: dateRange?.[1]?.format('YYYY-MM-DD'),
      })
    );
  };

  const handleStatusChange = (status: KpiStatus | undefined) => {
    dispatch(
      setFilters({
        ...filters,
        status,
      })
    );
  };

  const handleCategoryChange = (categoryId: string | undefined) => {
    dispatch(
      setFilters({
        ...filters,
        categoryId,
      })
    );
  };

  const handleDelete = async (id: string) => {
    try {
      await dispatch(deleteKpi(id)).unwrap();
      message.success('KPI deleted successfully');
    } catch (error) {
      message.error('Failed to delete KPI');
    }
  };

  const columns = [
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
      render: (text: string, record: Kpi) => (
        <Button type="link" onClick={() => navigate(`/kpis/${record.id}`)}>
          {text}
        </Button>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: KpiStatus) => {
        let color = 'default';
        switch (status) {
          case KpiStatus.ACTIVE:
            color = 'blue';
            break;
          case KpiStatus.COMPLETED:
            color = 'green';
            break;
          case KpiStatus.CANCELLED:
            color = 'red';
            break;
          default:
            color = 'default';
        }
        return <Tag color={color}>{status.toUpperCase()}</Tag>;
      },
    },
    {
      title: 'Progress',
      key: 'progress',
      render: (record: Kpi) => {
        const current = typeof record.currentValue === 'number' 
          ? record.currentValue 
          : parseFloat(record.currentValue || '0');
        const target = typeof record.targetValue === 'number'
          ? record.targetValue
          : parseFloat(record.targetValue || '0');
        const percentage = target > 0 ? Math.round((current / target) * 100) : 0;
        
        return (
          <div>
            {current.toLocaleString()} / {target.toLocaleString()} ({percentage}%)
          </div>
        );
      },
    },
    {
      title: 'Due Date',
      dataIndex: 'endDate',
      key: 'endDate',
      render: (date: string) => dayjs(date).format('MMM D, YYYY'),
    },
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
      render: (_, record: Kpi) => {
        // Find the category by ID from the categories array
        const category = categories?.find(cat => cat.id === record.categoryId);
        return category?.name || 'Uncategorized';
      },
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: Kpi) => (
        <Space size="middle">
          <Button
            icon={<EditOutlined />}
            onClick={() => navigate(`/kpis/edit/${record.id}`)}
          />
          <Popconfirm
            title="Are you sure you want to delete this KPI?"
            onConfirm={() => handleDelete(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="kpi-list-page">
      <Title level={2}>Key Performance Indicators</Title>
      
      <Card style={{ marginBottom: 16 }}>
        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} sm={12} md={6}>
            <Input
              placeholder="Search KPIs..."
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              onPressEnter={handleSearch}
            />
          </Col>
          <Col xs={24} sm={12} md={4}>
            <Select
              placeholder="Status"
              style={{ width: '100%' }}
              allowClear
              onChange={handleStatusChange}
              value={filters.status}
            >
              {Object.values(KpiStatus).map((status) => (
                <Option key={status} value={status}>
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </Option>
              ))}
            </Select>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Select
              placeholder="Category"
              style={{ width: '100%' }}
              allowClear
              onChange={handleCategoryChange}
              value={filters.categoryId}
            >
              {Array.isArray(categories) && categories.map((category) => (
                <Option key={category.id} value={category.id}>
                  {category.name}
                </Option>
              ))}
            </Select>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <RangePicker
              style={{ width: '100%' }}
              value={dateRange}
              onChange={(dates) => setDateRange(dates)}
            />
          </Col>
          <Col xs={24} sm={12} md={2}>
            <Button 
              type="primary" 
              icon={<FilterOutlined />} 
              onClick={handleSearch}
              block
            >
              Filter
            </Button>
          </Col>
        </Row>
      </Card>

      <Card>
        <div style={{ marginBottom: 16, textAlign: 'right' }}>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => navigate('/kpis/create')}
          >
            Create KPI
          </Button>
        </div>
        
        <Table
          columns={columns}
          dataSource={kpis || []}
          rowKey="id"
          loading={loading}
          pagination={{
            current: pagination.page,
            pageSize: pagination.limit,
            total: pagination.total,
            showSizeChanger: true,
            showTotal: (total) => `Total ${total} items`,
          }}
          onChange={handleTableChange}
          locale={{
            emptyText: kpis === null ? 'Loading...' : 'No data'
          }}
        />
      </Card>
    </div>
  );
};

export default KpiListPage;

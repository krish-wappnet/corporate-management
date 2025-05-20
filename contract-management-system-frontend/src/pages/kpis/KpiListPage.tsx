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
import { Button, Table, Space, Tag, Select, Input, DatePicker, Card, Row, Col, Popconfirm, message } from 'antd';
import { PlusOutlined, SearchOutlined, FilterOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

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
    
    const paginationParams: PaginationParams = {
      page: tablePagination.current,
      limit: tablePagination.pageSize,
    };
    
    if (sorter.field) {
      paginationParams.sortBy = sorter.field;
      paginationParams.sortOrder = sorter.order === 'ascend' ? 'asc' : 'desc';
    }
    
    dispatch(fetchKpis({
      pagination: paginationParams,
      filters: { ...filters },
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
      message.success('KPI deleted successfully', 3);
    } catch (error) {
      message.error('Failed to delete KPI', 3);
    }
  };

  const columns = [
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
      render: (text: string, record: Kpi) => (
        <Button 
          type="link" 
          onClick={() => navigate(`/kpis/${record.id}`)} 
          className="text-secondary hover:text-accent transition-colors p-0"
        >
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
        return <Tag color={color} className="text-gray-900 font-medium">{status.toUpperCase()}</Tag>;
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
          <div className="text-gray-900">
            {current.toLocaleString()} / {target.toLocaleString()} <span className="text-accent font-medium">({percentage}%)</span>
          </div>
        );
      },
    },
    {
      title: 'Due Date',
      dataIndex: 'endDate',
      key: 'endDate',
      render: (date: string) => (
        <span className="text-gray-900">{dayjs(date).format('MMM D, YYYY')}</span>
      ),
    },
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
      render: (_, record: Kpi) => {
        const category = categories?.find(cat => cat.id === record.categoryId);
        return <span className="text-gray-900">{category?.name || 'Uncategorized'}</span>;
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
            className="text-secondary hover:text-accent border-none shadow-none transition-colors"
          />
          <Popconfirm
            title="Are you sure you want to delete this KPI?"
            onConfirm={() => handleDelete(record.id)}
            okText="Yes"
            cancelText="No"
            overlayClassName="rounded-lg"
          >
            <Button
              icon={<DeleteOutlined />}
              className="text-red-600 hover:text-red-700 border-none shadow-none transition-colors"
            />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 font-inter p-6 sm:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <h2 className="text-3xl font-bold text-gray-900">Key Performance Indicators</h2>
        
        <Card className="bg-white border border-gray-200 rounded-xl shadow-md hover:shadow-lg transition-all animate-fadeIn p-4 sm:p-6">
          <Row gutter={[16, 16]} align="middle">
            <Col xs={24} sm={12} md={6}>
              <Input
                placeholder="Search KPIs..."
                prefix={<SearchOutlined className="text-gray-500 mr-2" />}
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                onPressEnter={handleSearch}
                className="border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-secondary focus:ring-offset-1 focus:border-secondary transition-all text-gray-900 placeholder-gray-400 px-4 py-2 h-10"
              />
            </Col>
            <Col xs={24} sm={12} md={4}>
              <Select
                placeholder="Status"
                className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-secondary focus:ring-offset-1 focus:border-secondary transition-all text-gray-900 placeholder-gray-400 h-10"
                dropdownClassName="rounded-lg"
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
                className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-secondary focus:ring-offset-1 focus:border-secondary transition-all text-gray-900 placeholder-gray-400 h-10"
                dropdownClassName="rounded-lg"
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
                className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-secondary focus:ring-offset-1 focus:border-secondary transition-all text-gray-900 placeholder-gray-400 h-10"
                value={dateRange}
                onChange={(dates) => setDateRange(dates)}
              />
            </Col>
            <Col xs={24} sm={12} md={2}>
              <Button
                onClick={handleSearch}
                className="w-full bg-black text-white hover:bg-gray-800 border-none rounded-lg shadow-md transition-all transform hover:scale-105 h-10"
                icon={<FilterOutlined />}
              >
                Filter
              </Button>
            </Col>
          </Row>
        </Card>

        <Card className="bg-white border border-gray-200 rounded-xl shadow-md hover:shadow-lg transition-all animate-fadeIn p-4 sm:p-6">
          <div className="flex justify-end mb-4">
            <Button
              onClick={() => navigate('/kpis/new')}
              className="bg-black text-white hover:bg-gray-800 border-none rounded-lg shadow-md transition-all transform hover:scale-105 px-4 py-2"
              icon={<PlusOutlined />}
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
              className: "mt-4",
            }}
            onChange={handleTableChange}
            locale={{
              emptyText: kpis === null ? 'Loading...' : 'No data'
            }}
            className="custom-table"
          />
        </Card>
      </div>
    </div>
  );
};

export default KpiListPage;
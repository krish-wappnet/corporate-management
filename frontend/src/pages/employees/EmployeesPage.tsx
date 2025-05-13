import React, { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch } from '../../store/store';
import { fetchUsers, selectUsers, selectUsersLoading, selectTotalUsers } from '../../store/slices/userSlice';
import { Link, useNavigate } from 'react-router-dom';
import { Button, Card, Table, Space, Tag, Avatar } from 'antd';
import { PlusOutlined, UserOutlined, EyeOutlined, DeleteOutlined } from '@ant-design/icons';

// Define the API User type that matches the API response
interface ApiUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  roles: string[];
  role?: string; // For backward compatibility
  position: string;
  department: string;
  managerId: string | null;
  manager?: {
    name: string;
  };
  createdAt: string;
  updatedAt: string;
  password?: string; // Only present in some responses
}

// Alias for the component
type User = ApiUser;


const EmployeesPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const users = useSelector(selectUsers);
  const loading = useSelector(selectUsersLoading);
  const total = useSelector(selectTotalUsers);

  const [pagination, setPagination] = useState<{ current: number; pageSize: number }>({
    current: 1,
    pageSize: 10,
  });

  const fetchEmployees = useCallback((page: number, pageSize: number) => {
    dispatch(fetchUsers({ page, limit: pageSize }));
  }, [dispatch]);

  // Handle initial data load
  useEffect(() => {
    fetchEmployees(1, 10);
  }, []); // Empty dependency array ensures this runs once on mount

  const handleTableChange = (tablePagination: {
    current?: number;
    pageSize?: number;
  }) => {
    const currentPage = tablePagination?.current || 1;
    const pageSize = tablePagination?.pageSize || 10;

    setPagination({
      current: currentPage,
      pageSize: pageSize,
    });

    fetchEmployees(currentPage, pageSize);
  };

  const columns = [
    {
      title: 'Employee',
      key: 'name',
      render: (_: unknown, record: User) => {
        const displayName = `${record.firstName || ''} ${record.lastName || ''}`.trim();
        return (
          <Link to={`/employees/${record.id}`}>
            <Space>
              <Avatar icon={<UserOutlined />} style={{ backgroundColor: '#1890ff' }}>
                {record.firstName?.[0]?.toUpperCase()}{record.lastName?.[0]?.toUpperCase()}
              </Avatar>
              <span>{displayName || record.email}</span>
            </Space>
          </Link>
        );
      },
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Position',
      dataIndex: 'position',
      key: 'position',
      render: (position: string) => position || 'N/A',
    },
    {
      title: 'Department',
      dataIndex: 'department',
      key: 'department',
      render: (department: string) => department || 'N/A',
    },
    {
      title: 'Role',
      key: 'role',
      render: (_: unknown, record: User) => {
        const role = (record.role || (record.roles?.[0] || 'employee')).toLowerCase();
        const roleColors: Record<string, string> = {
          admin: 'red',
          manager: 'blue',
          employee: 'green',
        };
        return (
          <Tag color={roleColors[role] || 'default'}>
            {role.toUpperCase()}
          </Tag>
        );
      },
    },
    {
      title: 'Manager',
      key: 'manager',
      render: (_: unknown, record: User) => (
        <span>{record.manager?.name || 'N/A'}</span>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: unknown, record: User) => (
        <Space size="middle">
          <Link to={`/employees/${record.id}`}>
            <Button 
              type="text" 
              icon={<EyeOutlined />} 
              className="text-blue-500 hover:text-blue-700"
              title="View details"
            />
          </Link>
          <Button 
            type="text" 
            icon={<DeleteOutlined />} 
            danger 
            className="hover:text-red-700"
            title="Delete employee"
          />
        </Space>
      ),
    },
  ];

  const tableData: User[] = users || [];

  return (
    <div className="min-h-screen bg-gray-50 font-inter p-6">
      <Card className="bg-white border border-gray-200 rounded-lg shadow-md hover:shadow-lg transition-all animate-fadeIn">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-900">Employees</h2>
          <Button
            icon={<PlusOutlined />}
            onClick={() => navigate('/employees/new')}
            className="bg-black text-white hover:bg-gray-800 border-none rounded-md transition-all transform hover:scale-105"
          >
            Add Employee
          </Button>
        </div>
        <Table
          columns={columns}
          dataSource={tableData}
          rowKey="id"
          pagination={{
            current: pagination.current,
            pageSize: pagination.pageSize,
            total: total || 0,
            showSizeChanger: true,
            showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
          }}
          loading={loading}
          onChange={handleTableChange}
          className="custom-table"
        />
      </Card>
    </div>
  );
};

export default EmployeesPage;
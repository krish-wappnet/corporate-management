import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button, Table, Space, message, Popconfirm, Card, Typography, Tag } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import type { Department } from '../../services/departmentService';
import api from '../../services/api';
import { useAuth } from '../../hooks';

const { Title } = Typography;

const DepartmentList = () => {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const isAdmin = user?.roles?.includes('ADMIN');

  const fetchDepartments = async () => {
    try {
      setLoading(true);
      const response = await api.get('/departments', {
        params: { include: 'manager' },
      });
      setDepartments(response.data);
    } catch (error) {
      console.error('Error fetching departments:', error);
      message.error('Failed to load departments');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/departments/${id}`);
      message.success('Department deleted successfully');
      fetchDepartments();
    } catch (error) {
      console.error('Error deleting department:', error);
      message.error('Failed to delete department');
    }
  };

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (text: string, record: Department) => (
        <Link to={`/departments/${record.id}`}>{text}</Link>
      ),
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      render: (text: string) => text || '-',
    },
    {
      title: 'Manager',
      key: 'manager',
      render: (_: any, record: Department) =>
        record.manager ? (
          `${record.manager.firstName} ${record.manager.lastName}`
        ) : (
          <Tag color="default">No Manager</Tag>
        ),
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 150,
      render: (_: any, record: Department) => (
        <Space size="middle">
          <Link to={`/departments/${record.id}/edit`}>
            <Button type="link" icon={<EditOutlined />} />
          </Link>
          {isAdmin && (
            <Popconfirm
              title="Are you sure you want to delete this department?"
              onConfirm={() => handleDelete(record.id)}
              okText="Yes"
              cancelText="No"
            >
              <Button type="link" danger icon={<DeleteOutlined />} />
            </Popconfirm>
          )}
        </Space>
      ),
    },
  ];

  return (
    <div className="department-list">
      <div className="flex justify-between items-center mb-6">
        <Title level={2}>Departments</Title>
        {isAdmin && (
          <Link to="/departments/new">
            <Button type="primary" icon={<PlusOutlined />}>
              Add Department
            </Button>
          </Link>
        )}
      </div>

      <Card>
        <Table
          columns={columns}
          dataSource={departments}
          rowKey="id"
          loading={loading}
          pagination={{ pageSize: 10 }}
        />
      </Card>
    </div>
  );
};

export default DepartmentList;

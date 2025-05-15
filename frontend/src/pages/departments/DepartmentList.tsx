import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button, Table, Space, message, Popconfirm, Card } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import type { Department } from '../../services/departmentService';
import api from '../../services/api';
import { useAuth } from '../../hooks';

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
      message.error('Failed to load departments', 3);
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
      message.success('Department deleted successfully', 3);
      fetchDepartments();
    } catch (error) {
      console.error('Error deleting department:', error);
      message.error('Failed to delete department', 3);
    }
  };

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (text: string, record: Department) => (
        <Link 
          to={`/departments/${record.id}`} 
          className="text-secondary hover:text-accent transition-colors"
        >
          {text}
        </Link>
      ),
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      render: (text: string) => (
        <span className="text-gray-900">{text || '-'}</span>
      ),
    },
    {
      title: 'Manager',
      key: 'manager',
      render: (_: any, record: Department) =>
        record.manager ? (
          <span className="text-gray-900">{`${record.manager.firstName} ${record.manager.lastName}`}</span>
        ) : (
          <span className="text-gray-900 bg-gray-100 px-2 py-1 rounded-md">No Manager</span>
        ),
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 150,
      render: (_: any, record: Department) => (
        <Space size="middle">
          <Link to={`/departments/${record.id}/edit`}>
            <Button 
              type="link" 
              icon={<EditOutlined />} 
              className="text-secondary hover:text-accent transition-colors border-none shadow-none" 
            />
          </Link>
          {isAdmin && (
            <Popconfirm
              title="Are you sure you want to delete this department?"
              onConfirm={() => handleDelete(record.id)}
              okText="Yes"
              cancelText="No"
              overlayClassName="rounded-lg"
            >
              <Button
                type="link"
                icon={<DeleteOutlined />}
                className="text-red-600 hover:text-red-700 transition-colors border-none shadow-none"
              />
            </Popconfirm>
          )}
        </Space>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 font-inter p-6 sm:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-3xl font-bold text-gray-900">Departments</h2>
          {isAdmin && (
            <Link to="/departments/new">
              <Button
                className="bg-black text-white hover:bg-gray-800 border-none rounded-lg shadow-md transition-all transform hover:scale-105 px-4 py-2"
                icon={<PlusOutlined />}
              >
                Add Department
              </Button>
            </Link>
          )}
        </div>

        <Card className="bg-white border border-gray-200 rounded-xl shadow-md hover:shadow-lg transition-all animate-fadeIn p-4 sm:p-6">
          <Table
            columns={columns}
            dataSource={departments}
            rowKey="id"
            loading={loading}
            pagination={{ pageSize: 10, className: "mt-4" }}
            className="custom-table"
          />
        </Card>
      </div>
    </div>
  );
};

export default DepartmentList;
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Form, Input, Button, Card, Typography, Select, message, Spin } from 'antd';
import axios from 'axios';
import type { Department } from '../../services/departmentService';
import api from '../../services/api';

const { Title } = Typography;
const { TextArea } = Input;
const { Option } = Select;

interface DepartmentFormProps {
  isEdit?: boolean;
}

const DepartmentForm = ({ isEdit = false }: DepartmentFormProps) => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(false);
  const [managers, setManagers] = useState<Array<{
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    position?: string;
    department?: string;
    roles?: string[];
  }>>([]);
  const [, setDepartment] = useState<Department | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch users with manager role
        const token = localStorage.getItem('token');
        
        // Debug: Log token and user info
        console.log('Current token:', token);
        console.log('User from localStorage:', localStorage.getItem('user'));
        
        if (!token) {
          console.error('No token found in localStorage');
          throw new Error('Authentication required. Please log in again.');
        }
        
        // Create a new axios instance to avoid interceptor issues
        const authAxios = axios.create({
          baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });
        
        // First, fetch all users
        const response = await authAxios.get('/users', {
          params: {
            page: 1,
            limit: 100
          }
        });
        
        if (response.data && response.data.items) {
          // Filter users to only include those with manager role
          const managers = response.data.items.filter((user: any) => 
            user.roles && user.roles.includes('manager')
          );
          
          setManagers(managers);
          console.log('Managers fetched successfully:', managers);
        } else {
          console.error('Unexpected response format:', response.data);
          throw new Error('Failed to fetch users. Invalid response format.');
        }

        // If editing, fetch the department data
        if (isEdit && id) {
          const response = await api.get(`/departments/${id}`, {
            params: { include: 'manager' },
          });
          const department = response.data;
          setDepartment(department);
          form.setFieldsValue({
            name: department.name,
            description: department.description,
            managerId: department.managerId || undefined,
          });
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        message.error('Failed to load data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, isEdit, form]);

  const onFinish = async (values: any) => {
    try {
      setSubmitting(true);
      
      if (isEdit && id) {
        await api.put(`/departments/${id}`, values);
        message.success('Department updated successfully');
      } else {
        await api.post('/departments', values);
        message.success('Department created successfully');
      }
      
      navigate('/departments');
    } catch (error) {
      console.error('Error saving department:', error);
      message.error(`Failed to ${isEdit ? 'update' : 'create'} department`);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="department-form">
      <Title level={2} className="mb-6">
        {isEdit ? 'Edit Department' : 'Create New Department'}
      </Title>
      
      <Card>
        <Spin spinning={loading}>
          <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
            initialValues={{ managerId: undefined }}
          >
            <Form.Item
              name="name"
              label="Department Name"
              rules={[
                { required: true, message: 'Please enter department name' },
                { max: 100, message: 'Name must be less than 100 characters' },
              ]}
            >
              <Input placeholder="Enter department name" />
            </Form.Item>

            <Form.Item
              name="description"
              label="Description"
              rules={[
                { max: 500, message: 'Description must be less than 500 characters' },
              ]}
            >
              <TextArea rows={4} placeholder="Enter department description" />
            </Form.Item>

            <Form.Item
              name="managerId"
              label="Department Manager"
              rules={[
                // Manager is optional
              ]}
            >
              <Select
                showSearch
                placeholder="Select a manager"
                optionFilterProp="children"
                filterOption={(input, option) =>
                  (option?.props.children as string)
                    .toLowerCase()
                    .indexOf(input.toLowerCase()) >= 0 ||
                  (option?.props['data-email'] as string || '').toLowerCase().includes(input.toLowerCase())
                }
                allowClear
                style={{ width: '100%' }}
                optionLabelProp="label"
              >
                {managers.map((manager) => (
                  <Option 
                    key={manager.id} 
                    value={manager.id}
                    label={`${manager.firstName} ${manager.lastName}`}
                    data-email={manager.email}
                  >
                    <div className="flex flex-col">
                      <div className="font-medium">
                        {manager.firstName} {manager.lastName}
                      </div>
                      <div className="text-sm text-gray-500">
                        {manager.position || 'No position'}
                        {manager.department && ` • ${manager.department}`}
                      </div>
                      <div className="text-xs text-gray-400">
                        {manager.email}
                      </div>
                    </div>
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item>
              <div className="space-x-4">
                <Button type="primary" htmlType="submit" loading={submitting}>
                  {isEdit ? 'Update' : 'Create'} Department
                </Button>
                <Button onClick={() => navigate('/departments')}>
                  Cancel
                </Button>
              </div>
            </Form.Item>
          </Form>
        </Spin>
      </Card>
    </div>
  );
};

export default DepartmentForm;

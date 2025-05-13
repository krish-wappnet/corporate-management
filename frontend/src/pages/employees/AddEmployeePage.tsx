import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import type { AppDispatch } from '../../store/store';
import { createUser } from '../../store/slices/userSlice';
import { Button, Card, Form, Input, Select, message } from 'antd';
import { UserOutlined, MailOutlined, LockOutlined, ArrowLeftOutlined } from '@ant-design/icons';

const { Option } = Select;

const AddEmployeePage: React.FC = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values: any) => {
    try {
      setLoading(true);
      
      // Format the data to match the API expected format
      const userData = {
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
        password: values.password,
        roles: [values.role], // Convert role to roles array
        position: values.position,
        department: values.department
      };
      
      await dispatch(createUser(userData)).unwrap();
      
      message.success('Employee added successfully', 3);
      navigate('/employees');
    } catch (error: any) {
      message.error(error.message || 'Failed to add employee', 3);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-inter p-6 sm:p-8">
      <div className="max-w-4xl mx-auto">
        <Button
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate(-1)}
          className="mb-6 flex items-center text-secondary hover:text-accent hover:bg-gray-100 border-none shadow-none rounded-md px-4 py-2 transition-all transform hover:scale-105"
        >
          Back to Employees
        </Button>
        
        <Card className="bg-white border border-gray-200 rounded-xl shadow-lg hover:shadow-xl transition-all animate-fadeIn p-6 sm:p-8">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Add New Employee</h2>
            <p className="text-base text-gray-600">Fill in the details to add a new employee to the system.</p>
          </div>

          <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
            className="max-w-2xl space-y-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Form.Item
                name="firstName"
                label={<span className="text-gray-700 font-medium">First Name</span>}
                rules={[{ required: true, message: <span className="text-red-600 text-sm">Please enter first name</span> }]}
                className="space-y-1"
              >
                <Input
                  prefix={<UserOutlined className="text-gray-500 mr-2" />}
                  placeholder="John"
                  className="border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-secondary focus:ring-offset-1 focus:border-secondary transition-all text-gray-900 placeholder-gray-400 px-4 py-2"
                />
              </Form.Item>

              <Form.Item
                name="lastName"
                label={<span className="text-gray-700 font-medium">Last Name</span>}
                rules={[{ required: true, message: <span className="text-red-600 text-sm">Please enter last name</span> }]}
                className="space-y-1"
              >
                <Input
                  prefix={<UserOutlined className="text-gray-500 mr-2" />}
                  placeholder="Doe"
                  className="border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-secondary focus:ring-offset-1 focus:border-secondary transition-all text-gray-900 placeholder-gray-400 px-4 py-2"
                />
              </Form.Item>

              <Form.Item
                name="email"
                label={<span className="text-gray-700 font-medium">Email</span>}
                rules={[
                  { required: true, message: <span className="text-red-600 text-sm">Please enter email</span> },
                  { type: 'email', message: <span className="text-red-600 text-sm">Please enter a valid email</span> }
                ]}
                className="md:col-span-2 space-y-1"
              >
                <Input
                  prefix={<MailOutlined className="text-gray-500 mr-2" />}
                  placeholder="john.doe@example.com"
                  type="email"
                  className="border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-secondary focus:ring-offset-1 focus:border-secondary transition-all text-gray-900 placeholder-gray-400 px-4 py-2"
                />
              </Form.Item>

              <Form.Item
                name="password"
                label={<span className="text-gray-700 font-medium">Password</span>}
                rules={[
                  { required: true, message: <span className="text-red-600 text-sm">Please enter password</span> },
                  { min: 8, message: <span className="text-red-600 text-sm">Password must be at least 8 characters</span> },
                  {
                    pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
                    message: <span className="text-red-600 text-sm">Password must contain at least one uppercase, one lowercase, one number, and one special character</span>
                  }
                ]}
                className="space-y-1"
              >
                <Input.Password
                  prefix={<LockOutlined className="text-gray-500 mr-2" />}
                  placeholder="••••••••"
                  className="border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-secondary focus:ring-offset-1 focus:border-secondary transition-all text-gray-900 placeholder-gray-400 px-4 py-2"
                />
              </Form.Item>

              <Form.Item
                name="confirmPassword"
                label={<span className="text-gray-700 font-medium">Confirm Password</span>}
                dependencies={['password']}
                rules={[
                  { required: true, message: <span className="text-red-600 text-sm">Please confirm password</span> },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue('password') === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(new Error('The two passwords do not match'));
                    },
                  }),
                ]}
                className="space-y-1"
              >
                <Input.Password
                  prefix={<LockOutlined className="text-gray-500 mr-2" />}
                  placeholder="••••••••"
                  className="border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-secondary focus:ring-offset-1 focus:border-secondary transition-all text-gray-900 placeholder-gray-400 px-4 py-2"
                />
              </Form.Item>

              <Form.Item
                name="role"
                label={<span className="text-gray-700 font-medium">Role</span>}
                rules={[{ required: true, message: <span className="text-red-600 text-sm">Please select a role</span> }]}
                className="space-y-1"
              >
                <Select
                  placeholder="Select role"
                  className="border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-secondary focus:ring-offset-1 focus:border-secondary transition-all text-gray-900 placeholder-gray-400"
                  dropdownClassName="rounded-lg"
                >
                  <Option value="employee">Employee</Option>
                  <Option value="manager">Manager</Option>
                  <Option value="admin">Admin</Option>
                </Select>
              </Form.Item>

              <Form.Item
                name="position"
                label={<span className="text-gray-700 font-medium">Position</span>}
                rules={[{ required: true, message: <span className="text-red-600 text-sm">Please enter position</span> }]}
                className="space-y-1"
              >
                <Input
                  placeholder="e.g., Software Engineer"
                  className="border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-secondary focus:ring-offset-1 focus:border-secondary transition-all text-gray-900 placeholder-gray-400 px-4 py-2"
                />
              </Form.Item>

              <Form.Item
                name="department"
                label={<span className="text-gray-700 font-medium">Department</span>}
                rules={[{ required: true, message: <span className="text-red-600 text-sm">Please enter department</span> }]}
                className="md:col-span-2 space-y-1"
              >
                <Input
                  placeholder="e.g., Engineering"
                  className="border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-secondary focus:ring-offset-1 focus:border-secondary transition-all text-gray-900 placeholder-gray-400 px-4 py-2"
                />
              </Form.Item>
            </div>

            <Form.Item className="mt-8">
              <Button
                htmlType="submit"
                loading={loading}
                className="w-full md:w-auto bg-black text-white hover:bg-gray-800 border-none rounded-lg shadow-md transition-all transform hover:scale-105 px-6 py-2"
                size="large"
              >
                Add Employee
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </div>
    </div>
  );
};

export default AddEmployeePage;
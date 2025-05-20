import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "../../store/store";
import { createUser } from "../../store/slices/userSlice";
import { Button, Card, Form, Input, Select } from "antd";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { UserOutlined, MailOutlined, LockOutlined } from "@ant-design/icons";
import api from "../../services/api";

const { Option } = Select;

interface Department {
  id: string;
  name: string;
}

const AddEmployeePage: React.FC = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const [loading, setLoading] = useState(false);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [departmentsLoading, setDepartmentsLoading] = useState(false);
  const [departmentsError, setDepartmentsError] = useState<string | null>(null);

  // Fetch departments from API
  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        setDepartmentsLoading(true);
        const response = await api.get('/departments');
        setDepartments(response.data);
      } catch (error) {
        console.error('Error fetching departments:', error);
        const errorMessage = 'Failed to load departments';
        setDepartmentsError(errorMessage);
        toast.error(errorMessage);
      } finally {
        setDepartmentsLoading(false);
      }
    };
    fetchDepartments();
  }, []);

  interface EmployeeFormValues {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    confirmPassword: string;
    role: string;
    position: string;
    department: string;
  }

  const onFinish = async (values: EmployeeFormValues) => {
    try {
      setLoading(true);

      const userData = {
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
        password: values.password,
        roles: [values.role],
        position: values.position,
        department: values.department, // Use department name or ID based on API requirements
      };

      await dispatch(createUser(userData)).unwrap();

      toast.success("Employee added successfully");
      navigate("/employees");
    } catch (error: any) {
      if (error.response && error.response.data && error.response.data.message) {
        toast.error(error.response.data.message);
      } else if (error.message) {
        toast.error(error.message);
      } else {
        toast.error("Failed to add employee");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 font-['Inter',-apple-system,BlinkMacSystemFont,'Segoe_UI',Roboto,sans-serif] p-6 sm:p-8 lg:p-10">
      <div className="max-w-4xl mx-auto">
        <Card className="bg-white border border-gray-200 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 animate-fadeIn p-6 sm:p-8">
          <div className="mb-10">
            <h2 className="text-4xl font-extrabold text-blue-900 mb-3 tracking-tight">
              Add New Employee
            </h2>
            <p className="text-lg text-gray-600 leading-relaxed">
              Enter the details below to onboard a new employee to the system.
            </p>
          </div>

          <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
            className="max-w-2xl space-y-8"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Form.Item
                name="firstName"
                label={
                  <span className="text-gray-700 font-semibold text-sm">First Name</span>
                }
                rules={[
                  {
                    required: true,
                    message: (
                      <span className="text-red-500 text-xs">
                        Please enter first name
                      </span>
                    ),
                  },
                ]}
                className="space-y-1"
              >
                <Input
                  prefix={<UserOutlined className="text-gray-400 mr-3" />}
                  placeholder="John"
                  className="border-gray-200 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:border-blue-500 transition-all text-gray-900 placeholder-gray-400 px-4 py-3 text-base"
                />
              </Form.Item>

              <Form.Item
                name="lastName"
                label={
                  <span className="text-gray-700 font-semibold text-sm">Last Name</span>
                }
                rules={[
                  {
                    required: true,
                    message: (
                      <span className="text-red-500 text-xs">
                        Please enter last name
                      </span>
                    ),
                  },
                ]}
                className="space-y-1"
              >
                <Input
                  prefix={<UserOutlined className="text-gray-400 mr-3" />}
                  placeholder="Doe"
                  className="border-gray-200 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:border-blue-500 transition-all text-gray-900 placeholder-gray-400 px-4 py-3 text-base"
                />
              </Form.Item>

              <Form.Item
                name="email"
                label={<span className="text-gray-700 font-semibold text-sm">Email</span>}
                rules={[
                  {
                    required: true,
                    message: (
                      <span className="text-red-500 text-xs">
                        Please enter email
                      </span>
                    ),
                  },
                  {
                    type: "email",
                    message: (
                      <span className="text-red-500 text-xs">
                        Please enter a valid email
                      </span>
                    ),
                  },
                ]}
                className="md:col-span-2 space-y-1"
              >
                <Input
                  prefix={<MailOutlined className="text-gray-400 mr-3" />}
                  placeholder="john.doe@example.com"
                  type="email"
                  className="border-gray-200 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:border-blue-500 transition-all text-gray-900 placeholder-gray-400 px-4 py-3 text-base"
                />
              </Form.Item>

              <Form.Item
                name="password"
                label={
                  <span className="text-gray-700 font-semibold text-sm">Password</span>
                }
                rules={[
                  {
                    required: true,
                    message: (
                      <span className="text-red-500 text-xs">
                        Please enter password
                      </span>
                    ),
                  },
                  {
                    min: 8,
                    message: (
                      <span className="text-red-500 text-xs">
                        Password must be at least 8 characters
                      </span>
                    ),
                  },
                ]}
                className="space-y-1"
              >
                <Input.Password
                  prefix={<LockOutlined className="text-gray-400 mr-3" />}
                  placeholder="••••••••"
                  className="border-gray-200 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:border-blue-500 transition-all text-gray-900 placeholder-gray-400 px-4 py-3 text-base"
                />
              </Form.Item>

              <Form.Item
                name="confirmPassword"
                label={
                  <span className="text-gray-700 font-semibold text-sm">
                    Confirm Password
                  </span>
                }
                dependencies={["password"]}
                rules={[
                  {
                    required: true,
                    message: (
                      <span className="text-red-500 text-xs">
                        Please confirm password
                      </span>
                    ),
                  },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue("password") === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(
                        new Error("The two passwords do not match")
                      );
                    },
                  }),
                ]}
                className="space-y-1"
              >
                <Input.Password
                  prefix={<LockOutlined className="text-gray-400 mr-3" />}
                  placeholder="••••••••"
                  className="border-gray-200 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:border-blue-500 transition-all text-gray-900 placeholder-gray-400 px-4 py-3 text-base"
                />
              </Form.Item>

              <Form.Item
                name="role"
                label={<span className="text-gray-700 font-semibold text-sm">Role</span>}
                rules={[
                  {
                    required: true,
                    message: (
                      <span className="text-red-500 text-xs">
                        Please select a role
                      </span>
                    ),
                  },
                ]}
                className="space-y-1"
              >
                <Select
                  placeholder="Select role"
                  className="border-gray-200 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:border-blue-500 transition-all text-gray-900 placeholder-gray-400 h-12"
                  dropdownClassName="rounded-lg shadow-md"
                >
                  <Option value="employee">Employee</Option>
                  <Option value="manager">Manager</Option>
                  <Option value="admin">Admin</Option>
                </Select>
              </Form.Item>

              <Form.Item
                name="position"
                label={
                  <span className="text-gray-700 font-semibold text-sm">Position</span>
                }
                rules={[
                  {
                    required: true,
                    message: (
                      <span className="text-red-500 text-xs">
                        Please enter position
                      </span>
                    ),
                  },
                ]}
                className="space-y-1"
              >
                <Input
                  placeholder="e.g., Software Engineer"
                  className="border-gray-200 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:border-blue-500 transition-all text-gray-900 placeholder-gray-400 px-4 py-3 text-base"
                />
              </Form.Item>

              <Form.Item
                name="department"
                label={
                  <span className="text-gray-700 font-semibold text-sm">Department</span>
                }
                rules={[
                  {
                    required: true,
                    message: (
                      <span className="text-red-500 text-xs">
                        Please select a department
                      </span>
                    ),
                  },
                ]}
                className="md:col-span-2 space-y-1"
              >
                <Select
                  placeholder="Select department"
                  loading={departmentsLoading}
                  disabled={departmentsLoading || !!departmentsError}
                  className="border-gray-200 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:border-blue-500 transition-all text-gray-900 placeholder-gray-400 h-12"
                  dropdownClassName="rounded-lg shadow-md"
                >
                  {departments.map((dept) => (
                    <Option key={dept.id} value={dept.name}>
                      {dept.name}
                    </Option>
                  ))}
                </Select>
                {departmentsError && (
                  <span className="text-red-500 text-xs">{departmentsError}</span>
                )}
              </Form.Item>
            </div>

            <Form.Item className="mt-10">
              <Button
                htmlType="submit"
                loading={loading}
                className="w-full md:w-auto bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 border-none rounded-lg shadow-lg transition-all transform hover:scale-105 px-8 py-3 h-12 text-base font-semibold"
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
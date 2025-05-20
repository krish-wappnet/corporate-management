import React, { useState, useEffect, useCallback } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import type { AppDispatch } from "../../store/store";
import {
  createOKR,
  updateOKR,
  fetchOKRById,
} from "../../store/slices/okrSlice";
import {
  Form,
  Input,
  Button,
  Card,
  Typography,
  message,
  Spin,
  Row,
  Col,
  DatePicker,
  Space,
  Select,
  InputNumber,
} from "antd";
import { PlusOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import type { Dayjs } from "dayjs";
import api from "../../services/api";
import { v4 as uuidv4 } from "uuid";
import type { AxiosError } from "axios";
import { jwtDecode } from "jwt-decode"; // Add this import

const { Title } = Typography;
const { Option } = Select;

type Frequency = "quarterly" | "annual" | "custom";

interface Department {
  id: string;
  name: string;
  manager?: {
    id: string;
    firstName: string;
    lastName: string;
  };
}

// Add type for OKR status
type OkrStatus = "draft" | "active" | "completed" | "cancelled";

// Add type for OKR type
type OkrType = "individual" | "team" | "company" | "department";

interface OKR {
  id: string;
  title: string;
  description?: string;
  startDate: string;
  endDate: string;
  departmentId?: string;
  parentOkrId?: string;
  userId?: string;
  status?: string;
  progress?: number;
  type?: "individual" | "team" | "company" | "department";
  frequency?: "quarterly" | "annual" | "custom";
  keyResults: KeyResult[];
}
interface KeyResult {
  id?: string;
  title: string;
  description: string;
  type: 'number' | 'percentage' | 'currency';
  startValue: number;
  targetValue: number;
  currentValue: number;
  weight: number;
  unit: string;
}

interface KeyResultForm {
  key: string;
  id?: string;
  title: string;
  description: string;
  type: 'number' | 'percentage' | 'currency';
  startValue: number;
  targetValue: number;
  currentValue: number;
  weight: number;
  unit: string;
}

// Add CreateOkrDto type to match backend requirements
interface CreateOkrDto {
  title: string;
  description?: string;
  startDate: string;
  endDate: string;
  departmentId?: string;
  parentOkrId?: string;
  userId: string;
  status: "draft" | "active" | "completed" | "cancelled";
  progress: number;
  frequency: "quarterly" | "annual" | "custom";
  type: "individual" | "team" | "company" | "department";
  keyResults: Array<Omit<KeyResult, 'id'>>;
}

interface FormValues {
  title: string;
  description?: string;
  startDate: Dayjs | null;
  endDate: Dayjs | null;
  departmentId?: string;
  parentOkrId?: string;
  userId?: string;
  status?: string;
  progress?: number;
  type?: string;
  frequency: "quarterly" | "annual" | "custom";
  keyResults: KeyResultForm[];
}

const initialFormValues: FormValues = {
  title: "",
  description: "",
  startDate: null,
  endDate: null,
  status: "draft",
  progress: 0,
  type: "individual",
  frequency: "quarterly" as const,
  keyResults: [
    {
      key: uuidv4(),
      id: undefined,
      title: "",
      description: "",
      type: "number",
      startValue: 0,
      targetValue: 100,
      currentValue: 0,
      weight: 1,
      unit: "number",
    },
  ],
};

const OkrFormPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { id } = useParams<{ id?: string }>();
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [parentOkrs, setParentOkrs] = useState<OKR[]>([]);
  const [departmentsLoading, setDepartmentsLoading] = useState(false);
  const [form] = Form.useForm<FormValues>();

  // Fetch departments
  const fetchDepartments = useCallback(async () => {
    try {
      setDepartmentsLoading(true);
      const response = await api.get<Department[]>("/departments", {
        params: { include: "manager" },
      });
      const departmentsData = Array.isArray(response.data)
        ? response.data
        : (response.data as { items?: any[] }).items || [];
      setDepartments(departmentsData);
      return true;
    } catch (error) {
      message.error(
        `Failed to load departments: ${(error as AxiosError).message}`
      );
      return false;
    } finally {
      setDepartmentsLoading(false);
    }
  }, []);

  // Fetch parent OKRs
  const fetchParentOkrs = useCallback(async () => {
    try {
      const response = await api.get<OKR[]>("/okrs");
      const okrsData = Array.isArray(response.data)
        ? response.data
        : (response.data as { items?: any[] }).items || [];
      const filteredOkrs = id
        ? okrsData.filter((okr) => okr.id !== id)
        : okrsData;
      setParentOkrs(filteredOkrs);
      return true;
    } catch (error) {
      message.error(
        `Failed to load parent OKRs: ${(error as AxiosError).message}`
      );
      return false;
    }
  }, [id]);

  // Load OKR data for edit mode
  const loadOKR = useCallback(async () => {
    if (!id) return;
    try {
      const okrData = await dispatch(fetchOKRById(id)).unwrap();
      if (okrData) {
        form.setFieldsValue({
          title: okrData.title || "",
          description: okrData.description || "",
          startDate: okrData.startDate ? dayjs(okrData.startDate) : null,
          endDate: okrData.endDate ? dayjs(okrData.endDate) : null,
          departmentId: okrData.departmentId,
          parentOkrId: okrData.parentOkrId,
          status: okrData.status || "draft",
          progress: okrData.progress || 0,
          frequency: okrData.frequency || "quarterly", // Use default value if frequency is undefined
          type: okrData.type || "individual",
          keyResults:
            okrData.keyResults?.map((kr) => ({
              key: `existing-${kr.id || uuidv4()}`,
              id: kr.id,
              title: kr.title || "",
              description: kr.description || "",
              type: kr.type || "number",
              unit: kr.unit || "number",
              startValue: Number(kr.startValue) || 0,
              targetValue: Number(kr.targetValue) || 100,
              currentValue: Number(kr.currentValue) || 0,
              weight: Number(kr.weight) || 1,
            })) || [],
        });
      }
    } catch (error) {
      message.error(`Failed to load OKR: ${(error as AxiosError).message}`);
    }
  }, [dispatch, id, form]);

  // Type guard for Axios error
  const isAxiosError = (
    error: unknown
  ): error is AxiosError<{ message: string | string[] }> => {
    return (error as AxiosError).isAxiosError === true;
  };

  // Handle form submission
  const handleSubmit = useCallback(
    async (values: FormValues) => {
      try {
        setSubmitting(true);
        const validFrequencies = ["quarterly", "annual", "custom"] as const;
        const frequency = values.frequency as Frequency;
        if (!validFrequencies.includes(frequency)) {
          throw new Error(
            `Invalid frequency: ${
              frequency
            }. Must be one of ${validFrequencies.join(", ")}`
          );
        }

        // Get current user ID from JWT token
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('Authentication token not found');
        }
        const decodedToken = jwtDecode<{ sub: string; iat: number; exp: number }>(token);
        const userId = decodedToken.sub;
        if (!userId) {
          throw new Error('User ID not found in token');
        }

        // Prepare the OKR data for submission
        const okrData = {
          title: values.title,
          description: values.description,
          startDate: values.startDate?.isValid()
            ? values.startDate.toISOString()
            : undefined,
          endDate: values.endDate?.isValid()
            ? values.endDate.toISOString()
            : undefined,
          departmentId: values.departmentId,
          parentOkrId: values.parentOkrId,
          status: values.status as OkrStatus,
          progress: values.progress,
          frequency: frequency,
          type: values.type as OkrType,
          userId: userId,
          keyResults: values.keyResults.map((kr) => ({
            title: kr.title,
            description: kr.description,
            type: kr.type || "number",
            startValue: Number(kr.startValue) || 0,
            targetValue: Number(kr.targetValue) || 0,
            currentValue: Number(kr.currentValue) || 0,
            weight: Number(kr.weight) || 1,
            unit: kr.unit || "number"
          })),
        } as CreateOkrDto;

        // Validate key result values
        okrData.keyResults.forEach((kr, index) => {
          if (
            kr.currentValue < kr.startValue ||
            kr.currentValue > kr.targetValue
          ) {
            throw new Error(
              `Key Result ${
                index + 1
              }: Current value must be between start and target values`
            );
          }
        });

        if (id) {
          await dispatch(updateOKR({ id, okrData })).unwrap();
          message.success("OKR updated successfully");
        } else {
          await dispatch(createOKR(okrData)).unwrap();
          message.success("OKR created successfully");
        }
        navigate("/okrs");
      } catch (error) {
        if (isAxiosError(error) && error.response?.data) {
          const errorMessage = Array.isArray(error.response.data.message)
            ? error.response.data.message.join("; ")
            : error.response.data.message;
          message.error(`Failed to save OKR: ${errorMessage}`);
        } else {
          message.error(`Failed to save OKR: ${(error as Error).message}`);
        }
      } finally {
        setSubmitting(false);
      }
    },
    [dispatch, id, navigate]
  );

  // Initialize form and fetch data
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        if (!id) {
          form.setFieldsValue(initialFormValues);
        } else {
          await loadOKR();
        }
        await Promise.all([fetchDepartments(), fetchParentOkrs()]);
      } catch (error) {
        message.error(
          `Initialization failed: ${(error as AxiosError).message}`
        );
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, form, fetchDepartments, fetchParentOkrs, loadOKR]);

  // Date validation: ensure endDate is after startDate
  const disabledEndDate = (endDate: Dayjs | null) => {
    if (!endDate || !form.getFieldValue("startDate")) return false;
    return endDate.isBefore(form.getFieldValue("startDate"), "day");
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen w-full">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 font-['Inter',-apple-system,BlinkMacSystemFont,'Segoe_UI',Roboto,sans-serif] p-4 sm:p-6 lg:p-8">
      <div className="max-w-5xl mx-auto">
        <Card className="bg-white border border-gray-200 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 animate-fadeIn p-6 sm:p-8">
          <div className="flex items-center mb-6">
            <Title level={3} className="text-blue-900 mb-0 tracking-tight">
              {id ? "Edit OKR" : "Create New OKR"}
            </Title>
          </div>
          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
            className="space-y-6"
          >
            <Row gutter={[16, 16]}>
              <Col xs={24} md={12}>
                <Form.Item
                  name="title"
                  label={
                    <span className="text-gray-700 font-semibold text-sm">
                      Title
                    </span>
                  }
                  rules={[{ required: true, message: "Please enter a title" }]}
                >
                  <Input
                    placeholder="Enter OKR title"
                    className="border-gray-200 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:border-blue-500 transition-all text-gray-900 placeholder-gray-400 px-4 py-3 text-base"
                  />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item
                  name="frequency"
                  label={
                    <span className="text-gray-700 font-semibold text-sm">
                      Frequency
                    </span>
                  }
                  rules={[
                    { required: true, message: "Please select a frequency" },
                  ]}
                >
                  <Select
                    placeholder="Select frequency"
                    className="border-gray-200 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:border-blue-500 transition-all text-gray-900 placeholder-gray-400 h-12"
                    dropdownClassName="rounded-lg shadow-md"
                  >
                    <Option value="quarterly">Quarterly</Option>
                    <Option value="annual">Annual</Option>
                    <Option value="custom">Custom</Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>

            <Form.Item
              name="description"
              label={
                <span className="text-gray-700 font-semibold text-sm">
                  Description
                </span>
              }
              rules={[
                { required: true, message: "Please enter a description" },
              ]}
            >
              <Input.TextArea
                rows={4}
                placeholder="Enter OKR description"
                className="border-gray-200 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:border-blue-500 transition-all text-gray-900 placeholder-gray-400 px-4 py-3 text-base"
              />
            </Form.Item>

            <Row gutter={[16, 16]}>
              <Col xs={24} sm={8}>
                <Form.Item
                  name="startDate"
                  label={
                    <span className="text-gray-700 font-semibold text-sm">
                      Start Date
                    </span>
                  }
                  rules={[
                    { required: true, message: "Please select a start date" },
                  ]}
                >
                  <DatePicker
                    style={{ width: "100%" }}
                    className="border-gray-200 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:border-blue-500 transition-all text-gray-900 placeholder-gray-400 h-12"
                  />
                </Form.Item>
              </Col>
              <Col xs={24} sm={8}>
                <Form.Item
                  name="endDate"
                  label={
                    <span className="text-gray-700 font-semibold text-sm">
                      End Date
                    </span>
                  }
                  rules={[
                    { required: true, message: "Please select an end date" },
                  ]}
                >
                  <DatePicker
                    style={{ width: "100%" }}
                    disabledDate={disabledEndDate}
                    className="border-gray-200 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:border-blue-500 transition-all text-gray-900 placeholder-gray-400 h-12"
                  />
                </Form.Item>
              </Col>
              <Col xs={24} sm={8}>
                <Form.Item
                  name="status"
                  label={
                    <span className="text-gray-700 font-semibold text-sm">
                      Status
                    </span>
                  }
                  initialValue="draft"
                >
                  <Select
                    className="border-gray-200 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:border-blue-500 transition-all text-gray-900 placeholder-gray-400 h-12"
                    dropdownClassName="rounded-lg shadow-md"
                  >
                    <Option value="draft">Draft</Option>
                    <Option value="active">Active</Option>
                    <Option value="completed">Completed</Option>
                    <Option value="cancelled">Cancelled</Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>

            <Form.Item
              name="departmentId"
              label={
                <span className="text-gray-700 font-semibold text-sm">
                  Department
                </span>
              }
              rules={[
                { required: true, message: "Please select a department" },
              ]}
            >
              <Select
                placeholder="Select department"
                loading={departmentsLoading}
                showSearch
                optionFilterProp="children"
                filterOption={(input, option) =>
                  (option?.label?.toString() ?? "")
                    .toLowerCase()
                    .includes(input.toLowerCase())
                }
                className="border-gray-200 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:border-blue-500 transition-all text-gray-900 placeholder-gray-400 h-12"
                dropdownClassName="rounded-lg shadow-md"
              >
                {departments.map((dept) => (
                  <Option key={dept.id} value={dept.id} label={dept.name}>
                    {dept.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              name="parentOkrId"
              label={
                <span className="text-gray-700 font-semibold text-sm">
                  Parent OKR (Optional)
                </span>
              }
            >
              <Select
                placeholder="Select parent OKR (if any)"
                showSearch
                optionFilterProp="children"
                filterOption={(input, option) =>
                  (option?.label?.toString() ?? "")
                    .toLowerCase()
                    .includes(input.toLowerCase())
                }
                className="border-gray-200 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:border-blue-500 transition-all text-gray-900 placeholder-gray-400 h-12"
                dropdownClassName="rounded-lg shadow-md"
              >
                {parentOkrs.map((okr) => (
                  <Option key={okr.id} value={okr.id} label={okr.title}>
                    {okr.title}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Title level={4} className="text-blue-900 mt-8">
              Key Results
            </Title>
            <Form.List
              name="keyResults"
              rules={[
                {
                  validator: async (_, keyResults) => {
                    if (!keyResults || keyResults.length === 0) {
                      return Promise.reject(
                        new Error("At least one key result is required")
                      );
                    }
                  },
                },
              ]}
            >
              {(fields, { add, remove }) => (
                <div className="space-y-4">
                  {fields.map((field, index) => {
                    const fieldKey = `key-result-${field.key || `field-${index}`}`;
                    return (
                      <Space key={fieldKey} className="flex flex-wrap items-start gap-4 bg-gray-50 p-4 rounded-lg" align="start">
                        <Form.Item
                          {...field}
                          name={[field.name, "title"]}
                          rules={[{ required: true, message: "Missing title" }]}
                          className="flex-1 min-w-[200px]"
                        >
                          <Input
                            placeholder="Key Result Title"
                            className="border-gray-200 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:border-blue-500 transition-all text-gray-900 placeholder-gray-400 px-4 py-3 text-base"
                          />
                        </Form.Item>
                        <Form.Item
                          {...field}
                          name={[field.name, "description"]}
                          rules={[{ required: true, message: "Missing description" }]}
                          className="flex-1 min-w-[200px]"
                        >
                          <Input
                            placeholder="Key Result Description"
                            className="border-gray-200 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:border-blue-500 transition-all text-gray-900 placeholder-gray-400 px-4 py-3 text-base"
                          />
                        </Form.Item>
                        <Form.Item
                          {...field}
                          name={[field.name, "startValue"]}
                          rules={[
                            { required: true, message: "Missing start value" },
                            { type: "number", message: "Must be a number" },
                          ]}
                          className="w-[120px]"
                        >
                          <InputNumber
                            placeholder="Start Value"
                            className="w-full"
                            style={{ borderRadius: 8 }}
                          />
                        </Form.Item>
                        <Form.Item
                          {...field}
                          name={[field.name, "targetValue"]}
                          rules={[
                            { required: true, message: "Missing target value" },
                            { type: "number", message: "Must be a number" },
                          ]}
                          className="w-[120px]"
                        >
                          <InputNumber
                            placeholder="Target Value"
                            className="w-full"
                            style={{ borderRadius: 8 }}
                          />
                        </Form.Item>
                        <Form.Item
                          {...field}
                          name={[field.name, "currentValue"]}
                          rules={[
                            { required: true, message: "Missing current value" },
                            { type: "number", message: "Must be a number" },
                          ]}
                          className="w-[120px]"
                        >
                          <InputNumber
                            placeholder="Current Value"
                            className="w-full"
                            style={{ borderRadius: 8 }}
                          />
                        </Form.Item>
                        <Form.Item
                          {...field}
                          name={[field.name, "weight"]}
                          rules={[
                            { required: true, message: "Missing weight" },
                            { type: "number", message: "Must be a number" },
                            {
                              type: "number",
                              min: 0,
                              message: "Weight must be non-negative",
                            },
                          ]}
                          className="w-[120px]"
                        >
                          <InputNumber
                            placeholder="Weight"
                            className="w-full"
                            style={{ borderRadius: 8 }}
                          />
                        </Form.Item>
                        <Button
                          type="link"
                          onClick={() => remove(field.name)}
                          className="text-red-600 hover:text-red-800 transition-colors"
                        >
                          Remove
                        </Button>
                      </Space>
                    );
                  })}
                  <Form.Item>
                    <Button
                      type="dashed"
                      onClick={() =>
                        add({
                          key: `new-${uuidv4()}`,
                          title: "",
                          description: "",
                          type: "number",
                          unit: "number",
                          startValue: 0,
                          targetValue: 100,
                          currentValue: 0,
                          weight: 1,
                        })
                      }
                      className="w-full border-gray-200 rounded-lg shadow-sm hover:bg-gray-50 transition-all h-12 text-base font-semibold"
                      icon={<PlusOutlined />}
                    >
                      Add Key Result
                    </Button>
                  </Form.Item>
                </div>
              )}
            </Form.List>

            <Form.Item className="mt-8">
              <div className="flex justify-end space-x-4">
                <Button
                  onClick={() => navigate("/okrs")}
                  className="border-gray-200 rounded-lg shadow-md transition-all h-10 text-base font-semibold"
                >
                  Cancel
                </Button>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={submitting}
                  className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 border-none rounded-lg shadow-md transition-all transform hover:scale-105 h-10 text-base font-semibold min-w-[120px]"
                >
                  {id ? "Update OKR" : "Create OKR"}
                </Button>
              </div>
            </Form.Item>
          </Form>
        </Card>
      </div>
    </div>
  );
};

export default OkrFormPage;

// Add any additional interfaces or types if needed
// interface AdditionalType {
//   // Add properties here
// }

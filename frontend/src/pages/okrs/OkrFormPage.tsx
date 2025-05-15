import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import type { AppDispatch } from '../../store/store';
import { createOKR, updateOKR, fetchOKRById } from '../../store/slices/okrSlice';
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
  Select 
} from 'antd';
import { ArrowLeftOutlined, PlusOutlined } from '@ant-design/icons';
import moment from 'moment';
import type { Moment } from 'moment';

const { Title } = Typography;

interface KeyResultForm {
  key?: string;
  title: string;
  type: string;
  unit: string;
  startValue: number;
  targetValue: number;
  currentValue: number;
  weight: number;
}

interface FormValues {
  title: string;
  description: string;
  startDate?: Moment | null;
  endDate?: Moment | null;
  departmentId?: string;
  parentOkrId?: string;
  status: string;
  progress?: number;
  keyResults: KeyResultForm[];
  frequency: string;
}

const initialFormValues: FormValues = {
  title: '',
  description: '',
  status: 'draft',
  progress: 0,
  frequency: 'quarterly',
  keyResults: [
    {
      title: '',
      type: 'number',
      unit: 'number',
      startValue: 0,
      targetValue: 100,
      currentValue: 0,
      weight: 1
    }
  ]
};

const OkrFormPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { id } = useParams<{ id?: string }>();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [departments, setDepartments] = useState<any[]>([]);
  const [parentOkrs, setParentOkrs] = useState<any[]>([]);
  const [departmentsLoading, setDepartmentsLoading] = useState(false);
  const [form] = Form.useForm<FormValues>();
  const isInitialized = useRef(false);

  // Load OKR data when in edit mode
  const loadOKR = useCallback(async () => {
    if (!id) return;

    try {
      const okrData = await dispatch(fetchOKRById(id)).unwrap();
      if (okrData) {
        const { id: _, ...rest } = okrData as any;
        form.setFieldsValue({
          ...rest,
          startDate: rest.startDate ? moment(rest.startDate) : null,
          endDate: rest.endDate ? moment(rest.endDate) : null,
          keyResults: rest.keyResults?.map((kr: any) => ({
            ...kr,
            key: kr.id || Math.random().toString(36).substr(2, 9)
          })) || []
        });
        isInitialized.current = true;
      }
      return okrData;
    } catch (error) {
      console.error('Failed to load OKR:', error);
      message.error('Failed to load OKR');
      throw error;
    }
  }, [dispatch, id, form]);

  // Show loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen w-full">
        <div className="text-center">
          <Spin size="large" />
          <p className="mt-4">Loading...</p>
        </div>
      </div>
    );
  }

  // Handle form submission
  const handleSubmit = useCallback(async (values: FormValues) => {
    try {
      setSubmitting(true);
      
      const okrData = {
        ...values,
        startDate: values.startDate?.toISOString(),
        endDate: values.endDate?.toISOString(),
        keyResults: values.keyResults.map(kr => ({
          ...kr,
          startValue: Number(kr.startValue) || 0,
          currentValue: Number(kr.currentValue) || 0,
          targetValue: Number(kr.targetValue) || 0,
          weight: Number(kr.weight) || 1,
          type: kr.type || 'number'
        }))
      };

      if (id) {
        await dispatch(updateOKR({ id, ...okrData } as any)).unwrap();
        message.success('OKR updated successfully');
      } else {
        await dispatch(createOKR(okrData as any)).unwrap();
        message.success('OKR created successfully');
      }
      
      navigate('/okrs');
    } catch (error) {
      console.error('Failed to save OKR:', error);
      message.error('Failed to save OKR');
    } finally {
      setSubmitting(false);
    }
  }, [dispatch, id, navigate]);

  const fetchParentOkrs = useCallback(async () => {
    try {
      console.log('Fetching parent OKRs...');
      const response = await fetch('http://localhost:3000/okrs', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });
      
      console.log('OKRs response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response from OKRs API:', errorText);
        throw new Error(`Failed to fetch OKRs: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log('OKRs data:', data);
      
      // Filter out the current OKR if we're in edit mode
      const filteredOkrs = id 
        ? (Array.isArray(data) ? data : data.items || []).filter((okr: any) => okr.id !== id)
        : (Array.isArray(data) ? data : data.items || []);
      
      setParentOkrs(prevOkrs => {
        // Only update if the data has changed
        if (JSON.stringify(prevOkrs) !== JSON.stringify(filteredOkrs)) {
          return filteredOkrs;
        }
        return prevOkrs;
      });
      
      return true; // Indicate success
    } catch (error: unknown) {
      console.error('Error fetching OKRs:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to load OKRs';
      message.error(errorMessage);
      return false; // Indicate failure
    }
  }, [id]); // Removed parentOkrs.length from dependencies

  const fetchDepartments = useCallback(async () => {
    try {
      setDepartmentsLoading(true);
      console.log('Fetching departments...');
      const response = await fetch('http://localhost:3000/departments?include=manager', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });
      
      console.log('Response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response:', errorText);
        throw new Error(`Failed to fetch departments: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log('Departments data:', data);
      
      // Check if data is an array or has an items property
      const departmentsData = Array.isArray(data) ? data : (data.items || []);
      console.log('Processed departments:', departmentsData);
      
      setDepartments(prevDepts => {
        // Only update if the data has changed
        if (JSON.stringify(prevDepts) !== JSON.stringify(departmentsData)) {
          return departmentsData;
        }
        return prevDepts;
      });
      
      return true; // Indicate success
    } catch (error: unknown) {
      console.error('Error fetching departments:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to load departments';
      message.error(errorMessage);
      return false; // Indicate failure
    } finally {
      setDepartmentsLoading(false);
    }
  }, []); // Empty dependency array as we don't depend on any external values

  // Initialize form and fetch data after component mounts
  useEffect(() => {
    console.log('Component mounted or dependencies changed', { id });
    
    // Set initial form values immediately
    if (!id) {
      console.log('Setting initial form values for new OKR');
      form.setFieldsValue(initialFormValues);
    }
    
    // Fetch data in the background
    const fetchData = async () => {
      console.log('Starting data fetching...');
      try {
        setLoading(true);
        
        // Load existing OKR data if in edit mode
        if (id) {
          console.log('Loading existing OKR data');
          await loadOKR();
        }
        
        // Fetch departments and parent OKRs in parallel
        console.log('Fetching departments and parent OKRs...');
        await Promise.all([
          fetchDepartments(),
          fetchParentOkrs()
        ]);
        
        console.log('Data fetching completed successfully');
      } catch (error) {
        console.error('Error fetching data:', error);
        message.error('Some data failed to load. Please refresh to try again.');
      } finally {
        console.log('Setting loading to false');
        setLoading(false);
      }
    };
    
    fetchData();
    
    return () => {
      console.log('Cleaning up...');
      // Don't reset form fields here to prevent form flickering
    };
  }, [id]); // Only depend on id
  
  // Add a separate effect to log loading state changes
  useEffect(() => {
    console.log('Loading state changed:', loading);
  }, [loading]);
  
  // Debug: Log form values when they change
  const handleValuesChange = (changedValues: any, allValues: any) => {
    console.log('Form values changed:', { changedValues, allValues });
  };

  // Show loading overlay instead of full-screen loader
  const renderLoadingOverlay = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg text-center">
        <Spin size="large" />
        <p className="mt-4 text-lg">Loading Data...</p>
        <p className="text-gray-500">Please wait while we load additional data</p>
      </div>
    </div>
  );

  return (
    <div className="p-4 relative">
      {loading && renderLoadingOverlay()}
      <div className="flex items-center mb-4">
        <Button
          type="text"
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate(-1)}
          className="mr-2"
        >
          Back
        </Button>
        <Title level={3} className="mb-0">
          {id ? 'Edit OKR' : 'Create New OKR'}
        </Title>
      </div>
      
      <Card>
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          onValuesChange={handleValuesChange}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="title"
                label="Title"
                rules={[{ required: true, message: 'Please enter a title' }]}
              >
                <Input placeholder="Enter OKR title" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="frequency"
                label="Frequency"
                rules={[{ required: true, message: 'Please select a frequency' }]}
              >
                <Select placeholder="Select frequency">
                  <Select.Option value="quarterly">Quarterly</Select.Option>
                  <Select.Option value="monthly">Monthly</Select.Option>
                  <Select.Option value="yearly">Yearly</Select.Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="description"
            label="Description"
            rules={[{ required: true, message: 'Please enter a description' }]}
          >
            <Input.TextArea rows={4} placeholder="Enter OKR description" />
          </Form.Item>

          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                name="startDate"
                label="Start Date"
                rules={[{ required: true, message: 'Please select a start date' }]}
              >
                <DatePicker style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="endDate"
                label="End Date"
                rules={[{ required: true, message: 'Please select an end date' }]}
              >
                <DatePicker style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="status"
                label="Status"
                initialValue="draft"
              >
                <Select>
                  <Select.Option value="draft">Draft</Select.Option>
                  <Select.Option value="in_progress">In Progress</Select.Option>
                  <Select.Option value="completed">Completed</Select.Option>
                  <Select.Option value="cancelled">Cancelled</Select.Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="departmentId"
            label="Department"
            rules={[{ required: true, message: 'Please select a department' }]}
          >
            <Select
              placeholder="Select department"
              loading={departmentsLoading}
              showSearch
              optionFilterProp="children"
              filterOption={(input, option) =>
                (option?.label?.toString() ?? '').toLowerCase().includes(input.toLowerCase())
              }
            >
              {departments.map(dept => (
                <Select.Option 
                  key={dept.id} 
                  value={dept.id}
                  label={dept.name}
                >
                  {dept.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="parentOkrId"
            label="Parent OKR (Optional)"
          >
            <Select
              placeholder="Select parent OKR (if any)"
              showSearch
              optionFilterProp="children"
              filterOption={(input, option) =>
                (option?.label?.toString() ?? '').toLowerCase().includes(input.toLowerCase())
              }
            >
              {parentOkrs.map(okr => (
                <Select.Option 
                  key={okr.id} 
                  value={okr.id}
                  label={okr.title}
                >
                  {okr.title}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Title level={4}>Key Results</Title>
          <Form.List name="keyResults">
            {(fields, { add, remove }) => (
              <div>
                {fields.map((field) => (
                  <Space key={field.key} style={{ display: 'flex', marginBottom: 8 }} align="start">
                    <Form.Item
                      {...field}
                      name={[field.name, 'title']}
                      fieldKey={[field.fieldKey?.toString() || '', 'title']}
                      rules={[{ required: true, message: 'Missing title' }]}
                    >
                      <Input placeholder="Key Result Title" />
                    </Form.Item>
                    <Form.Item
                      {...field}
                      name={[field.name, 'description']}
                      fieldKey={[field.fieldKey?.toString() || '', 'description']}
                      rules={[{ required: true, message: 'Missing description' }]}
                    >
                      <Input placeholder="Key Result Description" />
                    </Form.Item>
                    <Form.Item
                      {...field}
                      name={[field.name, 'unit']}
                      fieldKey={[field.fieldKey?.toString() || '', 'unit']}
                      rules={[{ required: true, message: 'Missing unit' }]}
                    >
                      <Input placeholder="Unit" />
                    </Form.Item>
                    <Form.Item
                      {...field}
                      name={[field.name, 'startValue']}
                      fieldKey={[field.fieldKey?.toString() || '', 'startValue']}
                      rules={[{ required: true, message: 'Missing start value' }]}
                    >
                      <Input type="number" placeholder="Start Value" />
                    </Form.Item>
                    <Form.Item
                      {...field}
                      name={[field.name, 'targetValue']}
                      fieldKey={[field.fieldKey?.toString() || '', 'targetValue']}
                      rules={[{ required: true, message: 'Missing target value' }]}
                    >
                      <Input type="number" placeholder="Target Value" />
                    </Form.Item>
                    <Form.Item
                      {...field}
                      name={[field.name, 'currentValue']}
                      fieldKey={[field.fieldKey?.toString() || '', 'currentValue']}
                      rules={[{ required: true, message: 'Missing current value' }]}
                    >
                      <Input type="number" placeholder="Current Value" />
                    </Form.Item>
                    <Form.Item
                      {...field}
                      name={[field.name, 'weight']}
                      fieldKey={[field.fieldKey?.toString() || '', 'weight']}
                      rules={[{ required: true, message: 'Missing weight' }]}
                    >
                      <Input type="number" placeholder="Weight" />
                    </Form.Item>

                    <Button
                      type="link"
                      onClick={() => remove(field.name)}
                      style={{ padding: 0, margin: 0 }}
                    >
                      Remove
                    </Button>
                  </Space>
                ))}
                <Form.Item>
                  <Button
                    type="dashed"
                    onClick={() => add()}
                    style={{ width: '100%' }}
                    icon={<PlusOutlined />}
                  >
                    Add Key Result
                  </Button>
                </Form.Item>
              </div>
            )}
          </Form.List>

          <Form.Item>
            <div className="flex justify-end space-x-4">
              <Button onClick={() => navigate('/okrs')}>
                Cancel
              </Button>
              <Button
                type="primary"
                htmlType="submit"
                loading={submitting}
                className="min-w-[120px]"
              >
                {id ? 'Update OKR' : 'Create OKR'}
              </Button>
            </div>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default OkrFormPage;

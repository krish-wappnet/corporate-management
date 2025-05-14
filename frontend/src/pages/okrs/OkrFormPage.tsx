import React, { useState, useEffect, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import type { AppDispatch } from '../../store/store';
import { createOKR, updateOKR, fetchOKRById } from '../../store/slices/okrSlice';
import { Form, Input, Button, Card, Typography, Select, DatePicker, message, Spin, Row, Col } from 'antd';
import type { Moment } from 'moment';
import { SaveOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import moment from 'moment';

const { Title } = Typography;
const { TextArea } = Input;
const { Option } = Select;

interface FormValues {
  title: string;
  description: string;
  type: 'individual' | 'team' | 'company';
  frequency: 'quarterly' | 'annual' | 'custom';
  startDate: Moment | null;
  endDate: Moment | null;
  status: 'draft' | 'active' | 'completed' | 'cancelled';
  departmentId?: string;
  parentOkrId?: string;
  keyResults: Array<{
    title: string;
    description?: string;
    type: string;
    startValue: number;
    targetValue: number;
    currentValue: number;
    weight?: number;
  }>;
}

const initialFormValues: Partial<FormValues> = {
  type: 'individual',
  frequency: 'quarterly',
  status: 'draft',
  keyResults: [
    {
      title: '',
      type: 'NUMBER',
      startValue: 0,
      targetValue: 100,
      currentValue: 0,
      weight: 3
    }
  ]
};

const OkrFormPage: React.FC = () => {

  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { id } = useParams<{ id?: string }>();
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [initialValues, setInitialValues] = useState<Partial<FormValues>>(initialFormValues);
  const [form] = Form.useForm<FormValues>();

  // Set initial values when they change
  useEffect(() => {
    if (initialValues && Object.keys(initialValues).length > 0) {
      form.setFieldsValue(initialValues as any);
    }
  }, [form, initialValues]);

  // Load OKR data when in edit mode
  const loadOKR = useCallback(async () => {
    if (!id) return;

    try {
      setLoading(true);
      const okrData = await dispatch(fetchOKRById(id)).unwrap();
      if (okrData) {
        const { id: _, ...rest } = okrData as any;
        const formattedData: Partial<FormValues> = {
          ...rest,
          startDate: rest.startDate ? moment(rest.startDate) : null,
          endDate: rest.endDate ? moment(rest.endDate) : null,
        };
        setInitialValues(formattedData);
      }
    } catch (error) {
      message.error('Failed to load OKR');
    } finally {
      setLoading(false);
    }
  }, [id, dispatch]);

  useEffect(() => {
    if (id) {
      loadOKR();
    }
  }, [id, loadOKR]);

  useEffect(() => {
    if (initialValues && Object.keys(initialValues).length > 0) {
      form.setFieldsValue(initialValues as any);
    }
  }, [form, initialValues]);

  const onFinish = async (formValues: any) => {
    const values = formValues as FormValues;
    if (!values.startDate || !values.endDate) {
      message.error('Please select both start and end dates');
      return;
    }

    try {
      setSubmitting(true);
      const okrData = {
        ...values,
        startDate: values.startDate.format('YYYY-MM-DD'),
        endDate: values.endDate.format('YYYY-MM-DD'),
        departmentId: values.departmentId || undefined,
        parentOkrId: values.parentOkrId || undefined,
      };

      if (id) {
        await dispatch(updateOKR({ id, okrData })).unwrap();
        message.success('OKR updated successfully');
      } else {
        await dispatch(createOKR(okrData)).unwrap();
        message.success('OKR created successfully');
      }
      navigate('/okrs');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to save OKR';
      message.error(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <Spin size="large" className="flex justify-center items-center h-64" />;
  }

  return (
    <div className="okr-form-page">
      <Button 
        type="text" 
        icon={<ArrowLeftOutlined />} 
        onClick={() => navigate(-1)}
        className="mb-4"
      >
        Back
      </Button>

      <Card>
        <Title level={4} className="mb-6">
          {id ? 'Edit OKR' : 'Create New OKR'}
        </Title>

        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          initialValues={initialFormValues}
          key={id || 'new-okr'}
          className="okr-form"
        >
          <Row gutter={16}>
            <Col xs={24} md={16}>
              <Form.Item
                name="title"
                label="Title"
                rules={[{ required: true, message: 'Please input the title!' }]}
              >
                <Input placeholder="Enter OKR title" />
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item
                name="type"
                label="Type"
                rules={[{ required: true, message: 'Please select OKR type!' }]}
              >
                <Select>
                  <Select.Option value="individual">Individual</Select.Option>
                  <Select.Option value="team">Team</Select.Option>
                  <Select.Option value="company">Company</Select.Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="description"
            label="Description"
            rules={[{ required: true, message: 'Please input the description!' }]}
          >
            <TextArea rows={3} placeholder="Enter OKR description" />
          </Form.Item>

          <Row gutter={16}>
            <Col xs={24} md={8}>
              <Form.Item
                name="frequency"
                label="Frequency"
                rules={[{ required: true, message: 'Please select frequency!' }]}
              >
                <Select>
                  <Select.Option value="quarterly">Quarterly</Select.Option>
                  <Select.Option value="annual">Annual</Select.Option>
                  <Select.Option value="custom">Custom</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item
                name="status"
                label="Status"
                rules={[{ required: true, message: 'Please select status!' }]}
              >
                <Select>
                  <Select.Option value="draft">Draft</Select.Option>
                  <Select.Option value="active">Active</Select.Option>
                  <Select.Option value="completed">Completed</Select.Option>
                  <Select.Option value="cancelled">Cancelled</Select.Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col xs={24} md={8}>
              <Form.Item
                name="departmentId"
                label="Department ID (Optional)"
              >
                <Input placeholder="Enter department ID" />
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item
                name="parentOkrId"
                label="Parent OKR ID (Optional)"
              >
                <Input placeholder="Enter parent OKR ID" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col xs={24} md={8}>
              <Form.Item
                name="startDate"
                label="Start Date"
                rules={[{ required: true, message: 'Please select start date!' }]}
              >
                <DatePicker 
                  className="w-full" 
                  format="YYYY-MM-DD"
                  allowClear={false}
                />  
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item
                name="endDate"
                label="End Date"
                rules={[
                  { required: true, message: 'Please select end date!' },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || !getFieldValue('startDate') || value.isAfter(getFieldValue('startDate'))) {
                        return Promise.resolve();
                      }
                      return Promise.reject(new Error('End date must be after start date'));
                    },
                  }),
                ]}
              >
                <DatePicker 
                  className="w-full" 
                  format="YYYY-MM-DD"
                  allowClear={false}
                />  
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="category"
            label="Category"
            rules={[{ required: true, message: 'Please select a category!' }]}
          >
            <Select placeholder="Select category">
              <Option value="Business">Business</Option>
              <Option value="Technical">Technical</Option>
              <Option value="Personal">Personal</Option>
              <Option value="Team">Team</Option>
            </Select>
          </Form.Item>

          <Form.Item className="mt-8">
            <div style={{ display: 'flex', gap: '8px' }}>
              <Button type="primary" htmlType="submit" loading={submitting} icon={<SaveOutlined />}>
                {id ? 'Update OKR' : 'Create OKR'}
              </Button>
              <Button onClick={() => navigate('/okrs')} disabled={submitting}>
                Cancel
              </Button>
            </div>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default OkrFormPage;

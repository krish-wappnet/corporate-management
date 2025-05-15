import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { 
  Form, 
  Input, 
  Button, 
  Select, 
  Card, 
  Typography, 
  Switch, 
  DatePicker, 
  message, 
  Spin, 
  Space, 
  Row, 
  Col,
  Modal 
} from 'antd';
import { LoadingOutlined, TeamOutlined, UserSwitchOutlined } from '@ant-design/icons';
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';
import api from '../../services/api';
import { createFeedbackRequest, updateFeedbackRequest } from '../../api/feedbackApi';

// Define types
type FeedbackType = 'peer' | 'manager' | 'self' | 'upward' | '360';
type RequestStatus = 'pending' | 'completed' | 'declined' | 'expired';

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  position?: string;
  department?: string;
  roles?: string[];
  createdAt?: string;
  updatedAt?: string;
}

interface FeedbackFormValues {
  type: FeedbackType;
  recipientId: string;
  dueDate: Dayjs;
  message: string;
  subjectId: string; // The user who is the subject of the feedback
}

const initialValues: FeedbackFormValues = {
  type: 'peer',
  recipientId: '',
  dueDate: dayjs().add(7, 'day'),
  message: '',
  subjectId: '' // Will be set when we have the current user
};

const { Text } = Typography;
const { TextArea } = Input;
const { Option } = Select;

const FeedbackRequestForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [form] = Form.useForm<FeedbackFormValues>();
  
  const [managers, setManagers] = useState<User[]>([]);
  const [searchText, setSearchText] = useState('');
  const [fetching, setFetching] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [isSelfFeedback, setIsSelfFeedback] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  // Get current user from auth context
  const { user: currentUser, loading: loadingUser } = useAuth();

  // Fetch all users and filter for managers
  const fetchManagers = async (searchTerm: string = '') => {
    try {
      setFetching(true);
      const response = await api.get('/users', {
        params: {
          page: 1,
          limit: 100, // Fetch more users to ensure we get all managers
          ...(searchTerm && { search: searchTerm })
        }
      });
      
      if (response.data?.items) {
        // Filter for users with manager role
        const managersList = response.data.items.filter((user: User) => 
          user.roles?.includes('manager')
        );
        setManagers(managersList);
      }
    } catch (error) {
      console.error('Error fetching managers:', error);
      message.error('Failed to load managers');
    } finally {
      setFetching(false);
    }
  };

  // Initial load
  useEffect(() => {
    if (currentUser?.id) {
      fetchManagers('');
      // Set the subjectId when we have the current user
      form.setFieldsValue({ subjectId: currentUser.id });
    }
  }, [currentUser?.id]);

  // Make sure currentUser is available before rendering the form
  if (loadingUser || !currentUser) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '24px' }}>
        <Spin indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} />
      </div>
    );
  }

  // Handle search with debounce
  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    const timer = setTimeout(() => {
      fetchManagers(searchText.trim());
    }, 300);

    searchTimeoutRef.current = timer;

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
        searchTimeoutRef.current = null;
      }
    };
  }, [searchText]);

  // Load feedback request if in edit mode
  useEffect(() => {
    if (!id) return;
    
    const fetchRequest = async () => {
      try {
        setFormLoading(true);
        const response = await api.get(`/feedback/requests/${id}`);
        const request = response.data;
        
        form.setFieldsValue({
          ...request,
          dueDate: dayjs(request.dueDate)
        });
        
        // Set self feedback state if needed
        if (request.recipientId === currentUser.id) {
          setIsSelfFeedback(true);
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Error loading feedback request';
        message.error(errorMessage);
        console.error('Error fetching feedback request:', error);
        navigate('/feedback/requests');
      } finally {
        setFormLoading(false);
      }
    };
    
    fetchRequest();
  }, [id, form, navigate, currentUser.id]);

  const handleSelfFeedbackChange = (checked: boolean) => {
    if (!currentUser) return;
    
    setIsSelfFeedback(checked);
    if (checked) {
      form.setFieldsValue({ 
        recipientId: currentUser.id,
        type: 'self' as const
      });
    } else {
      form.setFieldsValue({ 
        recipientId: '',
        type: 'peer' as const
      });
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    navigate('/feedback/requests');
  };

  const onFinish = async (values: FeedbackFormValues) => {
    // This check is still good practice even though we check in the render
    if (!currentUser?.id) {
      message.error('User not authenticated');
      return;
    }

    // Additional client-side validation for due date
    if (values.dueDate && values.dueDate.isBefore(dayjs())) {
      message.error('Due date must be in the future');
      return;
    }

    try {
      setLoading(true);
      
      const requestData = {
        type: values.type,
        recipientId: values.recipientId,
        subjectId: currentUser.id, // The current user is the subject of the feedback
        requesterId: currentUser.id, // The current user is also the requester
        dueDate: values.dueDate.toISOString(),
        message: values.message,
        status: 'pending' as RequestStatus
      };
      
      if (id) {
        await updateFeedbackRequest(id, requestData);
        message.success('Feedback request updated successfully');
      } else {
        await createFeedbackRequest(requestData);
        message.success('Feedback request created successfully');
      }
      
      navigate('/feedback/requests');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to submit feedback request';
      message.error(errorMessage);
      console.error('Error submitting feedback request:', error);
    } finally {
      setLoading(false);
    }
  };



  if (formLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '24px' }}>
        <Spin indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} />
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: '24px 16px' }}>
      <Card 
        title={
          <Typography.Title level={4} style={{ margin: 0 }}>
            {id ? 'Update Feedback Request' : 'New Feedback Request'}
          </Typography.Title>
        }
        loading={formLoading}
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={initialValues}
          onFinish={onFinish}
        >
          <Row gutter={16}>
            <Col span={24} md={12}>
              <Form.Item
                name="type"
                label="Feedback Type"
                rules={[{ required: true, message: 'Please select feedback type' }]}
              >
                <Select placeholder="Select feedback type">
                  <Option value="peer">Peer Feedback</Option>
                  <Option value="manager">Manager Feedback</Option>
                  <Option value="self">Self Feedback</Option>
                  <Option value="upward">Upward Feedback</Option>
                  <Option value="360">360° Feedback</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={24} md={12}>
              <Form.Item
                name="isSelfFeedback"
                label="Request Self-Feedback"
                valuePropName="checked"
              >
                <Switch 
                  checkedChildren={<UserSwitchOutlined />} 
                  unCheckedChildren={<TeamOutlined />} 
                  onChange={handleSelfFeedbackChange}
                />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="recipientId"
            label={isSelfFeedback ? 'Recipient (You)' : 'Select Recipient'}
            rules={[
              { required: true, message: 'Please select a recipient' },
            ]}
          >
            <Select
              showSearch
              placeholder={isSelfFeedback ? 'You' : 'Search for a manager'}
              optionFilterProp="children"
              onSearch={setSearchText}
              filterOption={false}
              loading={fetching}
              disabled={isSelfFeedback}
            >
              {managers.map((manager) => {
                const displayName = `${manager.firstName} ${manager.lastName} (${manager.email})`;
                return (
                  <Option key={manager.id} value={manager.id}>
                    {displayName}
                  </Option>
                );
              })}
            </Select>
          </Form.Item>

          <Form.Item
            name="dueDate"
            label="Due Date"
            rules={[
              { required: true, message: 'Please select due date' },
              {
                validator: (_, value) => {
                  if (!value || value.isAfter(dayjs())) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('Due date must be in the future'));
                },
              },
            ]}
          >
            <DatePicker 
              style={{ width: '100%' }} 
              disabledDate={(current) => {
                // Disable dates before today
                return current && current < dayjs().startOf('day');
              }}
            />
          </Form.Item>

          <Form.Item
            name="message"
            label="Message to Recipient"
            rules={[{ required: true, message: 'Please enter a message' }]}
          >
            <TextArea rows={4} placeholder="Enter your message to the recipient" />
          </Form.Item>

          <Form.Item>
            <Space>
              <Button 
                type="primary" 
                htmlType="submit" 
                loading={loading}
                disabled={!form.isFieldsTouched()}
              >
                {id ? 'Update Request' : 'Submit Request'}
              </Button>
              <Button 
                onClick={() => setIsModalVisible(true)}
                disabled={loading}
              >
                Cancel
              </Button>
            </Space>
          </Form.Item>
        </Form>

        <Modal
          title="Cancel Request"
          open={isModalVisible}
          onOk={handleCancel}
          onCancel={() => setIsModalVisible(false)}
          okText="Yes, Cancel"
          cancelText="No, Continue"
        >
          <Text>
            Are you sure you want to cancel this request? Any unsaved changes will be lost.
          </Text>
        </Modal>
      </Card>
    </div>
  );
};

export default FeedbackRequestForm;

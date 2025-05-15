import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  Form, 
  Input, 
  Button, 
  Card, 
  Select, 
  Spin, 
  Typography,
  Divider,
  Rate,
  Checkbox,
} from 'antd';
import { useSnackbar } from 'notistack';
import { useAuth } from '../../hooks/useAuth';
import { FeedbackType } from '../../types/feedback.types';

const { TextArea } = Input;
const { Option } = Select;
const { Title } = Typography;

interface SelectOption {
  label: string;
  value: string;
  email?: string;
}

interface FeedbackFormData {
  type: FeedbackType;
  content: string;
  toUserId: string;
  ratings: Record<string, number>;
  strengths: string;
  improvements: string;
  isAnonymous: boolean;
  cycleId?: string;
}

interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

const ratingCriteria = [
  { id: 'quality', label: 'Quality of Work' },
  { id: 'communication', label: 'Communication' },
  { id: 'teamwork', label: 'Teamwork' },
  { id: 'initiative', label: 'Initiative' },
  { id: 'problem_solving', label: 'Problem Solving' },
];

const initialRatings = {
  quality: 0,
  communication: 0,
  teamwork: 0,
  initiative: 0,
  problem_solving: 0,
};

interface FeedbackFormProps {
  isEdit?: boolean;
}

const FeedbackForm: React.FC<FeedbackFormProps> = ({ isEdit = false }) => {
  const { id } = useParams<{ id?: string }>();
  const { enqueueSnackbar } = useSnackbar();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [initialValues] = useState<FeedbackFormData>({
    type: FeedbackType.PEER,
    content: '',
    ratings: { ...initialRatings },
    strengths: '',
    improvements: '',
    toUserId: '',
    isAnonymous: false,
    cycleId: '',
  });

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const mockUsers: User[] = [
          { id: '1', name: 'John Doe', email: 'john@example.com', avatar: 'https://via.placeholder.com/40' },
          { id: '2', name: 'Jane Smith', email: 'jane@example.com', avatar: 'https://via.placeholder.com/40' },
          { id: '3', name: 'Bob Johnson', email: 'bob@example.com', avatar: 'https://via.placeholder.com/40' },
        ];
        setUsers(mockUsers.filter(u => u.id !== user?.id));
      } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to fetch users';
        console.error('Error fetching users:', errorMessage);
      }
    };
    fetchUsers();
  }, [user]);

  useEffect(() => {
    const fetchFeedback = async () => {
      if (!id) return;
      try {
        setLoading(true);
        const mockFeedback = {
          type: FeedbackType.PEER,
          content: 'Sample feedback content',
          toUserId: '2',
          ratings: { ...initialRatings },
          strengths: 'Great team player',
          improvements: 'Could improve time management',
          isAnonymous: false,
        };
        form.setFieldsValue(mockFeedback);
      } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
        enqueueSnackbar(`Failed to load feedback: ${errorMessage}`, { variant: 'error' });
      } finally {
        setLoading(false);
      }
    };
    fetchFeedback();
  }, [id, form, enqueueSnackbar]);

  const api = {
    updateFeedback: async (id: string, data: FeedbackFormData): Promise<void> => {
      console.log('Updating feedback:', id, data);
      return Promise.resolve();
    },
    createFeedback: async (data: Omit<FeedbackFormData, 'id'>): Promise<void> => {
      console.log('Creating feedback:', data);
      return Promise.resolve();
    },
  };

  const { updateFeedback, createFeedback } = api;

  const onFinish = async (values: FeedbackFormData) => {
    try {
      setSubmitting(true);
      if (isEdit && id) {
        await updateFeedback(id, values);
      } else {
        await createFeedback(values);
      }
      enqueueSnackbar(
        isEdit ? 'Feedback updated successfully' : 'Feedback submitted successfully',
        { variant: 'success' }
      );
      navigate('/feedback');
    } catch (err: unknown) {
      const error = err as Error;
      const errorMessage = error?.message || 'Failed to submit feedback';
      enqueueSnackbar(`Failed to save feedback: ${errorMessage}`, {
        variant: 'error',
        autoHideDuration: 3000,
      });
      console.error('Error saving feedback:', error);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading && id) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8 animate-slide-in">
          <Title level={2} className="text-3xl font-bold text-gray-900 tracking-tight">
            {isEdit ? 'Edit Feedback' : 'Provide Feedback'}
          </Title>
          <p className="mt-2 text-gray-600 text-lg">
            Share constructive feedback to help your colleagues grow
          </p>
        </div>
        
        <Card className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 animate-slide-in">
          <Spin spinning={loading}>
            <Form
              form={form}
              layout="vertical"
              onFinish={onFinish}
              initialValues={initialValues}
              className="space-y-8"
            >
              {/* General Information Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Form.Item
                  name="type"
                  label={<span className="text-gray-700 font-semibold">Feedback Type</span>}
                  rules={[{ required: true, message: 'Please select feedback type' }]}
                >
                  <Select
                    placeholder="Select feedback type"
                    className="w-full rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-500"
                  >
                    {Object.values(FeedbackType).map((type) => (
                      <Option key={type} value={type}>
                        {type}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>

                <Form.Item
                  name="toUserId"
                  label={<span className="text-gray-700 font-semibold">Recipient</span>}
                  rules={[{ required: true, message: 'Please select a recipient' }]}
                >
                  <Select
                    showSearch
                    placeholder="Select a recipient"
                    optionFilterProp="children"
                    filterOption={(input, option) => {
                      const label = typeof option?.label === 'string' ? option.label : '';
                      const email = option?.email || '';
                      return (
                        label.toLowerCase().includes(input.toLowerCase()) ||
                        email.toLowerCase().includes(input.toLowerCase())
                      );
                    }}
                    className="w-full rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-500"
                  >
                    {users.map((user) => (
                      <Option key={user.id} value={user.id} label={user.name} email={user.email}>
                        <div className="flex items-center space-x-3">
                          <img
                            src={user.avatar}
                            alt={user.name}
                            className="w-8 h-8 rounded-full border border-gray-200"
                          />
                          <div>
                            <span className="font-medium text-gray-900">{user.name}</span>
                            <span className="block text-sm text-gray-500">{user.email}</span>
                          </div>
                        </div>
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </div>

              <Divider className="my-6" />

              {/* Performance Ratings Section */}
              <div className="space-y-6">
                <h4 className="text-xl font-semibold text-gray-900">Performance Ratings</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {ratingCriteria.map((criterion) => (
                    <Form.Item
                      key={criterion.id}
                      name={['ratings', criterion.id]}
                      label={<span className="text-gray-700 font-medium">{criterion.label}</span>}
                      className="space-y-2"
                    >
                      <Rate
                        allowHalf
                        className="text-2xl"
                        tooltips={['Poor', 'Fair', 'Good', 'Very Good', 'Excellent']}
                      />
                    </Form.Item>
                  ))}
                </div>
              </div>

              <Divider className="my-6" />

              {/* Feedback Details Section */}
              <div className="space-y-6">
                <h4 className="text-xl font-semibold text-gray-900">Feedback Details</h4>
                <Form.Item
                  name="content"
                  label={<span className="text-gray-700 font-semibold">Detailed Feedback</span>}
                  rules={[{ required: true, message: 'Please enter your feedback' }]}
                >
                  <TextArea
                    rows={5}
                    placeholder="Provide detailed feedback to help your colleague improve..."
                    className="w-full rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-gray-900 placeholder-gray-400 resize-none"
                  />
                </Form.Item>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Form.Item
                    name="strengths"
                    label={<span className="text-gray-700 font-semibold">Strengths</span>}
                  >
                    <TextArea
                      rows={3}
                      placeholder="Highlight what they do well..."
                      className="w-full rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-gray-900 placeholder-gray-400 resize-none"
                    />
                  </Form.Item>

                  <Form.Item
                    name="improvements"
                    label={<span className="text-gray-700 font-semibold">Areas for Improvement</span>}
                  >
                    <TextArea
                      rows={3}
                      placeholder="Suggest areas where they can improve..."
                      className="w-full rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-gray-900 placeholder-gray-400 resize-none"
                    />
                  </Form.Item>
                </div>
              </div>

              <Divider className="my-6" />

              {/* Submission Options Section */}
              <div className="space-y-6">
                <Form.Item
                  name="isAnonymous"
                  valuePropName="checked"
                  className="mb-0"
                >
                  <Checkbox className="text-gray-700 font-medium">
                    Submit Anonymously
                  </Checkbox>
                </Form.Item>

                <div className="flex justify-end space-x-4 pt-4">
                  <Button
                    onClick={() => navigate(-1)}
                    disabled={submitting}
                    className="px-6 py-2 bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 transition-all"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="primary"
                    htmlType="submit"
                    loading={submitting}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 transition-all"
                  >
                    {isEdit ? 'Update Feedback' : 'Submit Feedback'}
                  </Button>
                </div>
              </div>
            </Form>
          </Spin>
        </Card>
      </div>
    </div>
  );
};

export default FeedbackForm;
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Box, 
  Button, 
  Card, 
  CardContent, 
  Chip, 
  FormControl, 
  IconButton, 
  InputLabel, 
  MenuItem, 
  Select, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TablePagination, 
  TableRow, 
  TextField, 
  Typography,
  Avatar,
  Tooltip,
  InputAdornment
} from '@mui/material';
import type { SelectChangeEvent } from '@mui/material/Select';
import { 
  Add as AddIcon, 
  Search as SearchIcon, 
  FilterList as FilterListIcon,
  Visibility as VisibilityIcon,
  Check as CheckIcon,
  Close as CloseIcon,
  Edit as EditIcon,
  Delete as DeleteIcon
} from '@mui/icons-material';
import { useAuth } from '../../hooks/useAuth';
import { getFeedbackRequests } from '../../api/feedbackApi';
import type { FeedbackRequest } from '../../types/feedback.types';
import { RequestStatus, FeedbackType } from '../../types/feedback.types';
import PageHeader from '../../components/PageHeader';
import { formatDistanceToNow } from 'date-fns';

const FeedbackRequests: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [requests, setRequests] = useState<FeedbackRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [total, setTotal] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    status: '',
    type: '',
    requesterId: '',
    recipientId: '',
    subjectId: '',
    cycleId: ''
  });

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const params = {
        page: page + 1,
        limit: rowsPerPage,
        ...(searchTerm && { search: searchTerm }),
        ...(filters.status && { status: (filters.status as RequestStatus) || undefined }),
        ...(filters.type && { type: (filters.type as FeedbackType) || undefined }),
        ...(filters.requesterId && { requesterId: filters.requesterId }),
        ...(filters.recipientId && { recipientId: filters.recipientId }),
        ...(filters.subjectId && { subjectId: filters.subjectId }),
        ...(filters.cycleId && { cycleId: filters.cycleId }),
      };
      
      const data = await getFeedbackRequests(params);
      setRequests(data.items);
      setTotal(data.total);
    } catch (error) {
      console.error('Error fetching feedback requests:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, [page, rowsPerPage, filters]);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleTypeFilterChange = (event: SelectChangeEvent<unknown>) => {
    const { value } = event.target;
    setFilters(prev => ({
      ...prev,
      type: value as FeedbackType
    }));
    setPage(0);
  };

  const handleStatusFilterChange = (event: SelectChangeEvent<unknown>) => {
    const { value } = event.target;
    setFilters(prev => ({
      ...prev,
      status: value as RequestStatus
    }));
    setPage(0);
  };

  const handleFilterChange = (e: any) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
    setPage(0);
  };

  const getStatusColor = (status: RequestStatus) => {
    switch (status) {
      case RequestStatus.PENDING:
        return 'warning';
      case RequestStatus.COMPLETED:
        return 'success';
      case RequestStatus.DECLINED:
        return 'error';
      case RequestStatus.EXPIRED:
        return 'default';
      default:
        return 'default';
    }
  };

  const getTypeLabel = (type: FeedbackType) => {
    switch (type) {
      case FeedbackType.PEER:
        return 'Peer';
      case FeedbackType.MANAGER:
        return 'Manager';
      case FeedbackType.SELF:
        return 'Self';
      case FeedbackType.UPWARD:
        return 'Upward';
      case FeedbackType.THREE_SIXTY:
        return '360°';
      default:
        return type;
    }
  };

  const handleRespondToRequest = async (requestId: string, accept: boolean) => {
    try {
      // Implement API call to respond to request
      console.log(`Request ${requestId} ${accept ? 'accepted' : 'declined'}`);
      // await respondToFeedbackRequest(requestId, accept);
      fetchRequests(); // Refresh the list
    } catch (error) {
      console.error('Error responding to request:', error);
    }
  };

  return (
    <Box>
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h4" component="h1" gutterBottom>
            Feedback Requests
          </Typography>
          <Typography variant="body1" color="textSecondary">
            View and manage feedback requests
          </Typography>
        </Box>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => navigate('/feedback/requests/new')}
        >
          New Request
        </Button>
      </Box>

      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Search requests..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              size="small"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
            <FormControl variant="outlined" size="small" sx={{ minWidth: 150 }}>
              <InputLabel>Type</InputLabel>
              <Select
                value={filters.type}
                onChange={handleTypeFilterChange}
                label="Type"
              >
                <MenuItem value="">All Types</MenuItem>
                {Object.entries(FeedbackType).map(([key, value]) => (
                  <MenuItem key={key} value={value}>
                    {getTypeLabel(value as FeedbackType)}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl variant="outlined" size="small" sx={{ minWidth: 150 }}>
              <InputLabel>Status</InputLabel>
              <Select
                value={filters.status}
                onChange={handleStatusFilterChange}
                label="Status"
              >
                <MenuItem value="">All Statuses</MenuItem>
                {Object.entries(RequestStatus).map(([key, value]) => (
                  <MenuItem key={key} value={value}>
                    {value}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </CardContent>
      </Card>

      <Card>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Request</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Subject</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Due Date</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    Loading...
                  </TableCell>
                </TableRow>
              ) : requests.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    No feedback requests found
                  </TableCell>
                </TableRow>
              ) : (
                requests.map((request) => (
                  <TableRow key={request.id} hover>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Avatar 
                          src={request.requester?.avatar} 
                          sx={{ width: 32, height: 32, mr: 1 }}
                        >
                          {request.requester?.firstName?.charAt(0)}
                        </Avatar>
                        <Box>
                          <Typography variant="subtitle2">
                            {request.requester?.firstName} {request.requester?.lastName}
                          </Typography>
                          <Typography variant="caption" color="textSecondary">
                            requested feedback {formatDistanceToNow(new Date(request.createdAt), { addSuffix: true })}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={getTypeLabel(request.type)} 
                        size="small"
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Avatar 
                          src={request.subject?.avatar} 
                          sx={{ width: 32, height: 32, mr: 1 }}
                        >
                          {request.subject?.firstName?.charAt(0)}
                        </Avatar>
                        <Box>
                          <Typography variant="subtitle2">
                            {request.subject?.firstName} {request.subject?.lastName}
                          </Typography>
                          <Typography variant="caption" color="textSecondary">
                            {request.subject?.position}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={request.status} 
                        color={getStatusColor(request.status) as any}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      {new Date(request.dueDate).toLocaleDateString()}
                      <Typography variant="caption" display="block" color="textSecondary">
                        {new Date(request.dueDate) < new Date() && request.status === RequestStatus.PENDING
                          ? 'Overdue'
                          : `in ${formatDistanceToNow(new Date(request.dueDate), { addSuffix: true })}`
                        }
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Tooltip title="View Details">
                          <IconButton 
                            size="small" 
                            onClick={() => navigate(`/feedback/requests/${request.id}`)}
                          >
                            <VisibilityIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        
                        {request.status === RequestStatus.PENDING && request.recipientId === user?.id && (
                          <>
                            <Tooltip title="Accept Request">
                              <IconButton 
                                size="small" 
                                color="success"
                                onClick={() => handleRespondToRequest(request.id, true)}
                              >
                                <CheckIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Decline Request">
                              <IconButton 
                                size="small" 
                                color="error"
                                onClick={() => handleRespondToRequest(request.id, false)}
                              >
                                <CloseIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          </>
                        )}
                        
                        {request.status === RequestStatus.PENDING && request.requesterId === user?.id && (
                          <>
                            <Tooltip title="Edit">
                              <IconButton 
                                size="small"
                                onClick={() => navigate(`/feedback/requests/${request.id}/edit`)}
                              >
                                <EditIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Delete">
                              <IconButton 
                                size="small"
                                color="error"
                                onClick={() => {}}
                              >
                                <DeleteIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          </>
                        )}
                      </Box>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={total}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Card>
    </Box>
  );
};

export default FeedbackRequests;

// pages/dashboard.tsx
import React, { useState, useEffect } from 'react';
import {
  Typography,
  Box,
  Checkbox,
  FormControlLabel,
  Button,
} from '@mui/material';
import { useAuth } from '../context/AuthContext';
import TaskList from '../components/TaskList';
import { Add } from '@mui/icons-material';
import AddTaskDialog from '@/components/AddTaskDialog';
import { Task } from '@/types/tasks';

const Dashboard = () => {
  const { logout } = useAuth();

  const [tasks, setTasks] = useState<Task[]>([]);
  const [showOwnedOnly, setShowOwnedOnly] = useState(false);
  const [openDialog, setOpenDialog] = useState(false); // State to manage dialog open/close

  useEffect(() => {
    // Fetch tasks from the backend
    const fetchTasks = async () => {
      try {
        const response = await fetch('http://localhost:4000/tasks', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        const data = await response.json();
        setTasks(data);
      } catch (error) {
        console.error('Error fetching tasks:', error);
      }
    };

    fetchTasks();
  }, []);

  const handleFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setShowOwnedOnly(event.target.checked);
  };

  const handleLogout = () => {
    logout();
  };

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleTaskAdded = (newTask: any) => {
    setTasks((prevTasks) => [...prevTasks, newTask]);
  };

  return (
    <Box
      sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
    >
      <Box
        display="flex"
        justifyContent="flex-end"
        alignItems="center"
        width="100%"
        mb={4}
      >
        <Box
          display="flex"
          alignContent="end"
          alignItems="end"
          flexDirection="column"
        >
          <Typography variant="h5">John Doe</Typography>
          <Typography variant="body2">johndoe@email.com</Typography>
          <Button color="primary" onClick={handleLogout}>
            Sign out
          </Button>
        </Box>
      </Box>

      <Box width="100%" display="flex" justifyContent="space-between" mt={16}>
        <Typography variant="h4" mb={2}>
          Tasks
        </Typography>
        <FormControlLabel
          control={
            <Checkbox checked={showOwnedOnly} onChange={handleFilterChange} />
          }
          label="Show owned only by me"
        />
      </Box>

      <Box width="100%">
        <TaskList tasks={tasks} showOwnedOnly={showOwnedOnly} />
      </Box>

      <Button
        startIcon={<Add />}
        fullWidth
        onClick={handleOpenDialog}
        sx={{ mt: 2 }}
      >
        Add Task
      </Button>

      {/* Add Task Dialog */}
      <AddTaskDialog
        open={openDialog}
        onClose={handleCloseDialog}
        onTaskAdded={handleTaskAdded}
      />
    </Box>
  );
};

export default Dashboard;

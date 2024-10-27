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
import { Add, Logout } from '@mui/icons-material';
import AddTaskDialog from '@/components/AddTaskDialog';
import { Task } from '@/types/tasks';

const Dashboard = () => {
  const { logout, user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [showOwnedOnly, setShowOwnedOnly] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);

  const fetchTasks = async (ownedOnly = false) => {
    try {
      const response = await fetch(
        `http://localhost:4000/tasks${ownedOnly ? '?ownedOnly=true' : ''}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        },
      );
      const data = await response.json();
      setTasks(data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  useEffect(() => {
    // Initially fetch all tasks
    fetchTasks();
  }, []);

  const handleFilterChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const isChecked = event.target.checked;
    setShowOwnedOnly(isChecked);

    // Fetch tasks based on filter selection
    fetchTasks(isChecked);
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

  const handleTaskAdded = (newTask: Task) => {
    setTasks((prevTasks) => [...prevTasks, newTask]);
  };

  const handleDelete = async (taskId: number) => {
    try {
      fetch(`http://localhost:4000/tasks/${taskId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      }).then((res) => {
        if (!res.ok) {
          throw new Error('Failed to delete task');
        }
        setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));
      });

      // Update tasks list after deletion
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const handleToggleComplete = async (
    taskId: number,
    currentStatus: boolean,
  ) => {
    try {
      fetch(`http://localhost:4000/tasks/${taskId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ completed: !currentStatus }),
      }).then((res) => {
        if (!res.ok) {
          throw new Error('Failed to update task status');
        }
        setTasks((prevTasks) =>
          prevTasks.map((task) =>
            task.id === taskId ? { ...task, completed: !currentStatus } : task,
          ),
        );
      });
    } catch (error) {
      console.error('Error toggling task status:', error);
    }
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
          <Typography variant="h5">{user?.name || 'User'}</Typography>
          <Typography variant="body2">
            {user?.email || 'user@example.com'}
          </Typography>
          <Button color="primary" onClick={handleLogout} endIcon={<Logout />}>
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
        <TaskList
          tasks={tasks}
          showOwnedOnly={showOwnedOnly}
          handleDelete={handleDelete}
          handleToggleComplete={handleToggleComplete}
        />
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

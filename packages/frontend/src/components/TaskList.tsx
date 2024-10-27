// components/TaskList.tsx
import React from 'react';
import { Delete } from '@mui/icons-material';
import {
  Box,
  Typography,
  IconButton,
  Checkbox,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  ListItemButton,
} from '@mui/material';

interface Task {
  id: number;
  description: string;
  completed: boolean;
  owners: { name: string }[];
}

interface TaskListProps {
  tasks: Task[];
  showOwnedOnly: boolean;
}

const TaskList: React.FC<TaskListProps> = ({ tasks, showOwnedOnly }) => {
  const handleDelete = async (taskId: number) => {
    try {
      await fetch(`http://localhost:4000/tasks/${taskId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const handleToggleComplete = async (
    taskId: number,
    currentStatus: boolean,
  ) => {
    try {
      await fetch(`http://localhost:4000/tasks/${taskId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ completed: !currentStatus }),
      });
    } catch (error) {
      console.error('Error toggling task status:', error);
    }
  };

  return (
    <List>
      {tasks
        .filter(
          (task) =>
            !showOwnedOnly ||
            task.owners.some((owner) => owner.name === 'John Doe'),
        )
        .map((task) => (
          <ListItem
            key={task.id}
            sx={{ backgroundColor: '#f5f5f5', marginBottom: 1 }}
            secondaryAction={
              <IconButton
                edge="end"
                aria-label="delete"
                onClick={() => handleDelete(task.id)}
              >
                <Delete />
              </IconButton>
            }
          >
            <Checkbox
              checked={task.completed}
              onChange={() => handleToggleComplete(task.id, task.completed)}
            />
            <ListItemText
              primary={task.description}
              sx={{ textDecoration: task.completed ? 'line-through' : 'none' }}
            />
            <Box sx={{ display: 'flex', gap: 1 }}>
              {task.owners.map((owner, index) => (
                <Chip
                  key={index}
                  label={owner.name}
                  color={owner.name === 'John Doe' ? 'primary' : 'secondary'}
                />
              ))}
            </Box>
          </ListItem>
        ))}
    </List>
  );
};

export default TaskList;

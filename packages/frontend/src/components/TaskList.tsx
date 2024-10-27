// components/TaskList.tsx
import React from 'react';
import { Delete } from '@mui/icons-material';
import {
  Box,
  IconButton,
  Checkbox,
  Chip,
  List,
  ListItem,
  ListItemText,
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
  handleDelete: (taskId: number) => void;
  handleToggleComplete: (taskId: number, completed: boolean) => void;
}

const TaskList: React.FC<TaskListProps> = ({ tasks, handleDelete, handleToggleComplete }) => {


  return (
    <List>
      {tasks.map((task) => (
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

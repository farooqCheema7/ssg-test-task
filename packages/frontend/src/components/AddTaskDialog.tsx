// components/AddTaskDialog.tsx
import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Button,
  Checkbox,
  FormControlLabel,
  FormGroup,
  MenuItem,
  Stack,
} from '@mui/material';

interface AddTaskDialogProps {
  open: boolean;
  onClose: () => void;
  onTaskAdded: (newTask: any) => void;
}

const AddTaskDialog: React.FC<AddTaskDialogProps> = ({
  open,
  onClose,
  onTaskAdded,
}) => {
  const [description, setDescription] = useState('');
  const [owners, setOwners] = useState<{ id: number; name: string }[]>([]);
  const [selectedOwners, setSelectedOwners] = useState<number[]>([]);

  useEffect(() => {
    // Fetch users to select as task owners
    const fetchUsers = async () => {
      try {
        const response = await fetch('http://localhost:4000/users', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        const data = await response.json();
        setOwners(data);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, []);

  const handleAddTask = async () => {
    try {
      const response = await fetch('http://localhost:4000/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          description,
          ownerIds: selectedOwners,
        }),
      });
      const newTask = await response.json();
      onTaskAdded(newTask);
      onClose();
      setDescription('');
      setSelectedOwners([]);
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>Add New Task</DialogTitle>
      <DialogContent>
        <Stack spacing={2} my={2}>
          <TextField
            autoFocus
            margin="dense"
            label="Description"
            type="text"
            fullWidth
            variant="outlined"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <TextField
            select
            label="Owners"
            slotProps={{
              select: {
                multiple: true,
                value: selectedOwners,
                onChange: (e) => setSelectedOwners(e.target.value as number[]),
                renderValue: (selected) =>
                  (selected as number[])
                    .map((id) => owners.find((owner) => owner.id === id)?.name)
                    .join(', '),
              },
            }}
            fullWidth
            variant="outlined"
          >
            {owners.map((owner) => (
              <MenuItem key={owner.id} value={owner.id}>
                {owner.name}
              </MenuItem>
            ))}
          </TextField>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">
          Cancel
        </Button>
        <Button onClick={handleAddTask} color="primary" variant="contained">
          Add Task
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddTaskDialog;

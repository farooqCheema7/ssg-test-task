export interface Task {
  id: number;
  description: string;
  completed: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface TaskWithOwners extends Task {
  owners: { id: number; name: string }[];
}

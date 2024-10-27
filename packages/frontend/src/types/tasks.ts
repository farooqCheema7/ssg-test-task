export interface Task {
  id: number;
  description: string;
  completed: boolean;
  created_at: Date;
  updated_at: Date;
  owners: { id: number; name: string }[];
}

-- Initialize the Users Table
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(50) NOT NULL,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Insert sample users with hashed passwords
-- Note: Replace 'hashed_password_here' with actual bcrypt-hashed passwords
INSERT INTO users (email, name, password)
VALUES 
  ('john@example.com', 'John Doe', 'password_john'),
  ('jane@example.com', 'Jane Smith', 'password_jane')
ON CONFLICT (email) DO NOTHING;

-- Initialize the Tasks Table
CREATE TABLE IF NOT EXISTS tasks (
  id SERIAL PRIMARY KEY,
  description TEXT NOT NULL,
  completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Initialize the Task_Owners Table for many-to-many relationship between users and tasks
CREATE TABLE IF NOT EXISTS task_owners (
  task_id INTEGER REFERENCES tasks(id) ON DELETE CASCADE,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  PRIMARY KEY (task_id, user_id)
);

-- Insert sample tasks
INSERT INTO tasks (description, completed)
VALUES
  ('Complete the project documentation', FALSE),
  ('Review the new project proposal', TRUE)
ON CONFLICT DO NOTHING;

-- Insert sample task-owner relationships
-- Assuming user with id 1 owns both tasks for illustration
INSERT INTO task_owners (task_id, user_id)
VALUES
  (1, 1),
  (2, 1)
ON CONFLICT DO NOTHING;


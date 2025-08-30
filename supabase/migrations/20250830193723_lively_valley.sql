/*
  # Smart Student Hub Database Schema

  1. New Tables
    - `institutions`
      - `id` (uuid, primary key)
      - `name` (text, institution name)
      - `code` (text, unique institution code)
      - `address` (text, physical address)
      - `contact_email` (text, contact email)
      - `created_at` (timestamp)

    - `users`
      - `id` (uuid, primary key, references auth.users)
      - `email` (text, user email)
      - `full_name` (text, user's full name)
      - `role` (text, user role: student/faculty/admin)
      - `institution_id` (uuid, foreign key to institutions)
      - `student_id` (text, student identifier, nullable)
      - `department` (text, user's department)
      - `verification_status` (text, account verification status)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

    - `achievements`
      - `id` (uuid, primary key)
      - `student_id` (uuid, foreign key to users)
      - `title` (text, achievement title)
      - `description` (text, achievement description)
      - `category` (text, achievement category)
      - `date_achieved` (timestamp, when achievement was earned)
      - `verified_by` (uuid, foreign key to users, nullable)
      - `verification_status` (text, verification status)
      - `evidence_url` (text, supporting evidence URL, nullable)
      - `points` (integer, points awarded)
      - `created_at` (timestamp)

    - `events`
      - `id` (uuid, primary key)
      - `title` (text, event title)
      - `description` (text, event description)
      - `category` (text, event category)
      - `start_date` (timestamp, event start date)
      - `end_date` (timestamp, event end date)
      - `location` (text, event location)
      - `created_by` (uuid, foreign key to users)
      - `institution_id` (uuid, foreign key to institutions)
      - `max_participants` (integer, maximum participants, nullable)
      - `status` (text, event status)
      - `created_at` (timestamp)

    - `event_participation`
      - `id` (uuid, primary key)
      - `event_id` (uuid, foreign key to events)
      - `student_id` (uuid, foreign key to users)
      - `status` (text, participation status)
      - `achievement_points` (integer, points earned, nullable)
      - `verified_by` (uuid, foreign key to users, nullable)
      - `created_at` (timestamp)

    - `portfolios`
      - `id` (uuid, primary key)
      - `student_id` (uuid, foreign key to users)
      - `title` (text, portfolio title)
      - `description` (text, portfolio description)
      - `is_public` (boolean, portfolio visibility)
      - `gpa` (decimal, student GPA, nullable)
      - `total_points` (integer, total achievement points)
      - `generated_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for role-based access control
*/

-- Create institutions table
CREATE TABLE IF NOT EXISTS institutions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  code text UNIQUE NOT NULL,
  address text NOT NULL,
  contact_email text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create users table (extends auth.users)
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text NOT NULL,
  full_name text NOT NULL,
  role text NOT NULL CHECK (role IN ('student', 'faculty', 'admin')),
  institution_id uuid REFERENCES institutions(id),
  student_id text,
  department text NOT NULL,
  verification_status text DEFAULT 'pending' CHECK (verification_status IN ('pending', 'verified', 'rejected')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create achievements table
CREATE TABLE IF NOT EXISTS achievements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text NOT NULL,
  category text NOT NULL CHECK (category IN ('academic', 'extracurricular', 'sports', 'research', 'volunteer', 'certification')),
  date_achieved timestamptz NOT NULL,
  verified_by uuid REFERENCES users(id),
  verification_status text DEFAULT 'pending' CHECK (verification_status IN ('pending', 'verified', 'rejected')),
  evidence_url text,
  points integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Create events table
CREATE TABLE IF NOT EXISTS events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  category text NOT NULL,
  start_date timestamptz NOT NULL,
  end_date timestamptz NOT NULL,
  location text NOT NULL,
  created_by uuid NOT NULL REFERENCES users(id),
  institution_id uuid NOT NULL REFERENCES institutions(id),
  max_participants integer,
  status text DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'completed', 'cancelled')),
  created_at timestamptz DEFAULT now()
);

-- Create event_participation table
CREATE TABLE IF NOT EXISTS event_participation (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id uuid NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  student_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  status text DEFAULT 'registered' CHECK (status IN ('registered', 'attended', 'completed', 'no_show')),
  achievement_points integer,
  verified_by uuid REFERENCES users(id),
  created_at timestamptz DEFAULT now(),
  UNIQUE(event_id, student_id)
);

-- Create portfolios table
CREATE TABLE IF NOT EXISTS portfolios (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE UNIQUE,
  title text NOT NULL,
  description text NOT NULL,
  is_public boolean DEFAULT false,
  gpa decimal(4,2),
  total_points integer DEFAULT 0,
  generated_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE institutions ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_participation ENABLE ROW LEVEL SECURITY;
ALTER TABLE portfolios ENABLE ROW LEVEL SECURITY;

-- Institutions policies
CREATE POLICY "Institutions are viewable by all authenticated users"
  ON institutions
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Only admins can manage institutions"
  ON institutions
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role = 'admin'
    )
  );

-- Users policies
CREATE POLICY "Users can view their own profile"
  ON users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Faculty can view students in their institution"
  ON users
  FOR SELECT
  TO authenticated
  USING (
    role = 'student' AND 
    EXISTS (
      SELECT 1 FROM users faculty 
      WHERE faculty.id = auth.uid() 
      AND faculty.role IN ('faculty', 'admin')
      AND faculty.institution_id = users.institution_id
    )
  );

CREATE POLICY "Admins can view all users"
  ON users
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users admin 
      WHERE admin.id = auth.uid() 
      AND admin.role = 'admin'
    )
  );

CREATE POLICY "Users can update their own profile"
  ON users
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

-- Achievements policies
CREATE POLICY "Students can view their own achievements"
  ON achievements
  FOR SELECT
  TO authenticated
  USING (student_id = auth.uid());

CREATE POLICY "Faculty can view achievements from their institution"
  ON achievements
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users faculty, users student
      WHERE faculty.id = auth.uid() 
      AND faculty.role IN ('faculty', 'admin')
      AND student.id = achievements.student_id
      AND faculty.institution_id = student.institution_id
    )
  );

CREATE POLICY "Students can create their own achievements"
  ON achievements
  FOR INSERT
  TO authenticated
  WITH CHECK (student_id = auth.uid());

CREATE POLICY "Faculty can update achievement verification"
  ON achievements
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users faculty, users student
      WHERE faculty.id = auth.uid() 
      AND faculty.role IN ('faculty', 'admin')
      AND student.id = achievements.student_id
      AND faculty.institution_id = student.institution_id
    )
  );

-- Events policies
CREATE POLICY "Users can view events from their institution"
  ON events
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.institution_id = events.institution_id
    )
  );

CREATE POLICY "Faculty can manage events"
  ON events
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role IN ('faculty', 'admin')
    )
  );

-- Event participation policies
CREATE POLICY "Students can view their own participation"
  ON event_participation
  FOR SELECT
  TO authenticated
  USING (student_id = auth.uid());

CREATE POLICY "Faculty can view participation for their events"
  ON event_participation
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM events, users 
      WHERE events.id = event_participation.event_id
      AND users.id = auth.uid() 
      AND users.role IN ('faculty', 'admin')
      AND (events.created_by = auth.uid() OR users.role = 'admin')
    )
  );

CREATE POLICY "Students can register for events"
  ON event_participation
  FOR INSERT
  TO authenticated
  WITH CHECK (student_id = auth.uid());

-- Portfolios policies
CREATE POLICY "Students can view their own portfolio"
  ON portfolios
  FOR SELECT
  TO authenticated
  USING (student_id = auth.uid());

CREATE POLICY "Public portfolios are viewable by all"
  ON portfolios
  FOR SELECT
  TO authenticated
  USING (is_public = true);

CREATE POLICY "Students can manage their own portfolio"
  ON portfolios
  FOR ALL
  TO authenticated
  USING (student_id = auth.uid());

-- Insert sample institutions
INSERT INTO institutions (name, code, address, contact_email) VALUES
('Massachusetts Institute of Technology', 'MIT', '77 Massachusetts Ave, Cambridge, MA 02139', 'admin@mit.edu'),
('Stanford University', 'STANFORD', '450 Serra Mall, Stanford, CA 94305', 'admin@stanford.edu'),
('Harvard University', 'HARVARD', 'Cambridge, MA 02138', 'admin@harvard.edu'),
('University of California, Berkeley', 'UCB', 'Berkeley, CA 94720', 'admin@berkeley.edu'),
('California Institute of Technology', 'CALTECH', '1200 E California Blvd, Pasadena, CA 91125', 'admin@caltech.edu')
ON CONFLICT (code) DO NOTHING;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_institution_id ON users(institution_id);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_achievements_student_id ON achievements(student_id);
CREATE INDEX IF NOT EXISTS idx_achievements_verification_status ON achievements(verification_status);
CREATE INDEX IF NOT EXISTS idx_events_institution_id ON events(institution_id);
CREATE INDEX IF NOT EXISTS idx_events_created_by ON events(created_by);
CREATE INDEX IF NOT EXISTS idx_event_participation_event_id ON event_participation(event_id);
CREATE INDEX IF NOT EXISTS idx_event_participation_student_id ON event_participation(student_id);
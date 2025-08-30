export interface User {
  id: string;
  email: string;
  full_name: string;
  role: 'student' | 'faculty' | 'admin';
  institution_id?: string;
  student_id?: string;
  department?: string;
  verification_status: 'pending' | 'verified' | 'rejected';
  created_at: string;
  updated_at: string;
}

export interface Institution {
  id: string;
  name: string;
  code: string;
  address: string;
  contact_email: string;
  created_at: string;
}

export interface Achievement {
  id: string;
  student_id: string;
  title: string;
  description: string;
  category: 'academic' | 'extracurricular' | 'sports' | 'research' | 'volunteer' | 'certification';
  date_achieved: string;
  verified_by?: string;
  verification_status: 'pending' | 'verified' | 'rejected';
  evidence_url?: string;
  points: number;
  created_at: string;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  category: string;
  start_date: string;
  end_date: string;
  location: string;
  created_by: string;
  institution_id: string;
  max_participants?: number;
  status: 'draft' | 'published' | 'completed' | 'cancelled';
  created_at: string;
}

export interface EventParticipation {
  id: string;
  event_id: string;
  student_id: string;
  status: 'registered' | 'attended' | 'completed' | 'no_show';
  achievement_points?: number;
  verified_by?: string;
  created_at: string;
}

export interface Portfolio {
  id: string;
  student_id: string;
  title: string;
  description: string;
  is_public: boolean;
  achievements: Achievement[];
  gpa?: number;
  total_points: number;
  generated_at: string;
  updated_at: string;
}
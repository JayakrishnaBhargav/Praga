export type UserRole = 'citizen' | 'employee' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: UserRole;
  employee_code?: string;
  department?: string;
  designation?: string;
  age?: number;
  occupation?: string;
  income?: number;
  state?: string;
  district?: string;
  city?: string;
  created_at: string;
}

export interface Scheme {
  id: string;
  name: string;
  department: string;
  category: 'Agriculture' | 'Education' | 'Health' | 'Employment' | 'Housing' | 'Financial Assistance' | 'Women & Child' | 'Energy' | 'Other';
  description: string;
  eligibility: string;
  benefits: string;
  required_documents: string;
  application_process: string;
  official_url: string;
  min_age: number;
  max_age: number;
  max_income: number | null;
  target_occupations: string[];
  is_eligible?: boolean;
  reasons?: string[];
}

export interface TimelineEvent {
  status: string;
  timestamp: string;
  note: string;
  updated_by_name: string;
}

export interface ComplaintMedia {
  type: 'image' | 'video';
  url: string;
  name: string;
}

export interface Complaint {
  id: string;
  complaint_id: string;
  user_id: string;
  user_name: string;
  user_phone?: string;
  description: string;
  summary: string;
  category: string;
  sentiment: string;
  urgency: 'Low' | 'Medium' | 'High';
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  confidence: number;
  state: string;
  district: string;
  city: string;
  media_urls: ComplaintMedia[];
  status: 'Submitted' | 'Under Review' | 'Forwarded to Department' | 'In Progress' | 'Resolved';
  assigned_department: string;
  assigned_employee_code?: string;
  assigned_employee_name?: string;
  created_at: string;
  updated_at: string;
  timeline: TimelineEvent[];
}

export interface AIAnalysisResult {
  summary: string;
  category: string;
  sentiment: string;
  urgency: 'Low' | 'Medium' | 'High';
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  confidence: number;
  model_version: string;
  is_demo_analysis: boolean;
  notice: string;
}

export interface AdminStats {
  total: number;
  pending: number;
  resolved: number;
  highPriority: number;
  categoryCounts: Record<string, number>;
  priorityCounts: Record<string, number>;
  statusCounts: Record<string, number>;
  recentDays: { label: string; count: number }[];
  officerCount: number;
  schemeCount: number;
}

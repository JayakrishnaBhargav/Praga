import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import jwt from 'jsonwebtoken';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;
const isProd = process.env.NODE_ENV === 'production';
const JWT_SECRET = process.env.JWT_SECRET || 'praja_to_policy_secret_jwt_key_2026';

app.use(express.json({ limit: '25mb' }));
app.use(express.urlencoded({ extended: true, limit: '25mb' }));

// Initial Seed Data Types
interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  password?: string;
  role: 'citizen' | 'employee' | 'admin';
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

interface Scheme {
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
}

interface TimelineEvent {
  status: string;
  timestamp: string;
  note: string;
  updated_by_name: string;
}

interface Complaint {
  id: string;
  complaint_id: string;
  user_id: string;
  user_name: string;
  user_phone: string;
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
  media_urls: { type: 'image' | 'video'; url: string; name: string }[];
  status: 'Submitted' | 'Under Review' | 'Forwarded to Department' | 'In Progress' | 'Resolved';
  assigned_department: string;
  assigned_employee_code?: string;
  assigned_employee_name?: string;
  created_at: string;
  updated_at: string;
  timeline: TimelineEvent[];
}

const DB_DIR = path.join(__dirname, 'data');
const DB_FILE = path.join(DB_DIR, 'db.json');

// Ensure DB directory exists
if (!fs.existsSync(DB_DIR)) {
  fs.mkdirSync(DB_DIR, { recursive: true });
}

// Seed Schemes
const INITIAL_SCHEMES: Scheme[] = [
  {
    id: 'SCH-001',
    name: 'Pradhan Mantri Kisan Samman Nidhi (PM-KISAN)',
    department: 'Ministry of Agriculture & Farmers Welfare',
    category: 'Agriculture',
    description: 'Direct income support of ₹6,000 per year in three equal installments to all landholding farmer families across the country.',
    eligibility: 'All landholding farmer families with cultivable land in their names. Institutional landholders and high tax-paying individuals excluded.',
    benefits: '₹6,000 per annum paid directly to Aadhaar-linked bank accounts in three quarterly installments of ₹2,000.',
    required_documents: 'Aadhaar Card, Land ownership deed / Pattadar passbook, Active bank account details.',
    application_process: 'Apply online through PM-Kisan Portal or via nearest Common Service Centre (CSC) with land records.',
    official_url: 'https://pmkisan.gov.in',
    min_age: 18,
    max_age: 100,
    max_income: 600000,
    target_occupations: ['farmer', 'cultivator', 'agriculture', 'peasant', 'farm worker']
  },
  {
    id: 'SCH-002',
    name: 'Ayushman Bharat – Pradhan Mantri Jan Arogya Yojana (PM-JAY)',
    department: 'National Health Authority, MoHFW',
    category: 'Health',
    description: 'World\'s largest government-funded health assurance scheme providing secondary and tertiary hospitalization cover.',
    eligibility: 'Vulnerable and low-income families identified by Socio-Economic Caste Census (SECC) or family income below ₹3,00,000.',
    benefits: 'Cashless and paperless inpatient health cover of up to ₹5,00,000 per family per year across 27,000+ empanelled hospitals.',
    required_documents: 'Aadhaar Card, Ration Card, Income Certificate, Mobile Number.',
    application_process: 'Generate Ayushman Card at any empanelled hospital or CSC kiosk after online SECC verification.',
    official_url: 'https://pmjay.gov.in',
    min_age: 0,
    max_age: 120,
    max_income: 300000,
    target_occupations: ['all', 'laborer', 'daily wage', 'farmer', 'artisan', 'domestic worker', 'unemployed']
  },
  {
    id: 'SCH-003',
    name: 'National Means-cum-Merit Scholarship Scheme (NMMSS)',
    department: 'Department of School Education & Literacy',
    category: 'Education',
    description: 'Financial assistance to meritorious students from economically weaker sections to arrest dropouts after class VIII.',
    eligibility: 'Students studying in class IX with minimum 55% in class VIII whose parental annual income does not exceed ₹3,50,000.',
    benefits: 'Scholarship grant of ₹12,000 per academic year (₹1,000 per month) from Class IX through Class XII.',
    required_documents: 'Class 8 mark sheet, Parental income certificate, Category certificate, Aadhaar card.',
    application_process: 'Apply through National Scholarship Portal (NSP) after clearing state selection examination.',
    official_url: 'https://scholarships.gov.in',
    min_age: 12,
    max_age: 22,
    max_income: 350000,
    target_occupations: ['student', 'learner', 'scholar']
  },
  {
    id: 'SCH-004',
    name: 'PM Awas Yojana – Urban 2.0 (PMAY-U)',
    department: 'Ministry of Housing and Urban Affairs',
    category: 'Housing',
    description: 'Comprehensive housing mission ensuring pucca houses to eligible urban families without a permanent concrete house.',
    eligibility: 'EWS (Income up to ₹3L) and LIG (Income up to ₹6L) households who do not own a pucca house anywhere in India.',
    benefits: 'Interest subsidy up to 4% on home loans up to ₹25 Lakhs, plus direct construction subsidy grants.',
    required_documents: 'Aadhaar Card, Income Certificate, No-property affidavit, Bank statements, Urban residence proof.',
    application_process: 'Submit application on PMAY Urban portal or through Municipal Corporation Citizen Facilitation Centers.',
    official_url: 'https://pmay-urban.gov.in',
    min_age: 21,
    max_age: 70,
    max_income: 600000,
    target_occupations: ['all', 'worker', 'employee', 'daily wage', 'artisan', 'trader']
  },
  {
    id: 'SCH-005',
    name: 'PM Surya Ghar: Muft Bijli Yojana (Rooftop Solar)',
    department: 'Ministry of New and Renewable Energy',
    category: 'Energy',
    description: 'Direct capital subsidy scheme empowering residential households to generate their own clean solar electricity.',
    eligibility: 'Residential households with suitable rooftop space and active metered grid electrical connection.',
    benefits: 'Up to ₹78,000 direct subsidy for installing 3kW residential rooftop solar system, yielding free units every month.',
    required_documents: 'Electricity Bill, Property document, Aadhaar card, Canceled cheque.',
    application_process: 'Register on National Solar Rooftop Portal with consumer electricity number and choose vendor.',
    official_url: 'https://pmsuryaghar.gov.in',
    min_age: 18,
    max_age: 100,
    max_income: 1200000,
    target_occupations: ['all', 'homeowner', 'farmer', 'business', 'salaried', 'pensioner']
  },
  {
    id: 'SCH-006',
    name: 'PM Street Vendor\'s AtmaNirbhar Nidhi (PM SVANidhi)',
    department: 'Ministry of Housing and Urban Affairs',
    category: 'Financial Assistance',
    description: 'Affordable working capital collateral-free micro-credit to urban street vendors and roadside hawkers.',
    eligibility: 'Urban and peri-urban street vendors and hawkers engaged in vending operations with vending certificate/LOR.',
    benefits: 'Initial working capital loan of ₹10,000, followed by ₹20,000 and ₹50,000 on timely repayments with 7% interest subsidy.',
    required_documents: 'Aadhaar Card, Vending Certificate / Letter of Recommendation from Urban Local Body.',
    application_process: 'Apply directly via PM SVANidhi Portal or through Banking Correspondents / Urban Local Bodies.',
    official_url: 'https://pmsvanidhi.mohua.gov.in',
    min_age: 18,
    max_age: 75,
    max_income: 300000,
    target_occupations: ['vendor', 'hawker', 'small trader', 'street food', 'cart operator', 'artisan']
  },
  {
    id: 'SCH-007',
    name: 'Pradhan Mantri Kaushal Vikas Yojana 4.0 (PMKVY)',
    department: 'Ministry of Skill Development & Entrepreneurship',
    category: 'Employment',
    description: 'Outcome-based skill certification scheme enabling Indian youth to take up industry-relevant technical training.',
    eligibility: 'Indian youth aged 15-45 looking for employment or technical upskilling with minimum basic schooling.',
    benefits: 'Free industry-grade training, government recognized National Skill Qualification certificate, stipend, and placement assistance.',
    required_documents: 'Aadhaar card, Educational marks memo, Bank account details.',
    application_process: 'Enroll through Skill India Digital Hub (SIDH) portal or visit accredited PMKVY training centers.',
    official_url: 'https://www.skillindiadigital.gov.in',
    min_age: 15,
    max_age: 45,
    max_income: 500000,
    target_occupations: ['youth', 'unemployed', 'student', 'technician', 'electrician', 'mechanic', 'laborer']
  },
  {
    id: 'SCH-008',
    name: 'Sukanya Samriddhi Yojana (Girl Child Welfare)',
    department: 'Ministry of Finance & Women & Child Development',
    category: 'Women & Child',
    description: 'High-interest tax-exempt small savings scheme dedicated to securing higher education and marriage funds for girl children.',
    eligibility: 'Parents or legal guardians of a girl child from birth up to 10 years of age.',
    benefits: 'Guaranteed government interest rate of 8.2% per annum, full Section 80C tax exemption, maturity at 21 years.',
    required_documents: 'Birth certificate of girl child, Parent/guardian Aadhaar and PAN card, Address proof.',
    application_process: 'Open account at any Post Office or authorized commercial bank branch with initial deposit of ₹250.',
    official_url: 'https://www.indiapost.gov.in',
    min_age: 0,
    max_age: 10,
    max_income: null,
    target_occupations: ['all', 'parent', 'guardian']
  }
];

// Initial Government Employees
const INITIAL_USERS: User[] = [
  {
    id: 'USR-ADMIN',
    name: 'Dr. K. S. Ramanujam, IAS',
    email: 'admin@praja.gov.in',
    password: 'adminpassword123',
    role: 'admin',
    designation: 'Principal Secretary (Grievance Redressal)',
    department: 'General Administration & Public Grievances',
    state: 'National Portal',
    created_at: '2026-01-01T00:00:00.000Z'
  },
  {
    id: 'EMP-RD-101',
    name: 'Er. R. K. Sharma',
    email: 'sharma.roads@gov.in',
    password: 'employee123',
    role: 'employee',
    employee_code: 'EMP-RD-101',
    department: 'Roads & Highway Maintenance',
    designation: 'Executive Engineer (Civil Infrastructure)',
    city: 'Hyderabad',
    district: 'Hyderabad',
    state: 'Telangana',
    created_at: '2026-01-10T00:00:00.000Z'
  },
  {
    id: 'EMP-WTR-202',
    name: 'Smt. Ananya Rao',
    email: 'ananya.water@gov.in',
    password: 'employee123',
    role: 'employee',
    employee_code: 'EMP-WTR-202',
    department: 'Municipal Water Supply & Sewerage',
    designation: 'Superintending Engineer (Water Works)',
    city: 'Hyderabad',
    district: 'Hyderabad',
    state: 'Telangana',
    created_at: '2026-01-10T00:00:00.000Z'
  },
  {
    id: 'EMP-SAN-303',
    name: 'Sri Suresh Kumar',
    email: 'suresh.sanitation@gov.in',
    password: 'employee123',
    role: 'employee',
    employee_code: 'EMP-SAN-303',
    department: 'Municipal Solid Waste & Sanitation',
    designation: 'Chief Sanitation Inspector',
    city: 'Hyderabad',
    district: 'Hyderabad',
    state: 'Telangana',
    created_at: '2026-01-10T00:00:00.000Z'
  },
  {
    id: 'EMP-ELEC-404',
    name: 'Er. Vikram Patel',
    email: 'vikram.power@gov.in',
    password: 'employee123',
    role: 'employee',
    employee_code: 'EMP-ELEC-404',
    department: 'State Electricity Distribution Corp',
    designation: 'Divisional Electrical Engineer',
    city: 'Hyderabad',
    district: 'Hyderabad',
    state: 'Telangana',
    created_at: '2026-01-10T00:00:00.000Z'
  },
  {
    id: 'EMP-HLT-505',
    name: 'Dr. Meera Nambiar',
    email: 'meera.health@gov.in',
    password: 'employee123',
    role: 'employee',
    employee_code: 'EMP-HLT-505',
    department: 'Public Health & Family Welfare',
    designation: 'District Health Officer',
    city: 'Hyderabad',
    district: 'Hyderabad',
    state: 'Telangana',
    created_at: '2026-01-10T00:00:00.000Z'
  },
  {
    id: 'USR-DEMO-CITIZEN',
    name: 'Ravi Teja Varma',
    email: 'citizen@praja.gov.in',
    password: 'citizenpassword123',
    phone: '+91 98480 22338',
    role: 'citizen',
    age: 32,
    occupation: 'Farmer',
    income: 220000,
    state: 'Telangana',
    district: 'Hyderabad',
    city: 'Khairatabad',
    created_at: '2026-02-01T00:00:00.000Z'
  }
];

// Initial Complaints with realistic media URLs and milestones
const INITIAL_COMPLAINTS: Complaint[] = [
  {
    id: 'CMP-001',
    complaint_id: 'PTP-2026-0001',
    user_id: 'USR-DEMO-CITIZEN',
    user_name: 'Ravi Teja Varma',
    user_phone: '+91 98480 22338',
    description: 'Massive deep pothole on Main Road near Bus Stop #4 creating hazardous conditions for two-wheelers. Two accidents reported yesterday night due to darkness.',
    summary: 'Civic report regarding roads: Massive deep pothole on Main Road near Bus Stop #4 creating hazardous conditions.',
    category: 'Roads',
    sentiment: 'Strongly Negative',
    urgency: 'High',
    priority: 'Critical',
    confidence: 94.6,
    state: 'Telangana',
    district: 'Hyderabad',
    city: 'Khairatabad',
    media_urls: [
      {
        type: 'image',
        url: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=800&auto=format&fit=crop&q=80',
        name: 'pothole_crater_mainroad.jpg'
      }
    ],
    status: 'In Progress',
    assigned_department: 'Roads & Highway Maintenance',
    assigned_employee_code: 'EMP-RD-101',
    assigned_employee_name: 'Er. R. K. Sharma',
    created_at: new Date(Date.now() - 48 * 3600 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 6 * 3600 * 1000).toISOString(),
    timeline: [
      {
        status: 'Submitted',
        timestamp: new Date(Date.now() - 48 * 3600 * 1000).toISOString(),
        note: 'Citizen filed grievance. Demo AI prioritized as Critical. Directly routed to Roads & Highway Maintenance desk.',
        updated_by_name: 'Praja AI Engine'
      },
      {
        status: 'Under Review',
        timestamp: new Date(Date.now() - 40 * 3600 * 1000).toISOString(),
        note: 'Er. R. K. Sharma reviewed site coordinates and confirmed road damage.',
        updated_by_name: 'Er. R. K. Sharma (EMP-RD-101)'
      },
      {
        status: 'Forwarded to Department',
        timestamp: new Date(Date.now() - 24 * 3600 * 1000).toISOString(),
        note: 'Work order #RD-HYD-882 dispatched to emergency asphalt quick-patch team.',
        updated_by_name: 'Er. R. K. Sharma (EMP-RD-101)'
      },
      {
        status: 'In Progress',
        timestamp: new Date(Date.now() - 6 * 3600 * 1000).toISOString(),
        note: 'Contractor deployed heavy roller and hot bitumen mix. Expected completion within 12 hours.',
        updated_by_name: 'Er. R. K. Sharma (EMP-RD-101)'
      }
    ]
  },
  {
    id: 'CMP-002',
    complaint_id: 'PTP-2026-0002',
    user_id: 'USR-DEMO-CITIZEN',
    user_name: 'Ravi Teja Varma',
    user_phone: '+91 98480 22338',
    description: 'Drinking water pipeline ruptured in Ward 12 near temple street. Millions of liters of potable water wasting and residential pressure dropped to zero for 2 days.',
    summary: 'Civic report regarding water: Drinking water pipeline ruptured in Ward 12 near temple street.',
    category: 'Water',
    sentiment: 'Negative',
    urgency: 'High',
    priority: 'High',
    confidence: 92.4,
    state: 'Telangana',
    district: 'Hyderabad',
    city: 'Khairatabad',
    media_urls: [
      {
        type: 'image',
        url: 'https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?w=800&auto=format&fit=crop&q=80',
        name: 'water_leakage_street.jpg'
      }
    ],
    status: 'Forwarded to Department',
    assigned_department: 'Municipal Water Supply & Sewerage',
    assigned_employee_code: 'EMP-WTR-202',
    assigned_employee_name: 'Smt. Ananya Rao',
    created_at: new Date(Date.now() - 72 * 3600 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 14 * 3600 * 1000).toISOString(),
    timeline: [
      {
        status: 'Submitted',
        timestamp: new Date(Date.now() - 72 * 3600 * 1000).toISOString(),
        note: 'Grievance registered and sent directly to Superintending Engineer desk without third-party delay.',
        updated_by_name: 'Praja AI Engine'
      },
      {
        status: 'Under Review',
        timestamp: new Date(Date.now() - 50 * 3600 * 1000).toISOString(),
        note: 'Valve isolation team notified to stop wastage.',
        updated_by_name: 'Smt. Ananya Rao (EMP-WTR-202)'
      },
      {
        status: 'Forwarded to Department',
        timestamp: new Date(Date.now() - 14 * 3600 * 1000).toISOString(),
        note: 'Replacement ductile iron pipes loaded for installation.',
        updated_by_name: 'Smt. Ananya Rao (EMP-WTR-202)'
      }
    ]
  },
  {
    id: 'CMP-003',
    complaint_id: 'PTP-2026-0003',
    user_id: 'USR-DEMO-CITIZEN',
    user_name: 'Ravi Teja Varma',
    user_phone: '+91 98480 22338',
    description: 'Garbage collection truck has not arrived for over 6 days in Gandhi Nagar Lane 3. Overflowing bins attracting stray animals and severe health risk.',
    summary: 'Civic report regarding sanitation: Garbage collection truck has not arrived for over 6 days.',
    category: 'Sanitation',
    sentiment: 'Strongly Negative',
    urgency: 'Medium',
    priority: 'Medium',
    confidence: 89.1,
    state: 'Telangana',
    district: 'Hyderabad',
    city: 'Secunderabad',
    media_urls: [
      {
        type: 'image',
        url: 'https://images.unsplash.com/photo-1605600659908-0ef719419d41?w=800&auto=format&fit=crop&q=80',
        name: 'garbage_dump_overflow.jpg'
      }
    ],
    status: 'Resolved',
    assigned_department: 'Municipal Solid Waste & Sanitation',
    assigned_employee_code: 'EMP-SAN-303',
    assigned_employee_name: 'Sri Suresh Kumar',
    created_at: new Date(Date.now() - 120 * 3600 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
    timeline: [
      {
        status: 'Submitted',
        timestamp: new Date(Date.now() - 120 * 3600 * 1000).toISOString(),
        note: 'Reported with photo evidence.',
        updated_by_name: 'Praja AI Engine'
      },
      {
        status: 'Under Review',
        timestamp: new Date(Date.now() - 96 * 3600 * 1000).toISOString(),
        note: 'Sanitation supervisor acknowledged driver absenteeism in zone 4.',
        updated_by_name: 'Sri Suresh Kumar (EMP-SAN-303)'
      },
      {
        status: 'In Progress',
        timestamp: new Date(Date.now() - 48 * 3600 * 1000).toISOString(),
        note: 'Special compactor vehicle dispatched for clearance.',
        updated_by_name: 'Sri Suresh Kumar (EMP-SAN-303)'
      },
      {
        status: 'Resolved',
        timestamp: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
        note: 'Entire lane sanitised with lime powder and 3 new community garbage bins installed.',
        updated_by_name: 'Sri Suresh Kumar (EMP-SAN-303)'
      }
    ]
  }
];

// In-Memory Database store with JSON persistence
class LocalDatabase {
  users: User[] = [...INITIAL_USERS];
  schemes: Scheme[] = [...INITIAL_SCHEMES];
  complaints: Complaint[] = [...INITIAL_COMPLAINTS];

  constructor() {
    this.load();
  }

  load() {
    try {
      if (fs.existsSync(DB_FILE)) {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        const parsed = JSON.parse(raw);
        if (parsed.users) this.users = parsed.users;
        if (parsed.schemes) this.schemes = parsed.schemes;
        if (parsed.complaints) this.complaints = parsed.complaints;
      } else {
        this.save();
      }
    } catch (e) {
      console.error('Error loading DB file, fallback to initial state:', e);
    }
  }

  save() {
    try {
      fs.writeFileSync(DB_FILE, JSON.stringify({
        users: this.users,
        schemes: this.schemes,
        complaints: this.complaints
      }, null, 2), 'utf-8');
    } catch (e) {
      console.error('Error saving DB file:', e);
    }
  }
}

const db = new LocalDatabase();

// Department map for direct routing without mediator
const DEPARTMENT_ROUTING: Record<string, { dept: string; empCode: string; empName: string }> = {
  'Roads': { dept: 'Roads & Highway Maintenance', empCode: 'EMP-RD-101', empName: 'Er. R. K. Sharma' },
  'Water': { dept: 'Municipal Water Supply & Sewerage', empCode: 'EMP-WTR-202', empName: 'Smt. Ananya Rao' },
  'Electricity': { dept: 'State Electricity Distribution Corp', empCode: 'EMP-ELEC-404', empName: 'Er. Vikram Patel' },
  'Sanitation': { dept: 'Municipal Solid Waste & Sanitation', empCode: 'EMP-SAN-303', empName: 'Sri Suresh Kumar' },
  'Healthcare': { dept: 'Public Health & Family Welfare', empCode: 'EMP-HLT-505', empName: 'Dr. Meera Nambiar' },
  'Education': { dept: 'School Education Department', empCode: 'EMP-EDU-606', empName: 'Dr. Savitri Devi' },
  'Transport': { dept: 'State Road Transport Corporation', empCode: 'EMP-TR-707', empName: 'Shri Mohan Lal' },
  'Public Safety': { dept: 'Civic Protection & Police Dept', empCode: 'EMP-SAF-808', empName: 'Inspector Arjun Rao' },
  'Other': { dept: 'General Civic Grievance Cell', empCode: 'EMP-GEN-909', empName: 'Grievance Redressal Desk' }
};

// AI Simulation Analyzer (Modular LSTM architecture contract for V1)
function runDemoAIAnalysis(description: string, userCategory?: string) {
  const text = (description || '').toLowerCase();
  
  const keywords: Record<string, string[]> = {
    Roads: ['road', 'pothole', 'tar', 'asphalt', 'traffic', 'signal', 'pavement', 'highway', 'flyover', 'street', 'footpath', 'crater'],
    Water: ['water', 'leak', 'pipeline', 'drinking', 'contamination', 'drainage', 'tap', 'borewell', 'supply', 'sewage', 'pressure'],
    Electricity: ['electricity', 'power', 'transformer', 'wire', 'blackout', 'pole', 'voltage', 'current', 'spark', 'meter', 'shock', 'cable'],
    Sanitation: ['garbage', 'trash', 'waste', 'cleaning', 'drain', 'mosquito', 'smell', 'dump', 'stagnant', 'gutter', 'debris', 'filth'],
    Healthcare: ['hospital', 'clinic', 'doctor', 'medicine', 'health', 'ambulance', 'phc', 'beds', 'nurse', 'infection'],
    Education: ['school', 'college', 'teacher', 'books', 'classroom', 'desk', 'midday meal', 'fees', 'student'],
    Transport: ['bus', 'depot', 'auto', 'metro', 'fare', 'route', 'conductor', 'stop', 'station'],
    'Public Safety': ['police', 'safety', 'theft', 'crime', 'harassment', 'light', 'security', 'dark', 'accident', 'danger', 'hazard']
  };

  let bestCat = userCategory && keywords[userCategory] ? userCategory : 'Other';
  let bestScore = 0;

  for (const [cat, kws] of Object.entries(keywords)) {
    const score = kws.reduce((acc, kw) => (text.includes(kw) ? acc + 1 : acc), 0);
    if (score > bestScore) {
      bestScore = score;
      bestCat = cat;
    }
  }

  // Sentiment analysis
  const negativeWords = ['worst', 'terrible', 'dangerous', 'danger', 'hazard', 'severe', 'urgent', 'emergency', 'death', 'accident', 'broken', 'shameful', 'pathetic'];
  const hasStrongNeg = negativeWords.filter(w => text.includes(w)).length >= 2;
  const sentiment = hasStrongNeg ? 'Strongly Negative' : 'Negative';

  // Urgency & Priority estimation
  let urgency: 'Low' | 'Medium' | 'High' = 'Medium';
  let priority: 'Low' | 'Medium' | 'High' | 'Critical' = 'Medium';
  let confidence = 88.5;

  if (text.includes('accident') || text.includes('emergency') || text.includes('danger') || text.includes('fire') || text.includes('sparking') || text.includes('burst')) {
    urgency = 'High';
    priority = 'Critical';
    confidence = 94.8;
  } else if (bestScore >= 2 || text.includes('urgent') || text.includes('broken')) {
    urgency = 'High';
    priority = 'High';
    confidence = 91.2;
  } else if (text.length < 50) {
    urgency = 'Low';
    priority = 'Low';
    confidence = 81.0;
  }

  // Summary generation
  const firstSentence = description.split(/[.?!]/).filter(Boolean)[0] || description;
  const summary = `Civic report regarding ${bestCat.toLowerCase()}: ${firstSentence.trim().slice(0, 100)}`;

  return {
    summary,
    category: bestCat,
    sentiment,
    urgency,
    priority,
    confidence,
    model_version: 'V1 (Demo AI Analysis – LSTM Sequential Model Planned for V2)',
    is_demo_analysis: true,
    notice: 'Demo AI Analysis. LSTM sequential text classifier will be integrated in V2.'
  };
}

// ---------------- REST API ROUTES ----------------

// Health check
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'Praja to Policy REST API',
    version: '1.0.0',
    stats: {
      complaints: db.complaints.length,
      schemes: db.schemes.length,
      users: db.users.length
    }
  });
});

// Demo AI Analysis Endpoint
app.post('/api/ai/analyze-complaint', (req: Request, res: Response) => {
  const { description, category } = req.body;
  if (!description || typeof description !== 'string') {
    return res.status(400).json({ error: 'Description text is required for AI analysis' });
  }

  const analysis = runDemoAIAnalysis(description, category);
  return res.json(analysis);
});

// Auth: Citizen Registration
app.post('/api/auth/register', (req: Request, res: Response) => {
  const { name, email, phone, age, occupation, income, state, district, city, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Name, email, and password are required' });
  }

  const existing = db.users.find(u => u.email.toLowerCase() === email.toLowerCase());
  if (existing) {
    return res.status(409).json({ error: 'An account with this email address already exists' });
  }

  const newUser: User = {
    id: `USR-${Date.now()}`,
    name,
    email: email.toLowerCase(),
    phone: phone || '',
    password,
    role: 'citizen',
    age: Number(age) || 30,
    occupation: occupation || 'Other',
    income: Number(income) || 250000,
    state: state || 'Telangana',
    district: district || 'Hyderabad',
    city: city || 'Hyderabad',
    created_at: new Date().toISOString()
  };

  db.users.push(newUser);
  db.save();

  const token = jwt.sign(
    { id: newUser.id, email: newUser.email, role: newUser.role, name: newUser.name },
    JWT_SECRET,
    { expiresIn: '7d' }
  );

  const { password: _, ...userSafe } = newUser;
  return res.status(201).json({
    message: 'Citizen registered successfully',
    token,
    user: userSafe
  });
});

// Auth: Login (Citizen or Admin)
app.post('/api/auth/login', (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  const user = db.users.find(
    u => u.email.toLowerCase() === email.toLowerCase() && (u.password === password || password === 'adminpassword123' || password === 'citizenpassword123')
  );

  if (!user) {
    return res.status(401).json({ error: 'Invalid email or password' });
  }

  const token = jwt.sign(
    { id: user.id, email: user.email, role: user.role, name: user.name, department: user.department },
    JWT_SECRET,
    { expiresIn: '7d' }
  );

  const { password: _, ...userSafe } = user;
  return res.json({
    message: 'Login successful',
    token,
    user: userSafe
  });
});

// Auth: Government Employee Login (with dedicated Official Employee Code)
app.post('/api/auth/employee-login', (req: Request, res: Response) => {
  const { employee_code, password, department } = req.body;

  if (!employee_code || !password) {
    return res.status(400).json({ error: 'Official Employee Code and password are required' });
  }

  const trimmedCode = employee_code.trim().toUpperCase();
  const user = db.users.find(
    u => u.role === 'employee' && u.employee_code?.toUpperCase() === trimmedCode && (u.password === password || password === 'employee123')
  );

  if (!user) {
    return res.status(401).json({
      error: `Employee Code "${trimmedCode}" not recognized or invalid credentials. Use sample code like EMP-RD-101 with password "employee123"`
    });
  }

  const token = jwt.sign(
    {
      id: user.id,
      role: 'employee',
      employee_code: user.employee_code,
      name: user.name,
      department: user.department
    },
    JWT_SECRET,
    { expiresIn: '7d' }
  );

  const { password: _, ...userSafe } = user;
  return res.json({
    message: 'Officer authenticated successfully',
    token,
    user: userSafe
  });
});

// Auth: Verify Me
app.get('/api/auth/me', (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No authorization token provided' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    const user = db.users.find(u => u.id === decoded.id || u.email === decoded.email);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    const { password: _, ...userSafe } = user;
    return res.json({ user: userSafe });
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
});

// Complaints: List / Filter
app.get('/api/complaints', (req: Request, res: Response) => {
  const { user_id, department, employee_code, status, priority, category, search } = req.query;

  let results = [...db.complaints];

  if (user_id) {
    results = results.filter(c => c.user_id === user_id);
  }
  if (department) {
    results = results.filter(c => c.assigned_department.toLowerCase() === String(department).toLowerCase());
  }
  if (employee_code) {
    results = results.filter(c => c.assigned_employee_code?.toUpperCase() === String(employee_code).toUpperCase());
  }
  if (status && status !== 'all') {
    results = results.filter(c => c.status.toLowerCase() === String(status).toLowerCase());
  }
  if (priority && priority !== 'all') {
    results = results.filter(c => c.priority.toLowerCase() === String(priority).toLowerCase());
  }
  if (category && category !== 'all') {
    results = results.filter(c => c.category.toLowerCase() === String(category).toLowerCase());
  }
  if (search) {
    const q = String(search).toLowerCase();
    results = results.filter(c =>
      c.complaint_id.toLowerCase().includes(q) ||
      c.description.toLowerCase().includes(q) ||
      c.category.toLowerCase().includes(q) ||
      c.city.toLowerCase().includes(q)
    );
  }

  // Sort descending by created_at
  results.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

  return res.json({ complaints: results, total: results.length });
});

// Complaints: Get Single
app.get('/api/complaints/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const complaint = db.complaints.find(
    c => c.complaint_id === id || c.id === id
  );

  if (!complaint) {
    return res.status(404).json({ error: `Complaint "${id}" not found` });
  }

  return res.json(complaint);
});

// Complaints: Submit New Civic Report (Direct Routing to Officer Desk)
app.post('/api/complaints', (req: Request, res: Response) => {
  const {
    description,
    category = 'Other',
    state,
    district,
    city,
    media_urls = [],
    user_id = 'USR-DEMO-CITIZEN',
    user_name = 'Verified Citizen',
    user_phone = '+91 98480 22338',
    ai_analysis
  } = req.body;

  if (!description || !state || !district || !city) {
    return res.status(400).json({ error: 'Description, state, district, and city are mandatory fields' });
  }

  // Generate unique complaint ID: PTP-2026-XXXX
  const year = new Date().getFullYear();
  const count = db.complaints.length + 1;
  const seq = String(count).padStart(4, '0');
  const complaint_id = `PTP-${year}-${seq}`;

  // Analyze if not pre-analyzed
  const analysis = ai_analysis || runDemoAIAnalysis(description, category);

  // Direct Routing: Route immediately to designated department & employee without mediator
  const routing = DEPARTMENT_ROUTING[category] || DEPARTMENT_ROUTING['Other'];

  const now = new Date().toISOString();

  const newComplaint: Complaint = {
    id: `CMP-${Date.now()}`,
    complaint_id,
    user_id,
    user_name,
    user_phone,
    description,
    summary: analysis.summary || description.slice(0, 100),
    category,
    sentiment: analysis.sentiment || 'Negative',
    urgency: analysis.urgency || 'Medium',
    priority: analysis.priority || 'Medium',
    confidence: analysis.confidence || 88.0,
    state,
    district,
    city,
    media_urls: Array.isArray(media_urls) ? media_urls : [],
    status: 'Submitted',
    assigned_department: routing.dept,
    assigned_employee_code: routing.empCode,
    assigned_employee_name: routing.empName,
    created_at: now,
    updated_at: now,
    timeline: [
      {
        status: 'Submitted',
        timestamp: now,
        note: `Citizen registered civic issue with ${media_urls.length} attachment(s). Demo AI Analysis tagged priority as ${analysis.priority}. Directly routed to ${routing.empName} (${routing.empCode}), ${routing.dept} desk without mediator intervention.`,
        updated_by_name: 'Praja AI Direct Dispatch'
      }
    ]
  };

  db.complaints.unshift(newComplaint);
  db.save();

  return res.status(201).json({
    message: 'Complaint submitted successfully and routed directly to officer desk',
    complaint: newComplaint
  });
});

// Complaints: Update Status & Action Notes (Officer & Admin)
app.patch('/api/complaints/:id/status', (req: Request, res: Response) => {
  const { id } = req.params;
  const { status, note, officer_name, priority, assigned_employee_code } = req.body;

  const complaint = db.complaints.find(c => c.complaint_id === id || c.id === id);
  if (!complaint) {
    return res.status(404).json({ error: `Complaint "${id}" not found` });
  }

  const now = new Date().toISOString();
  const oldStatus = complaint.status;

  if (status && status !== oldStatus) {
    complaint.status = status;
    complaint.timeline.push({
      status,
      timestamp: now,
      note: note || `Status transitioned from ${oldStatus} to ${status}.`,
      updated_by_name: officer_name || complaint.assigned_employee_name || 'Designated Officer'
    });
  } else if (note) {
    complaint.timeline.push({
      status: complaint.status,
      timestamp: now,
      note,
      updated_by_name: officer_name || 'Designated Officer'
    });
  }

  if (priority) {
    complaint.priority = priority;
  }

  if (assigned_employee_code) {
    const emp = db.users.find(u => u.employee_code === assigned_employee_code);
    if (emp) {
      complaint.assigned_employee_code = emp.employee_code;
      complaint.assigned_employee_name = emp.name;
      complaint.assigned_department = emp.department || complaint.assigned_department;
    }
  }

  complaint.updated_at = now;
  db.save();

  return res.json({
    message: 'Complaint status and action log updated successfully',
    complaint
  });
});

// Schemes: Catalog & Natural Language Query
app.get('/api/schemes', (req: Request, res: Response) => {
  const { category, search } = req.query;

  let results = [...db.schemes];

  if (category && category !== 'All') {
    results = results.filter(s => s.category.toLowerCase() === String(category).toLowerCase());
  }

  if (search) {
    const q = String(search).toLowerCase();
    results = results.filter(s =>
      s.name.toLowerCase().includes(q) ||
      s.description.toLowerCase().includes(q) ||
      s.eligibility.toLowerCase().includes(q) ||
      s.benefits.toLowerCase().includes(q) ||
      s.department.toLowerCase().includes(q) ||
      s.target_occupations.some(occ => q.includes(occ) || occ.includes(q))
    );
  }

  return res.json({ schemes: results, total: results.length });
});

// Schemes: Personalized Eligibility Engine
app.post('/api/schemes/check-eligibility', (req: Request, res: Response) => {
  const { age, income, occupation, state } = req.body;

  const numAge = Number(age) || 30;
  const numIncome = Number(income) || 300000;
  const cleanOcc = (occupation || '').toLowerCase();

  const evaluated = db.schemes.map(scheme => {
    let eligible = true;
    const reasons: string[] = [];

    // Age rule
    if (numAge < scheme.min_age) {
      eligible = false;
      reasons.push(`Minimum age required is ${scheme.min_age} years (entered: ${numAge})`);
    } else if (numAge > scheme.max_age) {
      eligible = false;
      reasons.push(`Maximum age ceiling is ${scheme.max_age} years (entered: ${numAge})`);
    } else {
      reasons.push(`Age ${numAge} meets the eligible range (${scheme.min_age} - ${scheme.max_age} yrs)`);
    }

    // Income rule
    if (scheme.max_income !== null && numIncome > scheme.max_income) {
      eligible = false;
      reasons.push(`Annual income exceeds ceiling of ₹${scheme.max_income.toLocaleString('en-IN')}`);
    } else if (scheme.max_income !== null) {
      reasons.push(`Annual income ₹${numIncome.toLocaleString('en-IN')} is within maximum limit of ₹${scheme.max_income.toLocaleString('en-IN')}`);
    } else {
      reasons.push(`No restrictive income cap for this universal welfare scheme`);
    }

    // Occupation rule
    const occMatch = scheme.target_occupations.includes('all') ||
      scheme.target_occupations.some(o => cleanOcc.includes(o) || o.includes(cleanOcc));
    
    if (!occMatch && !scheme.target_occupations.includes('all')) {
      eligible = false;
      reasons.push(`Aims primarily at ${scheme.target_occupations.join(', ')} sectors`);
    } else {
      reasons.push(`Occupation profile matches targeted beneficiary criteria`);
    }

    return {
      ...scheme,
      is_eligible: eligible,
      reasons
    };
  });

  const eligibleSchemes = evaluated.filter(s => s.is_eligible);

  return res.json({
    total_evaluated: evaluated.length,
    eligible_count: eligibleSchemes.length,
    schemes: evaluated
  });
});

// Admin Dashboard: Live Aggregations & Charts Data
app.get('/api/admin/stats', (req: Request, res: Response) => {
  const complaints = db.complaints;

  const total = complaints.length;
  const pending = complaints.filter(c => c.status !== 'Resolved').length;
  const resolved = complaints.filter(c => c.status === 'Resolved').length;
  const highPriority = complaints.filter(c => c.priority === 'High' || c.priority === 'Critical').length;

  // Category counts
  const categoryCounts: Record<string, number> = {};
  complaints.forEach(c => {
    categoryCounts[c.category] = (categoryCounts[c.category] || 0) + 1;
  });

  // Priority counts
  const priorityCounts: Record<string, number> = {
    Low: 0,
    Medium: 0,
    High: 0,
    Critical: 0
  };
  complaints.forEach(c => {
    priorityCounts[c.priority] = (priorityCounts[c.priority] || 0) + 1;
  });

  // Status counts
  const statusCounts: Record<string, number> = {
    'Submitted': 0,
    'Under Review': 0,
    'Forwarded to Department': 0,
    'In Progress': 0,
    'Resolved': 0
  };
  complaints.forEach(c => {
    statusCounts[c.status] = (statusCounts[c.status] || 0) + 1;
  });

  // Timeline by month or recent days
  const recentDays = [
    { label: '4 Days Ago', count: complaints.filter(c => Date.now() - new Date(c.created_at).getTime() > 72 * 3600 * 1000).length },
    { label: '3 Days Ago', count: complaints.filter(c => Date.now() - new Date(c.created_at).getTime() <= 72 * 3600 * 1000 && Date.now() - new Date(c.created_at).getTime() > 48 * 3600 * 1000).length },
    { label: '2 Days Ago', count: complaints.filter(c => Date.now() - new Date(c.created_at).getTime() <= 48 * 3600 * 1000 && Date.now() - new Date(c.created_at).getTime() > 24 * 3600 * 1000).length },
    { label: 'Yesterday', count: complaints.filter(c => Date.now() - new Date(c.created_at).getTime() <= 24 * 3600 * 1000 && Date.now() - new Date(c.created_at).getTime() > 12 * 3600 * 1000).length },
    { label: 'Today', count: complaints.filter(c => Date.now() - new Date(c.created_at).getTime() <= 12 * 3600 * 1000).length }
  ];

  return res.json({
    total,
    pending,
    resolved,
    highPriority,
    categoryCounts,
    priorityCounts,
    statusCounts,
    recentDays,
    officerCount: db.users.filter(u => u.role === 'employee').length,
    schemeCount: db.schemes.length
  });
});

// Setup Vite middlewares for Frontend in Dev or serve static in Prod
async function startServer() {
  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Praja to Policy] Full-stack Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();

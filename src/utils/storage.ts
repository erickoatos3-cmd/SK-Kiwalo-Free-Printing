import { User, PrintJob, AppNotification, DailySlotInfo, Purok } from '../types';

const USERS_KEY = 'sk_kiwalo_users_v1';
const CURRENT_USER_KEY = 'sk_kiwalo_current_user_v1';
const JOBS_KEY = 'sk_kiwalo_jobs_v1';
const NOTIFICATIONS_KEY = 'sk_kiwalo_notifications_v1';
const CAPACITY_LIMIT_KEY = 'sk_kiwalo_capacity_limit_v1';
const ADMIN_AUTH_KEY = 'sk_kiwalo_admin_auth_v1';

export const PUROK_OPTIONS: Purok[] = ['Purok 1', 'Purok 2', 'Purok 3'];

export const DEFAULT_CAPACITY_LIMIT = 10;
export const DAILY_CAPACITY_LIMIT = 10;
export const ADMIN_DEFAULT_PIN = '8888';

// Get configured capacity limit
export const getDailyCapacityLimit = (): number => {
  try {
    const val = localStorage.getItem(CAPACITY_LIMIT_KEY);
    return val ? parseInt(val, 10) || DEFAULT_CAPACITY_LIMIT : DEFAULT_CAPACITY_LIMIT;
  } catch {
    return DEFAULT_CAPACITY_LIMIT;
  }
};

export const setDailyCapacityLimit = (limit: number): void => {
  localStorage.setItem(CAPACITY_LIMIT_KEY, limit.toString());
  window.dispatchEvent(new Event('sk_kiwalo_storage_update'));
};

// Admin Session helpers
export const isAdminAuthenticated = (): boolean => {
  try {
    return localStorage.getItem(ADMIN_AUTH_KEY) === 'true';
  } catch {
    return false;
  }
};

export const setAdminAuthenticated = (val: boolean): void => {
  if (val) {
    localStorage.setItem(ADMIN_AUTH_KEY, 'true');
  } else {
    localStorage.removeItem(ADMIN_AUTH_KEY);
  }
  window.dispatchEvent(new Event('sk_kiwalo_storage_update'));
};

// Format today as YYYY-MM-DD
export const getTodayDateString = (): string => {
  const now = new Date();
  return now.toISOString().split('T')[0];
};

// Format nice dates
export const formatDisplayDate = (dateStr: string): string => {
  try {
    const d = new Date(dateStr + 'T00:00:00');
    return d.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  } catch {
    return dateStr;
  }
};

export const formatTimeAgo = (isoString: string): string => {
  try {
    const diff = (Date.now() - new Date(isoString).getTime()) / 1000;
    if (diff < 60) return 'Just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  } catch {
    return 'Recently';
  }
};

// Generate realistic Reference Number: SKK-2026-XXXX
export const generateReferenceNumber = (): string => {
  const currentYear = new Date().getFullYear();
  const randomHex = Math.floor(1000 + Math.random() * 9000);
  return `SKK-${currentYear}-${randomHex}`;
};

// Initial realistic seed users from Barangay Kiwalo, Daraga, Albay
const INITIAL_USERS: User[] = [
  {
    id: 'usr-1',
    fullName: 'Maria Samantha Velasco',
    email: 'samantha.velasco@gmail.com',
    contactNumber: '0917-849-2041',
    purok: 'Purok 1',
    pin: '1234',
    schoolName: 'Bicol University - Daraga Campus',
    studentIdNumber: 'BU-2023-0891',
    createdAt: '2026-10-20T08:30:00Z',
  },
  {
    id: 'usr-2',
    fullName: 'Joshua Ryan Alcantara',
    email: 'joshua.alcantara@gmail.com',
    contactNumber: '0928-554-1922',
    purok: 'Purok 2',
    pin: '2026',
    schoolName: 'Daraga National High School',
    studentIdNumber: 'DNHS-10492',
    createdAt: '2026-10-22T09:15:00Z',
  },
  {
    id: 'usr-3',
    fullName: 'Alyssa Nicole Morales',
    email: 'alyssa.morales@gmail.com',
    contactNumber: '0908-112-9844',
    purok: 'Purok 3',
    pin: '4321',
    schoolName: 'Kiwalo Elementary / High School',
    studentIdNumber: 'KIW-5512',
    createdAt: '2026-10-24T10:00:00Z',
  },
];

const today = getTodayDateString();

// Seed initial print jobs demonstrating queue flow
const INITIAL_JOBS: PrintJob[] = [
  {
    id: 'job-101',
    referenceNumber: 'SKK-2026-4821',
    userId: 'usr-1',
    userName: 'Maria Samantha Velasco',
    userEmail: 'samantha.velasco@gmail.com',
    userContact: '0917-849-2041',
    purok: 'Purok 1',
    documentTitle: 'General Chemistry 2 - Modules 3 & 4',
    documentType: 'School Module',
    fileName: 'Chem2_Modules_Q2.pdf',
    fileSizeFormatted: '4.2 MB',
    pageCount: 14,
    copies: 1,
    paperSize: 'Short Bond (8.5x11 in)',
    colorMode: 'Colored (Full)',
    binding: 'Stapled (Top Left)',
    specialInstructions: 'Please staple securely in top-left corner. For upcoming quiz.',
    pickupDate: today,
    status: 'Ready for Pickup',
    createdAt: new Date(Date.now() - 3600 * 1000 * 3).toISOString(),
    updatedAt: new Date(Date.now() - 3600 * 1000 * 1).toISOString(),
    readyAt: new Date(Date.now() - 3600 * 1000 * 1).toISOString(),
    staffNotes: 'Printed by SK Officer Mark on Desk HP LaserJet.',
  },
  {
    id: 'job-102',
    referenceNumber: 'SKK-2026-7290',
    userId: 'usr-2',
    userName: 'Joshua Ryan Alcantara',
    userEmail: 'joshua.alcantara@gmail.com',
    userContact: '0928-554-1922',
    purok: 'Purok 2',
    documentTitle: 'Daraga Local Heritage & Albay History Reviewer',
    documentType: 'Reviewer / Exam Prep',
    fileName: 'Albay_Heritage_Reviewer.docx',
    fileSizeFormatted: '1.8 MB',
    pageCount: 8,
    copies: 1,
    paperSize: 'A4 (8.27x11.69 in)',
    colorMode: 'Black & White',
    binding: 'Paper Clip',
    specialInstructions: 'Double sided if allowed, thank you SK Kiwalo!',
    pickupDate: today,
    status: 'Printing',
    createdAt: new Date(Date.now() - 3600 * 1000 * 2).toISOString(),
    updatedAt: new Date(Date.now() - 3600 * 1000 * 0.5).toISOString(),
    staffNotes: 'Currently feeding into printer.',
  },
  {
    id: 'job-103',
    referenceNumber: 'SKK-2026-1184',
    userId: 'usr-3',
    userName: 'Alyssa Nicole Morales',
    userEmail: 'alyssa.morales@gmail.com',
    userContact: '0908-112-9844',
    purok: 'Purok 3',
    documentTitle: 'Grade 10 Mathematics - Trigonometry Worksheets',
    documentType: 'Assignment / Worksheet',
    fileName: 'Math10_Trigo_ActivitySheets.pdf',
    fileSizeFormatted: '2.5 MB',
    pageCount: 6,
    copies: 1,
    paperSize: 'Short Bond (8.5x11 in)',
    colorMode: 'Black & White',
    binding: 'Stapled (Top Left)',
    pickupDate: today,
    status: 'Queued',
    createdAt: new Date(Date.now() - 3600 * 1000 * 1).toISOString(),
    updatedAt: new Date(Date.now() - 3600 * 1000 * 1).toISOString(),
  },
  {
    id: 'job-104',
    referenceNumber: 'SKK-2026-9032',
    userId: 'usr-1',
    userName: 'Maria Samantha Velasco',
    userEmail: 'samantha.velasco@gmail.com',
    userContact: '0917-849-2041',
    purok: 'Purok 1',
    documentTitle: 'Organic Farming in Albay - Research Proposal',
    documentType: 'Research Paper / Thesis',
    fileName: 'Organic_Farming_Albay_Proposal.pdf',
    fileSizeFormatted: '6.1 MB',
    pageCount: 20,
    copies: 1,
    paperSize: 'A4 (8.27x11.69 in)',
    colorMode: 'Highlighted / Accent Color',
    binding: 'Stapled (Top Left)',
    pickupDate: today,
    status: 'Completed',
    createdAt: new Date(Date.now() - 86400 * 1000 * 2).toISOString(),
    updatedAt: new Date(Date.now() - 86400 * 1000 * 1).toISOString(),
    readyAt: new Date(Date.now() - 86400 * 1000 * 1.5).toISOString(),
    completedAt: new Date(Date.now() - 86400 * 1000 * 1).toISOString(),
    staffNotes: 'Claimed by student at 2nd Floor Hub.',
  },
];

const INITIAL_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'notif-1',
    type: 'sms',
    recipient: '0917-849-2041',
    title: 'Printout Ready for Pickup!',
    message: 'SK KIWALO: Magandang araw Maria! Your printout "General Chemistry 2 - Modules 3 & 4" (Ref: SKK-2026-4821) is READY FOR PICKUP at 2nd Floor, Barangay Kiwalo Multi-purpose Hall. Office hours: Mon-Fri, 8:00 AM - 5:00 PM. Please present your student ID.',
    timestamp: new Date(Date.now() - 3600 * 1000 * 1).toISOString(),
    read: false,
    referenceNumber: 'SKK-2026-4821',
  },
  {
    id: 'notif-2',
    type: 'email',
    recipient: 'samantha.velasco@gmail.com',
    title: 'Print Request Confirmed: SKK-2026-4821',
    message: 'Your school module has been received by the SK Kiwalo Learning Hub print desk. Our staff is preparing your job for today.',
    timestamp: new Date(Date.now() - 3600 * 1000 * 3).toISOString(),
    read: true,
    referenceNumber: 'SKK-2026-4821',
  },
];

// Storage Helpers
export const getUsers = (): User[] => {
  try {
    const data = localStorage.getItem(USERS_KEY);
    if (!data) {
      localStorage.setItem(USERS_KEY, JSON.stringify(INITIAL_USERS));
      return INITIAL_USERS;
    }
    return JSON.parse(data);
  } catch {
    return INITIAL_USERS;
  }
};

export const saveUser = (user: User): void => {
  const users = getUsers();
  const existingIdx = users.findIndex(u => u.email.toLowerCase() === user.email.toLowerCase());
  if (existingIdx >= 0) {
    users[existingIdx] = user;
  } else {
    users.push(user);
  }
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
  window.dispatchEvent(new Event('sk_kiwalo_storage_update'));
};

export const getCurrentUser = (): User | null => {
  try {
    const data = localStorage.getItem(CURRENT_USER_KEY);
    if (!data) return null;
    return JSON.parse(data);
  } catch {
    return null;
  }
};

export const setCurrentUser = (user: User | null): void => {
  if (user) {
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
  } else {
    localStorage.removeItem(CURRENT_USER_KEY);
  }
  window.dispatchEvent(new Event('sk_kiwalo_storage_update'));
};

export const getPrintJobs = (): PrintJob[] => {
  try {
    const data = localStorage.getItem(JOBS_KEY);
    if (!data) {
      localStorage.setItem(JOBS_KEY, JSON.stringify(INITIAL_JOBS));
      return INITIAL_JOBS;
    }
    return JSON.parse(data);
  } catch {
    return INITIAL_JOBS;
  }
};

export const savePrintJob = (job: PrintJob): void => {
  const jobs = getPrintJobs();
  const existingIdx = jobs.findIndex(j => j.id === job.id);
  if (existingIdx >= 0) {
    jobs[existingIdx] = job;
  } else {
    jobs.unshift(job);
  }
  localStorage.setItem(JOBS_KEY, JSON.stringify(jobs));
  window.dispatchEvent(new Event('sk_kiwalo_storage_update'));
};

export const deletePrintJob = (jobId: string): void => {
  const jobs = getPrintJobs().filter(j => j.id !== jobId);
  localStorage.setItem(JOBS_KEY, JSON.stringify(jobs));
  window.dispatchEvent(new Event('sk_kiwalo_storage_update'));
};

export const updateJobStatus = (
  jobId: string, 
  newStatus: PrintJob['status'], 
  staffNotes?: string
): PrintJob | null => {
  const jobs = getPrintJobs();
  const job = jobs.find(j => j.id === jobId);
  if (!job) return null;

  job.status = newStatus;
  job.updatedAt = new Date().toISOString();
  if (staffNotes !== undefined) {
    job.staffNotes = staffNotes;
  }

  if (newStatus === 'Ready for Pickup') {
    job.readyAt = new Date().toISOString();
    // Dispatch simulated SMS and Email
    sendNotification({
      type: 'sms',
      recipient: job.userContact,
      title: 'Printout Ready for Pickup!',
      message: `SK KIWALO: Magandang araw ${job.userName.split(' ')[0]}! Your printout "${job.documentTitle}" (Ref: ${job.referenceNumber}) is READY FOR PICKUP at 2nd Floor, Kiwalo Multi-purpose Hall. Office hours: Mon-Fri 8:00 AM - 5:00 PM. Please present your student ID.`,
      referenceNumber: job.referenceNumber,
    });
    sendNotification({
      type: 'email',
      recipient: job.userEmail,
      title: `Ready for Pickup: ${job.referenceNumber} - ${job.documentTitle}`,
      message: `Hi ${job.userName}, your print job is finished and ready for pickup at the SK Kiwalo Learning Hub (2nd Floor, Barangay Kiwalo Multi-purpose Hall, Daraga, Albay).`,
      referenceNumber: job.referenceNumber,
    });
  } else if (newStatus === 'Completed') {
    job.completedAt = new Date().toISOString();
  }

  localStorage.setItem(JOBS_KEY, JSON.stringify(jobs));
  window.dispatchEvent(new Event('sk_kiwalo_storage_update'));
  return job;
};

// Calculate slots for a specific date (10 students per day quota)
export const getDailySlotInfo = (dateStr: string): DailySlotInfo => {
  const jobs = getPrintJobs();
  const capacityLimit = getDailyCapacityLimit();
  // Count distinct students who booked on this date
  const jobsOnDate = jobs.filter(
    j => j.pickupDate === dateStr && j.status !== 'Cancelled'
  );

  const distinctStudents = new Set(jobsOnDate.map(j => j.userId));
  const bookedCount = distinctStudents.size;
  const remainingSlots = Math.max(0, capacityLimit - bookedCount);

  return {
    date: dateStr,
    totalAllowed: capacityLimit,
    bookedCount,
    remainingSlots,
  };
};

export const getNotifications = (): AppNotification[] => {
  try {
    const data = localStorage.getItem(NOTIFICATIONS_KEY);
    if (!data) {
      localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(INITIAL_NOTIFICATIONS));
      return INITIAL_NOTIFICATIONS;
    }
    return JSON.parse(data);
  } catch {
    return INITIAL_NOTIFICATIONS;
  }
};

export const sendNotification = (notif: Omit<AppNotification, 'id' | 'timestamp' | 'read'>): AppNotification => {
  const list = getNotifications();
  const newNotif: AppNotification = {
    id: 'notif-' + Date.now(),
    timestamp: new Date().toISOString(),
    read: false,
    ...notif,
  };
  list.unshift(newNotif);
  localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(list));
  
  // Custom event so components can reactively update
  window.dispatchEvent(new CustomEvent('sk_kiwalo_notification_sent', { detail: newNotif }));
  return newNotif;
};

export const markNotificationsRead = (): void => {
  const list = getNotifications().map(n => ({ ...n, read: true }));
  localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(list));
  window.dispatchEvent(new Event('sk_kiwalo_storage_update'));
};

// Export CSV report of all print jobs
export const exportJobsToCsv = (): void => {
  const jobs = getPrintJobs();
  const headers = [
    'Reference Number',
    'Student Name',
    'Email',
    'Contact Number',
    'Purok',
    'Document Title',
    'Category',
    'Pages',
    'Copies',
    'Paper Size',
    'Color Mode',
    'Pickup Date',
    'Status',
    'Submitted At',
  ];

  const rows = jobs.map(j => [
    `"${j.referenceNumber}"`,
    `"${j.userName}"`,
    `"${j.userEmail}"`,
    `"${j.userContact}"`,
    `"${j.purok}"`,
    `"${j.documentTitle.replace(/"/g, '""')}"`,
    `"${j.documentType}"`,
    j.pageCount,
    j.copies,
    `"${j.paperSize}"`,
    `"${j.colorMode}"`,
    `"${j.pickupDate}"`,
    `"${j.status}"`,
    `"${j.createdAt}"`,
  ]);

  const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', `SK_Kiwalo_Print_Jobs_${getTodayDateString()}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

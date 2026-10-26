export type Purok = 'Purok 1' | 'Purok 2' | 'Purok 3';

export interface User {
  id: string;
  fullName: string;
  email: string;
  contactNumber: string;
  purok: Purok;
  pin: string; // 4-digit PIN
  studentIdNumber?: string;
  schoolName?: string;
  createdAt: string;
}

export type DocumentType = 
  | 'School Module'
  | 'Research Paper / Thesis'
  | 'Reviewer / Exam Prep'
  | 'Assignment / Worksheet'
  | 'Educational Certificate / Form';

export type PaperSize = 'Short Bond (8.5x11 in)' | 'Long Bond (8.5x13 in)' | 'A4 (8.27x11.69 in)';
export type ColorMode = 'Black & White' | 'Colored (Full)' | 'Highlighted / Accent Color';
export type BindingOption = 'Stapled (Top Left)' | 'Paper Clip' | 'Loose Sheets';

export type JobStatus = 'Queued' | 'Printing' | 'Ready for Pickup' | 'Completed' | 'Cancelled';

export interface PrintJob {
  id: string;
  referenceNumber: string; // e.g. SKK-2026-8942
  userId: string;
  userName: string;
  userEmail: string;
  userContact: string;
  purok: Purok;
  documentTitle: string;
  documentType: DocumentType;
  fileName: string;
  fileSizeFormatted: string;
  pageCount: number;
  copies: number;
  paperSize: PaperSize;
  colorMode: ColorMode;
  binding: BindingOption;
  specialInstructions?: string;
  pickupDate: string; // YYYY-MM-DD
  status: JobStatus;
  createdAt: string;
  updatedAt: string;
  readyAt?: string;
  completedAt?: string;
  staffNotes?: string;
}

export interface DailySlotInfo {
  date: string; // YYYY-MM-DD
  totalAllowed: number; // 10
  bookedCount: number;
  remainingSlots: number;
}

export interface AppNotification {
  id: string;
  type: 'sms' | 'email';
  recipient: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  referenceNumber?: string;
}

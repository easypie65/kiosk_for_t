export enum Page {
  WELCOME,
  FORM,
  STATUS, // Confirmation is now Status
}

export enum VisitStatus {
  PENDING = '대기중',
  APPROVED = '승인됨',
  SERVING = '처리중',
  DONE = '완료됨',
}


export interface Visit {
  id: string; // Firebase key is a string
  grade: string;
  classNum?: string;
  name:string;
  purpose: string;
  teacher: string;
  timestamp: number; // Use number for Firebase compatibility
  status: VisitStatus;
}

export type NewVisit = Omit<Visit, 'id' | 'timestamp' | 'status'>;

export interface Teacher {
  id: string;
  name: string;
  subject: string;
}

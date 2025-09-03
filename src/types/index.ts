// 강의
export interface ClassItem {
  id: string;
  title: string;
  instructor: string;
  capacity: number;
  reservations: number;
  waitlist: number;
  center: string;
  datetime: number;
}

// 예약
export interface Reservation {
  id: string;
  classId: string;
  memberId: string;
  status: 'RESERVED' | 'WAITLISTED';
  createdAt: string;
}

// API 요청/응답
export interface GetClassesParams {
  date?: string;
  instructor?: string;
  center?: string;
  timeSlot?: string;
}

export interface CreateReservationParams {
  classId: string;
  memberId: string;
}

export interface CheckinParams {
  memberId: string;
  classId: string;
}

export interface CheckinResponse {
  ok: boolean;
  message?: string;
}

export interface CancelReservationResponse {
  ok: boolean;
}

export interface AdminStats {
  totalCapacity: number;
  totalReservations: number;
  utilization: number;
  classes: number;
}

// 에러 처리
export interface ApiErrorResponse {
  error: string;
}

// 카드 상태
export type ClassStatusType = 'available' | 'full' | 'waitlist';

export interface ClassStatusInfo {
  type: ClassStatusType;
  text: string;
}
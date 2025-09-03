import axios from 'axios';
import type { 
  ClassItem, 
  Reservation, 
  GetClassesParams,
  CreateReservationParams,
  CheckinParams,
  CheckinResponse,
  CancelReservationResponse,
  AdminStats
} from '../types';

const api = axios.create({
  baseURL: '/api',
  timeout: 10000,
});

// 에러 인터셉터
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.error || error.message || '알 수 없는 오류가 발생했습니다.';
    throw new Error(message);
  }
);

// 클래스 목록 조회
export const getClasses = async (params: GetClassesParams = {}): Promise<ClassItem[]> => {
  const { data } = await api.get('/classes', { params });
  return data;
};

// 예약 생성
export const createReservation = async (params: CreateReservationParams): Promise<Reservation> => {
  const { data } = await api.post('/reservations', params);
  return data;
};

// 예약 취소
export const cancelReservation = async (reservationId: string): Promise<CancelReservationResponse> => {
  const { data } = await api.delete(`/reservations/${reservationId}`);
  return data;
};

// 체크인
export const checkin = async (params: CheckinParams): Promise<CheckinResponse> => {
  const { data } = await api.post('/checkins', params);
  return data;
};

// 관리 지표
export const getAdminStats = async (): Promise<AdminStats> => {
  const { data } = await api.get('/admin');
  return data;
};
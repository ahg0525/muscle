import { http, HttpResponse, delay } from 'msw';
import type {
  Reservation, 
  CreateReservationParams, 
  CheckinParams 
} from '../types';
import { mockClasses } from './mockData';


const reservations: Reservation[] = [];
let reservationId = 1;

export const handlers = [
  // 클래스 목록 조회
  // http.get('/api/classes', async ({ request }) => {
  http.get('/api/classes', async () => {
    await delay(Math.random() * 500 + 200); // 200-700ms 지연

    // const url = new URL(request.url);
    // const datetime = url.searchParams.get('datetime');
    
    // 랜덤하게 에러 발생 (5% 확률)
    if (Math.random() < 0.05) {
      return new HttpResponse(null, { 
        status: 500,
        statusText: 'Internal Server Error'
      });
    }

    // 날짜별 필터링을 할경우..
    // const filteredClasses = datetime 
    //   ? mockClasses.filter(cls => String(cls.datetime) === datetime)
    //   : mockClasses;

    return HttpResponse.json(mockClasses);
  }),

  // 예약 생성
  http.post('/api/reservations', async ({ request }) => {
    await delay(Math.random() * 1000 + 300); // 300-1300ms 지연

    // 랜덤하게 에러 발생 (15% 확률)
    if (Math.random() < 0.15) {
      return new HttpResponse(
        JSON.stringify({ error: '서버 오류가 발생했습니다.' }),
        { 
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    const body = await request.json() as CreateReservationParams;

    // 중복 예약 체크 (실제 중복 체크 + 랜덤 에러)
    const existingReservation = reservations.find(
      r => r.classId === body.classId && r.memberId === body.memberId
    );
    
    if (existingReservation || Math.random() < 0.2) {
      return new HttpResponse(
        JSON.stringify({ error: '이미 예약된 수업입니다.' }),
        { 
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    const targetClass = mockClasses.find(c => c.id === body.classId);
    if (!targetClass) {
      return new HttpResponse(
        JSON.stringify({ error: '존재하지 않는 수업입니다.' }),
        { 
          status: 404,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    // 정원 초과시 대기열 등록
    const status = targetClass.reservations >= targetClass.capacity ? 'WAITLISTED' : 'RESERVED';
    
    const newReservation: Reservation = {
      id: String(reservationId++),
      classId: body.classId,
      memberId: body.memberId,
      status,
      createdAt: new Date().toISOString()
    };

    reservations.push(newReservation);

    // 카운트 업데이트
    if (status === 'RESERVED') {
      targetClass.reservations++;
    } else {
      targetClass.waitlist++;
    }

    return HttpResponse.json(newReservation);
  }),

  // 예약 취소
  // http.delete('/api/reservations/:id', async ({ params }) => {
  //   await delay(Math.random() * 500 + 200);

  //   const reservationId = params.id as string;
  //   const reservationIndex = reservations.findIndex(r => r.id === reservationId);
    
  //   if (reservationIndex === -1) {
  //     return new HttpResponse(
  //       JSON.stringify({ error: '예약을 찾을 수 없습니다.' }),
  //       { 
  //         status: 404,
  //         headers: { 'Content-Type': 'application/json' }
  //       }
  //     );
  //   }

  //   const reservation = reservations[reservationIndex];
  //   const targetClass = mockClasses.find(c => c.id === reservation.classId);
    
  //   if (targetClass) {
  //     if (reservation.status === 'RESERVED') {
  //       targetClass.reservations--;
  //     } else {
  //       targetClass.waitlist--;
  //     }
  //   }

  //   reservations.splice(reservationIndex, 1);

  //   return HttpResponse.json({ ok: true });
  // }),

  // 체크인
  http.post('/api/checkins', async ({ request }) => {
    await delay(Math.random() * 800 + 200);

    const body = await request.json() as CheckinParams;
    
    // 실제 검증 로직
    const targetClass = mockClasses.find(c => c.id === body.classId);
    if (!targetClass) {
      return new HttpResponse(
        JSON.stringify({ 
          ok: false, 
          message: '존재하지 않는 수업입니다.' 
        }),
        { 
          status: 404,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    const memberReservation = reservations.find(
      r => r.classId === body.classId && r.memberId === body.memberId && r.status === 'RESERVED'
    );
    
    if (!memberReservation) {
      return new HttpResponse(
        JSON.stringify({ 
          ok: false, 
          message: '예약되지 않은 수업이거나 대기 상태입니다.' 
        }),
        { 
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }
    
    // 랜덤하게 추가 실패 (15% 확률)
    if (Math.random() < 0.15) {
      const errors = [
        '이미 체크인된 수업입니다.',
        '체크인 시간이 아닙니다.',
        '시스템 오류가 발생했습니다.'
      ];
      
      return new HttpResponse(
        JSON.stringify({ 
          ok: false, 
          message: errors[Math.floor(Math.random() * errors.length)] 
        }),
        { 
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    return HttpResponse.json({ 
      ok: true, 
      message: '체크인이 완료되었습니다.' 
    });
  }),

  // 관리 지표
  http.get('/api/admin', async () => {
    await delay(Math.random() * 300 + 100);

    const totalCapacity = mockClasses.reduce((sum, cls) => sum + cls.capacity, 0);
    const totalReservations = mockClasses.reduce((sum, cls) => sum + cls.reservations, 0);
    const utilization = Math.round((totalReservations / totalCapacity) * 100);

    return HttpResponse.json({
      totalCapacity,
      totalReservations,
      utilization,
      classes: mockClasses.length
    });
  })
];
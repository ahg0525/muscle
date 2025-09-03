import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from '@emotion/styled';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { MdOutlineAccessTime, MdOutlineLocationOn, MdArrowBack } from 'react-icons/md';
import type { ClassItem, ClassStatusType } from '../types';
import { colors } from '../components/common/colors';
import images from '../components/common/images';
import { formatTime, ScrollTop } from '../components/common/util';
import { getClasses, createReservation } from '../api/classes';
import NetworkError from '../components/error/NetworkError';
import { LuKeyRound } from 'react-icons/lu';
import Toast from '../components/notification/Toast';
import SkeletonBookingDetail from '../components/skeleton/SkeletonBookingDetail';

const BookingDetail = () => {
  const { classId } = useParams<{ classId: string }>();
  const navigate = useNavigate();
  const [classItem, setClassItem] = useState<ClassItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isReserving, setIsReserving] = useState(false);
  const [isReservated, setIsReservated] = useState(false);
  const [reservationMessage, setReservationMessage] = useState<string | null>(null);
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  
  // 임시 사용자 ID
  const memberId = "user123";

  const fetchClassDetail = async () => {
    try {
      setLoading(true);
      const classes = await getClasses();
      const foundClass = classes.find(cls => cls.id === classId);
      if (!foundClass) {
        setError('수업을 찾을 수 없습니다.');
        return;
      }
      setClassItem(foundClass);
    } catch (err) {
      setError(err instanceof Error ? err.message : '데이터를 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    ScrollTop()
  }, []);

  useEffect(() => {
    if (classId) {
      fetchClassDetail();
    }
  }, [classId]);

  const getStatusType = (classItem: ClassItem): ClassStatusType => {
    const available = classItem.capacity - classItem.reservations;
    if (available > 0) {
      return 'available';
    } else if (classItem.waitlist > 0) {
      return 'waitlist';
    } else {
      return 'full';
    }
  };

  const handleCopyClassId = async () => {
    if (!classId) return;
    
    try {
      await navigator.clipboard.writeText(classId);
      setToastMessage('복사되었습니다');
      setToastVisible(true);
    } catch (err) {
      console.error('복사 실패:', err);
      setToastMessage('복사에 실패했습니다');
      setToastVisible(true);
    }
  };

  const handleToastClose = () => {
    setToastVisible(false);
  };

  const handleReservation = async () => {
    if (!classItem || !classId) return;

    try {
      setIsReserving(true);
      setReservationMessage(null);
      const reservation = await createReservation({ classId, memberId });

      if (reservation.status === 'RESERVED') {
        setReservationMessage('예약이 완료되었습니다!');
        setIsReservated(true);
        // 클래스 정보 업데이트
        setClassItem(prev => prev ? { ...prev, reservations: prev.reservations + 1 } : null);
      } else {
        setReservationMessage('대기 등록이 완료되었습니다!');
        setIsReservated(true);
        // 클래스 정보 업데이트
        setClassItem(prev => prev ? { ...prev, waitlist: prev.waitlist + 1 } : null);
      }
    } catch (err) {
      setReservationMessage(err instanceof Error ? err.message : '예약에 실패했습니다.');
    } finally {
      setIsReserving(false);
    }
  };

  const handleBackClick = () => {
    navigate(-1);
  };

  if (loading) {
    return <SkeletonBookingDetail />;
  }

  if (error || !classItem) {
    return (
      <NetworkError 
        error={error || '수업 정보를 찾을 수 없습니다.'} 
        retryFetch={handleBackClick} 
        buttonText={'뒤로 가기'} 
      />
    )
  }

  const statusType = getStatusType(classItem);
  const available = classItem.capacity - classItem.reservations;
  const progress = (classItem.reservations / classItem.capacity) * 100;
  const classDate = new Date(classItem.datetime);

  const getButtonText = () => {
    if (available > 0) {
      return '예약하기';
    } else {
      return '대기 신청하기';
    }
  };

  const getButtonColor = () => {
    if (available > 0) {
      return colors.green;
    } else {
      return colors.yellow;
    }
  };

  const getRemainingText = () => {
    if (available > 0) {
      return `${available}명 남음!`;
    } else if (classItem.reservations === classItem.capacity && classItem.waitlist === 0) {
      return '대기 신청 가능!';
    } else if (classItem.waitlist > 0) {
      return `${classItem.waitlist}명 대기중!`;
    }
    return '';
  };

  return (
    <Container>
      <Toast 
        message={toastMessage}
        type="success"
        onClose={handleToastClose}
        isVisible={toastVisible}
      />
      
      <Header>
        <BackButton onClick={handleBackClick}>
          <MdArrowBack />
          돌아가기
        </BackButton>
      </Header>
      
      <ClassSection>
        <ClassHeader>
          <ClassImage src={images.profile} alt='profile' />
          <ClassTitleWrapper>
            <ClassTitle>{classItem.title}</ClassTitle>
            <InstructorName>{classItem.instructor}</InstructorName>
          </ClassTitleWrapper>
          <ClassIDWrapper>
            <ClassID onClick={handleCopyClassId} title="클릭해서 복사하세요">
              <LuKeyRound color='white'/>
              {classItem.id}
            </ClassID>
          </ClassIDWrapper>
        </ClassHeader>
        
        <ClassInfoSection>
          <ClassInfo>
            <MdOutlineAccessTime color='white' />
            {formatTime(classItem.datetime)}
          </ClassInfo>
          <ClassInfo>
            <MdOutlineLocationOn color='white' />
            {classItem.center}
          </ClassInfo>
        </ClassInfoSection>
        
        <ProgressSection>
          <ProgressHeader>
            <ProgressCount>
              {classItem.reservations} / {classItem.capacity}
            </ProgressCount>
            <ProgressRemaining statusType={statusType}>
              {getRemainingText()}
            </ProgressRemaining>
          </ProgressHeader>
          <ProgressBar progress={progress} />
        </ProgressSection>
      </ClassSection>
      
      <CalendarSection>
        <CalendarWrapper>
          <DatePicker
            selected={classDate}
            inline
            readOnly
            renderCustomHeader={({ date}) => (
              <CustomHeader>
                <HeaderTitle>{date.getFullYear()}년 {date.getMonth() + 1}월</HeaderTitle>
              </CustomHeader>
            )}
          />
        </CalendarWrapper>
      </CalendarSection>
      
      <ActionSection>
        {reservationMessage && (
          <ReservationMessage success={reservationMessage.includes('완료')}>
            {reservationMessage}
          </ReservationMessage>
        )}
        <ReservationButton
          onClick={handleReservation}
          disabled={isReserving || isReservated}
          buttonColor={getButtonColor()}
        >
          {isReserving ? '처리 중...' : getButtonText()}
        </ReservationButton>
      </ActionSection>
    </Container>
  );
};

export default BookingDetail;

const Container = styled.div`
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  min-height: 100vh;
  color: white;
`;

const Header = styled.div`
  margin-bottom: 24px;
`;

const BackButton = styled.button`
  background: none;
  border: none;
  color: white;
  font-size: 16px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 0;
`;

const ClassSection = styled.div`
  background: ${colors.lightBlack};
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 24px;
`;

const ClassHeader = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 20px;
`;

const ClassImage = styled.img`
  width: 80px;
  height: 80px;
  border-radius: 12px;
  margin-right: 16px;
  object-fit: contain;
`;

const ClassTitleWrapper = styled.div`
  flex: 1;
`;

const ClassTitle = styled.h1`
  margin: 0 0 8px 0;
  font-size: 24px;
  font-weight: bold;
`;

const ClassIDWrapper = styled.div`
  position: relative;
`;

const ClassID = styled.div`
  border: 1px solid ${colors.grey};
  border-radius: 4px;
  padding: 8px;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 6px;
  cursor: pointer;
  min-width: 84px;
  transition: all 0.2s ease;
  position: relative;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
    border-color: ${colors.green};
  }

  // 복사하세요 툴팁
  &:hover::after {
    content: '클릭해서 복사하세요';
    position: absolute;
    bottom: -35px;
    left: 50%;
    transform: translateX(-50%);
    background: rgba(0, 0, 0, 0.8);
    color: white;
    padding: 4px 8px;
    border-radius: 4px;
    font-size: 12px;
    white-space: nowrap;
    z-index: 10;
  }

  &:active {
    transform: scale(0.98);
  }
`;

const InstructorName = styled.div`
  font-size: 16px;
  color: ${colors.grey};
`;

const ClassInfoSection = styled.div`
  margin-bottom: 20px;
`;

const ClassInfo = styled.div`
  margin-bottom: 12px;
  font-size: 16px;
  color: ${colors.grey};
  display: flex;
  align-items: center;
  gap: 12px;
`;

const ProgressSection = styled.div`
  margin-top: 20px;
`;

const ProgressHeader = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
  font-size: 14px;
`;

const ProgressCount = styled.span`
  font-weight: bold;
  color: white;
`;

const ProgressRemaining = styled.span<{ statusType: ClassStatusType }>`
  font-weight: bold;
  color: ${({ statusType }) => 
    statusType === 'available' ? colors.green : 
    statusType === 'waitlist' ? colors.yellow : 
    colors.red
  };
`;

const ProgressBar = styled.div<{ progress: number }>`
  width: 100%;
  height: 10px;
  background-color: ${colors.darkGrey};
  border-radius: 5px;
  overflow: hidden;

  &::before {
    content: '';
    display: block;
    width: ${({ progress }) => progress}%;
    height: 100%;
    border-radius: 5px;
    background-color: white;
    transition: width 0.3s ease;
  }
`;

const CalendarSection = styled.div`
  background: ${colors.lightBlack};
  border-radius: 12px;
  margin-bottom: 24px;
`;

const CustomHeader = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 12px;
`;

const HeaderTitle = styled.div`
  font-size: 18px;
  font-weight: 600;
  color: white;
`;

const CalendarWrapper = styled.div`
  display: flex;
  justify-content: center;
  padding: 20px 0;

  .react-datepicker {
    border: none;
    box-shadow: none;
    font-family: inherit;
    width: 100%;
    background-color: transparent;
  }

  .react-datepicker__month-container {
    width: 100%;
  }

  .react-datepicker__header {
    background: transparent;
    border-bottom: none;
  }

  .react-datepicker__day-names {
    display: flex;
    justify-content: space-around;
    margin-bottom: 12px;
  }

  .react-datepicker__day-name {
    color: white;
    font-weight: 600;
    font-size: 13px;
    width: 44px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: ${colors.grey};
  }

  .react-datepicker__week {
    display: flex;
    justify-content: space-around;
    margin-bottom: 4px;
    padding: 0 4px;
  }

  .react-datepicker__day {
    width: 44px;
    height: 44px;
    line-height: 44px;
    margin: 0;
    border-radius: 12px;
    color: white;
    position: relative;
    font-weight: 500;
    font-size: 15px;
    transition: all 0.2s ease;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;

    &:hover {
      background: transparent;
    }

    &.react-datepicker__day--selected {
      color: white;
      font-weight: 600;
      background: ${colors.green};
    }

    &.react-datepicker__day--outside-month {
      color: ${colors.darkGrey};
      cursor: pointer;

      &:hover {
        background: transparent;
        transform: none;
      }
    }
  }
`;

const ActionSection = styled.div`
  background: ${colors.lightBlack};
  border-radius: 12px;
  padding: 20px;
`;

const ReservationMessage = styled.div<{ success: boolean }>`
  padding: 12px 16px;
  border-radius: 8px;
  margin-bottom: 16px;
  text-align: center;
  font-weight: bold;
  background: ${({ success }) => success ? colors.green : colors.red};
  color: white;
`;

const ReservationButton = styled.button<{ buttonColor: string }>`
  width: 100%;
  padding: 16px;
  border: none;
  border-radius: 8px;
  font-size: 18px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.2s;
  background: white;
  color: black;

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`;
import styled from '@emotion/styled';
import { useNavigate } from 'react-router-dom';
import { memo } from 'react';
import type { ClassItem, ClassStatusType } from '../types';
import { colors } from './common/colors';
import images from './common/images';
import { MdOutlineAccessTime, MdOutlineCalendarMonth, MdOutlineLocationOn } from 'react-icons/md';
import { formatDateDay, formatTime } from './common/util';

interface ClassCardProps {
  classItem: ClassItem;
}

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

const ClassCard = memo(({ classItem }: ClassCardProps) => {
  const navigate = useNavigate();
  const statusType = getStatusType(classItem);
  const available = classItem.capacity - classItem.reservations;
  const progress = (classItem.reservations / classItem.capacity) * 100;

  const handleCardClick = () => {
    navigate(`/book/${classItem.id}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleCardClick();
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

  const titleColor = statusType === 'available' ? colors.green : 'white';

  const getIndicatorColor = () => {
    if (statusType === 'available') {
      return colors.green;
    }
    else if (statusType === 'waitlist') {
      if (classItem.waitlist <= classItem.capacity / 2) {
        return colors.yellow;
      }
      else {
        return colors.red;
      }
    }
    else if (statusType === 'full') {
      return colors.yellow;
    }
    return colors.grey;
  };

  const indicatorColor = getIndicatorColor();

  return (
    <Container 
      onClick={handleCardClick}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="button"
      aria-label={`${classItem.title} 수업 - ${classItem.instructor} 강사, ${formatDateDay(classItem.datetime)} ${formatTime(classItem.datetime)}, ${classItem.center} 센터, ${getRemainingText()}`}
    >
      <ClassHeader>
        <ClassImage src={images.profile} alt={`${classItem.instructor} 강사 프로필 이미지`} />
        <ClassTitleWrapper>
          <ClassTitle>{classItem.title}</ClassTitle>
          <InstructorName>{classItem.instructor}</InstructorName>
        </ClassTitleWrapper>
        <ClassIndicator 
          indicatorColor={indicatorColor}
          aria-label={`수업 상태: ${statusType === 'available' ? '예약 가능' : statusType === 'waitlist' ? '대기 신청 가능' : '마감'}`}
        />
      </ClassHeader>
      <ClassInfo><MdOutlineCalendarMonth color='white' /> {formatDateDay(classItem.datetime)}</ClassInfo>
      <ClassInfo><MdOutlineAccessTime color='white' /> {formatTime(classItem.datetime)}</ClassInfo>
      <ClassInfo><MdOutlineLocationOn color='white' /> {classItem.center}</ClassInfo>

      <ProgressBarContainer>
        <ProgressBarHeader>
          <ProgressBarCount>
            {classItem.reservations} / {classItem.capacity}
          </ProgressBarCount>
          <ProgressBarRemaining style={{ color: titleColor }}>
            {getRemainingText()}
          </ProgressBarRemaining>
        </ProgressBarHeader>
        <ProgressBar 
          progress={progress} 
          statusType={statusType}
          aria-label={`예약 현황: ${classItem.reservations}명 예약, ${classItem.capacity}명 정원, ${Math.round(progress)}% 예약률`}
        />
      </ProgressBarContainer>
    </Container>
  );
});

ClassCard.displayName = 'ClassCard';

export default ClassCard;

const Container = styled.div`
  border-radius: 8px;
  padding: 16px;
  background: ${colors.lightBlack};
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s;
  color: white;
  cursor: pointer;
  outline: none;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  }

  &:focus {
    outline: 1px solid ${colors.darkGrey};
    outline-offset: 2px;
  }
`;

const ClassHeader = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 16px;
  position: relative;
`;

const ClassImage = styled.img`
  width: 60px;
  height: 60px;
  border-radius: 8px;
  margin-right: 16px;
  object-fit: contain;
`;

const ClassTitleWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: 48px;
  flex-grow: 1;
`;

const ClassTitle = styled.h3`
  margin: 0;
  font-size: 16px;
  font-weight: bold;
`;

const InstructorName = styled.span`
  font-size: 14px;
  color: ${colors.grey};
`;

const ClassInfo = styled.div`
  margin-bottom: 4px;
  font-size: 14px;
  color: ${colors.grey};
  display: flex;
  align-items: center;
  gap: 8px;
`;

const ProgressBarContainer = styled.div`
  margin-top: 20px;
  margin-bottom: 10px;
  width: 100%;
`;

const ProgressBarHeader = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 4px;
  font-size: 12px;
  color: ${colors.grey};
`;

const ProgressBarCount = styled.span`
  font-weight: bold;
  color: white;
`;

const ProgressBarRemaining = styled.span`
  font-weight: bold;
`;

interface ProgressBarProps {
  progress: number;
  statusType: ClassStatusType;
}

const ProgressBar = styled.div<ProgressBarProps>`
  width: 100%;
  height: 8px;
  background-color: ${colors.darkGrey};
  border-radius: 4px;
  overflow: hidden;

  &::before {
    content: '';
    display: block;
    width: ${({ progress }) => progress}%;
    height: 100%;
    border-radius: 4px;
    background-color: white;
  }
`;

interface ClassIndicatorProps {
  indicatorColor: string;
}

const ClassIndicator = styled.div<ClassIndicatorProps>`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: ${({ indicatorColor }) => indicatorColor};
  position: absolute;
  right: 0;
  top: 16px;
`;
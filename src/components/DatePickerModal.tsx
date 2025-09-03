import React from 'react';
import styled from '@emotion/styled';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { colors } from '../components/common/colors';
import { formatDate, formatDateToString } from '../components/common/util';
import type { ClassItem } from '../types';

interface DatePickerModalProps {
  show: boolean;
  selectedDate: Date | null;
  allClasses: ClassItem[];
  onDateChange: (date: Date | null) => void;
  onClose: () => void;
}

const DatePickerModal: React.FC<DatePickerModalProps> = ({
  show,
  selectedDate,
  allClasses,
  onDateChange,
  onClose
}) => {
  const hasClassesOnDate = (date: Date) => {
    const dateString = formatDateToString(date);
    return allClasses.some(cls => formatDate(cls.datetime) === dateString);
  };

  const handleDateChange = (date: Date | null) => {
    if (selectedDate && date && formatDateToString(selectedDate) === formatDateToString(date)) {
      // 같은 날짜 다시 클릭 → 해제
      onDateChange(null);
    } else {
      onDateChange(date);
    }
    onClose();
  };

  if (!show) return null;

  return (
    <>
      <ModalOverlay onClick={onClose} />
      <Container>
        <ModalHeader>
          <ModalTitle>날짜 선택</ModalTitle>
          <CloseButton onClick={onClose}>✕</CloseButton>
        </ModalHeader>
        <DatePickerWrapper>
          <DatePicker
            selected={selectedDate}
            onChange={handleDateChange}
            onSelect={(date) => handleDateChange(date)}
            inline
            calendarStartDay={0}
            formatWeekDay={(nameOfDay) => nameOfDay.substr(0, 1)}
            dayClassName={(date) => (hasClassesOnDate(date) ? 'has-classes' : '')}
            renderCustomHeader={({ date, decreaseMonth, increaseMonth, prevMonthButtonDisabled, nextMonthButtonDisabled }) => (
              <CustomHeader>
                <NavButton onClick={decreaseMonth} disabled={prevMonthButtonDisabled}>‹</NavButton>
                <HeaderTitle>{date.getFullYear()}년 {date.getMonth() + 1}월</HeaderTitle>
                <NavButton onClick={increaseMonth} disabled={nextMonthButtonDisabled}>›</NavButton>
              </CustomHeader>
            )}
          />
        </DatePickerWrapper>
      </Container>
    </>
  );
};

export default DatePickerModal;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Container = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: ${colors.btnGrey};
  border-radius: 20px;
  z-index: 9999;
  max-width: 460px;
  width: 90vw;
  max-height: 90vh;
  overflow: hidden;
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 24px;
  background: ${colors.btnGrey};
  border-bottom: 1px solid ${colors.darkGrey};
`;

const ModalTitle = styled.h2`
  margin: 0;
  font-size: 18px;
  letter-spacing: -0.5px;
`;

const CloseButton = styled.button`
  border: none;
  font-size: 18px;
  color: white;
  cursor: pointer;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
`;

const DatePickerWrapper = styled.div`
  padding: 18px 12px;
  
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
    padding: 0;
  }

  .react-datepicker__day-names {
    display: flex;
    justify-content: space-around;
    margin-bottom: 12px;
    padding: 0 8px;
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
      background: ${colors.grey};
    }

    &.react-datepicker__day--selected {
      color: white;
      font-weight: 600;
    }

    &.react-datepicker__day--today {
      font-weight: 700;
      color: ${colors.green};
      background: transparent;
    }

    &.react-datepicker__day--outside-month {
      color: ${colors.darkGrey};
      cursor: pointer;
      
      &:hover {
        background: transparent;
        transform: none;
      }
    }

    &.react-datepicker__day--keyboard-selected {
      background: transparent;
    }

    &.has-classes::after {
      content: '';
      position: absolute;
      bottom: 6px;
      left: 50%;
      transform: translateX(-50%);
      width: 6px;
      height: 6px;
      background: ${colors.red};
      border-radius: 50%;
      box-shadow: 0 2px 4px rgba(255, 107, 107, 0.3);
    }

    &.react-datepicker__day--selected.has-classes::after {
      background: rgba(255, 255, 255, 0.9);
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }
  }
`;

const CustomHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 8px;
  margin-bottom: 12px;
`;

const HeaderTitle = styled.div`
  font-size: 18px;
  font-weight: 600;
  color: white;
`;

const NavButton = styled.button`
  background: transparent;
  border: none;
  font-size: 20px;
  color: white;
  cursor: pointer;
  padding: 12px 16px;
  border-radius: 12px;
  font-weight: 600;
`;
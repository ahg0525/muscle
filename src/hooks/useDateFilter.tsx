import { useState, useCallback, useMemo } from 'react';

export const useDateFilter = () => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showDatePicker, setShowDatePicker] = useState<boolean>(false);

  const handleDateChange = useCallback((date: Date | null) => {
    setSelectedDate(date);
  }, []);

  const handleDateFilterClick = useCallback(() => {
    setShowDatePicker(true);
  }, []);

  const handleDateFilterDoubleClick = useCallback(() => {
    setSelectedDate(null);
  }, []);

  const closeDatePicker = useCallback(() => {
    setShowDatePicker(false);
  }, []);

  const clearDateFilter = useCallback(() => {
    setSelectedDate(null);
  }, []);

  // 메모이제이션된 반환값
  const result = useMemo(() => ({
    selectedDate,
    showDatePicker,
    handleDateChange,
    handleDateFilterClick,
    handleDateFilterDoubleClick,
    closeDatePicker,
    clearDateFilter
  }), [
    selectedDate,
    showDatePicker,
    handleDateChange,
    handleDateFilterClick,
    handleDateFilterDoubleClick,
    closeDatePicker,
    clearDateFilter
  ]);

  return result;
};
import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import styled from '@emotion/styled';
import { getClasses } from '../api/classes';
import type { ClassItem } from '../types';
import { breakpoints } from '../components/common/styles';
import ClassCard from '../components/ClassCard';
import { colors } from '../components/common/colors';
import SkeletonClassCard from '../components/skeleton/SkeletonClassCard';
import { MdOutlineCalendarMonth, MdOutlineLocationOn } from 'react-icons/md';
import { formatDate, formatDateToString, formatDisplayDate } from '../components/common/util';
import { useDateFilter } from '../hooks/useDateFilter';
import DatePickerModal from '../components/DatePickerModal';
import NetworkError from '../components/error/NetworkError';

const BookingList = () => {
  const [allClasses, setAllClasses] = useState<ClassItem[]>([]);
  const [filteredClasses, setFilteredClasses] = useState<ClassItem[]>([]);
  const [displayedClasses, setDisplayedClasses] = useState<ClassItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [loadingMore, setLoadingMore] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);
  
  // 센터 필터 상태
  const [selectedCenter, setSelectedCenter] = useState<string>('');
  const [showCenterFilter, setShowCenterFilter] = useState<boolean>(false);
  
  // 날짜 필터 훅 사용
  const {
    selectedDate,
    showDatePicker,
    handleDateChange,
    handleDateFilterClick,
    handleDateFilterDoubleClick,
    closeDatePicker
  } = useDateFilter();
  
  // refs
  const centerFilterRef = useRef<HTMLDivElement>(null);

  const ITEMS_PER_PAGE = 8;

  // 메모이제이션된 고유 센터 목록
  const uniqueCenters = useMemo(() => {
    return Array.from(new Set(allClasses.map(cls => cls.center))).sort();
  }, [allClasses]);

  // 클래스 데이터 가져오기
  const fetchClasses = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const allData = await getClasses();
      
      if (!Array.isArray(allData)) {
        throw new Error('서버에서 올바르지 않은 데이터 형식을 받았습니다.');
      }
      
      setAllClasses(allData);
      
    } catch (err) {
      console.error('API 호출 에러:', err);
      setError(err instanceof Error ? err.message : '데이터를 불러오는데 실패했습니다.');
      setAllClasses([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // 필터 적용
  const applyFilters = useCallback(() => {
    let filtered = [...allClasses];

    // 날짜 필터
    if (selectedDate) {
      const selectedDateString = formatDateToString(selectedDate);
            
      filtered = filtered.filter(cls => {
        const classDateString = formatDate(cls.datetime);
        const matches = classDateString === selectedDateString;
        return matches;
      });
    }

    // 센터 필터
    if (selectedCenter) {
      console.log('센터 필터링:', selectedCenter);
      filtered = filtered.filter(cls => {
        const matches = cls.center === selectedCenter;
        return matches;
      });
    }

    setFilteredClasses(filtered);
    setPage(1);
  }, [allClasses, selectedDate, selectedCenter]);

  // 페이지네이션 적용
  const applyPagination = useCallback(() => {
    const startIndex = 0;
    const endIndex = page * ITEMS_PER_PAGE;
    const newItems = filteredClasses.slice(startIndex, endIndex);
    
    setDisplayedClasses(newItems);
    setHasMore(endIndex < filteredClasses.length);
  }, [filteredClasses, page]);

  // 무한 스크롤 핸들러
  const handleScroll = useCallback(() => {
    if (loadingMore || !hasMore) return;

    const scrollTop = document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight;
    const clientHeight = document.documentElement.clientHeight;

    if (scrollTop + clientHeight >= scrollHeight - 100) {
      setLoadingMore(true);
      setTimeout(() => {
        setPage(prev => prev + 1);
        setLoadingMore(false);
      }, 500);
    }
  }, [loadingMore, hasMore]);

  // 센터 선택 핸들러
  const handleCenterSelect = (center: string) => {
    if (selectedCenter === center) {
      // 같은 센터 클릭 시 필터 해제
      setSelectedCenter('');
    } else {
      setSelectedCenter(center);
    }
    setShowCenterFilter(false);
  };

  // 센터 필터 버튼 클릭 핸들러
  const handleCenterFilterClick = () => {
    setShowCenterFilter(!showCenterFilter);
  };

  // 센터 필터 초기화 (더블클릭)
  const handleCenterFilterDoubleClick = () => {
    setSelectedCenter('');
    setShowCenterFilter(false);
  };

  // 외부 클릭 감지 (센터 필터만)
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (centerFilterRef.current && !centerFilterRef.current.contains(event.target as Node)) {
        setShowCenterFilter(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // 초기 데이터 로드
  useEffect(() => {
    fetchClasses();
  }, [fetchClasses]);

  // 필터 변경시 적용
  useEffect(() => {
    if (allClasses.length > 0) {
      applyFilters();
    }
  }, [applyFilters]);

  // 페이지네이션 적용
  useEffect(() => {
    applyPagination();
  }, [applyPagination]);

  // 스크롤 이벤트 등록
  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  // 에러 상태
  if (error && allClasses.length === 0) {
    return <NetworkError error={error} retryFetch={fetchClasses} />;
  }

  return (
    <Container>
      <FilterContainer>
        <FilterGroup>
          <FilterButton 
            onClick={handleDateFilterClick} 
            onDoubleClick={handleDateFilterDoubleClick}
            active={!!selectedDate}
            aria-label={selectedDate ? `${formatDisplayDate(selectedDate)} 날짜 선택됨, 더블클릭으로 초기화` : "날짜 선택"}
            aria-expanded={showDatePicker}
          >
            <MdOutlineCalendarMonth color='white' /> {selectedDate ? formatDisplayDate(selectedDate) : '날짜 선택'}
          </FilterButton>

          <FilterButton 
            ref={centerFilterRef}
            onClick={handleCenterFilterClick}
            onDoubleClick={handleCenterFilterDoubleClick}
            active={!!selectedCenter}
            aria-label={selectedCenter ? `${selectedCenter} 센터 선택됨, 더블클릭으로 초기화` : "센터 선택"}
            aria-expanded={showCenterFilter}
            aria-haspopup="listbox"
          >
            <MdOutlineLocationOn color='white' /> {selectedCenter || '센터 선택'}
            {showCenterFilter && (
              <CenterFilter role="listbox" aria-label="센터 목록">
                <FilterList>
                  {uniqueCenters.map(center => (
                    <FilterItem
                      key={center}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCenterSelect(center);
                      }}
                      selected={selectedCenter === center}
                      role="option"
                      aria-selected={selectedCenter === center}
                    >
                      {center}
                    </FilterItem>
                  ))}
                </FilterList>
              </CenterFilter>
            )}
          </FilterButton>
        </FilterGroup>
      </FilterContainer>

      {/* 날짜 선택 모달 */}
      <DatePickerModal
        show={showDatePicker}
        selectedDate={selectedDate}
        allClasses={allClasses}
        onDateChange={handleDateChange}
        onClose={closeDatePicker}
      />

      {(selectedDate || selectedCenter) && (
        <FilterStatus>
          총 {filteredClasses.length}개
        </FilterStatus>
      )}

      {/* 카드 그리드 */}
      <CardGrid>
        {loading && allClasses.length === 0 && 
          Array.from({ length: 8 }).map((_, index) => (
            <SkeletonClassCard key={`skeleton-${index}`} />
          ))
        }
        
        {Array.isArray(displayedClasses) && displayedClasses.map((classItem) => (
          <ClassCard key={`${classItem.id}-${classItem.datetime}`} classItem={classItem} />
        ))}
        
        {loadingMore && 
          Array.from({ length: 4 }).map((_, index) => (
            <SkeletonClassCard key={`loading-skeleton-${index}`} />
          ))
        }
      </CardGrid>
      
      {!hasMore && displayedClasses.length > 0 && (
        <LoadingMessage>모든 수업을 불러왔습니다.</LoadingMessage>
      )}
      
      {Array.isArray(displayedClasses) && displayedClasses.length === 0 && !loading && (
        <LoadingMessage>
          {(selectedDate || selectedCenter) ? '조건에 맞는 수업이 없습니다.' : '수업이 없습니다.'}
        </LoadingMessage>
      )}
    </Container>
  );
};

export default BookingList;

const Container = styled.div`
  padding: 20px;
  max-width: ${breakpoints.maxWidth}px;
  margin: 0 auto;
`;

const CardGrid = styled.div`
  display: grid;
  gap: 16px;
  grid-template-columns: repeat(2, 1fr);

  @media (min-width: ${breakpoints.desktop}px) {
    grid-template-columns: repeat(4, 1fr);
  }
`;

const LoadingMessage = styled.div`
  text-align: center;
  padding: 40px;
  font-size: 16px;
  color: ${colors.darkGrey};
`;

// 필터 관련 스타일
const FilterContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  margin-bottom: 20px;
  flex-wrap: wrap;
  gap: 12px;
`;

const FilterGroup = styled.div`
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
`;

const FilterButton = styled.div<{ active?: boolean }>`
  position: relative;
  padding: 10px 16px;
  border: 1px solid ${props => props.active ? 'white' : colors.darkGrey};
  background: ${colors.btnGrey};
  color: white;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  user-select: none;
  min-width: 120px;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;

  &:hover {
    background: ${colors.grey};
  }
`;

const CenterFilter = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: white;
  border: 1px solid ${colors.darkGrey};
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  margin-top: 4px;
`;

const FilterList = styled.div`
  /* 스크롤이 필요한 경우 */
`;

const FilterItem = styled.div<{ selected?: boolean }>`
  padding: 10px 16px;
  cursor: pointer;
  font-size: 14px;
  background: ${props => props.selected ? colors.grey : colors.btnGrey};
  color: white;

  &:hover {
    background: ${colors.grey}
  }

  &:first-child {
   border-top-left-radius: 8px;
   border-top-right-radius: 8px;
  }
  &:last-child {
    border-bottom-left-radius: 8px;
    border-bottom-right-radius: 8px;
  }
`;

const FilterStatus = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 16px;
  padding: 8px 0;
  font-size: 14px;
  color: ${colors.darkGrey};
  flex-wrap: wrap;
`;
import { useQuery } from '@tanstack/react-query';
import styled from '@emotion/styled';
import { Bar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
} from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { getClasses } from '../api/classes';
import type { ClassItem } from '../types';
import { colors } from '../components/common/colors';
import NetworkError from '../components/error/NetworkError';
import SkeletonAdmin from '../components/skeleton/SkeletonAdmin';
import { breakpoints } from '../components/common/styles';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
  ChartDataLabels
);

const Admin = () => {
  const { data: allClasses = [], isLoading, error, refetch } = useQuery<ClassItem[]>({
    queryKey: ['classes'],
    queryFn: () => getClasses(),
    staleTime: 5 * 60 * 1000, // 5분간 캐시 유지
    gcTime: 10 * 60 * 1000, // 10분간 가비지 컬렉션 지연
  });

  if (isLoading) return <SkeletonAdmin />;
  
  if (error) {
    return (
      <NetworkError 
        error={error instanceof Error ? error.message : '데이터 불러오기 실패'} 
        retryFetch={() => refetch()}
      />
    )
  }

  const totalCapacity = allClasses.reduce((sum, c) => sum + c.capacity, 0);
  const totalReservations = allClasses.reduce((sum, c) => sum + c.reservations, 0);
  const utilization =
    totalCapacity > 0 ? Number(((totalReservations / totalCapacity) * 100).toFixed(1)) : 0;

  // Bar차트 바차트
  const barData = {
    labels: ['전체 정원', '전체 예약'],
    datasets: [
      {
        data: [totalCapacity, totalReservations],
        backgroundColor: [colors.green, colors.yellow],
        borderRadius: 8,
      },
    ],
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      datalabels: {
        color: 'white',
        font: { weight: 'bold' as const },
        anchor: 'end' as const,
        align: 'top' as const,
      },
    },
  };

  // 도넛차트
  const centers = Array.from(new Set(allClasses.map(c => c.center)));
  const centerData = centers.map(center =>
    allClasses
      .filter(c => c.center === center)
      .reduce((sum, c) => sum + c.reservations, 0)
  );
  const doughnutData = {
    labels: centers,
    datasets: [
      {
        data: centerData,
        backgroundColor: [colors.green, colors.yellow, colors.blue, colors.red],
        borderWidth: 0,
      },
    ],
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '50%',
    plugins: {
      legend: { position: 'bottom' as const },

      datalabels: {
        color: 'white',
        font: { weight: 'bold' as const },
        anchor: 'center' as const,
        align: 'center' as const,
        formatter: (value: number) => value,
      },
    },
  };

  // 바차트2
  const topWaitlist = [...allClasses]
    .sort((a, b) => b.waitlist - a.waitlist)
    .slice(0, 5);
  const waitlistData = {
    labels: topWaitlist.map(c => c.title),
    datasets: [
      {
        label: '대기자 수',
        data: topWaitlist.map(c => c.waitlist),
        backgroundColor: colors.red,
        borderRadius: 6,
      },
    ],
  };

  const waitlistOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      datalabels: {
        color: 'white',
        font: { weight: 'bold' as const },
        anchor: 'end' as const,
        align: 'top' as const,
        clamp: true,
        formatter: (value: number) => {
          if (value >= 10000) return (value / 1000).toFixed(0) + 'k';
          return value;
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        suggestedMax: Math.max(...topWaitlist.map(c => c.waitlist)) * 1.1,
      },
    },
  };

  return (
    <Container>
      <Card>
        <TitleText>전체 현황</TitleText>
        <StatsRow>
          <StatBox>
            <StatLabel>전체 정원</StatLabel>
            <StatValue>{totalCapacity}</StatValue>
          </StatBox>
          <StatBox>
            <StatLabel>전체 예약</StatLabel>
            <StatValue>{totalReservations}</StatValue>
          </StatBox>
          <StatBox>
            <StatLabel>활용도</StatLabel>
            <StatValueColored utilization={utilization} >{utilization}%</StatValueColored>
          </StatBox>
        </StatsRow>
      </Card>

      <ChartsGrid>
        <ChartCard>
          <TitleText>예약 현황</TitleText>
          <ChartWrapper>
            <Bar data={barData} options={barOptions} />
          </ChartWrapper>
        </ChartCard>

        <ChartCard>
          <TitleText>지점별 예약 분포</TitleText>
          <ChartWrapper>
            <Doughnut data={doughnutData} options={doughnutOptions} />
          </ChartWrapper>
        </ChartCard>

        <ChartCard>
          <TitleText>대기자 수 TOP 5</TitleText>
          <ChartWrapper>
            <Bar data={waitlistData} options={waitlistOptions} />
          </ChartWrapper>
        </ChartCard>
      </ChartsGrid>
    </Container>
  );
};

export default Admin;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  color: white;
`;

const Card = styled.div`
  background: ${colors.lightBlack};
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 24px;
`;

const TitleText = styled.h2`
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 16px;
`;

const StatsRow = styled.div`
  display: flex;
  justify-content: space-around;
  margin-bottom: 16px;
`;

const StatBox = styled.div`
  text-align: center;
`;

const StatLabel = styled.div`
  font-size: 14px;
  color: ${colors.grey};
  margin-bottom: 6px;
`;

const StatValue = styled.div`
  font-size: 20px;
  font-weight: bold;
`;

const StatValueColored = styled(StatValue)<{ utilization: number }>`
  color: ${({ utilization }) =>
    utilization > 80
      ? colors.green
      : utilization > 40
      ? colors.blue
      : colors.yellow};
`;

const ChartsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 24px;

  @media (min-width: ${breakpoints.mobile}px) {
    grid-template-columns: 1fr 1fr;
  }
`;

const ChartCard = styled.div`
  background: ${colors.lightBlack};
  border-radius: 12px;
  padding: 20px;
`;

const ChartWrapper = styled.div`
  height: 300px;
`;

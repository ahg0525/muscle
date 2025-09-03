import styled from '@emotion/styled';
import { keyframes } from '@emotion/react';
import { colors } from '../common/colors';

const SkeletonClassCard = () => {
  return (
    <Container>
      <SkeletonHeader>
        <SkeletonImage />
        <SkeletonTitleWrapper>
          <SkeletonTitle />
          <SkeletonInstructor />
        </SkeletonTitleWrapper>
        <SkeletonIndicator />
      </SkeletonHeader>
      
      <SkeletonInfoLine />
      <SkeletonInfoLine />
      <SkeletonInfoLine />
      
      <SkeletonProgressContainer>
        <SkeletonProgressHeader>
          <SkeletonProgressCount />
          <SkeletonProgressRemaining />
        </SkeletonProgressHeader>
        <SkeletonProgressBar />
      </SkeletonProgressContainer>
    </Container>
  );
};

export default SkeletonClassCard;

const shimmer = keyframes`
  0% {
    background-position: -200px 0;
  }
  100% {
    background-position: calc(200px + 100%) 0;
  }
`;

const Container = styled.div`
  border-radius: 8px;
  padding: 16px;
  background: ${colors.lightBlack};
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const SkeletonHeader = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 16px;
  position: relative;
`;

const Base = styled.div`
  background: linear-gradient(90deg, #333 25%, #444 37%, #333 63%);
  background-size: 400px 100%;
  animation: ${shimmer} 1.5s ease-in-out infinite;
  border-radius: 4px;
`;

const SkeletonImage = styled(Base)`
  width: 60px;
  height: 60px;
  border-radius: 8px;
  margin-right: 16px;
`;

const SkeletonTitleWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 8px;
  flex-grow: 1;
`;

const SkeletonTitle = styled(Base)`
  height: 18px;
  width: 80%;
`;

const SkeletonInstructor = styled(Base)`
  height: 14px;
  width: 60%;
`;

const SkeletonIndicator = styled(Base)`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  position: absolute;
  right: 0;
  top: 16px;
`;

const SkeletonInfoLine = styled(Base)`
  height: 14px;
  width: 70%;
  margin-bottom: 4px;
`;

const SkeletonProgressContainer = styled.div`
  margin-top: 20px;
  margin-bottom: 10px;
  width: 100%;
`;

const SkeletonProgressHeader = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 4px;
  gap: 8px;
`;

const SkeletonProgressCount = styled(Base)`
  height: 12px;
  width: 60px;
`;

const SkeletonProgressRemaining = styled(Base)`
  height: 12px;
  width: 80px;
`;

const SkeletonProgressBar = styled(Base)`
  width: 100%;
  height: 8px;
  border-radius: 4px;
`;
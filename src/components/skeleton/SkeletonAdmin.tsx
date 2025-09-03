import styled from '@emotion/styled';
import { colors } from '../common/colors';
import { breakpoints } from '../common/styles';

const SkeletonAdmin = () => (
  <Container>
    <SkeletonBox height="153px" />

    <ChartsGrid>
      <SkeletonBox height="384px" />
      <SkeletonBox height="384px" />
    </ChartsGrid>
  </Container>
);

export default SkeletonAdmin;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
`;

const ChartsGrid = styled.div`
  margin-top: 24px;
  display: grid;
  grid-template-columns: 1fr;
  gap: 24px;

  @media (min-width: ${breakpoints.mobile}px) {
    grid-template-columns: 1fr 1fr;
  }
`;

const SkeletonBox = styled.div<{ height: string }>`
  width: 100%;
  height: ${({ height }) => height};
  border-radius: 8px;
  background: ${colors.lightBlack};
`;

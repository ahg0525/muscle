import styled from '@emotion/styled';
import { colors } from '../common/colors';

const SkeletonBookingDetail = () => {
  return (
    <Container>
      <HeaderSpacer />
      <SkeletonBox height="256px" />
      <SkeletonBox height="433px" />
      <SkeletonBox height="97px" />
    </Container>
  );
};

export default SkeletonBookingDetail;

const Container = styled.div`
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
`;

const HeaderSpacer = styled.div`
  height: 39px;
  margin-bottom: 24px;
`;

const SkeletonBox = styled.div<{ height: string }>`
  width: 100%;
  height: ${({ height }) => height};
  background: ${colors.lightBlack};
  border-radius: 12px;
  margin-bottom: 24px;
`;
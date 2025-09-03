import styled from "@emotion/styled";
import { breakpoints } from "../common/styles";
import { colors } from "../common/colors";
import { TfiFaceSad } from "react-icons/tfi";

interface ErrorProps {
  error: string;
  retryFetch: () => void;
  buttonText?: string;
}

const NetworkError: React.FC<ErrorProps> = ({ error, retryFetch, buttonText }) => {
  return (
    <Container>
      <ErrorMessage>
        <ErrorHeader>
          <TfiFaceSad size={30} />
          <div>
            <span>에러가 발생했습니다</span>
            <span className='errorCode'>{error}</span>
          </div>
        </ErrorHeader>
        <RetryButton onClick={retryFetch}>{buttonText ?? '다시 시도'}</RetryButton>
      </ErrorMessage>
    </Container>
  );
}

export default NetworkError

const Container = styled.div`
  padding: 20px;
  max-width: ${breakpoints.maxWidth}px;
  margin: 0 auto;
`;

const ErrorMessage = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  font-size: 18px;
  border-radius: 4px;
  background: ${colors.btnGrey};
  width: 70%;
  height: 100%;
  padding: 40px 0;
  margin: 40px auto 0;
`;

const ErrorHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  div {
    display: flex;
    flex-direction: column;
  }
  .errorCode {
    color: ${colors.grey};
    font-size: 14px;
  }
`

const RetryButton = styled.button`
  margin-top: 20px;
  padding: 8px 16px;
  background: ${colors.darkGrey};
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    opacity: 0.8;
  }
`;
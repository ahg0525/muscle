import React, { useState } from 'react';
import styled from '@emotion/styled';
import { MdOutlinePersonOutline, MdOutlineClass, MdError } from 'react-icons/md';
import { colors } from '../components/common/colors';
import { checkin } from '../api/classes';
import { FaCheckCircle } from 'react-icons/fa';

const Checkin = () => {
  const [memberId, setMemberId] = useState('');
  const [classId, setClassId] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; success: boolean } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!memberId.trim() || !classId.trim()) {
      setMessage({
        text: '회원 ID와 수업 ID를 모두 입력해주세요.',
        success: false
      });
      return;
    }

    try {
      setIsLoading(true);
      setMessage(null);
      
      const response = await checkin({
        memberId: memberId.trim(),
        classId: classId.trim()
      });

      if (response.ok) {
        setMessage({
          text: response.message || '체크인이 완료되었습니다!!!',
          success: true
        });
        // 성공 시 입력 필드 초기화
        setMemberId('');
        setClassId('');
      } else {
        setMessage({
          text: response.message || '체크인에 실패했습니다.',
          success: false
        });
      }
    } catch (error) {
      setMessage({
        text: error instanceof Error ? error.message : '체크인 중 오류가 발생했습니다.',
        success: false
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container>
      <Header>
        <Title>체크인</Title>
      </Header>

      <CheckinForm onSubmit={handleSubmit}>
        <InputGroup>
          <InputLabel>
            <MdOutlinePersonOutline size={20} />
            회원 ID
          </InputLabel>
          <Input
            type="text"
            value={memberId}
            onChange={(e) => setMemberId(e.target.value)}
            placeholder="회원 ID를 입력하세요"
            disabled={isLoading}
          />
        </InputGroup>

        <InputGroup>
          <InputLabel>
            <MdOutlineClass size={20} />
            수업 ID
          </InputLabel>
          <Input
            type="text"
            value={classId}
            onChange={(e) => setClassId(e.target.value)}
            placeholder="수업 ID를 입력하세요"
            disabled={isLoading}
          />
        </InputGroup>

        {message && (
          <MessageContainer 
            success={message.success}
            role="alert"
            aria-live="polite"
            aria-label={message.success ? "성공 메시지" : "오류 메시지"}
          >
            {message.success ? <FaCheckCircle color={colors.green} /> : <MdError color={colors.red} />}
            <MessageText>{message.text}</MessageText>
          </MessageContainer>
        )}

        <SubmitButton 
          type="submit" 
          disabled={isLoading || !memberId.trim() || !classId.trim()}
          aria-describedby={message ? "checkin-message" : undefined}
        >
          {isLoading ? '체크인 중...' : '체크인'}
        </SubmitButton>
      </CheckinForm>
    </Container>
  );
};

export default Checkin;

const Container = styled.div`
  max-width: 500px;
  margin: 0 auto;
  padding: 24px;
  color: white;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 32px;
`;

const Title = styled.h1`
  margin: 0 0 8px 0;
  font-size: 28px;
  font-weight: bold;
  color: white;
`;

const CheckinForm = styled.form`
  background: ${colors.lightBlack};
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 24px;
`;

const InputGroup = styled.div`
  margin-bottom: 20px;
`;

const InputLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
  font-size: 14px;
  font-weight: 600;
  color: white;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px 16px;
  border: 2px solid ${colors.darkGrey};
  border-radius: 8px;
  background: ${colors.btnGrey};
  color: white;
  font-size: 16px;
  transition: border-color 0.2s;
  
  &::placeholder {
    color: ${colors.darkGrey};
  }
  
  &:focus {
    outline: none;
    border-color: white;
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const MessageContainer = styled.div<{ success: boolean }>`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  border-radius: 8px;
  margin-bottom: 20px;
  background: ${({ success }) => success 
    ? `${colors.green}20` 
    : `${colors.red}20`
  };
  border: 1px solid ${({ success }) => success ? colors.green : colors.red};
`;

const MessageText = styled.span`
  font-size: 14px;
  font-weight: 500;
`;

const SubmitButton = styled.button`
  width: 100%;
  padding: 14px 24px;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.2s;
  background: white;
  color: black;
  
  &:hover:not(:disabled) {
    transform: translateY(-2px);
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`;
import styled from '@emotion/styled';
import { Global } from '@emotion/react';
import type { ReactNode } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import { globalStyles, containerStyles } from '../common/styles';

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <>
      <Global styles={globalStyles} />
      <Container>
        <Navbar />
        <MainContent>
          <ContentWrapper>
            {children}
          </ContentWrapper>
        </MainContent>
        <Footer />
      </Container>
    </>
  );
};

export default Layout;

const Container = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`;

const MainContent = styled.main`
  flex: 1;
  width: 100%;
`;

const ContentWrapper = styled.div`
  ${containerStyles}
  padding-top: 24px;
  padding-bottom: 24px;
 
  @media (min-width: 769px) {
    padding-top: 32px;
    padding-bottom: 32px;
  }
`;
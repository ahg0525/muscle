import styled from '@emotion/styled';
import { containerStyles, breakpoints } from '../common/styles';
import { colors } from '../common/colors';

const Footer = () => {
  return (
    <Container>
      <FooterContent>
        <FooterGrid>
          <FooterSection>
            <h3>MUSCLE</h3>
            <p>muscle - athletes website<br />muscle - athletes website</p>
          </FooterSection>
          
          <FooterSection>
            <h3>Info</h3>
            <p>
              <a 
                href="https://jungwoninthegarden.vercel.app" 
                target="_blank" 
                rel="noopener noreferrer"
                className='visit'
              >
                VISIT My Website
              </a><br />
              <a 
                href="https://jungwoninthegarden.vercel.app" 
                target="_blank" 
                rel="noopener noreferrer"
                className='visit'
              >
                in here 👇
              </a><br />
              <a 
                href="https://jungwoninthegarden.vercel.app" 
                target="_blank" 
                rel="noopener noreferrer"
                className='visit'
              >
                jungwoninthegarden.vercel.app
              </a>
            </p>
          </FooterSection>
          
          <FooterSection>
            <h3>Contact</h3>
            <p>
              phone: 010-1899-1899<br />
              email: muscle@muscle.io<br />
            </p>
          </FooterSection>
        </FooterGrid>
      </FooterContent>
    </Container>
  );
};

export default Footer;

const Container = styled.footer`
  background-color: black;
  color: white;
  margin-top: auto;
`;

const FooterContent = styled.div`
  ${containerStyles}
  padding-top: 32px;
  padding-bottom: 32px;
  
  @media (min-width: ${breakpoints.desktop}px) {
    padding-top: 48px;
    padding-bottom: 48px;
  }
`;

const FooterGrid = styled.div`
  display: grid;
  gap: 24px;
  
  @media (min-width: ${breakpoints.desktop}px) {
    grid-template-columns: repeat(3, 1fr);
    gap: 48px;
  }
`;

const FooterSection = styled.div`
  h3 {
    font-size: 18px;
    margin-bottom: 12px;
  }
  
  p {
    font-size: 14px;
    color: ${colors.grey};
    line-height: 1.6;
  }
  a {
    color: ${colors.grey};
  }
`;
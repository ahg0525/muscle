import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import styled from '@emotion/styled';
import { containerStyles, breakpoints } from '../common/styles';
import images from '../common/images';
import { colors } from '../common/colors';

interface MobileNavProps {
  isOpen: boolean;
}

const Navbar = () => {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  
  const navItems = [
    { path: '/', label: '수업 일정' },
    { path: '/checkin', label: '체크인' },
    { path: '/admin', label: '관리자' }
  ];

  const isActive = (path: string, currentPath: string) => {
    if (path === "/") {
      return currentPath === "/" || currentPath.startsWith("/book");
    }
    return currentPath === path;
  };

  return (
    <Container>
      <NavbarContent>
        <Logo to="/">
          <LogoImg src={images.logo.long} alt="FITNESS SYSTEM" />
        </Logo>
        
        <DesktopNav>
          {navItems.map(item => (
            <NavLink
              key={item.path}
              to={item.path}
              className={isActive(item.path, location.pathname) ? "active" : ""}
            >
              {item.label}
            </NavLink>
          ))}
        </DesktopNav>
        
        <MobileMenuButton 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label={mobileMenuOpen ? "메뉴 닫기" : "메뉴 열기"}
          aria-expanded={mobileMenuOpen}
          aria-controls="mobile-nav"
        >
          <span />
          <span />
          <span />
        </MobileMenuButton>
      </NavbarContent>
      
      <MobileNav id="mobile-nav" isOpen={mobileMenuOpen}>
        {navItems.map(item => (
          <MobileNavLink
            key={item.path}
            to={item.path}
            className={isActive(item.path, location.pathname) ? "active" : ""}
            onClick={() => setMobileMenuOpen(false)}
          >
            {item.label}
          </MobileNavLink>
        ))}
        {/* <h3>VISIT jungwoninthegarden.vercel.app</h3> */}
        <a 
          href="https://jungwoninthegarden.vercel.app" 
          target="_blank" 
          rel="noopener noreferrer"
          className='visit'
        >
          VISIT jungwoninthegarden.vercel.app
        </a>
      </MobileNav>
    </Container>
  );
};

export default Navbar;

const Container = styled.nav`
  background-color: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(10px);
  position: sticky;
  top: 0;
  z-index: 50;
`;

const NavbarContent = styled.div`
  ${containerStyles}
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Logo = styled(Link)`
  font-size: 20px;
  text-decoration: none;
  
  @media (min-width: ${breakpoints.desktop}px) {
    font-size: 24px;
  }
`;

const LogoImg = styled.img`
  height: 30px;
  width: auto;
  max-width: 100%;
`;

const DesktopNav = styled.div`
  display: none;
  
  @media (min-width: ${breakpoints.desktop}px) {
    display: flex;
    gap: 32px;
  }
`;

const MobileMenuButton = styled.button`
  display: flex;
  flex-direction: column;
  gap: 4px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 8px;
  
  @media (min-width: ${breakpoints.desktop}px) {
    display: none;
  }
  
  span {
    width: 24px;
    height: 2px;
    background-color: white;
    transition: all 0.3s ease;
  }
`;

const MobileNav = styled.div<MobileNavProps>`
  display: ${props => props.isOpen ? 'flex' : 'none'};
  flex-direction: column;
  position: absolute;
  top: 64px;
  left: 0;
  right: 0;
  background-color: black;
  border-bottom: 1px solid ${colors.lightBlack};
  height: 80vh;

  .visit {
    margin-top: auto;
    text-align: center;
    margin-bottom: 10px;
    color: ${colors.grey};
    font-size: 16px;
    text-decoration: none;
  }
  
  @media (min-width: ${breakpoints.desktop}px) {
    display: none;
  }
`;

const NavLink = styled(Link)`
  color: ${colors.grey};
  text-decoration: none;
  font-weight: 500;
  padding: 8px 12px;
  transition: all 0.2s;
  
  &.active {
    color: ${colors.red};
  }

  &:hover {
    color: ${colors.red};
  }
`;

const MobileNavLink = styled(Link)`
  color: ${colors.grey};
  text-decoration: none;
  font-weight: 500;
  padding: 16px 24px;
  border-bottom: 1px solid ${colors.lightBlack};
  
  &.active {
    color: ${colors.red};
    background-color: ${colors.lightBlack};
  }
  
  &:hover {
    background-color: ${colors.lightBlack};
  }
`;
# MUSCLE - athletes website

피트니스 클래스 예약 및 관리 시스템

## 📋 프로젝트 개요

피트니스 센터의 클래스 예약, 체크인, 관리 기능을 제공하는 React 웹 애플리케이션

## 🚀 실행 방법

```bash
# 의존성 설치
pnpm install

# 개발 서버 실행
pnpm dev

# 빌드
pnpm build

# 테스트 실행
pnpm test
```

## 🏗️ 아키텍처 및 설계 결정

### 기술 스택
- **Frontend**: React 18 + TypeScript + Vite
- **스타일링**: Emotion (styled-components)
- **상태관리**: TanStack Query + React useState
- **라우팅**: React Router DOM v7
- **차트**: Chart.js + react-chartjs-2
- **달력**: react-datepicker
- **HTTP 클라이언트**: Axios

### 폴더 구조
```
src/
├── api/          # API 통신 로직
├── components/   # 재사용 가능한 컴포넌트
├── hooks/        # 커스텀 훅
├── pages/        # 페이지 컴포넌트
├── types/        # TypeScript 타입 정의
├── mocks/        # 목 데이터
└── assets/       # 정적 자원
```

### 상태관리
- **TanStack Query**: 기본 설정만 적용 (useQuery)
- **useState**: 로컬 컴포넌트 상태 관리
- **API 호출**: 직접 axios 사용 (useEffect + useState 패턴)
- **전역 상태**: 필요성에 따라 Context API 사용 가능

## 🎞 DEMO

![pc1](https://github.com/user-attachments/assets/9c63c58d-c38e-48f4-bc6c-e46dafd5d2f6)

![pc2](https://github.com/user-attachments/assets/a3e83bc0-1a4d-479c-8f2d-44f7461e4b0f)

![m1](https://github.com/user-attachments/assets/18bf8588-871b-428a-bb62-efecd8726a35)

![m2](https://github.com/user-attachments/assets/e7bad5e9-b93d-4cf5-a749-af499ebb68fb)





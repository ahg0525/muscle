import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import ClassCard from '../ClassCard'
import { mockClasses } from '../../mocks/mockData'

// MSW를 사용한 네트워크 격리
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
})

// Mock useNavigate
const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  }
})

const renderWithProviders = (component: React.ReactElement) => {
  return render(
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        {component}
      </BrowserRouter>
    </QueryClientProvider>
  )
}

describe('ClassCard', () => {
  const mockClass = mockClasses[0]

  beforeEach(() => {
    mockNavigate.mockClear()
  })

  describe('렌더링 테스트', () => {
    it('수업 정보를 올바르게 표시한다', () => {
      renderWithProviders(<ClassCard classItem={mockClass} />)
      
      expect(screen.getByText(mockClass.title)).toBeInTheDocument()
      expect(screen.getByText(mockClass.instructor)).toBeInTheDocument()
      expect(screen.getByText(mockClass.center)).toBeInTheDocument()
    })

    it('예약 가능한 수업의 상태를 올바르게 표시한다', () => {
      const availableClass = { ...mockClass, reservations: 5, capacity: 10 }
      renderWithProviders(<ClassCard classItem={availableClass} />)
      
      expect(screen.getByText('5명 남음!')).toBeInTheDocument()
    })

    it('마감된 수업의 상태를 올바르게 표시한다', () => {
      const fullClass = { ...mockClass, reservations: 10, capacity: 10, waitlist: 0 }
      renderWithProviders(<ClassCard classItem={fullClass} />)
      
      expect(screen.getByText('대기 신청 가능!')).toBeInTheDocument()
    })

    it('대기 신청 중인 수업의 상태를 올바르게 표시한다', () => {
      const waitlistClass = { ...mockClass, reservations: 10, capacity: 10, waitlist: 5 }
      renderWithProviders(<ClassCard classItem={waitlistClass} />)
      
      expect(screen.getByText('5명 대기중!')).toBeInTheDocument()
    })
  })

  describe('상호작용 테스트', () => {
    it('클릭 시 상세 페이지로 이동한다', () => {
      renderWithProviders(<ClassCard classItem={mockClass} />)
      
      const card = screen.getByRole('button')
      fireEvent.click(card)
      
      expect(mockNavigate).toHaveBeenCalledWith(`/book/${mockClass.id}`)
    })

    it('키보드로 Enter 키를 누르면 클릭과 동일하게 동작한다', () => {
      renderWithProviders(<ClassCard classItem={mockClass} />)
      
      const card = screen.getByRole('button')
      fireEvent.keyDown(card, { key: 'Enter' })
      
      expect(mockNavigate).toHaveBeenCalledWith(`/book/${mockClass.id}`)
    })

    it('키보드로 Space 키를 누르면 클릭과 동일하게 동작한다', () => {
      renderWithProviders(<ClassCard classItem={mockClass} />)
      
      const card = screen.getByRole('button')
      fireEvent.keyDown(card, { key: ' ' })
      
      expect(mockNavigate).toHaveBeenCalledWith(`/book/${mockClass.id}`)
    })
  })

  describe('접근성 테스트', () => {
    it('키보드 포커스가 가능하다', () => {
      renderWithProviders(<ClassCard classItem={mockClass} />)
      
      const card = screen.getByRole('button')
      expect(card).toHaveAttribute('tabindex', '0')
    })

    it('스크린 리더를 위한 aria-label을 제공한다', () => {
      renderWithProviders(<ClassCard classItem={mockClass} />)
      
      const card = screen.getByRole('button')
      expect(card).toHaveAttribute('aria-label')
      expect(card.getAttribute('aria-label')).toContain(mockClass.title)
      expect(card.getAttribute('aria-label')).toContain(mockClass.instructor)
    })

    it('이미지에 의미있는 alt 텍스트를 제공한다', () => {
      renderWithProviders(<ClassCard classItem={mockClass} />)
      
      const image = screen.getByAltText(`${mockClass.instructor} 강사 프로필 이미지`)
      expect(image).toBeInTheDocument()
    })
  })

  describe('상태 전이 테스트', () => {
    it('예약 가능 → 마감 상태 변화를 올바르게 표시한다', () => {
      // 예약 가능한 상태로 시작
      const availableClass = { ...mockClass, reservations: 5, capacity: 10 }
      const { rerender } = renderWithProviders(<ClassCard classItem={availableClass} />)
      
      // 예약 가능 상태 확인
      expect(screen.getByText('5명 남음!')).toBeInTheDocument()
      
      // 마감 상태로 변경
      const fullClass = { ...mockClass, reservations: 10, capacity: 10, waitlist: 0 }
      rerender(
        <QueryClientProvider client={queryClient}>
          <BrowserRouter>
            <ClassCard classItem={fullClass} />
          </BrowserRouter>
        </QueryClientProvider>
      )
      
      expect(screen.getByText('대기 신청 가능!')).toBeInTheDocument()
    })
  })

  describe('예외/실패 시나리오', () => {
    it('잘못된 데이터가 전달되어도 크래시하지 않는다', () => {
      const invalidClass = {
        ...mockClass,
        title: undefined,
        instructor: null,
        capacity: 0
      } as unknown as typeof mockClass
      
      expect(() => {
        renderWithProviders(<ClassCard classItem={invalidClass} />)
      }).not.toThrow()
    })

    it('날짜가 잘못된 경우에도 표시된다', () => {
      const invalidDateClass = { ...mockClass, datetime: 'invalid-date' as unknown as number }
      
      expect(() => {
        renderWithProviders(<ClassCard classItem={invalidDateClass} />)
      }).not.toThrow()
    })
  })
}) 
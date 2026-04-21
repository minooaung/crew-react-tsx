import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import Button from '../Button'

// Wrapper component for tests that need Router context
const RouterWrapper = ({ children }: { children: React.ReactNode }) => (
  <BrowserRouter>{children}</BrowserRouter>
)

describe('Button Component', () => {
  describe('Basic Rendering', () => {
    it('should render button with default props', () => {
      render(<Button>Click me</Button>)
      
      const button = screen.getByRole('button')
      expect(button).toBeInTheDocument()
      expect(button).toHaveTextContent('Click me')
      expect(button).toHaveAttribute('type', 'button')
    })

    it('should render button with custom text', () => {
      render(<Button>Save Changes</Button>)
      
      expect(screen.getByRole('button')).toHaveTextContent('Save Changes')
    })

    it('should apply custom className', () => {
      render(<Button className="custom-class">Test</Button>)
      
      const button = screen.getByRole('button')
      expect(button).toHaveClass('custom-class')
    })
  })

  describe('Button Variants', () => {
    it('should render primary variant correctly', () => {
      render(<Button variant="primary">Primary</Button>)
      
      const button = screen.getByRole('button')
      expect(button).toHaveClass('bg-blue-600', 'hover:bg-blue-700', 'text-white')
    })

    it('should render secondary variant correctly', () => {
      render(<Button variant="secondary">Secondary</Button>)
      
      const button = screen.getByRole('button')
      expect(button).toHaveClass('border-gray-300', 'text-gray-700', 'bg-white')
    })

    it('should render danger variant correctly', () => {
      render(<Button variant="danger">Delete</Button>)
      
      const button = screen.getByRole('button')
      expect(button).toHaveClass('text-red-600', 'hover:text-red-900', 'bg-transparent')
    })

    it('should render auth variant correctly', () => {
      render(<Button variant="auth">Login</Button>)
      
      const button = screen.getByRole('button')
      expect(button).toHaveClass('text-white', 'bg-purple-800', 'hover:bg-purple-900')
    })

    it('should render link variant correctly', () => {
      render(<Button variant="link">Link Button</Button>)
      
      const button = screen.getByRole('button')
      expect(button).toHaveClass('text-blue-600', 'hover:text-blue-900', 'bg-transparent')
    })

    it('should render pagination variant correctly', () => {
      render(<Button variant="pagination">1</Button>)
      
      const button = screen.getByRole('button')
      expect(button).toHaveClass('border-gray-300', 'text-gray-500', 'bg-white')
    })

    it('should render small variant correctly', () => {
      render(<Button variant="small">×</Button>)
      
      const button = screen.getByRole('button')
      expect(button).toHaveClass('text-blue-400', 'hover:bg-blue-200', 'rounded-full')
    })
  })

  describe('Button Sizes', () => {
    it('should render small size correctly', () => {
      render(<Button size="sm">Small</Button>)
      
      const button = screen.getByRole('button')
      expect(button).toHaveClass('px-3', 'py-1.5', 'text-sm')
    })

    it('should render medium size correctly (default)', () => {
      render(<Button size="md">Medium</Button>)
      
      const button = screen.getByRole('button')
      expect(button).toHaveClass('px-4', 'py-2', 'text-sm')
    })

    it('should render large size correctly', () => {
      render(<Button size="lg">Large</Button>)
      
      const button = screen.getByRole('button')
      expect(button).toHaveClass('px-6', 'py-3', 'text-base')
    })

    it('should override size for auth variant', () => {
      render(<Button variant="auth" size="sm">Auth Button</Button>)
      
      const button = screen.getByRole('button')
      expect(button).toHaveClass('w-full', 'py-4', 'px-4')
    })
  })

  describe('Button Types', () => {
    it('should render submit type correctly', () => {
      render(<Button type="submit">Submit</Button>)
      
      const button = screen.getByRole('button')
      expect(button).toHaveAttribute('type', 'submit')
    })

    it('should render reset type correctly', () => {
      render(<Button type="reset">Reset</Button>)
      
      const button = screen.getByRole('button')
      expect(button).toHaveAttribute('type', 'reset')
    })
  })

  describe('Disabled State', () => {
    it('should render disabled button correctly', () => {
      render(<Button disabled>Disabled</Button>)
      
      const button = screen.getByRole('button')
      expect(button).toBeDisabled()
      expect(button).toHaveClass('disabled:opacity-50')
    })

    it('should not call onClick when disabled', () => {
      const handleClick = vi.fn()
      render(<Button disabled onClick={handleClick}>Disabled</Button>)
      
      const button = screen.getByRole('button')
      fireEvent.click(button)
      
      expect(handleClick).not.toHaveBeenCalled()
    })
  })

  describe('Loading State', () => {
    it('should render loading state correctly', () => {
      render(<Button loading>Loading</Button>)
      
      const button = screen.getByRole('button')
      expect(button).toBeDisabled()
      expect(button).toHaveTextContent('Loading')
      
      // Check for loading spinner
      const spinner = button.querySelector('svg')
      expect(spinner).toBeInTheDocument()
      expect(spinner).toHaveClass('animate-spin')
    })

    it('should show custom loading text', () => {
      render(<Button loading loadingText="Saving...">Save</Button>)
      
      const button = screen.getByRole('button')
      expect(button).toHaveTextContent('Saving...')
    })

    it('should not call onClick when loading', () => {
      const handleClick = vi.fn()
      render(<Button loading onClick={handleClick}>Loading</Button>)
      
      const button = screen.getByRole('button')
      fireEvent.click(button)
      
      expect(handleClick).not.toHaveBeenCalled()
    })
  })

  describe('Click Handling', () => {
    it('should call onClick when clicked', () => {
      const handleClick = vi.fn()
      render(<Button onClick={handleClick}>Click me</Button>)
      
      const button = screen.getByRole('button')
      fireEvent.click(button)
      
      expect(handleClick).toHaveBeenCalledTimes(1)
    })

    it('should pass event to onClick handler', () => {
      const handleClick = vi.fn()
      render(<Button onClick={handleClick}>Click me</Button>)
      
      const button = screen.getByRole('button')
      fireEvent.click(button)
      
      expect(handleClick).toHaveBeenCalledWith(expect.any(Object))
    })
  })

  describe('Icon Support', () => {
    const TestIcon = () => <span data-testid="test-icon">🔍</span>

    it('should render icon on the left by default', () => {
      render(<Button icon={<TestIcon />}>Search</Button>)
      
      const button = screen.getByRole('button')
      const icon = screen.getByTestId('test-icon')
      
      expect(icon).toBeInTheDocument()
      expect(button).toHaveTextContent('🔍Search')
    })

    it('should render icon on the right when specified', () => {
      render(<Button icon={<TestIcon />} iconPosition="right">Search</Button>)
      
      const button = screen.getByRole('button')
      const icon = screen.getByTestId('test-icon')
      
      expect(icon).toBeInTheDocument()
      expect(button).toHaveTextContent('Search🔍')
    })

    it('should not render icon when loading', () => {
      render(<Button icon={<TestIcon />} loading>Search</Button>)
      
      expect(screen.queryByTestId('test-icon')).not.toBeInTheDocument()
    })
  })

  describe('Link Functionality', () => {
    it('should render as Link when "to" prop is provided', () => {
      render(
        <RouterWrapper>
          <Button to="/dashboard">Go to Dashboard</Button>
        </RouterWrapper>
      )
      
      const link = screen.getByRole('link')
      expect(link).toBeInTheDocument()
      expect(link).toHaveAttribute('href', '/dashboard')
      expect(link).toHaveTextContent('Go to Dashboard')
    })

    it('should apply button classes to Link', () => {
      render(
        <RouterWrapper>
          <Button to="/dashboard" variant="primary">Dashboard</Button>
        </RouterWrapper>
      )
      
      const link = screen.getByRole('link')
      expect(link).toHaveClass('bg-blue-600', 'text-white')
    })

    it('should not render as button when "to" prop is provided', () => {
      render(
        <RouterWrapper>
          <Button to="/dashboard">Dashboard</Button>
        </RouterWrapper>
      )
      
      expect(screen.queryByRole('button')).not.toBeInTheDocument()
      expect(screen.getByRole('link')).toBeInTheDocument()
    })
  })

  describe('Additional Props', () => {
    it('should pass through additional props to button', () => {
      render(<Button data-testid="custom-button" aria-label="Custom button">Test</Button>)
      
      const button = screen.getByRole('button')
      expect(button).toHaveAttribute('data-testid', 'custom-button')
      expect(button).toHaveAttribute('aria-label', 'Custom button')
    })

    it('should pass through additional props to Link', () => {
      render(
        <RouterWrapper>
          <Button to="/test" data-testid="custom-link" aria-label="Custom link">Test</Button>
        </RouterWrapper>
      )
      
      const link = screen.getByRole('link')
      expect(link).toHaveAttribute('data-testid', 'custom-link')
      expect(link).toHaveAttribute('aria-label', 'Custom link')
    })
  })

  describe('Edge Cases', () => {
    it('should handle empty children', () => {
      render(<Button>{''}</Button>)
      
      const button = screen.getByRole('button')
      expect(button).toBeInTheDocument()
      expect(button).toHaveTextContent('')
    })

    it('should handle complex children', () => {
      render(
        <Button>
          <span>Complex</span> <strong>Content</strong>
        </Button>
      )
      
      const button = screen.getByRole('button')
      expect(button).toHaveTextContent('Complex Content')
      expect(button.querySelector('span')).toBeInTheDocument()
      expect(button.querySelector('strong')).toBeInTheDocument()
    })

    it('should handle both loading and icon props correctly', () => {
      const TestIcon = () => <span data-testid="test-icon">🔍</span>
      
      render(<Button loading icon={<TestIcon />}>Search</Button>)
      
      // Should show loading spinner, not the icon
      expect(screen.queryByTestId('test-icon')).not.toBeInTheDocument()
      expect(screen.getByRole('button').querySelector('svg')).toBeInTheDocument()
    })
  })

  describe('Accessibility', () => {
    it('should be focusable when not disabled', () => {
      render(<Button>Focusable</Button>)
      
      const button = screen.getByRole('button')
      button.focus()
      
      expect(button).toHaveFocus()
    })

    it('should not be focusable when disabled', () => {
      render(<Button disabled>Not Focusable</Button>)
      
      const button = screen.getByRole('button')
      expect(button).toBeDisabled()
    })

    it('should have proper focus styles', () => {
      render(<Button>Focus Test</Button>)
      
      const button = screen.getByRole('button')
      expect(button).toHaveClass('focus:outline-none')
    })
  })
})

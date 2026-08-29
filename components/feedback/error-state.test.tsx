import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { ErrorState } from './error-state';

describe('ErrorState', () => {
  it('renders safe error message correctly', () => {
    const errorMessage = 'Something went wrong safely.';
    render(<ErrorState error={errorMessage} onRetry={vi.fn()} />);
    
    expect(screen.getByText('Generation Failed')).toBeInTheDocument();
    expect(screen.getByText(errorMessage)).toBeInTheDocument();
  });

  it('calls onRetry when retry button is clicked', () => {
    const handleRetry = vi.fn();
    render(<ErrorState error="Error" onRetry={handleRetry} />);
    
    const retryButton = screen.getByRole('button', { name: /try again/i });
    expect(retryButton).toBeInTheDocument();
    
    fireEvent.click(retryButton);
    expect(handleRetry).toHaveBeenCalledOnce();
  });
});

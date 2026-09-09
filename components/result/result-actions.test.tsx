import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ResultActions } from './result-actions';

describe('ResultActions', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('copy interaction works and shows accessible feedback', async () => {
    render(
      <ResultActions 
        messageText="Test message" 
        onRegenerate={vi.fn()} 
        onEdit={vi.fn()} 
        onStartNew={vi.fn()}
      />
    );
    
    const copyButton = screen.getByRole('button', { name: /copy message/i });
    expect(copyButton).toBeInTheDocument();
    
    fireEvent.click(copyButton);
    
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith('Test message');
    
    // Check for success feedback
    await waitFor(() => {
      expect(screen.getByText(/copied to clipboard/i)).toBeInTheDocument();
    });
  });

  it('calls onRegenerate, onEdit, and onStartNew', () => {
    const handleRegenerate = vi.fn();
    const handleEdit = vi.fn();
    const handleStartNew = vi.fn();
    
    render(
      <ResultActions 
        messageText="Test" 
        onRegenerate={handleRegenerate} 
        onEdit={handleEdit} 
        onStartNew={handleStartNew}
      />
    );
    
    fireEvent.click(screen.getByRole('button', { name: /generate another/i }));
    expect(handleRegenerate).toHaveBeenCalled();
    
    fireEvent.click(screen.getByRole('button', { name: /edit details/i }));
    expect(handleEdit).toHaveBeenCalled();

    fireEvent.click(screen.getByRole('button', { name: /start new/i }));
    expect(handleStartNew).toHaveBeenCalled();
  });

  it('disables buttons when loading', () => {
    render(
      <ResultActions 
        messageText="Test" 
        onRegenerate={vi.fn()} 
        onEdit={vi.fn()} 
        onStartNew={vi.fn()}
        isLoading={true}
      />
    );
    
    expect(screen.getByRole('button', { name: /generate another/i })).toBeDisabled();
    expect(screen.getByRole('button', { name: /edit details/i })).toBeDisabled();
    expect(screen.getByRole('button', { name: /start new/i })).toBeDisabled();
  });
});

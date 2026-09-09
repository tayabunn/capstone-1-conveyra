import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { GeneratedMessage } from './generated-message';

describe('GeneratedMessage', () => {
  const mockData = {
    message: 'This is the primary generated message.',
    approach: 'This is the approach explanation.',
    alternative: 'This is an alternative version.',
  };

  it('renders primary message, approach, and alternative', () => {
    render(
      <GeneratedMessage 
        data={mockData} 
        onRegenerate={vi.fn()} 
        onEdit={vi.fn()} 
        onStartNew={vi.fn()}
      />
    );
    
    expect(screen.getByText('This is the primary generated message.')).toBeInTheDocument();
    expect(screen.getByText('This is the approach explanation.')).toBeInTheDocument();
    expect(screen.getByText('This is an alternative version.')).toBeInTheDocument();
  });
});

import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { MessageForm } from './message-form';

describe('MessageForm', () => {
  it('renders all required fields', () => {
    render(<MessageForm onSubmit={vi.fn()} />);
    
    expect(screen.getByLabelText(/describe what you want to say/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/who are you writing to\?/i)).toBeInTheDocument();
    expect(screen.getByText(/select tone/i)).toBeInTheDocument();
    expect(screen.getByText(/message length/i)).toBeInTheDocument();
  });

  it('displays validation errors on invalid submission', async () => {
    render(<MessageForm onSubmit={vi.fn()} />);
    
    // Submit empty form
    fireEvent.submit(screen.getByRole('button', { name: /generate message/i }));
    
    // Wait for validation errors to appear
    expect(await screen.findByText(/please provide a bit more detail/i)).toBeInTheDocument();
    expect(await screen.findByText(/please select a valid recipient/i)).toBeInTheDocument();
  });

  it('calls onSubmit with valid data', async () => {
    const handleSubmit = vi.fn();
    render(<MessageForm onSubmit={handleSubmit} />);
    
    // Fill out the form
    fireEvent.change(screen.getByLabelText(/describe what you want to say/i), {
      target: { value: 'This is a valid context that has more than 10 characters.' },
    });
    
    fireEvent.change(screen.getByLabelText(/who are you writing to\?/i), {
      target: { value: 'manager' },
    });
    
    fireEvent.click(screen.getByLabelText(/professional/i));
    fireEvent.click(screen.getByLabelText(/^short$/i)); // ^$ to exactly match "Short"
    
    // Submit the form
    fireEvent.submit(screen.getByRole('button', { name: /generate message/i }));
    
    expect(handleSubmit).toHaveBeenCalledWith(expect.objectContaining({
      context: 'This is a valid context that has more than 10 characters.',
      recipient: 'manager',
      tone: 'professional',
      length: 'short',
    }));
  });

  it('prevents duplicate submissions and disables fields while loading', () => {
    const handleSubmit = vi.fn();
    render(<MessageForm onSubmit={handleSubmit} isLoading={true} />);
    
    const submitButton = screen.getByRole('button', { name: /understanding your context/i });
    expect(submitButton).toBeDisabled();
    
    expect(screen.getByLabelText(/describe what you want to say/i)).toBeDisabled();
    expect(screen.getByLabelText(/who are you writing to\?/i)).toBeDisabled();
  });

  it('allows adding and editing an optional rough draft', async () => {
    const handleSubmit = vi.fn();
    render(<MessageForm onSubmit={handleSubmit} />);

    const toggleDraftBtn = screen.getByRole('button', { name: /add rough draft/i });
    expect(toggleDraftBtn).toBeInTheDocument();

    fireEvent.click(toggleDraftBtn);

    const draftTextarea = await screen.findByPlaceholderText(/paste any rough email/i);
    expect(draftTextarea).toBeInTheDocument();

    fireEvent.change(draftTextarea, {
      target: { value: 'Rough draft text notes.' },
    });

    expect(draftTextarea).toHaveValue('Rough draft text notes.');
  });

  it('renders and invokes onCancel callback during loading state', () => {
    const handleCancel = vi.fn();
    render(<MessageForm onSubmit={vi.fn()} onCancel={handleCancel} isLoading={true} />);

    const cancelBtn = screen.getByRole('button', { name: /cancel message generation/i });
    expect(cancelBtn).toBeInTheDocument();

    fireEvent.click(cancelBtn);
    expect(handleCancel).toHaveBeenCalledTimes(1);
  });
});

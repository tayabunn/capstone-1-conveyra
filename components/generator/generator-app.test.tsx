import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GeneratorApp } from './generator-app';

describe('GeneratorApp Integration Flow', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    global.fetch = vi.fn();
    window.scrollTo = vi.fn();
  });

  it('renders initial message form in idle state', () => {
    render(<GeneratorApp />);
    expect(screen.getByLabelText(/describe what you want to say/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /generate message/i })).toBeInTheDocument();
  });

  it('handles successful message generation flow', async () => {
    const mockResponse = {
      message: 'Generated test output message.',
      approach: 'Direct and professional approach.',
      alternative: 'Alternative test version.',
    };

    vi.mocked(global.fetch).mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    } as Response);

    render(<GeneratorApp />);

    fireEvent.change(screen.getByLabelText(/describe what you want to say/i), {
      target: { value: 'I need to communicate a project delay to my client.' },
    });
    fireEvent.change(screen.getByLabelText(/who are you writing to\?/i), {
      target: { value: 'client' },
    });
    fireEvent.click(screen.getByLabelText(/professional/i));
    fireEvent.click(screen.getByLabelText(/^short$/i));

    fireEvent.submit(screen.getByRole('button', { name: /generate message/i }));

    expect(await screen.findByText('Your Suggested Message')).toBeInTheDocument();
    expect(await screen.findByText('Generated test output message.')).toBeInTheDocument();
  });

  it('handles API error display correctly', async () => {
    vi.mocked(global.fetch).mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: 'Rate limit exceeded. Please wait.' }),
    } as Response);

    render(<GeneratorApp />);

    fireEvent.change(screen.getByLabelText(/describe what you want to say/i), {
      target: { value: 'I need to communicate a project delay to my client.' },
    });
    fireEvent.change(screen.getByLabelText(/who are you writing to\?/i), {
      target: { value: 'client' },
    });
    fireEvent.click(screen.getByLabelText(/professional/i));
    fireEvent.click(screen.getByLabelText(/^short$/i));

    fireEvent.submit(screen.getByRole('button', { name: /generate message/i }));

    expect(await screen.findByRole('heading', { name: /generation failed/i })).toBeInTheDocument();
    const errorElements = await screen.findAllByText(/rate limit exceeded/i);
    expect(errorElements.length).toBeGreaterThan(0);
  });

  it('allows starting new generation from result view', async () => {
    vi.mocked(global.fetch).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        message: 'Initial result message.',
        approach: 'Initial approach.',
        alternative: 'Initial alternative.',
      }),
    } as Response);

    render(<GeneratorApp />);

    fireEvent.change(screen.getByLabelText(/describe what you want to say/i), {
      target: { value: 'I need to communicate a project delay to my client.' },
    });
    fireEvent.change(screen.getByLabelText(/who are you writing to\?/i), {
      target: { value: 'client' },
    });
    fireEvent.click(screen.getByLabelText(/professional/i));
    fireEvent.click(screen.getByLabelText(/^short$/i));

    fireEvent.submit(screen.getByRole('button', { name: /generate message/i }));

    expect(await screen.findByText('Initial result message.')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /start new/i }));

    expect(await screen.findByLabelText(/describe what you want to say/i)).toHaveValue('');
  });

  it('handles user request cancellation cleanly via AbortController', async () => {
    vi.mocked(global.fetch).mockImplementationOnce((_url, options) => {
      return new Promise((_, reject) => {
        if (options?.signal) {
          options.signal.addEventListener('abort', () => {
            const err = new DOMException('The user aborted a request.', 'AbortError');
            reject(err);
          });
        }
      });
    });

    render(<GeneratorApp />);

    fireEvent.change(screen.getByLabelText(/describe what you want to say/i), {
      target: { value: 'I need to communicate a project delay to my client.' },
    });
    fireEvent.change(screen.getByLabelText(/who are you writing to\?/i), {
      target: { value: 'client' },
    });
    fireEvent.click(screen.getByLabelText(/professional/i));
    fireEvent.click(screen.getByLabelText(/^short$/i));

    fireEvent.submit(screen.getByRole('button', { name: /generate message/i }));

    // Verify loading and cancel button appears
    const cancelBtn = await screen.findByRole('button', { name: /cancel message generation/i });
    expect(cancelBtn).toBeInTheDocument();

    // Click cancel
    fireEvent.click(cancelBtn);

    // Should return safely to idle state without error alert
    expect(await screen.findByRole('button', { name: /generate message/i })).toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: /generation failed/i })).not.toBeInTheDocument();
  });

  it('handles malformed API response safely', async () => {
    vi.mocked(global.fetch).mockResolvedValueOnce({
      ok: true,
      json: async () => {
        throw new Error('Invalid JSON received');
      },
    } as Response);

    render(<GeneratorApp />);

    fireEvent.change(screen.getByLabelText(/describe what you want to say/i), {
      target: { value: 'I need to communicate a project delay to my client.' },
    });
    fireEvent.change(screen.getByLabelText(/who are you writing to\?/i), {
      target: { value: 'client' },
    });
    fireEvent.click(screen.getByLabelText(/professional/i));
    fireEvent.click(screen.getByLabelText(/^short$/i));

    fireEvent.submit(screen.getByRole('button', { name: /generate message/i }));

    expect(await screen.findByRole('heading', { name: /generation failed/i })).toBeInTheDocument();
    const errorElements = screen.getAllByText(/invalid json received/i);
    expect(errorElements.length).toBeGreaterThan(0);
  });

  it('handles edit details action and preserves prior form values', async () => {
    vi.mocked(global.fetch).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        message: 'Initial result message.',
        approach: 'Initial approach.',
        alternative: 'Initial alternative.',
      }),
    } as Response);

    render(<GeneratorApp />);

    fireEvent.change(screen.getByLabelText(/describe what you want to say/i), {
      target: { value: 'Original context input text.' },
    });
    fireEvent.change(screen.getByLabelText(/who are you writing to\?/i), {
      target: { value: 'client' },
    });
    fireEvent.click(screen.getByLabelText(/professional/i));
    fireEvent.click(screen.getByLabelText(/^short$/i));

    fireEvent.submit(screen.getByRole('button', { name: /generate message/i }));

    expect(await screen.findByText('Initial result message.')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /edit details/i }));

    const textarea = await screen.findByLabelText(/describe what you want to say/i);
    expect(textarea).toHaveValue('Original context input text.');
  });
});

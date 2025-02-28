import React from 'react';
import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import { describe, it,vi, expect } from 'vitest';
import ProfileSubmenu from '../components/ProfileSubmenu';

describe('ProfileSubmenu', () => {
  it('renders all menu items', () => {
    const mockOnClose = vi.fn();
    render(<ProfileSubmenu onClose={mockOnClose} />);
    expect(screen.getByTestId('profile-settings-button')).toBeInTheDocument();
    expect(screen.getByTestId('billing-button')).toBeInTheDocument();
    expect(screen.getByTestId('sign-out-button')).toBeInTheDocument();
  });

  it('calls onClose on item click', async () => {
    const mockOnClose = vi.fn();
    render(<ProfileSubmenu onClose={mockOnClose} />);
    fireEvent.click(screen.getByTestId('profile-settings-button'));
    await waitFor(() => {
      expect(mockOnClose).toHaveBeenCalled();
    });
  });
});
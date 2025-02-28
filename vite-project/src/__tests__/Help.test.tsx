import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Help from '../components/Help';

describe('Help', () => {
  it('renders help button', () => {
    render(<Help />);
    expect(screen.getByText('Help')).toBeInTheDocument();
  });

  it('toggles help modal on click', () => {
    const mockToggle = vi.fn();
    render(<Help onToggle={mockToggle} />);
    fireEvent.click(screen.getByText('Help'));
    expect(mockToggle).toHaveBeenCalled();
  });
});
import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import { describe, it, vi, expect } from 'vitest';
import DarkModeToggle from '../components/DarkModeToggle';

describe('DarkModeToggle', () => {
  it('renders toggle button', () => {
    render(<DarkModeToggle isDarkMode={false} onToggle={() => {}} />);
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('toggles dark mode on click', () => {
    const mockToggle = vi.fn();
    render(<DarkModeToggle isDarkMode={false} onToggle={mockToggle} />);
    fireEvent.click(screen.getByRole('button'));
    expect(mockToggle).toHaveBeenCalled();
  });
});
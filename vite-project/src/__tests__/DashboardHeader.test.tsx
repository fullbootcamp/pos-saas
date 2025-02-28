import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import DashboardHeader from '../components/DashboardHeader';
import DarkModeToggle from '../components/DarkModeToggle';

describe('DashboardHeader', () => {
  it('renders with DarkModeToggle and toggles dark mode', () => {
    const mockToggle = vi.fn();
    render(
      <DashboardHeader initial="AB" isDarkMode={false} toggleDarkMode={mockToggle}>
        <DarkModeToggle isDarkMode={false} onToggle={mockToggle} />
      </DashboardHeader>
    );
    expect(screen.getByText('Logo')).toBeInTheDocument();
    const toggleButton = screen.getAllByRole('button')[1]; // Target the second button (DarkModeToggle)
    expect(toggleButton).toBeInTheDocument();
    fireEvent.click(toggleButton);
    expect(mockToggle).toHaveBeenCalled();
  });

  it('applies dark mode class when isDarkMode is true', () => {
    const mockToggle = vi.fn();
    render(
      <DashboardHeader initial="AB" isDarkMode={true} toggleDarkMode={mockToggle}>
        <DarkModeToggle isDarkMode={true} onToggle={mockToggle} />
      </DashboardHeader>
    );
    expect(screen.getByTestId('dashboard-header')).toHaveClass('bg-gray-800');
    const toggleButton = screen.getAllByRole('button')[1]; // Target the second button (DarkModeToggle)
    expect(toggleButton).toBeInTheDocument();
  });
});
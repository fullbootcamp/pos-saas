import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import StoreOverviewTab from '../components/StoreOverviewTab';

describe('StoreOverviewTab', () => {
  it('renders tab label and icon', () => {
    const mockNavigate = vi.fn();
    render(<StoreOverviewTab navigate={mockNavigate} themeClass="light" />);
    expect(screen.getByText('Store Overview')).toBeInTheDocument();
  });

  it('triggers navigation on click', () => {
    const mockNavigate = vi.fn();
    render(<StoreOverviewTab navigate={mockNavigate} themeClass="light" />);
    fireEvent.click(screen.getByText('Store Overview'));
    expect(mockNavigate).toHaveBeenCalledWith('/dashboard/mobile');
  });
});
import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import POSTab from '../components/POSTab';

describe('POSTab', () => {
  it('renders tab label and icon', () => {
    const mockNavigate = vi.fn();
    render(<POSTab navigate={mockNavigate} themeClass="light" />);
    expect(screen.getByText('POS')).toBeInTheDocument();
  });

  it('triggers navigation on click', () => {
    const mockNavigate = vi.fn();
    render(<POSTab navigate={mockNavigate} themeClass="light" />);
    fireEvent.click(screen.getByText('POS'));
    expect(mockNavigate).toHaveBeenCalledWith('/pos/mobile');
  });
});
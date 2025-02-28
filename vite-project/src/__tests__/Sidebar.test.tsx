import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Sidebar from '../components/Sidebar';
import StoreOverviewTab from '../components/StoreOverviewTab';
import POSTab from '../components/POSTab';

describe('Sidebar', () => {
  it('renders sidebar and title', () => {
    const mockNavigate = vi.fn();
    render(
      <Sidebar themeClass="light">
        <StoreOverviewTab navigate={mockNavigate} themeClass="light" />
        <POSTab navigate={mockNavigate} themeClass="light" />
      </Sidebar>
    );
    expect(screen.getByTestId('sidebar')).toBeInTheDocument();
    expect(screen.getByTestId('sidebar-title')).toBeInTheDocument();
    expect(screen.getByText('Store Menu')).toBeInTheDocument();
  });

  it('triggers navigation on tab click', () => {
    const mockNavigate = vi.fn();
    render(
      <Sidebar themeClass="light">
        <StoreOverviewTab navigate={mockNavigate} themeClass="light" />
        <POSTab navigate={mockNavigate} themeClass="light" />
      </Sidebar>
    );
    fireEvent.click(screen.getByText('Store Overview'));
    expect(mockNavigate).toHaveBeenCalledWith('/dashboard/mobile');
    fireEvent.click(screen.getByText('POS'));
    expect(mockNavigate).toHaveBeenCalledWith('/pos/mobile');
  });
});
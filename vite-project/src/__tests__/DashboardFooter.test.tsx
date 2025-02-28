import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import DashboardFooter from '../components/DashboardFooter';

describe('DashboardFooter', () => {
  it('renders dashboard footer content', () => {
    render(<DashboardFooter />);
    expect(screen.getByText(/© 2025 RetailPOS Dashboard/i)).toBeInTheDocument(); // Dashboard-specific copyright
  });
});
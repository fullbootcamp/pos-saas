import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import MainContent from '../components/MainContent';

describe('MainContent', () => {
  it('renders dashboard overview', () => {
    render(<MainContent />);
    expect(screen.getByTestId('main-content')).toBeInTheDocument();
    expect(screen.getByText(/Dashboard Overview/i)).toBeInTheDocument(); // Simplified to regex match
    expect(screen.getByText(/Welcome to your store dashboard/i)).toBeInTheDocument();
  });
});
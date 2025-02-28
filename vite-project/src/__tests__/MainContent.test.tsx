import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import MainContent from '../components/MainContent';

describe('MainContent', () => {
  it('renders dashboard overview', () => {
    render(<MainContent />);
    expect(screen.getByTestId('main-content')).toBeInTheDocument(); // This line causes the error
    screen.debug(); // Add this line
    expect(screen.getByText('Dashboard Overview')).toBeInTheDocument();
    screen.debug(); // Add this line
    expect(screen.getByText(/Welcome to your store dashboard/i)).toBeInTheDocument();
    screen.debug(); // Add this line
  });
});

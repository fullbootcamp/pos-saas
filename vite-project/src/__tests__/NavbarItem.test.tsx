import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import NavbarItem from '../components/NavbarItem';

describe('NavbarItem', () => {
  it('renders label and icon', () => {
    const mockOnClick = vi.fn();
    const MockIcon = () => <span>Icon</span>; // Mock icon for testing
    render(<NavbarItem label="Test Item" icon={MockIcon} path="/test" themeClass="light" onClick={mockOnClick} />);
    expect(screen.getByText('Test Item')).toBeInTheDocument();
    expect(screen.getByText('Icon')).toBeInTheDocument();
  });

  it('triggers onClick with path on click', () => {
    const mockOnClick = vi.fn();
    const MockIcon = () => <span>Icon</span>;
    render(<NavbarItem label="Test Item" icon={MockIcon} path="/test" themeClass="light" onClick={mockOnClick} />);
    fireEvent.click(screen.getByText('Test Item'));
    expect(mockOnClick).toHaveBeenCalledWith('/test');
  });
});
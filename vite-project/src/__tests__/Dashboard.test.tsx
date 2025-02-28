import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Dashboard from '../pages/Dashboard';

describe('Dashboard', () => {
  it('renders Store Menu after loading', async () => {
    // Mock axios to resolve immediately
    vi.mock('axios', () => ({
      get: vi.fn().mockResolvedValue({
        data: {
          status: {
            userName: 'Test',
            storeName: 'Test Store',
            location: '123 Sherbrooke',
            subscription: { planName: '30 Days', isAutoRenew: 'ON' },
            trial_ends_at: new Date().toISOString(),
          },
        },
      }),
    }));

    render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Store Menu')).toBeInTheDocument();
    }, { timeout: 2000 }); // Increase timeout to 2000ms
  });
});
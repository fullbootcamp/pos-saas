// Header.test.tsx
import React from 'react';
import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Header from '../components/DashboardHeader';

describe('Header', () => {
  // ... other tests ...

  it('closes submenu on outside click', async () => {
    render(<Header initial="AB" isDarkMode={false} toggleDarkMode={() => {}} />);

    const profile = screen.getByText('AB');
    fireEvent.click(profile);

    const profileSettingsButton = screen.getByTestId('profile-settings-button');
    expect(profileSettingsButton).toBeInTheDocument();

    fireEvent.mouseDown(document.body);

    await waitFor(() => {
      expect(screen.queryByTestId('profile-settings-button')).not.toBeInTheDocument();
    });
  });
});
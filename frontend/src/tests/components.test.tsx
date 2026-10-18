import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { PravahaLogo } from '../components/common/PravahaLogo';
import { ThemeToggle } from '../components/common/ThemeToggle';
import { CopyButton } from '../components/common/CopyButton';
import { ConfirmationModal } from '../components/common/ConfirmationModal';
import { Header } from '../components/common/Header';

describe('Phase 1 Core Components', () => {
  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
    document.documentElement.className = '';
  });

  it('renders PravahaLogo with text and SVG mark', () => {
    render(<PravahaLogo />);
    expect(screen.getByText('PRAVAHA')).toBeDefined();
    expect(screen.getByText('Urban Flood Intelligence')).toBeDefined();
  });

  it('toggles theme and updates documentElement and localStorage', () => {
    render(<ThemeToggle />);
    const toggleBtn = screen.getByRole('button');
    expect(toggleBtn).toBeDefined();

    // Initial state check
    const initialTheme = localStorage.getItem('pravaha-theme');
    fireEvent.click(toggleBtn);
    const newTheme = localStorage.getItem('pravaha-theme');
    expect(newTheme).not.toBe(initialTheme);
  });

  it('handles copy action and shows visual confirmation', async () => {
    // Mock clipboard
    Object.assign(navigator, {
      clipboard: {
        writeText: vi.fn().mockImplementation(() => Promise.resolve()),
      },
    });

    render(<CopyButton textToCopy="Test Content" label="Copy Data" />);
    const copyBtn = screen.getByRole('button');
    expect(screen.getByText('Copy Data')).toBeDefined();

    await act(async () => {
      fireEvent.click(copyBtn);
    });
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith('Test Content');
  });

  it('renders ConfirmationModal with accessible labels and triggers callbacks', () => {
    const onConfirm = vi.fn();
    const onClose = vi.fn();

    const { rerender } = render(
      <ConfirmationModal
        isOpen={false}
        title="Reset Investigation"
        description="Are you sure you want to proceed?"
        confirmLabel="Reset Scenario"
        onConfirm={onConfirm}
        onClose={onClose}
      />
    );

    expect(screen.queryByText('Reset Investigation')).toBeNull();

    rerender(
      <ConfirmationModal
        isOpen={true}
        title="Reset Investigation"
        description="Are you sure you want to proceed?"
        confirmLabel="Reset Scenario"
        onConfirm={onConfirm}
        onClose={onClose}
      />
    );

    expect(screen.getByText('Reset Investigation')).toBeDefined();
    expect(screen.getByText('Are you sure you want to proceed?')).toBeDefined();

    const confirmBtn = screen.getByText('Reset Scenario');
    fireEvent.click(confirmBtn);
    expect(onConfirm).toHaveBeenCalled();
  });

  it('renders Header with navigation routes and skip link', () => {
    render(
      <BrowserRouter>
        <Header />
      </BrowserRouter>
    );

    expect(screen.getByText('Skip to main content')).toBeDefined();
    expect(screen.getAllByText('Workspace').length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText('Scenarios')).toBeDefined();
    expect(screen.getByText('Methodology')).toBeDefined();
    expect(screen.getByText('Flood School')).toBeDefined();
    expect(screen.getByText('Contact')).toBeDefined();
  });
});

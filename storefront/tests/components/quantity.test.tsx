import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Quantity } from '@/components/quantity';

describe('Quantity', () => {
  it('prevents decrementing below one', async () => {
    const user = userEvent.setup();
    const setQuantity = vi.fn();

    render(<Quantity quantity={1} setQuantity={setQuantity} />);

    const [decrement] = screen.getAllByRole('button');

    expect(decrement).toBeDisabled();
    await user.click(decrement);
    expect(setQuantity).not.toHaveBeenCalled();
  });

  it('increments quantity', async () => {
    const user = userEvent.setup();
    const setQuantity = vi.fn();

    render(<Quantity quantity={1} setQuantity={setQuantity} />);

    const [, increment] = screen.getAllByRole('button');

    await user.click(increment);
    expect(setQuantity).toHaveBeenCalledWith(2);
  });

  it('respects maxQuantity', async () => {
    const user = userEvent.setup();
    const setQuantity = vi.fn();

    render(<Quantity quantity={3} maxQuantity={3} setQuantity={setQuantity} />);

    const [, increment] = screen.getAllByRole('button');

    expect(increment).toBeDisabled();
    await user.click(increment);
    expect(setQuantity).not.toHaveBeenCalled();
  });
});

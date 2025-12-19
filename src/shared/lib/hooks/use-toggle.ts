/**
 * useToggle - Boolean State Management Hook
 *
 * Simplified boolean state với toggle, setTrue, setFalse helpers.
 * Giảm boilerplate cho modal dialogs, dropdowns, etc.
 *
 * @example
 * ```tsx
 * const [isOpen, { toggle, setTrue: open, setFalse: close }] = useToggle(false);
 *
 * <button onClick={toggle}>Toggle</button>
 * <button onClick={open}>Open</button>
 * <button onClick={close}>Close</button>
 * ```
 */

import { useState, useCallback, useMemo } from "react";

interface ToggleActions {
  toggle: () => void;
  setTrue: () => void;
  setFalse: () => void;
  setValue: (value: boolean) => void;
}

export function useToggle(
  initialValue = false
): [boolean, ToggleActions] {
  const [value, setValue] = useState(initialValue);

  const toggle = useCallback(() => setValue((v) => !v), []);
  const setTrue = useCallback(() => setValue(true), []);
  const setFalse = useCallback(() => setValue(false), []);

  const actions = useMemo(
    () => ({ toggle, setTrue, setFalse, setValue }),
    [toggle, setTrue, setFalse]
  );

  return [value, actions];
}

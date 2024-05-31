import { useEffect, useState } from 'react';

export const debounce = <T>(v: T, delayMs: number) => {
  const [value, setValue] = useState<T>(v);

  useEffect(() => {
    const timeout = setTimeout(() => setValue(v), delayMs);
    return () => clearTimeout(timeout);
  }, [v, delayMs]);

  return value;
};

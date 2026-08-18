type AnyFunction = (...args: never[]) => void;

type DebouncedFunction<T extends AnyFunction> = ((
  ...args: Parameters<T>
) => void) & {
  cancel: () => void;
};

export const debounce = <T extends AnyFunction>(
  callback: T,
  delay: number,
): DebouncedFunction<T> => {
  let timeoutId: ReturnType<typeof setTimeout> | undefined;

  const debounced = ((...args: Parameters<T>) => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    timeoutId = setTimeout(() => {
      callback(...args);
    }, delay);
  }) as DebouncedFunction<T>;

  debounced.cancel = () => {
    if (timeoutId) {
      clearTimeout(timeoutId);
      timeoutId = undefined;
    }
  };

  return debounced;
};

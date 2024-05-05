export function debounce(func: (...args: unknown[]) => unknown, wait = 1000) {
  let timer: number = 0;

  return function (this: any, ...args: unknown[]) {
    clearTimeout(timer);
    timer = window.setTimeout(() => {
      func.apply(this, args);
    }, wait);
  };
}

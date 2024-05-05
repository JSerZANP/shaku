export function filterNonNull<T>(arr: Array<T>): Array<NonNullable<T>> {
  return arr.filter((item): item is NonNullable<T> => Boolean(item));
}

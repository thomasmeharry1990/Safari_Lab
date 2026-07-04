/**
 * Safari Lab - array reordering helper (Package 8 follow-up).
 * Pure: moves the item at `index` one slot in `dir` (-1 up, +1 down). Out-of-range
 * moves are a no-op and return the original array reference.
 */
export function moveItem<T>(list: T[], index: number, dir: -1 | 1): T[] {
  const target = index + dir;
  if (index < 0 || index >= list.length || target < 0 || target >= list.length) {
    return list;
  }
  const next = [...list];
  const [moved] = next.splice(index, 1);
  next.splice(target, 0, moved as T);
  return next;
}

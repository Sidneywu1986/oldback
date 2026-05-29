import { useState, useCallback, useRef } from 'react';

interface UseBatchSelectOptions<T> {
  items: T[];
  idKey?: keyof T;
  pageSize?: number;
}

export function useBatchSelect<T extends Record<string, any>>({
  items,
  idKey = 'id' as keyof T,
}: UseBatchSelectOptions<T>) {
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const lastClickedIndex = useRef<number | null>(null);

  const isAllSelected =
    items.length > 0 && items.every((item) => selectedIds.has(Number(item[idKey])));

  const isIndeterminate =
    selectedIds.size > 0 && !isAllSelected;

  const toggleItem = useCallback(
    (id: number, index: number, shiftKey: boolean) => {
      setSelectedIds((prev) => {
        const next = new Set(prev);

        if (shiftKey && lastClickedIndex.current !== null) {
          const start = Math.min(lastClickedIndex.current, index);
          const end = Math.max(lastClickedIndex.current, index);
          const isSelecting = !next.has(id);

          for (let i = start; i <= end; i++) {
            const itemId = Number(items[i]?.[idKey]);
            if (itemId !== undefined) {
              if (isSelecting) {
                next.add(itemId);
              } else {
                next.delete(itemId);
              }
            }
          }
        } else {
          if (next.has(id)) {
            next.delete(id);
          } else {
            next.add(id);
          }
        }

        lastClickedIndex.current = index;
        return next;
      });
    },
    [items, idKey]
  );

  const toggleAll = useCallback(() => {
    setSelectedIds((prev) => {
      if (prev.size === items.length) {
        lastClickedIndex.current = null;
        return new Set();
      }
      const next = new Set<number>();
      items.forEach((item) => {
        next.add(Number(item[idKey]));
      });
      return next;
    });
  }, [items, idKey]);

  const clearSelection = useCallback(() => {
    setSelectedIds(new Set());
    lastClickedIndex.current = null;
  }, []);

  return {
    selectedIds,
    isAllSelected,
    isIndeterminate,
    toggleItem,
    toggleAll,
    clearSelection,
    selectedCount: selectedIds.size,
  };
}

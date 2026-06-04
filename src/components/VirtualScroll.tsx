import { useRef, type ReactNode } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';

interface VirtualScrollProps<T> {
  items: T[];
  itemHeight: number;
  renderItem: (item: T, index: number) => ReactNode;
  className?: string;
  dynamicHeight?: boolean;
}

export function VirtualScroll<T>({
  items,
  itemHeight,
  renderItem,
  className = '',
  dynamicHeight = false,
}: VirtualScrollProps<T>) {
  const parentRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<Map<number, HTMLDivElement>>(new Map());

  const rowVirtualizer = useVirtualizer({
    count: items.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => itemHeight,
    measureElement: dynamicHeight
      ? (element: Element) => {
          return element.getBoundingClientRect().height || itemHeight;
        }
      : undefined,
  });

  if (items.length === 0) {
    return (
      <div ref={parentRef} className={`overflow-y-auto ${className}`}>
        <div className="flex items-center justify-center h-full text-muted-foreground">
          暂无内容
        </div>
      </div>
    );
  }

  return (
    <div
      ref={parentRef}
      className={`relative overflow-y-auto ${className}`}
      style={{
        height: '100%',
      }}
    >
      <div
        className="relative"
        style={{
          height: `${rowVirtualizer.getTotalSize()}px`,
          width: '100%',
        }}
      >
        {rowVirtualizer.getVirtualItems().map((virtualItem) => (
          <div
            key={virtualItem.index}
            ref={(el) => {
              if (el) {
                itemRefs.current.set(virtualItem.index, el);
              }
            }}
            className="absolute left-0 right-0"
            style={{
              top: `${virtualItem.start}px`,
              height: `${virtualItem.size}px`,
            }}
          >
            {renderItem(items[virtualItem.index], virtualItem.index)}
          </div>
        ))}
      </div>
    </div>
  );
}
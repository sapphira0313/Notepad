import { render, screen, fireEvent } from '@testing-library/react';
import { VirtualScroll } from './VirtualScroll';

describe('VirtualScroll', () => {
  const items = Array.from({ length: 100 }, (_, i) => `Item ${i}`);

  it('should render visible items', () => {
    render(
      <div style={{ height: '200px' }}>
        <VirtualScroll<string>
          items={items}
          itemHeight={40}
          renderItem={(item) => <div key={item} data-testid={`item-${item}`}>{item}</div>}
        />
      </div>
    );

    const renderedItems = screen.getAllByTestId(/item-/);
    expect(renderedItems.length).toBeLessThan(10);
  });

  it('should render empty state when no items', () => {
    render(
      <div style={{ height: '200px' }}>
        <VirtualScroll<string>
          items={[]}
          itemHeight={40}
          renderItem={(item) => <div key={item}>{item}</div>}
        />
      </div>
    );

    expect(screen.getByText('暂无内容')).toBeInTheDocument();
  });

  it('should render all items when content fits in viewport', () => {
    const smallItems = Array.from({ length: 3 }, (_, i) => `Item ${i}`);
    
    render(
      <div style={{ height: '200px' }}>
        <VirtualScroll<string>
          items={smallItems}
          itemHeight={40}
          renderItem={(item) => <div key={item} data-testid={`item-${item}`}>{item}</div>}
        />
      </div>
    );

    const renderedItems = screen.getAllByTestId(/item-/);
    expect(renderedItems.length).toBe(3);
  });
});
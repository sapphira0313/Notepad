/**
 * 全局骨架屏加载组件
 * 在工作区数据加载完成前显示
 */
export function SkeletonLoader() {
  return (
    <div className="flex h-screen bg-background">
      {/* 骨架侧栏 */}
      <div className="w-72 bg-sidebar/95 border-r border-border/60 p-4 space-y-3 max-md:hidden">
        <div className="h-10 rounded-xl animate-shimmer bg-muted" />
        <div className="h-10 rounded-xl animate-shimmer bg-muted" />
        <div className="space-y-2 mt-6">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="h-9 rounded-xl animate-shimmer bg-muted"
              style={{ animationDelay: `${i * 80}ms` }}
            />
          ))}
        </div>
      </div>

      {/* 骨架内容区 */}
      <div className="flex-1 flex flex-col">
        <div className="h-14 border-b border-border/60 flex items-center px-4 gap-4">
          <div className="h-8 w-8 rounded-xl animate-shimmer bg-muted" />
          <div className="h-5 w-32 rounded-lg animate-shimmer bg-muted" />
        </div>
        <div className="flex-1 max-w-3xl mx-auto px-8 py-8 w-full">
          <div className="h-8 w-64 rounded-lg animate-shimmer bg-muted mb-6" />
          <div className="space-y-3">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="h-4 rounded animate-shimmer bg-muted"
                style={{
                  width: `${70 + Math.random() * 30}%`,
                  animationDelay: `${i * 60}ms`,
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

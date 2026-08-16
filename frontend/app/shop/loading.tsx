export default function ShopLoading() {
  const placeholders = Array.from({ length: 8 });
  const sidebarPlaceholders = Array.from({ length: 6 });

  return (
    <div className="pt-12 md:pt-16 pb-24 px-6 max-w-screen-2xl mx-auto w-full">
      <div className="mb-10">
        <div className="h-9 w-72 max-w-full bg-hover rounded-[var(--radius-sm)] animate-pulse mb-3" />
        <div className="h-4 w-48 bg-hover rounded-[var(--radius-sm)] animate-pulse" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-10">
        <div className="hidden lg:flex flex-col gap-3">
          {sidebarPlaceholders.map((_, i) => (
            <div key={i} className="h-3 w-24 bg-hover rounded-[var(--radius-sm)] animate-pulse" />
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
          {placeholders.map((_, i) => (
            <div key={i}>
              <div className="aspect-square bg-surface border border-hairline mb-4 animate-pulse" />
              <div className="h-2.5 w-16 bg-hover rounded-[var(--radius-sm)] animate-pulse mb-2" />
              <div className="h-4 w-3/4 bg-hover-strong rounded-[var(--radius-sm)] animate-pulse mb-2" />
              <div className="h-4 w-20 bg-hover rounded-[var(--radius-sm)] animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

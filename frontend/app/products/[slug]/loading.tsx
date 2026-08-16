export default function ProductDetailLoading() {
  return (
    <div className="pt-12 md:pt-16 pb-24 px-6 max-w-screen-2xl mx-auto w-full">
      <div className="h-4 w-32 bg-hover rounded-[var(--radius-sm)] animate-pulse mb-10" />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div className="aspect-square bg-surface border border-hairline animate-pulse" />

        <div className="flex flex-col justify-center gap-4">
          <div className="h-2.5 w-24 bg-hover rounded-[var(--radius-sm)] animate-pulse" />
          <div className="h-9 w-3/4 bg-hover-strong rounded-[var(--radius-sm)] animate-pulse" />
          <div className="h-7 w-32 bg-hover rounded-[var(--radius-sm)] animate-pulse" />
          <div className="h-4 w-full bg-hover rounded-[var(--radius-sm)] animate-pulse mt-4" />
          <div className="h-4 w-5/6 bg-hover rounded-[var(--radius-sm)] animate-pulse" />
          <div className="h-4 w-2/3 bg-hover rounded-[var(--radius-sm)] animate-pulse mb-6" />
          <div className="h-14 w-48 bg-hover-strong rounded-[var(--radius-sm)] animate-pulse" />
        </div>
      </div>
    </div>
  );
}

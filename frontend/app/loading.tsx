import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center gap-4 px-6 text-center">
      <Loader2 className="w-8 h-8 text-red-500 animate-spin" />
      <span className="text-xs font-bold text-ink-subtle uppercase tracking-widest">
        Loading
      </span>
    </div>
  );
}

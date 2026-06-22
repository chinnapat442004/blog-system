import { Spinner } from '@/components/ui/spinner';

export default function Loading() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm">
      <Spinner className="size-12 text-slate-700" />
    </div>
  );
}

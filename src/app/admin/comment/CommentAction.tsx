'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { updateCommentStatus } from './action';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';

interface Props {
  id: number;
  status: string;
}

export default function CommentAction({ id, status }: Props) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStatus, setLoadingStatus] = useState<
    'APPROVED' | 'REJECTED' | null
  >(null);
  const isApproved = status === 'APPROVED';
  const isRejected = status === 'REJECTED';

  const handleStatusChange = async (newStatus: 'APPROVED' | 'REJECTED') => {
    setIsLoading(true);
    setLoadingStatus(newStatus);
    try {
      await updateCommentStatus(id, newStatus);
      router.refresh();
    } finally {
      setIsLoading(false);
      setLoadingStatus(null);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Button
        size="sm"
        onClick={() => handleStatusChange('APPROVED')}
        disabled={isApproved || isLoading}
        className={`transition-all ${
          isApproved
            ? 'bg-green-100 text-green-700 cursor-not-allowed'
            : 'bg-green-600 hover:bg-green-700 text-white'
        }`}
      >
        {isLoading && loadingStatus === 'APPROVED' ? (
          <span className="inline-flex items-center gap-2">
            <Spinner className="size-4" />
            กำลังประมวลผล
          </span>
        ) : (
          'Approve'
        )}
      </Button>

      <Button
        size="sm"
        onClick={() => handleStatusChange('REJECTED')}
        disabled={isRejected || isLoading}
        className={`transition-all ${
          isRejected
            ? 'bg-red-100 text-red-700 cursor-not-allowed'
            : 'bg-red-400 hover:bg-red-500 text-white'
        }`}
      >
        {isLoading && loadingStatus === 'REJECTED' ? (
          <span className="inline-flex items-center gap-2">
            <Spinner className="size-4" />
            กำลังประมวลผล
          </span>
        ) : (
          'Reject'
        )}
      </Button>
    </div>
  );
}

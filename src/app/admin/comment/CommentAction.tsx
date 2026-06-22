'use client';

import { updateCommentStatus } from './action';
import { Button } from '@/components/ui/button';

interface Props {
  id: number;
  status: string;
}

export default function CommentAction({ id, status }: Props) {
  const isApproved = status === 'APPROVED';
  const isRejected = status === 'REJECTED';

  return (
    <div className="flex items-center gap-2">
      <Button
        size="sm"
        onClick={async () => {
          await updateCommentStatus(id, 'APPROVED');
        }}
        disabled={isApproved}
        className={`transition-all ${
          isApproved
            ? 'bg-green-100 text-green-700 cursor-not-allowed'
            : 'bg-green-600 hover:bg-green-700 text-white'
        }`}
      >
        Approve
      </Button>

      <Button
        size="sm"
        onClick={async () => {
          await updateCommentStatus(id, 'REJECTED');
        }}
        disabled={isRejected}
        className={`transition-all ${
          isRejected
            ? 'bg-red-100 text-red-700 cursor-not-allowed'
            : 'bg-red-400 hover:bg-red-500 text-white'
        }`}
      >
        Reject
      </Button>
    </div>
  );
}

'use server';
import { prisma } from 'prisma';

import { revalidatePath } from 'next/cache';

export async function getComments() {
  const result = await prisma.comment.findMany({
    orderBy: {
      createdAt: 'desc',
    },
    include: {
      blog: true,
    },
  });

  return result;
}

export async function updateCommentStatus(
  id: number,
  status: 'APPROVED' | 'REJECTED',
) {
  await prisma.comment.update({
    where: {
      id,
    },
    data: {
      status,
    },
  });

  revalidatePath('/admin/comment');
}

'use server';

import { CommentStatus } from '@prisma/client';
import { revalidatePath } from 'next/cache';
import { prisma } from 'prisma';

export async function createComment(formData: FormData) {
  const senderName = (formData.get('senderName') as string | null) ?? '';
  const message = (formData.get('message') as string | null) ?? '';
  const blogId = Number(formData.get('blogId'));
  const slug = (formData.get('slug') as string | null) ?? '';

  if (!senderName.trim()) {
    throw new Error('กรุณากรอกชื่อผู้ส่ง');
  }

  if (!message.trim()) {
    throw new Error('กรุณาใส่ข้อความความคิดเห็น');
  }

  const thaiNumberOnly = /^[\u0E00-\u0E7F0-9\s]+$/;

  if (!thaiNumberOnly.test(message.trim())) {
    throw new Error('ความคิดเห็นต้องเป็นภาษาไทยและตัวเลขเท่านั้น');
  }

  if (!Number.isFinite(blogId) || blogId <= 0) {
    throw new Error('ข้อมูลบทความไม่ถูกต้อง');
  }

  await prisma.comment.create({
    data: {
      senderName: senderName.trim(),
      message: message.trim(),
      blogId,
      status: CommentStatus.PENDING,
    },
  });

  revalidatePath(`/blogs/${slug}`);
}

import { PrismaClient } from '@prisma/client';

import { Prisma } from '@prisma/client';
const prisma = new PrismaClient();

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const search = searchParams.get('search') ?? '';
  const page = Number(searchParams.get('page')) || 1;
  const limit = 10;

  const where: Prisma.BlogWhereInput = {
    ...{
      is_published: true,
    },

    ...(search && {
      title: {
        contains: search,
        mode: 'insensitive',
      },
    }),
  };

  const blogs = await prisma.blog.findMany({
    where,
    skip: (page - 1) * limit,
    take: limit,
    orderBy: {
      created_at: 'desc',
    },
  });

  const totalBlogs = await prisma.blog.count({
    where,
  });

  const totalPages = Math.ceil(totalBlogs / limit);

  return Response.json({
    data: blogs,
    pagination: {
      page,
      limit,
      total: totalBlogs,
      totalPages,
    },
  });
}

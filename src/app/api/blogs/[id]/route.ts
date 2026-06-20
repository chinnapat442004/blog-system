import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface Params {
  params: Promise<{
    id: string;
  }>;
}

export async function GET(request: Request, { params }: Params) {
  try {
    const { id } = await params;

    const blog = await prisma.blog.findUnique({
      where: {
        id: Number(id),
      },
      include: {
        images: true,
      },
    });

    if (!blog) {
      return Response.json({ message: 'Blog not found' }, { status: 404 });
    }

    return Response.json({
      success: true,
      data: blog,
    });
  } catch (error) {
    console.error(error);

    return Response.json({ message: 'Get blog failed' }, { status: 500 });
  }
}

import { prisma } from 'prisma';

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    const body = await request.json();

    const updated = await prisma.blog.update({
      where: {
        id: Number(id),
      },
      data: {
        is_published: Boolean(body.is_published),
      },
    });

    return Response.json({
      success: true,
      data: updated,
    });
  } catch (error) {
    console.error(error);
    return Response.json({ message: 'Update publish failed' }, { status: 500 });
  }
}

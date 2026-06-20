import { PrismaClient } from '@prisma/client';
import cloudinary from '@/lib/cloudinary';

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

export async function PATCH(request: Request, { params }: Params) {
  try {
    const { id } = await params;

    const blog = await prisma.blog.findUnique({
      where: {
        id: Number(id),
      },
    });

    if (!blog) {
      return Response.json({ message: 'Blog not found' }, { status: 404 });
    }

    const formData = await request.formData();

    const file = formData.get('cover_image') as File | null;
    const title = formData.get('title') as string;
    const content = formData.get('content') as string;
    const excerpt = formData.get('excerpt') as string;
    const slug = formData.get('slug') as string;

    let coverImage = blog.cover_image;

    if (file && file.size > 0) {
      // แปลงไฟล์ที่อัปโหลดเป็น ArrayBuffer
      const bytes = await file.arrayBuffer();

      // แปลง ArrayBuffer เป็น Node.js Buffer เพื่อเตรียมเข้ารหัส Base64
      const buffer = Buffer.from(bytes);

      // สร้าง Data URI ในรูปแบบ Base64 สำหรับส่งไปยัง Cloudinary
      const base64 = `data:${file.type};base64,${buffer.toString('base64')}`;

      const result = await cloudinary.uploader.upload(base64, {
        folder: 'blogs',
        format: 'webp',
      });

      coverImage = result.secure_url;
    }

    const updatedBlog = await prisma.blog.update({
      where: {
        id: Number(id),
      },
      data: {
        title,
        content,
        excerpt,
        slug,
        cover_image: coverImage,
      },
    });

    return Response.json({
      success: true,
      data: updatedBlog,
    });
  } catch (error) {
    console.error(error);
    return Response.json({ message: 'Update failed' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: Params) {
  try {
    const { id } = await params;

    const blog = await prisma.blog.findUnique({
      where: {
        id: Number(id),
      },
    });

    if (!blog) {
      return Response.json({ message: 'Blog not found' }, { status: 404 });
    }

    await prisma.blog.delete({
      where: {
        id: Number(id),
      },
    });

    return Response.json({
      success: true,
      message: 'Blog deleted successfully',
    });
  } catch (error) {
    console.error(error);
    return Response.json({ message: 'Delete failed' }, { status: 500 });
  }
}

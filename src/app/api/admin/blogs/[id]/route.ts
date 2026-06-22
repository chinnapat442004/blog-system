import { PrismaClient } from '@prisma/client';
import cloudinary from '@/lib/cloudinary';

const prisma = new PrismaClient();

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
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

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
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

    const slugValue = slug?.trim().toLowerCase();
    const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

    if (!slugValue) {
      return Response.json({ message: 'กรุณากรอก URL Slug' }, { status: 400 });
    }

    if (!slugRegex.test(slugValue)) {
      return Response.json(
        {
          message:
            'URL Slug ต้องเป็นตัวอักษรภาษาอังกฤษ ตัวเลข และขีดกลางเท่านั้น',
        },
        { status: 400 },
      );
    }

    const existingSlug = await prisma.blog.findFirst({
      where: {
        slug: slugValue,
        NOT: {
          id: Number(id),
        },
      },
    });

    if (existingSlug) {
      return Response.json(
        { message: 'URL Slug นี้มีอยู่แล้ว กรุณาเปลี่ยนเป็นค่าอื่น' },
        { status: 409 },
      );
    }

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

    const isPublished = formData.get('is_published') === 'true';
    const keptImageIds = formData.get('keptImageIds') as string | null;

    // ถ้ามี keptImageIds ให้ลบรูปอื่น ๆ ที่ไม่อยู่ในรายการ
    if (keptImageIds !== null) {
      const keptIds = keptImageIds
        .split(',')
        .filter((s) => s)
        .map((s) => Number(s));

      if (keptIds.length > 0) {
        await prisma.image.deleteMany({
          where: {
            blogId: Number(id),
            NOT: {
              id: {
                in: keptIds,
              },
            },
          },
        });
      } else {
        // ถ้าไม่มี keptIds ให้ลบรูปทั้งหมดของบทความนี้
        await prisma.image.deleteMany({
          where: { blogId: Number(id) },
        });
      }
    }

    // อัปโหลดรูปใหม่ (ถ้ามี)
    const imageFiles = formData.getAll('images') as File[];
    const newImageUrls: string[] = [];

    for (const imageFile of imageFiles) {
      const file = imageFile as File;
      if (file && file.size > 0) {
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        const base64 = `data:${file.type};base64,${buffer.toString('base64')}`;

        const result = await cloudinary.uploader.upload(base64, {
          folder: 'blogs',
          format: 'webp',
        });
        newImageUrls.push(result.secure_url);
      }
    }

    const updatedBlog = await prisma.blog.update({
      where: {
        id: Number(id),
      },
      data: {
        title,
        content,
        excerpt,
        slug: slugValue,
        cover_image: coverImage,
        is_published: isPublished,
        published_at:
          isPublished && !blog.published_at ? new Date() : blog.published_at,
        images: {
          create: newImageUrls.map((imageUrl) => ({ imageUrl })),
        },
      },
      include: {
        images: true,
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

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
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

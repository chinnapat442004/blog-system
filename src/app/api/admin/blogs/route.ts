import { PrismaClient } from '@prisma/client';
import cloudinary from '@/lib/cloudinary';

import { Prisma } from '@prisma/client';
const prisma = new PrismaClient();

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const search = searchParams.get('search') ?? '';
  const page = Number(searchParams.get('page')) || 1;
  const limit = 10;

  const where: Prisma.BlogWhereInput = {
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

export async function POST(request: Request) {
  try {
    const formData = await request.formData();

    const coverImage = formData.get('cover_image') as File | null;
    const images = formData.getAll('images') as File[];
    const title = formData.get('title') as string;
    const content = formData.get('content') as string;
    const excerpt = formData.get('excerpt') as string;
    const slug = formData.get('slug') as string;
    const isPublished = formData.get('is_published') === 'true';

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

    const existingSlug = await prisma.blog.findUnique({
      where: {
        slug: slugValue,
      },
    });

    if (existingSlug) {
      return Response.json(
        { message: 'URL Slug นี้มีอยู่แล้ว กรุณาเปลี่ยนเป็นค่าอื่น' },
        { status: 409 },
      );
    }

    if (!(coverImage instanceof File)) {
      return Response.json(
        { message: 'Cover image not found' },
        { status: 400 },
      );
    }

    if (images.length > 6) {
      return Response.json(
        {
          message: 'You can upload a maximum of 6 images',
        },
        {
          status: 400,
        },
      );
    }

    // แปลงไฟล์ที่อัปโหลดเป็น ArrayBuffer
    const bytes = await coverImage.arrayBuffer();

    // แปลง ArrayBuffer เป็น Node.js Buffer เพื่อเตรียมเข้ารหัส Base64
    const buffer = Buffer.from(bytes);

    // สร้าง Data URI ในรูปแบบ Base64 สำหรับส่งไปยัง Cloudinary
    const base64 = `data:${coverImage.type};base64,${buffer.toString(
      'base64',
    )}`;

    const result = await cloudinary.uploader.upload(base64, {
      folder: 'blogs',
      format: 'webp',
    });

    const imageUrls = await Promise.all(
      images.map(async (image) => {
        // แปลงไฟล์ที่อัปโหลดเป็น ArrayBuffer
        const bytes = await image.arrayBuffer();

        // แปลง ArrayBuffer เป็น Node.js Buffer เพื่อเตรียมเข้ารหัส Base64
        const buffer = Buffer.from(bytes);
        // สร้าง Data URI ในรูปแบบ Base64 สำหรับส่งไปยัง Cloudinary
        const base64 = `data:${image.type};base64,${buffer.toString('base64')}`;

        const result = await cloudinary.uploader.upload(base64, {
          folder: 'blogs',
          format: 'webp',
        });
        return result.secure_url;
      }),
    );

    const blog = await prisma.blog.create({
      data: {
        title,
        content,
        cover_image: result.secure_url,
        excerpt,
        is_published: isPublished,
        published_at: isPublished ? new Date() : null,
        slug: slugValue,
        images: {
          create: imageUrls.map((image) => ({
            imageUrl: image,
          })),
        },
      },
      include: {
        images: true,
      },
    });

    return Response.json({
      success: true,
      data: blog,
    });
  } catch (error) {
    console.error(error);
    return Response.json({ message: 'Upload failed' }, { status: 500 });
  }
}

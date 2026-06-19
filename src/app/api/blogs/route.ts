import { PrismaClient } from '@prisma/client';
import cloudinary from '@/src/lib/cloudinary';

const prisma = new PrismaClient();

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const page = Number(searchParams.get('page')) || 1;
  const limit = 10;

  const blogs = await prisma.blog.findMany({
    skip: (page - 1) * limit,
    take: limit,
    orderBy: {
      created_at: 'desc',
    },
  });

  const totalBlogs = await prisma.blog.count();
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

    const file = formData.get('file') as File;
    const title = formData.get('title') as string;
    const content = formData.get('content') as string;
    const excerpt = formData.get('excerpt') as string;
    const slug = formData.get('slug') as string;

    if (!(file instanceof File)) {
      return Response.json({ message: 'File not found' }, { status: 400 });
    }

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

    const blog = await prisma.blog.create({
      data: {
        title,
        content,
        cover_image: result.secure_url,
        excerpt,
        slug,
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

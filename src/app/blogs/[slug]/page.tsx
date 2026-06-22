import { prisma } from 'prisma';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import CommentForm from './CommentForm';
import { Suspense } from 'react';

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function BlogDetailPage({ params }: Props) {
  const { slug } = await params;

  let blog;

  try {
    blog = await prisma.blog.update({
      where: {
        slug,
      },
      data: {
        view_count: {
          increment: 1,
        },
      },
      include: {
        images: true,
        comments: {
          where: {
            status: 'APPROVED',
          },
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
    });
  } catch {
    notFound();
  }

  return (
    <main className=" py-8  ">
      <article className="max-w-5xl mx-auto px-4 py-8">
        <header className="mb-10">
          <h1 className="text-4xl md:text-5xl font-bold leading-tight">
            {blog?.title}
          </h1>

          <div className="mt-4 flex flex-wrap items-center  gap-3 text-sm text-muted-foreground">
            <span>
              {blog?.published_at
                ? new Date(blog.published_at).toLocaleDateString('th-TH', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })
                : blog?.created_at
                ? new Date(blog.created_at).toLocaleDateString('th-TH', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })
                : '-'}
            </span>

            <span>•</span>

            <span>{blog?.view_count} ครั้ง</span>
          </div>
        </header>
        <div className="mb-8 rounded-sm border bg-muted/30 p-5">
          <p className="text-muted-foreground leading-7">{blog?.excerpt}</p>
        </div>
        <div className="overflow-hidden rounded-sm   mb-10 border">
          <div className="relative w-full max-h-[450px] h-[450px]">
            <Image
              src={blog?.cover_image}
              alt={blog?.title}
              fill
              className="object-cover"
            />
          </div>
        </div>

        <div className="prose prose-gray max-w-none whitespace-pre-line">
          {blog?.content}
        </div>

        {(blog?.images?.length ?? 0) > 0 && (
          <section className="mt-14">
            <div className="mb-6">
              <h2 className="text-2xl font-bold">รูปภาพเพิ่มเติม</h2>
              <p className="text-sm text-muted-foreground mt-1">
                ภาพประกอบเพิ่มเติมจากบทความนี้
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {blog?.images.map((image) => (
                <div
                  key={image.id}
                  className="overflow-hidden rounded-md  p-0 transition hover:shadow-lg border"
                >
                  <div className="relative h-60 w-full">
                    <Image
                      src={image.imageUrl}
                      alt={blog.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </article>
      <section className="max-w-5xl mx-auto mt-14 border-t pt-10 flex justify-center ">
        <div className="w-full max-w-xl">
          <div className="rounded-sm border bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold mb-6 text-center">
              แสดงความคิดเห็น
            </h2>

            <CommentForm blogId={blog.id} slug={slug} />
          </div>
        </div>
      </section>
      <section className="mx-auto max-w-5xl px-4 py-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900">ความคิดเห็น</h2>
          <p className="text-sm text-gray-500">
            {blog.comments.length} ความคิดเห็น
          </p>
        </div>

        {blog.comments.length > 0 ? (
          <div className="space-y-4">
            {blog.comments.map((comment) => (
              <div
                key={comment.id}
                className="rounded-sm border border-gray-200 bg-white p-5 shadow-sm transition hover:shadow-md"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-600">
                      {comment.senderName.charAt(0).toUpperCase()}
                    </div>

                    <div>
                      <p className="font-semibold text-gray-900">
                        {comment.senderName}
                      </p>
                      <p className="text-xs text-gray-400">
                        ผู้แสดงความคิดเห็น
                      </p>
                    </div>
                  </div>

                  <p className="text-xs text-gray-400">
                    {new Date(comment.createdAt).toLocaleString('th-TH', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
                <div className="mt-4 ">
                  <p className="leading-7 text-gray-700">{comment.message}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="  border-gray-300  py-12 text-center">
            <p className=" font-medium text-gray-500">ยังไม่มีความคิดเห็น</p>
          </div>
        )}
      </section>
    </main>
  );
}

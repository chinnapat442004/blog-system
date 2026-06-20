import { Card } from '@/components/ui/card';
import { prisma } from 'prisma';
import { notFound } from 'next/navigation';

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function BlogDetailPage({ params }: Props) {
  const { slug } = await params;

  const blog = await prisma.blog.findUnique({
    where: { slug },
    include: {
      images: true,
    },
  });
  if (!blog) {
    notFound();
  }

  return (
    <main className="max-w-5xl mx-auto px-4 py-8">
      <article>
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
          <img
            src={blog?.cover_image}
            alt={blog?.title}
            className="w-full max-h-[450px] object-cover "
          />
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
                  <img
                    src={image.imageUrl}
                    alt={blog.title}
                    className="block h-60 w-full object-cover"
                  />
                </div>
              ))}
            </div>
          </section>
        )}
      </article>
    </main>
  );
}

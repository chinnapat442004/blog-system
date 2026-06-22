'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { Blog, Pagination } from '@/types/blog';

import { Eye, Search } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';
import { Spinner } from '@/components/ui/spinner';

export default function Page() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [pagination, setPagenation] = useState<Pagination>();
  const [inputValue, setInputValue] = useState('');
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get('/api/blogs', {
          params: { page, search },
        });
        setBlogs(response.data.data);
        setPagenation(response.data.pagination);
      } catch (error) {
        console.error('Failed to fetch blogs', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBlogs();
  }, [page, search]);
  const previousPage = () => {
    setPage((p) => Math.max(p - 1, 1));
  };

  const nextPage = () => {
    setPage((p) => p + 1);
  };

  return (
    <>
      <main className="p-4 ">
        <div className="p-5 flex items-center justify-between gap-3 my-3">
          <h1 className="text-xl font-semibold">Blog</h1>

          <div className="flex items-center gap-3">
            <div className="relative">
              <input
                type="text"
                placeholder="ค้นหา blog..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className="w-[200px] md:w-[300px] border rounded-md px-3 py-1.5 text-sm outline-none focus:ring-2 focus:ring-gray-300"
              />
            </div>

            <Button
              variant="outline"
              onClick={() => {
                setSearch(inputValue);
                setPage(1);
              }}
              className="gap-2 bg-[#1E293B] text-white hover:bg-[#0f172a] hover:text-white transition"
            >
              <Search className="h-4 w-4" />
              ค้นหา
            </Button>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {blogs.map((blog) => (
            <Link key={blog.id} href={`/blogs/${blog.slug}`}>
              <Card
                key={blog.id}
                className="overflow-hidden cursor-pointer transition duration-200 hover:shadow-md hover:-translate-y-1 p-0"
              >
                <div className="relative h-40 w-full">
                  <Image
                    src={blog.cover_image}
                    alt={blog.title}
                    fill
                    className="object-cover"
                  />
                </div>

                <div className="p-4 space-y-2">
                  <h2 className="font-bold text-lg line-clamp-1">
                    {blog.title}
                  </h2>

                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {blog.excerpt}
                  </p>

                  <div className="flex justify-between items-center pt-2">
                    <span className="text-xs text-gray-500">
                      {blog.published_at
                        ? new Date(blog.published_at).toLocaleDateString(
                            'th-TH',
                            {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                            },
                          )
                        : '-'}
                    </span>
                    <span className="text-xs text-gray-500 flex items-center gap-1">
                      <Eye className="w-3.5 h-3.5" />
                      {blog.view_count}
                    </span>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>

        <div className="flex items-center justify-center gap-3 mt-6">
          <button
            onClick={previousPage}
            disabled={page === 1}
            className="px-3 py-1 text-sm border rounded-md disabled:opacity-50"
          >
            Previous
          </button>

          <div className="text-sm">
            {pagination?.page} / {pagination?.totalPages}
          </div>

          <button
            onClick={nextPage}
            disabled={page === pagination?.totalPages}
            className="px-3 py-1 text-sm border rounded-md disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </main>

      {isLoading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <Spinner className="size-12 text-[#1E293B]" />
        </div>
      )}
    </>
  );
}

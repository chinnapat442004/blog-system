'use client';

import { PageHeader } from '@/components/common/PageHeader';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { Blog, Pagination } from '@/types/blog';

import { Switch } from '@/components/ui/switch';
import { Edit, Search, Trash2, Plus } from 'lucide-react';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import Image from 'next/image';
import { Spinner } from '@/components/ui/spinner';

export default function Admin() {
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [pagination, setPagenation] = useState<Pagination>();
  const [inputValue, setInputValue] = useState('');
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [id, setId] = useState(0);

  useEffect(() => {
    const fetchBlogs = async () => {
      setIsLoading(true);

      try {
        const response = await axios.get('/api/admin/blogs', {
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

  const handleTogglePublish = async (
    blogId: number,
    currentStatus: boolean,
  ) => {
    setIsSubmitting(true);

    try {
      const response = await axios.patch(`/api/admin/blogs/${blogId}/publish`, {
        is_published: !currentStatus,
      });

      setBlogs((prev) =>
        prev.map((blog) =>
          blog.id === blogId
            ? { ...blog, is_published: response.data.data.is_published }
            : blog,
        ),
      );
    } catch (error) {
      console.error('Failed to toggle publish', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const deleteBlog = async () => {
    setIsSubmitting(true);

    try {
      await axios.delete(`/api/admin/blogs/${id}`);

      setBlogs((prev) => prev.filter((blog) => blog.id !== id));
      setId(0);
      setIsDeleteDialogOpen(false);
    } catch (error) {
      console.error('Failed to delete', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const openDeleteDialog = (id: number) => {
    setId(id);
    setIsDeleteDialogOpen(true);
  };

  return (
    <>
      <PageHeader title="จัดการ Blog">
        <Link href="/admin/create">
          <Button
            variant="outline"
            className="gap-2 bg-[#1E293B] text-white transition hover:bg-[#0f172a] hover:text-white"
          >
            <Plus className="h-4 w-4" />
            สร้างบทความใหม่
          </Button>
        </Link>
      </PageHeader>

      <main className="p-4  h-full bg-[#f8fafc]">
        <div className="w-full  ">
          <Card className="w-full max-w-full  p-2 border">
            <CardHeader>
              <CardTitle>
                <div className=" flex items-center justify-between gap-3 my-3">
                  <div className="text-xl font-bold "> รายการทั้งหมด</div>
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
              </CardTitle>
            </CardHeader>

            <CardContent className="p-0">
              <div className="w-full  overflow-x ">
                <Table className="min-w-[900px] ">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="font-bold">รูป</TableHead>
                      <TableHead className="font-bold">ชื่อเรื่อง</TableHead>
                      <TableHead className="font-bold">คำอธิบาย</TableHead>
                      <TableHead className="font-bold">URL Slug</TableHead>
                      <TableHead className="font-bold">Status</TableHead>
                      <TableHead className="text-right font-bold">
                        Action
                      </TableHead>
                    </TableRow>
                  </TableHeader>

                  <TableBody>
                    {blogs.map((blog) => (
                      <TableRow className="h-24" key={blog.id}>
                        <TableCell>
                          <Image
                            src={blog.cover_image}
                            alt={blog.title}
                            width={80}
                            height={80}
                            className="rounded-md object-cover"
                          />
                        </TableCell>

                        <TableCell className="font-medium whitespace-normal break-words max-w-[200px]">
                          {blog.title}
                        </TableCell>

                        <TableCell className="whitespace-normal break-words max-w-[400px]">
                          {blog.excerpt}
                        </TableCell>

                        <TableCell className="whitespace-normal break-words max-w-[200px]">
                          {blog.slug}
                        </TableCell>

                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Switch
                              checked={blog.is_published}
                              onCheckedChange={() =>
                                handleTogglePublish(blog.id, blog.is_published)
                              }
                            />
                            <span className="text-xs text-muted-foreground">
                              {blog.is_published ? 'Published' : 'Draft'}
                            </span>
                          </div>
                        </TableCell>

                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Link href={`/admin/edit/${blog.id}`}>
                              <button className="p-1 cursor-pointer hover:text-gray-600 transition">
                                <Edit className="h-4 w-4" />
                              </button>
                            </Link>

                            <button
                              onClick={() => {
                                openDeleteDialog(blog.id);
                              }}
                              className="p-1 cursor-pointer hover:text-red-600 transition"
                            >
                              <Trash2 className="h-4 w-4 text-red-600" />
                            </button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>

            <CardFooter className="flex items-center justify-between">
              <div></div>
              <div className="flex items-center gap-3">
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
            </CardFooter>
          </Card>
        </div>
      </main>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="max-w-md p-0 ">
          <DialogHeader className="px-6 py-4 ">
            <DialogTitle className="text-xl font-semibold ">
              ยืนยันการลบ
            </DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground px-6 ">
            คุณต้องการลบคำถามนี้หรือไม่? การดำเนินการนี้ไม่สามารถย้อนกลับได้
          </p>
          <div className="flex flex-col-reverse gap-2 px-6 py-4 sm:flex-row sm:justify-end">
            <Button
              className="w-full sm:w-18"
              variant="outline"
              onClick={() => {
                setIsDeleteDialogOpen(false);
                setId(0);
              }}
            >
              ยกเลิก
            </Button>
            <Button
              className="w-full sm:w-18 bg-red-400 text-white hover:bg-red-500 transition-colors"
              variant="default"
              onClick={deleteBlog}
            >
              ลบ
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {(isLoading || isSubmitting) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <Spinner className="size-12 text-[#1E293B]" />
        </div>
      )}
    </>
  );
}

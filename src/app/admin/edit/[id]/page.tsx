'use client';

import { PageHeader } from '@/components/common/PageHeader';
import { Button } from '@/components/ui/button';

import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Image as ImageIcon, Plus, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Spinner } from '@/components/ui/spinner';
import axios from 'axios';
import Image from 'next/image';

export default function AdminEdit() {
  type ImageState = {
    id?: number;
    file?: File;
    preview: string;
  };

  type BlogImage = {
    id: number;
    imageUrl: string;
  };
  const router = useRouter();

  const params = useParams();
  const id = params.id;

  const [loading, setLoading] = useState(false);

  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');

  const [coverImage, setCoverImage] = useState<ImageState | null>(null);

  const coverInputRef = useRef<HTMLInputElement>(null);
  const [images, setImages] = useState<
    {
      file: File;
      preview: string;
    }[]
  >([]);

  useEffect(() => {
    const fetchBlog = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`/api/admin/blogs/${id}`);

        const blog = res.data.data;

        setTitle(blog.title);
        setSlug(blog.slug);
        setExcerpt(blog.excerpt);
        setContent(blog.content);

        if (blog.cover_image) {
          setCoverImage({
            preview: blog.cover_image,
            id: blog.id,
          });
        }

        if (blog.images?.length) {
          setImages(
            blog.images.map((img: BlogImage) => ({
              preview: img.imageUrl,
              id: img.id,
            })),
          );
        }
      } catch (err) {
        console.error('fetch blog failed', err);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchBlog();
  }, [id]);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  const handleGalleryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);

    const newImages = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));

    setImages((prev) => [...prev, ...newImages].slice(0, 6));

    e.target.value = '';
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setCoverImage({
      file,
      preview: URL.createObjectURL(file),
    });

    e.target.value = '';
  };

  const removeCoverImage = () => {
    setCoverImage(null);
  };

  const handleSubmit = async (isPublished: boolean) => {
    try {
      setLoading(true);

      const formData = new FormData();

      formData.append('title', title);
      formData.append('slug', slug);
      formData.append('excerpt', excerpt);
      formData.append('content', content);
      formData.append('is_published', String(isPublished));

      if (coverImage?.file) {
        formData.append('cover_image', coverImage.file);
      }

      images.forEach((image) => {
        formData.append('images', image.file);
      });

      const response = await fetch(`/api/admin/blogs/${id}`, {
        method: 'PATCH',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message);
      }

      clearFormData();

      router.push('/admin');
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const clearFormData = () => {
    setTitle('');
    setSlug('');
    setExcerpt('');
    setContent('');
    setCoverImage(null);
    setImages([]);

    if (coverInputRef.current) coverInputRef.current.value = '';
    if (galleryInputRef.current) galleryInputRef.current.value = '';

    router.push('/admin');
  };

  return (
    <>
      <PageHeader title="สร้างบทความใหม่">
        <div className="flex justify-end gap-2">
          <Button variant="outline" type="button" onClick={clearFormData}>
            ยกเลิก
          </Button>

          <Button type="button" onClick={() => handleSubmit(true)}>
            บันทึก
          </Button>
        </div>
      </PageHeader>

      <main className="p-6 bg-[#f8fafc]">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <Card className="rounded-sm">
                <CardContent className="space-y-6 p-6">
                  <div className="space-y-2">
                    <Label>ชื่อบทความ</Label>
                    <Input
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="กรอกชื่อบทความ"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>URL Slug</Label>

                    <Input
                      value={slug}
                      onChange={(e) => setSlug(e.target.value)}
                      placeholder="my-first-blog"
                    />

                    <p className="text-xs text-muted-foreground">
                      URL :
                      <span className="ml-1 font-medium">
                        /blog/{slug || 'your-slug'}
                      </span>
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label>คำอธิบายสั้น ๆ</Label>
                    <Textarea
                      rows={3}
                      placeholder="กรอกคำอธิบายสั้น ๆ"
                      value={excerpt}
                      onChange={(e) => setExcerpt(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>เนื้อหาบทความ</Label>
                    <Textarea
                      className="min-h-[500px] "
                      placeholder="กรอกเนื้อหาบทความ"
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-4">
              <Card className="rounded-sm">
                <CardContent className="p-4">
                  <div className="mb-3 text-sm font-medium">รูปปก</div>

                  {!coverImage ? (
                    <button
                      type="button"
                      onClick={() => coverInputRef.current?.click()}
                      className="flex h-44 w-full cursor-pointer flex-col items-center justify-center rounded-sm border border-dashed border-gray-300 bg-gray-50 transition hover:bg-gray-100"
                    >
                      <ImageIcon className="h-8 w-8 text-gray-500" />

                      <p className="mt-2 text-sm font-medium">
                        คลิกเพื่ออัปโหลด
                      </p>
                    </button>
                  ) : (
                    <div className="relative h-44 overflow-hidden rounded-sm border">
                      <Image
                        src={coverImage.preview}
                        alt="Cover"
                        fill
                        className="object-cover"
                        unoptimized
                      />

                      <button
                        type="button"
                        onClick={removeCoverImage}
                        className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-black/60 text-white transition hover:bg-red-500"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  )}

                  <input
                    ref={coverInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleCoverChange}
                  />
                </CardContent>
              </Card>

              <Card className="rounded-sm">
                <CardContent className="p-4">
                  <div className="mb-3 flex items-center justify-between">
                    <span className="text-sm font-medium">
                      รูปเพิ่มเติม (สูงสุด 6 รูป)
                    </span>

                    <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs text-blue-600">
                      {images.length} / 6
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    {Array.from({ length: 6 }).map((_, index) => {
                      const image = images[index];

                      if (image) {
                        return (
                          <div
                            key={index}
                            className="relative aspect-square overflow-hidden rounded-sm border"
                          >
                            <Image
                              src={image.preview}
                              alt=""
                              fill
                              className="object-cover"
                              unoptimized
                            />

                            <button
                              type="button"
                              onClick={() => removeImage(index)}
                              className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-black/60 text-white hover:bg-red-500"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </div>
                        );
                      }

                      if (index === images.length) {
                        return (
                          <button
                            key={index}
                            type="button"
                            onClick={() => galleryInputRef.current?.click()}
                            className="flex aspect-square items-center justify-center rounded-sm border border-dashed bg-gray-50 hover:bg-gray-100"
                          >
                            <Plus className="h-6 w-6 text-gray-400" />
                          </button>
                        );
                      }

                      return (
                        <div
                          key={index}
                          className="aspect-square rounded-sm bg-gray-100"
                        />
                      );
                    })}
                  </div>

                  <input
                    ref={galleryInputRef}
                    type="file"
                    multiple
                    accept="image/*"
                    className="hidden"
                    onChange={handleGalleryChange}
                  />
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {loading && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
            <Spinner className="size-12 text-[#1E293B]" />
          </div>
        )}
      </main>
    </>
  );
}

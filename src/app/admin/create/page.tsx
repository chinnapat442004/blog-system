'use client';

import { PageHeader } from '@/components/common/PageHeader';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Image as ImageIcon, Plus, X } from 'lucide-react';
import { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Spinner } from '@/components/ui/spinner';
import Image from 'next/image';

export default function AdminCreate() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [errors, setErrors] = useState<{
    title?: string;
    slug?: string;
    excerpt?: string;
    content?: string;
    coverImage?: string;
    general?: string;
  }>({});

  const [coverImage, setCoverImage] = useState<{
    file: File;
    preview: string;
  } | null>(null);

  const coverInputRef = useRef<HTMLInputElement>(null);
  const [images, setImages] = useState<
    {
      file: File;
      preview: string;
    }[]
  >([]);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

  const validateForm = () => {
    const validationErrors: {
      title?: string;
      slug?: string;
      excerpt?: string;
      content?: string;
      coverImage?: string;
      general?: string;
    } = {};

    if (!title.trim()) {
      validationErrors.title = 'กรุณากรอกชื่อบทความ';
    }

    if (!slug.trim()) {
      validationErrors.slug = 'กรุณากรอก URL Slug';
    } else if (!slugRegex.test(slug)) {
      validationErrors.slug =
        'URL Slug ต้องเป็นตัวอักษรภาษาอังกฤษ ตัวเลข และขีดกลางเท่านั้น';
    }

    if (!excerpt.trim()) {
      validationErrors.excerpt = 'กรุณากรอกคำอธิบายสั้น ๆ';
    }

    if (!content.trim()) {
      validationErrors.content = 'กรุณากรอกเนื้อหาบทความ';
    }

    if (!coverImage) {
      validationErrors.coverImage = 'กรุณาใส่รูปปก';
    }

    return validationErrors;
  };

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
    setErrors((prev) => ({
      ...prev,
      coverImage: undefined,
      general: undefined,
    }));

    e.target.value = '';
  };

  const removeCoverImage = () => {
    setCoverImage(null);
  };

  const handleSubmit = async (isPublished: boolean) => {
    const validationErrors = validateForm();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      setLoading(true);
      setErrors({});

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

      const response = await fetch('/api/admin/blogs', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        const slugError =
          data?.message?.includes('URL Slug') || data?.message?.includes('slug')
            ? { slug: data?.message }
            : { general: data?.message || 'เกิดข้อผิดพลาดในการสร้างบทความ' };
        setErrors(slugError);
        return;
      }

      clearFormData();
      router.push('/admin');
    } catch (error) {
      console.error(error);
      setErrors({ general: 'เกิดข้อผิดพลาดในการสร้างบทความ' });
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
          <Button
            variant="outline"
            type="button"
            onClick={() => handleSubmit(false)}
          >
            บันทึกร่าง
          </Button>

          <Button type="button" onClick={() => handleSubmit(true)}>
            เผยแพร่
          </Button>
        </div>
      </PageHeader>

      {errors.general && (
        <div className="mx-auto max-w-7xl p-6">
          <Alert variant="destructive">
            <AlertTitle>เกิดข้อผิดพลาด</AlertTitle>
            <AlertDescription>{errors.general}</AlertDescription>
          </Alert>
        </div>
      )}

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
                      onChange={(e) => {
                        setTitle(e.target.value);
                        setErrors((prev) => ({
                          ...prev,
                          title: undefined,
                          general: undefined,
                        }));
                      }}
                      placeholder="กรอกชื่อบทความ"
                    />
                    {errors.title && (
                      <p className="text-sm text-destructive">{errors.title}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label>URL Slug</Label>

                    <Input
                      value={slug}
                      onChange={(e) => {
                        setSlug(e.target.value.toLowerCase());
                        setErrors((prev) => ({
                          ...prev,
                          slug: undefined,
                          general: undefined,
                        }));
                      }}
                      placeholder="my-first-blog"
                    />
                    {errors.slug && (
                      <p className="text-sm text-destructive">{errors.slug}</p>
                    )}

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
                      onChange={(e) => {
                        setExcerpt(e.target.value);
                        setErrors((prev) => ({
                          ...prev,
                          excerpt: undefined,
                          general: undefined,
                        }));
                      }}
                    />
                    {errors.excerpt && (
                      <p className="text-sm text-destructive">
                        {errors.excerpt}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label>เนื้อหาบทความ</Label>
                    <Textarea
                      className="min-h-125"
                      placeholder="กรอกเนื้อหาบทความ"
                      value={content}
                      onChange={(e) => {
                        setContent(e.target.value);
                        setErrors((prev) => ({
                          ...prev,
                          content: undefined,
                          general: undefined,
                        }));
                      }}
                    />
                    {errors.content && (
                      <p className="text-sm text-destructive">
                        {errors.content}
                      </p>
                    )}
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
                  {errors.coverImage && (
                    <p className="mt-2 text-sm text-destructive">
                      {errors.coverImage}
                    </p>
                  )}
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
            <Spinner className="size-12" />
          </div>
        )}
      </main>
    </>
  );
}

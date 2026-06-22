'use client';

import { useRef, useState } from 'react';
import { createComment } from './actions';

type Props = {
  blogId: number;
  slug: string;
};

export default function CommentForm({ blogId, slug }: Props) {
  const thaiNumberOnly = /^[\u0E00-\u0E7F0-9\s]+$/;
  const formRef = useRef<HTMLFormElement>(null);
  const [senderName, setSenderName] = useState('');
  const [message, setMessage] = useState('');
  const [validationError, setValidationError] = useState<string | null>(null);

  const validateForm = () => {
    if (!senderName || !senderName.trim()) {
      return 'กรุณากรอกชื่อผู้ส่ง';
    }
    if (!message.trim()) {
      return 'กรุณาใส่ข้อความความคิดเห็น';
    }

    if (!thaiNumberOnly.test(message.trim())) {
      return 'ความคิดเห็นต้องเป็นภาษาไทยและตัวเลขเท่านั้น';
    }

    return null;
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    const error = validateForm();

    if (error) {
      event.preventDefault();
      setValidationError(error);
      return;
    }

    setValidationError(null);

    setTimeout(() => {
      formRef.current?.reset();
      setSenderName('');
      setMessage('');
    }, 0);
  };

  return (
    <>
      <form
        ref={formRef}
        action={createComment}
        className="space-y-4"
        onSubmit={handleSubmit}
        noValidate
      >
        <input type="hidden" name="blogId" value={blogId} />
        <input type="hidden" name="slug" value={slug} />

        <div>
          <label className="block text-sm font-medium mb-1">
            ชื่อผู้ส่ง <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="senderName"
            value={senderName}
            onChange={(event) => setSenderName(event.target.value)}
            className="w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
            placeholder="กรอกชื่อของคุณ"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            ความคิดเห็น <span className="text-red-500">*</span>
          </label>
          <textarea
            name="message"
            rows={4}
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            className="w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
            placeholder="แสดงความคิดเห็น (ภาษาไทยและตัวเลขเท่านั้น)"
            required
          />
          {validationError && (
            <p className="mt-2 text-sm text-red-600">{validationError}</p>
          )}
        </div>

        <button
          type="submit"
          className="w-full rounded-md bg-[#1E293B] px-4 py-2 text-white hover:bg-gray-800 transition"
        >
          ส่งความคิดเห็น
        </button>
      </form>
    </>
  );
}

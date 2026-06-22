import { PageHeader } from '@/components/common/PageHeader';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

import CommentAction from './CommentAction';

import { getComments } from './action';

export default async function Admin() {
  const comments = await getComments();

  const statusMap = {
    PENDING: {
      text: 'รออนุมัติ',
      className: 'text-yellow-600',
    },
    APPROVED: {
      text: 'อนุมัติแล้ว',
      className: 'text-green-600',
    },
    REJECTED: {
      text: 'ปฏิเสธแล้ว',
      className: 'text-red-600',
    },
  };

  return (
    <>
      <PageHeader title="จัดการ Comment"></PageHeader>

      <main className="p-4  h-full bg-[#f8fafc]">
        <div className="w-full  ">
          <Card className="w-full max-w-full  p-2 border">
            <CardHeader>
              <CardTitle>
                <div className=" flex items-center justify-between gap-3 my-3">
                  <div className="text-xl font-bold "> รายการทั้งหมด</div>
                </div>
              </CardTitle>
            </CardHeader>

            <CardContent className="p-0">
              <div className="w-full  overflow-x ">
                <Table className="min-w-[900px] ">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="font-bold">ชื่อผู้ใช้งาน</TableHead>
                      <TableHead className="font-bold">Comment</TableHead>
                      <TableHead className="font-bold">บทความต้นทาง</TableHead>
                      <TableHead className="font-bold">สถานะ</TableHead>
                      <TableHead className="font-bold text-center ">
                        Action
                      </TableHead>
                    </TableRow>
                  </TableHeader>

                  <TableBody>
                    {comments.map((comment) => (
                      <TableRow className="h-24" key={comment.id}>
                        <TableCell className="font-medium whitespace-normal break-words max-w-[200px]">
                          {comment.senderName}
                        </TableCell>

                        <TableCell className="font-medium whitespace-normal break-words max-w-[200px]">
                          {comment.message}
                        </TableCell>

                        <TableCell className="whitespace-normal break-words max-w-[400px]">
                          {comment.blog.title}
                        </TableCell>
                        <TableCell>
                          <span
                            className={`text-sm font-medium ${
                              statusMap[
                                comment.status as keyof typeof statusMap
                              ].className
                            }`}
                          >
                            {
                              statusMap[
                                comment.status as keyof typeof statusMap
                              ].text
                            }
                          </span>
                        </TableCell>

                        <TableCell className="text-center">
                          <div className="flex items-center justify-center">
                            <CommentAction
                              id={comment.id}
                              status={comment.status}
                            />
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </>
  );
}

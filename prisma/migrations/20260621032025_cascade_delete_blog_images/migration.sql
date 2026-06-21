-- DropForeignKey
ALTER TABLE "Image" DROP CONSTRAINT "Image_blogId_fkey";

-- AddForeignKey
ALTER TABLE "Image" ADD CONSTRAINT "Image_blogId_fkey" FOREIGN KEY ("blogId") REFERENCES "Blog"("id") ON DELETE CASCADE ON UPDATE CASCADE;

import z from "zod/v3";

export const BlogPostSchema = z.object({
    title: z.string().min(5).max(50),
    content: z.string().min(20).max(5000),
    image: z.instanceof(File,{message: "Please upload an image file"}).refine(file => file.type.startsWith("image/"), "Only image files are allowed").optional(),
});

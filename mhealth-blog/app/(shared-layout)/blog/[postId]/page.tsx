import { CommentsSection } from "@/components/CommentsSection";
import { buttonVariants } from "@/components/ui/button";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { fetchQuery, preloadQuery } from "convex/nextjs";
import { ArrowLeft } from "lucide-react";
import { Metadata } from "next/dist/lib/metadata/types/metadata-interface";
import Image from "next/image";
import Link from "next/link";

type PostPageProps = {
    params: Promise<{
        postId: Id<"posts">
    }>
}

export async function generateMetadata(
  {params}: PostPageProps
): Promise<Metadata> {
  const { postId } = await params;
    const post = await fetchQuery(api.posts.getPostById, { postId })
    
    if(!post){
        return{
            title: "Post Not Found",
            description: "The post you are looking for does not exist."
        }
    }
 
  return {
    title: post.title,
    description: post.body.slice(0, 160) 
  }
}

export default async function blogPostPage({ params }: PostPageProps) {
    const { postId } = await params;

    const [post, preloadedComments] = await Promise.all([
        await fetchQuery(api.posts.getPostById, { postId }),
        await preloadQuery(api.comments.getCommentsByPostById, { postId })
    ])
   
    

    if (!post) {
        return (
            <div className="max-w-3xl mx-auto py-8 px-4 animate-in fade-in duration-500 relative ">
                <h1>
                    Post Not Found
                </h1>
            </div>
        )
    }

    return (
        <div className="max-w-3xl mx-auto py-8 px-4 animate-in fade-in duration-500 relative ">
            <Link className={buttonVariants({ variant: "outline", className: "mb-8" })} href="/blog">
                <ArrowLeft className="size-4" />
                Back to Blogs
            </Link>

            <div className="relative w-full h-100 mb-8 rounded-xl overflow-hidden">
                <Image
                    src={post.imageUrl ?? "https://images.unsplash.com/photo-1621887348744-6b0444f8a058?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"}
                    alt={post.title}
                    fill
                    className="object-cover object-center hover-scale-105 transition-transform duration-300"
                />
            </div>

            <div className="prose max-w-none space-y-4 ">
                <h1 className="text-4xl font-bold mb-4 tracking-tight text-foreground">{post.title}</h1>

                <p className="text-muted-foreground text-sm">
                    Posted on: {new Date(post._creationTime).toLocaleDateString("en-GB")} 
                </p>

                

                <p className="text-lg leading-relaxed text-foreground/90 mb-6 whitespace-pre-wrap">
                    {post.body}
                </p>
            </div>
            <div className="mt-12">
                <CommentsSection preLoadedComments={preloadedComments} />
            </div>

        </div>
    )
}
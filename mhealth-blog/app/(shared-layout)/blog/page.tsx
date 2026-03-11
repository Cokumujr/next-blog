import {  buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/convex/_generated/api";
import { cn } from "@/lib/utils";
import { fetchQuery } from "convex/nextjs";
import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";

export default function blogListPage() {
  return (
    <div className="py-12">
      <div className="mx-auto text-center max-w-3xl pb-12">
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight">
          Our Blog
        </h1>
        <p className="text-muted-foreground pt-4 max-w-2xl mx-auto text-lg">
          Welcome to our blog! Here you&apos;ll find a collection of articles on
          various topics related to mental health and addiction recovery.
          Whether you&apos;re looking for the expert advice or in-depth
          analysis, our blog has something for everyone. Stay tuned for regular
          updates and feel free to share your thoughts in the comments section!
        </p>
      </div>

      <Suspense fallback={<SkeletonUI />} >
        <BlogList />
        </Suspense>
      
    </div>
  );
}

async function BlogList() {
  const data = await fetchQuery(api.posts.getPosts)
  
  return (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
    {
      data?.map((post) => (
        <Card className="pt-0" key={post._id}>
      <div className="relative h-48 w-full overflow-hidden">
        <Image
          src={post.imageUrl ?? "https://images.unsplash.com/photo-1621887348744-6b0444f8a058?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"}
          alt="Blog Post Image"
          fill
          className="rounded-t-md object-cover object-center"
        />
      </div>
      <CardContent>
        <Link
          href={`/blog/${post._id}`}
          className="text-2xl font-bold mb-2 hover:text-primary"
        >
          <h2 className="text-2xl text-center font-bold mb-2">
            {post.title}
          </h2>
        </Link>
        <p className="text-muted-foreground mb-4 line-clamp-3">
          {post.body}
        </p>
        <Link
          href={`/blog/${post._id}`}
          className={cn(
            buttonVariants({ variant: "default" }),
            "mt-4 w-full shadow-lg",
          )}
        >
          Read More
        </Link>
      </CardContent>
    </Card>

      ))
    }
  
    </div>
  );
}

function SkeletonUI() { 
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
      {[...Array(6)].map((_,i) => (
        <div key={i} className="flex flex-col animate-pulse gap-4">
          <Skeleton className="h-48 w-full rounded-t-md" />
          <div className="flex-1 space-y-4 py-2">
            <Skeleton className="h-6 w-3/4 rounded mx-auto" />
            <Skeleton className="h-4 w-full rounded" />
            <Skeleton className="h-4 w-full rounded" />
            <Skeleton className="h-4 w-5/6 rounded" />
          </div>
        </div>
  ))}
          
    </div>
  )
}
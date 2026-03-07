"use client";

import Link from "next/link";
import { Button, buttonVariants } from "./ui/button";
import { ThemeToggle } from "./themeToggle";
import { useConvexAuth } from "convex/react";
import { is } from "zod/locales";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export function Navbar() {
    const { isAuthenticated, isLoading } = useConvexAuth();
    const router = useRouter();


    return (
        <nav className="w-full flex items-center justify-between py-6">
            <div className="flex items-center space-x-2">
                <Link href="/">
                <h1 className="text-3xl font-bold">
                <span className="text-blue-500">Nadra</span>
                </h1>
                </Link>
            </div>

                <div className="px-10 flex items-center gap-4 ">
                    <Link href="/" className={ buttonVariants({ variant: "ghost", size:"lg" }) }>
                        Home
                    </Link>
                    <Link href="/blog" className={ buttonVariants({ variant: "ghost" ,size:"lg"})}>
                        Blog
                    </Link>
                    <Link href="/create" className={ buttonVariants({ variant: "ghost",size:"lg" })}>
                        Create
                    </Link>

                </div>
            

            <div className="flex items-center gap-2">
                {isLoading ? null : isAuthenticated ? (
                    <Button onClick={() => authClient.signOut({
                        fetchOptions: {
                            onSuccess: () => {
                                toast.success("Logged out successfully");
                                router.push("/");
                            },
                            onError: (error) => {
                                toast.error(error.error.message || "Failed to log out");
                            }
                        }
                    })}>
                        Logout
                    </Button>
                ) : (
                    <>
                        <Link href="/auth/signup" className={buttonVariants({ variant: "outline", size: "lg" })}>
                            Sign Up
                        </Link>
                        <Link href="/auth/login" className={buttonVariants({ variant: "default", size: "lg" })}>
                            Login
                        </Link>
                    </>
                )}
                <ThemeToggle />
            </div>
            
        </nav>
    )
}
import { buttonVariants } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function AuthLayout({children}: {children: React.ReactNode}) {
    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="absolute top-6 left-6">
                <Link href="/" className={buttonVariants({ variant: "secondary" ,size: "lg"})}>
                    <ArrowLeft />
                    Go back
                </Link>

            </div>

            <div className="w-full max-w-md mx-auto">
                <h1 className="text-4xl font-bold text-center mb-4">Welcome to Nadra</h1>
                {children}
            </div>

        </div>
    )
}
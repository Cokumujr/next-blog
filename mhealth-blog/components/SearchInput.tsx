import { Loader2, Search } from "lucide-react";
import { Input } from "./ui/input";
import React, { useState } from "react";
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import Link from "next/link";


export function SearchInput() {

    const [term, setTerm] = useState("");
    const [open, setOpen] = useState(false);
    const results = useQuery(api.posts.searchPosts,
        term.length >= 2 ? { limit: 5, term: term } : "skip");

    function onInputChange(e: React.ChangeEvent<HTMLInputElement>) {
        setTerm(e.target.value);
        setOpen(true);
    }
    return (
        <div className="relative w-full max-w-sm">
            <div className="relative">
                <Search className="absolute left-2.5 top-2.5 text-muted-foreground size-4"/>
                <Input
                    type="search"
                    placeholder="Search posts...."
                    className="w-full pl-8 bg-background"
                    value={term}
                    onChange={onInputChange}
                />
            </div>
            {open && term.length >= 2 && (
    <div className="absolute top-full w-full mt-2 rounded-md border bg-popover text-popover-foreground shadow-md outline-none animate-in fade-in-0 zoom-in-95 z-50">
        {results === undefined ? (
            <div className="flex items-center gap-2 p-4 text-sm italic">
                <Loader2 className="size-4 animate-spin" />
                Searching...
            </div>
        ) : results.length === 0 ? (
            <p className="p-4 text-sm">No results found!</p>
        ) : (
            <div className="py-2">
                {results?.map((post) => (
                    <Link 
                        href={`/blog/${post._id}`} 
                        key={post._id}
                        onClick={() => {
                            setOpen(false);
                            setTerm("");
                        }}
                        className="block px-4 py-2 hover:bg-accent text-sm transition-colors"
                    >
                        {post.title}
                    </Link>
                ))}
            </div>
        )} 
    </div>
)}
        </div>
    )
}
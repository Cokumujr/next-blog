"use client"

import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import FacePile from "@convex-dev/presence/facepile";
import usePresence from "@convex-dev/presence/react";

interface PostPresenceProps { 
    roomId: Id<"posts">;
    userId: string;
}

export function PostPresence({ roomId, userId }: PostPresenceProps) {
    const presenceState = usePresence(api.presence, roomId, userId);
    
    if(!presenceState || presenceState.length === 0) {
        return null; 
    }

    return (
        <div className="flex items-center gap-2">
            <p className="text-xs text-muted-foreground uppercase tracking-wider">
                Viewing now
            </p>
            <div className="flex space-x-2 text-black">
                <FacePile presenceState={presenceState}/>
             </div>   
        </div>
    )
}
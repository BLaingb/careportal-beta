import { Loader2 } from "lucide-react";
import { cn } from "~/lib/utils";

interface LoadingSpinnerProps {
    className?: string
}

export function LoadingSpinner({ className }: LoadingSpinnerProps) {
    return (
        <div className="flex justify-center">
            <Loader2 className={cn("h-6 w-6 animate-spin", className)} />
        </div>
    );
} 
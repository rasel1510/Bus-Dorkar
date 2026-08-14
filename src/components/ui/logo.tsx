import Link from "next/link";
import { Bus } from "lucide-react";

interface LogoProps {
  className?: string;
  iconSize?: string;
  textSize?: string;
}

export function Logo({ className = "", iconSize = "h-5 w-5", textSize = "text-xl" }: LogoProps) {
  return (
    <Link href="/" className={`flex items-center gap-2.5 group ${className}`} id="app-logo">
      <div className="flex h-9 w-9 items-center justify-center rounded-lg gradient-teal transition-transform group-hover:scale-105 shadow-md shadow-bd-teal-500/20">
        <Bus className={`${iconSize} text-bd-navy-950`} strokeWidth={2.5} />
      </div>
      <span className={`${textSize} font-bold tracking-tight text-foreground`}>
        Bus <span className="gradient-text">Dorkar</span>
      </span>
    </Link>
  );
}

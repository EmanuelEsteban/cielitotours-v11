import type { CSSProperties, ReactNode } from "react";
import { cn } from "@/lib/utils";
import { useInView } from "./use-in-view";

export function Reveal({ children, delay = 0, className, variant = "up", as: Tag = "div", style }: { style?: CSSProperties; children: ReactNode; delay?: number; className?: string; variant?: "up" | "clip"; as?: "div" | "span" | "p" }) {
  const [ref, inView] = useInView<HTMLDivElement>(0.2);
  return <Tag ref={ref as never} className={cn(variant === "clip" ? "ruta-clip" : "ruta-reveal", inView && "is-in", className)} style={{ ...style, "--ruta-delay": `${delay}ms` } as CSSProperties}>{children}</Tag>;
}

export function TitleLines({ lines, delay = 0, stagger = 120, className, as: Tag = "h2" }: { lines: ReactNode[]; delay?: number; stagger?: number; className?: string; as?: "h1" | "h2" }) {
  const [ref, inView] = useInView<HTMLHeadingElement>(0.2);
  return <Tag ref={ref} className={cn("ruta-title", inView && "is-in", className)}>
    {lines.map((line, i) => <span key={i} className="ruta-line-mask"><span className="ruta-line-inner" style={{ "--ruta-delay": `${delay + i * stagger}ms` } as CSSProperties}>{line}</span></span>)}
  </Tag>;
}

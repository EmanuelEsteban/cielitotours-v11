import { useRef, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { isFinePointer, prefersReducedMotion } from "./tokens";

/** Max 2° tilt + pointer light. Fine pointers only; static otherwise. */
export function TiltCard({ children, className, max = 2 }: { children: ReactNode; className?: string; max?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const onMove = (e: React.PointerEvent) => {
    const el = ref.current;
    if (!el || e.pointerType !== "mouse" || !isFinePointer() || prefersReducedMotion()) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
    el.style.setProperty("--mx", `${x * 100}%`);
    el.style.setProperty("--my", `${y * 100}%`);
    el.style.transform = `perspective(900px) rotateX(${(0.5 - y) * max * 2}deg) rotateY(${(x - 0.5) * max * 2}deg)`;
  };
  const onLeave = () => { if (ref.current) ref.current.style.transform = ""; };
  return <div ref={ref} onPointerMove={onMove} onPointerLeave={onLeave} className={cn("ruta-tilt", className)}>{children}</div>;
}

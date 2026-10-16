import { useInView } from "@/components/motion/use-in-view";
import { cn } from "@/lib/utils";

/** "KICKER, accent" — uppercase kicker + handwritten Caveat accent with drawn underline and spark. Shared by pases and Viajes destacados. */
export function HandKicker({ main, hand, className }: { main: string; hand: string; className?: string }) {
  const [ref, inView] = useInView<HTMLParagraphElement>(0.4);
  return <p ref={ref} className={cn("pase-kicker", inView && "is-in", className)}>
    <span className="pase-kicker-main home-kicker"><span aria-hidden="true" className="ruta-kicker-line" />{main}<span className="pase-kicker-comma">,</span></span>
    <span className="pase-hand-wrap">
      <span className="home-hand pase-hand">{hand}</span>
      <svg aria-hidden="true" className="pase-scribble" viewBox="0 0 220 26" preserveAspectRatio="none">
        <path pathLength={1} d="M4 16 C 30 8, 52 22, 80 14 S 130 6, 160 15 S 200 18, 214 10" />
      </svg>
      <svg aria-hidden="true" className="pase-spark" viewBox="0 0 20 20"><path d="M10 0 L12 8 L20 10 L12 12 L10 20 L8 12 L0 10 L8 8 Z" /></svg>
    </span>
  </p>;
}

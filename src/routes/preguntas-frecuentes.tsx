import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { useEffect, useRef } from "react";
import { ArrowLeft, Compass, Luggage, FileText, Plane } from "lucide-react";
import paperTexture from "@/assets/faq-mineral-paper.jpg";
import nightTexture from "@/assets/faq-night-engraving.jpg";
import { SiteShell } from "@/components/site-shell";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
export const Route = createFileRoute("/preguntas-frecuentes")({ head: () => ({ links: [{ rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Allura&display=swap" }], meta: [{ title: "Preguntas frecuentes | Cielito Tours" }, { name: "description", content: "Respuestas sobre cotizaciones, disponibilidad y planeación de viajes." }, { property: "og:title", content: "Preguntas frecuentes | Cielito Tours" }, { property: "og:description", content: "Información para planear tu viaje con claridad." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" }] }), component: Page });
const questions = [
  { icon: FileText, question: "¿La cotización confirma precio y disponibilidad?", answer: "No. Cada propuesta debe ser validada por un asesor antes de reservar, porque tarifas y disponibilidad pueden cambiar." },
  { icon: Luggage, question: "¿Pueden organizar todo el viaje?", answer: "Sí. Podemos integrar vuelos, hospedaje, renta de auto, cruceros, tours y necesidades de grupos." },
  { icon: Compass, question: "¿Necesito tener un destino decidido?", answer: "No. Puedes contarnos qué te gustaría vivir, tus fechas y presupuesto aproximado para comenzar." },
];

function Page() {
  const questionsRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    const title = titleRef.current;
    const hero = title?.closest<HTMLElement>(".faq-hero");
    if (!title || !hero) return;
    const placeStamp = () => {
      const text = title.firstChild;
      if (!text?.textContent) return;
      const range = document.createRange();
      range.setStart(text, text.textContent.length - 1);
      range.setEnd(text, text.textContent.length);
      const letter = range.getBoundingClientRect();
      const origin = hero.getBoundingClientRect();
      hero.style.setProperty("--faq-stamp-x", `${letter.x + letter.width / 2 - origin.x}px`);
      hero.style.setProperty("--faq-stamp-y", `${letter.bottom - origin.y - 8}px`);
    };
    const observer = new ResizeObserver(placeStamp);
    observer.observe(title);
    placeStamp();
    void document.fonts.ready.then(placeStamp);
    return () => observer.disconnect();
  }, []);
  useEffect(() => {
    const list = questionsRef.current;
    if (!list) return;
    const reserveSpace = () => {
      const triggers = Array.from(list.querySelectorAll<HTMLElement>(".faq-question-trigger"));
      const answers = Array.from(list.querySelectorAll<HTMLElement>(".faq-answer"));
      const gap = parseFloat(getComputedStyle(list).rowGap) || 0;
      const height = triggers.reduce((total, trigger) => total + trigger.getBoundingClientRect().height + 2, 0)
        + Math.max(0, ...answers.map(answer => answer.getBoundingClientRect().height))
        + gap * Math.max(0, triggers.length - 1);
      list.style.setProperty("--faq-reserved-height", `${Math.ceil(height)}px`);
    };
    const observer = new ResizeObserver(reserveSpace);
    list.querySelectorAll(".faq-question-trigger, .faq-answer").forEach(element => observer.observe(element));
    reserveSpace();
    void document.fonts.ready.then(reserveSpace);
    return () => observer.disconnect();
  }, []);
  return <SiteShell><section className="faq-artisan faq-hero">
    <img src={nightTexture} className="faq-night-texture" alt="" aria-hidden="true" />
    <div className="faq-travel-stamp" aria-hidden="true"><svg viewBox="0 0 180 180"><defs><path id="faq-stamp-top" d="M28 90a62 62 0 0 1 124 0" /><path id="faq-stamp-bottom" d="M22 90a68 68 0 0 0 136 0" /></defs><circle cx="90" cy="90" r="83" /><circle cx="90" cy="90" r="79" /><circle cx="90" cy="90" r="48" /><text><textPath href="#faq-stamp-top" startOffset="50%" textAnchor="middle">EXPERIENCIAS</textPath></text><text><textPath href="#faq-stamp-bottom" startOffset="50%" textAnchor="middle">QUE CONECTAN</textPath></text></svg><Plane strokeWidth={1.3} /><svg className="faq-postmark" viewBox="0 0 180 100">{[0,1,2,3,4].map(i=><path key={i} d={`M0 ${20+i*13}C40 ${45+i*13} 55 ${-10+i*13} 95 ${12+i*13}S150 ${30+i*13} 180 ${5+i*13}`} />)}</svg></div>
    <div className="faq-hero-inner"><h1 ref={titleRef}>Preguntas frecuentes</h1><p className="faq-intro">Lo esencial antes de comenzar a planear.</p></div>
    <svg className="faq-paper-curve" viewBox="0 0 1440 72" preserveAspectRatio="none" aria-hidden="true"><path className="faq-curve-thread" d="M0 12C430 115 950-30 1440 62" /><path className="faq-curve-thread faq-thread-secondary" d="M0 5C430 108 950-37 1440 55" /></svg>
  </section><section className="faq-artisan faq-paper">
    <img src={paperTexture} className="faq-mineral-texture" alt="" aria-hidden="true" />
    <div className="faq-content">
      <Accordion ref={questionsRef} type="single" collapsible defaultValue="question-1" className="faq-questions">
        {questions.map(({ icon: Icon, question, answer }, index) => <AccordionItem className="faq-question" value={`question-${index}`} key={question}>
          <AccordionTrigger className="faq-question-trigger"><span className="faq-question-icon" aria-hidden="true"><Icon strokeWidth={1.5} /></span><span className="faq-question-title">{question}</span></AccordionTrigger>
          <AccordionContent forceMount className="faq-answer"><p>{answer}</p></AccordionContent>
        </AccordionItem>)}
      </Accordion>
      <Button asChild variant="outline" className="faq-back"><Link to="/"><ArrowLeft aria-hidden="true" />Volver al inicio</Link></Button>
    </div>
    <svg className="faq-footer-curve" viewBox="0 0 1440 110" preserveAspectRatio="none" aria-hidden="true"><path className="faq-curve-thread" d="M0 12C470 110 860-85 1440 52" /><path className="faq-curve-thread faq-thread-secondary" d="M0 5C470 103 860-92 1440 45" /></svg>
  </section></SiteShell>;
}
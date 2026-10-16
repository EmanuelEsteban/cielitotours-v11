import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { ArrowLeft, Compass, Layers, TicketCheck } from "lucide-react";
import { SiteShell } from "@/components/site-shell";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
export const Route = createFileRoute("/preguntas-frecuentes")({ head: () => ({ meta: [{ title: "Preguntas frecuentes | Cielito Tours" }, { name: "description", content: "Respuestas sobre cotizaciones, disponibilidad y planeación de viajes." }, { property: "og:title", content: "Preguntas frecuentes | Cielito Tours" }, { property: "og:description", content: "Información para planear tu viaje con claridad." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" }] }), component: Page });
const questions = [
  { icon: TicketCheck, question: "¿La cotización confirma precio y disponibilidad?", answer: "No. Cada propuesta debe ser validada por un asesor antes de reservar, porque tarifas y disponibilidad pueden cambiar." },
  { icon: Layers, question: "¿Pueden organizar todo el viaje?", answer: "Sí. Podemos integrar vuelos, hospedaje, renta de auto, cruceros, tours y necesidades de grupos." },
  { icon: Compass, question: "¿Necesito tener un destino decidido?", answer: "No. Puedes contarnos qué te gustaría vivir, tus fechas y presupuesto aproximado para comenzar." },
];

function Page() {
  return <SiteShell><section className="faq-artisan faq-hero">
    <svg className="faq-engraving" viewBox="0 0 700 400" aria-hidden="true">
      <defs><linearGradient id="faq-engraving-fade"><stop stopColor="currentColor" stopOpacity="0" /><stop offset=".4" stopColor="currentColor" /><stop offset="1" stopColor="currentColor" stopOpacity=".15" /></linearGradient></defs>
      <g fill="none" stroke="url(#faq-engraving-fade)" strokeWidth="1">
        <path d="M-60 360C100 270 160 370 290 210S470 80 750 130" /><path d="M-60 380C100 290 180 390 310 230S480 100 750 150" /><path d="M130 -30C240 70 170 150 330 180S510 270 730 210" />
      </g>
      <g className="faq-seal" transform="translate(485 130)" fill="none" stroke="currentColor" strokeWidth="1">
        <circle r="61" /><circle r="54" /><circle r="44" strokeDasharray="1 6" /><path d="M0-32 7-7 32 0 7 7 0 32-7 7-32 0-7-7Z" /><path d="M-21-21 0-10 21-21 10 0 21 21 0 10-21 21-10 0Z" /><circle r="5" />
      </g>
    </svg>
    <div className="faq-hero-inner"><p className="faq-label">CIELITO TOURS</p><h1>Preguntas frecuentes</h1><p className="faq-intro">Lo esencial antes de comenzar a planear.</p></div>
    <svg className="faq-paper-curve" viewBox="0 0 1440 64" preserveAspectRatio="none" aria-hidden="true"><path d="M0 32C350 76 940-15 1440 24V64H0Z" /><path className="faq-curve-thread" d="M0 32C350 76 940-15 1440 24" /></svg>
  </section><section className="faq-artisan faq-paper">
    <div className="faq-content">
      <Accordion type="single" collapsible defaultValue="question-0" className="faq-questions">
        {questions.map(({ icon: Icon, question, answer }, index) => <AccordionItem className="faq-question" value={`question-${index}`} key={question}>
          <AccordionTrigger className="faq-question-trigger"><span className="faq-question-icon" aria-hidden="true"><Icon strokeWidth={1.5} /></span><span className="faq-question-title">{question}</span></AccordionTrigger>
          <AccordionContent className="faq-answer"><p>{answer}</p></AccordionContent>
        </AccordionItem>)}
      </Accordion>
      <Button asChild variant="outline" className="faq-back"><Link to="/"><ArrowLeft aria-hidden="true" />Volver al inicio</Link></Button>
    </div>
  </section></SiteShell>;
}
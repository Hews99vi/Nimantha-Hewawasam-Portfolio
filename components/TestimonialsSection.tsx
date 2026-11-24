import type { TestimonialItem } from "@/types/content";
import { Quote } from "lucide-react";
import { FeedbackRail } from "@/components/home/FeedbackRail";

function customerInitials(name: string) {
  const words = name.trim().split(/\s+/u).filter(Boolean);
  const initials =
    words.length > 1 ? [words[0], words[words.length - 1]] : words;
  return initials
    .map((word) => Array.from(word)[0])
    .join("")
    .toLocaleUpperCase();
}

export function TestimonialsSection({ items }: { items: TestimonialItem[] }) {
  const published = items
    .filter((item) => item.is_active)
    .sort((a, b) => a.sort_order - b.sort_order);

  if (!published.length) return null;

  return (
    <section
      className="testimonial-section testimonial-browsable section-space"
      id="testimonials"
      aria-labelledby="testimonials-title"
    >
      <div className="container-shell testimonial-layout">
        <div className="testimonial-heading">
          <h2 id="testimonials-title">In their words.</h2>
          <p>Feedback from people I’ve worked with.</p>
        </div>
        <FeedbackRail count={published.length}>
          {published.map((item, index) => (
            <figure
              className="testimonial-card"
              key={item.id}
              tabIndex={0}
              aria-label={`Review ${index + 1} of ${published.length}`}
            >
              <Quote
                className="testimonial-quote-mark"
                size={28}
                strokeWidth={1.5}
                aria-hidden="true"
              />
              <blockquote>
                <p>{item.quote}</p>
              </blockquote>
              <figcaption>
                <span className="testimonial-avatar" aria-hidden="true">
                  {customerInitials(item.name)}
                </span>
                <div className="testimonial-author">
                  <strong>{item.name}</strong>
                  <span>{item.role}</span>
                </div>
              </figcaption>
            </figure>
          ))}
        </FeedbackRail>
      </div>
    </section>
  );
}

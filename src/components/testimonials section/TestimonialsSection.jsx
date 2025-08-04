import React, { useState, useEffect, useRef } from "react";
import "./TestimonialsSection.scss";

const testimonials = [
  {
    name: "Adeel R.",
    rating: 5,
    quote: "Quick, easy, and hassle-free. Got my payment instantly after pickup. Highly recommend!"
  },
  {
    name: "Sarah W.",
    rating: 4,
    quote: "They gave me the best offer. Great communication and smooth collection process."
  },
  {
    name: "John M.",
    rating: 5,
    quote: "Simple and fast! Sold my scrap car in minutes. Brilliant experience."
  },
  {
    name: "Mike T.",
    rating: 5,
    quote: "Professional service from start to finish. Would definitely use again!"
  }
];

const TestimonialsSection = () => {
  const containerRef = useRef();
  const [visibleCards, setVisibleCards] = useState(3);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 576) setVisibleCards(1);
      else if (width < 1024) setVisibleCards(2);
      else setVisibleCards(3);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const maxIndex = Math.max(0, testimonials.length - visibleCards);

  const scrollTo = (idx) => {
    if (!containerRef.current) return;
    const cardWidth = containerRef.current.offsetWidth / visibleCards;
    containerRef.current.scrollTo({
      left: cardWidth * idx,
      behavior: "smooth",
    });
    setIndex(idx);
  };

  const prev = () => scrollTo(Math.max(index - 1, 0));
  const next = () => scrollTo(Math.min(index + 1, maxIndex));

  return (
    <section className="testimonials-section">
      <div className="container">
        <h2>What Our Clients Say</h2>
        <p className="subtitle">
          Join thousands of satisfied customers who chose us for their car sales.
        </p>

        <div className="testimonials-carousel-wrapper">
          <div 
            className="testimonials-carousel" 
            ref={containerRef}
          >
            {testimonials.map((testimonial, i) => (
              <div
                className="testimonial-card"
                key={i}
                style={{ "--visible-cards": visibleCards }}
              >
                <div className="quote-icon">❝</div>
                <p className="testimonial-quote">"{testimonial.quote}"</p>
                
                <div className="testimonial-stars">
                  {Array.from({ length: 5 }, (_, starIndex) => (
                    <span 
                      key={starIndex} 
                      className={`star ${
                        starIndex < testimonial.rating ? 'star-filled' : 'star-empty'
                      }`}
                    >
                      ★
                    </span>
                  ))}
                </div>
                
                <div className="testimonial-author">
                  <div className="author-avatar">
                    {testimonial.name.charAt(0)}
                  </div>
                  <p className="author-name">{testimonial.name}</p>
                </div>
              </div>
            ))}
          </div>

          {testimonials.length > visibleCards && (
            <div className="carousel-controls">
              <button 
                className="control-btn prev-btn"
                onClick={prev} 
                disabled={index === 0}
                aria-label="Previous testimonial"
              >
                ‹
              </button>
              <button 
                className="control-btn next-btn"
                onClick={next} 
                disabled={index === maxIndex}
                aria-label="Next testimonial"
              >
                ›
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
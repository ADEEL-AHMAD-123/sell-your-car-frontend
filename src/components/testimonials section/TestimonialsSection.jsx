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
      name: "Sarah W.",
      rating: 4,
      quote: "They gave me the best offer. Great communication and smooth collection process."
    },
    {
      name: "John M.",
      rating: 5,
      quote: "Simple and fast! Sold my scrap car in minutes. Brilliant experience."
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
          Trusted by businesses worldwide for delivering exceptional digital
          products.
        </p>

        <div className="carousel-wrapper">
          <div className="carousel" ref={containerRef}>
            {testimonials.map((t, i) => (
         <div
         className="card"
         key={i}
         style={{ "--visible-cards": visibleCards }}
       >
         <p className="quote">“{t.quote}”</p>
       
         {/* ⭐️ Star Ratings */}
         <div className="stars">
           {Array.from({ length: 5 }, (_, i) => (
             <span key={i} className={i < t.rating ? 'filled' : 'empty'}>
               ★
             </span>
           ))}
         </div>
       
         <p className="client-name">{t.name}</p>
         <p className="client-role">{t.role}</p>
       </div>
       
            ))}
          </div>

          {testimonials.length > visibleCards && (
            <div className="arrows">
              <button onClick={prev} disabled={index === 0}>
                ‹
              </button>
              <button onClick={next} disabled={index === maxIndex}>
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
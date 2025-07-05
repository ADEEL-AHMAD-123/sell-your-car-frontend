import './Hero.scss';

const HeroSection = () => {
  return (
    <section className="hero">
      <div className="hero__overlay">
        <div className="hero__content container">
          <h1>Get the <span>best price </span>for your scrap car.</h1>
          <p>Instant quotes. Free collection. No hassle.</p>

          <form className="hero__form">
            <input type="text" placeholder="Vehicle Registration" />
            <input type="text" placeholder="Postcode" />
            <button type="submit">Get Your Quote</button>
          </form>

          <p className="hero__note">Trusted by thousands across the UK.</p>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;

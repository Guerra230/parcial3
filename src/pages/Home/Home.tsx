import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../app/store/hooks';
import { fetchTodayDeals } from '../../app/store/slices/productsSlice';
import { ProductCardSkeleton } from '../../components/ui/Skeleton';
import ProductCard from '../../components/ProductCard/ProductCard';
import './Home.css';

const SLIDES = [
  {
    title: 'The best tech in one place!',
    subtitle: 'For the best price too!',
    primaryLabel: 'View Sales',
    primaryTo: '/search?tag=on-sale',
    secondaryLabel: 'Explore Categories',
    secondaryTo: '/category/smartphones',
  },
  {
    title: 'iPhone 17 Pro Max',
    subtitle: 'Power, design and performance.',
    primaryLabel: 'Comprar ahora',
    primaryTo: '/product/iphone-17-pm-512-darkblue',
    secondaryLabel: 'Ver más',
    secondaryTo: '/category/smartphones',
  },
  {
    title: 'Gaming sin límites',
    subtitle: 'PCs, consolas y accesorios.',
    primaryLabel: 'Ver Gaming',
    primaryTo: '/category/consoles',
    secondaryLabel: 'Ofertas',
    secondaryTo: '/search?tag=on-sale',
  },
  {
    title: 'Laptops para todo',
    subtitle: 'Trabaja, crea y juega.',
    primaryLabel: 'Ver Laptops',
    primaryTo: '/category/laptops',
    secondaryLabel: 'Marcas',
    secondaryTo: '/category/laptops',
  },
  {
    title: 'Smart TVs 4K',
    subtitle: 'La mejor imagen para tu hogar.',
    primaryLabel: 'Ver Televisores',
    primaryTo: '/category/televisions',
    secondaryLabel: 'Compara',
    secondaryTo: '/category/televisions',
  },
];

const FEATURES = [
  {
    title: 'Enter your Location',
    desc: 'So we know where we should sent our products.',
    icon: (
      <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
        <path d="M3 7l9-4 9 4-9 4-9-4Z" stroke="#0a1838" strokeWidth="1.5" strokeLinejoin="round" />
        <path d="M3 7v10l9 4 9-4V7" stroke="#0a1838" strokeWidth="1.5" strokeLinejoin="round" />
        <path d="m12 11 0 10" stroke="#0a1838" strokeWidth="1.5" />
      </svg>
    ),
  },
  {
    title: 'Make an Account',
    desc: 'So you can access to all our shopping features.',
    icon: (
      <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="8" r="4" stroke="#0a1838" strokeWidth="1.5" />
        <path d="M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6" stroke="#0a1838" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    title: 'Free Delivery',
    desc: 'Check which products will get you without costing a penny!',
    icon: (
      <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="9" stroke="#0a1838" strokeWidth="1.5" />
        <path d="M12 7v5l3 2" stroke="#0a1838" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    title: 'Most Popular',
    desc: "Check out what's all the people's racket about!",
    icon: (
      <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
        <path
          d="M5 13a7 7 0 0 1 14 0c0 1.5-.4 3-1 4H6c-.6-1-1-2.5-1-4Z"
          stroke="#0a1838"
          strokeWidth="1.5"
        />
        <path d="m9 17 4-7-1 6h3" stroke="#0a1838" strokeWidth="1.5" strokeLinejoin="round" />
      </svg>
    ),
  },
];

const Home = () => {
  const dispatch = useAppDispatch();
  const { todayDeals, loading } = useAppSelector((state) => state.products);
  const [slide, setSlide] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    dispatch(fetchTodayDeals());
  }, [dispatch]);

  useEffect(() => {
    const t = setInterval(() => setSlide((s) => (s + 1) % SLIDES.length), 7000);
    return () => clearInterval(t);
  }, []);

  const scrollDeals = (dir: number) => {
    if (!carouselRef.current) return;
    carouselRef.current.scrollBy({ left: dir * 280, behavior: 'smooth' });
  };

  const current = SLIDES[slide];

  return (
    <div className="home">
      <section className="home__hero">
        <div className="home__hero-content container">
          <h1>{current.title}</h1>
          <p>{current.subtitle}</p>
          <div className="home__hero-actions">
            <Link to={current.primaryTo} className="btn btn--teal">
              {current.primaryLabel}
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path
                  d="m9 6 6 6-6 6"
                  stroke="#0a1838"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </Link>
            <Link to={current.secondaryTo} className="btn btn--ghost">
              {current.secondaryLabel}
            </Link>
          </div>

          <div className="home__hero-dots">
            {SLIDES.map((_, i) => (
              <button
                key={i}
                className={`home__hero-dot ${i === slide ? 'is-active' : ''}`}
                onClick={() => setSlide(i)}
                aria-label={`Slide ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="home__features container">
        <h2 className="home__features-title">Check some of these things out!</h2>
        <div className="home__features-grid">
          {FEATURES.map((f) => (
            <article key={f.title} className="feature-card">
              <h3>{f.title}</h3>
              <div className="feature-card__icon">{f.icon}</div>
              <p>{f.desc}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="home__deals container">
        <div className="home__deals-card">
          <h2 className="home__deals-title">Today's items on sale</h2>
          <div className="home__deals-row">
            <div className="home__deals-track" ref={carouselRef}>
              {loading.todayDeals
                ? Array.from({ length: 4 }).map((_, i) => (
                    <div className="home__deals-item" key={i}>
                      <ProductCardSkeleton />
                    </div>
                  ))
                : todayDeals.map((p) => (
                    <div className="home__deals-item" key={p.id}>
                      <ProductCard product={p} />
                    </div>
                  ))}
            </div>
            <button
              className="home__deals-next"
              type="button"
              onClick={() => scrollDeals(1)}
              aria-label="Next"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <path
                  d="m9 6 6 6-6 6"
                  stroke="#0a1838"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;

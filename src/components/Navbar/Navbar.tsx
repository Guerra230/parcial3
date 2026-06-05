import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CATEGORIES, POPULAR_SEARCHES } from '../../data/categories';
import { getRecommended, searchProducts } from '../../services/productService';
import type { Product } from '../../types/product';
import { useAppSelector, useAppDispatch } from '../../app/store/hooks';
import { selectCartItemCount } from '../../app/store/slices/cartSlice';
import { selectFavoriteCount } from '../../app/store/slices/favoritesSlice';
import { signOut } from '../../app/store/slices/authSlice';
import { formatCOP } from '../../utils/formatters';
import { useDebounce } from '../../hooks/useDebounce';
import Logo from './Logo';
import './Navbar.css';

const Navbar = () => {
  const dispatch = useAppDispatch();
  const itemCount = useAppSelector(selectCartItemCount);
  const favCount = useAppSelector(selectFavoriteCount);
  const user = useAppSelector((state) => state.auth.user);

  const [query, setQuery] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [recommended, setRecommended] = useState<Product[]>([]);
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const searchRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLDivElement>(null);
  const debouncedQuery = useDebounce(query, 150);

  useEffect(() => {
    getRecommended().then(setRecommended);
  }, []);

  useEffect(() => {
    if (!debouncedQuery) {
      setSearchResults([]);
      return;
    }
    searchProducts(debouncedQuery).then((res) => setSearchResults(res.slice(0, 5)));
  }, [debouncedQuery]);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node))
        setSearchOpen(false);
      if (navRef.current && !navRef.current.contains(e.target as Node))
        setActiveMenu(null);
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchOpen(false);
    navigate(`/search?q=${encodeURIComponent(query.trim())}`);
  };

  const handleSuggestClick = (term: string) => {
    setQuery(term);
    setSearchOpen(false);
    navigate(`/search?q=${encodeURIComponent(term)}`);
  };

  const handleSignOut = async () => {
    await dispatch(signOut());
    navigate('/');
  };

  const activeCategory = CATEGORIES.find((c) => c.id === activeMenu);

  return (
    <header className="navbar">
      <div className="navbar__top">
        <div className="navbar__top-inner container">
          <Link to="/" className="navbar__logo" aria-label="CoreSystems home">
            <Logo />
            <span className="navbar__brand">
              core<span>Systems</span>
            </span>
          </Link>

          <div className="navbar__search-wrapper" ref={searchRef}>
            <form className="navbar__search" onSubmit={handleSubmit}>
              <input
                type="text"
                value={query}
                placeholder={searchOpen ? 'What are you looking for?' : 'Gaming Laptop'}
                onFocus={() => setSearchOpen(true)}
                onChange={(e) => setQuery(e.target.value)}
                aria-label="Search products"
              />
              <button type="submit" className="navbar__search-btn" aria-label="Search">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <circle cx="11" cy="11" r="7" stroke="#0a1838" strokeWidth="2" />
                  <path d="m20 20-3.5-3.5" stroke="#0a1838" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </button>
            </form>

            {searchOpen && (
              <div className="navbar__search-panel">
                <div className="navbar__search-cols">
                  <div className="navbar__search-col">
                    <h4 className="navbar__panel-title">
                      {query ? 'Resultados' : 'the most searched'}
                    </h4>
                    {query ? (
                      <ul className="navbar__results">
                        {searchResults.length === 0 && (
                          <li className="navbar__results-empty">Sin coincidencias</li>
                        )}
                        {searchResults.map((p) => (
                          <li key={p.id}>
                            <Link to={`/product/${p.id}`} onClick={() => setSearchOpen(false)}>
                              <img src={p.images[0]} alt="" />
                              <span>{p.name}</span>
                            </Link>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <div className="navbar__chips">
                        {POPULAR_SEARCHES.map((term) => (
                          <button
                            key={term}
                            className="navbar__chip"
                            onClick={() => handleSuggestClick(term)}
                            type="button"
                          >
                            {term}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="navbar__search-col navbar__search-col--right">
                    <h4 className="navbar__panel-title">Recommended products</h4>
                    <ul className="navbar__recommended">
                      {recommended.map((p) => (
                        <li key={p.id}>
                          <Link to={`/product/${p.id}`} onClick={() => setSearchOpen(false)}>
                            <img src={p.images[0]} alt="" />
                            <div className="navbar__recommended-meta">
                              <p>{p.name}</p>
                              <div className="navbar__recommended-rating">
                                <span>{p.rating.toFixed(1)}</span>
                                <span className="navbar__stars">★★★★★</span>
                                <span>({p.reviews})</span>
                              </div>
                              <strong>{formatCOP(p.price)}</strong>
                            </div>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="navbar__icons">
            <Link to="/favorites" className="navbar__icon-btn" aria-label="Wishlist">
              <svg width="26" height="26" viewBox="0 0 24 24" fill={favCount > 0 ? '#5eead4' : 'none'}>
                <path
                  d="M12 21s-7-4.5-9.5-9A5.5 5.5 0 0 1 12 6a5.5 5.5 0 0 1 9.5 6c-2.5 4.5-9.5 9-9.5 9Z"
                  stroke="#5eead4"
                  strokeWidth="1.6"
                />
              </svg>
              {favCount > 0 && <span className="navbar__cart-badge">{favCount}</span>}
            </Link>

            {user ? (
              <button
                className="navbar__icon-btn"
                aria-label="Sign out"
                type="button"
                onClick={handleSignOut}
                title={`Cerrar sesión (${user.email})`}
              >
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="8" r="4" stroke="#5eead4" strokeWidth="1.6" />
                  <path d="M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6" stroke="#5eead4" strokeWidth="1.6" strokeLinecap="round" />
                </svg>
                <span className="navbar__user-dot" aria-hidden="true" />
              </button>
            ) : (
              <Link to="/login" className="navbar__icon-btn" aria-label="Account">
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="8" r="4" stroke="#5eead4" strokeWidth="1.6" />
                  <path d="M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6" stroke="#5eead4" strokeWidth="1.6" strokeLinecap="round" />
                </svg>
              </Link>
            )}

            <Link to="/cart" className="navbar__icon-btn navbar__cart" aria-label="Cart">
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
                <path
                  d="M5 7h14l-1.5 11a2 2 0 0 1-2 1.7H8.5a2 2 0 0 1-2-1.7L5 7Z"
                  stroke="#5eead4"
                  strokeWidth="1.6"
                  strokeLinejoin="round"
                />
                <path d="M9 7V5a3 3 0 0 1 6 0v2" stroke="#5eead4" strokeWidth="1.6" strokeLinecap="round" />
              </svg>
              {itemCount > 0 && <span className="navbar__cart-badge">{itemCount}</span>}
            </Link>
          </div>
        </div>
      </div>

      <div className={`navbar__categories ${mobileMenuOpen ? 'is-open' : ''}`} ref={navRef}>
        <div className="navbar__categories-inner container">
          <button
            className="navbar__all"
            type="button"
            onClick={() => setMobileMenuOpen((v) => !v)}
            onMouseEnter={() => setActiveMenu(null)}
            aria-expanded={mobileMenuOpen}
            aria-label="Toggle categories menu"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <path d="M4 6h16M4 12h16M4 18h16" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
            </svg>
            <span>All Categories</span>
          </button>

          <ul className="navbar__nav">
            {CATEGORIES.map((cat) => (
              <li
                key={cat.id}
                className={`navbar__nav-item ${cat.highlight ? 'navbar__nav-item--highlight' : ''} ${
                  activeMenu === cat.id ? 'is-active' : ''
                }`}
                onMouseEnter={() => cat.megaMenu && setActiveMenu(cat.id)}
                onMouseLeave={() => setActiveMenu(null)}
              >
                <Link
                  to={cat.highlight ? `/search?tag=${cat.slug}` : `/category/${cat.slug}`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {cat.label}
                </Link>

                {activeMenu === cat.id && cat.megaMenu && (
                  <div className="navbar__mega" onMouseLeave={() => setActiveMenu(null)}>
                    <div className="navbar__mega-inner container">
                      {cat.megaMenu.map((col) => (
                        <div className="navbar__mega-col" key={col.title}>
                          <h3 className="navbar__mega-title">
                            <span className="navbar__mega-icon">{iconFor(col.icon)}</span>
                            {col.title}
                          </h3>
                          <hr className="navbar__mega-divider" />
                          {col.groups.map((group) => (
                            <div key={group.heading} className="navbar__mega-group">
                              <h4>{group.heading}</h4>
                              {group.items.map((it, idx) => (
                                <p key={idx}>{it}</p>
                              ))}
                            </div>
                          ))}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>

        {activeCategory?.megaMenu && <div className="navbar__mega-spacer" />}
      </div>
    </header>
  );
};

const iconFor = (kind?: string) => {
  switch (kind) {
    case 'phone': return '📱';
    case 'laptop': return '💻';
    case 'desktop': return '🖥️';
    case 'gaming': return '🎮';
    case 'tv': return '📺';
    case 'tablet': return '📲';
    case 'console': return '🎬';
    case 'controller': return '🎮';
    case 'badge': return '🏅';
    case 'watch': return '⌚';
    case 'search': return '🔍';
    default: return '•';
  }
};

export default Navbar;

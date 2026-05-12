import { Link } from 'react-router-dom';
import { useFavorites } from '../../context/FavoritesContext';
import ProductListing from '../../components/ProductListing/ProductListing';
import './Favorites.css';

const Favorites = () => {
  const { favorites, clear } = useFavorites();

  if (favorites.length === 0) {
    return (
      <div className="favorites-empty">
        <div className="favorites-empty__icon">
          <svg width="120" height="120" viewBox="0 0 24 24" fill="none">
            <path
              d="M12 21s-7-4.5-9.5-9A5.5 5.5 0 0 1 12 6a5.5 5.5 0 0 1 9.5 6c-2.5 4.5-9.5 9-9.5 9Z"
              stroke="#9ca3af"
              strokeWidth="1.5"
            />
          </svg>
        </div>
        <h1>Aún no tienes favoritos</h1>
        <p>Marca productos con el corazón para verlos aquí.</p>
        <Link to="/" className="favorites-empty__cta">
          Explora productos
        </Link>
      </div>
    );
  }

  return (
    <div className="favorites">
      <div className="favorites__bar container">
        <h1>Mis favoritos ({favorites.length})</h1>
        <button className="favorites__clear" type="button" onClick={clear}>
          Vaciar lista
        </button>
      </div>
      <ProductListing products={favorites} title="favoritos" />
    </div>
  );
};

export default Favorites;

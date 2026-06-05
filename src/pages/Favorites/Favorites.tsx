import { toast } from 'react-hot-toast';
import { useAppDispatch, useAppSelector } from '../../app/store/hooks';
import { clearFavorites, selectFavoriteItems } from '../../app/store/slices/favoritesSlice';
import ProductListing from '../../components/ProductListing/ProductListing';
import EmptyState from '../../components/ui/EmptyState';
import './Favorites.css';

const FavEmptyIcon = () => (
  <svg width="120" height="120" viewBox="0 0 24 24" fill="none">
    <path
      d="M12 21s-7-4.5-9.5-9A5.5 5.5 0 0 1 12 6a5.5 5.5 0 0 1 9.5 6c-2.5 4.5-9.5 9-9.5 9Z"
      stroke="#9ca3af"
      strokeWidth="1.5"
    />
  </svg>
);

const Favorites = () => {
  const dispatch = useAppDispatch();
  const favorites = useAppSelector(selectFavoriteItems);

  const handleClear = () => {
    dispatch(clearFavorites());
    toast.success('Lista de favoritos vaciada');
  };

  if (favorites.length === 0) {
    return (
      <EmptyState
        icon={<FavEmptyIcon />}
        title="Aún no tienes favoritos"
        description="Marca productos con el corazón para verlos aquí."
        actionLabel="Explorar productos"
        actionTo="/"
      />
    );
  }

  return (
    <div className="favorites">
      <div className="favorites__bar container">
        <h1>Mis favoritos ({favorites.length})</h1>
        <button className="favorites__clear" type="button" onClick={handleClear}>
          Vaciar lista
        </button>
      </div>
      <ProductListing products={favorites} title="favoritos" />
    </div>
  );
};

export default Favorites;

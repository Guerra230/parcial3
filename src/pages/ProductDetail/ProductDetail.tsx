import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { useAppDispatch, useAppSelector } from '../../app/store/hooks';
import {
  fetchProductById,
  fetchRelatedProducts,
  clearCurrentProduct,
} from '../../app/store/slices/productsSlice';
import { addItem } from '../../app/store/slices/cartSlice';
import {
  toggleFavorite,
  selectIsFavorite,
} from '../../app/store/slices/favoritesSlice';
import { formatCOP } from '../../utils/formatters';
import { Skeleton } from '../../components/ui/Skeleton';
import ProductCard from '../../components/ProductCard/ProductCard';
import './ProductDetail.css';

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { currentProduct: product, relatedProducts: related, loading } =
    useAppSelector((state) => state.products);
  const isFav = useAppSelector(selectIsFavorite(id ?? ''));

  const [activeImg, setActiveImg] = useState(0);
  const [qty, setQty] = useState(1);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    if (!id) return;
    setActiveImg(0);
    setQty(1);
    setExpanded(false);
    dispatch(fetchProductById(id));
    dispatch(fetchRelatedProducts(id));
    return () => {
      dispatch(clearCurrentProduct());
    };
  }, [id, dispatch]);

  const handleAdd = () => {
    if (!product) return;
    dispatch(addItem({ product, quantity: qty }));
    toast.success('Agregado al carrito');
  };

  const handleBuy = () => {
    if (!product) return;
    dispatch(addItem({ product, quantity: qty }));
    navigate('/cart');
  };

  const handleToggleFav = () => {
    if (!product) return;
    dispatch(toggleFavorite(product));
    toast.success(isFav ? 'Eliminado de favoritos' : 'Agregado a favoritos');
  };

  if (loading.currentProduct) {
    return (
      <div className="pd container">
        <Skeleton height="2rem" width="60%" />
        <div style={{ marginTop: '2rem', display: 'flex', gap: '2rem' }}>
          <Skeleton width="400px" height="400px" borderRadius="16px" />
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <Skeleton height="2.5rem" width="50%" />
            <Skeleton height="1rem" width="30%" />
            <Skeleton height="3rem" width="40%" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="pd container">
        <p className="pd__loading">Producto no encontrado.</p>
        <Link to="/" className="pd__back">Volver al inicio</Link>
      </div>
    );
  }

  return (
    <div className="pd container">
      <h1 className="pd__title">{product.name}</h1>
      <hr className="pd__divider" />

      <section className="pd__main">
        <div className="pd__thumbs">
          {product.images.map((img, idx) => (
            <button
              key={idx}
              className={`pd__thumb ${activeImg === idx ? 'is-active' : ''}`}
              onClick={() => setActiveImg(idx)}
              aria-label={`Imagen ${idx + 1}`}
              type="button"
            >
              <img src={img} alt="" />
            </button>
          ))}
        </div>

        <div className="pd__gallery">
          <img src={product.images[activeImg]} alt={product.name} />
        </div>

        <div className="pd__buy">
          <p className="pd__price">{formatCOP(product.price)} COP</p>
          {product.oldPrice && (
            <p className="pd__old-price">{formatCOP(product.oldPrice)} COP</p>
          )}

          <div className="pd__buy-row">
            <div className="pd__qty">
              <button
                type="button"
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                aria-label="Disminuir"
              >
                -
              </button>
              <span>{qty}</span>
              <button
                type="button"
                onClick={() => setQty((q) => Math.min(product.stock, q + 1))}
                aria-label="Aumentar"
              >
                +
              </button>
            </div>
            <button className="pd__add" type="button" onClick={handleAdd}>
              Agregar al carrito
            </button>
          </div>

          <div className="pd__buy-row pd__buy-row--bottom">
            <button className="pd__buy-btn" type="button" onClick={handleBuy}>
              Comprar
            </button>
            <button
              className={`pd__fav ${isFav ? 'is-fav' : ''}`}
              type="button"
              onClick={handleToggleFav}
              aria-label="Favoritos"
              title={isFav ? 'Quitar de favoritos' : 'Agregar a favoritos'}
            >
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill={isFav ? '#ef4444' : 'none'}
              >
                <path
                  d="M12 21s-7-4.5-9.5-9A5.5 5.5 0 0 1 12 6a5.5 5.5 0 0 1 9.5 6c-2.5 4.5-9.5 9-9.5 9Z"
                  stroke={isFav ? '#ef4444' : '#0a1838'}
                  strokeWidth="1.6"
                />
              </svg>
            </button>
          </div>

          <ul className="pd__specs">
            {product.shortSpecs.map((s) => (
              <li key={s.label}>
                <span className="pd__spec-bullet">•</span>
                <span className="pd__spec-label">{s.label}:</span>
                <span className="pd__spec-value">{s.value}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <hr className="pd__divider" />

      <section className="pd__description">
        <h2>Descripción general</h2>
        <p>{product.description}</p>

        {expanded &&
          product.sections?.map((s) => (
            <div key={s.title} className="pd__section">
              <h3>{s.title}</h3>
              {s.body.split('\n').map((line, i) => (
                <p key={i}>{line}</p>
              ))}
            </div>
          ))}

        <button
          className="pd__expand"
          type="button"
          onClick={() => setExpanded((e) => !e)}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path
              d={expanded ? 'm6 15 6-6 6 6' : 'm6 9 6 6 6-6'}
              stroke="#0a1838"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          {expanded ? 'Ver menos' : 'Ver más'}
        </button>
      </section>

      <hr className="pd__divider" />

      <section className="pd__related">
        <h2>Más Productos</h2>
        <div className="pd__related-grid">
          {related.map((r) => (
            <ProductCard key={r.id} product={r} />
          ))}
        </div>
      </section>
    </div>
  );
};

export default ProductDetail;

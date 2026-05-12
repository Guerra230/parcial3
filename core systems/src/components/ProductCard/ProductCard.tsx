import { Link } from 'react-router-dom';
import type { Product } from '../../types/product';
import './ProductCard.css';

interface Props {
  product: Product;
}

const ProductCard = ({ product }: Props) => {
  return (
    <Link to={`/product/${product.id}`} className="product-card">
      <div className="product-card__image">
        <img src={product.images[0]} alt={product.name} loading="lazy" />
      </div>
      <h3 className="product-card__name">{product.name}</h3>
      <p className="product-card__price">$ {product.price.toLocaleString('es-CO').replace(/,/g, '.')}</p>
    </Link>
  );
};

export default ProductCard;

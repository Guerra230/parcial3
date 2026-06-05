import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { formatCOP } from '../../services/formatService';
import './Cart.css';

const Cart = () => {
  const { items, summary, updateQuantity, removeItem, clear } = useCart();

  if (items.length === 0) {
    return (
      <div className="cart-empty">
        <div className="cart-empty__icon">
          <svg width="120" height="120" viewBox="0 0 120 120" fill="none">
            <path
              d="M30 38h60l-7 56a8 8 0 0 1-8 7H45a8 8 0 0 1-8-7l-7-56Z"
              stroke="#9ca3af"
              strokeWidth="3"
              strokeLinejoin="round"
            />
            <path
              d="M44 38v-8a16 16 0 0 1 32 0v8"
              stroke="#9ca3af"
              strokeWidth="3"
              strokeLinecap="round"
            />
          </svg>
        </div>
        <h1 className="cart-empty__title">Tu carrito esta vacio</h1>
        <p className="cart-empty__msg">
          Descubre nuestros productos y encuentra lo que buscas
        </p>
        <Link to="/" className="cart-empty__cta">
          Explora productos
        </Link>
      </div>
    );
  }

  return (
    <div className="cart container">
      <div className="cart__items">
        {items.map((it) => (
          <div className="cart__item" key={it.product.id}>
            <Link to={`/product/${it.product.id}`} className="cart__item-img">
              <img src={it.product.images[0]} alt={it.product.name} />
            </Link>
            <div className="cart__item-meta">
              <Link to={`/product/${it.product.id}`} className="cart__item-name">
                {it.product.name}
              </Link>
              <p className="cart__item-price">
                {formatCOP(it.product.price)} COP
              </p>
            </div>
            <button
              className="cart__item-trash"
              type="button"
              aria-label="Eliminar"
              onClick={() => removeItem(it.product.id)}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <path
                  d="M5 7h14M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2M7 7l1 12a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2l1-12"
                  stroke="#ef4444"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
            <div className="cart__qty">
              <button
                type="button"
                onClick={() =>
                  updateQuantity(it.product.id, it.quantity - 1)
                }
                aria-label="Decrease"
              >
                -
              </button>
              <span>{it.quantity}</span>
              <button
                type="button"
                onClick={() =>
                  updateQuantity(it.product.id, it.quantity + 1)
                }
                aria-label="Increase"
              >
                +
              </button>
            </div>
          </div>
        ))}

        <button className="cart__clear" type="button" onClick={clear}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path
              d="M5 7h14M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2M7 7l1 12a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2l1-12"
              stroke="#ef4444"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Vaciar carrito
        </button>
      </div>

      <aside className="cart__summary">
        <h2 className="cart__summary-title">Resumen del pedido</h2>
        <div className="cart__row">
          <span>Subtotal</span>
          <strong>{formatCOP(summary.subtotal)} COP</strong>
        </div>
        <div className="cart__row">
          <span>Envio</span>
          <strong className="cart__row-free">GRATIS</strong>
        </div>
        <div className="cart__row">
          <span>Descuentos</span>
          <strong>$0</strong>
        </div>

        <hr className="cart__sep" />

        <div className="cart__row cart__row--total">
          <span>Total</span>
          <strong>{formatCOP(summary.total)} COP</strong>
        </div>
        <p className="cart__cuotas">12 cuotas sin interes</p>

        <button className="cart__buy" type="button">
          Comprar
        </button>
        <Link to="/" className="cart__continue">
          Seguir comprando
        </Link>

        <div className="cart__secure">
          <strong>Pago seguro</strong>
          <small>Tus datos están seguros</small>
        </div>
      </aside>
    </div>
  );
};

export default Cart;

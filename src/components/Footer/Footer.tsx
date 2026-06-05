import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer__top container">
        <div className="footer__col">
          <h4>CoreSystems</h4>
          <p>The best tech in one place. Tu tienda de tecnología de confianza.</p>
        </div>
        <div className="footer__col">
          <h4>Comprar</h4>
          <ul>
            <li><Link to="/category/smartphones">Smartphones</Link></li>
            <li><Link to="/category/laptops">Laptops</Link></li>
            <li><Link to="/category/consoles">Consoles</Link></li>
            <li><Link to="/category/televisions">Televisions</Link></li>
          </ul>
        </div>
        <div className="footer__col">
          <h4>Ayuda</h4>
          <ul>
            <li><Link to="/login">Mi cuenta</Link></li>
            <li><Link to="/cart">Mi carrito</Link></li>
            <li><a href="#">Contacto</a></li>
            <li><a href="#">Envíos</a></li>
          </ul>
        </div>
        <div className="footer__col">
          <h4>Síguenos</h4>
          <div className="footer__social">
            <a href="#" aria-label="Facebook">f</a>
            <a href="#" aria-label="Instagram">ig</a>
            <a href="#" aria-label="Twitter">x</a>
          </div>
        </div>
      </div>
      <div className="footer__bottom">
        <div className="container">
          <p>© {new Date().getFullYear()} CoreSystems. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

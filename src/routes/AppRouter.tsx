import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from '../components/Navbar/Navbar';
import Footer from '../components/Footer/Footer';
import LoadingSpinner from '../components/ui/LoadingSpinner';

const Home = lazy(() => import('../pages/Home/Home'));
const ProductDetail = lazy(() => import('../pages/ProductDetail/ProductDetail'));
const Cart = lazy(() => import('../pages/Cart/Cart'));
const Search = lazy(() => import('../pages/Search/Search'));
const Login = lazy(() => import('../pages/Login/Login'));
const Register = lazy(() => import('../pages/Register/Register'));
const Category = lazy(() => import('../pages/Category/Category'));
const Favorites = lazy(() => import('../pages/Favorites/Favorites'));

const PageLoader = () => (
  <div style={{ display: 'flex', justifyContent: 'center', padding: '6rem' }}>
    <LoadingSpinner />
  </div>
);

const AppRouter = () => (
  <div className="app-shell">
    <Navbar />
    <main>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/search" element={<Search />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/category/:slug" element={<Category />} />
          <Route path="/favorites" element={<Favorites />} />
          <Route path="*" element={<Home />} />
        </Routes>
      </Suspense>
    </main>
    <Footer />
  </div>
);

export default AppRouter;

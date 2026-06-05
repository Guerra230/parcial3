import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAppDispatch } from '../../app/store/hooks';
import { fetchAllProducts } from '../../app/store/slices/productsSlice';
import ProductListing from '../../components/ProductListing/ProductListing';
import { getAllProducts, searchProducts } from '../../services/productService';
import type { Product } from '../../types/product';

const Search = () => {
  const [params] = useSearchParams();
  const q = params.get('q') ?? '';
  const tag = params.get('tag') ?? '';
  const dispatch = useAppDispatch();
  const [results, setResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    const run = async () => {
      try {
        if (tag === 'on-sale') {
          const all = await getAllProducts();
          setResults(all.filter((p) => p.badges?.includes('on-sale')));
        } else if (tag === 'trending') {
          const all = await getAllProducts();
          const trending = all.filter((p) => p.badges?.includes('trending'));
          setResults(trending.length ? trending : all);
        } else {
          const found = await searchProducts(q);
          setResults(found);
        }
      } finally {
        setLoading(false);
      }
    };
    run();
    // Also sync products into store
    dispatch(fetchAllProducts());
  }, [q, tag, dispatch]);

  return (
    <ProductListing
      products={results}
      loading={loading}
      title={q || tag || 'todos los productos'}
      showBanner
    />
  );
};

export default Search;

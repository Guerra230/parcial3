import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductListing from '../../components/ProductListing/ProductListing';
import {
  getAllProducts,
  searchProducts,
} from '../../services/productService';
import type { Product } from '../../types/product';

const Search = () => {
  const [params] = useSearchParams();
  const q = params.get('q') ?? '';
  const tag = params.get('tag') ?? '';
  const [results, setResults] = useState<Product[]>([]);

  useEffect(() => {
    if (tag === 'on-sale') {
      getAllProducts().then((all) =>
        setResults(all.filter((p) => p.badges?.includes('on-sale')))
      );
      return;
    }
    if (tag === 'trending') {
      getAllProducts().then((all) =>
        setResults(
          all.filter((p) => p.badges?.includes('trending')).length
            ? all.filter((p) => p.badges?.includes('trending'))
            : all
        )
      );
      return;
    }
    searchProducts(q).then(setResults);
  }, [q, tag]);

  return (
    <ProductListing
      products={results}
      title={q || tag || 'todos los productos'}
      showBanner
    />
  );
};

export default Search;

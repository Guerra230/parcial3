import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import ProductListing from '../../components/ProductListing/ProductListing';
import { getProductsByCategory } from '../../services/productService';
import type { Product, ProductCategory } from '../../types/product';

const labels: Record<string, string> = {
  smartphones: 'Smartphones',
  laptops: 'Laptops',
  tablets: 'Tablets',
  consoles: 'Consoles',
  televisions: 'Televisions',
  smartwatches: 'Smartwatches',
  audio: 'Audio',
  'gaming-pc': 'Gaming PC',
};

const Category = () => {
  const { slug = '' } = useParams<{ slug: string }>();
  const [items, setItems] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    getProductsByCategory(slug as ProductCategory)
      .then(setItems)
      .finally(() => setLoading(false));
  }, [slug]);

  return (
    <ProductListing
      products={items}
      loading={loading}
      title={labels[slug] ?? slug}
      showBanner={slug === 'smartphones'}
    />
  );
};

export default Category;

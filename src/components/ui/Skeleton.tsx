import './Skeleton.css';

interface SkeletonProps {
  width?: string;
  height?: string;
  borderRadius?: string;
  className?: string;
}

export const Skeleton = ({
  width = '100%',
  height = '1rem',
  borderRadius = '6px',
  className = '',
}: SkeletonProps) => (
  <div
    className={`skeleton ${className}`}
    style={{ width, height, borderRadius }}
    aria-hidden="true"
  />
);

export const ProductCardSkeleton = () => (
  <div className="skeleton-product-card">
    <Skeleton height="180px" borderRadius="10px" />
    <Skeleton height="1rem" className="skeleton-product-card__name" />
    <Skeleton width="60%" height="1.2rem" />
  </div>
);

export const ProductListSkeleton = () => (
  <div className="skeleton-product-list">
    {Array.from({ length: 4 }).map((_, i) => (
      <div key={i} className="skeleton-product-list__item">
        <Skeleton width="180px" height="180px" borderRadius="10px" />
        <div className="skeleton-product-list__meta">
          <Skeleton height="1.2rem" />
          <Skeleton width="70%" height="1rem" />
          <Skeleton width="40%" height="1.4rem" />
        </div>
      </div>
    ))}
  </div>
);

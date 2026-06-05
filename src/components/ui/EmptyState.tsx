import { Link } from 'react-router-dom';
import './EmptyState.css';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  actionLabel?: string;
  actionTo?: string;
  onAction?: () => void;
}

const DefaultIcon = () => (
  <svg width="80" height="80" viewBox="0 0 80 80" fill="none" aria-hidden="true">
    <circle cx="40" cy="40" r="38" stroke="#d1d5db" strokeWidth="2" />
    <path
      d="M28 40h24M40 28v24"
      stroke="#d1d5db"
      strokeWidth="2.5"
      strokeLinecap="round"
    />
  </svg>
);

const EmptyState = ({
  icon,
  title,
  description,
  actionLabel,
  actionTo,
  onAction,
}: EmptyStateProps) => (
  <div className="empty-state">
    <div className="empty-state__icon">{icon ?? <DefaultIcon />}</div>
    <h2 className="empty-state__title">{title}</h2>
    {description && <p className="empty-state__desc">{description}</p>}
    {actionLabel && actionTo && (
      <Link to={actionTo} className="empty-state__cta">
        {actionLabel}
      </Link>
    )}
    {actionLabel && onAction && !actionTo && (
      <button type="button" className="empty-state__cta" onClick={onAction}>
        {actionLabel}
      </button>
    )}
  </div>
);

export default EmptyState;

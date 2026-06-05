import './LoadingSpinner.css';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
}

const LoadingSpinner = ({ size = 'md' }: LoadingSpinnerProps) => (
  <div className={`spinner spinner--${size}`} role="status" aria-label="Cargando">
    <div className="spinner__circle" />
  </div>
);

export default LoadingSpinner;

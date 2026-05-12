const Logo = () => (
  <svg
    width="44"
    height="44"
    viewBox="0 0 64 64"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <defs>
      <linearGradient id="cs-grad" x1="0" y1="0" x2="64" y2="64">
        <stop offset="0%" stopColor="#5eead4" />
        <stop offset="60%" stopColor="#3b82f6" />
        <stop offset="100%" stopColor="#8b5cf6" />
      </linearGradient>
    </defs>
    <circle cx="20" cy="22" r="14" fill="url(#cs-grad)" />
    <circle cx="40" cy="36" r="10" fill="url(#cs-grad)" opacity="0.85" />
    <circle cx="46" cy="50" r="5" fill="url(#cs-grad)" opacity="0.7" />
    <circle cx="14" cy="48" r="3" fill="url(#cs-grad)" opacity="0.6" />
  </svg>
);

export default Logo;

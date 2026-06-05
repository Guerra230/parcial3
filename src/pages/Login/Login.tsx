import { useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'react-hot-toast';
import { loginSchema, type LoginFormData } from '../../utils/validators';
import { useAuth } from '../../hooks/useAuth';
import { isSupabaseConfigured } from '../../lib/supabase';
import './Login.css';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { signIn, loading, error, isAuthenticated, clearError } = useAuth();
  const from = (location.state as { from?: Location })?.from?.pathname ?? '/';

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({ resolver: zodResolver(loginSchema) });

  useEffect(() => {
    if (isAuthenticated) navigate(from, { replace: true });
  }, [isAuthenticated, navigate, from]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      clearError();
    }
  }, [error, clearError]);

  const onSubmit = async (data: LoginFormData) => {
    if (!isSupabaseConfigured) {
      toast.error('Supabase no está configurado. Configura las variables de entorno.');
      return;
    }
    const result = await signIn(data);
    if ('payload' in result && result.payload) {
      toast.success('¡Bienvenido!');
    }
  };

  return (
    <div className="login">
      <div className="login__card">
        <header className="login__head">
          <span className="login__icon" aria-hidden="true">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="8" r="4" stroke="#0a1838" strokeWidth="1.6" />
              <path
                d="M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6"
                stroke="#0a1838"
                strokeWidth="1.6"
                strokeLinecap="round"
              />
            </svg>
          </span>
          <h1>Iniciar sesión</h1>
        </header>

        {!isSupabaseConfigured && (
          <div className="login__warning">
            Modo demo — Supabase no está configurado.{' '}
            <a href="https://supabase.com" target="_blank" rel="noopener noreferrer">
              Configúralo aquí
            </a>
          </div>
        )}

        <form className="login__form" onSubmit={handleSubmit(onSubmit)} noValidate>
          <label className="login__label" htmlFor="email">
            Email
          </label>
          <input
            id="email"
            type="email"
            className={`login__input ${errors.email ? 'login__input--error' : ''}`}
            placeholder="tu@email.com"
            autoComplete="email"
            {...register('email')}
          />
          {errors.email && <span className="login__error">{errors.email.message}</span>}

          <label className="login__label" htmlFor="password">
            Contraseña
          </label>
          <input
            id="password"
            type="password"
            className={`login__input ${errors.password ? 'login__input--error' : ''}`}
            placeholder="••••••••"
            autoComplete="current-password"
            {...register('password')}
          />
          {errors.password && <span className="login__error">{errors.password.message}</span>}

          <button type="submit" className="login__submit" disabled={loading}>
            {loading ? 'Iniciando sesión...' : 'Continuar'}
          </button>
        </form>

        <Link to="/forgot-password" className="login__trouble">
          ¿Olvidaste tu contraseña?
        </Link>

        <div className="login__divider">
          <span>¿No tienes cuenta?</span>
        </div>

        <Link to="/register" className="login__register-link">
          Crear una cuenta
        </Link>

        <p className="login__terms">
          Al continuar, aceptas nuestros{' '}
          <a href="#">Términos de Uso</a> y autorizas el tratamiento de tus datos
          personales conforme a nuestra <a href="#">Política de Privacidad</a>.
        </p>
      </div>
    </div>
  );
};

export default Login;

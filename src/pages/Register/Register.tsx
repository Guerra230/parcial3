import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'react-hot-toast';
import { registerSchema, type RegisterFormData } from '../../utils/validators';
import { useAuth } from '../../hooks/useAuth';
import { isSupabaseConfigured } from '../../lib/supabase';
import './Register.css';

const Register = () => {
  const navigate = useNavigate();
  const { signUp, loading, error, isAuthenticated, clearError } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({ resolver: zodResolver(registerSchema) });

  useEffect(() => {
    if (isAuthenticated) navigate('/', { replace: true });
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      clearError();
    }
  }, [error, clearError]);

  const onSubmit = async (data: RegisterFormData) => {
    if (!isSupabaseConfigured) {
      toast.error('Supabase no está configurado. Configura las variables de entorno.');
      return;
    }
    await signUp(data);
    toast.success('Cuenta creada. Revisa tu email para confirmar.');
  };

  return (
    <div className="register">
      <div className="register__card">
        <header className="register__head">
          <span className="register__icon" aria-hidden="true">
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
          <h1>Crear cuenta</h1>
        </header>

        {!isSupabaseConfigured && (
          <div className="register__warning">
            Modo demo — Supabase no está configurado.
          </div>
        )}

        <form className="register__form" onSubmit={handleSubmit(onSubmit)} noValidate>
          <label className="register__label" htmlFor="fullName">
            Nombre completo
          </label>
          <input
            id="fullName"
            type="text"
            className={`register__input ${errors.fullName ? 'register__input--error' : ''}`}
            placeholder="Tu nombre"
            autoComplete="name"
            {...register('fullName')}
          />
          {errors.fullName && (
            <span className="register__error">{errors.fullName.message}</span>
          )}

          <label className="register__label" htmlFor="email">
            Email
          </label>
          <input
            id="email"
            type="email"
            className={`register__input ${errors.email ? 'register__input--error' : ''}`}
            placeholder="tu@email.com"
            autoComplete="email"
            {...register('email')}
          />
          {errors.email && <span className="register__error">{errors.email.message}</span>}

          <label className="register__label" htmlFor="password">
            Contraseña
          </label>
          <input
            id="password"
            type="password"
            className={`register__input ${errors.password ? 'register__input--error' : ''}`}
            placeholder="Mínimo 6 caracteres"
            autoComplete="new-password"
            {...register('password')}
          />
          {errors.password && (
            <span className="register__error">{errors.password.message}</span>
          )}

          <label className="register__label" htmlFor="confirmPassword">
            Confirmar contraseña
          </label>
          <input
            id="confirmPassword"
            type="password"
            className={`register__input ${errors.confirmPassword ? 'register__input--error' : ''}`}
            placeholder="Repite tu contraseña"
            autoComplete="new-password"
            {...register('confirmPassword')}
          />
          {errors.confirmPassword && (
            <span className="register__error">{errors.confirmPassword.message}</span>
          )}

          <button type="submit" className="register__submit" disabled={loading}>
            {loading ? 'Creando cuenta...' : 'Crear cuenta'}
          </button>
        </form>

        <div className="register__divider">
          <span>¿Ya tienes cuenta?</span>
        </div>

        <Link to="/login" className="register__login-link">
          Iniciar sesión
        </Link>

        <p className="register__terms">
          Al registrarte, aceptas nuestros{' '}
          <a href="#">Términos de Uso</a> y nuestra <a href="#">Política de Privacidad</a>.
        </p>
      </div>
    </div>
  );
};

export default Register;

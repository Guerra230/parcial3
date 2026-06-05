-- ============================================================
-- SCHEMA COMPLETO ECOMMERCE — CoreSystems
-- Ejecutar en Supabase Dashboard > SQL Editor
-- ============================================================

-- Extensiones necesarias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================
-- TABLAS BASE
-- ============================================================

-- Tabla de usuarios (extiende auth.users de Supabase)
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL UNIQUE,
    full_name TEXT,
    avatar_url TEXT,
    role TEXT NOT NULL DEFAULT 'buyer' CHECK (role IN ('buyer', 'seller')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Tabla de tiendas (solo para sellers)
CREATE TABLE public.stores (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    owner_id UUID NOT NULL UNIQUE REFERENCES public.profiles(id) ON DELETE CASCADE,
    username TEXT NOT NULL UNIQUE,
    store_name TEXT NOT NULL UNIQUE,
    description TEXT,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Categorías
CREATE TABLE public.categories (
    id TEXT PRIMARY KEY,
    label TEXT NOT NULL,
    icon TEXT NOT NULL,
    sort_order INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Filtros de categoría (secciones main, accessories, more)
CREATE TABLE public.category_filters (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    category_id TEXT NOT NULL REFERENCES public.categories(id) ON DELETE CASCADE,
    section TEXT NOT NULL CHECK (section IN ('main', 'accessories', 'more')),
    section_title TEXT NOT NULL,
    filter_label TEXT,
    filter_items JSONB,
    more_label TEXT,
    sort_order INT NOT NULL DEFAULT 0
);

-- Marcas
CREATE TABLE public.brands (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL UNIQUE,
    slug TEXT NOT NULL UNIQUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Productos
CREATE TABLE public.products (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    brand_id UUID REFERENCES public.brands(id),
    brand_name TEXT NOT NULL,
    price BIGINT NOT NULL,
    original_price BIGINT,
    image_url TEXT,
    category_id TEXT REFERENCES public.categories(id),
    subcategory TEXT,
    rating NUMERIC(2,1) DEFAULT 0,
    review_count INT DEFAULT 0,
    stock INT NOT NULL DEFAULT 0,
    is_trending BOOLEAN NOT NULL DEFAULT FALSE,
    is_on_sale BOOLEAN NOT NULL DEFAULT FALSE,
    discount INT DEFAULT 0,
    color TEXT,
    specs JSONB DEFAULT '{}',
    badges JSONB DEFAULT '[]',
    description TEXT,
    seller_id UUID REFERENCES public.stores(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Índices de productos
CREATE INDEX idx_products_category ON public.products(category_id);
CREATE INDEX idx_products_brand ON public.products(brand_name);
CREATE INDEX idx_products_is_trending ON public.products(is_trending);
CREATE INDEX idx_products_is_on_sale ON public.products(is_on_sale);
CREATE INDEX idx_products_slug ON public.products(slug);

-- Búsquedas populares
CREATE TABLE public.popular_searches (
    id SERIAL PRIMARY KEY,
    term TEXT NOT NULL UNIQUE,
    sort_order INT NOT NULL DEFAULT 0
);

-- Productos recomendados (carrusel home / navbar)
CREATE TABLE public.recommended_products (
    id INT PRIMARY KEY,
    name TEXT NOT NULL,
    price BIGINT NOT NULL,
    image_url TEXT,
    category_id TEXT REFERENCES public.categories(id),
    rating NUMERIC(2,1) DEFAULT 0,
    review_count INT DEFAULT 0,
    badge TEXT,
    is_on_sale BOOLEAN NOT NULL DEFAULT FALSE,
    sort_order INT NOT NULL DEFAULT 0
);

-- Carrito
CREATE TABLE public.cart_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    product_id TEXT NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    quantity INT NOT NULL DEFAULT 1 CHECK (quantity > 0),
    added_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(user_id, product_id)
);

-- Favoritos
CREATE TABLE public.favorites (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    product_id TEXT NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    added_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(user_id, product_id)
);

-- ============================================================
-- FUNCIONES Y TRIGGERS
-- ============================================================

-- Auto-crear profile al registrar usuario
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
    INSERT INTO public.profiles (id, email, full_name, avatar_url)
    VALUES (
        NEW.id,
        NEW.email,
        NEW.raw_user_meta_data->>'full_name',
        NEW.raw_user_meta_data->>'avatar_url'
    );
    RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$;

CREATE TRIGGER set_profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER set_products_updated_at
    BEFORE UPDATE ON public.products
    FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER set_stores_updated_at
    BEFORE UPDATE ON public.stores
    FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Función upgrade buyer → seller
CREATE OR REPLACE FUNCTION public.upgrade_to_seller(
    p_user_id UUID,
    p_username TEXT,
    p_store_name TEXT
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
DECLARE
    v_profile public.profiles;
    v_store_exists BOOLEAN;
BEGIN
    SELECT * INTO v_profile FROM public.profiles WHERE id = p_user_id;
    IF NOT FOUND THEN
        RETURN jsonb_build_object('success', false, 'error', 'User not found');
    END IF;

    SELECT EXISTS(SELECT 1 FROM public.stores WHERE username = p_username) INTO v_store_exists;
    IF v_store_exists THEN
        RETURN jsonb_build_object('success', false, 'error', 'Username already taken');
    END IF;

    SELECT EXISTS(SELECT 1 FROM public.stores WHERE store_name = p_store_name) INTO v_store_exists;
    IF v_store_exists THEN
        RETURN jsonb_build_object('success', false, 'error', 'Store name already taken');
    END IF;

    INSERT INTO public.stores (owner_id, username, store_name)
    VALUES (p_user_id, p_username, p_store_name);

    UPDATE public.profiles SET role = 'seller' WHERE id = p_user_id;

    RETURN jsonb_build_object('success', true);
END;
$$;

-- ============================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.category_filters ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.brands ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.popular_searches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recommended_products ENABLE ROW LEVEL SECURITY;

-- Profiles
CREATE POLICY "Users can view own profile" ON public.profiles
    FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = id);

-- Stores
CREATE POLICY "Stores are publicly readable" ON public.stores
    FOR SELECT USING (TRUE);
CREATE POLICY "Sellers can update own store" ON public.stores
    FOR UPDATE USING (auth.uid() = owner_id);

-- Products
CREATE POLICY "Products are publicly readable" ON public.products
    FOR SELECT USING (TRUE);
CREATE POLICY "Sellers can insert own products" ON public.products
    FOR INSERT WITH CHECK (
        EXISTS (SELECT 1 FROM public.stores WHERE owner_id = auth.uid() AND id = seller_id)
    );
CREATE POLICY "Sellers can update own products" ON public.products
    FOR UPDATE USING (
        EXISTS (SELECT 1 FROM public.stores WHERE owner_id = auth.uid() AND id = seller_id)
    );

-- Cart
CREATE POLICY "Users manage own cart" ON public.cart_items
    FOR ALL USING (auth.uid() = user_id);

-- Favorites
CREATE POLICY "Users manage own favorites" ON public.favorites
    FOR ALL USING (auth.uid() = user_id);

-- Datos estáticos: lectura pública
CREATE POLICY "Categories public read" ON public.categories FOR SELECT USING (TRUE);
CREATE POLICY "Category filters public read" ON public.category_filters FOR SELECT USING (TRUE);
CREATE POLICY "Brands public read" ON public.brands FOR SELECT USING (TRUE);
CREATE POLICY "Popular searches public read" ON public.popular_searches FOR SELECT USING (TRUE);
CREATE POLICY "Recommended products public read" ON public.recommended_products FOR SELECT USING (TRUE);

-- ============================================================
-- VISTA: productos con info de marca y categoría
-- ============================================================

CREATE VIEW public.products_full AS
SELECT
    p.*,
    b.slug AS brand_slug,
    c.label AS category_label,
    c.icon  AS category_icon
FROM public.products p
LEFT JOIN public.brands b ON p.brand_id = b.id
LEFT JOIN public.categories c ON p.category_id = c.id;

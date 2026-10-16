CREATE TYPE public.app_role AS ENUM ('admin', 'editor', 'advisor');

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  role public.app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

CREATE POLICY "Users can read their roles"
ON public.user_roles FOR SELECT TO authenticated
USING (user_id = auth.uid());
CREATE POLICY "Admins can manage roles"
ON public.user_roles FOR ALL TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TABLE public.travel_offers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  kind text NOT NULL CHECK (kind IN ('paquete', 'tour', 'crucero', 'destino')),
  name text NOT NULL,
  destination text NOT NULL,
  region text NOT NULL,
  intent text[] NOT NULL DEFAULT '{}',
  duration text,
  season text,
  currency text,
  price_from numeric(12,2),
  summary text NOT NULL,
  image_key text,
  featured boolean NOT NULL DEFAULT false,
  published boolean NOT NULL DEFAULT false,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.travel_offers TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.travel_offers TO authenticated;
GRANT ALL ON public.travel_offers TO service_role;
ALTER TABLE public.travel_offers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Published travel content is public"
ON public.travel_offers FOR SELECT TO anon, authenticated
USING (published = true OR public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'editor'));
CREATE POLICY "Content team can add travel content"
ON public.travel_offers FOR INSERT TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'editor'));
CREATE POLICY "Content team can edit travel content"
ON public.travel_offers FOR UPDATE TO authenticated
USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'editor'))
WITH CHECK (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'editor'));
CREATE POLICY "Admins can delete travel content"
ON public.travel_offers FOR DELETE TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE TABLE public.quote_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  folio text NOT NULL UNIQUE DEFAULT ('CT-' || upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 8))),
  service text NOT NULL,
  destination text,
  departure_place text,
  start_date date,
  end_date date,
  travelers integer CHECK (travelers IS NULL OR travelers > 0),
  budget text,
  details text,
  full_name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  preferred_contact text NOT NULL DEFAULT 'whatsapp',
  privacy_consent boolean NOT NULL,
  source_page text,
  source_campaign text,
  device_type text,
  status text NOT NULL DEFAULT 'nuevo' CHECK (status IN ('nuevo', 'contactado', 'cotizacion_enviada', 'seguimiento', 'reservado', 'no_concretado')),
  assigned_to uuid,
  internal_notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT INSERT ON public.quote_requests TO anon, authenticated;
GRANT SELECT, UPDATE, DELETE ON public.quote_requests TO authenticated;
GRANT ALL ON public.quote_requests TO service_role;
ALTER TABLE public.quote_requests ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Visitors can submit quote requests"
ON public.quote_requests FOR INSERT TO anon, authenticated
WITH CHECK (privacy_consent = true AND status = 'nuevo' AND internal_notes IS NULL AND assigned_to IS NULL);
CREATE POLICY "Authorized team can read quote requests"
ON public.quote_requests FOR SELECT TO authenticated
USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'advisor'));
CREATE POLICY "Authorized team can update quote requests"
ON public.quote_requests FOR UPDATE TO authenticated
USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'advisor'))
WITH CHECK (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'advisor'));
CREATE POLICY "Admins can delete quote requests"
ON public.quote_requests FOR DELETE TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;
CREATE TRIGGER set_travel_offers_updated_at BEFORE UPDATE ON public.travel_offers
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER set_quote_requests_updated_at BEFORE UPDATE ON public.quote_requests
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

INSERT INTO public.travel_offers (slug, kind, name, destination, region, intent, duration, season, summary, image_key, featured, published, sort_order)
VALUES
('escapada-caribe-mexicano', 'paquete', 'Caribe mexicano, a tu ritmo', 'Riviera Maya', 'México', ARRAY['playa','familia','romance'], 'A la medida', 'Todo el año', 'Una inspiración para diseñar vuelo, estancia y experiencias con acompañamiento del equipo Cielito.', 'hero', true, true, 1),
('islas-griegas-en-crucero', 'crucero', 'El Mediterráneo desde el mar', 'Islas griegas', 'Europa', ARRAY['romance','cultura','familia'], 'Según itinerario', 'Primavera a otoño', 'Te ayudamos a comparar rutas, cabinas y conexiones para encontrar el crucero adecuado.', 'cruise', true, true, 2),
('viaje-familiar-a-parques', 'destino', 'La emoción de viajar en familia', 'Orlando', 'Norteamérica', ARRAY['familia'], 'A la medida', 'Todo el año', 'Planeación integral de transporte, hospedaje, parques, traslados y tiempos de descanso.', 'family', true, true, 3);
CREATE SCHEMA IF NOT EXISTS private;
REVOKE ALL ON SCHEMA private FROM PUBLIC;
GRANT USAGE ON SCHEMA private TO authenticated;

CREATE OR REPLACE FUNCTION private.has_role(_user_id uuid, _role public.app_role)
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
REVOKE ALL ON FUNCTION private.has_role(uuid, public.app_role) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION private.has_role(uuid, public.app_role) TO authenticated;
GRANT EXECUTE ON FUNCTION private.has_role(uuid, public.app_role) TO anon;

ALTER POLICY "Admins can manage roles" ON public.user_roles
USING (private.has_role(auth.uid(), 'admin'))
WITH CHECK (private.has_role(auth.uid(), 'admin'));
ALTER POLICY "Published travel content is public" ON public.travel_offers
USING (published = true OR private.has_role(auth.uid(), 'admin') OR private.has_role(auth.uid(), 'editor'));
ALTER POLICY "Content team can add travel content" ON public.travel_offers
WITH CHECK (private.has_role(auth.uid(), 'admin') OR private.has_role(auth.uid(), 'editor'));
ALTER POLICY "Content team can edit travel content" ON public.travel_offers
USING (private.has_role(auth.uid(), 'admin') OR private.has_role(auth.uid(), 'editor'))
WITH CHECK (private.has_role(auth.uid(), 'admin') OR private.has_role(auth.uid(), 'editor'));
ALTER POLICY "Admins can delete travel content" ON public.travel_offers
USING (private.has_role(auth.uid(), 'admin'));
ALTER POLICY "Authorized team can read quote requests" ON public.quote_requests
USING (private.has_role(auth.uid(), 'admin') OR private.has_role(auth.uid(), 'advisor'));
ALTER POLICY "Authorized team can update quote requests" ON public.quote_requests
USING (private.has_role(auth.uid(), 'admin') OR private.has_role(auth.uid(), 'advisor'))
WITH CHECK (private.has_role(auth.uid(), 'admin') OR private.has_role(auth.uid(), 'advisor'));
ALTER POLICY "Admins can delete quote requests" ON public.quote_requests
USING (private.has_role(auth.uid(), 'admin'));

DROP FUNCTION public.has_role(uuid, public.app_role);
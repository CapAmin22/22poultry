-- Supabase Schema Initialization for 22Poultry

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- PROFILES
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.profiles (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    username TEXT,
    bio TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id)
);

-- ============================================================================
-- MARKETPLACE LISTINGS
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.marketplace_listings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    category TEXT NOT NULL,
    subcategory TEXT,
    price TEXT NOT NULL,
    quantity TEXT,
    location TEXT NOT NULL,
    description TEXT NOT NULL,
    condition TEXT,
    contact_number TEXT,
    image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- FINANCIAL SERVICES
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.financial_services (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    provider_name TEXT NOT NULL,
    category TEXT NOT NULL,
    description TEXT NOT NULL,
    interest_rate TEXT,
    max_amount TEXT,
    tenure TEXT,
    eligibility_criteria TEXT[],
    required_documents TEXT[],
    tags TEXT[],
    email TEXT NOT NULL,
    contact_number TEXT NOT NULL,
    image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- FINANCIAL TRANSACTIONS
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.financial_transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    transaction_date DATE NOT NULL,
    type TEXT NOT NULL,
    category TEXT NOT NULL,
    amount NUMERIC NOT NULL,
    description TEXT NOT NULL,
    customer TEXT,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- LOAN APPLICATIONS
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.loan_applications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    amount NUMERIC NOT NULL,
    purpose TEXT NOT NULL,
    duration TEXT NOT NULL,
    farm_size TEXT NOT NULL,
    farm_type TEXT NOT NULL,
    annual_revenue NUMERIC NOT NULL,
    collateral TEXT NOT NULL,
    existing_loans TEXT,
    additional_info TEXT,
    contact_number TEXT,
    status TEXT NOT NULL DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- JOB LISTINGS
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.job_listings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    company TEXT NOT NULL,
    location TEXT NOT NULL,
    job_type TEXT NOT NULL,
    industry TEXT,
    description TEXT NOT NULL,
    requirements TEXT[] NOT NULL,
    salary_range TEXT,
    contact_email TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- NETWORK CONNECTIONS
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.network_connections (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    connected_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, connected_user_id)
);

-- ============================================================================
-- NETWORK DISCUSSIONS
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.network_discussions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    category TEXT NOT NULL,
    likes_count INTEGER DEFAULT 0,
    replies_count INTEGER DEFAULT 0,
    is_pinned BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- NETWORK EVENTS
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.network_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    description TEXT,
    date TIMESTAMP WITH TIME ZONE NOT NULL,
    location TEXT NOT NULL,
    type TEXT NOT NULL,
    organizer TEXT NOT NULL,
    attendees_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_by UUID REFERENCES auth.users(id)
);

-- ============================================================================
-- NETWORK EXPERTS
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.network_experts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    title TEXT NOT NULL,
    organization TEXT NOT NULL,
    expertise TEXT[] NOT NULL,
    experience TEXT NOT NULL,
    image_url TEXT,
    verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- NETWORK FARMERS
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.network_farmers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    location TEXT NOT NULL,
    farm_type TEXT NOT NULL,
    farm_size TEXT NOT NULL,
    expertise TEXT[] NOT NULL,
    experience TEXT NOT NULL,
    image_url TEXT,
    contact_number TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- RLS POLICIES
-- ============================================================================

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.marketplace_listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.financial_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.financial_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.loan_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.network_connections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.network_discussions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.network_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.network_experts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.network_farmers ENABLE ROW LEVEL SECURITY;

-- Profiles: Anyone can view, users can update their own
CREATE POLICY "Public profiles are viewable by everyone." 
ON public.profiles FOR SELECT USING (true);

CREATE POLICY "Users can insert their own profile." 
ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own profile." 
ON public.profiles FOR UPDATE USING (auth.uid() = user_id);

-- Marketplace Listings: Anyone can view, authenticated users can create, owners can update/delete
CREATE POLICY "Marketplace listings are viewable by everyone." 
ON public.marketplace_listings FOR SELECT USING (true);

CREATE POLICY "Users can insert their own listings." 
ON public.marketplace_listings FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own listings." 
ON public.marketplace_listings FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own listings." 
ON public.marketplace_listings FOR DELETE USING (auth.uid() = user_id);

-- Financial Services: Anyone can view, admin/providers can modify (simplifying to authenticated for now)
CREATE POLICY "Financial services viewable by everyone." 
ON public.financial_services FOR SELECT USING (true);

CREATE POLICY "Users can insert financial services." 
ON public.financial_services FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their financial services." 
ON public.financial_services FOR UPDATE USING (auth.uid() = user_id);

-- Financial Transactions: Only owners can view and modify
CREATE POLICY "Users can view own transactions." 
ON public.financial_transactions FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own transactions." 
ON public.financial_transactions FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own transactions." 
ON public.financial_transactions FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own transactions." 
ON public.financial_transactions FOR DELETE USING (auth.uid() = user_id);

-- Loan Applications: Owners can view and modify
CREATE POLICY "Users can view own loan apps." 
ON public.loan_applications FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own loan apps." 
ON public.loan_applications FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own loan apps." 
ON public.loan_applications FOR UPDATE USING (auth.uid() = user_id);

-- Job Listings: Viewable by all, editable by owner
CREATE POLICY "Job listings viewable by everyone." 
ON public.job_listings FOR SELECT USING (true);

CREATE POLICY "Users can insert job listings." 
ON public.job_listings FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own job listings." 
ON public.job_listings FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own job listings." 
ON public.job_listings FOR DELETE USING (auth.uid() = user_id);

-- Network Connections: Viewable by involved users
CREATE POLICY "Users can view their connections." 
ON public.network_connections FOR SELECT USING (auth.uid() = user_id OR auth.uid() = connected_user_id);

CREATE POLICY "Users can insert their connections." 
ON public.network_connections FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their connections." 
ON public.network_connections FOR DELETE USING (auth.uid() = user_id OR auth.uid() = connected_user_id);

-- Network Discussions: Viewable by all, editable by owner
CREATE POLICY "Discussions viewable by everyone." 
ON public.network_discussions FOR SELECT USING (true);

CREATE POLICY "Users can insert discussions." 
ON public.network_discussions FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own discussions." 
ON public.network_discussions FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own discussions." 
ON public.network_discussions FOR DELETE USING (auth.uid() = user_id);

-- Network Events: Viewable by all, editable by creator
CREATE POLICY "Events viewable by everyone." 
ON public.network_events FOR SELECT USING (true);

CREATE POLICY "Authenticated users can create events." 
ON public.network_events FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Users can update events they created." 
ON public.network_events FOR UPDATE USING (auth.uid() = updated_by);

-- Network Experts: Viewable by all, editable by owner
CREATE POLICY "Experts viewable by everyone." 
ON public.network_experts FOR SELECT USING (true);

CREATE POLICY "Users can insert expert profiles." 
ON public.network_experts FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own expert profile." 
ON public.network_experts FOR UPDATE USING (auth.uid() = user_id);

-- Network Farmers: Viewable by all, editable by owner
CREATE POLICY "Farmers viewable by everyone." 
ON public.network_farmers FOR SELECT USING (true);

CREATE POLICY "Users can insert farmer profiles." 
ON public.network_farmers FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own farmer profile." 
ON public.network_farmers FOR UPDATE USING (auth.uid() = user_id);

-- ============================================================================
-- TRIGGERS
-- ============================================================================

-- Function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, username, created_at)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
    NOW()
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

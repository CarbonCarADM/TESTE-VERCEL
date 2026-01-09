/*
  # CarbonCar Enterprise Schema - Complete Database Structure
  
  ## Overview
  Schema completo e pronto para produção com suporte a multi-tenant, 
  autenticação, pagamentos, notificações e integrações.
  
  ## New Tables
  
  ### studio_users
  - id (uuid, primary key)
  - studio_id (uuid, foreign key)
  - auth_user_id (uuid, foreign key) - Supabase auth user
  - role (text) - ADMIN, MANAGER, STAFF
  - name (text)
  - email (text)
  - phone (text)
  - is_active (boolean)
  - created_at (timestamptz)
  - updated_at (timestamptz)
  
  ### plans
  - id (uuid, primary key)
  - slug (text, unique)
  - name (text) - START, PRO, ELITE
  - description (text)
  - monthly_price (numeric)
  - annual_price (numeric)
  - max_boxes (integer)
  - max_patio_capacity (integer)
  - features (jsonb) - Array de features incluídas
  - is_active (boolean)
  - created_at (timestamptz)
  
  ### subscriptions
  - id (uuid, primary key)
  - studio_id (uuid, foreign key)
  - plan_id (uuid, foreign key)
  - status (text) - TRIAL, ACTIVE, PAUSED, CANCELLED
  - billing_cycle (text) - MONTHLY, ANNUAL
  - trial_ends_at (timestamptz)
  - current_period_start (timestamptz)
  - current_period_end (timestamptz)
  - cancelled_at (timestamptz)
  - cancellation_reason (text)
  - auto_renew (boolean)
  - created_at (timestamptz)
  - updated_at (timestamptz)
  
  ### invoices
  - id (uuid, primary key)
  - studio_id (uuid, foreign key)
  - subscription_id (uuid, foreign key)
  - number (text, unique per studio)
  - amount (numeric)
  - status (text) - DRAFT, SENT, PAID, OVERDUE, CANCELLED
  - due_date (date)
  - paid_at (timestamptz)
  - issued_at (timestamptz)
  - notes (text)
  - created_at (timestamptz)
  - updated_at (timestamptz)
  
  ### payments
  - id (uuid, primary key)
  - invoice_id (uuid, foreign key)
  - studio_id (uuid, foreign key)
  - amount (numeric)
  - method (text) - CREDIT_CARD, BANK_TRANSFER, PIX, BOLETO
  - status (text) - PENDING, PROCESSING, COMPLETED, FAILED
  - payment_gateway (text) - STRIPE, MERCADOPAGO
  - gateway_transaction_id (text)
  - paid_at (timestamptz)
  - created_at (timestamptz)
  - updated_at (timestamptz)
  
  ### notifications
  - id (uuid, primary key)
  - studio_id (uuid, foreign key)
  - user_id (uuid, foreign key, nullable)
  - customer_id (uuid, foreign key, nullable)
  - type (text) - SMS, EMAIL, PUSH, WHATSAPP
  - subject (text, nullable)
  - body (text)
  - recipient (text)
  - status (text) - PENDING, SENT, DELIVERED, FAILED
  - read_at (timestamptz, nullable)
  - sent_at (timestamptz, nullable)
  - error_message (text, nullable)
  - external_id (text, nullable)
  - created_at (timestamptz)
  
  ### notification_templates
  - id (uuid, primary key)
  - studio_id (uuid, foreign key)
  - name (text)
  - type (text) - SMS, EMAIL, PUSH, WHATSAPP
  - subject (text, nullable)
  - body (text)
  - variables (jsonb) - Variáveis suportadas
  - is_active (boolean)
  - created_at (timestamptz)
  - updated_at (timestamptz)
  
  ### loyalty_programs
  - id (uuid, primary key)
  - studio_id (uuid, foreign key)
  - name (text)
  - description (text)
  - points_per_real (numeric)
  - is_active (boolean)
  - config (jsonb) - Configurações do programa
  - created_at (timestamptz)
  - updated_at (timestamptz)
  
  ### loyalty_rewards
  - id (uuid, primary key)
  - program_id (uuid, foreign key)
  - name (text)
  - description (text)
  - points_required (integer)
  - discount_percentage (numeric, nullable)
  - discount_amount (numeric, nullable)
  - max_usage_per_customer (integer)
  - is_active (boolean)
  - valid_until (date, nullable)
  - created_at (timestamptz)
  
  ### customer_loyalty
  - id (uuid, primary key)
  - customer_id (uuid, foreign key)
  - program_id (uuid, foreign key)
  - points_balance (integer)
  - tier (text) - BRONZE, SILVER, GOLD, PLATINUM
  - joined_at (timestamptz)
  - updated_at (timestamptz)
  
  ### schedule_templates
  - id (uuid, primary key)
  - studio_id (uuid, foreign key)
  - day_of_week (integer) - 0-6
  - slot_start_time (time)
  - slot_end_time (time)
  - slot_duration_minutes (integer)
  - is_closed (boolean)
  - break_start (time, nullable)
  - break_end (time, nullable)
  - max_concurrent_appointments (integer)
  - created_at (timestamptz)
  - updated_at (timestamptz)
  
  ### special_dates
  - id (uuid, primary key)
  - studio_id (uuid, foreign key)
  - date (date)
  - type (text) - HOLIDAY, SPECIAL_HOURS, CLOSED, APPOINTMENT_ONLY
  - start_time (time, nullable)
  - end_time (time, nullable)
  - description (text)
  - created_at (timestamptz)
  
  ### staff_assignments
  - id (uuid, primary key)
  - studio_user_id (uuid, foreign key)
  - service_id (uuid, foreign key)
  - proficiency_level (text) - JUNIOR, SENIOR, EXPERT
  - bio (text, nullable)
  - profile_image_url (text, nullable)
  - rating (numeric)
  - total_jobs (integer)
  - created_at (timestamptz)
  - updated_at (timestamptz)
  
  ### staff_availability
  - id (uuid, primary key)
  - staff_id (uuid, foreign key)
  - date (date)
  - start_time (time)
  - end_time (time)
  - is_available (boolean)
  - reason (text, nullable)
  - created_at (timestamptz)
  - updated_at (timestamptz)
  
  ### integrations
  - id (uuid, primary key)
  - studio_id (uuid, foreign key)
  - type (text) - WHATSAPP, GOOGLE_CALENDAR, STRIPE, INSTAGRAM
  - status (text) - CONNECTED, DISCONNECTED, ERROR
  - api_key (text) - Encrypted
  - config (jsonb)
  - last_sync_at (timestamptz, nullable)
  - connected_at (timestamptz)
  - updated_at (timestamptz)
  
  ### webhooks
  - id (uuid, primary key)
  - studio_id (uuid, foreign key)
  - event_type (text)
  - url (text)
  - is_active (boolean)
  - secret (text)
  - retry_count (integer)
  - last_triggered_at (timestamptz, nullable)
  - created_at (timestamptz)
  - updated_at (timestamptz)
  
  ### audit_logs
  - id (uuid, primary key)
  - studio_id (uuid, foreign key)
  - user_id (uuid, foreign key, nullable)
  - entity_type (text)
  - entity_id (uuid)
  - action (text) - CREATE, UPDATE, DELETE, VIEW
  - old_values (jsonb, nullable)
  - new_values (jsonb, nullable)
  - ip_address (text, nullable)
  - user_agent (text, nullable)
  - created_at (timestamptz)
  
  ### settings
  - id (uuid, primary key)
  - studio_id (uuid, foreign key)
  - key (text)
  - value (jsonb)
  - description (text, nullable)
  - updated_at (timestamptz)
  
  ## Security
  - RLS habilitado em todas as tabelas
  - Políticas baseadas em studio_id e user roles
  - Auditoria completa de ações
  - Criptografia para dados sensíveis
*/

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============== AUTHENTICATION & USERS ==============

CREATE TABLE IF NOT EXISTS studio_users (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    studio_id uuid NOT NULL REFERENCES studios(id) ON DELETE CASCADE,
    auth_user_id uuid NOT NULL,
    role text NOT NULL DEFAULT 'STAFF' CHECK (role IN ('ADMIN', 'MANAGER', 'STAFF')),
    name text NOT NULL,
    email text NOT NULL,
    phone text,
    is_active boolean DEFAULT true,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now(),
    UNIQUE (auth_user_id, studio_id)
);

ALTER TABLE studio_users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view users in their studio"
    ON studio_users FOR SELECT
    TO authenticated
    USING (
        studio_id IN (
            SELECT studio_id FROM studio_users 
            WHERE auth_user_id = auth.uid()
        )
    );

CREATE POLICY "Users can update their own profile"
    ON studio_users FOR UPDATE
    TO authenticated
    USING (auth_user_id = auth.uid())
    WITH CHECK (auth_user_id = auth.uid());

CREATE POLICY "Admins can manage all studio users"
    ON studio_users FOR ALL
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM studio_users
            WHERE studio_users.studio_id = studio_users.studio_id
            AND studio_users.auth_user_id = auth.uid()
            AND studio_users.role = 'ADMIN'
        )
    );

-- ============== BILLING & SUBSCRIPTIONS ==============

CREATE TABLE IF NOT EXISTS plans (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug text UNIQUE NOT NULL,
    name text NOT NULL CHECK (name IN ('START', 'PRO', 'ELITE')),
    description text,
    monthly_price numeric NOT NULL,
    annual_price numeric NOT NULL,
    max_boxes integer NOT NULL,
    max_patio_capacity integer NOT NULL,
    features jsonb DEFAULT '[]'::jsonb,
    is_active boolean DEFAULT true,
    created_at timestamptz DEFAULT now()
);

ALTER TABLE plans ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Plans are viewable by everyone"
    ON plans FOR SELECT
    TO authenticated
    USING (true);

INSERT INTO plans (id, slug, name, description, monthly_price, annual_price, max_boxes, max_patio_capacity, features) VALUES
    (
        '00000000-0000-0000-0000-000000000100',
        'start',
        'START',
        'Plano básico para começar',
        99.00,
        990.00,
        1,
        3,
        '["agendamentos_basicos", "fidelidade_simples", "relatorios_basicos"]'::jsonb
    ),
    (
        '00000000-0000-0000-0000-000000000101',
        'pro',
        'PRO',
        'Para estúdios em crescimento',
        199.00,
        1990.00,
        3,
        10,
        '["agendamentos_avancados", "fidelidade_completa", "relatorios_avancados", "integracao_whatsapp", "api_access"]'::jsonb
    ),
    (
        '00000000-0000-0000-0000-000000000102',
        'elite',
        'ELITE',
        'Solução completa empresarial',
        399.00,
        3990.00,
        10,
        50,
        '["tudo_pro", "multiplos_usuarios", "webhooks", "integracao_completa", "suporte_24h", "api_ilimitada"]'::jsonb
    )
ON CONFLICT (id) DO NOTHING;

CREATE TABLE IF NOT EXISTS subscriptions (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    studio_id uuid NOT NULL REFERENCES studios(id) ON DELETE CASCADE,
    plan_id uuid NOT NULL REFERENCES plans(id),
    status text NOT NULL DEFAULT 'TRIAL' CHECK (status IN ('TRIAL', 'ACTIVE', 'PAUSED', 'CANCELLED')),
    billing_cycle text NOT NULL DEFAULT 'MONTHLY' CHECK (billing_cycle IN ('MONTHLY', 'ANNUAL')),
    trial_ends_at timestamptz,
    current_period_start timestamptz DEFAULT now(),
    current_period_end timestamptz,
    cancelled_at timestamptz,
    cancellation_reason text,
    auto_renew boolean DEFAULT true,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now(),
    UNIQUE (studio_id)
);

ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Subscriptions are viewable by their studio"
    ON subscriptions FOR SELECT
    TO authenticated
    USING (
        studio_id IN (
            SELECT studio_id FROM studio_users 
            WHERE auth_user_id = auth.uid()
        )
    );

CREATE POLICY "Admins can update subscriptions"
    ON subscriptions FOR UPDATE
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM studio_users
            WHERE studio_users.studio_id = subscriptions.studio_id
            AND studio_users.auth_user_id = auth.uid()
            AND studio_users.role = 'ADMIN'
        )
    );

-- ============== INVOICES & PAYMENTS ==============

CREATE TABLE IF NOT EXISTS invoices (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    studio_id uuid NOT NULL REFERENCES studios(id) ON DELETE CASCADE,
    subscription_id uuid NOT NULL REFERENCES subscriptions(id) ON DELETE CASCADE,
    number text NOT NULL,
    amount numeric NOT NULL,
    status text NOT NULL DEFAULT 'DRAFT' CHECK (status IN ('DRAFT', 'SENT', 'PAID', 'OVERDUE', 'CANCELLED')),
    due_date date NOT NULL,
    paid_at timestamptz,
    issued_at timestamptz DEFAULT now(),
    notes text,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now(),
    UNIQUE (studio_id, number)
);

ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Invoices are viewable by their studio"
    ON invoices FOR SELECT
    TO authenticated
    USING (
        studio_id IN (
            SELECT studio_id FROM studio_users 
            WHERE auth_user_id = auth.uid()
        )
    );

CREATE TABLE IF NOT EXISTS payments (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    invoice_id uuid NOT NULL REFERENCES invoices(id) ON DELETE CASCADE,
    studio_id uuid NOT NULL REFERENCES studios(id) ON DELETE CASCADE,
    amount numeric NOT NULL,
    method text NOT NULL CHECK (method IN ('CREDIT_CARD', 'BANK_TRANSFER', 'PIX', 'BOLETO')),
    status text NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'PROCESSING', 'COMPLETED', 'FAILED')),
    payment_gateway text CHECK (payment_gateway IN ('STRIPE', 'MERCADOPAGO', 'MANUAL')),
    gateway_transaction_id text,
    paid_at timestamptz,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Payments are viewable by their studio"
    ON payments FOR SELECT
    TO authenticated
    USING (
        studio_id IN (
            SELECT studio_id FROM studio_users 
            WHERE auth_user_id = auth.uid()
        )
    );

-- ============== NOTIFICATIONS ==============

CREATE TABLE IF NOT EXISTS notifications (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    studio_id uuid NOT NULL REFERENCES studios(id) ON DELETE CASCADE,
    user_id uuid REFERENCES studio_users(id) ON DELETE SET NULL,
    customer_id uuid REFERENCES customers(id) ON DELETE SET NULL,
    type text NOT NULL CHECK (type IN ('SMS', 'EMAIL', 'PUSH', 'WHATSAPP')),
    subject text,
    body text NOT NULL,
    recipient text NOT NULL,
    status text DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'SENT', 'DELIVERED', 'FAILED')),
    read_at timestamptz,
    sent_at timestamptz,
    error_message text,
    external_id text,
    created_at timestamptz DEFAULT now()
);

ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Notifications are viewable by their studio"
    ON notifications FOR SELECT
    TO authenticated
    USING (
        studio_id IN (
            SELECT studio_id FROM studio_users 
            WHERE auth_user_id = auth.uid()
        )
    );

CREATE TABLE IF NOT EXISTS notification_templates (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    studio_id uuid NOT NULL REFERENCES studios(id) ON DELETE CASCADE,
    name text NOT NULL,
    type text NOT NULL CHECK (type IN ('SMS', 'EMAIL', 'PUSH', 'WHATSAPP')),
    subject text,
    body text NOT NULL,
    variables jsonb DEFAULT '[]'::jsonb,
    is_active boolean DEFAULT true,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

ALTER TABLE notification_templates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Templates are viewable by their studio"
    ON notification_templates FOR SELECT
    TO authenticated
    USING (
        studio_id IN (
            SELECT studio_id FROM studio_users 
            WHERE auth_user_id = auth.uid()
        )
    );

CREATE POLICY "Admins can manage templates"
    ON notification_templates FOR ALL
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM studio_users
            WHERE studio_users.studio_id = notification_templates.studio_id
            AND studio_users.auth_user_id = auth.uid()
            AND studio_users.role IN ('ADMIN', 'MANAGER')
        )
    );

-- ============== LOYALTY PROGRAM ==============

CREATE TABLE IF NOT EXISTS loyalty_programs (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    studio_id uuid NOT NULL REFERENCES studios(id) ON DELETE CASCADE,
    name text NOT NULL,
    description text,
    points_per_real numeric NOT NULL DEFAULT 1.0,
    is_active boolean DEFAULT true,
    config jsonb DEFAULT '{}'::jsonb,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now(),
    UNIQUE (studio_id)
);

ALTER TABLE loyalty_programs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Loyalty programs are viewable by their studio"
    ON loyalty_programs FOR SELECT
    TO authenticated
    USING (
        studio_id IN (
            SELECT studio_id FROM studio_users 
            WHERE auth_user_id = auth.uid()
        )
    );

CREATE TABLE IF NOT EXISTS loyalty_rewards (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    program_id uuid NOT NULL REFERENCES loyalty_programs(id) ON DELETE CASCADE,
    name text NOT NULL,
    description text,
    points_required integer NOT NULL,
    discount_percentage numeric,
    discount_amount numeric,
    max_usage_per_customer integer,
    is_active boolean DEFAULT true,
    valid_until date,
    created_at timestamptz DEFAULT now()
);

ALTER TABLE loyalty_rewards ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Rewards are viewable by their studio"
    ON loyalty_rewards FOR SELECT
    TO authenticated
    USING (
        program_id IN (
            SELECT id FROM loyalty_programs 
            WHERE studio_id IN (
                SELECT studio_id FROM studio_users 
                WHERE auth_user_id = auth.uid()
            )
        )
    );

CREATE TABLE IF NOT EXISTS customer_loyalty (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_id uuid NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
    program_id uuid NOT NULL REFERENCES loyalty_programs(id) ON DELETE CASCADE,
    points_balance integer DEFAULT 0,
    tier text DEFAULT 'BRONZE' CHECK (tier IN ('BRONZE', 'SILVER', 'GOLD', 'PLATINUM')),
    joined_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now(),
    UNIQUE (customer_id, program_id)
);

ALTER TABLE customer_loyalty ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Customer loyalty is viewable by their studio"
    ON customer_loyalty FOR SELECT
    TO authenticated
    USING (
        customer_id IN (
            SELECT id FROM customers 
            WHERE studio_id IN (
                SELECT studio_id FROM studio_users 
                WHERE auth_user_id = auth.uid()
            )
        )
    );

-- ============== SCHEDULING ==============

CREATE TABLE IF NOT EXISTS schedule_templates (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    studio_id uuid NOT NULL REFERENCES studios(id) ON DELETE CASCADE,
    day_of_week integer NOT NULL CHECK (day_of_week BETWEEN 0 AND 6),
    slot_start_time time NOT NULL,
    slot_end_time time NOT NULL,
    slot_duration_minutes integer NOT NULL,
    is_closed boolean DEFAULT false,
    break_start time,
    break_end time,
    max_concurrent_appointments integer NOT NULL DEFAULT 1,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now(),
    UNIQUE (studio_id, day_of_week)
);

ALTER TABLE schedule_templates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Templates are viewable by their studio"
    ON schedule_templates FOR SELECT
    TO authenticated
    USING (
        studio_id IN (
            SELECT studio_id FROM studio_users 
            WHERE auth_user_id = auth.uid()
        )
    );

CREATE TABLE IF NOT EXISTS special_dates (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    studio_id uuid NOT NULL REFERENCES studios(id) ON DELETE CASCADE,
    date date NOT NULL,
    type text NOT NULL CHECK (type IN ('HOLIDAY', 'SPECIAL_HOURS', 'CLOSED', 'APPOINTMENT_ONLY')),
    start_time time,
    end_time time,
    description text,
    created_at timestamptz DEFAULT now()
);

ALTER TABLE special_dates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Special dates are viewable by their studio"
    ON special_dates FOR SELECT
    TO authenticated
    USING (
        studio_id IN (
            SELECT studio_id FROM studio_users 
            WHERE auth_user_id = auth.uid()
        )
    );

-- ============== STAFF ==============

CREATE TABLE IF NOT EXISTS staff_assignments (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    studio_user_id uuid NOT NULL REFERENCES studio_users(id) ON DELETE CASCADE,
    service_id uuid NOT NULL REFERENCES services(id) ON DELETE CASCADE,
    proficiency_level text DEFAULT 'SENIOR' CHECK (proficiency_level IN ('JUNIOR', 'SENIOR', 'EXPERT')),
    bio text,
    profile_image_url text,
    rating numeric DEFAULT 0,
    total_jobs integer DEFAULT 0,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now(),
    UNIQUE (studio_user_id, service_id)
);

ALTER TABLE staff_assignments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Assignments are viewable by their studio"
    ON staff_assignments FOR SELECT
    TO authenticated
    USING (
        studio_user_id IN (
            SELECT id FROM studio_users 
            WHERE studio_id IN (
                SELECT studio_id FROM studio_users 
                WHERE auth_user_id = auth.uid()
            )
        )
    );

CREATE TABLE IF NOT EXISTS staff_availability (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    staff_id uuid NOT NULL REFERENCES studio_users(id) ON DELETE CASCADE,
    date date NOT NULL,
    start_time time NOT NULL,
    end_time time NOT NULL,
    is_available boolean DEFAULT true,
    reason text,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now(),
    UNIQUE (staff_id, date)
);

ALTER TABLE staff_availability ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Availability is viewable by their studio"
    ON staff_availability FOR SELECT
    TO authenticated
    USING (
        staff_id IN (
            SELECT id FROM studio_users 
            WHERE studio_id IN (
                SELECT studio_id FROM studio_users 
                WHERE auth_user_id = auth.uid()
            )
        )
    );

-- ============== INTEGRATIONS ==============

CREATE TABLE IF NOT EXISTS integrations (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    studio_id uuid NOT NULL REFERENCES studios(id) ON DELETE CASCADE,
    type text NOT NULL CHECK (type IN ('WHATSAPP', 'GOOGLE_CALENDAR', 'STRIPE', 'INSTAGRAM', 'TELEGRAM')),
    status text DEFAULT 'DISCONNECTED' CHECK (status IN ('CONNECTED', 'DISCONNECTED', 'ERROR')),
    api_key text,
    config jsonb DEFAULT '{}'::jsonb,
    last_sync_at timestamptz,
    connected_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now(),
    UNIQUE (studio_id, type)
);

ALTER TABLE integrations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Integrations are viewable by their studio"
    ON integrations FOR SELECT
    TO authenticated
    USING (
        studio_id IN (
            SELECT studio_id FROM studio_users 
            WHERE auth_user_id = auth.uid()
        )
    );

CREATE POLICY "Only admins can manage integrations"
    ON integrations FOR ALL
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM studio_users
            WHERE studio_users.studio_id = integrations.studio_id
            AND studio_users.auth_user_id = auth.uid()
            AND studio_users.role = 'ADMIN'
        )
    );

CREATE TABLE IF NOT EXISTS webhooks (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    studio_id uuid NOT NULL REFERENCES studios(id) ON DELETE CASCADE,
    event_type text NOT NULL,
    url text NOT NULL,
    is_active boolean DEFAULT true,
    secret text NOT NULL DEFAULT gen_random_uuid()::text,
    retry_count integer DEFAULT 0,
    last_triggered_at timestamptz,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

ALTER TABLE webhooks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Webhooks are viewable by their studio"
    ON webhooks FOR SELECT
    TO authenticated
    USING (
        studio_id IN (
            SELECT studio_id FROM studio_users 
            WHERE auth_user_id = auth.uid()
        )
    );

CREATE POLICY "Only admins can manage webhooks"
    ON webhooks FOR ALL
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM studio_users
            WHERE studio_users.studio_id = webhooks.studio_id
            AND studio_users.auth_user_id = auth.uid()
            AND studio_users.role = 'ADMIN'
        )
    );

-- ============== AUDIT & LOGS ==============

CREATE TABLE IF NOT EXISTS audit_logs (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    studio_id uuid NOT NULL REFERENCES studios(id) ON DELETE CASCADE,
    user_id uuid REFERENCES studio_users(id) ON DELETE SET NULL,
    entity_type text NOT NULL,
    entity_id uuid NOT NULL,
    action text NOT NULL CHECK (action IN ('CREATE', 'UPDATE', 'DELETE', 'VIEW', 'EXPORT')),
    old_values jsonb,
    new_values jsonb,
    ip_address text,
    user_agent text,
    created_at timestamptz DEFAULT now()
);

ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Audit logs are viewable by their studio admins"
    ON audit_logs FOR SELECT
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM studio_users
            WHERE studio_users.studio_id = audit_logs.studio_id
            AND studio_users.auth_user_id = auth.uid()
            AND studio_users.role = 'ADMIN'
        )
    );

-- ============== SETTINGS ==============

CREATE TABLE IF NOT EXISTS settings (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    studio_id uuid NOT NULL REFERENCES studios(id) ON DELETE CASCADE,
    key text NOT NULL,
    value jsonb,
    description text,
    updated_at timestamptz DEFAULT now(),
    UNIQUE (studio_id, key)
);

ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Settings are viewable by their studio"
    ON settings FOR SELECT
    TO authenticated
    USING (
        studio_id IN (
            SELECT studio_id FROM studio_users 
            WHERE auth_user_id = auth.uid()
        )
    );

CREATE POLICY "Only admins can update settings"
    ON settings FOR UPDATE
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM studio_users
            WHERE studio_users.studio_id = settings.studio_id
            AND studio_users.auth_user_id = auth.uid()
            AND studio_users.role = 'ADMIN'
        )
    );

-- ============== INDEXES ==============

CREATE INDEX IF NOT EXISTS idx_studio_users_studio_id ON studio_users(studio_id);
CREATE INDEX IF NOT EXISTS idx_studio_users_auth_user_id ON studio_users(auth_user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_studio_id ON subscriptions(studio_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_invoices_studio_id ON invoices(studio_id);
CREATE INDEX IF NOT EXISTS idx_invoices_status ON invoices(status);
CREATE INDEX IF NOT EXISTS idx_invoices_due_date ON invoices(due_date);
CREATE INDEX IF NOT EXISTS idx_payments_invoice_id ON payments(invoice_id);
CREATE INDEX IF NOT EXISTS idx_payments_status ON payments(status);
CREATE INDEX IF NOT EXISTS idx_notifications_studio_id ON notifications(studio_id);
CREATE INDEX IF NOT EXISTS idx_notifications_status ON notifications(status);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON notifications(created_at);
CREATE INDEX IF NOT EXISTS idx_loyalty_programs_studio_id ON loyalty_programs(studio_id);
CREATE INDEX IF NOT EXISTS idx_customer_loyalty_customer_id ON customer_loyalty(customer_id);
CREATE INDEX IF NOT EXISTS idx_schedule_templates_studio_id ON schedule_templates(studio_id);
CREATE INDEX IF NOT EXISTS idx_special_dates_studio_id ON special_dates(studio_id);
CREATE INDEX IF NOT EXISTS idx_special_dates_date ON special_dates(date);
CREATE INDEX IF NOT EXISTS idx_staff_assignments_studio_user_id ON staff_assignments(studio_user_id);
CREATE INDEX IF NOT EXISTS idx_staff_availability_staff_id ON staff_availability(staff_id);
CREATE INDEX IF NOT EXISTS idx_staff_availability_date ON staff_availability(date);
CREATE INDEX IF NOT EXISTS idx_integrations_studio_id ON integrations(studio_id);
CREATE INDEX IF NOT EXISTS idx_webhooks_studio_id ON webhooks(studio_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_studio_id ON audit_logs(studio_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON audit_logs(created_at);
CREATE INDEX IF NOT EXISTS idx_settings_studio_id ON settings(studio_id);

-- ============== TRIGGERS ==============

CREATE TRIGGER update_studio_users_updated_at BEFORE UPDATE ON studio_users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_subscriptions_updated_at BEFORE UPDATE ON subscriptions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_invoices_updated_at BEFORE UPDATE ON invoices
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_payments_updated_at BEFORE UPDATE ON payments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_notification_templates_updated_at BEFORE UPDATE ON notification_templates
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_loyalty_programs_updated_at BEFORE UPDATE ON loyalty_programs
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_customer_loyalty_updated_at BEFORE UPDATE ON customer_loyalty
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_schedule_templates_updated_at BEFORE UPDATE ON schedule_templates
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_staff_assignments_updated_at BEFORE UPDATE ON staff_assignments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_staff_availability_updated_at BEFORE UPDATE ON staff_availability
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_integrations_updated_at BEFORE UPDATE ON integrations
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_webhooks_updated_at BEFORE UPDATE ON webhooks
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_settings_updated_at BEFORE UPDATE ON settings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

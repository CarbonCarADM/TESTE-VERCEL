/*
  # CarbonCar Operating System - Database Schema
  
  ## Overview
  Sistema completo de gestão para estéticas automotivas com suporte multi-tenant.
  
  ## New Tables
  
  ### studios
  - id (uuid, primary key)
  - slug (text, unique) - Identificador único do estúdio
  - business_name (text) - Nome comercial
  - address (text) - Endereço operacional
  - cnpj (text) - Registro fiscal
  - profile_image_url (text) - Logo do estúdio
  - box_capacity (integer) - Quantidade de boxes
  - patio_capacity (integer) - Capacidade do pátio
  - slot_interval_minutes (integer) - Intervalo da grade
  - online_booking_enabled (boolean) - Agendamento online ativo
  - loyalty_program_enabled (boolean) - Programa de fidelidade
  - operating_days (jsonb) - Regras de operação por dia
  - special_closures (jsonb) - Fechamentos especiais
  - plan_type (text) - Plano atual (START, PRO, ELITE)
  - billing_cycle (text) - Ciclo de cobrança (MONTHLY, ANNUAL)
  - subscription_status (text) - Status da assinatura
  - trial_start_date (timestamptz) - Data de início do trial
  - created_at (timestamptz)
  - updated_at (timestamptz)
  
  ### customers
  - id (uuid, primary key)
  - studio_id (uuid, foreign key) - Estúdio proprietário
  - name (text) - Nome completo
  - phone (text) - Telefone/WhatsApp
  - email (text) - Email de contato
  - total_spent (numeric) - Total gasto acumulado
  - last_visit (date) - Data da última visita
  - xp_points (integer) - Pontos de fidelidade
  - washes (integer) - Quantidade de lavagens
  - status (text) - Status do cliente (ATIVO, INATIVO, NOVO)
  - created_at (timestamptz)
  - updated_at (timestamptz)
  
  ### vehicles
  - id (uuid, primary key)
  - customer_id (uuid, foreign key) - Cliente proprietário
  - brand (text) - Marca do veículo
  - model (text) - Modelo
  - plate (text) - Placa
  - color (text) - Cor
  - type (text) - Tipo (CARRO, SUV, MOTO, UTILITARIO)
  - created_at (timestamptz)
  
  ### services
  - id (uuid, primary key)
  - studio_id (uuid, foreign key) - Estúdio proprietário
  - name (text) - Nome do serviço
  - description (text) - Descrição técnica
  - duration_minutes (integer) - Duração estimada
  - price (numeric) - Preço sugerido
  - compatible_vehicles (jsonb) - Tipos de veículos compatíveis
  - active (boolean) - Serviço ativo
  - allows_fixed (boolean) - Permite agendamento fixo
  - created_at (timestamptz)
  - updated_at (timestamptz)
  
  ### appointments
  - id (uuid, primary key)
  - studio_id (uuid, foreign key) - Estúdio proprietário
  - customer_id (uuid, foreign key) - Cliente
  - vehicle_id (uuid, foreign key) - Veículo
  - service_id (uuid, foreign key, nullable) - Serviço vinculado
  - service_type (text) - Nome do serviço
  - date (date) - Data do agendamento
  - time (time) - Horário
  - duration_minutes (integer) - Duração
  - price (numeric) - Valor do serviço
  - status (text) - Status (NOVO, CONFIRMADO, EM_ROTA, EM_EXECUCAO, FINALIZADO, CANCELADO)
  - box_id (integer, nullable) - Box alocado
  - staff_name (text, nullable) - Responsável
  - observation (text, nullable) - Observações
  - cancellation_reason (text, nullable) - Motivo de cancelamento
  - is_delivery (boolean) - É delivery?
  - address (text, nullable) - Endereço para delivery
  - created_at (timestamptz)
  - updated_at (timestamptz)
  
  ### expenses
  - id (uuid, primary key)
  - studio_id (uuid, foreign key) - Estúdio proprietário
  - description (text) - Descrição da despesa
  - amount (numeric) - Valor
  - date (date) - Data da despesa
  - category (text) - Categoria (FIXO, VARIAVEL, MARKETING, IMPOSTO)
  - created_at (timestamptz)
  
  ### portfolio_items
  - id (uuid, primary key)
  - studio_id (uuid, foreign key) - Estúdio proprietário
  - image_url (text) - URL da imagem
  - description (text) - Legenda
  - category (text, nullable) - Categoria da foto
  - created_at (timestamptz)
  
  ### reviews
  - id (uuid, primary key)
  - studio_id (uuid, foreign key) - Estúdio proprietário
  - appointment_id (uuid, foreign key, nullable) - Agendamento relacionado
  - customer_name (text) - Nome do cliente
  - rating (integer) - Nota (1-5)
  - comment (text) - Comentário
  - reply (text, nullable) - Resposta do estúdio
  - created_at (timestamptz)
  
  ## Security
  - RLS habilitado em todas as tabelas
  - Políticas baseadas em studio_id para isolamento de dados
  - Auth nativo do Supabase para autenticação
*/

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Studios Table
CREATE TABLE IF NOT EXISTS studios (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug text UNIQUE NOT NULL,
    business_name text NOT NULL,
    address text,
    cnpj text,
    profile_image_url text,
    box_capacity integer DEFAULT 3,
    patio_capacity integer DEFAULT 5,
    slot_interval_minutes integer DEFAULT 30,
    online_booking_enabled boolean DEFAULT true,
    loyalty_program_enabled boolean DEFAULT false,
    operating_days jsonb DEFAULT '[]'::jsonb,
    special_closures jsonb DEFAULT '[]'::jsonb,
    plan_type text DEFAULT 'START' CHECK (plan_type IN ('START', 'PRO', 'ELITE')),
    billing_cycle text DEFAULT 'MONTHLY' CHECK (billing_cycle IN ('MONTHLY', 'ANNUAL')),
    subscription_status text DEFAULT 'TRIAL' CHECK (subscription_status IN ('TRIAL', 'ACTIVE', 'EXPIRED')),
    trial_start_date timestamptz DEFAULT now(),
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

ALTER TABLE studios ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Studios are viewable by everyone"
    ON studios FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Studios can be updated by their owner"
    ON studios FOR UPDATE
    TO authenticated
    USING (auth.uid()::text = id::text);

-- Customers Table
CREATE TABLE IF NOT EXISTS customers (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    studio_id uuid NOT NULL REFERENCES studios(id) ON DELETE CASCADE,
    name text NOT NULL,
    phone text NOT NULL,
    email text,
    total_spent numeric DEFAULT 0,
    last_visit date,
    xp_points integer DEFAULT 0,
    washes integer DEFAULT 0,
    status text DEFAULT 'NOVO' CHECK (status IN ('ATIVO', 'INATIVO', 'NOVO')),
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

ALTER TABLE customers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Customers are viewable by their studio"
    ON customers FOR SELECT
    TO authenticated
    USING (studio_id IN (SELECT id FROM studios WHERE auth.uid()::text = id::text));

CREATE POLICY "Customers can be inserted by their studio"
    ON customers FOR INSERT
    TO authenticated
    WITH CHECK (studio_id IN (SELECT id FROM studios WHERE auth.uid()::text = id::text));

CREATE POLICY "Customers can be updated by their studio"
    ON customers FOR UPDATE
    TO authenticated
    USING (studio_id IN (SELECT id FROM studios WHERE auth.uid()::text = id::text));

CREATE POLICY "Customers can be deleted by their studio"
    ON customers FOR DELETE
    TO authenticated
    USING (studio_id IN (SELECT id FROM studios WHERE auth.uid()::text = id::text));

-- Vehicles Table
CREATE TABLE IF NOT EXISTS vehicles (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_id uuid NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
    brand text NOT NULL,
    model text NOT NULL,
    plate text NOT NULL,
    color text,
    type text DEFAULT 'CARRO' CHECK (type IN ('CARRO', 'SUV', 'MOTO', 'UTILITARIO')),
    created_at timestamptz DEFAULT now()
);

ALTER TABLE vehicles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Vehicles are viewable by their studio"
    ON vehicles FOR SELECT
    TO authenticated
    USING (customer_id IN (
        SELECT id FROM customers WHERE studio_id IN (
            SELECT id FROM studios WHERE auth.uid()::text = id::text
        )
    ));

CREATE POLICY "Vehicles can be inserted by their studio"
    ON vehicles FOR INSERT
    TO authenticated
    WITH CHECK (customer_id IN (
        SELECT id FROM customers WHERE studio_id IN (
            SELECT id FROM studios WHERE auth.uid()::text = id::text
        )
    ));

CREATE POLICY "Vehicles can be updated by their studio"
    ON vehicles FOR UPDATE
    TO authenticated
    USING (customer_id IN (
        SELECT id FROM customers WHERE studio_id IN (
            SELECT id FROM studios WHERE auth.uid()::text = id::text
        )
    ));

CREATE POLICY "Vehicles can be deleted by their studio"
    ON vehicles FOR DELETE
    TO authenticated
    USING (customer_id IN (
        SELECT id FROM customers WHERE studio_id IN (
            SELECT id FROM studios WHERE auth.uid()::text = id::text
        )
    ));

-- Services Table
CREATE TABLE IF NOT EXISTS services (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    studio_id uuid NOT NULL REFERENCES studios(id) ON DELETE CASCADE,
    name text NOT NULL,
    description text,
    duration_minutes integer NOT NULL,
    price numeric NOT NULL,
    compatible_vehicles jsonb DEFAULT '["CARRO", "SUV"]'::jsonb,
    active boolean DEFAULT true,
    allows_fixed boolean DEFAULT true,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

ALTER TABLE services ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Services are viewable by their studio"
    ON services FOR SELECT
    TO authenticated
    USING (studio_id IN (SELECT id FROM studios WHERE auth.uid()::text = id::text));

CREATE POLICY "Services can be inserted by their studio"
    ON services FOR INSERT
    TO authenticated
    WITH CHECK (studio_id IN (SELECT id FROM studios WHERE auth.uid()::text = id::text));

CREATE POLICY "Services can be updated by their studio"
    ON services FOR UPDATE
    TO authenticated
    USING (studio_id IN (SELECT id FROM studios WHERE auth.uid()::text = id::text));

CREATE POLICY "Services can be deleted by their studio"
    ON services FOR DELETE
    TO authenticated
    USING (studio_id IN (SELECT id FROM studios WHERE auth.uid()::text = id::text));

-- Appointments Table
CREATE TABLE IF NOT EXISTS appointments (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    studio_id uuid NOT NULL REFERENCES studios(id) ON DELETE CASCADE,
    customer_id uuid NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
    vehicle_id uuid NOT NULL REFERENCES vehicles(id) ON DELETE CASCADE,
    service_id uuid REFERENCES services(id) ON DELETE SET NULL,
    service_type text NOT NULL,
    date date NOT NULL,
    time time NOT NULL,
    duration_minutes integer NOT NULL,
    price numeric NOT NULL,
    status text DEFAULT 'NOVO' CHECK (status IN ('NOVO', 'CONFIRMADO', 'EM_ROTA', 'EM_EXECUCAO', 'FINALIZADO', 'CANCELADO')),
    box_id integer,
    staff_name text,
    observation text,
    cancellation_reason text,
    is_delivery boolean DEFAULT false,
    address text,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Appointments are viewable by their studio"
    ON appointments FOR SELECT
    TO authenticated
    USING (studio_id IN (SELECT id FROM studios WHERE auth.uid()::text = id::text));

CREATE POLICY "Appointments can be inserted by their studio"
    ON appointments FOR INSERT
    TO authenticated
    WITH CHECK (studio_id IN (SELECT id FROM studios WHERE auth.uid()::text = id::text));

CREATE POLICY "Appointments can be updated by their studio"
    ON appointments FOR UPDATE
    TO authenticated
    USING (studio_id IN (SELECT id FROM studios WHERE auth.uid()::text = id::text));

CREATE POLICY "Appointments can be deleted by their studio"
    ON appointments FOR DELETE
    TO authenticated
    USING (studio_id IN (SELECT id FROM studios WHERE auth.uid()::text = id::text));

-- Expenses Table
CREATE TABLE IF NOT EXISTS expenses (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    studio_id uuid NOT NULL REFERENCES studios(id) ON DELETE CASCADE,
    description text NOT NULL,
    amount numeric NOT NULL,
    date date NOT NULL,
    category text NOT NULL CHECK (category IN ('FIXO', 'VARIAVEL', 'MARKETING', 'IMPOSTO')),
    created_at timestamptz DEFAULT now()
);

ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Expenses are viewable by their studio"
    ON expenses FOR SELECT
    TO authenticated
    USING (studio_id IN (SELECT id FROM studios WHERE auth.uid()::text = id::text));

CREATE POLICY "Expenses can be inserted by their studio"
    ON expenses FOR INSERT
    TO authenticated
    WITH CHECK (studio_id IN (SELECT id FROM studios WHERE auth.uid()::text = id::text));

CREATE POLICY "Expenses can be deleted by their studio"
    ON expenses FOR DELETE
    TO authenticated
    USING (studio_id IN (SELECT id FROM studios WHERE auth.uid()::text = id::text));

-- Portfolio Items Table
CREATE TABLE IF NOT EXISTS portfolio_items (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    studio_id uuid NOT NULL REFERENCES studios(id) ON DELETE CASCADE,
    image_url text NOT NULL,
    description text NOT NULL,
    category text,
    created_at timestamptz DEFAULT now()
);

ALTER TABLE portfolio_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Portfolio items are viewable by their studio"
    ON portfolio_items FOR SELECT
    TO authenticated
    USING (studio_id IN (SELECT id FROM studios WHERE auth.uid()::text = id::text));

CREATE POLICY "Portfolio items can be inserted by their studio"
    ON portfolio_items FOR INSERT
    TO authenticated
    WITH CHECK (studio_id IN (SELECT id FROM studios WHERE auth.uid()::text = id::text));

CREATE POLICY "Portfolio items can be deleted by their studio"
    ON portfolio_items FOR DELETE
    TO authenticated
    USING (studio_id IN (SELECT id FROM studios WHERE auth.uid()::text = id::text));

-- Reviews Table
CREATE TABLE IF NOT EXISTS reviews (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    studio_id uuid NOT NULL REFERENCES studios(id) ON DELETE CASCADE,
    appointment_id uuid REFERENCES appointments(id) ON DELETE SET NULL,
    customer_name text NOT NULL,
    rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment text NOT NULL,
    reply text,
    created_at timestamptz DEFAULT now()
);

ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Reviews are viewable by their studio"
    ON reviews FOR SELECT
    TO authenticated
    USING (studio_id IN (SELECT id FROM studios WHERE auth.uid()::text = id::text));

CREATE POLICY "Reviews can be inserted by anyone"
    ON reviews FOR INSERT
    TO authenticated
    WITH CHECK (true);

CREATE POLICY "Reviews can be updated by their studio"
    ON reviews FOR UPDATE
    TO authenticated
    USING (studio_id IN (SELECT id FROM studios WHERE auth.uid()::text = id::text));

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_customers_studio_id ON customers(studio_id);
CREATE INDEX IF NOT EXISTS idx_vehicles_customer_id ON vehicles(customer_id);
CREATE INDEX IF NOT EXISTS idx_services_studio_id ON services(studio_id);
CREATE INDEX IF NOT EXISTS idx_appointments_studio_id ON appointments(studio_id);
CREATE INDEX IF NOT EXISTS idx_appointments_date ON appointments(date);
CREATE INDEX IF NOT EXISTS idx_appointments_status ON appointments(status);
CREATE INDEX IF NOT EXISTS idx_expenses_studio_id ON expenses(studio_id);
CREATE INDEX IF NOT EXISTS idx_portfolio_studio_id ON portfolio_items(studio_id);
CREATE INDEX IF NOT EXISTS idx_reviews_studio_id ON reviews(studio_id);
CREATE INDEX IF NOT EXISTS idx_studios_slug ON studios(slug);

-- Updated at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply updated_at triggers
CREATE TRIGGER update_studios_updated_at BEFORE UPDATE ON studios
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_customers_updated_at BEFORE UPDATE ON customers
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_services_updated_at BEFORE UPDATE ON services
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_appointments_updated_at BEFORE UPDATE ON appointments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

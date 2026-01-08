/*
  # Seed Initial Data for CarbonCar

  ## Overview
  Popula o banco com dados iniciais para o estúdio de demonstração "Carbon Detail"

  ## Data Created
  - 1 Studio (Carbon Detail)
  - 2 Customers com veículos
  - 4 Services
  - 2 Appointments
  - 1 Expense
  - 2 Portfolio Items
  - 1 Review
*/

-- Insert Demo Studio
INSERT INTO studios (
  id,
  slug,
  business_name,
  address,
  box_capacity,
  patio_capacity,
  slot_interval_minutes,
  online_booking_enabled,
  loyalty_program_enabled,
  operating_days,
  plan_type,
  billing_cycle,
  subscription_status,
  trial_start_date
) VALUES (
  '00000000-0000-0000-0000-000000000001',
  'carbon',
  'Carbon Detail',
  'Av. Paulista, 1000 - São Paulo, SP',
  3,
  5,
  30,
  true,
  true,
  '[
    {"dayOfWeek": 0, "isOpen": false, "openTime": "00:00", "closeTime": "00:00"},
    {"dayOfWeek": 1, "isOpen": true, "openTime": "08:00", "closeTime": "18:00"},
    {"dayOfWeek": 2, "isOpen": true, "openTime": "08:00", "closeTime": "18:00"},
    {"dayOfWeek": 3, "isOpen": true, "openTime": "08:00", "closeTime": "18:00"},
    {"dayOfWeek": 4, "isOpen": true, "openTime": "08:00", "closeTime": "18:00"},
    {"dayOfWeek": 5, "isOpen": true, "openTime": "08:00", "closeTime": "18:00"},
    {"dayOfWeek": 6, "isOpen": true, "openTime": "09:00", "closeTime": "14:00"}
  ]'::jsonb,
  'ELITE',
  'MONTHLY',
  'TRIAL',
  now()
) ON CONFLICT (id) DO NOTHING;

-- Insert Demo Customers
INSERT INTO customers (
  id,
  studio_id,
  name,
  phone,
  email,
  total_spent,
  last_visit,
  xp_points,
  washes,
  status
) VALUES
  (
    '00000000-0000-0000-0001-000000000001',
    '00000000-0000-0000-0000-000000000001',
    'Roberto Silva',
    '(11) 99999-1234',
    'roberto@email.com',
    1250.00,
    CURRENT_DATE - INTERVAL '5 days',
    1250,
    7,
    'ATIVO'
  ),
  (
    '00000000-0000-0000-0001-000000000002',
    '00000000-0000-0000-0000-000000000001',
    'Ana Souza',
    '(11) 98888-5678',
    'ana@email.com',
    450.00,
    CURRENT_DATE - INTERVAL '2 days',
    450,
    3,
    'ATIVO'
  )
ON CONFLICT (id) DO NOTHING;

-- Insert Demo Vehicles
INSERT INTO vehicles (
  id,
  customer_id,
  brand,
  model,
  plate,
  color,
  type
) VALUES
  (
    '00000000-0000-0000-0002-000000000001',
    '00000000-0000-0000-0001-000000000001',
    'BMW',
    'X5',
    'ABC-1234',
    'Preto',
    'SUV'
  ),
  (
    '00000000-0000-0000-0002-000000000002',
    '00000000-0000-0000-0001-000000000001',
    'Porsche',
    '911',
    'XYZ-9999',
    'Prata',
    'CARRO'
  ),
  (
    '00000000-0000-0000-0002-000000000003',
    '00000000-0000-0000-0001-000000000002',
    'Jeep',
    'Compass',
    'BRA-2E19',
    'Branco',
    'SUV'
  )
ON CONFLICT (id) DO NOTHING;

-- Insert Demo Services
INSERT INTO services (
  id,
  studio_id,
  name,
  description,
  duration_minutes,
  price,
  compatible_vehicles,
  active,
  allows_fixed
) VALUES
  (
    '00000000-0000-0000-0003-000000000001',
    '00000000-0000-0000-0000-000000000001',
    'Lavagem Simples',
    'Lavagem externa e aspiração',
    45,
    60.00,
    '["CARRO", "SUV"]'::jsonb,
    true,
    true
  ),
  (
    '00000000-0000-0000-0003-000000000002',
    '00000000-0000-0000-0000-000000000001',
    'Lavagem Detalhada',
    'Limpeza de motor, chassi e cera',
    90,
    150.00,
    '["CARRO", "SUV", "UTILITARIO"]'::jsonb,
    true,
    true
  ),
  (
    '00000000-0000-0000-0003-000000000003',
    '00000000-0000-0000-0000-000000000001',
    'Polimento Técnico',
    'Correção de verniz (1 etapa)',
    240,
    450.00,
    '["CARRO", "SUV"]'::jsonb,
    true,
    true
  ),
  (
    '00000000-0000-0000-0003-000000000004',
    '00000000-0000-0000-0000-000000000001',
    'Higienização Interna',
    'Limpeza profunda de estofados',
    120,
    200.00,
    '["CARRO", "SUV", "UTILITARIO"]'::jsonb,
    true,
    true
  )
ON CONFLICT (id) DO NOTHING;

-- Insert Demo Appointments
INSERT INTO appointments (
  id,
  studio_id,
  customer_id,
  vehicle_id,
  service_id,
  service_type,
  date,
  time,
  duration_minutes,
  price,
  status,
  box_id,
  staff_name,
  observation
) VALUES
  (
    '00000000-0000-0000-0004-000000000001',
    '00000000-0000-0000-0000-000000000001',
    '00000000-0000-0000-0001-000000000001',
    '00000000-0000-0000-0002-000000000001',
    '00000000-0000-0000-0003-000000000003',
    'Polimento Técnico',
    CURRENT_DATE,
    '09:00',
    240,
    450.00,
    'EM_EXECUCAO',
    1,
    'Carlos Detalhe',
    'Cliente extremamente exigente com as rodas.'
  ),
  (
    '00000000-0000-0000-0004-000000000002',
    '00000000-0000-0000-0000-000000000001',
    '00000000-0000-0000-0001-000000000002',
    '00000000-0000-0000-0002-000000000003',
    '00000000-0000-0000-0003-000000000002',
    'Lavagem Detalhada',
    CURRENT_DATE,
    '14:00',
    90,
    150.00,
    'CONFIRMADO',
    2,
    'João Mobile',
    'Cuidado com o sensor de ré que está solto.'
  )
ON CONFLICT (id) DO NOTHING;

-- Insert Demo Expense
INSERT INTO expenses (
  id,
  studio_id,
  description,
  amount,
  date,
  category
) VALUES
  (
    '00000000-0000-0000-0005-000000000001',
    '00000000-0000-0000-0000-000000000001',
    'Aluguel Base Operacional',
    1200.00,
    CURRENT_DATE,
    'FIXO'
  )
ON CONFLICT (id) DO NOTHING;

-- Insert Demo Portfolio Items
INSERT INTO portfolio_items (
  id,
  studio_id,
  image_url,
  description,
  category
) VALUES
  (
    '00000000-0000-0000-0006-000000000001',
    '00000000-0000-0000-0000-000000000001',
    'https://images.unsplash.com/photo-1601362840469-51e4d8d58785?auto=format&fit=crop&q=80&w=300&h=200',
    'Polimento Técnico Porsche',
    'Polimento'
  ),
  (
    '00000000-0000-0000-0006-000000000002',
    '00000000-0000-0000-0000-000000000001',
    'https://images.unsplash.com/photo-1552930294-6b595f4c2974?auto=format&fit=crop&q=80&w=300&h=200',
    'Vitrificação BMW',
    'Vitrificação'
  )
ON CONFLICT (id) DO NOTHING;

-- Insert Demo Review
INSERT INTO reviews (
  id,
  studio_id,
  customer_name,
  rating,
  comment
) VALUES
  (
    '00000000-0000-0000-0007-000000000001',
    '00000000-0000-0000-0000-000000000001',
    'Roberto S.',
    5,
    'Melhor estética da região! O polimento ficou incrível.'
  )
ON CONFLICT (id) DO NOTHING;

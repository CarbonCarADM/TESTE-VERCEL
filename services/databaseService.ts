import { supabase } from '../lib/supabaseClient';
import {
  Customer, Vehicle, Appointment, ServiceItem,
  Expense, PortfolioItem, Review, BusinessSettings
} from '../types';

export interface Studio {
  id: string;
  slug: string;
  business_name: string;
  address?: string;
  cnpj?: string;
  profile_image_url?: string;
  box_capacity: number;
  patio_capacity: number;
  slot_interval_minutes: number;
  online_booking_enabled: boolean;
  loyalty_program_enabled: boolean;
  operating_days: any[];
  special_closures?: any[];
  plan_type: string;
  billing_cycle?: string;
  subscription_status?: string;
  trial_start_date?: string;
  created_at?: string;
  updated_at?: string;
}

export const databaseService = {
  async getStudioBySlug(slug: string): Promise<Studio | null> {
    const { data, error } = await supabase
      .from('studios')
      .select('*')
      .eq('slug', slug)
      .maybeSingle();

    if (error) {
      console.error('Error fetching studio:', error);
      return null;
    }
    return data;
  },

  async createStudio(studioData: Partial<Studio>): Promise<Studio | null> {
    const { data, error } = await supabase
      .from('studios')
      .insert([studioData])
      .select()
      .single();

    if (error) {
      console.error('Error creating studio:', error);
      return null;
    }
    return data;
  },

  async updateStudio(studioId: string, updates: Partial<Studio>): Promise<boolean> {
    const { error } = await supabase
      .from('studios')
      .update(updates)
      .eq('id', studioId);

    if (error) {
      console.error('Error updating studio:', error);
      return false;
    }
    return true;
  },

  async getCustomers(studioId: string): Promise<any[]> {
    const { data, error } = await supabase
      .from('customers')
      .select(`
        *,
        vehicles (*)
      `)
      .eq('studio_id', studioId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching customers:', error);
      return [];
    }
    return data || [];
  },

  async createCustomer(studioId: string, customer: Partial<Customer>, vehicle?: Partial<Vehicle>): Promise<any | null> {
    const { data: customerData, error: customerError } = await supabase
      .from('customers')
      .insert([{
        studio_id: studioId,
        name: customer.name,
        phone: customer.phone,
        email: customer.email,
        total_spent: 0,
        xp_points: 0,
        washes: 0,
        status: 'NOVO'
      }])
      .select()
      .single();

    if (customerError) {
      console.error('Error creating customer:', customerError);
      return null;
    }

    if (vehicle && customerData) {
      const { error: vehicleError } = await supabase
        .from('vehicles')
        .insert([{
          customer_id: customerData.id,
          brand: vehicle.brand,
          model: vehicle.model,
          plate: vehicle.plate,
          color: vehicle.color || 'A definir',
          type: vehicle.type || 'CARRO'
        }]);

      if (vehicleError) {
        console.error('Error creating vehicle:', vehicleError);
      }
    }

    return customerData;
  },

  async deleteCustomer(customerId: string): Promise<boolean> {
    const { error } = await supabase
      .from('customers')
      .delete()
      .eq('id', customerId);

    if (error) {
      console.error('Error deleting customer:', error);
      return false;
    }
    return true;
  },

  async getAppointments(studioId: string): Promise<any[]> {
    const { data, error } = await supabase
      .from('appointments')
      .select('*')
      .eq('studio_id', studioId)
      .order('date', { ascending: false })
      .order('time', { ascending: true });

    if (error) {
      console.error('Error fetching appointments:', error);
      return [];
    }
    return data || [];
  },

  async createAppointment(studioId: string, appointment: Partial<Appointment>): Promise<any | null> {
    const { data, error } = await supabase
      .from('appointments')
      .insert([{
        studio_id: studioId,
        customer_id: appointment.customerId,
        vehicle_id: appointment.vehicleId,
        service_id: appointment.serviceId,
        service_type: appointment.serviceType,
        date: appointment.date,
        time: appointment.time,
        duration_minutes: appointment.durationMinutes,
        price: appointment.price,
        status: appointment.status || 'NOVO',
        box_id: appointment.boxId,
        observation: appointment.observation,
        is_delivery: appointment.isDelivery || false,
        address: appointment.address
      }])
      .select()
      .single();

    if (error) {
      console.error('Error creating appointment:', error);
      return null;
    }
    return data;
  },

  async updateAppointmentStatus(appointmentId: string, status: string): Promise<boolean> {
    const { error } = await supabase
      .from('appointments')
      .update({ status })
      .eq('id', appointmentId);

    if (error) {
      console.error('Error updating appointment status:', error);
      return false;
    }
    return true;
  },

  async getServices(studioId: string): Promise<any[]> {
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .eq('studio_id', studioId)
      .eq('active', true)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching services:', error);
      return [];
    }
    return data || [];
  },

  async createService(studioId: string, service: Partial<ServiceItem>): Promise<any | null> {
    const { data, error } = await supabase
      .from('services')
      .insert([{
        studio_id: studioId,
        name: service.name,
        description: service.description,
        duration_minutes: service.durationMinutes,
        price: service.price,
        compatible_vehicles: service.compatibleVehicles,
        active: service.active ?? true,
        allows_fixed: service.allowsFixed ?? true
      }])
      .select()
      .single();

    if (error) {
      console.error('Error creating service:', error);
      return null;
    }
    return data;
  },

  async updateService(serviceId: string, updates: Partial<ServiceItem>): Promise<boolean> {
    const { error } = await supabase
      .from('services')
      .update({
        name: updates.name,
        description: updates.description,
        duration_minutes: updates.durationMinutes,
        price: updates.price,
        compatible_vehicles: updates.compatibleVehicles,
        active: updates.active
      })
      .eq('id', serviceId);

    if (error) {
      console.error('Error updating service:', error);
      return false;
    }
    return true;
  },

  async deleteService(serviceId: string): Promise<boolean> {
    const { error } = await supabase
      .from('services')
      .delete()
      .eq('id', serviceId);

    if (error) {
      console.error('Error deleting service:', error);
      return false;
    }
    return true;
  },

  async getExpenses(studioId: string): Promise<any[]> {
    const { data, error } = await supabase
      .from('expenses')
      .select('*')
      .eq('studio_id', studioId)
      .order('date', { ascending: false });

    if (error) {
      console.error('Error fetching expenses:', error);
      return [];
    }
    return data || [];
  },

  async createExpense(studioId: string, expense: Partial<Expense>): Promise<any | null> {
    const { data, error } = await supabase
      .from('expenses')
      .insert([{
        studio_id: studioId,
        description: expense.description,
        amount: expense.amount,
        date: expense.date,
        category: expense.category
      }])
      .select()
      .single();

    if (error) {
      console.error('Error creating expense:', error);
      return null;
    }
    return data;
  },

  async getPortfolio(studioId: string): Promise<any[]> {
    const { data, error } = await supabase
      .from('portfolio_items')
      .select('*')
      .eq('studio_id', studioId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching portfolio:', error);
      return [];
    }
    return data || [];
  },

  async createPortfolioItem(studioId: string, item: Partial<PortfolioItem>): Promise<any | null> {
    const { data, error } = await supabase
      .from('portfolio_items')
      .insert([{
        studio_id: studioId,
        image_url: item.imageUrl,
        description: item.description,
        category: item.category
      }])
      .select()
      .single();

    if (error) {
      console.error('Error creating portfolio item:', error);
      return null;
    }
    return data;
  },

  async deletePortfolioItem(itemId: string): Promise<boolean> {
    const { error } = await supabase
      .from('portfolio_items')
      .delete()
      .eq('id', itemId);

    if (error) {
      console.error('Error deleting portfolio item:', error);
      return false;
    }
    return true;
  },

  async getReviews(studioId: string): Promise<any[]> {
    const { data, error } = await supabase
      .from('reviews')
      .select('*')
      .eq('studio_id', studioId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching reviews:', error);
      return [];
    }
    return data || [];
  },

  async updateReviewReply(reviewId: string, reply: string): Promise<boolean> {
    const { error } = await supabase
      .from('reviews')
      .update({ reply })
      .eq('id', reviewId);

    if (error) {
      console.error('Error updating review reply:', error);
      return false;
    }
    return true;
  }
};

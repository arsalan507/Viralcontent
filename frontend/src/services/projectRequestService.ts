import { supabase } from '@/lib/supabase';

export interface ProjectRequest {
  id: string;
  title: string;
  description?: string;
  estimated_shoot_date?: string;
  people_required?: number;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'IN_PROGRESS';
  requested_by: string;
  reviewed_by?: string;
  created_at: string;
  updated_at: string;
  reviewed_at?: string;
  admin_notes?: string;
  viral_analysis_id?: string;
}

export interface CreateProjectRequestData {
  title: string;
  description?: string;
  estimated_shoot_date?: string;
  people_required?: number;
}

export const projectRequestService = {
  /**
   * Create a new project request
   */
  async createRequest(data: CreateProjectRequestData): Promise<ProjectRequest> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data: request, error } = await supabase
      .from('project_requests')
      .insert({
        title: data.title,
        description: data.description,
        estimated_shoot_date: data.estimated_shoot_date,
        people_required: data.people_required,
        requested_by: user.id,
        status: 'PENDING',
      })
      .select()
      .single();

    if (error) throw error;
    return request;
  },

  /**
   * Get all project requests for current user (videographer)
   */
  async getMyRequests(): Promise<ProjectRequest[]> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('project_requests')
      .select('*')
      .eq('requested_by', user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  /**
   * Get all project requests (admin only)
   */
  async getAllRequests(): Promise<ProjectRequest[]> {
    const { data, error } = await supabase
      .from('project_requests')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  /**
   * Update request status (admin only)
   */
  async updateRequestStatus(
    requestId: string,
    status: ProjectRequest['status'],
    adminNotes?: string
  ): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { error } = await supabase
      .from('project_requests')
      .update({
        status,
        admin_notes: adminNotes,
        reviewed_by: user.id,
        reviewed_at: new Date().toISOString(),
      })
      .eq('id', requestId);

    if (error) throw error;
  },

  /**
   * Delete a request
   */
  async deleteRequest(requestId: string): Promise<void> {
    const { error } = await supabase
      .from('project_requests')
      .delete()
      .eq('id', requestId);

    if (error) throw error;
  },
};

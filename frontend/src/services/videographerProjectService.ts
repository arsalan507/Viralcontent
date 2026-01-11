import { supabase } from '@/lib/supabase';

export interface CreateVideographerProjectData {
  title: string; // This will be the hook
  reference_url: string;
  description?: string;
  estimated_shoot_date?: string;
  people_required?: number;
}

export const videographerProjectService = {
  /**
   * Create a new viral analysis entry for videographer-initiated projects
   */
  async createProject(data: CreateVideographerProjectData) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    // Create viral_analysis entry with SHOOTING stage
    const { data: analysis, error } = await supabase
      .from('viral_analyses')
      .insert({
        user_id: user.id,
        reference_url: data.reference_url,
        hook: data.title,
        how_to_replicate: data.description || 'Videographer-initiated project',
        target_emotion: 'N/A',
        expected_outcome: 'N/A',
        status: 'APPROVED', // Auto-approve videographer projects
        production_stage: 'SHOOTING',
        priority: 'NORMAL',
        total_people_involved: data.people_required || 1,
      })
      .select()
      .single();

    if (error) throw error;

    // Assign videographer to the project
    const { error: assignmentError } = await supabase
      .from('project_assignments')
      .insert({
        analysis_id: analysis.id,
        user_id: user.id,
        role: 'VIDEOGRAPHER',
        assigned_by: user.id,
      });

    if (assignmentError) {
      console.error('Failed to create assignment:', assignmentError);
      // Don't throw - the project was created successfully
    }

    return analysis;
  },
};

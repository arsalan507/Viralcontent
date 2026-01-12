import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import {
  Cog6ToothIcon,
  UserPlusIcon,
  CloudIcon,
  TrashIcon,
  UserCircleIcon,
  DocumentTextIcon,
  Bars3Icon,
  PlusIcon,
} from '@heroicons/react/24/outline';
import { UserRole } from '@/types';
import { supabase } from '@/lib/supabase';
import { adminUserService } from '@/services/adminUserService';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<'team' | 'drive' | 'fields'>('team');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Cog6ToothIcon className="w-8 h-8 text-primary-600 mr-3" />
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
            <p className="mt-1 text-gray-600">
              Manage team members and configure Google Drive integration
            </p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 bg-white rounded-t-lg">
        <div className="flex space-x-1 px-6">
          <button
            onClick={() => setActiveTab('team')}
            className={`flex items-center px-6 py-4 text-sm font-medium border-b-2 transition ${
              activeTab === 'team'
                ? 'border-primary-600 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <UserPlusIcon className="w-5 h-5 mr-2" />
            Team Management
          </button>
          <button
            onClick={() => setActiveTab('drive')}
            className={`flex items-center px-6 py-4 text-sm font-medium border-b-2 transition ${
              activeTab === 'drive'
                ? 'border-primary-600 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <CloudIcon className="w-5 h-5 mr-2" />
            Google Drive Settings
          </button>
          <button
            onClick={() => setActiveTab('fields')}
            className={`flex items-center px-6 py-4 text-sm font-medium border-b-2 transition ${
              activeTab === 'fields'
                ? 'border-primary-600 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <DocumentTextIcon className="w-5 h-5 mr-2" />
            Script Idea Fields
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="bg-white rounded-b-lg shadow-sm">
        {activeTab === 'team' && <TeamManagement />}
        {activeTab === 'drive' && <GoogleDriveSettings />}
        {activeTab === 'fields' && <ScriptIdeaFieldsManagement />}
      </div>
    </div>
  );
}

// Team Management Component
function TeamManagement() {
  const queryClient = useQueryClient();
  const [showAddForm, setShowAddForm] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState<UserRole>(UserRole.VIDEOGRAPHER);

  // Fetch all team members
  const { data: teamMembers, isLoading } = useQuery({
    queryKey: ['team-members'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  // Create user mutation - uses backend API with service role
  const createUserMutation = useMutation({
    mutationFn: async (userData: {
      email: string;
      password: string;
      fullName: string;
      role: UserRole;
    }) => {
      return await adminUserService.createUser(userData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['team-members'] });
      toast.success('Team member added successfully!');
      setShowAddForm(false);
      setEmail('');
      setPassword('');
      setFullName('');
      setRole(UserRole.VIDEOGRAPHER);
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to add team member');
    },
  });

  // Update user role mutation
  const updateUserRoleMutation = useMutation({
    mutationFn: async ({ userId, newRole }: { userId: string; newRole: UserRole }) => {
      const { error } = await supabase
        .from('profiles')
        .update({ role: newRole })
        .eq('id', userId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['team-members'] });
      toast.success('Role updated successfully!');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to update role');
    },
  });

  // Delete user mutation - uses backend API with service role
  const deleteUserMutation = useMutation({
    mutationFn: async (userId: string) => {
      return await adminUserService.deleteUser(userId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['team-members'] });
      toast.success('Team member removed successfully!');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to remove team member');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createUserMutation.mutate({ email, password, fullName, role });
  };

  const handleRoleChange = (userId: string, newRole: UserRole) => {
    updateUserRoleMutation.mutate({ userId, newRole });
  };

  const handleDelete = (userId: string, name: string) => {
    if (confirm(`Are you sure you want to remove ${name} from the team?`)) {
      deleteUserMutation.mutate(userId);
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'SUPER_ADMIN':
        return 'bg-red-100 text-red-800';
      case 'CREATOR':
        return 'bg-purple-100 text-purple-800';
      case 'VIDEOGRAPHER':
        return 'bg-blue-100 text-blue-800';
      case 'EDITOR':
        return 'bg-green-100 text-green-800';
      case 'POSTING_MANAGER':
        return 'bg-pink-100 text-pink-800';
      case 'SCRIPT_WRITER':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header with Add Button */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Team Members</h2>
          <p className="text-sm text-gray-600 mt-1">
            Manage user accounts and roles for your organization
          </p>
        </div>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition"
        >
          <UserPlusIcon className="w-5 h-5 mr-2" />
          Add Team Member
        </button>
      </div>

      {/* Add Team Member Form */}
      {showAddForm && (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Add New Team Member</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="John Doe"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="john@example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Minimum 6 characters"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Role
                </label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as UserRole)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value={UserRole.VIDEOGRAPHER}>Videographer</option>
                  <option value={UserRole.EDITOR}>Editor</option>
                  <option value={UserRole.POSTING_MANAGER}>Posting Manager</option>
                  <option value={UserRole.SCRIPT_WRITER}>Script Writer</option>
                  <option value={UserRole.CREATOR}>Creator</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={createUserMutation.isPending}
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 transition"
              >
                {createUserMutation.isPending ? 'Adding...' : 'Add Member'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Team Members List */}
      <div className="border border-gray-200 rounded-lg overflow-hidden">
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          </div>
        ) : teamMembers && teamMembers.length > 0 ? (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Member
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Joined
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {teamMembers.map((member) => (
                <tr key={member.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center">
                        {member.avatar_url ? (
                          <img
                            src={member.avatar_url}
                            alt={member.full_name || member.email}
                            className="w-10 h-10 rounded-full"
                          />
                        ) : (
                          <UserCircleIcon className="w-6 h-6 text-primary-600" />
                        )}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {member.full_name || 'No name'}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{member.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {member.role === 'SUPER_ADMIN' ? (
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getRoleBadgeColor(
                          member.role
                        )}`}
                      >
                        {member.role.replace('_', ' ')}
                      </span>
                    ) : (
                      <select
                        value={member.role}
                        onChange={(e) => handleRoleChange(member.id, e.target.value as UserRole)}
                        disabled={updateUserRoleMutation.isPending}
                        className="text-sm border border-gray-300 rounded-lg px-3 py-1 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 disabled:opacity-50"
                      >
                        <option value={UserRole.VIDEOGRAPHER}>Videographer</option>
                        <option value={UserRole.EDITOR}>Editor</option>
                        <option value={UserRole.POSTING_MANAGER}>Posting Manager</option>
                        <option value={UserRole.SCRIPT_WRITER}>Script Writer</option>
                        <option value={UserRole.CREATOR}>Creator</option>
                      </select>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(member.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    {member.role !== 'SUPER_ADMIN' && (
                      <button
                        onClick={() => handleDelete(member.id, member.full_name || member.email)}
                        disabled={deleteUserMutation.isPending}
                        className="text-red-600 hover:text-red-900 disabled:opacity-50"
                      >
                        <TrashIcon className="w-5 h-5" />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="text-center py-12">
            <UserCircleIcon className="mx-auto h-12 w-12 text-gray-400" />
            <p className="mt-2 text-gray-500">No team members yet</p>
          </div>
        )}
      </div>
    </div>
  );
}

// Google Drive Settings Component
function GoogleDriveSettings() {
  const [driveUrl, setDriveUrl] = useState(localStorage.getItem('default_drive_folder') || '');
  const [apiKey, setApiKey] = useState(localStorage.getItem('google_api_key') || '');
  const [clientId, setClientId] = useState(localStorage.getItem('google_client_id') || '');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Save Google Drive settings to localStorage
      localStorage.setItem('default_drive_folder', driveUrl);
      localStorage.setItem('google_api_key', apiKey);
      localStorage.setItem('google_client_id', clientId);
      toast.success('Google Drive settings saved!');
    } catch (error) {
      toast.error('Failed to save settings');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900">Google Drive Integration</h2>
        <p className="text-sm text-gray-600 mt-1">
          Configure the default Google Drive folder for video production workflow
        </p>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="font-medium text-blue-900 mb-2">How it works:</h3>
        <ol className="list-decimal list-inside space-y-2 text-sm text-blue-800">
          <li>Set up Google Drive API credentials from Google Cloud Console</li>
          <li>Create a Google Drive folder for your projects</li>
          <li>Set sharing permissions to allow team members to access</li>
          <li>Videographers can upload files directly through the app</li>
          <li>Files are automatically uploaded to your Google Drive folder</li>
        </ol>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Google API Credentials */}
        <div className="border-b pb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Google API Credentials</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Google API Key
              </label>
              <input
                type="text"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent font-mono text-sm"
                placeholder="AIzaSy..."
              />
              <p className="mt-2 text-xs text-gray-500">
                Get your API key from{' '}
                <a
                  href="https://console.cloud.google.com/apis/credentials"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary-600 hover:text-primary-700 underline"
                >
                  Google Cloud Console
                </a>
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Google Client ID
              </label>
              <input
                type="text"
                value={clientId}
                onChange={(e) => setClientId(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent font-mono text-sm"
                placeholder="123456789-abc.apps.googleusercontent.com"
              />
              <p className="mt-2 text-xs text-gray-500">
                OAuth 2.0 Client ID from Google Cloud Console
              </p>
            </div>
          </div>
        </div>

        {/* Google Drive Folder */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Default Upload Folder</h3>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Google Drive Folder URL
            </label>
            <input
              type="url"
              value={driveUrl}
              onChange={(e) => setDriveUrl(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="https://drive.google.com/drive/folders/..."
            />
            <p className="mt-2 text-xs text-gray-500">
              Files will be uploaded to this folder by default
            </p>
          </div>
        </div>

        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <h3 className="font-medium text-gray-900 mb-2">Best Practices:</h3>
          <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
            <li>Create a main folder with subfolders for each project</li>
            <li>Use clear naming: "ProjectName_RawFootage" and "ProjectName_Edited"</li>
            <li>Ensure all team members have edit access to the folders</li>
            <li>Consider using Google Shared Drives for better organization</li>
            <li>Set up automatic backup for important files</li>
          </ul>
        </div>

        <div className="flex justify-end pt-4">
          <button
            type="submit"
            disabled={isLoading}
            className="px-6 py-2.5 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 transition"
          >
            {isLoading ? 'Saving...' : 'Save Settings'}
          </button>
        </div>
      </form>
    </div>
  );
}

// Script Idea Fields Management Component
interface ScriptField {
  id: string;
  name: string;
  required: boolean;
}

function ScriptIdeaFieldsManagement() {
  const [fields, setFields] = useState<ScriptField[]>(() => {
    // Load from localStorage or use defaults
    const saved = localStorage.getItem('script_idea_fields');
    if (saved) {
      return JSON.parse(saved);
    }
    // Default fields
    return [
      { id: '1', name: 'Hook', required: true },
      { id: '2', name: 'Main Content', required: true },
      { id: '3', name: 'Call to Action', required: false },
      { id: '4', name: 'Target Emotion', required: true },
      { id: '5', name: 'Expected Outcome', required: true },
    ];
  });

  const [newFieldName, setNewFieldName] = useState('');
  const [newFieldRequired, setNewFieldRequired] = useState(false);

  // Save fields to localStorage whenever they change
  const saveFields = (updatedFields: ScriptField[]) => {
    setFields(updatedFields);
    localStorage.setItem('script_idea_fields', JSON.stringify(updatedFields));
    toast.success('Script fields updated successfully!');
  };

  const handleAddField = (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    if (!newFieldName.trim()) {
      toast.error('Please enter a field name');
      return;
    }

    const newField: ScriptField = {
      id: Date.now().toString(),
      name: newFieldName.trim(),
      required: newFieldRequired,
    };

    saveFields([...fields, newField]);
    setNewFieldName('');
    setNewFieldRequired(false);
  };

  const handleDeleteField = (id: string) => {
    const field = fields.find(f => f.id === id);
    if (confirm(`Are you sure you want to delete the "${field?.name}" field?`)) {
      saveFields(fields.filter(f => f.id !== id));
    }
  };

  const handleToggleRequired = (id: string) => {
    saveFields(
      fields.map(f =>
        f.id === id ? { ...f, required: !f.required } : f
      )
    );
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddField();
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900">Script Idea Fields</h2>
        <p className="text-sm text-gray-600 mt-1">
          Customize the information script writers need to provide when submitting script ideas
        </p>
      </div>

      {/* Info Banner */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="font-medium text-blue-900 mb-2">How it works:</h3>
        <ul className="list-disc list-inside space-y-1 text-sm text-blue-800">
          <li>Add custom fields that script writers will fill out when submitting ideas</li>
          <li>Mark fields as required or optional based on your workflow</li>
          <li>Reorder fields by dragging (coming soon)</li>
          <li>Delete fields you no longer need</li>
        </ul>
      </div>

      {/* Add New Field Form */}
      <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
        <h3 className="text-sm font-semibold text-gray-900 mb-3">Add New Field</h3>
        <form onSubmit={handleAddField} className="flex items-end gap-3">
          <div className="flex-1">
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Field Name
            </label>
            <input
              type="text"
              value={newFieldName}
              onChange={(e) => setNewFieldName(e.target.value)}
              onKeyPress={handleKeyPress}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
              placeholder="e.g., Background Music, Location"
            />
          </div>
          <div className="flex items-center">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={newFieldRequired}
                onChange={(e) => setNewFieldRequired(e.target.checked)}
                className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
              />
              <span className="text-sm text-gray-700">Required</span>
            </label>
          </div>
          <button
            type="submit"
            className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition text-sm font-medium"
          >
            <PlusIcon className="w-4 h-4 mr-1" />
            Add Field
          </button>
        </form>
      </div>

      {/* Current Fields List */}
      <div className="border border-gray-200 rounded-lg overflow-hidden">
        <div className="bg-gray-50 px-6 py-3 border-b border-gray-200">
          <h3 className="text-sm font-semibold text-gray-900">
            Current Fields ({fields.length})
          </h3>
        </div>

        {fields.length === 0 ? (
          <div className="text-center py-12">
            <DocumentTextIcon className="mx-auto h-12 w-12 text-gray-400" />
            <p className="mt-2 text-sm text-gray-500">No fields configured yet</p>
            <p className="text-xs text-gray-400">Add your first field above to get started</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {fields.map((field, index) => (
              <div
                key={field.id}
                className="px-6 py-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4 flex-1">
                    {/* Drag Handle (for future drag-and-drop) */}
                    <div className="text-gray-400 cursor-grab hover:text-gray-600">
                      <Bars3Icon className="w-5 h-5" />
                    </div>

                    {/* Field Info */}
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium text-gray-900">
                          {field.name}
                        </span>
                        <span
                          className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                            field.required
                              ? 'bg-red-100 text-red-800'
                              : 'bg-gray-100 text-gray-600'
                          }`}
                        >
                          {field.required ? 'Required' : 'Optional'}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 mt-0.5">
                        Field #{index + 1}
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleToggleRequired(field.id)}
                      className="px-3 py-1.5 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                    >
                      {field.required ? 'Make Optional' : 'Make Required'}
                    </button>
                    <button
                      onClick={() => handleDeleteField(field.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                      title="Delete field"
                    >
                      <TrashIcon className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Best Practices */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <h3 className="font-medium text-gray-900 mb-2">Best Practices:</h3>
        <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
          <li>Keep field names clear and concise</li>
          <li>Only mark essential information as "Required"</li>
          <li>Use consistent naming conventions across fields</li>
          <li>Consider the script writer's workflow when adding fields</li>
          <li>Regularly review and remove unused fields</li>
        </ul>
      </div>

      {/* Save Note */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-3">
        <p className="text-sm text-green-800">
          <strong>Note:</strong> Changes are saved automatically when you add, delete, or modify fields.
        </p>
      </div>
    </div>
  );
}

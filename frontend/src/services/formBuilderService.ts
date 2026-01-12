/**
 * Form Builder Service
 *
 * Manages the dynamic Script Writer form configuration.
 * - Stores configuration in localStorage
 * - Provides CRUD operations for fields
 * - Handles default configuration generation
 * - Future: Can be migrated to database storage
 */

import type { ScriptFormConfig, ScriptFormFieldConfig } from '@/types/formBuilder';

const STORAGE_KEY = 'script_form_config';
const CONFIG_VERSION = '1.0.0';

/**
 * Default form configuration matching current hardcoded form
 */
function getDefaultConfig(): ScriptFormConfig {
  const fields: ScriptFormFieldConfig[] = [
    // ============================================
    // BASIC INFORMATION
    // ============================================
    {
      id: 'industry',
      fieldKey: 'industryId',
      label: 'Industry',
      placeholder: 'Select industry...',
      type: 'db-dropdown',
      dataSource: { type: 'database', table: 'industries' },
      required: true,
      enabled: true,
      order: 0,
      category: 'basic',
    },
    {
      id: 'profile',
      fieldKey: 'profileId',
      label: 'Profile / Admin',
      placeholder: 'Select profile...',
      type: 'db-dropdown',
      dataSource: { type: 'database', table: 'profile_list' },
      required: true,
      enabled: true,
      order: 1,
      category: 'basic',
    },
    {
      id: 'reference-url',
      fieldKey: 'referenceUrl',
      label: 'Reference Link',
      placeholder: 'https://www.instagram.com/reel/example or https://youtube.com/watch?v=...',
      helpText: 'Paste the link to the viral content you want to analyze',
      type: 'url',
      required: true,
      enabled: true,
      order: 2,
      category: 'basic',
    },
    {
      id: 'hook-tags',
      fieldKey: 'hookTagIds',
      label: 'Hook Tags',
      placeholder: 'Select hook types...',
      type: 'multi-select',
      dataSource: { type: 'database', table: 'hook_tags' },
      required: true,
      enabled: true,
      order: 3,
      category: 'basic',
    },

    // ============================================
    // CONTENT ANALYSIS
    // ============================================
    {
      id: 'divider-content',
      fieldKey: '_divider_content',
      label: 'Content Analysis',
      type: 'divider',
      required: false,
      enabled: true,
      order: 4,
      category: 'content',
    },
    {
      id: 'hook',
      fieldKey: 'hook',
      label: 'Hook (First 6 Seconds)',
      placeholder: 'Describe the opening hook that grabs attention in the first 6 seconds...',
      helpText: 'Or record your explanation of the hook',
      type: 'textarea-voice',
      required: true,
      enabled: true,
      order: 5,
      category: 'content',
      containerClass: 'bg-gray-50',
      rows: 3,
    },
    {
      id: 'why-viral',
      fieldKey: 'whyViral',
      label: 'Why Did It Go Viral?',
      placeholder: 'Analyze the key factors that made this content go viral...',
      helpText: 'Or record your viral analysis',
      type: 'textarea-voice',
      required: false,
      enabled: true,
      order: 6,
      category: 'content',
      containerClass: 'bg-blue-50',
      rows: 3,
    },
    {
      id: 'how-to-replicate',
      fieldKey: 'howToReplicate',
      label: 'How to Replicate for Our Brand',
      placeholder: 'Explain step-by-step how we can adapt this viral format for our brand...',
      helpText: 'Or record your replication strategy',
      type: 'textarea-voice',
      required: false,
      enabled: true,
      order: 7,
      category: 'content',
      containerClass: 'bg-green-50',
      rows: 4,
    },
    {
      id: 'target-emotion',
      fieldKey: 'targetEmotion',
      label: 'What Emotions Are We Targeting?',
      placeholder: 'Select target emotion',
      type: 'dropdown',
      dataSource: { type: 'localStorage', key: 'target_emotions' },
      required: true,
      enabled: true,
      order: 8,
      category: 'content',
    },
    {
      id: 'expected-outcome',
      fieldKey: 'expectedOutcome',
      label: 'What Outcome Do We Expect?',
      placeholder: 'Select expected outcome',
      type: 'dropdown',
      dataSource: { type: 'localStorage', key: 'expected_outcomes' },
      required: true,
      enabled: true,
      order: 9,
      category: 'content',
    },

    // ============================================
    // PRODUCTION DETAILS
    // ============================================
    {
      id: 'divider-production',
      fieldKey: '_divider_production',
      label: 'Production Details',
      helpText: 'Additional information needed for video production',
      type: 'divider',
      required: false,
      enabled: true,
      order: 10,
      category: 'production',
    },
    {
      id: 'on-screen-text',
      fieldKey: 'onScreenTextHook',
      label: 'On-Screen Text Hook',
      placeholder: "Text that will appear on screen during the hook (e.g., 'live robbery ( plus shocking emoji)')",
      helpText: 'The text overlay that will grab attention in the first few seconds',
      type: 'textarea',
      required: false,
      enabled: true,
      order: 11,
      category: 'production',
      rows: 2,
    },
    {
      id: 'our-idea',
      fieldKey: 'ourIdeaAudio',
      label: 'Our Idea (Voice Note)',
      placeholder: 'Record your detailed idea for this content',
      helpText: 'Record your detailed idea and vision for this content',
      type: 'voice',
      required: false,
      enabled: true,
      order: 12,
      category: 'production',
      containerClass: 'bg-purple-50',
    },
    {
      id: 'shoot-location',
      fieldKey: 'shootLocation',
      label: 'Location of the Shoot',
      placeholder: 'e.g., in store, outside store, client location',
      helpText: 'Where will this video be shot?',
      type: 'text',
      required: false,
      enabled: true,
      order: 13,
      category: 'production',
    },
    {
      id: 'shoot-possibility',
      fieldKey: 'shootPossibility',
      label: 'Possibility of Shoot',
      placeholder: 'Select shoot possibility',
      helpText: 'How confident are you that this can be shot successfully?',
      type: 'dropdown',
      dataSource: {
        type: 'hardcoded',
        options: [
          { value: '100', label: '100% - Definitely can shoot' },
          { value: '75', label: '75% - Very likely' },
          { value: '50', label: '50% - Moderate chance' },
          { value: '25', label: '25% - Challenging but possible' },
        ],
      },
      required: true,
      enabled: true,
      order: 14,
      category: 'production',
    },
    {
      id: 'total-people',
      fieldKey: 'totalPeopleInvolved',
      label: 'Total People Involved',
      placeholder: '1',
      type: 'number',
      required: false,
      enabled: true,
      order: 15,
      category: 'production',
      min: 1,
      max: 100,
      step: 1,
    },
    {
      id: 'character-tags',
      fieldKey: 'characterTagIds',
      label: 'Character Tags',
      placeholder: 'Select characters involved...',
      type: 'multi-select',
      dataSource: { type: 'database', table: 'character_tags' },
      required: false,
      enabled: true,
      order: 16,
      category: 'production',
    },
  ];

  return {
    version: CONFIG_VERSION,
    lastUpdated: new Date().toISOString(),
    fields,
  };
}

/**
 * Form Builder Service
 */
export const formBuilderService = {
  /**
   * Get current form configuration
   */
  getConfig(): ScriptFormConfig {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      console.log('🔍 [formBuilderService] Reading from localStorage:', STORAGE_KEY);

      if (saved) {
        const config = JSON.parse(saved) as ScriptFormConfig;
        console.log('✅ [formBuilderService] Found saved config with', config.fields.length, 'fields');
        console.log('📋 [formBuilderService] Field IDs:', config.fields.map(f => f.id).join(', '));

        // Version migration logic (future-proofing)
        if (config.version !== CONFIG_VERSION) {
          console.warn(`Form config version mismatch. Expected ${CONFIG_VERSION}, got ${config.version}`);
          // Could implement migration logic here
        }

        return config;
      }

      console.log('⚠️ [formBuilderService] No saved config found, using default');
    } catch (error) {
      console.error('❌ [formBuilderService] Failed to load form config from localStorage:', error);
    }

    // Return default config if nothing found or error
    const defaultConfig = getDefaultConfig();
    console.log('🔧 [formBuilderService] Returning default config with', defaultConfig.fields.length, 'fields');
    return defaultConfig;
  },

  /**
   * Save form configuration
   */
  saveConfig(config: ScriptFormConfig): void {
    try {
      config.lastUpdated = new Date().toISOString();
      config.version = CONFIG_VERSION;
      console.log('💾 [formBuilderService] Saving config with', config.fields.length, 'fields to localStorage');
      console.log('📋 [formBuilderService] Field IDs being saved:', config.fields.map(f => f.id).join(', '));
      localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
      console.log('✅ [formBuilderService] Config saved successfully');
    } catch (error) {
      console.error('❌ [formBuilderService] Failed to save form config to localStorage:', error);
      throw error;
    }
  },

  /**
   * Get all fields sorted by order
   */
  getAllFields(): ScriptFormFieldConfig[] {
    const config = this.getConfig();
    return [...config.fields].sort((a, b) => a.order - b.order);
  },

  /**
   * Get only enabled fields sorted by order
   */
  getEnabledFields(): ScriptFormFieldConfig[] {
    const allFields = this.getAllFields();
    const enabledFields = allFields.filter(f => f.enabled);
    console.log('🟢 [formBuilderService] getEnabledFields:', enabledFields.length, 'enabled out of', allFields.length, 'total');
    console.log('📋 [formBuilderService] Enabled field IDs:', enabledFields.map(f => `${f.id} (${f.type})`).join(', '));
    return enabledFields;
  },

  /**
   * Get field by ID
   */
  getFieldById(id: string): ScriptFormFieldConfig | undefined {
    const config = this.getConfig();
    return config.fields.find(f => f.id === id);
  },

  /**
   * Add new field
   */
  addField(field: ScriptFormFieldConfig): void {
    const config = this.getConfig();
    console.log('➕ [formBuilderService] Adding new field:', field.id, field.label, field.type);

    // Validate unique ID
    if (config.fields.some(f => f.id === field.id)) {
      throw new Error(`Field with ID "${field.id}" already exists`);
    }

    // Validate unique fieldKey
    if (config.fields.some(f => f.fieldKey === field.fieldKey)) {
      throw new Error(`Field with key "${field.fieldKey}" already exists`);
    }

    console.log('✅ [formBuilderService] Validation passed, adding field');
    config.fields.push(field);
    console.log('📦 [formBuilderService] Config now has', config.fields.length, 'fields');
    this.saveConfig(config);
  },

  /**
   * Update existing field
   */
  updateField(id: string, updates: Partial<ScriptFormFieldConfig>): void {
    const config = this.getConfig();
    const index = config.fields.findIndex(f => f.id === id);

    if (index === -1) {
      throw new Error(`Field with ID "${id}" not found`);
    }

    // If updating fieldKey, validate uniqueness
    if (updates.fieldKey && updates.fieldKey !== config.fields[index].fieldKey) {
      if (config.fields.some(f => f.fieldKey === updates.fieldKey)) {
        throw new Error(`Field with key "${updates.fieldKey}" already exists`);
      }
    }

    config.fields[index] = {
      ...config.fields[index],
      ...updates,
    };

    this.saveConfig(config);
  },

  /**
   * Delete field
   */
  deleteField(id: string): void {
    const config = this.getConfig();
    config.fields = config.fields.filter(f => f.id !== id);
    this.saveConfig(config);
  },

  /**
   * Reorder fields
   */
  reorderFields(fieldIds: string[]): void {
    const config = this.getConfig();

    // Create a map of fieldId -> order
    const orderMap = new Map(fieldIds.map((id, index) => [id, index]));

    // Update order for all fields
    config.fields.forEach(field => {
      const newOrder = orderMap.get(field.id);
      if (newOrder !== undefined) {
        field.order = newOrder;
      }
    });

    this.saveConfig(config);
  },

  /**
   * Reset to default configuration
   */
  resetToDefault(): void {
    const defaultConfig = getDefaultConfig();
    this.saveConfig(defaultConfig);
  },

  /**
   * Export configuration as JSON (for backup/sharing)
   */
  exportConfig(): string {
    const config = this.getConfig();
    return JSON.stringify(config, null, 2);
  },

  /**
   * Import configuration from JSON
   */
  importConfig(jsonString: string): void {
    try {
      const config = JSON.parse(jsonString) as ScriptFormConfig;

      // Basic validation
      if (!config.fields || !Array.isArray(config.fields)) {
        throw new Error('Invalid configuration format: missing fields array');
      }

      this.saveConfig(config);
    } catch (error) {
      console.error('Failed to import configuration:', error);
      throw new Error('Invalid configuration JSON');
    }
  },
};

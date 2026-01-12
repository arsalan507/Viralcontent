/**
 * Form Builder Types
 *
 * This file defines the schema for the dynamic Script Writer form builder.
 * Admins can configure form fields, and Script Writers see only what's enabled.
 */

// ============================================
// FIELD TYPE DEFINITIONS
// ============================================

export type FieldType =
  | 'text'           // Single-line text input
  | 'textarea'       // Multi-line text input
  | 'url'            // URL input with validation
  | 'number'         // Numeric input
  | 'dropdown'       // Single-select dropdown (from localStorage config)
  | 'db-dropdown'    // Single-select dropdown (from database via contentConfigService)
  | 'multi-select'   // Multi-select tags (from database via contentConfigService)
  | 'voice'          // Voice recorder only
  | 'textarea-voice' // Textarea + Voice recorder combo
  | 'divider';       // Visual separator with optional title

// ============================================
// DATA SOURCE TYPES
// ============================================

/**
 * Defines where dropdown/tag options come from
 */
export type DataSource =
  | { type: 'localStorage'; key: string }                    // Managed in Settings > Dropdown Options
  | { type: 'database'; table: 'industries' }                // From industries table
  | { type: 'database'; table: 'profile_list' }              // From profile_list table
  | { type: 'database'; table: 'hook_tags' }                 // From hook_tags table
  | { type: 'database'; table: 'character_tags' }            // From character_tags table
  | { type: 'hardcoded'; options: Array<{ value: string; label: string }> }; // Static options

// ============================================
// VALIDATION RULES
// ============================================

export interface ValidationRule {
  type: 'required' | 'min' | 'max' | 'pattern' | 'url' | 'email';
  value?: number | string;
  message?: string;
}

// ============================================
// CONDITIONAL VISIBILITY
// ============================================

export interface ConditionalVisibility {
  fieldId: string;      // ID of field to check
  operator: 'equals' | 'notEquals' | 'contains' | 'notContains';
  value: string | string[];
}

// ============================================
// FIELD CONFIGURATION
// ============================================

export interface ScriptFormFieldConfig {
  // Identity
  id: string;                           // Unique identifier (e.g., 'industry', 'reference-url')
  fieldKey: string;                     // Key in formData object (e.g., 'industryId', 'referenceUrl')

  // Display
  label: string;                        // Field label shown to user
  placeholder?: string;                 // Placeholder text
  helpText?: string;                    // Help text below field

  // Type & Behavior
  type: FieldType;                      // Field type
  dataSource?: DataSource;              // Where options come from (for dropdowns/tags)

  // Validation
  required: boolean;                    // Is field required?
  validation?: ValidationRule[];        // Additional validation rules

  // Ordering & Visibility
  order: number;                        // Display order (0-based, lower = earlier)
  enabled: boolean;                     // Is field visible to Script Writers?
  conditional?: ConditionalVisibility;  // Show only if condition met

  // Styling (optional)
  containerClass?: string;              // Background color class (e.g., 'bg-gray-50', 'bg-blue-50')

  // Metadata
  category?: 'basic' | 'content' | 'production'; // Logical grouping

  // Special field props
  rows?: number;                        // For textarea - number of rows (default: 3)
  min?: number;                         // For number - min value
  max?: number;                         // For number - max value
  step?: number;                        // For number - step increment
}

// ============================================
// FORM CONFIGURATION
// ============================================

export interface ScriptFormConfig {
  version: string;                      // Config version for migration
  lastUpdated: string;                  // ISO timestamp
  fields: ScriptFormFieldConfig[];      // All field configurations
}

// ============================================
// FORM VALUES (What Script Writer submits)
// ============================================

export interface DynamicFormValues {
  [fieldKey: string]: string | string[] | number | Blob | null;
}

// ============================================
// HELPER TYPES FOR UI
// ============================================

/**
 * Field with resolved options (for rendering)
 */
export interface ResolvedField extends ScriptFormFieldConfig {
  options?: Array<{ id: string; label: string; value: string }>;
}

/**
 * Category for organizing fields in admin UI
 */
export interface FieldCategory {
  id: string;
  name: string;
  description: string;
  fields: ScriptFormFieldConfig[];
}

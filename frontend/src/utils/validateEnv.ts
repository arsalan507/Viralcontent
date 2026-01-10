/**
 * Environment Variable Validation
 * Checks if required environment variables are configured
 */

export interface EnvValidation {
  isValid: boolean;
  missing: string[];
  warnings: string[];
}

export function validateEnvironment(): EnvValidation {
  const missing: string[] = [];
  const warnings: string[] = [];

  // Check Supabase configuration
  if (!import.meta.env.VITE_SUPABASE_URL) {
    missing.push('VITE_SUPABASE_URL');
  }
  if (!import.meta.env.VITE_SUPABASE_ANON_KEY) {
    missing.push('VITE_SUPABASE_ANON_KEY');
  }

  // Check Google Drive configuration
  const googleApiKey = import.meta.env.VITE_GOOGLE_API_KEY;
  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

  if (!googleApiKey || googleApiKey === 'your_google_api_key_here') {
    warnings.push('Google Drive API Key not configured. File uploads to Google Drive will not work.');
  }

  if (!googleClientId || googleClientId === 'your_google_client_id_here.apps.googleusercontent.com') {
    warnings.push('Google Client ID not configured. OAuth authentication for Google Drive will not work.');
  }

  // Check backend URL
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  if (!backendUrl) {
    warnings.push('Backend URL not configured. Admin user management features will not work.');
  } else if (backendUrl === 'http://localhost:3001' && window.location.hostname !== 'localhost') {
    warnings.push('Backend URL is set to localhost but app is running on a different host. Admin features will not work in production.');
  }

  return {
    isValid: missing.length === 0,
    missing,
    warnings,
  };
}

export function logEnvironmentStatus(): void {
  const validation = validateEnvironment();

  console.group('🔧 Environment Configuration Status');

  if (validation.isValid) {
    console.log('✅ All required environment variables are set');
  } else {
    console.error('❌ Missing required environment variables:', validation.missing);
  }

  if (validation.warnings.length > 0) {
    console.warn('⚠️ Configuration warnings:');
    validation.warnings.forEach(warning => console.warn(`  - ${warning}`));
  }

  console.log('\n📋 Current Configuration:');
  console.log('  Supabase URL:', import.meta.env.VITE_SUPABASE_URL || 'NOT SET');
  console.log('  Supabase Key:', import.meta.env.VITE_SUPABASE_ANON_KEY ? '✓ SET' : '✗ NOT SET');
  console.log('  Google API Key:', import.meta.env.VITE_GOOGLE_API_KEY && import.meta.env.VITE_GOOGLE_API_KEY !== 'your_google_api_key_here' ? '✓ SET' : '✗ NOT SET');
  console.log('  Google Client ID:', import.meta.env.VITE_GOOGLE_CLIENT_ID && import.meta.env.VITE_GOOGLE_CLIENT_ID !== 'your_google_client_id_here.apps.googleusercontent.com' ? '✓ SET' : '✗ NOT SET');
  console.log('  Backend URL:', import.meta.env.VITE_BACKEND_URL || 'NOT SET');

  console.groupEnd();
}

// Show helpful error message for Google Drive
export function getGoogleDriveConfigError(): string | null {
  const apiKey = import.meta.env.VITE_GOOGLE_API_KEY;
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

  if (!apiKey || apiKey === 'your_google_api_key_here') {
    return 'Google Drive API Key is not configured. Please set VITE_GOOGLE_API_KEY in your environment variables. See GOOGLE_DRIVE_API_SETUP.md for instructions.';
  }

  if (!clientId || clientId === 'your_google_client_id_here.apps.googleusercontent.com') {
    return 'Google Client ID is not configured. Please set VITE_GOOGLE_CLIENT_ID in your environment variables. See GOOGLE_DRIVE_API_SETUP.md for instructions.';
  }

  return null;
}

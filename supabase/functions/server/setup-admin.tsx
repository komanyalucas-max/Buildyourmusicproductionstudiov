import { createClient } from 'jsr:@supabase/supabase-js@2';

/**
 * Setup Script - Creates Default Super Admin User
 * 
 * This script creates a default admin user with:
 * Email: admin@gmail.com
 * Password: pass@123
 * 
 * Run this once to initialize the admin account.
 */

async function setupAdmin() {
  const supabaseUrl = Deno.env.get('SUPABASE_URL');
  const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

  if (!supabaseUrl || !supabaseServiceKey) {
    console.error('❌ Error: SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set');
    Deno.exit(1);
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  console.log('🚀 Creating default super admin user...');

  try {
    // Create admin user
    const { data, error } = await supabase.auth.admin.createUser({
      email: 'admin@gmail.com',
      password: 'pass@123',
      email_confirm: true, // Auto-confirm since email server isn't configured
      user_metadata: {
        name: 'Super Admin',
        role: 'admin',
      },
    });

    if (error) {
      if (error.message.includes('already been registered')) {
        console.log('ℹ️  Admin user already exists');
        console.log('✅ Email: admin@gmail.com');
        console.log('✅ Password: pass@123');
      } else {
        console.error('❌ Error creating admin user:', error.message);
        Deno.exit(1);
      }
    } else {
      console.log('✅ Super admin user created successfully!');
      console.log('');
      console.log('📧 Email: admin@gmail.com');
      console.log('🔑 Password: pass@123');
      console.log('👤 Name: Super Admin');
      console.log('🛡️  Role: admin');
      console.log('');
      console.log('⚠️  SECURITY WARNING: Change the default password after first login!');
    }
  } catch (err) {
    console.error('❌ Unexpected error:', err);
    Deno.exit(1);
  }
}

// Run the setup
setupAdmin();

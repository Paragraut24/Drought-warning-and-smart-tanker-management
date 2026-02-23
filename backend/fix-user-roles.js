import sequelize from './config/database.js';

async function fixUserRoles() {
  try {
    console.log('Connecting to database...');
    await sequelize.authenticate();
    console.log('✓ Connected\n');

    console.log('Fixing user roles...');
    
    // Update any invalid roles to 'local_user'
    await sequelize.query(`
      UPDATE Users 
      SET role = 'local_user' 
      WHERE role NOT IN ('admin', 'local_user')
    `);

    console.log('✓ User roles fixed\n');

    // Show current users
    const [users] = await sequelize.query(`
      SELECT id, username, email, role 
      FROM Users
    `);

    console.log('Current users:');
    users.forEach(u => {
      console.log(`  ${u.id}. ${u.username} (${u.email}) - Role: ${u.role}`);
    });

    console.log('\n✓ All done!\n');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

fixUserRoles();

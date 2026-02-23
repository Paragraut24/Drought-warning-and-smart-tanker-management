import sequelize from './config/database.js';
import { User, Village } from './models/index.js';

async function checkUsers() {
  try {
    console.log('👥 Checking users in database...\n');

    const users = await User.findAll({
      include: [{ model: Village, attributes: ['name', 'district'] }]
    });

    if (users.length === 0) {
      console.log('⚠️  No users found in database!\n');
      return;
    }

    console.log(`Found ${users.length} users:\n`);
    users.forEach(user => {
      console.log(`📧 Email: ${user.email}`);
      console.log(`   Username: ${user.username}`);
      console.log(`   Role: ${user.role}`);
      console.log(`   Village: ${user.Village ? `${user.Village.name} (${user.Village.district})` : 'N/A'}`);
      console.log(`   Password Hash: ${user.password.substring(0, 20)}...`);
      console.log('');
    });

  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await sequelize.close();
  }
}

checkUsers();

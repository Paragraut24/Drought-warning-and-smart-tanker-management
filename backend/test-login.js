import sequelize from './config/database.js';
import { User, Village } from './models/index.js';
import bcrypt from 'bcryptjs';

async function testLogin() {
  try {
    const testEmail = 'admin@water.gov';
    const testPassword = 'admin123';

    console.log(`🔐 Testing login for: ${testEmail}\n`);

    const user = await User.findOne({
      where: { email: testEmail },
      include: [{ model: Village, attributes: ['id', 'name', 'district'] }]
    });

    if (!user) {
      console.log('❌ User not found!\n');
      return;
    }

    console.log('✅ User found:');
    console.log(`   Email: ${user.email}`);
    console.log(`   Username: ${user.username}`);
    console.log(`   Role: ${user.role}`);
    console.log(`   Password Hash: ${user.password.substring(0, 30)}...\n`);

    console.log(`Testing password: "${testPassword}"`);
    const isValid = await user.comparePassword(testPassword);
    
    if (isValid) {
      console.log('✅ Password is CORRECT!\n');
    } else {
      console.log('❌ Password is INCORRECT!\n');
      
      // Try direct bcrypt compare
      const directCompare = await bcrypt.compare(testPassword, user.password);
      console.log(`Direct bcrypt.compare result: ${directCompare}\n`);
    }

  } catch (error) {
    console.error('Error:', error.message);
    console.error(error);
  } finally {
    await sequelize.close();
  }
}

testLogin();

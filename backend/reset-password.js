import sequelize from './config/database.js';
import { User } from './models/index.js';
import bcrypt from 'bcryptjs';

async function resetPassword() {
  try {
    const email = 'nagpur@gmail.com';
    const newPassword = 'ngp123';

    console.log(`🔐 Resetting password for: ${email}\n`);

    const user = await User.findOne({ where: { email } });

    if (!user) {
      console.log('❌ User not found!\n');
      return;
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    
    // Update the user's password
    await user.update({ password: hashedPassword });

    console.log('✅ Password reset successfully!\n');
    console.log(`📧 Email: ${email}`);
    console.log(`🔑 New Password: ${newPassword}\n`);

  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await sequelize.close();
  }
}

resetPassword();

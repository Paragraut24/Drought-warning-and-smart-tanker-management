import { Tanker } from './models/index.js';
import sequelize from './config/database.js';

async function resetTankers() {
  try {
    console.log('🔄 Resetting tanker status...\n');

    await sequelize.authenticate();
    console.log('✅ Database connected\n');

    // Get all tankers
    const tankers = await Tanker.findAll();
    console.log(`Found ${tankers.length} tankers\n`);

    // Reset all to available
    const updated = await Tanker.update(
      { status: 'available' },
      { where: {} }
    );

    console.log(`✅ Reset ${updated[0]} tankers to 'available' status\n`);

    // Show current status
    const allTankers = await Tanker.findAll();
    console.log('Current Tanker Status:');
    allTankers.forEach(t => {
      console.log(`  ${t.registration_number}: ${t.status}`);
    });

    console.log('\n✅ All tankers are now available for allocation!');
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await sequelize.close();
  }
}

resetTankers();

import sequelize from './config/database.js';
import { User, Village, RainfallRecord, GroundwaterRecord, Tanker, Alert, Allocation } from './models/index.js';

async function clearAndReseed() {
  try {
    console.log('🗑️  Clearing existing data...\n');

    // Delete all data in correct order (respecting foreign keys)
    await Allocation.destroy({ where: {}, force: true });
    console.log('✅ Cleared allocations');
    
    await Alert.destroy({ where: {}, force: true });
    console.log('✅ Cleared alerts');
    
    await GroundwaterRecord.destroy({ where: {}, force: true });
    console.log('✅ Cleared groundwater records');
    
    await RainfallRecord.destroy({ where: {}, force: true });
    console.log('✅ Cleared rainfall records');
    
    await Tanker.destroy({ where: {}, force: true });
    console.log('✅ Cleared tankers');
    
    await Village.destroy({ where: {}, force: true });
    console.log('✅ Cleared villages');
    
    await User.destroy({ where: {}, force: true });
    console.log('✅ Cleared users\n');

    console.log('✅ All data cleared successfully!\n');
    console.log('Now run: node seed-database.js\n');

  } catch (error) {
    console.error('❌ Error clearing data:', error);
  } finally {
    await sequelize.close();
  }
}

clearAndReseed();

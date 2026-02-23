import sequelize from './config/database.js';
import { User, Village, RainfallRecord, GroundwaterRecord, Tanker, Alert, Allocation } from './models/index.js';

async function checkData() {
  try {
    console.log('📊 Checking database data...\n');

    const counts = {
      users: await User.count(),
      villages: await Village.count(),
      rainfall: await RainfallRecord.count(),
      groundwater: await GroundwaterRecord.count(),
      tankers: await Tanker.count(),
      alerts: await Alert.count(),
      allocations: await Allocation.count()
    };

    console.log('Current data in database:');
    console.log(`  Users: ${counts.users}`);
    console.log(`  Villages: ${counts.villages}`);
    console.log(`  Rainfall Records: ${counts.rainfall}`);
    console.log(`  Groundwater Records: ${counts.groundwater}`);
    console.log(`  Tankers: ${counts.tankers}`);
    console.log(`  Alerts: ${counts.alerts}`);
    console.log(`  Allocations: ${counts.allocations}`);
    console.log('');

    if (counts.villages > 0) {
      console.log('✅ Data exists! Dashboard should show information.\n');
      
      // Show sample villages
      const villages = await Village.findAll({ limit: 5 });
      console.log('Sample villages:');
      villages.forEach(v => {
        console.log(`  - ${v.name} (${v.district}): Pop ${v.population}, Storage ${Math.round((v.current_storage/v.storage_capacity)*100)}%`);
      });
    } else {
      console.log('⚠️  No data found. Run: npm run seed\n');
    }

  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await sequelize.close();
  }
}

checkData();

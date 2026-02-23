import sequelize from './config/database.js';
import { Village } from './models/index.js';

async function testVillages() {
  try {
    console.log('Testing villages endpoint...\n');
    
    await sequelize.authenticate();
    console.log('✅ Database connected\n');
    
    const villages = await Village.findAll({
      attributes: ['id', 'name', 'district'],
      order: [['name', 'ASC']]
    });
    
    console.log(`Found ${villages.length} villages:\n`);
    villages.forEach(v => {
      console.log(`  ${v.id}. ${v.name} (${v.district})`);
    });
    
    if (villages.length === 0) {
      console.log('\n⚠️  No villages found! Run: node backend/seed-database.js');
    }
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

testVillages();

import sequelize from './config/database.js';
import { Village } from './models/index.js';

async function checkVillages() {
  try {
    console.log('Connecting to database...');
    await sequelize.authenticate();
    console.log('✓ Database connected\n');

    console.log('Fetching villages...');
    const villages = await Village.findAll({
      attributes: ['id', 'name', 'district'],
      order: [['name', 'ASC']]
    });

    console.log(`\n✓ Found ${villages.length} villages:\n`);
    
    if (villages.length === 0) {
      console.log('❌ NO VILLAGES FOUND IN DATABASE!');
      console.log('\nSolution: Run RESEED_DATABASE.bat to add villages\n');
    } else {
      villages.forEach((v, idx) => {
        console.log(`${idx + 1}. ${v.name} (${v.district}) - ID: ${v.id}`);
      });
      console.log('\n✓ Villages are available for registration dropdown\n');
    }

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('\nPossible issues:');
    console.error('1. MySQL server is not running');
    console.error('2. Database credentials in .env are incorrect');
    console.error('3. Database "water_governance" does not exist');
    console.error('\nSolution: Run SIMPLE_DATABASE_SETUP.bat first\n');
    process.exit(1);
  }
}

checkVillages();

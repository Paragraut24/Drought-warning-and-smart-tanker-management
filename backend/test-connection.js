import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

async function testConnection() {
  console.log('🔍 Testing MySQL Connection...\n');
  
  console.log('Configuration:');
  console.log('  Host:', process.env.DB_HOST || 'localhost');
  console.log('  User:', process.env.DB_USER || 'root');
  console.log('  Database:', process.env.DB_NAME || 'water_governance');
  console.log('  Password:', process.env.DB_PASSWORD ? '***' + process.env.DB_PASSWORD.slice(-3) : 'NOT SET');
  console.log('');

  try {
    // Test 1: Connect without database
    console.log('Test 1: Connecting to MySQL server...');
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD
    });
    console.log('✅ MySQL server connection successful!\n');

    // Test 2: Check if database exists
    console.log('Test 2: Checking if database exists...');
    const [databases] = await connection.query('SHOW DATABASES');
    const dbExists = databases.some(db => db.Database === (process.env.DB_NAME || 'water_governance'));
    
    if (dbExists) {
      console.log('✅ Database exists!\n');
    } else {
      console.log('❌ Database does NOT exist!');
      console.log('   Run this command in MySQL:');
      console.log(`   CREATE DATABASE ${process.env.DB_NAME || 'water_governance'};\n`);
      await connection.end();
      return;
    }

    // Test 3: Connect to specific database
    console.log('Test 3: Connecting to database...');
    await connection.query(`USE ${process.env.DB_NAME || 'water_governance'}`);
    console.log('✅ Database connection successful!\n');

    // Test 4: Check tables
    console.log('Test 4: Checking tables...');
    const [tables] = await connection.query('SHOW TABLES');
    if (tables.length > 0) {
      console.log(`✅ Found ${tables.length} tables:`);
      tables.forEach(table => {
        console.log(`   - ${Object.values(table)[0]}`);
      });
    } else {
      console.log('ℹ️  No tables yet (will be created on first server start)');
    }

    await connection.end();
    
    console.log('\n🎉 All tests passed! Database is ready.');
    console.log('You can now start the server with: npm start\n');

  } catch (error) {
    console.error('\n❌ Connection failed!\n');
    console.error('Error:', error.message);
    console.error('Code:', error.code);
    console.error('\nCommon solutions:');
    
    if (error.code === 'ER_ACCESS_DENIED_ERROR') {
      console.error('  → Check DB_PASSWORD in .env file');
      console.error('  → Make sure password matches MySQL root password');
    } else if (error.code === 'ECONNREFUSED') {
      console.error('  → MySQL service is not running');
      console.error('  → Start it with: net start MySQL80');
    } else if (error.code === 'ER_BAD_DB_ERROR') {
      console.error('  → Database does not exist');
      console.error('  → Create it with: CREATE DATABASE water_governance;');
    } else if (error.code === 'ENOTFOUND') {
      console.error('  → Check DB_HOST in .env file');
      console.error('  → Should be "localhost" for local MySQL');
    }
    
    console.error('\nFor detailed help, see DATABASE_SETUP.md\n');
  }
}

testConnection();

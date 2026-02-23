import mysql from 'mysql2/promise';
import readline from 'readline';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(query) {
  return new Promise(resolve => rl.question(query, resolve));
}

async function setupDatabase() {
  console.log('🔧 Water Governance Database Setup\n');
  
  const password = await question('Enter your MySQL root password (press Enter if no password): ');
  
  try {
    console.log('\n📡 Connecting to MySQL...');
    const connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: password || undefined
    });
    
    console.log('✅ Connected successfully!\n');
    
    // Create database
    console.log('📦 Creating database...');
    await connection.query('CREATE DATABASE IF NOT EXISTS water_governance');
    console.log('✅ Database created!\n');
    
    // Update .env file
    console.log('📝 Updating .env file...');
    const fs = await import('fs');
    const envPath = './backend/.env';
    let envContent = fs.readFileSync(envPath, 'utf8');
    envContent = envContent.replace(/DB_PASSWORD=.*/, `DB_PASSWORD=${password}`);
    fs.writeFileSync(envPath, envContent);
    console.log('✅ .env file updated!\n');
    
    await connection.end();
    
    console.log('🎉 Setup complete! You can now run:');
    console.log('   cd backend && npm start\n');
    
  } catch (error) {
    console.error('\n❌ Setup failed:', error.message);
    if (error.code === 'ER_ACCESS_DENIED_ERROR') {
      console.error('   → Incorrect password. Please try again.\n');
    }
  }
  
  rl.close();
}

setupDatabase();

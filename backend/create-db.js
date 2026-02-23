import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

async function createDatabase() {
  try {
    console.log('📦 Creating database...\n');
    
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD
    });
    
    await connection.query(`CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME || 'water_governance'}`);
    console.log('✅ Database created successfully!\n');
    
    await connection.end();
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

createDatabase();

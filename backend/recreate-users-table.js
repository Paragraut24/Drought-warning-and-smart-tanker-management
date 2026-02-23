import sequelize from './config/database.js';

async function recreateUsersTable() {
  try {
    console.log('Connecting to database...');
    await sequelize.authenticate();
    console.log('✓ Connected\n');

    console.log('Dropping Users table...');
    await sequelize.query('DROP TABLE IF EXISTS Users');
    console.log('✓ Users table dropped\n');

    console.log('Recreating Users table with correct schema...');
    await sequelize.query(`
      CREATE TABLE Users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(255) NOT NULL UNIQUE,
        email VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        role ENUM('admin', 'local_user') DEFAULT 'local_user',
        village_id INT NULL,
        phone VARCHAR(255) NULL,
        createdAt DATETIME NOT NULL,
        updatedAt DATETIME NOT NULL,
        FOREIGN KEY (village_id) REFERENCES Villages(id)
      )
    `);
    console.log('✓ Users table recreated\n');

    console.log('✅ All done! Now run: node seed-database.js\n');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

recreateUsersTable();

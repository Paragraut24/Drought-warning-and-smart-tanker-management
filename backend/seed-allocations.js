import sequelize from './config/database.js';
import { Village, Tanker, Allocation } from './models/index.js';

async function seedAllocations() {
  try {
    console.log('🚚 Seeding Tanker Allocations...\n');

    // Get all villages and tankers
    const villages = await Village.findAll();
    const tankers = await Tanker.findAll();

    if (villages.length === 0 || tankers.length === 0) {
      console.log('❌ No villages or tankers found. Please run seed-database.js first.\n');
      return;
    }

    // Clear existing allocations
    await Allocation.destroy({ where: {}, force: true });
    console.log('✅ Cleared existing allocations\n');

    const allocations = [];
    const statuses = ['pending', 'in_progress', 'completed'];
    
    // Create allocations for critical villages (first 3)
    const criticalVillages = villages.slice(0, 3);
    criticalVillages.forEach((village, idx) => {
      const tanker = tankers[idx % tankers.length];
      
      // Create 2-3 allocations per critical village with different statuses
      allocations.push({
        village_id: village.id,
        tanker_id: tanker.id,
        allocation_date: new Date(Date.now() - (2 * 24 * 60 * 60 * 1000)), // 2 days ago
        priority_score: 85 + Math.random() * 10,
        status: 'completed',
        estimated_delivery: new Date(Date.now() - (1 * 24 * 60 * 60 * 1000))
      });

      allocations.push({
        village_id: village.id,
        tanker_id: tankers[(idx + 1) % tankers.length].id,
        allocation_date: new Date(Date.now() - (1 * 24 * 60 * 60 * 1000)), // 1 day ago
        priority_score: 80 + Math.random() * 10,
        status: 'in_progress',
        estimated_delivery: new Date(Date.now() + (2 * 60 * 60 * 1000)) // 2 hours from now
      });

      allocations.push({
        village_id: village.id,
        tanker_id: tankers[(idx + 2) % tankers.length].id,
        allocation_date: new Date(),
        priority_score: 75 + Math.random() * 10,
        status: 'pending',
        estimated_delivery: new Date(Date.now() + (6 * 60 * 60 * 1000)) // 6 hours from now
      });
    });

    // Create allocations for alert villages (next 5)
    const alertVillages = villages.slice(3, 8);
    alertVillages.forEach((village, idx) => {
      const tanker = tankers[idx % tankers.length];
      
      allocations.push({
        village_id: village.id,
        tanker_id: tanker.id,
        allocation_date: new Date(Date.now() - (3 * 24 * 60 * 60 * 1000)), // 3 days ago
        priority_score: 60 + Math.random() * 15,
        status: 'completed',
        estimated_delivery: new Date(Date.now() - (2 * 24 * 60 * 60 * 1000))
      });

      if (idx < 3) {
        allocations.push({
          village_id: village.id,
          tanker_id: tankers[(idx + 1) % tankers.length].id,
          allocation_date: new Date(Date.now() - (12 * 60 * 60 * 1000)), // 12 hours ago
          priority_score: 55 + Math.random() * 15,
          status: 'in_progress',
          estimated_delivery: new Date(Date.now() + (4 * 60 * 60 * 1000))
        });
      }
    });

    // Create some older completed allocations
    const normalVillages = villages.slice(8, 12);
    normalVillages.forEach((village, idx) => {
      allocations.push({
        village_id: village.id,
        tanker_id: tankers[idx % tankers.length].id,
        allocation_date: new Date(Date.now() - (7 * 24 * 60 * 60 * 1000)), // 7 days ago
        priority_score: 40 + Math.random() * 20,
        status: 'completed',
        estimated_delivery: new Date(Date.now() - (6 * 24 * 60 * 60 * 1000))
      });
    });

    // Bulk create allocations
    await Allocation.bulkCreate(allocations);

    console.log(`✅ Created ${allocations.length} tanker allocations\n`);

    // Show summary
    const summary = {
      total: allocations.length,
      pending: allocations.filter(a => a.status === 'pending').length,
      inProgress: allocations.filter(a => a.status === 'in_progress').length,
      completed: allocations.filter(a => a.status === 'completed').length
    };

    console.log('📊 Allocation Summary:');
    console.log(`   Total: ${summary.total}`);
    console.log(`   Pending: ${summary.pending}`);
    console.log(`   In Progress: ${summary.inProgress}`);
    console.log(`   Completed: ${summary.completed}\n`);

    console.log('🎉 Tanker allocations seeded successfully!\n');

  } catch (error) {
    console.error('❌ Seeding failed:', error);
  } finally {
    await sequelize.close();
  }
}

seedAllocations();

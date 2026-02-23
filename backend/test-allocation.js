import { AllocationService } from './services/allocationService.js';
import sequelize from './config/database.js';

async function testAllocation() {
  try {
    console.log('🧪 Testing Allocation Service...\n');

    // Test database connection
    await sequelize.authenticate();
    console.log('✅ Database connected\n');

    // Test allocation
    console.log('🚛 Running allocation...');
    const result = await AllocationService.allocateTankers();
    
    console.log('\n📊 Allocation Result:');
    console.log('Success:', result.success);
    console.log('Message:', result.message);
    console.log('Allocations:', result.allocations.length);
    
    if (result.allocations.length > 0) {
      console.log('\n📋 Allocation Details:');
      result.allocations.forEach((alloc, idx) => {
        console.log(`  ${idx + 1}. Tanker ${alloc.tankerRegistration} → Village ID ${alloc.villageId} (Priority: ${alloc.priorityScore})`);
      });
    }

    // Get all allocations
    console.log('\n📜 Fetching all allocations...');
    const allAllocations = await AllocationService.getAllocations();
    console.log(`Found ${allAllocations.length} total allocations\n`);

    console.log('✅ Test completed successfully!');
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.error('Stack:', error.stack);
  } finally {
    await sequelize.close();
  }
}

testAllocation();

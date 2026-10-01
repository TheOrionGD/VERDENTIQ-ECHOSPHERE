/**
 * VerdantIQ Ecosphere - Root Seed Script Runner
 * 
 * Run from root with:
 *   node seed_all_roles.js
 * 
 * Or from VerdantIQCLIENT:
 *   npm run seed
 */

const path = require('path');

// Require the seeder module
try {
  const { seedAll } = require('./VerdantIQCLIENT/scripts/seed_database.js');
  const args = process.argv.slice(2);
  const reset = !args.includes('--no-reset');
  
  seedAll({ reset })
    .then(() => {
      console.log('✨ Seeding process finished successfully.');
      process.exit(0);
    })
    .catch((err) => {
      console.error('Seeding process encountered an error:', err);
      process.exit(1);
    });
} catch (e) {
  console.error('Failed to load seed module:', e.message);
  process.exit(1);
}

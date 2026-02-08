
// @ts-nocheck
const { AttackScheduler } = require('../schedulers/impl/AttackScheduler');
require('dotenv').config();

async function main() {
    console.log('--- Testing AttackScheduler Logic (Manual Run) ---');
    const scheduler = new AttackScheduler();

    console.log(`Scheduler Name: ${scheduler.name}`);
    console.log(`Interval: ${scheduler.intervalMs / 1000} seconds`);

    // Manually trigger run
    await scheduler.run();

    console.log('--- Test Complete ---');
}

main();

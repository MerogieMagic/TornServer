import dotenv from 'dotenv';
import { SchedulerRunner } from './schedulers/SchedulerRunner';
import { HelloWorldScheduler } from './schedulers/impl/HelloWorldScheduler';
import { GenericTornScheduler } from './schedulers/impl/GenericTornScheduler';
import { AttackScheduler } from './schedulers/impl/AttackScheduler';

dotenv.config();

console.log('Torn Server Starting...');

async function main() {
    console.log('Environment loaded.');

    const runner = new SchedulerRunner();

    // -- System Schedulers --
    runner.register(new HelloWorldScheduler());
    // runner.register(new NetworkHealthScheduler());

    // -- Faction Data Collection Schedulers --
    runner.register(new AttackScheduler()); // Replaces GenericTornScheduler("Faction_Attacks"...)
    // runner.register(new GenericTornScheduler("Faction_Attacks", "attacks", "", 30)); 
    runner.register(new GenericTornScheduler("Faction_Members", "members", "", 60));
    runner.register(new GenericTornScheduler("Faction_Crimes", "crimes", "", 60));
    runner.register(new GenericTornScheduler("Faction_Applications", "applications", "", 300));

    // Medium Priority (Territory / Wars)
    runner.register(new GenericTornScheduler("Faction_Territory", "territory", "", 300));
    runner.register(new GenericTornScheduler("Faction_RankedWars", "rankedwars", "", 300));
    runner.register(new GenericTornScheduler("Faction_TerritoryWars", "territorywars", "", 300));

    // Inventory
    const inventoryCategories = ['armor', 'weapons', 'temporary', 'medical', 'drugs', 'boosters'];
    inventoryCategories.forEach(cat => {
        runner.register(new GenericTornScheduler(`Faction_Inv_${cat}`, cat, "", 600));
    });

    // Start Schedulers
    runner.startAll();
}

main().catch((err) => {
    console.error('Fatal Error:', err);
});

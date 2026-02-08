import { IScheduler } from './IScheduler';

export class SchedulerRunner {
    private schedulers: IScheduler[] = [];

    constructor() { }

    public register(scheduler: IScheduler) {
        if (scheduler.enabled) {
            this.schedulers.push(scheduler);
            console.log(`[Scheduler] Registered: ${scheduler.name} (Interval: ${scheduler.intervalMs}ms)`);
        }
    }

    public startAll() {
        console.log('[Scheduler] Starting all schedulers...');
        this.schedulers.forEach(scheduler => {
            this.runSchedulerLoop(scheduler);
        });
    }

    private async runSchedulerLoop(scheduler: IScheduler) {
        // Initial run
        await this.safeRun(scheduler);

        // Periodic run
        setInterval(async () => {
            await this.safeRun(scheduler);
        }, scheduler.intervalMs);
    }

    private async safeRun(scheduler: IScheduler) {
        try {
            await scheduler.run();
        } catch (error) {
            console.error(`[Scheduler] Error in ${scheduler.name}:`, error);
        }
    }
}

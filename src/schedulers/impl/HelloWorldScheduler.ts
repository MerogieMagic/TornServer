import { IScheduler } from '../IScheduler';
import { prisma } from '../../db';

export class HelloWorldScheduler implements IScheduler {
    name = "HelloWorld";
    intervalMs = 5000; // Run every 5 seconds
    enabled = true;
    private counter = 0;

    async run(): Promise<void> {
        const start = Date.now();
        this.counter++;

        const now = new Date();
        const timeString = now.toLocaleTimeString('en-US', { hour12: false });
        const msg = `Hello World, the time now is ${timeString} this is message no. ${this.counter}!`;

        console.log(msg);

        // Log to Database
        try {
            await prisma.schedulerLog.create({
                data: {
                    name: this.name,
                    status: "SUCCESS",
                    message: msg,
                    duration: Date.now() - start
                }
            });
        } catch (error) {
            console.error("Failed to log to DB:", error);
        }
    }
}

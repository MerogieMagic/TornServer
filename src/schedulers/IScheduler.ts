export interface IScheduler {
    name: string;
    intervalMs: number;
    enabled: boolean;
    run(): Promise<void>;
}

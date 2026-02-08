import { IScheduler } from '../IScheduler';
import { prisma } from '../../db';
import crypto from 'crypto';

interface TornApiResponse {
    error?: {
        code: number;
        error: string;
    };
    [key: string]: any;
}

export class GenericTornScheduler implements IScheduler {
    name: string;
    intervalMs: number;
    enabled: boolean = true;

    private endpoint: string;
    private selection: string;
    private params: string;

    constructor(name: string, endpoint: string, selection: string = "", intervalSeconds: number = 60) {
        this.name = name;
        this.endpoint = endpoint;
        this.selection = selection;
        this.intervalMs = intervalSeconds * 1000;
        this.params = selection ? `?selections=${selection}` : "";
    }

    async run(): Promise<void> {
        const apiKey = process.env.TORN_API_KEY;
        if (!apiKey) {
            console.warn(`[${this.name}] Skipped: No API Key found in .env`);
            return;
        }

        // V2 API structure: https://api.torn.com/v2/faction/{endpoint}
        // or V1: https://api.torn.com/faction/?selections={selection}
        // The user mentioned v2 mostly. Let's assume v2 for now, but update_all.py mixed them.
        // Let's assume this scheduler is built for V2 URLs usually.

        const url = `https://api.torn.com/v2/faction/${this.endpoint}${this.params}`;
        const finalUrl = `${url}${this.params ? '&' : '?'}key=${apiKey}`;

        try {
            console.log(`[${this.name}] Fetching ${this.endpoint}...`);
            const response = await fetch(finalUrl);

            if (!response.ok) {
                console.error(`[${this.name}] HTTP Error: ${response.status}`);
                return;
            }

            const data = await response.json() as TornApiResponse;

            // Check for API errors
            if (data.error) {
                console.error(`[${this.name}] API Error ${data.error.code}: ${data.error.error}`);
                return;
            }

            // Calculate Hash
            const jsonString = JSON.stringify(data);
            const hash = crypto.createHash('md5').update(jsonString).digest('hex');

            // Check if alias/endpoint exists with this hash
            const lastEntry = await prisma.factionRawData.findFirst({
                where: { endpoint: this.endpoint },
                orderBy: { createdAt: 'desc' },
                select: { hash: true }
            });

            if (lastEntry && lastEntry.hash === hash) {
                console.log(`[${this.name}] No change detected. Skipping save.`);
                return;
            }

            // Save to DB
            await prisma.factionRawData.create({
                data: {
                    endpoint: this.endpoint,
                    data: data,
                    hash: hash
                }
            });

            console.log(`[${this.name}] Saved new data (Hash: ${hash.substring(0, 8)})`);

        } catch (error) {
            console.error(`[${this.name}] Failed:`, error);
        }
    }
}

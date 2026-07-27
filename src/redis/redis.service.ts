/* eslint-disable @typescript-eslint/no-floating-promises */
import { Injectable, OnModuleInit } from '@nestjs/common';
import { createClient, RedisClientType } from 'redis';

@Injectable()
export class RedisService implements OnModuleInit {
    private client: RedisClientType;

    async onModuleInit() {
        this.client = createClient({
            url: process.env.REDIS_URL,
            socket: {
                connectTimeout: 10_000,
                reconnectStrategy: (retries: number) => {
                    if (retries >= 3) {
                        return new Error('Redis reconnect attempts exceeded');
                    }

                    return Math.min(retries * 500, 3_000);
                },
            },
        }) as RedisClientType;
    
        this.client.on('error', (err: Error) => console.log('Redis Error: ' + err));
        this.client.on('connect', () => console.log('Redis Connected ✔'));
    
        try {
            await this.client.connect();
        } catch (error) {
            console.error('Failed to connect to Redis:', error);
        }
    }

    async get(key: string) {
        const data = await this.client.get(key);
        return data ? JSON.parse(data) as { [key: string]: any } : null;
    }
    
    async set(key: string, value: { [key: string]: any }, ttlSeconds?: number) {
        const stringValue = JSON.stringify(value);
        if (ttlSeconds) {
            await this.client.set(key, stringValue, { EX: ttlSeconds });
        } else {
            await this.client.set(key, stringValue);
        }
    }
    
    async del(key: string) {
        await this.client.del(key);
    }
}

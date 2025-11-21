/* eslint-disable @typescript-eslint/no-floating-promises */
import { Injectable, OnModuleInit } from '@nestjs/common';
import { createClient, RedisClientType } from 'redis';

@Injectable()
export class RedisService implements OnModuleInit {
    private client: RedisClientType;

    onModuleInit() {
        this.client = createClient({
            url: process.env.REDIS_URL,
        }) as RedisClientType;
    
        this.client.on('error', (err) => console.log('Redis Error: ' + err));
        this.client.on('connect', () => console.log('Redis Connected ✔'));
    
        this.client.connect();
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

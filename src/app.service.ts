import { Injectable } from '@nestjs/common';
import { Response } from 'express';

@Injectable()
export class AppService {
  getHello(res: Response) {
    return res.status(200).json({ message: 'Hello World!' });
  }
}

import { Injectable } from '@nestjs/common';
import { createTransport, Transporter } from 'nodemailer';

@Injectable()
export class EmailSenderService {
    private transport:Transporter;

    constructor(){
        this.transport = createTransport({
            host: 'smtp.gmail.com',
            port: 587,
            secure: false,
            auth: {
                user: process.env.EMAIL,
                pass: process.env.PASS,
            },
        }) as Transporter;
    }

    async sendEmail(to: string, subject: string, html: string){
        await this.transport.sendMail({
            from: process.env.EMAIL,
            to,
            subject,
            html,
        });
        return true;
    }
}

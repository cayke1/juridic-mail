import nodemailer from "nodemailer";
import { SentMessageInfo } from "nodemailer";
import { env } from "../utils/env";
import { InternalServerError } from "../errors/CreateCustomError";

export class SendMailService {
  private transporter: nodemailer.Transporter;
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: env.EMAIL_HOST,
      port: 587,
      secure: false,
      auth: {
        user: env.EMAIL_USER,
        pass: env.EMAIL_PASS,
      },
    });
  }
  async execute(recipients: string[], pdfContent: Blob): Promise<void> {
    try {
      const mailOptions = {
        from: env.EMAIL_USER,
        to: recipients.join(", "),
        subject: "Your PDF",
        text: "Here is your PDF",
        attachments: [
          {
            filename: "pdf.pdf",
            content: await this.blobToBuffer(pdfContent),
            contentType: "application/pdf",
          },
        ],
      };

      const info: SentMessageInfo = await this.transporter.sendMail(
        mailOptions
      );
      console.log("Message sent: %s", info.messageId);
    } catch (error) {
      console.error(error);
      throw new InternalServerError("Error sending email");
    }
  }

  private async blobToBuffer(blob: Blob): Promise<Buffer> {
    return Buffer.from(await blob.arrayBuffer());
  }
}

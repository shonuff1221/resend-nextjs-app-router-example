import { Resend } from "resend";
import { NextRequest, NextResponse } from "next/server";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();

    const to = formData.get("to") as string;
    const subject = formData.get("subject") as string;
    const body = formData.get("body") as string;
    const from = (formData.get("from") as string) || "info@ejm.services";

    const attachments: { filename: string; content: string }[] = [];
    const files = formData.getAll("attachments") as File[];

    for (const file of files) {
      if (file.size > 0) {
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        attachments.push({
          filename: file.name,
          content: buffer.toString("base64"),
        });
      }
    }

    const toEmails = to
      .split(",")
      .map((email) => email.trim())
      .filter((email) => email);

    const { data, error } = await resend.emails.send({
      from,
      to: toEmails,
      subject,
      html: body,
      attachments: attachments.length > 0 ? attachments : undefined,
    });

    if (error) {
      return NextResponse.json({ error }, { status: 500 });
    }

    return NextResponse.json({ data });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to send email" },
      { status: 500 },
    );
  }
}

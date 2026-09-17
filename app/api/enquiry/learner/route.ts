import nodemailer from "nodemailer";

import {
  type LearnerEnquiryData,
  validateLearnerEnquiry,
} from "@/lib/enquiry/learner-validation";

export const runtime = "nodejs";

const DEFAULT_ERROR_MESSAGE =
  "We couldn't send your enquiry right now. Please try again or contact us on WhatsApp.";

const HTML_ENTITIES: Record<string, string> = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#039;",
};

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (character) => HTML_ENTITIES[character]);
}

function formatPhone(phone: string) {
  return `+91 ${phone.slice(0, 5)} ${phone.slice(5)}`;
}

function emailShell(content: string, previewText: string) {
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${escapeHtml(previewText)}</title>
  </head>
  <body style="margin:0;padding:0;background:#f3f6fb;color:#17213a;font-family:Arial,Helvetica,sans-serif;">
    <div style="display:none;max-height:0;overflow:hidden;opacity:0;">${escapeHtml(previewText)}</div>
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f3f6fb;padding:28px 12px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:640px;background:#ffffff;border:1px solid #dfe6f2;border-radius:18px;overflow:hidden;box-shadow:0 12px 32px rgba(35,55,90,0.08);">
            <tr>
              <td style="padding:22px 28px;background:linear-gradient(135deg,#245bdb,#1aa9d2);color:#ffffff;font-size:20px;font-weight:700;">
                AI &amp; Coding
              </td>
            </tr>
            <tr>
              <td style="padding:30px 28px;">
                ${content}
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

function detailRow(label: string, value: string) {
  return `<tr>
    <td style="width:180px;padding:11px 12px;border-bottom:1px solid #e7ecf4;color:#5b6680;font-size:14px;vertical-align:top;">${escapeHtml(label)}</td>
    <td style="padding:11px 12px;border-bottom:1px solid #e7ecf4;color:#17213a;font-size:14px;line-height:1.55;vertical-align:top;">${value}</td>
  </tr>`;
}

function buildInternalEmail(data: LearnerEnquiryData) {
  const message = data.message
    ? escapeHtml(data.message).replace(/\n/g, "<br />")
    : '<span style="color:#7b8498;">Not provided</span>';

  const html = emailShell(
    `<p style="margin:0 0 8px;color:#245bdb;font-size:13px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;">Learner Enquiry</p>
    <h1 style="margin:0 0 10px;color:#10182c;font-size:26px;line-height:1.25;">New learner enquiry</h1>
    <p style="margin:0 0 24px;color:#5b6680;font-size:15px;line-height:1.65;">A learner has submitted the website enquiry form.</p>
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border:1px solid #e1e7f0;border-radius:12px;border-collapse:separate;border-spacing:0;overflow:hidden;">
      ${detailRow("Full Name", escapeHtml(data.name))}
      ${detailRow("Phone / WhatsApp", escapeHtml(formatPhone(data.phone)))}
      ${detailRow("Email", escapeHtml(data.email))}
      ${detailRow("Current Stage", escapeHtml(data.stage))}
      ${detailRow("Interested Program", escapeHtml(data.program))}
      ${detailRow("Current Experience", escapeHtml(data.experience))}
      ${detailRow("Primary Goal", escapeHtml(data.primaryGoal))}
      ${detailRow("Message", message)}
    </table>`,
    `New learner enquiry from ${data.name}`,
  );

  const text = [
    "LEARNER ENQUIRY",
    "",
    `Full Name: ${data.name}`,
    `Phone / WhatsApp: ${formatPhone(data.phone)}`,
    `Email: ${data.email}`,
    `Current Stage: ${data.stage}`,
    `Interested Program: ${data.program}`,
    `Current Experience: ${data.experience}`,
    `Primary Goal: ${data.primaryGoal}`,
    `Message: ${data.message || "Not provided"}`,
  ].join("\n");

  return { html, text };
}

function buildConfirmationEmail(data: LearnerEnquiryData) {
  const firstName = data.name.split(" ")[0];
  const safeFirstName = escapeHtml(firstName);
  const safeProgram = escapeHtml(data.program);
  const whatsappMessage = `Hello, I've submitted my learner enquiry through the AI & Coding website regarding ${data.program}. I'd like to continue the conversation here on WhatsApp.`;

  const whatsappUrl = `https://wa.me/919904425105?text=${encodeURIComponent(
    whatsappMessage,
  )}`;

  const html = emailShell(
    `<p style="margin:0 0 8px;color:#245bdb;font-size:13px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;">Learner Enquiry</p>
    <h1 style="margin:0 0 16px;color:#10182c;font-size:27px;line-height:1.25;">Thanks, ${safeFirstName}.</h1>
    <p style="margin:0 0 14px;color:#46516a;font-size:15px;line-height:1.7;">We&rsquo;ve received your enquiry about <strong style="color:#17213a;">${safeProgram}</strong>.</p>
    <p style="margin:0 0 24px;color:#46516a;font-size:15px;line-height:1.7;">Our team will review your learning goals and follow up with guidance on the most relevant next step.</p>
    <div style="padding:18px 20px;border:1px solid #dce6f7;border-radius:12px;background:#f7faff;">
      <p style="margin:0 0 7px;color:#17213a;font-size:15px;font-weight:700;">AI &amp; Coding</p>
      <p style="margin:0;color:#5b6680;font-size:14px;line-height:1.7;">Phone / WhatsApp: <a href="tel:+919904425105" style="color:#245bdb;text-decoration:none;">+91 99044 25105</a><br />
      WhatsApp: <a href="${whatsappUrl}" style="color:#245bdb;text-decoration:none;">Chat with us</a></p>
    </div>`,
    "We received your learner enquiry",
  );

  const text = [
    `Thanks, ${firstName}.`,
    "",
    `We've received your enquiry about ${data.program}.`,
    "Our team will review your learning goals and follow up with guidance on the most relevant next step.",
    "",
    "AI & Coding",
    "Phone / WhatsApp: +91 99044 25105",
    `WhatsApp: ${whatsappUrl}`,
  ].join("\n");

  return { html, text };
}

function getHoneypotValue(input: unknown) {
  if (typeof input !== "object" || input === null) return "";
  const website = (input as Record<string, unknown>).website;
  return typeof website === "string" ? website.trim() : "";
}

export async function POST(request: Request) {
  const contentLength = Number(request.headers.get("content-length") ?? "0");

  if (Number.isFinite(contentLength) && contentLength > 20_000) {
    return Response.json(
      { message: "Request body is too large." },
      { status: 413 },
    );
  }

  let input: unknown;

  try {
    input = await request.json();
  } catch {
    return Response.json({ message: "Invalid request body." }, { status: 400 });
  }

  // Silently accept bot submissions so the honeypot does not reveal itself.
  if (getHoneypotValue(input)) {
    return Response.json({ ok: true });
  }

  const validation = validateLearnerEnquiry(input);

  if (!validation.success) {
    return Response.json(
      {
        message: "Please review the highlighted fields.",
        errors: validation.errors,
      },
      { status: 400 },
    );
  }

  const gmailUser = process.env.GMAIL_USER?.trim();
  const gmailAppPassword = process.env.GMAIL_APP_PASSWORD?.trim();
  const enquiryToEmail = process.env.ENQUIRY_TO_EMAIL?.trim();

  if (!gmailUser || !gmailAppPassword || !enquiryToEmail) {
    return Response.json({ message: DEFAULT_ERROR_MESSAGE }, { status: 503 });
  }

  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: gmailUser,
      pass: gmailAppPassword,
    },
    connectionTimeout: 10_000,
    greetingTimeout: 10_000,
    socketTimeout: 20_000,
  });

  const internalEmail = buildInternalEmail(validation.data);
  const confirmationEmail = buildConfirmationEmail(validation.data);
  const sender = `"AI & Coding" <${gmailUser}>`;

  try {
    await Promise.all([
      transporter.sendMail({
        from: sender,
        to: enquiryToEmail,
        replyTo: validation.data.email,
        subject: `New Learner Enquiry — ${validation.data.name}`,
        ...internalEmail,
      }),
      transporter.sendMail({
        from: sender,
        to: validation.data.email,
        replyTo: gmailUser,
        subject: "We Received Your Enquiry | AI & Coding",
        ...confirmationEmail,
      }),
    ]);

    return Response.json({ ok: true });
  } catch {
    return Response.json({ message: DEFAULT_ERROR_MESSAGE }, { status: 502 });
  }
}

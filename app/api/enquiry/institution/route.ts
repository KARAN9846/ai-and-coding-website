import nodemailer from "nodemailer";

import {
  type InstitutionEnquiryData,
  validateInstitutionEnquiry,
} from "@/lib/enquiry/institution-validation";

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
  <body style="margin:0;padding:0;background:#f4f3fb;color:#211b38;font-family:Arial,Helvetica,sans-serif;">
    <div style="display:none;max-height:0;overflow:hidden;opacity:0;">${escapeHtml(previewText)}</div>
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f4f3fb;padding:28px 12px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:660px;background:#ffffff;border:1px solid #e4def2;border-radius:18px;overflow:hidden;box-shadow:0 12px 32px rgba(55,40,95,0.09);">
            <tr>
              <td style="padding:22px 28px;background:linear-gradient(135deg,#7048dd,#8d55e9 58%,#ea8c43);color:#ffffff;font-size:20px;font-weight:700;">
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
    <td style="width:205px;padding:11px 12px;border-bottom:1px solid #ece8f3;color:#655d79;font-size:14px;vertical-align:top;">${escapeHtml(label)}</td>
    <td style="padding:11px 12px;border-bottom:1px solid #ece8f3;color:#211b38;font-size:14px;line-height:1.55;vertical-align:top;">${value}</td>
  </tr>`;
}

function formatInterestsHtml(interests: readonly string[]) {
  return `<ul style="margin:0;padding-left:18px;">${interests
    .map(
      (interest) => `<li style="margin:0 0 5px;">${escapeHtml(interest)}</li>`,
    )
    .join("")}</ul>`;
}

function buildInternalEmail(data: InstitutionEnquiryData) {
  const message = data.message
    ? escapeHtml(data.message).replace(/\n/g, "<br />")
    : '<span style="color:#81788f;">Not provided</span>';
  const interests = formatInterestsHtml(data.interests);

  const html = emailShell(
    `<p style="margin:0 0 8px;color:#7648dc;font-size:13px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;">Institution Enquiry</p>
    <h1 style="margin:0 0 10px;color:#211b38;font-size:26px;line-height:1.25;">New institution enquiry</h1>
    <p style="margin:0 0 24px;color:#655d79;font-size:15px;line-height:1.65;">An education partner has submitted the website institution enquiry form.</p>
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border:1px solid #e8e2f1;border-radius:12px;border-collapse:separate;border-spacing:0;overflow:hidden;">
      ${detailRow("Institution Name", escapeHtml(data.institutionName))}
      ${detailRow("Institution Type", escapeHtml(data.institutionType))}
      ${detailRow("Contact Person", escapeHtml(data.contactName))}
      ${detailRow("Designation / Role", escapeHtml(data.designation))}
      ${detailRow("Phone / WhatsApp", escapeHtml(formatPhone(data.phone)))}
      ${detailRow("Official Email", escapeHtml(data.email))}
      ${detailRow("City / Location", escapeHtml(data.city))}
      ${detailRow("Student Group / Level", escapeHtml(data.studentGroup))}
      ${detailRow("Approximate Number of Students", escapeHtml(data.studentCount))}
      ${detailRow("Preferred Date / Timeframe", escapeHtml(data.timeframe))}
      ${detailRow("Selected Interests", interests)}
      ${detailRow("Additional Context", message)}
    </table>`,
    `New institution enquiry from ${data.institutionName}`,
  );

  const text = [
    "INSTITUTION ENQUIRY",
    "",
    `Institution Name: ${data.institutionName}`,
    `Institution Type: ${data.institutionType}`,
    `Contact Person: ${data.contactName}`,
    `Designation / Role: ${data.designation}`,
    `Phone / WhatsApp: ${formatPhone(data.phone)}`,
    `Official Email: ${data.email}`,
    `City / Location: ${data.city}`,
    `Student Group / Level: ${data.studentGroup}`,
    `Approximate Number of Students: ${data.studentCount}`,
    `Preferred Date / Timeframe: ${data.timeframe}`,
    "Selected Interests:",
    ...data.interests.map((interest) => `- ${interest}`),
    `Additional Context: ${data.message || "Not provided"}`,
  ].join("\n");

  return { html, text };
}

function buildConfirmationEmail(data: InstitutionEnquiryData) {
  const safeContactName = escapeHtml(data.contactName);
  const safeInstitutionName = escapeHtml(data.institutionName);
  const safeStudentGroup = escapeHtml(data.studentGroup);
  const safeTimeframe = escapeHtml(data.timeframe);
  const interests = formatInterestsHtml(data.interests);

  const whatsappMessage = `Hello, I've submitted an institution enquiry through the AI & Coding website on behalf of ${data.institutionName}. I'd like to continue the conversation here on WhatsApp.`;

  const whatsappUrl = `https://wa.me/919904425105?text=${encodeURIComponent(
    whatsappMessage,
  )}`;

  const html = emailShell(
    `<p style="margin:0 0 8px;color:#7648dc;font-size:13px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;">Institution Enquiry</p>
    <h1 style="margin:0 0 16px;color:#211b38;font-size:27px;line-height:1.25;">Hello ${safeContactName},</h1>
    <p style="margin:0 0 14px;color:#554d68;font-size:15px;line-height:1.7;">Thank you for reaching out to AI &amp; Coding on behalf of <strong style="color:#211b38;">${safeInstitutionName}</strong>.</p>
    <p style="margin:0 0 22px;color:#554d68;font-size:15px;line-height:1.7;">We&rsquo;ve received your institution enquiry and will review the details you&rsquo;ve shared about your students and the type of learning experience you&rsquo;re considering. Our team will connect with you to discuss the most suitable way forward.</p>
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin:0 0 22px;border:1px solid #e8e2f1;border-radius:12px;border-collapse:separate;border-spacing:0;overflow:hidden;">
      ${detailRow("Institution", safeInstitutionName)}
      ${detailRow("Student Group", safeStudentGroup)}
      ${detailRow("Preferred Timeframe", safeTimeframe)}
      ${detailRow("Interests", interests)}
    </table>
    <div style="padding:18px 20px;border:1px solid #e2daf2;border-radius:12px;background:#faf8ff;">
      <p style="margin:0 0 7px;color:#211b38;font-size:15px;font-weight:700;">AI &amp; Coding</p>
      <p style="margin:0;color:#655d79;font-size:14px;line-height:1.7;">Phone / WhatsApp: <a href="tel:+919904425105" style="color:#7048dd;text-decoration:none;">+91 99044 25105</a><br />
      WhatsApp: <a href="${whatsappUrl}" style="color:#7048dd;text-decoration:none;">Chat with us</a></p>
    </div>`,
    "We received your institution enquiry",
  );

  const text = [
    `Hello ${data.contactName},`,
    "",
    `Thank you for reaching out to AI & Coding on behalf of ${data.institutionName}.`,
    "",
    "We've received your institution enquiry and will review the details you've shared about your students and the type of learning experience you're considering.",
    "Our team will connect with you to discuss the most suitable way forward.",
    "",
    `Institution: ${data.institutionName}`,
    `Student Group: ${data.studentGroup}`,
    `Preferred Timeframe: ${data.timeframe}`,
    "Interests:",
    ...data.interests.map((interest) => `- ${interest}`),
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

  if (Number.isFinite(contentLength) && contentLength > 25_000) {
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

  const validation = validateInstitutionEnquiry(input);

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
        subject: `New Institution Enquiry — ${validation.data.institutionName}`,
        ...internalEmail,
      }),
      transporter.sendMail({
        from: sender,
        to: validation.data.email,
        replyTo: gmailUser,
        subject: "We Received Your Institution Enquiry | AI & Coding",
        ...confirmationEmail,
      }),
    ]);

    return Response.json({ ok: true });
  } catch {
    return Response.json({ message: DEFAULT_ERROR_MESSAGE }, { status: 502 });
  }
}

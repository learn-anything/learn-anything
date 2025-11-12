import type { Account } from "blade/types"

import { getAppBaseUrl, getResendApiKey, getResendFromEmail } from "../env.ts"

type EmailType =
  | "ACCOUNT_CREATION"
  | "PASSWORD_RESET"
  | "EMAIL_VERIFICATION_RESEND"
  | "LOGIN_OTP"

type EmailPayload = {
  text: string
  html: string
  previewUrl?: string
}

const SUBJECT_MAP: Record<EmailType, string> = {
  ACCOUNT_CREATION: "Verify your gen.new account",
  EMAIL_VERIFICATION_RESEND: "Your new gen.new code",
  PASSWORD_RESET: "Sign back in to gen.new",
  LOGIN_OTP: "Your gen.new login code",
}

const normalizeEmail = (value: unknown): string | null => {
  if (typeof value !== "string") return null
  const trimmed = value.trim().toLowerCase()
  if (!trimmed) return null
  const atIndex = trimmed.indexOf("@")
  if (atIndex <= 0 || atIndex === trimmed.length - 1) {
    return null
  }
  return trimmed
}

const getResolvedAppUrl = () => {
  const configured = getAppBaseUrl()
  if (configured) {
    return configured.replace(/\/$/, "")
  }

  const env =
    typeof process !== "undefined" && process?.env
      ? process.env.NODE_ENV
      : undefined
  const isProduction = env === "production"
  return isProduction ? "https://linsa.io" : "http://localhost:4002"
}

const formatEmailBody = (type: EmailType, token: string): EmailPayload => {
  const appUrl = getResolvedAppUrl()

  if (type === "LOGIN_OTP") {
    return {
      text: `Your gen.new login code is ${token}. It expires in 5 minutes. Enter it on ${appUrl} to continue.`,
      html: `
        <p style="font-size:16px;">Use the code below to continue signing in to <strong>gen.new</strong>.</p>
        <p style="font-size:32px;font-weight:700;letter-spacing:6px;">${token}</p>
        <p style="color:#4b5563;font-size:14px;">This code expires in 5 minutes. If you did not request it, you can ignore this email.</p>
      `,
      previewUrl: undefined,
    }
  }

  const confirmationUrl = `${appUrl}/signup?token=${encodeURIComponent(token)}`
  const isLoginLink = type === "PASSWORD_RESET"

  return {
    text: isLoginLink
      ? `Use this link to sign back in: ${confirmationUrl}`
      : `Confirm your registration by visiting this link: ${confirmationUrl}`,
    html: `
      <div style="font-family:Inter,system-ui,-apple-system,BlinkMacSystemFont,sans-serif;padding:8px 0;">
        <p style="font-size:16px;margin-bottom:16px;">${
          isLoginLink
            ? "Tap the button below to jump back into gen.new."
            : "Tap the button below to confirm your gen.new account."
        }</p>
        <a href="${confirmationUrl}"
           style="display:inline-flex;align-items:center;justify-content:center;background:#0f172a;color:#f8fafc;text-decoration:none;font-size:16px;font-weight:600;padding:12px 24px;border-radius:9999px;margin-bottom:16px;">
          ${isLoginLink ? "Open gen.new" : "Confirm Registration"}
        </a>
        <p style="color:#4b5563;font-size:14px;margin:0;">Button not working? Copy and paste this link into your browser:<br /><a href="${confirmationUrl}" style="color:#0ea5e9;text-decoration:none;">${confirmationUrl}</a></p>
      </div>
    `,
    previewUrl: confirmationUrl,
  }
}

const sendViaResend = async (
  email: string,
  subject: string,
  body: EmailPayload
) => {
  const apiKey = getResendApiKey()
  if (!apiKey) {
    const preview = body.previewUrl ?? body.text
    console.info(`[auth-dev] ${subject} link for ${email}: ${preview}`)
    return
  }

  const payload = {
    from: getResendFromEmail(),
    to: [email],
    subject,
    ...body,
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    const errorBody = await response.text()
    throw new Error(
      `Failed to send verification email (${response.status}): ${errorBody}`
    )
  }
}

interface SendEmailArgs {
  account: Account
  token: string
  type: EmailType
}

export const sendAuthEmail = async ({
  account,
  token,
  type,
}: SendEmailArgs) => {
  const email = normalizeEmail(account.email)
  if (!email || !token) {
    return
  }

  const subject = SUBJECT_MAP[type] ?? SUBJECT_MAP.ACCOUNT_CREATION
  await sendViaResend(email, subject, formatEmailBody(type, token))
}

import process from "node:process"
import crypto from "node:crypto"
import { createClient } from "edgedb"

const client = createClient()

type AuthConfig = {
	token_time_to_live: string
	providers: {
		name: string
		url: string | null
		secret: string | null
		client_id: string | null
	}[]
	ui: {
		redirect_to: string
		redirect_to_on_signup: string
		app_name: string
		logo_url: string
		dark_logo_url: string
		brand_color: string
	} | null
}

async function main() {
	const inquirer = (await import("inquirer")).default
	const existingConfig = await client.queryRequiredSingle<AuthConfig>(`
SELECT cfg::Config.extensions[is ext::auth::AuthConfig] {
  *,
  providers: {
    name,
    [is ext::auth::OAuthProviderConfig].*,
  },
  ui: { * },
} limit 1
  `)

	if (existingConfig.providers.length > 0) {
		console.warn(
			`Auth is already configured with the following values:
${JSON.stringify(existingConfig, null, 2)}`,
		)
	}

	const questions = [
		{
			type: "input",
			name: "appName",
			message: "Enter the app name:",
		},
		{
			type: "input",
			name: "authSigningKey",
			message: "Enter the signing key:",
			default: crypto.randomBytes(32).toString("hex"),
			validate: (val: string) =>
				val.length >= 32 || "The key must be at least 32 bytes long",
		},
		{
			type: "input",
			name: "tokenTTL",
			message: "Enter the token time to live:",
			default: existingConfig.token_time_to_live.toString() ?? "336 hours",
		},
		{
			type: "checkbox",
			name: "providers",
			message: "Would you like to enable any of the following OAuth providers?",
			choices: ["github", "google", "azure", "apple", "discord", "slack"],
			default:
				existingConfig.providers.map(
					(provider) => provider.name.split("::")[1] ?? null,
				) ?? [],
		},
		{
			type: "confirm",
			name: "enableHostedUI",
			message: "Would you like to enable the hosted Auth UI?",
		},
		{
			type: "confirm",
			name: "enablePasswordAuth",
			message: "Would you like to enable local password authentication?",
		},
		{
			type: "confirm",
			name: "enableMagicLink",
			message: "Would you like to enable magic link email authentication?",
		},
		{
			type: "confirm",
			name: "enableWebAuthn",
			message: "Would you like to enable WebAuthn authentication?",
		},
		{
			type: "confirm",
			name: "enableSmtp",
			message: "Would you like to enable SMTP?",
		},
	]

	const answers = await inquirer.prompt(questions)

	const providersDetails: [string, any][] = []
	for (const provider of answers.providers) {
		const existingProvider = existingConfig.providers.find(
			(p) => p.name === provider,
		)
		const providerDetails = await inquirer.prompt([
			{
				type: "input",
				name: "clientId",
				message: `Enter the ${provider} client ID:`,
				default: existingProvider?.client_id,
			},
			{
				type: "input",
				name: "secret",
				message: `Enter the ${provider} secret:`,
				default: existingProvider?.secret,
			},
		])
		providersDetails.push([provider, providerDetails])
	}

	let query = `
    CONFIGURE CURRENT DATABASE
    RESET ext::auth::ProviderConfig;

    CONFIGURE CURRENT DATABASE
    RESET ext::auth::AuthConfig;

    CONFIGURE CURRENT DATABASE
    RESET ext::auth::UIConfig;

    CONFIGURE CURRENT DATABASE
    RESET ext::auth::SMTPConfig;

    CONFIGURE CURRENT DATABASE SET
    ext::auth::AuthConfig::auth_signing_key := '${answers.authSigningKey}';
  `

	if (answers.tokenTTL) {
		query += `
      CONFIGURE CURRENT DATABASE SET
      ext::auth::AuthConfig::token_time_to_live := <duration>'${answers.tokenTTL}';
    `
	}

	const PROVIDER_MAP: Record<string, string> = {
		github: "GitHubOAuthProvider",
		google: "GoogleOAuthProvider",
		apple: "AppleOAuthProvider",
		azure: "AzureOAuthProvider",
		discord: "DiscordOAuthProvider",
		slack: "SlackOAuthProvider",
	}

	for (const [provider, providerDetails] of providersDetails) {
		const providerType = PROVIDER_MAP[provider]
		query += `
      CONFIGURE CURRENT DATABASE
      INSERT ext::auth::${providerType} {
        secret := '${providerDetails.secret}',
        client_id := '${providerDetails.clientId}'
      };
    `
	}

	if (answers.enablePasswordAuth) {
		const passwordAuthConfig = await inquirer.prompt([
			{
				type: "confirm",
				name: "requireVerification",
				message: "Should email/password require email verification?",
			},
		])
		query += `
      CONFIGURE CURRENT DATABASE
      INSERT ext::auth::EmailPasswordProviderConfig {
        require_verification := <bool>${passwordAuthConfig.requireVerification}
      };
    `
	}

	if (answers.enableMagicLink) {
		const magicLinkAuthConfig = await inquirer.prompt([
			{
				type: "input",
				name: "tokenTTL",
				message:
					"How long should the email sign-in link be valid for? (ISO Duration format)?",
				default: "PT10M",
			},
		])
		query += `
      CONFIGURE CURRENT DATABASE
      INSERT ext::auth::MagicLinkProviderConfig {
        token_time_to_live := <duration>'${magicLinkAuthConfig.tokenTTL}',
      };
    `
	}

	if (answers.enableWebAuthn) {
		const webAuthnConfig = await inquirer.prompt([
			{
				type: "confirm",
				name: "requireVerification",
				message: "Should WebAuthn require email verification?",
			},
			{
				type: "input",
				name: "relyingPartyOrigin",
				message: "Enter the relying party origin:",
				default: "http://localhost:3001",
			},
		])
		query += `
      CONFIGURE CURRENT DATABASE
      INSERT ext::auth::WebAuthnProviderConfig {
        relying_party_origin := '${webAuthnConfig.relyingPartyOrigin}',
        require_verification := <bool>${webAuthnConfig.requireVerification}
      };
    `
	}

	if (answers.enableHostedUI) {
		const hostedUi = await inquirer.prompt([
			{
				type: "input",
				name: "redirectTo",
				message: "Enter the redirect URL:",
				default:
					existingConfig.ui?.redirect_to ??
					"http://localhost:3001/auth/builtin/callback",
				required: true,
			},
			{
				type: "input",
				name: "redirectToOnSignup",
				message: "Enter the redirect URL on signup:",
				default:
					existingConfig.ui?.redirect_to_on_signup ??
					"http://localhost:3001/auth/builtin/callback?isSignUp=true",
				required: false,
			},
			{
				type: "input",
				name: "brandColor",
				message: "Enter the brand color:",
				default: existingConfig.ui?.brand_color ?? "#000000",
				required: false,
			},
			{
				type: "input",
				name: "logo_url",
				message: "Enter the brand logo",
				default:
					existingConfig.ui?.logo_url ??
					"https://avatars.githubusercontent.com/u/14262913",
			},
		])

		query += `
      CONFIGURE CURRENT DATABASE
      INSERT ext::auth::UIConfig {
        redirect_to := '${hostedUi.redirectTo}',
        redirect_to_on_signup := '${hostedUi.redirectToOnSignup ?? hostedUi.redirectTo}',
        app_name := '${answers.appName}',
        brand_color := '${hostedUi.brandColor}',
        logo_url := '${hostedUi.logo_url}',
      };
    `
	}

	if (answers.enableSmtp) {
		const smtpConfig = await inquirer.prompt([
			{
				type: "input",
				name: "sender",
				message: "Sender email:",
				required: true,
			},
			{
				type: "input",
				name: "host",
				message: "SMTP Host:",
				default: "localhost",
				required: true,
			},
			{
				type: "number",
				name: "port",
				message: "SMTP Port:",
				default: 1025,
				required: true,
			},
			{
				type: "input",
				name: "username",
				message: "SMTP Username:",
			},
			{
				type: "input",
				name: "password",
				message: "SMTP Password:",
			},
			{
				type: "list",
				name: "security",
				message: "SMTP security mode:",
				choices: ["STARTTLSOrPlainText", "STARTTLS", "TLS", "PlainText"],
				default: "TLS",
			},
			{
				type: "confirm",
				name: "validate_certs",
				message: "Should we validate SMTP certificates?",
				default: false,
			},
		])
		query += `
      CONFIGURE CURRENT DATABASE SET
      ext::auth::SMTPConfig::sender := '${smtpConfig.sender}';

      CONFIGURE CURRENT DATABASE SET
      ext::auth::SMTPConfig::host := '${smtpConfig.host}';

      CONFIGURE CURRENT DATABASE SET
      ext::auth::SMTPConfig::port := <int32>${smtpConfig.port};

      CONFIGURE CURRENT DATABASE SET
      ext::auth::SMTPConfig::username := '${smtpConfig.username}';

      CONFIGURE CURRENT DATABASE SET
      ext::auth::SMTPConfig::password := '${smtpConfig.password}';

      CONFIGURE CURRENT DATABASE SET
      ext::auth::SMTPConfig::security := '${smtpConfig.security}';

      CONFIGURE CURRENT DATABASE SET
      ext::auth::SMTPConfig::validate_certs := <bool>${smtpConfig.validate_certs};
    `
	}

	console.log("The following query will be executed:\n", query)
	const confirm = await inquirer.prompt({
		type: "confirm",
		name: "execute",
		message: "Do you want to execute this query?",
	})

	if (confirm.execute) {
		await client.execute(query)
	} else {
		return
	}
}

main()
	.then(() => process.exit(0))
	.catch((err: Error) => {
		console.error(err)
		process.exit(1)
	})

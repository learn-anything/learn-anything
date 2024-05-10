import type { BuiltinOAuthProviderNames } from "@edgedb/auth-core"
import { WebAuthnClient } from "@edgedb/auth-core/webauthn"

export interface RemixAuthOptions {
	baseUrl: string
	authRoutesPath?: string
	authCookieName?: string
	pkceVerifierCookieName?: string
	passwordResetPath?: string
	magicLinkFailurePath?: string
}

type OptionalOptions = "passwordResetPath" | "magicLinkFailurePath"

export default function createClientAuth(options: RemixAuthOptions) {
	return new RemixClientAuth(options)
}

export class RemixClientAuth {
	protected readonly options: Required<
		Omit<RemixAuthOptions, OptionalOptions>
	> &
		Pick<RemixAuthOptions, OptionalOptions>
	readonly webAuthnClient: WebAuthnClient
	protected readonly isSecure: boolean

	/** @internal */
	constructor(options: RemixAuthOptions) {
		this.options = {
			authCookieName: "edgedb-session",
			pkceVerifierCookieName: "edgedb-pkce-verifier",
			...options,
			baseUrl: options.baseUrl.replace(/\/$/, ""),
			authRoutesPath: options.authRoutesPath?.replace(/^\/|\/$/g, "") ?? "auth",
		}
		this.webAuthnClient = new WebAuthnClient({
			signupOptionsUrl: `${this._authRoute}/webauthn/signup/options`,
			signupUrl: `${this._authRoute}/webauthn/signup`,
			signinOptionsUrl: `${this._authRoute}/webauthn/signin/options`,
			signinUrl: `${this._authRoute}/webauthn/signin`,
			verifyUrl: `${this._authRoute}/webauthn/verify`,
		})
		this.isSecure = this.options.baseUrl.startsWith("https")
	}

	protected get _authRoute() {
		return `${this.options.baseUrl}/${this.options.authRoutesPath}`
	}

	getOAuthUrl(providerName: BuiltinOAuthProviderNames) {
		return `${this._authRoute}/oauth?${new URLSearchParams({
			provider_name: providerName,
		}).toString()}`
	}

	getBuiltinUIUrl() {
		return `${this._authRoute}/builtin/signin`
	}

	getBuiltinUISignUpUrl() {
		return `${this._authRoute}/builtin/signup`
	}

	getSignoutUrl() {
		return `${this._authRoute}/signout`
	}
}

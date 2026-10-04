/**
 * Supabase's auth errors are precise but cryptic ("Invalid login credentials", "Email not
 * confirmed", "over_email_send_rate_limit"). Nothing is more effective at making a login feel
 * broken than showing a visitor a sentence they cannot act on — and several of these are not
 * the visitor's fault at all, they are project settings that have not been turned on yet.
 *
 * So every auth error passes through here on its way to the screen: matched on the stable
 * `code` where Supabase supplies one, on the message text otherwise, and always answered with
 * something the reader can do next.
 *
 * @param {string} message  the raw message from Supabase
 * @param {string} [code]   the machine-readable code, when the SDK provides one
 * @returns {{ message: string, code: string|null }}
 */
export function friendlyAuthError(message = '', code = null) {
  const text = String(message)
  const haystack = `${code ?? ''} ${text}`.toLowerCase()

  const rules = [
    {
      test: /invalid[_ ]login[_ ]credentials|invalid_credentials/,
      answer: 'That email and password do not match an account. Check for typos, or use “Forgot your password?” below.',
    },
    {
      test: /email[_ ]not[_ ]confirmed|email_not_confirmed/,
      answer: 'This account is not confirmed yet. Open the link in the confirmation email — or send a fresh one below.',
      code: 'email_not_confirmed',
    },
    {
      test: /user[_ ]already[_ ]registered|user_already_exists/,
      answer: 'An account already exists for that email. Sign in instead, or reset the password.',
      code: 'user_already_exists',
    },
    {
      test: /password[_ ]should[_ ]be[_ ]at[_ ]least/,
      answer: 'Passwords need at least 6 characters.',
    },
    {
      test: /over[_ ]email[_ ]send[_ ]rate[_ ]limit|rate[_ ]limit|too many requests|for security purposes/,
      answer: 'Too many attempts in a row. Wait about a minute and try again.',
    },
    {
      test: /unable to validate email|invalid format|invalid[_ ]email/,
      answer: 'That does not look like an email address — check it and try again.',
    },
    {
      test: /signups not allowed|signup[_ ]disabled|signups_disabled/,
      answer: 'Email sign-ups are switched off for this project. Enable them in Supabase → Authentication → Providers → Email. (See GUIDE-SIGN-IN.md.)',
    },
    {
      test: /provider is not enabled|unsupported provider|provider_not_enabled|validation_failed/,
      answer: 'That sign-in provider is not enabled on this Supabase project yet. See GUIDE-SIGN-IN.md for the two-minute fix.',
    },
    {
      test: /failed to fetch|networkerror|network request failed|load failed/,
      answer: 'Could not reach the database. Check your connection, and that VITE_SUPABASE_URL points at your project.',
    },
    {
      test: /redirect.*not allowed|redirect_to|invalid redirect/,
      answer: 'That redirect URL is not on the project’s allow list. Add it in Supabase → Authentication → URL Configuration (see GUIDE-SIGN-IN.md).',
    },
    {
      test: /auth session missing|session_not_found|otp_expired|token has expired|invalid claim/,
      answer: 'That link has expired or was already used. Request a new one and try again.',
    },
  ]

  const hit = rules.find((rule) => rule.test.test(haystack))
  if (hit) return { message: hit.answer, code: hit.code ?? null }

  // Unrecognised: say what Supabase said rather than inventing a summary of it.
  return { message: text || 'Something went wrong. Try again in a moment.', code: null }
}

export default friendlyAuthError

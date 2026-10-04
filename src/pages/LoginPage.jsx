import { Navigate, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AuthForm from '../components/AuthForm';

/**
 * The full-page sign-in surface.
 *
 * Same form as the header dialog, with room to breathe: a page is where a visitor lands from a
 * link, so it also answers "what am I signing in for" and carries the site mark.
 *
 * `?next=` brings them back to whatever they were trying to reach — which is how the account
 * page sends someone here and gets them back afterwards.
 */
export default function LoginPage() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [params] = useSearchParams();

  // Only ever redirect to a path inside this app.
  const requested = params.get('next') ?? '';
  const next = requested.startsWith('/') && !requested.startsWith('//') ? requested : '/';

  if (loading) return null;
  if (user) return <Navigate to={next} replace />;

  return (
    <div className="mx-auto w-full max-w-[440px] px-[clamp(18px,4vw,48px)] py-12">
      <div className="flex items-center gap-3">
        <img src="/logo-mark.png" alt="" width="44" height="44" className="h-[44px] w-[44px] object-contain" />
        <div>
          <div className="font-serif text-[1.35rem] font-bold text-indigo dark:text-charcoal">Culture Click</div>
          <div className="text-[0.62rem] font-semibold uppercase tracking-[0.16em] text-saffron">India, storied</div>
        </div>
      </div>

      {next !== '/' && (
        <p className="mt-5 rounded-xl border border-teal/25 bg-teal/5 px-4 py-3 text-[0.84rem] text-teal">
          Sign in and we will take you straight back to the page you were on.
        </p>
      )}

      <p className="mt-5 text-[0.92rem]">
        Sign in to keep your wishlist on every device, write reviews, and mark the places you have
        actually stood in front of. Nothing you have saved in this browser is lost — it merges
        into your account the first time you sign in.
      </p>

      <div className="mt-7 rounded-[20px] border border-black/10 bg-surface p-6 shadow-[0_20px_50px_rgba(31,58,95,0.12)] dark:border-white/10">
        <AuthForm next={next} onDone={() => navigate(next, { replace: true })} />
      </div>
    </div>
  );
}

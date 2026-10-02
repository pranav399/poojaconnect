import { useState, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { Flame, ShieldCheck, CalendarHeart, Sparkles } from 'lucide-react';

interface AuthShellProps {
  title: string;
  subtitle: string;
  children: ReactNode;
  footer: ReactNode;
}

export function AuthShell({ title, subtitle, children, footer }: AuthShellProps) {
  return (
    <div className="flex min-h-screen flex-col lg:flex-row">
      {/* Left: brand panel */}
      <div className="relative hidden flex-1 overflow-hidden bg-gradient-to-br from-saffron-700 via-vermillion-700 to-saffron-950 lg:flex lg:flex-col lg:justify-between lg:p-12">
        <div className="pointer-events-none absolute inset-0 opacity-20">
          <div className="absolute -left-24 top-10 h-72 w-72 rounded-full bg-marigold-400 blur-3xl" />
          <div className="absolute bottom-10 right-0 h-80 w-80 rounded-full bg-saffron-300 blur-3xl" />
        </div>
        <div className="relative flex items-center gap-3 text-white">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10 ring-1 ring-white/20 backdrop-blur">
            <Flame className="h-6 w-6" />
          </div>
          <div>
            <p className="font-display text-lg font-semibold">PoojaConnect</p>
            <p className="text-xs text-saffron-100">Sacred ceremonies, simplified</p>
          </div>
        </div>

        <div className="relative space-y-6 text-white">
          <h1 className="font-display max-w-md text-3xl font-semibold leading-tight">
            Book trusted Pandits. Schedule sacred Poojas. Order authentic Samagri.
          </h1>
          <p className="max-w-md text-sm text-saffron-100">
            A serene platform connecting devotees with verified pandits — from Griha Pravesh to
            Satyanarayan Katha, with real-time booking and doorstep samagri delivery.
          </p>
          <ul className="space-y-3 text-sm">
            {[
              { icon: CalendarHeart, text: 'Real-time booking with verified pandits' },
              { icon: Sparkles, text: 'Authentic pooja samagri delivered to your door' },
              { icon: ShieldCheck, text: 'Secure, role-based access for devotees & pandits' },
            ].map((f, i) => {
              const Icon = f.icon;
              return (
                <li key={i} className="flex items-center gap-3">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10 ring-1 ring-white/20">
                    <Icon className="h-4 w-4" />
                  </span>
                  {f.text}
                </li>
              );
            })}
          </ul>
        </div>

        <p className="relative text-xs text-saffron-200">
          © {new Date().getFullYear()} PoojaConnect. Made with devotion.
        </p>
      </div>

      {/* Right: form panel */}
      <div className="flex flex-1 items-center justify-center bg-gradient-to-br from-saffron-50/60 to-marigold-50/40 px-4 py-10 dark:from-slate-950 dark:to-slate-900">
        <div className="w-full max-w-md">
          <div className="mb-8 flex items-center gap-3 lg:hidden">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-saffron-500 to-vermillion-600 text-white shadow-soft">
              <Flame className="h-5 w-5" />
            </div>
            <p className="font-display text-base font-semibold text-saffron-900 dark:text-white">
              PoojaConnect
            </p>
          </div>
          <h2 className="font-display text-2xl font-semibold text-saffron-900 dark:text-white">
            {title}
          </h2>
          <p className="mt-1 text-sm text-saffron-600 dark:text-saffron-400">{subtitle}</p>
          <div className="mt-8">{children}</div>
          <div className="mt-6 text-center text-sm text-saffron-600 dark:text-saffron-400">
            {footer}
          </div>
        </div>
      </div>
    </div>
  );
}

export function AuthLink({ to, children }: { to: string; children: ReactNode }) {
  return (
    <Link
      to={to}
      className="font-semibold text-saffron-700 hover:text-saffron-800 dark:text-saffron-400 dark:hover:text-saffron-300"
    >
      {children}
    </Link>
  );
}

export function AuthError({ message }: { message: string | null }) {
  const [show] = useState(true);
  if (!message || !show) return null;
  return (
    <div className="mb-4 rounded-lg border border-vermillion-200 bg-vermillion-50 px-3 py-2 text-sm text-vermillion-700 dark:border-vermillion-900/60 dark:bg-vermillion-500/10 dark:text-vermillion-400">
      {message}
    </div>
  );
}

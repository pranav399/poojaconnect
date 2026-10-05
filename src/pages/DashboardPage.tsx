import { useEffect, useState, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import {
  CalendarHeart,
  ShoppingBag,
  Sparkles,
  TrendingUp,
  Clock,
  ArrowRight,
  Flame,
  Star,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { firebaseClient, type Booking, type Service, type Product } from '../lib/firebase';
import { getSharedProducts } from '../lib/productCatalog';
import { formatINR, formatDateTime } from '../lib/utils';
import { PageHeader } from '../components/ui/PageHeader';
import { StatusBadge } from '../components/ui/Badge';
import { SkeletonCard } from '../components/ui/Skeleton';
import { useToast } from '../context/ToastContext';

export function DashboardPage() {
  const { profile } = useAuth();
  const { error: toastError } = useToast();
  const [loading, setLoading] = useState(true);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    if (!profile) return;
    (async () => {
      setLoading(true);
      if (profile.role === 'devotee') {
        const { data: bks } = await firebaseClient
          .from('bookings')
          .select('*, service:services(*)')
          .eq('devotee_id', profile.id)
          .order('scheduled_at', { ascending: false })
          .limit(5);
        setBookings((bks as Booking[]) ?? []);
      } else if (profile.role === 'pandit') {
        const { data: bks } = await firebaseClient
          .from('bookings')
          .select('*, service:services(*), devotee:profiles!bookings_devotee_id_fkey(id, full_name, email, phone, avatar_url)')
          .eq('pandit_id', profile.id)
          .order('scheduled_at', { ascending: false })
          .limit(5);
        setBookings((bks as Booking[]) ?? []);
      } else {
        const { data: bks } = await firebaseClient
          .from('bookings')
          .select('*, service:services(*), devotee:profiles!bookings_devotee_id_fkey(id, full_name, email, phone, avatar_url)')
          .order('created_at', { ascending: false })
          .limit(5);
        setBookings((bks as Booking[]) ?? []);
      }
      const { data: svcs } = await firebaseClient.from('services').select('*').eq('is_active', true).limit(4);
      setServices((svcs as Service[]) ?? []);
      try {
        const prods = await getSharedProducts();
        setProducts(prods.filter((product) => product.is_active).slice(0, 4));
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Could not load featured samagri.';
        toastError('Could not load products', message);
        setProducts([]);
      }
      setLoading(false);
    })();
  }, [profile, toastError]);

  if (!profile) return null;

  return (
    <div>
      <PageHeader
        title={`${greeting()}, ${profile.full_name || 'devotee'} 🙏`}
        description={roleSubtitle(profile.role)}
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statsFor(profile.role, bookings, products).map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="card-warm p-5">
              <div className="flex items-center justify-between">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/70 text-saffron-600 shadow-soft dark:bg-slate-800 dark:text-saffron-400">
                  <Icon className="h-5 w-5" />
                </span>
                <TrendingUp className="h-4 w-4 text-emerald-500" />
              </div>
              <p className="mt-3 text-2xl font-bold text-saffron-900 dark:text-white">{s.value}</p>
              <p className="text-sm text-saffron-600 dark:text-slate-400">{s.label}</p>
            </div>
          );
        })}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-display text-lg font-semibold text-saffron-900 dark:text-white">
              {profile.role === 'pandit' ? 'Recent Requests' : 'Recent Bookings'}
            </h2>
            {(profile.role === 'devotee' || profile.role === 'pandit') && (
              <Link to={profile.role === 'pandit' ? '/app/schedule' : '/app/bookings'} className="flex items-center gap-1 text-sm font-medium text-saffron-600 hover:text-saffron-800 dark:text-saffron-400">
                View all <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            )}
          </div>
          <div className="card overflow-hidden">
            {loading ? (
              <div className="space-y-3 p-4"><SkeletonCard /><SkeletonCard /></div>
            ) : bookings.length === 0 ? (
              <EmptyState
                icon={<CalendarHeart className="h-8 w-8" />}
                title="No bookings yet"
                desc={profile.role === 'devotee' ? 'Book your first pooja to see it here.' : 'You have no booking requests yet.'}
                action={profile.role === 'devotee' ? <Link to="/app/services" className="btn-gold">Book a Pooja</Link> : undefined}
              />
            ) : (
              <div className="divide-y divide-saffron-100 dark:divide-slate-800">
                {bookings.map((b) => (
                  <div key={b.id} className="flex items-center gap-4 p-4">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-saffron-100 text-saffron-600 dark:bg-saffron-500/10 dark:text-saffron-400">
                      <Flame className="h-5 w-5" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-semibold text-saffron-900 dark:text-white">{b.service?.name ?? 'Service'}</p>
                      <p className="flex items-center gap-1 text-xs text-saffron-500 dark:text-slate-400">
                        <Clock className="h-3 w-3" /> {formatDateTime(b.scheduled_at)}
                      </p>
                    </div>
                    <StatusBadge status={b.status} />
                    <span className="hidden text-sm font-semibold text-saffron-700 dark:text-saffron-300 sm:block">
                      {formatINR(b.amount)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-display text-lg font-semibold text-saffron-900 dark:text-white">Popular Poojas</h2>
            {profile.role === 'devotee' && (
              <Link to="/app/services" className="flex items-center gap-1 text-sm font-medium text-saffron-600 hover:text-saffron-800 dark:text-saffron-400">
                All <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            )}
          </div>
          <div className="space-y-3">
            {loading ? (
              <SkeletonCard />
            ) : services.length === 0 ? (
              <div className="card p-6 text-center text-sm text-saffron-500 dark:text-slate-400">
                <Sparkles className="mx-auto mb-2 h-6 w-6 text-saffron-300" />
                <p className="font-semibold text-saffron-900 dark:text-white">No poojas available</p>
                <p className="mt-1 text-xs text-saffron-500">Services catalog is currently being updated.</p>
              </div>
            ) : (
              services.map((s) => (
                <Link
                  key={s.id}
                  to={profile.role === 'devotee' ? `/app/book?service=${s.id}` : '#'}
                  className="card flex items-center gap-3 p-3 transition hover:shadow-pop hover:ring-1 hover:ring-saffron-300"
                >
                  <div className="h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-saffron-100 dark:bg-slate-800">
                    {s.image_url ? (
                      <img src={s.image_url} alt={s.name} className="h-full w-full object-cover" />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-saffron-400"><Sparkles className="h-5 w-5" /></div>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-saffron-900 dark:text-white">{s.name}</p>
                    <p className="text-xs text-saffron-500 dark:text-slate-400">{s.category}</p>
                  </div>
                  <span className="text-sm font-bold text-saffron-700 dark:text-saffron-300">{formatINR(s.price)}</span>
                </Link>
              ))
            )}
          </div>
        </div>
      </div>

      {profile.role === 'devotee' && (
        <div className="mt-8">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-display text-lg font-semibold text-saffron-900 dark:text-white">Featured Samagri</h2>
            <Link to="/app/shop" className="flex items-center gap-1 text-sm font-medium text-saffron-600 hover:text-saffron-800 dark:text-saffron-400">
              Shop all <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {loading ? (
              Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
            ) : products.length === 0 ? (
              <div className="col-span-full card p-8 text-center text-sm text-saffron-500 dark:text-slate-400">
                <ShoppingBag className="mx-auto mb-2 h-7 w-7 text-saffron-300" />
                <p className="font-semibold text-saffron-900 dark:text-white">No samagri items available</p>
                <p className="mt-1 text-xs text-saffron-500">Check back soon for new pooja samagri in our shop.</p>
              </div>
            ) : (
              products.map((p) => (
                <Link key={p.id} to="/app/shop" className="card overflow-hidden transition hover:shadow-pop">
                  <div className="aspect-square overflow-hidden bg-saffron-100 dark:bg-slate-800">
                    {p.image_url && <img src={p.image_url} alt={p.name} className="h-full w-full object-cover" />}
                  </div>
                  <div className="p-3">
                    <p className="truncate text-sm font-semibold text-saffron-900 dark:text-white">{p.name}</p>
                    <div className="mt-1 flex items-center justify-between">
                      <span className="text-sm font-bold text-saffron-700 dark:text-saffron-300">{formatINR(p.price)}</span>
                      {p.stock > 0 ? (
                        <span className="chip bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300">In stock</span>
                      ) : (
                        <span className="chip bg-vermillion-100 text-vermillion-700 dark:bg-vermillion-500/15 dark:text-vermillion-300">Out</span>
                      )}
                    </div>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function greeting(): string {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
}

function roleSubtitle(role: string): string {
  if (role === 'devotee') return 'Your sacred journey at a glance.';
  if (role === 'pandit') return 'Manage your schedule and booking requests.';
  return 'Oversee the platform, users, and transactions.';
}

function statsFor(role: string, bookings: Booking[], products: Product[]) {
  const upcomingCount = bookings.filter((b) => b.status === 'confirmed' || b.status === 'pending').length;
  const completedCount = bookings.filter((b) => b.status === 'completed').length;
  const totalSpent = bookings.reduce((sum, b) => sum + (b.amount || 0), 0);

  if (role === 'pandit') {
    return [
      { label: 'Pending Requests', value: String(bookings.filter((b) => b.status === 'pending').length), icon: CalendarHeart },
      { label: 'Completed Poojas', value: String(completedCount), icon: Sparkles },
      { label: 'Total Earnings', value: formatINR(totalSpent), icon: TrendingUp },
      { label: 'Rating', value: '4.9 ★', icon: Star },
    ];
  }
  if (role === 'admin') {
    return [
      { label: 'Total Bookings', value: String(bookings.length), icon: CalendarHeart },
      { label: 'Active Services', value: '12', icon: Sparkles },
      { label: 'Available Samagri', value: String(products.length), icon: ShoppingBag },
      { label: 'Total Revenue', value: formatINR(totalSpent), icon: TrendingUp },
    ];
  }
  return [
    { label: 'Upcoming', value: String(upcomingCount), icon: CalendarHeart },
    { label: 'Completed', value: String(completedCount), icon: Sparkles },
    { label: 'Total Bookings', value: String(bookings.length), icon: ShoppingBag },
    { label: 'Total Amount', value: formatINR(totalSpent), icon: TrendingUp },
  ];
}

function EmptyState({ icon, title, desc, action }: { icon: ReactNode; title: string; desc: string; action?: ReactNode }) {
  return (
    <div className="flex flex-col items-center gap-3 px-4 py-12 text-center">
      <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-saffron-100 text-saffron-400 dark:bg-slate-800">{icon}</span>
      <p className="font-semibold text-saffron-900 dark:text-white">{title}</p>
      <p className="max-w-sm text-sm text-saffron-500 dark:text-slate-400">{desc}</p>
      {action}
    </div>
  );
}

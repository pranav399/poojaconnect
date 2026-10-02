import { useState, type FormEvent } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Flame,
  ShieldCheck,
  CalendarHeart,
  Users,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Loader2,
  RotateCcw,
  CheckCircle2,
  Clock,
  IndianRupee,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import type { Role } from '../lib/firebase';
import { cn } from '../lib/utils';

interface PresetData {
  fullName: string;
  email: string;
  phone: string;
  city: string;
  specialties?: string[];
  languages?: string;
  experienceYears?: number;
  basePrice?: number;
  bio?: string;
  gotra?: string;
  preferredDeity?: string;
  department?: string;
}

const ROLE_PRESETS: Record<Role, PresetData> = {
  devotee: {
    fullName: 'Aarav Sharma',
    email: 'devotee@example.com',
    phone: '+91 98765 43210',
    city: 'New Delhi, Delhi',
    gotra: 'Kashyap',
    preferredDeity: 'Lord Shiva & Lord Ganesha',
  },
  pandit: {
    fullName: 'Pandit Rajesh Shastri',
    email: 'pandit@example.com',
    phone: '+91 98123 45678',
    city: 'Varanasi, Uttar Pradesh',
    specialties: ['Satyanarayan Katha', 'Rudrabhishek', 'Griha Pravesh', 'Navagraha Shanti', 'Maha Mrityunjaya'],
    languages: 'Sanskrit, Hindi, English',
    experienceYears: 12,
    basePrice: 2100,
    bio: 'Acharya in Shukla Yajurveda & Vedic rituals from Sampurnanand Sanskrit Vishwavidyalaya, Varanasi.',
  },
  admin: {
    fullName: 'Siddharth Verma',
    email: 'admin@example.com',
    phone: '+91 99887 76655',
    city: 'Bengaluru, Karnataka',
    department: 'Operations & Pandit Verification',
  },
};

const AVAILABLE_SPECIALTIES = [
  'Satyanarayan Katha',
  'Rudrabhishek',
  'Griha Pravesh',
  'Navagraha Shanti',
  'Maha Mrityunjaya',
  'Vastu Shanti',
  'Ganesh Pooja',
];

export function DemoAccessPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { demoLogin } = useAuth();
  const { success, error: toastError } = useToast();

  const initialRoleParam = searchParams.get('role');
  const initialRole: Role =
    initialRoleParam === 'pandit' || initialRoleParam === 'admin' ? initialRoleParam : 'devotee';

  const [role, setRole] = useState<Role>(initialRole);
  const [fullName, setFullName] = useState(ROLE_PRESETS[initialRole].fullName);
  const [email, setEmail] = useState(ROLE_PRESETS[initialRole].email);
  const [phone, setPhone] = useState(ROLE_PRESETS[initialRole].phone);
  const [city, setCity] = useState(ROLE_PRESETS[initialRole].city);

  const [specialties, setSpecialties] = useState<string[]>(ROLE_PRESETS.pandit.specialties || []);
  const [languages, setLanguages] = useState(ROLE_PRESETS.pandit.languages || '');
  const [experienceYears, setExperienceYears] = useState(ROLE_PRESETS.pandit.experienceYears || 10);
  const [basePrice, setBasePrice] = useState(ROLE_PRESETS.pandit.basePrice || 2100);
  const [bio, setBio] = useState(ROLE_PRESETS.pandit.bio || '');

  const [gotra, setGotra] = useState(ROLE_PRESETS.devotee.gotra || '');
  const [preferredDeity, setPreferredDeity] = useState(ROLE_PRESETS.devotee.preferredDeity || '');
  const [department, setDepartment] = useState(ROLE_PRESETS.admin.department || '');

  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRoleChange = (newRole: Role) => {
    setRole(newRole);
    setError(null);
    const preset = ROLE_PRESETS[newRole];
    setFullName(preset.fullName);
    setEmail(preset.email);
    setPhone(preset.phone);
    setCity(preset.city);
    if (newRole === 'pandit') {
      setSpecialties(preset.specialties || []);
      setLanguages(preset.languages || '');
      setExperienceYears(preset.experienceYears || 10);
      setBasePrice(preset.basePrice || 2100);
      setBio(preset.bio || '');
    } else if (newRole === 'devotee') {
      setGotra(preset.gotra || '');
      setPreferredDeity(preset.preferredDeity || '');
    } else if (newRole === 'admin') {
      setDepartment(preset.department || '');
    }
  };

  const toggleSpecialty = (item: string) => {
    setSpecialties((prev) =>
      prev.includes(item) ? prev.filter((s) => s !== item) : [...prev, item]
    );
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!fullName.trim()) {
      setError('Please enter your full name.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setError('Please enter a valid email address.');
      return;
    }

    setBusy(true);
    const panditDetails =
      role === 'pandit'
        ? {
            bio: bio.trim(),
            specialties: specialties.length > 0 ? specialties : ['General Pooja'],
            languages: languages.split(',').map((l) => l.trim()).filter(Boolean),
            experience_years: Number(experienceYears) || 5,
            base_price: Number(basePrice) || 1100,
            city: city.trim() || 'Varanasi',
          }
        : undefined;

    const res = await demoLogin({
      role,
      fullName: fullName.trim(),
      email: email.trim(),
      phone: phone.trim(),
      city: city.trim(),
      panditDetails,
    });
    setBusy(false);

    if (res.error) {
      setError(res.error);
      toastError('Demo Access Failed', res.error);
      return;
    }

    success('Demo Session Active', `Welcome ${fullName.trim()}!`);
    navigate('/app');
  };

  return (
    <div className="min-h-screen bg-saffron-50/40 px-4 py-8 dark:bg-slate-950 sm:py-12">
      <div className="mx-auto max-w-3xl">
        <div className="mb-6 flex items-center justify-between">
          <Link
            to="/login"
            className="inline-flex items-center gap-2 text-xs font-semibold text-saffron-700 hover:text-saffron-900 dark:text-saffron-400"
          >
            <ArrowLeft className="h-4 w-4" /> Back to Sign In
          </Link>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-saffron-300 bg-white px-3 py-1 text-xs font-semibold text-saffron-800 shadow-sm dark:border-slate-700 dark:bg-slate-800 dark:text-saffron-300">
            <Sparkles className="h-3.5 w-3.5 text-saffron-500" /> Demo Portal
          </span>
        </div>

        <div className="overflow-hidden rounded-2xl border border-saffron-200 bg-white shadow-card dark:border-slate-800 dark:bg-slate-900">
          <div className="border-b border-saffron-100 bg-saffron-50/50 p-6 dark:border-slate-800 dark:bg-slate-900/50">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-saffron-500 to-vermillion-600 text-white shadow-soft">
                <Flame className="h-6 w-6" />
              </div>
              <div>
                <h1 className="font-display text-xl font-bold text-saffron-950 dark:text-white">
                  Demo Workspace Setup
                </h1>
                <p className="text-xs text-saffron-600 dark:text-slate-400">
                  Select a predefined role or tailor parameters before launching.
                </p>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-2.5 sm:grid-cols-3">
              {(['devotee', 'pandit', 'admin'] as const).map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => handleRoleChange(r)}
                  className={cn(
                    'flex items-center gap-3 rounded-xl border p-3 text-left transition',
                    role === r
                      ? 'border-saffron-500 bg-white shadow-sm ring-2 ring-saffron-500/20 dark:border-saffron-400 dark:bg-slate-800'
                      : 'border-saffron-200/70 bg-white/60 hover:bg-white dark:border-slate-800 dark:bg-slate-900/50'
                  )}
                >
                  <div
                    className={cn(
                      'flex h-9 w-9 shrink-0 items-center justify-center rounded-lg',
                      role === r
                        ? 'bg-saffron-500 text-white'
                        : 'bg-saffron-100 text-saffron-700 dark:bg-slate-800 dark:text-saffron-400'
                    )}
                  >
                    {r === 'devotee' ? (
                      <CalendarHeart className="h-5 w-5" />
                    ) : r === 'pandit' ? (
                      <ShieldCheck className="h-5 w-5" />
                    ) : (
                      <Users className="h-5 w-5" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1">
                      <span className="text-xs font-bold capitalize text-slate-900 dark:text-white">
                        {r}
                      </span>
                      {role === r && <CheckCircle2 className="h-3.5 w-3.5 text-saffron-500" />}
                    </div>
                    <p className="truncate text-[11px] text-slate-500 dark:text-slate-400">
                      {r === 'devotee' ? 'Devotee View' : r === 'pandit' ? 'Priest Console' : 'Platform Root'}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6 p-6 sm:p-8">
            {error && (
              <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-xs font-medium text-red-700 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-300">
                {error}
              </div>
            )}

            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2 dark:border-slate-800">
                <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Profile Details
                </h2>
                <button
                  type="button"
                  onClick={() => handleRoleChange(role)}
                  className="flex items-center gap-1 text-xs text-saffron-600 hover:text-saffron-800 dark:text-saffron-400"
                >
                  <RotateCcw className="h-3.5 w-3.5" /> Reset Default
                </button>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="label" htmlFor="demo-name">Full Name</label>
                  <div className="relative">
                    <User className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-saffron-400" />
                    <input
                      id="demo-name"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="input pl-9"
                    />
                  </div>
                </div>

                <div>
                  <label className="label" htmlFor="demo-email">Email Address</label>
                  <div className="relative">
                    <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-saffron-400" />
                    <input
                      id="demo-email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="input pl-9"
                    />
                  </div>
                </div>

                <div>
                  <label className="label" htmlFor="demo-phone">Phone Number</label>
                  <div className="relative">
                    <Phone className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-saffron-400" />
                    <input
                      id="demo-phone"
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="input pl-9"
                    />
                  </div>
                </div>

                <div>
                  <label className="label" htmlFor="demo-city">City / State</label>
                  <div className="relative">
                    <MapPin className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-saffron-400" />
                    <input
                      id="demo-city"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="input pl-9"
                    />
                  </div>
                </div>
              </div>
            </div>

            {role === 'pandit' && (
              <div className="space-y-4 rounded-xl border border-amber-200 bg-amber-50/40 p-4 dark:border-amber-900/30 dark:bg-amber-950/20">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="label">Experience (Years)</label>
                    <div className="relative">
                      <Clock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-amber-500" />
                      <input
                        type="number"
                        min={1}
                        max={60}
                        value={experienceYears}
                        onChange={(e) => setExperienceYears(Number(e.target.value))}
                        className="input pl-9"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="label">Base Dakshina (INR)</label>
                    <div className="relative">
                      <IndianRupee className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-amber-500" />
                      <input
                        type="number"
                        min={100}
                        step={100}
                        value={basePrice}
                        onChange={(e) => setBasePrice(Number(e.target.value))}
                        className="input pl-9"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="label">Specialties</label>
                  <div className="flex flex-wrap gap-2">
                    {AVAILABLE_SPECIALTIES.map((spec) => (
                      <button
                        key={spec}
                        type="button"
                        onClick={() => toggleSpecialty(spec)}
                        className={cn(
                          'rounded-lg px-2.5 py-1 text-xs font-medium transition',
                          specialties.includes(spec)
                            ? 'bg-amber-600 text-white'
                            : 'border border-amber-200 bg-white text-amber-800 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300'
                        )}
                      >
                        {spec}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="label">Bio</label>
                  <textarea
                    rows={2}
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    className="input"
                  />
                </div>
              </div>
            )}

            {role === 'devotee' && (
              <div className="grid grid-cols-1 gap-4 rounded-xl border border-saffron-200 bg-saffron-50/40 p-4 dark:border-saffron-900/30 dark:bg-slate-900/50 sm:grid-cols-2">
                <div>
                  <label className="label">Gotra</label>
                  <input
                    value={gotra}
                    onChange={(e) => setGotra(e.target.value)}
                    className="input"
                    placeholder="e.g. Kashyap"
                  />
                </div>
                <div>
                  <label className="label">Preferred Deity</label>
                  <input
                    value={preferredDeity}
                    onChange={(e) => setPreferredDeity(e.target.value)}
                    className="input"
                    placeholder="e.g. Shiva / Ganesha"
                  />
                </div>
              </div>
            )}

            {role === 'admin' && (
              <div className="rounded-xl border border-purple-200 bg-purple-50/40 p-4 dark:border-purple-900/30 dark:bg-slate-900/50">
                <label className="label">Administrative Scope</label>
                <input
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="input"
                />
              </div>
            )}

            <button type="submit" disabled={busy} className="btn-gold w-full py-2.5">
              {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <ArrowRight className="h-4 w-4" />}
              {busy ? 'Configuring Session...' : 'Enter PoojaConnect'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
import { getApp, getApps, initializeApp } from 'firebase/app';
import {
  GoogleAuthProvider,
  getAuth,
  onAuthStateChanged,
  signInWithPopup,
  signOut as firebaseSignOut,
} from 'firebase/auth';
import firebaseAppletConfig from '../../firebase-applet-config.json';

const now = new Date().toISOString();

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || firebaseAppletConfig.apiKey,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || firebaseAppletConfig.authDomain,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || firebaseAppletConfig.projectId,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || firebaseAppletConfig.storageBucket,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || firebaseAppletConfig.messagingSenderId,
  appId: import.meta.env.VITE_FIREBASE_APP_ID || firebaseAppletConfig.appId,
};
export const firebaseApp = getApps().length ? getApp() : initializeApp(firebaseConfig);
const googleAuth = getAuth(firebaseApp);

export const SEED_SERVICES: Service[] = [
  {
    id: 's-1',
    name: 'Griha Pravesh & Vastu Shanti',
    category: 'Auspicious Start',
    description: 'Comprehensive housewarming ritual with Vastu Purusha pooja, Hawan, and Kalash Sthapana for peace and prosperity in your new home.',
    price: 3500,
    duration_mins: 120,
    samagri_list: ['Brass Kalash', 'Coconuts', 'Mango Leaves', 'Hawan Samagri', 'Desi Ghee', 'Gangajal', 'Camphor'],
    image_url: 'https://images.unsplash.com/photo-1609357605129-26f69add5d6e?auto=format&fit=crop&w=800&q=80',
    is_active: true,
    created_at: now,
    updated_at: now,
  },
  {
    id: 's-2',
    name: 'Satyanarayan Katha & Hawan',
    category: 'Devotional',
    description: 'Traditional Sri Satyanarayan Swami Katha recited in sacred Sanskrit with Hindi translation, followed by Hawan and Aarti.',
    price: 2100,
    duration_mins: 90,
    samagri_list: ['Banana Leaves', 'Tulsi Leaves', 'Panjiri Prasad', 'Incense', 'Ghee Diya', 'Flowers'],
    image_url: 'https://images.unsplash.com/photo-1545232979-fbf68fe9b10d?auto=format&fit=crop&w=800&q=80',
    is_active: true,
    created_at: now,
    updated_at: now,
  },
  {
    id: 's-3',
    name: 'Rudrabhishekam Pooja',
    category: 'Shiva Rituals',
    description: 'Authentic Shivling Abhishekam using sacred offerings (Milk, Curd, Honey, Sugarcane juice, Gangajal) accompanied by Sri Rudram recitation.',
    price: 2500,
    duration_mins: 75,
    samagri_list: ['Pure Cow Milk', 'Curd', 'Honey', 'Bel Patra', 'Rudra Beads', 'Sandalwood Paste'],
    image_url: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=800&q=80',
    is_active: true,
    created_at: now,
    updated_at: now,
  },
  {
    id: 's-4',
    name: 'Mahamrityunjaya Jaap & Hawan',
    category: 'Health & Protection',
    description: '108 recitations of the sacred Mahamrityunjaya Mantra with Vedic fire oblation for well-being and health.',
    price: 5100,
    duration_mins: 180,
    samagri_list: ['Herbal Hawan Wood', 'Pure Cow Ghee', 'Dry Fruits', 'Sesame Seeds', 'Rudraksha Mala'],
    image_url: 'https://images.unsplash.com/photo-1621847468516-1ed5d0df56fe?auto=format&fit=crop&w=800&q=80',
    is_active: true,
    created_at: now,
    updated_at: now,
  },
  {
    id: 's-5',
    name: 'Laxmi Kuber Wealth Pooja',
    category: 'Prosperity',
    description: 'Special invocation for Goddess Lakshmi and Lord Kuber to invite stability, prosperity, and spiritual abundance.',
    price: 2800,
    duration_mins: 60,
    samagri_list: ['Lotus Flowers', 'Silver Coin', 'Kesar', 'Roli', 'Akshat Chawal', 'Sweets'],
    image_url: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=800&q=80',
    is_active: true,
    created_at: now,
    updated_at: now,
  },
  {
    id: 's-6',
    name: 'Navgrah Shanti Pooja',
    category: 'Planetary Blessings',
    description: 'Appease the nine planetary deities with authentic Vedic samidha offerings and Navagraha mantras.',
    price: 3100,
    duration_mins: 90,
    samagri_list: ['9 Sacred Grains', '9 Colored Cloths', 'Navagraha Yantra', 'Hawan Samidha'],
    image_url: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80',
    is_active: true,
    created_at: now,
    updated_at: now,
  },
];

export const SEED_PRODUCTS: Product[] = [
  {
    id: 'p-1',
    name: 'Complete Premium Pooja Samagri Kit',
    description: '32 essential items including organic camphor, pure cow ghee, kumkum, dhoop, gangajal, and hawan woods.',
    category: 'Pooja Kits',
    price: 1299,
    stock: 45,
    image_url: 'https://images.unsplash.com/photo-1609357605129-26f69add5d6e?auto=format&fit=crop&w=600&q=80',
    is_active: true,
    created_at: now,
    updated_at: now,
  },
  {
    id: 'p-2',
    name: 'Handcrafted Solid Brass Diya (Pair)',
    description: 'Traditional heavy brass oil lamps engineered for clean flame retention during daily aarti.',
    category: 'Brassware',
    price: 599,
    stock: 30,
    image_url: 'https://images.unsplash.com/photo-1545232979-fbf68fe9b10d?auto=format&fit=crop&w=600&q=80',
    is_active: true,
    created_at: now,
    updated_at: now,
  },
  {
    id: 'p-3',
    name: 'Natural Sandalwood Dhoop Sticks',
    description: 'Charcoal-free pure Chandan incense offering soothing notes during prayer and meditation.',
    category: 'Incense & Fragrance',
    price: 299,
    stock: 100,
    image_url: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=600&q=80',
    is_active: true,
    created_at: now,
    updated_at: now,
  },
  {
    id: 'p-4',
    name: 'Sealed Gangajal from Haridwar (500ml)',
    description: 'Directly sourced and sealed holy water from Har Ki Pauri for sanctification ceremonies.',
    category: 'Sacred Items',
    price: 199,
    stock: 80,
    image_url: 'https://images.unsplash.com/photo-1621847468516-1ed5d0df56fe?auto=format&fit=crop&w=600&q=80',
    is_active: true,
    created_at: now,
    updated_at: now,
  },
  {
    id: 'p-5',
    name: 'Certified 5-Mukhi Rudraksha Mala',
    description: '108 authentic Panchamukhi beads strung in natural cord for japa and spiritual practice.',
    category: 'Malas & Yantras',
    price: 899,
    stock: 25,
    image_url: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=600&q=80',
    is_active: true,
    created_at: now,
    updated_at: now,
  },
];
export type Role = 'devotee' | 'pandit' | 'admin';
export type BookingMode = 'home' | 'online';
export interface Service {
  id: string;
  name: string;
  category: string;
  description: string;
  price: number;
  duration_mins: number;
  samagri_list: string[];
  image_url?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  stock: number;
  image_url?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Profile {
  id: string;
  email: string;
  full_name: string;
  phone?: string;
  city?: string;
  avatar_url?: string;
  role: Role;
  created_at?: string;
  updated_at?: string;
}

export interface PanditProfile {
  user_id: string;
  bio?: string;
  languages: string[];
  specialties: string[];
  experience_years: number;
  city?: string;
  base_price: number;
  rating: number;
  review_count: number;
  is_verified: boolean;
  is_available: boolean;
  total_earnings: number;
  completed_bookings: number;
  profile?: Profile;
}

export interface Booking {
  id: string;
  devotee_id: string;
  pandit_id: string;
  service_id: string;
  scheduled_at: string;
  mode: BookingMode;
  status: string;
  gotra?: string;
  sankalp?: string;
  address?: string;
  notes?: string;
  amount: number;
  created_at?: string;
  service?: Service;
  devotee?: Profile;
  pandit?: PanditProfile & { profile?: Profile };
}

export interface Order {
  id: string;
  user_id: string;
  total: number;
  status: string;
  shipping_address?: string;
  created_at?: string;
  profile?: Profile;
  items?: OrderItem[];
}

export interface OrderItem {
  id?: string;
  order_id: string;
  product_id: string;
  quantity: number;
  price: number;
  product?: Product;
}

export interface CartItem {
  id: string;
  user_id: string;
  product_id: string;
  quantity: number;
  product?: Product;
}

export interface Review {
  id: string;
  booking_id: string;
  devotee_id: string;
  pandit_id: string;
  rating: number;
  comment?: string;
  created_at?: string;
  devotee?: Profile;
}

export interface AppNotification {
  id: string;
  user_id: string;
  type: string;
  title: string;
  body: string;
  link?: string;
  is_read?: boolean;
  created_at?: string;
}

type Row = Record<string, any>;
type Result<T> = { data: T; error: { message: string } | null };

const storageKey = 'poojaconnect-firebase-data';
const sessionKey = 'poojaconnect-session';
const demoPandit: Profile = {
  id: 'demo-pandit',
  email: 'pandit@example.com',
  full_name: 'Pandit Rajesh Shastri',
  phone: '+91 98123 45678',
  city: 'Varanasi, Uttar Pradesh',
  role: 'pandit',
};
const initialTables: Record<string, Row[]> = {
  services: SEED_SERVICES,
  products: SEED_PRODUCTS,
  profiles: [demoPandit],
  pandit_profiles: [{
    user_id: demoPandit.id,
    bio: 'Acharya in Shukla Yajurveda & Vedic rituals from Sampurnanand Sanskrit Vishwavidyalaya, Varanasi.',
    languages: ['Sanskrit', 'Hindi', 'English'],
    specialties: ['Satyanarayan Katha', 'Rudrabhishek', 'Griha Pravesh', 'Navagraha Shanti'],
    experience_years: 12,
    city: demoPandit.city,
    base_price: 2100,
    rating: 4.9,
    review_count: 28,
    is_verified: true,
    is_available: true,
    total_earnings: 0,
    completed_bookings: 0,
    created_at: now,
    updated_at: now,
  }],
  bookings: [],
  orders: [],
  order_items: [],
  cart_items: [],
  reviews: [],
  notifications: [],
  booking_status_log: [],
};

function readTables(): Record<string, Row[]> {
  if (typeof localStorage === 'undefined') return memoryTables;
  try {
    const saved = localStorage.getItem(storageKey);
    if (!saved) return structuredClone(initialTables);
    const tables = { ...structuredClone(initialTables), ...JSON.parse(saved) };
    for (const name of ['services', 'products', 'profiles', 'pandit_profiles']) {
      if (tables[name]?.length === 0) tables[name] = structuredClone(initialTables[name]);
    }
    return tables;
  } catch (error) {
    console.error('Could not read the local demo database.', error);
    return memoryTables;
  }
}

const memoryTables = structuredClone(initialTables);

function writeTables(tables: Record<string, Row[]>): { message: string } | null {
  Object.assign(memoryTables, tables);
  if (typeof localStorage !== 'undefined') {
    try {
      localStorage.setItem(storageKey, JSON.stringify(tables));
    } catch (error) {
      console.error('Could not persist the local demo database.', error);
      return { message: error instanceof Error ? error.message : 'Could not save changes in browser storage.' };
    }
  }
  return null;
}

function id(prefix: string) {
  return `${prefix}-${crypto.randomUUID()}`;
}

type RealtimeHandler = (payload: { new: Row; old: Row }) => void;
const realtimeHandlers = new Map<string, Array<{ table: string; event: string; filter?: string; handler: RealtimeHandler }>>();

function publish(table: string, event: string, newRow: Row, oldRow: Row = {}) {
  for (const listeners of realtimeHandlers.values()) {
    listeners.forEach((listener) => {
      if (listener.table !== table || (listener.event !== '*' && listener.event !== event)) return;
      if (listener.filter) {
        const match = listener.filter.match(/^([^=]+)=eq\.(.+)$/);
        if (match && newRow[match[1]] !== match[2]) return;
      }
      listener.handler({ new: newRow, old: oldRow });
    });
  }
}

function uniqueKey(table: string, row: Row) {
  if (table === 'pandit_profiles') return row.user_id;
  if (table === 'cart_items') return `${row.user_id}:${row.product_id}`;
  return row.id;
}

function hydrateRelations(table: string, row: Row, tables: Record<string, Row[]>, selection: string): Row {
  const hydrated = { ...row };
  const relations: Record<string, { table: string; field: string; foreignField: string; many?: boolean }> = {
    'pandit_profiles.profile': { table: 'profiles', field: 'user_id', foreignField: 'id' },
    'bookings.service': { table: 'services', field: 'service_id', foreignField: 'id' },
    'bookings.devotee': { table: 'profiles', field: 'devotee_id', foreignField: 'id' },
    'bookings.pandit': { table: 'profiles', field: 'pandit_id', foreignField: 'id' },
    'cart_items.product': { table: 'products', field: 'product_id', foreignField: 'id' },
    'reviews.devotee': { table: 'profiles', field: 'devotee_id', foreignField: 'id' },
    'orders.profile': { table: 'profiles', field: 'user_id', foreignField: 'id' },
    'orders.items': { table: 'order_items', field: 'id', foreignField: 'order_id', many: true },
  };
  for (const [qualifiedName, relation] of Object.entries(relations)) {
    const [source, alias] = qualifiedName.split('.');
    if (source !== table || !selection.includes(`${alias}:`)) continue;
    const value = tables[relation.table]?.filter((candidate) => candidate[relation.foreignField] === row[relation.field]) ?? [];
    hydrated[alias] = relation.many ? value : value[0] ?? null;
  }
  return hydrated;
}

class QueryBuilder<T = any> implements PromiseLike<Result<T | T[] | null>> {
  private filters: Array<[string, unknown]> = [];
  private selected = '*';
  private sortField?: string;
  private ascending = true;
  private maxRows?: number;
  private action: 'select' | 'insert' | 'update' | 'delete' = 'select';
  private payload: Row | Row[] = {};
  private one = false;

  constructor(private table: string) {}
  select(columns = '*') { this.selected = columns; return this; }
  eq(field: string, value: unknown) { this.filters.push([field, value]); return this; }
  order(field: string, options?: { ascending?: boolean }) { this.sortField = field; this.ascending = options?.ascending ?? true; return this; }
  limit(count: number) { this.maxRows = count; return this; }
  maybeSingle() { this.one = true; return this; }
  single() { this.one = true; return this; }
  insert(payload: Row | Row[]) { this.action = 'insert'; this.payload = payload; return this; }
  update(payload: Row) { this.action = 'update'; this.payload = payload; return this; }
  delete() { this.action = 'delete'; return this; }

  private execute(): Result<T | T[] | null> {
    try {
      return this.executeQuery();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Local data operation failed.';
      return { data: null, error: { message } };
    }
  }

  private executeQuery(): Result<T | T[] | null> {
    const tables = readTables();
    let rows = tables[this.table] ?? [];
    const matches = (row: Row) => this.filters.every(([field, value]) => row[field] === value);

    if (this.action === 'insert') {
      const values = (Array.isArray(this.payload) ? this.payload : [this.payload]).map((item) => {
        const key = uniqueKey(this.table, item);
        const existingIndex = rows.findIndex((candidate) => uniqueKey(this.table, candidate) === key);
        const next = {
          ...item,
          id: item.id ?? (this.table === 'pandit_profiles' ? item.user_id : id(this.table.slice(0, 3))),
          created_at: item.created_at ?? new Date().toISOString(),
        };
        if (existingIndex !== -1 && this.upsertMode) {
          rows[existingIndex] = { ...rows[existingIndex], ...next, updated_at: new Date().toISOString() };
          return rows[existingIndex];
        }
        rows.push(next);
        return next;
      });
      tables[this.table] = rows;
      const writeError = writeTables(tables);
      if (writeError) return { data: null, error: writeError };
      values.forEach((value) => publish(this.table, 'INSERT', value));
      const result = values.map((value) => hydrateRelations(this.table, value, tables, this.selected)) as T[];
      return { data: this.one ? (result[0] ?? null) : result, error: null };
    }
    if (this.action === 'update') {
      tables[this.table] = rows.map((row) => {
        if (!matches(row)) return row;
        const updated = { ...row, ...this.payload, updated_at: new Date().toISOString() };
        publish(this.table, 'UPDATE', updated, row);
        return updated;
      });
      const writeError = writeTables(tables);
      if (writeError) return { data: null, error: writeError };
      return { data: null, error: null };
    }
    if (this.action === 'delete') {
      tables[this.table] = rows.filter((row) => {
        if (!matches(row)) return true;
        publish(this.table, 'DELETE', {}, row);
        return false;
      });
      const writeError = writeTables(tables);
      if (writeError) return { data: null, error: writeError };
      return { data: null, error: null };
    }

    rows = rows.filter(matches);
    if (this.sortField) rows.sort((a, b) => {
      const left = a[this.sortField!], right = b[this.sortField!];
      return (left < right ? -1 : left > right ? 1 : 0) * (this.ascending ? 1 : -1);
    });
    if (this.maxRows !== undefined) rows = rows.slice(0, this.maxRows);
    const result = rows.map((row) => hydrateRelations(this.table, row, tables, this.selected)) as T[];
    return { data: (this.one ? (result[0] ?? null) : result) as T | T[] | null, error: null };
  }
  private upsertMode = false;

  upsert(payload: Row | Row[]) {
    this.action = 'insert';
    this.payload = payload;
    this.upsertMode = true;
    return this;
  }

  then<TResult1 = Result<T | T[] | null>, TResult2 = never>(
    onfulfilled?: ((value: Result<T | T[] | null>) => TResult1 | PromiseLike<TResult1>) | null,
    onrejected?: ((reason: unknown) => TResult2 | PromiseLike<TResult2>) | null,
  ) {
    return Promise.resolve(this.execute()).then(onfulfilled, onrejected);
  }
}

type Session = { user: { id: string; email: string }; access_token: string } | null;
interface LocalAccount {
  id: string;
  email: string;
  passwordHash: string;
}

const accountsKey = 'poojaconnect-accounts';
function getAccounts(): LocalAccount[] {
  try {
    return JSON.parse(localStorage.getItem(accountsKey) ?? '[]') as LocalAccount[];
  } catch (error) {
    console.error('Could not read local demo accounts.', error);
    return [];
  }
}

async function hashPassword(password: string) {
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(password));
  return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, '0')).join('');
}

function persistSession(value: Session) {
  if (typeof localStorage === 'undefined') return;
  if (value) localStorage.setItem(sessionKey, JSON.stringify(value));
  else localStorage.removeItem(sessionKey);
}

function loadSession(): Session {
  if (typeof localStorage === 'undefined') return null;
  try {
    return JSON.parse(localStorage.getItem(sessionKey) ?? 'null') as Session;
  } catch (error) {
    console.error('Could not restore the local demo session.', error);
    return null;
  }
}

let session: Session = loadSession();
const authListeners = new Set<(event: string, value: Session) => void>();
function setSession(value: Session, event: string) {
  session = value;
  persistSession(value);
  authListeners.forEach((listener) => listener(event, value));
}

onAuthStateChanged(googleAuth, async (user) => {
  if (!user) return;
  setSession(
    {
      user: { id: user.uid, email: user.email ?? '' },
      access_token: await user.getIdToken(),
    },
    'SIGNED_IN',
  );
});

async function startLocalSession(account: LocalAccount) {
  const value: Session = {
    user: { id: account.id, email: account.email },
    access_token: id('demo-token'),
  };
  setSession(value, 'SIGNED_IN');
  return { data: { user: value.user }, error: null };
}

async function getOrCreateDemoAccount(email: string) {
  const normalizedEmail = email.trim().toLowerCase();
  const accounts = getAccounts();
  let account = accounts.find((item) => item.email === normalizedEmail);
  if (!account) {
    account = {
      id: normalizedEmail === 'admin@example.com' ? 'demo-admin' : `demo-${crypto.randomUUID()}`,
      email: normalizedEmail,
      passwordHash: await hashPassword(normalizedEmail === 'admin@example.com' ? 'admin@123' : crypto.randomUUID()),
    };
    accounts.push(account);
    localStorage.setItem(accountsKey, JSON.stringify(accounts));
  }
  return account;
}

export const firebaseClient = {
  from: <T = any>(table: string) => new QueryBuilder<T>(table),
  removeChannel: (..._args: unknown[]) => undefined,
  channel: (..._args: unknown[]) => {
    const channel = {
      on: (..._eventArgs: unknown[]) => channel,
      subscribe: (_callback?: unknown) => ({}),
    };
    return channel;
  },
  auth: {
    async getSession() { return { data: { session } }; },
    onAuthStateChange(callback: (event: string, value: Session) => void) {
      authListeners.add(callback);
      return { data: { subscription: { unsubscribe: () => authListeners.delete(callback) } } };
    },
    async signInWithPassword({ email, password }: { email: string; password?: string }) {
      if (!email?.trim() || !password) return { data: { user: null }, error: { message: 'Enter both email and password.' } };
      const normalizedEmail = email.trim().toLowerCase();
      let account = getAccounts().find((item) => item.email === normalizedEmail);
      if (import.meta.env.DEV && !account && normalizedEmail === 'admin@example.com' && password === 'admin@123') {
        account = await getOrCreateDemoAccount(normalizedEmail);
        await firebaseClient.from('profiles').upsert({
          id: account.id, email: account.email, full_name: 'PoojaConnect Admin', role: 'admin',
        });
      }
      if (!account || account.passwordHash !== await hashPassword(password)) {
        return { data: { user: null }, error: { message: 'Invalid login credentials.' } };
      }
      return startLocalSession(account);
    },
    async signInWithGoogle(_provider?: unknown, preferredRole: Role = 'devotee') {
      try {
        const credential = await signInWithPopup(googleAuth, new GoogleAuthProvider());
        const user = credential.user;
        const firestore = await import('firebase/firestore');
        const database = firestore.getFirestore(firebaseApp);
        const cloudProfileRef = firestore.doc(database, 'profiles', user.uid);
        const cloudProfileSnapshot = await firestore.getDoc(cloudProfileRef);
        const cloudProfile = cloudProfileSnapshot.data();
        const role: Role = cloudProfile?.role === 'admin' || cloudProfile?.role === 'pandit'
          ? cloudProfile.role
          : cloudProfile?.role === 'devotee'
            ? 'devotee'
            : preferredRole;
        const profile = {
          id: user.uid,
          email: user.email ?? '',
          full_name: user.displayName ?? user.email?.split('@')[0] ?? 'Google User',
          role,
          created_at: cloudProfile?.created_at ?? new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
        await firestore.setDoc(cloudProfileRef, profile, { merge: true });
        const { error } = await firebaseClient.from('profiles').upsert({
          ...profile,
        });
        if (error) {
          await firebaseSignOut(googleAuth);
          return { data: { user: null }, error };
        }
        const value: Session = {
          user: { id: user.uid, email: user.email ?? '' },
          access_token: await user.getIdToken(),
        };
        setSession(value, 'SIGNED_IN');
        return { data: { user: value.user }, error: null };
      } catch (error) {
        const code = (error as { code?: string }).code;
        const message = code === 'auth/operation-not-allowed'
          ? 'Google sign-in is not enabled for this Firebase project. Enable Google under Firebase Console > Authentication > Sign-in method.'
          : code === 'auth/unauthorized-domain'
            ? 'This domain is not authorized for Firebase sign-in. Add localhost under Firebase Console > Authentication > Settings > Authorized domains.'
            : error instanceof Error
              ? error.message
              : 'Google sign-in failed.';
        return { data: { user: null }, error: { message } };
      }
    },
    async signUp({ email, password, options }: { email: string; password: string; options?: { data?: Row } }) {
      const normalizedEmail = email.trim().toLowerCase();
      if (!normalizedEmail || !normalizedEmail.includes('@')) return { data: { user: null }, error: { message: 'Enter a valid email address.' } };
      if (password.length < 6) return { data: { user: null }, error: { message: 'Password must be at least 6 characters.' } };
      const accounts = getAccounts();
      if (accounts.some((item) => item.email === normalizedEmail)) return { data: { user: null }, error: { message: 'An account with this email already exists.' } };
      const account = { id: `user-${crypto.randomUUID()}`, email: normalizedEmail, passwordHash: await hashPassword(password) };
      accounts.push(account);
      localStorage.setItem(accountsKey, JSON.stringify(accounts));
      const metadata = options?.data ?? {};
      const profile = {
        id: account.id, email: normalizedEmail,
        full_name: metadata.full_name ?? normalizedEmail.split('@')[0],
        phone: metadata.phone ?? '', role: metadata.role ?? 'devotee',
      };
      const { error } = await firebaseClient.from('profiles').upsert(profile);
      if (error) return { data: { user: null }, error };
      return { data: { user: { id: account.id, email: account.email } }, error: null };
    },
    async signInWithOtp({ email }: { email: string }) {
      const normalizedEmail = email.trim().toLowerCase();
      const account = await getOrCreateDemoAccount(normalizedEmail);
      const { data: existingProfile } = await firebaseClient
        .from('profiles')
        .select('*')
        .eq('id', account.id)
        .maybeSingle();
      if (!existingProfile) {
        const { error } = await firebaseClient.from('profiles').upsert({
          id: account.id,
          email: normalizedEmail,
          full_name: normalizedEmail.split('@')[0],
          role: 'devotee',
        });
        if (error) return { data: { user: null }, error };
      }
      return startLocalSession(account);
    },
    async demoSignInWithCustomDetails(params: { role: Role; fullName: string; email: string; phone?: string; city?: string; panditDetails?: Partial<PanditProfile> }) {
      const normalizedEmail = params.email.trim().toLowerCase();
      const account = await getOrCreateDemoAccount(normalizedEmail);
      const profile = {
        id: account.id, email: normalizedEmail, full_name: params.fullName,
        role: params.role, phone: params.phone ?? '', city: params.city ?? '',
      };
      const { error } = await firebaseClient.from('profiles').upsert(profile);
      if (error) return { data: null, error };
      if (params.role === 'pandit') {
        const { error: panditError } = await firebaseClient.from('pandit_profiles').upsert({
          user_id: account.id, languages: ['Hindi', 'English'], specialties: ['General Pooja'],
          experience_years: 1, base_price: 1100, rating: 5, review_count: 0,
          is_verified: false, is_available: true, total_earnings: 0, completed_bookings: 0,
          ...params.panditDetails,
        });
        if (panditError) return { data: null, error: panditError };
      }
      const value: Session = { user: { id: account.id, email: normalizedEmail }, access_token: id('demo-token') };
      setSession(value, 'SIGNED_IN');
      return { data: { user: value.user, session: value, profile }, error: null };
    },
    async updatePassword(newPassword: string, oldPassword?: string) {
      if (!session) return { error: { message: 'Sign in before changing your password.' } };
      if (newPassword.length < 6) return { error: { message: 'Password must be at least 6 characters.' } };
      const accounts = getAccounts();
      const accountIndex = accounts.findIndex((item) => item.id === session?.user.id);
      if (accountIndex < 0) return { error: { message: 'Account could not be found.' } };
      if (!oldPassword || accounts[accountIndex].passwordHash !== await hashPassword(oldPassword)) {
        return { error: { message: 'Current password is incorrect.' } };
      }
      accounts[accountIndex].passwordHash = await hashPassword(newPassword);
      localStorage.setItem(accountsKey, JSON.stringify(accounts));
      return { error: null };
    },
    async signOut() {
      await firebaseSignOut(googleAuth);
      setSession(null, 'SIGNED_OUT');
    },
  },
};

export async function uploadProfileAvatar(userId: string, file: File) {
  try {
    const url = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => typeof reader.result === 'string' ? resolve(reader.result) : reject(new Error('Could not read the selected image.'));
      reader.onerror = () => reject(reader.error ?? new Error('Could not read the selected image.'));
      reader.readAsDataURL(file);
    });
    const { error } = await firebaseClient.from('profiles').update({ avatar_url: url }).eq('id', userId);
    return { url: error ? null : url, error };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Could not upload profile image.';
    return { url: null, error: { message } };
  }
}

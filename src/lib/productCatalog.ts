import { getAuth } from 'firebase/auth';
import type { StorageReference } from 'firebase/storage';
import { firebaseApp, SEED_PRODUCTS, type Product } from './firebase';

const MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024;
const LEGACY_STORAGE_KEY = 'poojaconnect-firebase-data';

type ProductFields = Omit<Product, 'id' | 'created_at' | 'updated_at'>;

async function getDatabase() {
  const firestore = await import('firebase/firestore');
  return { ...firestore, database: firestore.getFirestore(firebaseApp) };
}

async function getObjectStorage() {
  const storage = await import('firebase/storage');
  return { ...storage, storage: storage.getStorage(firebaseApp) };
}

function requireImageFile(file: File) {
  if (!file.type.startsWith('image/')) {
    throw new Error('Choose an image file.');
  }
  if (file.size > MAX_IMAGE_SIZE_BYTES) {
    throw new Error('Product images must be 5 MB or smaller.');
  }
}

function getLegacyProducts(): Product[] {
  const saved = localStorage.getItem(LEGACY_STORAGE_KEY);
  if (!saved) return SEED_PRODUCTS;

  const parsed: unknown = JSON.parse(saved);
  if (!parsed || typeof parsed !== 'object' || !('products' in parsed)) return SEED_PRODUCTS;
  const products = (parsed as { products?: unknown }).products;
  if (!Array.isArray(products)) {
    throw new Error('The saved local product catalog is invalid. Fix or clear the browser’s old catalog before importing it.');
  }
  return products as Product[];
}

async function requireAdminProfile() {
  const user = getAuth().currentUser;
  if (!user) {
    throw new Error('Sign in with Google to use the shared product catalog.');
  }
  const firestore = await getDatabase();
  const profile = await firestore.getDoc(firestore.doc(firestore.database, 'profiles', user.uid));
  if (profile.data()?.role !== 'admin') {
    throw new Error('This Google account is not registered as an administrator in Firebase.');
  }
  return user;
}

export async function getSharedProducts() {
  const firestore = await getDatabase();
  const snapshot = await firestore.getDocs(firestore.collection(firestore.database, 'products'));
  return snapshot.docs
    .map((productDoc) => ({ ...productDoc.data(), id: productDoc.id }) as Product)
    .sort((left, right) => left.name.localeCompare(right.name));
}

export async function initializeSharedCatalogFromLegacyBrowser() {
  await requireAdminProfile();
  const firestore = await getDatabase();
  const snapshot = await firestore.getDocs(firestore.collection(firestore.database, 'products'));
  if (!snapshot.empty) {
    return snapshot.docs.map((productDoc) => ({ ...productDoc.data(), id: productDoc.id }) as Product);
  }

  const products = getLegacyProducts();
  if (products.length === 0) return [];
  if (products.length > 500) {
    throw new Error('The local catalog has more than 500 products and cannot be imported in one operation.');
  }

  const batch = firestore.writeBatch(firestore.database);
  for (const product of products) {
    if (!product.id || !product.name) {
      throw new Error('The local catalog contains a product without an ID or name.');
    }
    const productRef = firestore.doc(firestore.database, 'products', product.id);
    batch.set(productRef, {
      ...product,
      created_at: product.created_at ?? new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });
  }
  await batch.commit();
  return getSharedProducts();
}

export async function saveSharedProduct(
  product: Product | null,
  fields: ProductFields,
  imageFile?: File,
) {
  await requireAdminProfile();
  if (imageFile) requireImageFile(imageFile);

  const firestore = await getDatabase();
  const productRef = product
    ? firestore.doc(firestore.database, 'products', product.id)
    : firestore.doc(firestore.collection(firestore.database, 'products'));
  const now = new Date().toISOString();
  let imageUrl = fields.image_url?.trim() ?? '';
  let uploadedImage: StorageReference | null = null;

  if (imageFile) {
    const storage = await getObjectStorage();
    uploadedImage = storage.ref(storage.storage, `products/${productRef.id}/${crypto.randomUUID()}`);
    await storage.uploadBytes(uploadedImage, imageFile, { contentType: imageFile.type });
    imageUrl = await storage.getDownloadURL(uploadedImage);
  }

  const nextProduct: Product = {
    ...fields,
    id: productRef.id,
    image_url: imageUrl,
    created_at: product?.created_at ?? now,
    updated_at: now,
  };

  try {
    await firestore.setDoc(productRef, nextProduct);
  } catch (error) {
    if (uploadedImage) {
      try {
        const storage = await getObjectStorage();
        await storage.deleteObject(uploadedImage);
      } catch (cleanupError) {
        console.error('Could not remove the unreferenced product image after a failed catalog save.', cleanupError);
      }
    }
    throw error;
  }

  let cleanupWarning: string | undefined;
  if (product?.image_url && product.image_url !== imageUrl) {
    try {
      await deleteStorageImage(product.image_url);
    } catch (error) {
      console.error('Could not remove the replaced product image from Firebase Storage.', error);
      cleanupWarning = 'The product was saved, but its previous image could not be removed from storage.';
    }
  }
  return { product: nextProduct, cleanupWarning };
}

async function deleteStorageImage(imageUrl: string) {
  if (!imageUrl.includes('firebasestorage.googleapis.com') && !imageUrl.includes('firebasestorage.app')) return;
  const storage = await getObjectStorage();
  await storage.deleteObject(storage.ref(storage.storage, imageUrl));
}

export async function deleteSharedProduct(product: Product) {
  await requireAdminProfile();
  const firestore = await getDatabase();
  await firestore.deleteDoc(firestore.doc(firestore.database, 'products', product.id));
  let cleanupWarning: string | undefined;
  if (product.image_url) {
    try {
      await deleteStorageImage(product.image_url);
    } catch (error) {
      console.error('Could not remove the deleted product image from Firebase Storage.', error);
      cleanupWarning = 'The product was deleted, but its image could not be removed from storage.';
    }
  }
  return { cleanupWarning };
}

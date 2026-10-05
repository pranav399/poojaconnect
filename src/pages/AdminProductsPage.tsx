import { useEffect, useState } from 'react';
import { Loader2, Package, Pencil, Plus, Save, ShoppingBag, Trash2, X } from 'lucide-react';
import type { Product } from '../lib/firebase';
import { deleteSharedProduct, initializeSharedCatalogFromLegacyBrowser, saveSharedProduct } from '../lib/productCatalog';
import { formatINR } from '../lib/utils';
import { PageHeader } from '../components/ui/PageHeader';
import { Badge } from '../components/ui/Badge';
import { SkeletonCard } from '../components/ui/Skeleton';
import { Modal } from '../components/ui/Modal';
import { ConfirmDialog } from '../components/ui/ConfirmDialog';
import { useToast } from '../context/ToastContext';

const emptyForm = {
  name: '',
  description: '',
  category: '',
  price: 0,
  stock: 0,
  image_url: '',
  is_active: true,
};

export function AdminProductsPage() {
  const { success, error: toastError, warning } = useToast();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Product | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [form, setForm] = useState(emptyForm);

  const load = async () => {
    setLoading(true);
    try {
      const data = await initializeSharedCatalogFromLegacyBrowser();
      setProducts(data);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Could not load the shared product catalog.';
      toastError('Could not load samagri products', message);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const openNew = () => {
    setEditing(null);
    setForm({ ...emptyForm });
    setImageFile(null);
    setShowModal(true);
  };

  const openEdit = (product: Product) => {
    setEditing(product);
    setForm({
      name: product.name,
      description: product.description,
      category: product.category,
      price: Number(product.price),
      stock: Number(product.stock),
      image_url: product.image_url ?? '',
      is_active: product.is_active,
    });
    setImageFile(null);
    setShowModal(true);
  };

  const save = async () => {
    const name = form.name.trim();
    if (!name) {
      toastError('Name is required', 'Enter a product name before saving.');
      return;
    }
    if (!Number.isFinite(form.price) || form.price < 0 || !Number.isFinite(form.stock) || form.stock < 0) {
      toastError('Invalid product details', 'Price and stock must be zero or greater.');
      return;
    }

    setSaving(true);
    const payload = {
      name,
      description: form.description.trim(),
      category: form.category.trim() || 'General',
      price: form.price,
      stock: Math.floor(form.stock),
      image_url: form.image_url.trim(),
      is_active: form.is_active,
      updated_at: new Date().toISOString(),
    };
    try {
      const result = await saveSharedProduct(editing, payload, imageFile ?? undefined);
      if (result.cleanupWarning) warning('Image cleanup warning', result.cleanupWarning);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Could not save the product.';
      toastError('Save failed', message);
      return;
    } finally {
      setSaving(false);
    }
    setShowModal(false);
    success(editing ? 'Product updated' : 'Product created', `${payload.name} has been saved.`);
    await load();
  };

  const remove = async () => {
    const product = products.find((item) => item.id === deleteId);
    setDeleteId(null);
    if (!product) return;
    try {
      const result = await deleteSharedProduct(product);
      if (result.cleanupWarning) warning('Image cleanup warning', result.cleanupWarning);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Could not delete the product.';
      toastError('Delete failed', message);
      return;
    }
    success('Product deleted', 'The product has been removed from the shop.');
    await load();
  };

  return (
    <div>
      <PageHeader
        title="Samagri Shop Catalog"
        description="Manage the products, prices, and inventory shown in the devotee shop."
        actions={<button onClick={openNew} className="btn-primary"><Plus className="h-4 w-4" /> Add Product</button>}
      />

      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => <SkeletonCard key={index} />)}
        </div>
      ) : products.length === 0 ? (
        <div className="card flex flex-col items-center gap-3 py-16 text-center">
          <ShoppingBag className="h-10 w-10 text-saffron-300" />
          <p className="font-semibold text-saffron-900 dark:text-white">No products in the shop</p>
          <p className="text-sm text-saffron-500">Add a samagri product to make it available in the devotee shop.</p>
          <button onClick={openNew} className="btn-primary mt-2"><Plus className="h-4 w-4" /> Add Product</button>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <div key={product.id} className="card overflow-hidden">
              <div className="relative h-36 overflow-hidden bg-saffron-100 dark:bg-slate-800">
                {product.image_url ? (
                  <img src={product.image_url} alt={product.name} className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-saffron-400"><Package className="h-8 w-8" /></div>
                )}
                <span className="absolute left-2 top-2 chip bg-white/90 text-saffron-700 shadow-soft">{product.category}</span>
                {!product.is_active && <span className="absolute right-2 top-2"><Badge variant="gray">Inactive</Badge></span>}
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-saffron-900 dark:text-white">{product.name}</h3>
                <p className="mt-1 line-clamp-2 text-xs text-saffron-500 dark:text-slate-400">{product.description}</p>
                <div className="mt-3 flex items-center justify-between">
                  <span className="font-bold text-saffron-700 dark:text-saffron-300">{formatINR(product.price)}</span>
                  <span className="text-xs text-saffron-500 dark:text-slate-400">Stock: {product.stock}</span>
                </div>
                <div className="mt-3 flex gap-2 border-t border-saffron-100 pt-3 dark:border-slate-800">
                  <button onClick={() => openEdit(product)} className="btn-secondary flex-1 text-xs">
                    <Pencil className="h-3.5 w-3.5" /> Edit
                  </button>
                  <button onClick={() => setDeleteId(product.id)} className="btn-danger px-3 py-2 text-xs" aria-label={`Delete ${product.name}`}>
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal
        open={showModal}
        onClose={() => setShowModal(false)}
        title={editing ? 'Edit Samagri Product' : 'Add Samagri Product'}
        size="lg"
        footer={
          <>
            <button onClick={() => setShowModal(false)} className="btn-secondary"><X className="h-4 w-4" /> Cancel</button>
            <button onClick={save} disabled={saving} className="btn-primary">
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />} Save
            </button>
          </>
        }
      >
        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="label">Name</label>
              <input value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} className="input" />
            </div>
            <div>
              <label className="label">Category</label>
              <input value={form.category} onChange={(event) => setForm({ ...form, category: event.target.value })} className="input" />
            </div>
          </div>
          <div>
            <label className="label">Description</label>
            <textarea value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} rows={3} className="input" />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="label">Price (₹)</label>
              <input type="number" min={0} step="0.01" value={form.price} onChange={(event) => setForm({ ...form, price: Number(event.target.value) })} className="input" />
            </div>
            <div>
              <label className="label">Stock</label>
              <input type="number" min={0} step={1} value={form.stock} onChange={(event) => setForm({ ...form, stock: Number(event.target.value) })} className="input" />
            </div>
          </div>
          <div>
            <label className="label">Image URL</label>
            <input type="url" value={form.image_url} onChange={(event) => setForm({ ...form, image_url: event.target.value })} className="input" />
          </div>
          <div>
            <label className="label">Upload image</label>
            <input
              type="file"
              accept="image/*"
              onChange={(event) => setImageFile(event.target.files?.[0] ?? null)}
              className="input"
            />
            <p className="mt-1 text-xs text-saffron-500 dark:text-slate-400">
              Upload an image up to 5 MB. A selected upload replaces the image URL above.
              {imageFile ? ` Selected: ${imageFile.name}` : ''}
            </p>
          </div>
          <label className="flex items-center gap-2 text-sm text-saffron-700 dark:text-slate-300">
            <input type="checkbox" checked={form.is_active} onChange={(event) => setForm({ ...form, is_active: event.target.checked })} />
            Available in the devotee shop
          </label>
        </div>
      </Modal>

      <ConfirmDialog
        open={!!deleteId}
        title="Delete product"
        message="This product will be removed from the samagri shop. This action cannot be undone."
        confirmLabel="Delete"
        variant="danger"
        onConfirm={remove}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
}

import { useState } from "react";
import { FormShell } from "../components/FormShell";
import { useAppStore } from "../store/useAppStore";

const initialProductForm = {
  name: "",
  category: "",
  brand: "",
  description: "",
  images: [],
};

const initialListingForm = {
  price: "",
  location: "",
};

export function CreateListingPage() {
  const [productForm, setProductForm] = useState(initialProductForm);
  const [listingForm, setListingForm] = useState(initialListingForm);
  const { createdProduct, createProduct, loading, publishListing } = useAppStore();

  return (
    <section className="split-page">
      <FormShell title="Create product">
        <form className="form-grid" onSubmit={(event) => handleProductSubmit(event, createProduct, productForm)}>
          <input placeholder="Product name" value={productForm.name} onChange={(e) => setProductForm({ ...productForm, name: e.target.value })} />
          <input placeholder="Category" value={productForm.category} onChange={(e) => setProductForm({ ...productForm, category: e.target.value })} />
          <input placeholder="Brand" value={productForm.brand} onChange={(e) => setProductForm({ ...productForm, brand: e.target.value })} />
          <textarea placeholder="Description" value={productForm.description} onChange={(e) => setProductForm({ ...productForm, description: e.target.value })} />
          <input type="file" accept="image/*" multiple onChange={(e) => setProductForm({ ...productForm, images: e.target.files })} />
          <button disabled={loading}>{loading ? "Saving..." : "Save product"}</button>
        </form>
      </FormShell>

      <FormShell title="Publish listing">
        <form className="form-grid" onSubmit={(event) => handleListingSubmit(event, publishListing, createdProduct, listingForm)}>
          <input value={createdProduct?.name || "Save product first"} readOnly />
          <input placeholder="Price" type="number" min="0" value={listingForm.price} onChange={(e) => setListingForm({ ...listingForm, price: e.target.value })} />
          <input placeholder="Fulfilment location" value={listingForm.location} onChange={(e) => setListingForm({ ...listingForm, location: e.target.value })} />
          <button disabled={loading || !createdProduct}>{loading ? "Publishing..." : "Publish listing"}</button>
        </form>
      </FormShell>
    </section>
  );
}

function handleProductSubmit(event, createProduct, form) {
  event.preventDefault();
  createProduct(form);
}

function handleListingSubmit(event, publishListing, product, form) {
  event.preventDefault();
  if (product) publishListing(product._id, form);
}

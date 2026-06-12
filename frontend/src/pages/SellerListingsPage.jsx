import { useEffect } from "react";
import { useAppStore } from "../store/useAppStore";

export function SellerListingsPage() {
  const { loadMyListings, loading, myListings, setView } = useAppStore();

  useEffect(() => {
    loadMyListings();
  }, [loadMyListings]);

  return (
    <section className="dashboard">
      <div className="dashboard-head">
        <div>
          <p>Seller</p>
          <h2>Catalog listings</h2>
        </div>
        <button onClick={() => setView("createListing")}>Add product</button>
      </div>

      <ListingGrid listings={myListings} loading={loading} empty="No catalog listings yet." />
    </section>
  );
}

export function ListingGrid({ listings, loading, empty }) {
  if (loading) {
    return <p className="empty-state standalone">Loading...</p>;
  }

  if (!listings.length) {
    return <p className="empty-state standalone">{empty}</p>;
  }

  return (
    <div className="listing-grid">
      {listings.map((listing) => (
        <article className="listing-card" key={listing._id}>
          <div className="listing-image">
            {listing.product?.images?.[0] ? <img src={listing.product.images[0]} alt="" /> : <span>No image</span>}
          </div>
          <h3>{listing.product?.name}</h3>
          <p>{listing.product?.category}</p>
          <strong>INR {listing.price}</strong>
          <small>{listing.status}</small>
        </article>
      ))}
    </div>
  );
}

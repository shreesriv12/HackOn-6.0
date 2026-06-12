import { useEffect } from "react";
import { ListingGrid } from "./SellerListingsPage";
import { useAppStore } from "../store/useAppStore";

export function ProductBrowsePage() {
  const { listings, loadListings, loading } = useAppStore();

  useEffect(() => {
    loadListings();
  }, [loadListings]);

  return (
    <section className="dashboard">
      <div className="dashboard-head">
        <div>
          <p>Buyer</p>
          <h2>Browse products</h2>
        </div>
      </div>

      <ListingGrid listings={listings} loading={loading} empty="No active listings yet." />
    </section>
  );
}

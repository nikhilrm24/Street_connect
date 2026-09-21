import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import VendorChrome from "../../components/VendorChrome";
import { ErrorState, LoadingState, ShopCover, StatusBadge } from "../../components/ui";

function VendorProfile() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [toggling, setToggling] = useState(false);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:5000/api/vendors/profile", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setProfile(response.data.profile);
    } catch (fetchError) {
      console.error(fetchError);
      setError("Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    Promise.resolve().then(fetchProfile);
  }, []);

  const handleAvailabilityToggle = async () => {
    if (!profile) return;

    setToggling(true);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        "http://localhost:5000/api/vendors/availability",
        { is_available: !profile.is_available },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setProfile((current) => ({
        ...current,
        is_available: response.data.vendor?.is_available ?? !current.is_available,
      }));
    } catch (toggleError) {
      console.error(toggleError);
      setError("Failed to update shop status");
    } finally {
      setToggling(false);
    }
  };

  return (
    <VendorChrome>
      <main className="mx-auto max-w-4xl px-4 py-6 sm:px-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="font-display text-3xl font-bold">My Shop</h1>
          <button
            type="button"
            onClick={() => navigate("/vendor/profile/edit")}
            className="min-h-14 rounded-2xl bg-clay px-6 text-lg font-black text-white hover:bg-clay-dark"
          >
            Edit Shop
          </button>
        </div>

        {loading ? <div className="mt-6"><LoadingState label="Loading profile..." /></div> : null}
        {error ? <div className="mt-6"><ErrorState message={error} /></div> : null}

        {!loading && !error && profile ? (
          <article className="mt-6 overflow-hidden rounded-[2rem] border border-sand bg-white shadow-sm">
            <ShopCover
              src={profile.shop_image}
              name={profile.business_name}
              className="h-64 w-full"
            />
            <div className="p-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h2 className="font-display text-3xl font-bold">{profile.business_name}</h2>
                <StatusBadge open={Boolean(profile.is_available)} />
              </div>
              <p className="mt-2 font-bold text-leaf">{profile.category}</p>

              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                <p className="rounded-2xl bg-cream p-4">
                  <span className="block text-sm text-mute">Phone</span>
                  <strong>{profile.phone}</strong>
                </p>
                <p className="rounded-2xl bg-cream p-4">
                  <span className="block text-sm text-mute">Location</span>
                  <strong>{profile.location_info}</strong>
                </p>
                <p className="rounded-2xl bg-cream p-4">
                  <span className="block text-sm text-mute">Delivery</span>
                  <strong>{profile.delivary_info}</strong>
                </p>
                <p className="rounded-2xl bg-cream p-4">
                  <span className="block text-sm text-mute">Rating</span>
                  <strong>⭐ {profile.rating}</strong>
                </p>
              </div>

              <p
                className={`mt-4 font-extrabold ${
                  profile.is_available ? "text-emerald-700" : "text-red-700"
                }`}
              >
                {profile.is_available
                  ? "Currently accepting orders"
                  : "Currently closed to new orders"}
              </p>

              <button
                type="button"
                onClick={handleAvailabilityToggle}
                disabled={toggling}
                className={`mt-5 w-full min-h-14 rounded-2xl text-lg font-black text-white ${
                  profile.is_available ? "bg-emerald-700" : "bg-red-600"
                }`}
              >
                {toggling
                  ? "Updating..."
                  : profile.is_available
                    ? "Shop Open — tap to close"
                    : "Shop Closed — tap to open"}
              </button>
            </div>
          </article>
        ) : null}
      </main>
    </VendorChrome>
  );
}

export default VendorProfile;

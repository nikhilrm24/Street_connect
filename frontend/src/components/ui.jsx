import { resolveImageUrl, initials } from "../utils/media";

export function StatusBadge({ status, open }) {
  if (typeof open === "boolean") {
    return (
      <span
        className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-extrabold uppercase tracking-wide ${
          open ? "bg-emerald-100 text-emerald-800" : "bg-red-100 text-red-800"
        }`}
      >
        {open ? "Open" : "Closed"}
      </span>
    );
  }

  const map = {
    pending: "bg-amber-100 text-amber-900",
    accepted: "bg-sky-100 text-sky-900",
    preparing: "bg-orange-100 text-orange-900",
    ready: "bg-lime-100 text-lime-900",
    delivered: "bg-emerald-100 text-emerald-900",
    cancelled: "bg-red-100 text-red-800",
    new_order: "bg-clay/15 text-clay-dark",
    order_update: "bg-emerald-100 text-emerald-900",
    payment: "bg-amber-100 text-amber-900",
    system: "bg-stone-200 text-stone-800",
  };

  return (
    <span
      className={`inline-flex w-fit items-center rounded-full px-3 py-1 text-xs font-extrabold capitalize ${
        map[status] || "bg-stone-200 text-stone-800"
      }`}
    >
      {status || "update"}
    </span>
  );
}

export function ShopCover({ src, name, className = "h-48 w-full" }) {
  const url = resolveImageUrl(src);
  if (url) {
    return (
      <img
        src={url}
        alt={name || "Shop"}
        className={`${className} overflow-hidden object-cover`}
      />
    );
  }

  return (
    <div
      className={`${className} stall-pattern flex items-center justify-center overflow-hidden text-white`}
      aria-hidden="true"
    >
      <span className="rounded-full bg-white/15 px-5 py-4 font-display text-3xl font-bold">
        {initials(name)}
      </span>
    </div>
  );
}

export function LoadingState({ label = "Loading…" }) {
  return (
    <div className="page-enter rounded-3xl border border-sand bg-white p-8 text-center shadow-sm">
      <p className="text-lg font-bold text-forest">{label}</p>
    </div>
  );
}

export function EmptyState({ title, detail, action }) {
  return (
    <div className="page-enter rounded-3xl border border-dashed border-stone-300 bg-white p-8 text-center">
      <p className="font-display text-2xl font-bold text-ink">{title}</p>
      {detail ? <p className="mt-2 text-mute">{detail}</p> : null}
      {action}
    </div>
  );
}

export function ErrorState({ message, onRetry }) {
  return (
    <div className="rounded-3xl border border-red-200 bg-red-50 p-6 text-center">
      <p className="font-bold text-red-800">{message}</p>
      {onRetry ? (
        <button
          type="button"
          onClick={onRetry}
          className="mt-4 inline-flex min-h-12 items-center justify-center rounded-2xl bg-forest px-5 font-bold text-white"
        >
          Try again
        </button>
      ) : null}
    </div>
  );
}

export function Field({ label, children, hint }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-extrabold text-ink">{label}</span>
      {children}
      {hint ? <span className="mt-1 block text-sm text-mute">{hint}</span> : null}
    </label>
  );
}

export const fieldClass =
  "w-full min-h-12 rounded-2xl border border-stone-300 bg-white px-4 py-3 text-base text-ink outline-none transition focus:border-leaf";

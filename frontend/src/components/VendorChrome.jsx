import NavbarVendor from "./NavbarVendor";

function VendorChrome({ children }) {
  return (
    <div className="min-h-screen bg-cream pb-24 text-ink md:pb-10">
      <NavbarVendor />
      {children}
    </div>
  );
}

export default VendorChrome;

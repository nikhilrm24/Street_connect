import { Link } from "react-router-dom";
function Home() {
  return (
    <div className="min-h-screen bg-gray-100 text-gray-900">
      <div className="mx-auto max-w-6xl">
       
        <header className="border-b border-gray-200 bg-white">
          <nav className="flex flex-row items-center justify-between px-6 py-4 sm:px-10">
            <h1 className="text-2xl font-bold tracking-tight text-emerald-700">Street Connect</h1>
            <div className="flex flex-row items-center gap-4 sm:gap-6">
             <Link to="/login">
              <p className="cursor-pointer text-sm font-medium text-gray-600 transition-colors hover:text-emerald-700">
                Login
              </p>
             </Link>
             <Link to="/register">
              <p className="cursor-pointer rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-emerald-700">
                Register
              </p>
             </Link>
            </div>
          </nav>
        </header>

        <section className="flex min-h-[500px] flex-col items-center justify-center gap-5 px-6 py-16 text-center">
          <h2 className="max-w-2xl text-4xl font-bold leading-tight tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
            Shop Local, Support Local
          </h2>
          <p className="max-w-md text-base text-gray-600 sm:text-lg">Find Local Vendors Near You</p>
          <button className="mt-2 rounded-lg bg-emerald-600 px-8 py-3 text-base font-semibold text-white shadow-sm transition-colors hover:bg-emerald-700">
            Explore Vendors
          </button>
        </section>

      
        <section className="px-6 py-12 sm:px-10">
          <h2 className="mb-8 text-center text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
            Browse Categories
          </h2>
          <div className="grid grid-cols-2 gap-4 text-center md:grid-cols-3">
            <p className="cursor-pointer rounded-2xl border border-gray-200 bg-white p-10 font-medium capitalize text-gray-800 shadow-sm transition-all hover:-translate-y-1 hover:border-emerald-200 hover:text-emerald-700 hover:shadow-md">
              food
            </p>
            <p className="cursor-pointer rounded-2xl border border-gray-200 bg-white p-10 font-medium capitalize text-gray-800 shadow-sm transition-all hover:-translate-y-1 hover:border-emerald-200 hover:text-emerald-700 hover:shadow-md">
              Tea
            </p>
            <p className="cursor-pointer rounded-2xl border border-gray-200 bg-white p-10 font-medium capitalize text-gray-800 shadow-sm transition-all hover:-translate-y-1 hover:border-emerald-200 hover:text-emerald-700 hover:shadow-md">
              grocery
            </p>
            <p className="cursor-pointer rounded-2xl border border-gray-200 bg-white p-10 font-medium capitalize text-gray-800 shadow-sm transition-all hover:-translate-y-1 hover:border-emerald-200 hover:text-emerald-700 hover:shadow-md">
              bakery
            </p>
            <p className="cursor-pointer rounded-2xl border border-gray-200 bg-white p-10 font-medium capitalize text-gray-800 shadow-sm transition-all hover:-translate-y-1 hover:border-emerald-200 hover:text-emerald-700 hover:shadow-md">
              chicken
            </p>
            <p className="cursor-pointer rounded-2xl border border-gray-200 bg-white p-10 font-medium capitalize text-gray-800 shadow-sm transition-all hover:-translate-y-1 hover:border-emerald-200 hover:text-emerald-700 hover:shadow-md">
              juice
            </p>
          </div>
        </section>

        <section className="px-6 py-12 sm:px-10">
          <p className="mb-8 text-center text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
            Why Street Connect
          </p>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <p className="rounded-2xl border border-gray-200 bg-white p-10 text-center leading-relaxed text-gray-700 shadow-sm">
              🛍️ Discover Local Find vendors around you
            </p>
            <p className="rounded-2xl border border-gray-200 bg-white p-10 text-center leading-relaxed text-gray-700 shadow-sm">
              📍 Nearby Find businesses close to your location
            </p>
            <p className="rounded-2xl border border-gray-200 bg-white p-10 text-center leading-relaxed text-gray-700 shadow-sm">
              🤝 Support Local Help local businesses grow
            </p>
          </div>
        </section>

       
        <footer className="mt-8 bg-gray-900 px-6 py-8 text-center text-white">
          <h2 className="text-xl font-bold tracking-tight text-emerald-400">Street Connect</h2>
          <p className="mt-2 text-sm text-gray-300">Shop Local. Support Local.</p>
          <p className="mt-4 text-xs text-gray-500">© 2026 Street Connect</p>
        </footer>
      </div>
    </div>
  )
}

export default Home;
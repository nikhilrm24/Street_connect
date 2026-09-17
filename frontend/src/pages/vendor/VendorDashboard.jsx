function VendorDashboard() {

    return (
        <div className="max-w-6xl mx-auto p-6">

            <h1 className="text-3xl font-bold mb-6">
                Vendor Dashboard
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                <div className="bg-white rounded-lg shadow p-6">
                    <h2 className="text-lg font-semibold">
                        Products
                    </h2>

                    <p className="text-gray-500 mt-2">
                        Manage your products
                    </p>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                    <h2 className="text-lg font-semibold">
                        Orders
                    </h2>

                    <p className="text-gray-500 mt-2">
                        Manage customer orders
                    </p>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                    <h2 className="text-lg font-semibold">
                        Profile
                    </h2>

                    <p className="text-gray-500 mt-2">
                        Manage your shop
                    </p>
                </div>

            </div>

        </div>
    );
}

export default VendorDashboard;
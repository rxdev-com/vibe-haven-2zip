// Mock data for development when database is not available
export const mockSuppliers = [
    {
        id: "1",
        name: "Kumar Singh",
        businessName: "Kumar Oil Mills",
        address: "Industrial Area, Sector 62, Noida, Uttar Pradesh",
        phone: "+91 98765 43210",
        rating: 4.7,
        isVerified: true,
        location: {
            coordinates: [
                77.391,
                28.6139
            ]
        }
    },
    {
        id: "2",
        name: "Priya Sharma",
        businessName: "Spice Garden",
        address: "Khari Baoli, Old Delhi, Delhi",
        phone: "+91 87654 32109",
        rating: 4.8,
        isVerified: true,
        location: {
            coordinates: [
                77.23,
                28.6562
            ]
        }
    },
    {
        id: "3",
        name: "Ramesh Gupta",
        businessName: "Grain Traders Co.",
        address: "Azadpur Mandi, Delhi",
        phone: "+91 76543 21098",
        rating: 4.3,
        isVerified: true,
        location: {
            coordinates: [
                77.1734,
                28.7196
            ]
        }
    }
];
export const mockMaterials = [
    {
        id: "1",
        name: "Premium Mustard Oil",
        category: "Oils & Fats",
        price: 180,
        unit: "per liter",
        supplier: mockSuppliers[0],
        rating: 4.5,
        reviews: 24,
        supplierId: "1",
        stock: 50,
        inStock: true,
        distance: 2.3,
        location: "2.3 km away",
        supplierAddress: mockSuppliers[0].address
    },
    {
        id: "2",
        name: "Garam Masala Powder",
        category: "Spices",
        price: 320,
        unit: "per kg",
        supplier: mockSuppliers[1],
        rating: 4.8,
        reviews: 42,
        supplierId: "2",
        stock: 25,
        inStock: true,
        distance: 1.8,
        location: "1.8 km away",
        supplierAddress: mockSuppliers[1].address
    },
    {
        id: "3",
        name: "Basmati Rice",
        category: "Grains",
        price: 120,
        unit: "per kg",
        supplier: mockSuppliers[2],
        rating: 4.3,
        reviews: 18,
        supplierId: "3",
        stock: 100,
        inStock: true,
        distance: 3.1,
        location: "3.1 km away",
        supplierAddress: mockSuppliers[2].address
    },
    {
        id: "4",
        name: "Fresh Onions",
        category: "Vegetables",
        price: 35,
        unit: "per kg",
        supplier: mockSuppliers[2],
        rating: 4.2,
        reviews: 31,
        supplierId: "3",
        stock: 0,
        inStock: false,
        distance: 0.9,
        location: "0.9 km away",
        supplierAddress: mockSuppliers[2].address
    },
    {
        id: "5",
        name: "Red Chili Powder",
        category: "Spices",
        price: 280,
        unit: "per kg",
        supplier: mockSuppliers[1],
        rating: 4.6,
        reviews: 38,
        supplierId: "2",
        stock: 15,
        inStock: true,
        distance: 2.7,
        location: "2.7 km away",
        supplierAddress: mockSuppliers[1].address
    },
    {
        id: "6",
        name: "Pure Ghee",
        category: "Oils & Fats",
        price: 450,
        unit: "per kg",
        supplier: mockSuppliers[0],
        rating: 4.9,
        reviews: 67,
        supplierId: "1",
        stock: 30,
        inStock: true,
        distance: 1.2,
        location: "1.2 km away",
        supplierAddress: mockSuppliers[0].address
    }
];
export const mockUser = {
    id: "vendor1",
    name: "Rajesh Kumar",
    email: "rajesh@chaatcorner.com",
    role: "vendor",
    businessName: "Rajesh's Chaat Corner",
    address: "Connaught Place, New Delhi",
    isVerified: true,
    rating: 4.5,
    totalOrders: 156
};
export const mockOrders = [
    {
        id: "ORD001",
        supplier: "Kumar Oil Mills",
        items: "Premium Mustard Oil (2L), Garam Masala (1kg)",
        amount: 680,
        status: "out_for_delivery",
        date: "2024-01-15",
        estimatedDelivery: "Today, 3:00 PM",
        supplierPhone: "+91 98765 43210",
        supplierRating: 4.5,
        trackingSteps: [
            {
                step: "Order Placed",
                time: "10:30 AM",
                completed: true,
                description: "Order confirmed by supplier"
            },
            {
                step: "Preparing",
                time: "11:00 AM",
                completed: true,
                description: "Items being packed"
            },
            {
                step: "Out for Delivery",
                time: "2:15 PM",
                completed: true,
                description: "On the way to your location"
            },
            {
                step: "Delivered",
                time: "3:00 PM",
                completed: false,
                description: "Order will be delivered"
            }
        ]
    },
    {
        id: "ORD002",
        supplier: "Spice Garden",
        items: "Red Chili Powder (1kg), Turmeric (500g)",
        amount: 420,
        status: "confirmed",
        date: "2024-01-15",
        estimatedDelivery: "Tomorrow, 11:00 AM",
        supplierPhone: "+91 87654 32109",
        supplierRating: 4.8,
        trackingSteps: [
            {
                step: "Order Placed",
                time: "2:45 PM",
                completed: true,
                description: "Order confirmed by supplier"
            },
            {
                step: "Preparing",
                time: "",
                completed: false,
                description: "Items being prepared"
            },
            {
                step: "Out for Delivery",
                time: "",
                completed: false,
                description: "Will be dispatched soon"
            },
            {
                step: "Delivered",
                time: "",
                completed: false,
                description: "Order will be delivered"
            }
        ]
    },
    {
        id: "ORD003",
        supplier: "Fresh Veggie Hub",
        items: "Fresh Onions (5kg), Potatoes (3kg)",
        amount: 245,
        status: "delivered",
        date: "2024-01-14",
        estimatedDelivery: "Delivered",
        supplierPhone: "+91 76543 21098",
        supplierRating: 4.2,
        trackingSteps: [
            {
                step: "Order Placed",
                time: "9:15 AM",
                completed: true,
                description: "Order confirmed by supplier"
            },
            {
                step: "Preparing",
                time: "9:45 AM",
                completed: true,
                description: "Items packed and ready"
            },
            {
                step: "Out for Delivery",
                time: "11:30 AM",
                completed: true,
                description: "Dispatched for delivery"
            },
            {
                step: "Delivered",
                time: "1:20 PM",
                completed: true,
                description: "Successfully delivered"
            }
        ]
    }
];
// Development mode helper
export const isDevelopmentMode = ()=>{
    return !import.meta.env.VITE_API_URL || import.meta.env.DEV;
};
// Check if database features are available
export const checkDatabaseAvailability = async ()=>{
    try {
        // Check if we have a MongoDB URI configured
        const hasMongoUri = localStorage.getItem("mongoUri") || process.env.MONGODB_URI || process.env.MONGO_URI;
        if (hasMongoUri) {
            // Try to ping the database endpoint if it exists
            try {
                const response = await fetch("/api/ping", {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    signal: AbortSignal.timeout(5000)
                });
                // 5 second timeout
                if (response.ok) {
                    const data = await response.json();
                    return data.database === "connected";
                }
            } catch (fetchError) {
                // If fetch fails, fall back to checking environment
                console.log("Database ping failed, using mock data");
            }
        }
        // Default to false (use mock data) if no database connection
        return false;
    } catch (error) {
        console.log("Database availability check failed, using mock data");
        return false;
    }
};

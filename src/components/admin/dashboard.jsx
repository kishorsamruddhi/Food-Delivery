import React, { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import {
    TrendingUp,
    ShoppingCart,
    DollarSign,
    Package,
    CheckCircle,
    XCircle,
    User,
    Sun,
    Moon,
    Settings,
} from 'lucide-react';
import { FaRupeeSign } from 'react-icons/fa';

const Dashboard = () => {
    const [mealData, setMealData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [refresh, setRefresh] = useState(false);
    const [darkMode, setDarkMode] = useState(false);

    const fetchMealData = async () => {
        try {
            setIsLoading(true);
            const response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=`);
            if (!response.ok) {
                throw new Error('Failed to fetch meals');
            }
            const data = await response.json();
            setMealData(data.meals || []);
            setIsLoading(false);
        } catch (err) {
            setError(err.message);
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchMealData();
    }, [refresh]);

    const totalMeals = mealData.length;
    const totalRevenue = totalMeals * 150; // ₹150 per meal
    const vegetarianMeals = mealData.filter((meal) =>
        meal.strTags?.toLowerCase().includes('vegetarian')
    ).length;

    const mealDataChart = [
        { name: 'Vegetarian', value: vegetarianMeals, color: '#6DFF33' },
        { name: 'Non-Vegetarian', value: totalMeals - vegetarianMeals, color: '#FF5733' },
    ];

    const toggleDarkMode = () => setDarkMode(!darkMode);

    return (
        <div className={darkMode ? 'dark bg-gray-900 text-white' : 'bg-white text-gray-900'}>
           

            {/* Sidebar */}
            <div className="flex">
                <aside className="fixed top-21 left-0 h-screen w-64 bg-gray-800 text-white">
                    <ul className="space-y-6 p-6">
                        {[
                            { label: 'Dashboard', icon: <TrendingUp className="h-5 w-5" /> },
                            { label: 'Orders', icon: <ShoppingCart className="h-5 w-5" /> },
                            { label: 'Products', icon: <Package className="h-5 w-5" /> },
                            { label: 'Reports', icon: <DollarSign className="h-5 w-5" /> },
                            { label: 'Settings', icon: <Settings className="h-5 w-5" /> },
                        ].map((item, index) => (
                            <li
                                key={index}
                                className="flex items-center space-x-3 hover:bg-gray-700 p-3 rounded-lg cursor-pointer"
                            >
                                {item.icon}
                                <span>{item.label}</span>
                            </li>
                        ))}
                    </ul>
                </aside>

                {/* Main Dashboard */}
                <main className="ml-64 mt-16 p-6 w-full">
                    {/* Metrics Section */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                        <div className="bg-gray-100 p-6 rounded-lg shadow-lg border-l-4 border-green-500">
                            <h3>Total Meals</h3>
                            <p className="text-3xl font-bold">{totalMeals}</p>
                        </div>
                        <div className="bg-gray-100 p-6 rounded-lg shadow-lg border-l-4 border-blue-500">
                            <h3>Total Revenue</h3>
                            <p className="text-3xl font-bold">₹{totalRevenue}</p>
                        </div>
                    </div>

                    {/* Recent Meals Table */}
                    <div className="bg-gray-100 rounded-lg shadow-lg p-6 mb-8">
                        <h2 className="text-xl font-bold mb-4">Recent Meals</h2>
                        <table className="w-full border-collapse border border-gray-300">
                            <thead>
                                <tr className="bg-gray-200">
                                    <th className="p-3 border">Name</th>
                                    <th className="p-3 border">Category</th>
                                    <th className="p-3 border">Price</th>
                                    <th className="p-3 border">Tags</th>
                                </tr>
                            </thead>
                            <tbody>
                                {mealData.slice(0, 5).map((meal, index) => (
                                    <tr
                                        key={index}
                                        className="hover:bg-gray-300 transition-colors"
                                    >
                                        <td className="p-3 border">{meal.strMeal}</td>
                                        <td className="p-3 border">{meal.strCategory || 'N/A'}</td>
                                        <td className="p-3 border">₹150</td>
                                        <td className="p-3 border">
                                            {meal.strTags || 'No Tags'}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Pie Chart */}
                    <div className="bg-gray-100 rounded-lg shadow-lg p-6">
                        <h2 className="text-xl font-bold mb-4">Meal Distribution</h2>
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    data={mealDataChart}
                                    dataKey="value"
                                    innerRadius={60}
                                    outerRadius={100}
                                    paddingAngle={5}
                                >
                                    {mealDataChart.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Dashboard;

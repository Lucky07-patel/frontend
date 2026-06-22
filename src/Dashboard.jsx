import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function Dashboard() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/leads/dashboard`,
      );

      const result = await response.json();

      if (result.success) {
        setStats(result.data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  if (!stats) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <h2 className="text-2xl font-semibold">Loading...</h2>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* Header */}

      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Lead Analytics Dashboard</h1>

        <div className="flex gap-3">
          <Link
            to="/admin"
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            View Leads
          </Link>

          <Link
            to="/"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Back To Form
          </Link>
        </div>
      </div>

      {/* Stats Cards */}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-gray-500 text-sm uppercase">Total Leads</h3>

          <p className="text-4xl font-bold mt-2">{stats.totalLeads}</p>
        </div>

        <div className="bg-red-100 p-6 rounded-lg shadow">
          <h3 className="text-red-700 text-sm uppercase">Hot Leads</h3>

          <p className="text-4xl font-bold text-red-600 mt-2">
            {stats.hotLeads}
          </p>

          <p className="mt-2 font-medium">{stats.hotPercentage}%</p>
        </div>

        <div className="bg-yellow-100 p-6 rounded-lg shadow">
          <h3 className="text-yellow-800 text-sm uppercase">Warm Leads</h3>

          <p className="text-4xl font-bold text-yellow-700 mt-2">
            {stats.warmLeads}
          </p>

          <p className="mt-2 font-medium">{stats.warmPercentage}%</p>
        </div>

        <div className="bg-blue-100 p-6 rounded-lg shadow">
          <h3 className="text-blue-700 text-sm uppercase">Cold Leads</h3>

          <p className="text-4xl font-bold text-blue-600 mt-2">
            {stats.coldLeads}
          </p>

          <p className="mt-2 font-medium">{stats.coldPercentage}%</p>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;

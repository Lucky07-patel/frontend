import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function Admin() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(false);

  const [search, setSearch] = useState("");
  const [sortField, setSortField] = useState("created_at");
  const [sortOrder, setSortOrder] = useState("desc");

  const [currentPage, setCurrentPage] = useState(1);
  const leadsPerPage = 5;

  const fetchLeads = async () => {
    try {
      setLoading(true);

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/leads?search=${search}&sortBy=${sortField}&order=${sortOrder}`,
      );

      const result = await response.json();

      if (result.success) {
        setLeads(result.data);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchLeads();
    }, 300);

    return () => clearTimeout(timer);
  }, [search, sortField, sortOrder]);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  const getScoreColor = (score) => {
    switch (score) {
      case "Hot":
        return "bg-red-100 text-red-600";

      case "Warm":
        return "bg-yellow-100 text-yellow-700";

      case "Cold":
        return "bg-blue-100 text-blue-700";

      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const indexOfLastLead = currentPage * leadsPerPage;
  const indexOfFirstLead = indexOfLastLead - leadsPerPage;

  const currentLeads = leads.slice(indexOfFirstLead, indexOfLastLead);

  const totalPages = Math.ceil(leads.length / leadsPerPage);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Lead Management Dashboard</h1>

        <Link
          to="/"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Back To Form
        </Link>
      </div>

      {/* Search Box */}

      <div className="mb-5">
        <input
          type="text"
          placeholder="Search by name or email..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1);
          }}
          className="w-full max-w-md border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {loading ? (
        <div className="text-center text-xl font-semibold">Loading...</div>
      ) : (
        <>
          <div className="overflow-x-auto bg-white shadow rounded-lg">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-900 text-white">
                  <th
                    onClick={() => handleSort("full_name")}
                    className="p-4 text-left cursor-pointer"
                  >
                    Name{" "}
                    {sortField === "full_name" &&
                      (sortOrder === "asc" ? "↑" : "↓")}
                  </th>

                  <th
                    onClick={() => handleSort("email")}
                    className="p-4 text-left cursor-pointer"
                  >
                    Email{" "}
                    {sortField === "email" && (sortOrder === "asc" ? "↑" : "↓")}
                  </th>

                  <th className="p-4 text-left">Business</th>

                  <th className="p-4 text-left">AI Score</th>

                  <th className="p-4 text-left">Generated Email Draft</th>
                </tr>
              </thead>

              <tbody>
                {currentLeads.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="text-center p-6">
                      No Leads Found
                    </td>
                  </tr>
                ) : (
                  currentLeads.map((lead) => (
                    <tr key={lead.id} className="border-b hover:bg-gray-50">
                      <td className="p-4">{lead.full_name}</td>

                      <td className="p-4">{lead.email}</td>

                      <td className="p-4">{lead.business_name}</td>

                      <td className="p-4">
                        <span
                          className={`px-3 py-1 rounded-full font-semibold ${getScoreColor(
                            lead.ai_score,
                          )}`}
                        >
                          {lead.ai_score || "Pending"}
                        </span>
                      </td>

                      <td className="p-4 max-w-md whitespace-pre-wrap">
                        {lead.ai_email_draft || "Email not generated"}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}

          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-4 mt-6">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((prev) => prev - 1)}
                className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
              >
                Previous
              </button>

              <span className="font-semibold">
                Page {currentPage} of {totalPages}
              </span>

              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((prev) => prev + 1)}
                className="px-4 py-2 bg-gray-900 text-white rounded disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default Admin;

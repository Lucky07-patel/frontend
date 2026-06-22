import { useEffect, useState } from "react";

function App() {
  const [page, setPage] = useState("form");

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    businessName: "",
    message: "",
  });

  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState("");

  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchLeads = async () => {
    try {
      setLoading(true);

      const response = await fetch("http://localhost:5000/leads");
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
    if (page === "admin") {
      fetchLeads();
    }
  }, [page]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

    setErrors({
      ...errors,
      [e.target.name]: "",
    });
  };

  const validateForm = () => {
    let newErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Enter valid email";
    }

    if (!formData.businessName.trim()) {
      newErrors.businessName = "Business name is required";
    }

    if (!formData.message.trim()) {
      newErrors.message = "Message is required";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      const response = await fetch("http://localhost:5000/leads", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (!response.ok) {
        setErrors({
          api: result.message,
        });
        return;
      }

      setSuccess("Lead submitted successfully!");

      setFormData({
        fullName: "",
        email: "",
        businessName: "",
        message: "",
      });
    } catch (error) {
      setErrors({
        api: "Server Error",
      });
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

  if (page === "admin") {
    return (
      <div className="min-h-screen bg-gray-100 p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">
            Lead Management Dashboard
          </h1>

          <button
            onClick={() => setPage("form")}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Back To Form
          </button>
        </div>

        {loading ? (
          <h2>Loading...</h2>
        ) : (
          <div className="overflow-x-auto bg-white shadow rounded-lg">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-900 text-white">
                  <th className="p-4 text-left">Name</th>
                  <th className="p-4 text-left">Email</th>
                  <th className="p-4 text-left">Business</th>
                  <th className="p-4 text-left">AI Score</th>
                  <th className="p-4 text-left">
                    Generated Email Draft
                  </th>
                </tr>
              </thead>

              <tbody>
                {leads.map((lead) => (
                  <tr
                    key={lead.id}
                    className="border-b hover:bg-gray-50"
                  >
                    <td className="p-4">
                      {lead.full_name}
                    </td>

                    <td className="p-4">
                      {lead.email}
                    </td>

                    <td className="p-4">
                      {lead.business_name}
                    </td>

                    <td className="p-4">
                      <span
                        className={`px-3 py-1 rounded-full font-semibold ${getScoreColor(
                          lead.ai_score
                        )}`}
                      >
                        {lead.ai_score || "Pending"}
                      </span>
                    </td>

                    <td className="p-4 max-w-md whitespace-pre-wrap">
                      {lead.ai_email_draft ||
                        "Email not generated"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center px-4">
      <div className="absolute top-5 right-5">
        <button
          onClick={() => setPage("admin")}
          className="bg-gray-900 text-white px-4 py-2 rounded"
        >
          View Leads
        </button>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md"
      >
        <h1 className="text-2xl font-bold text-center mb-6">
          Lead Capture Form
        </h1>

        {success && (
          <p className="bg-green-100 text-green-700 p-3 rounded mb-4">
            {success}
          </p>
        )}

        {errors.api && (
          <p className="bg-red-100 text-red-700 p-3 rounded mb-4">
            {errors.api}
          </p>
        )}

        <input
          type="text"
          name="fullName"
          placeholder="Full Name"
          value={formData.fullName}
          onChange={handleChange}
          className="w-full border p-3 rounded mb-2"
        />
        <p className="text-red-500 text-sm mb-2">
          {errors.fullName}
        </p>

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          className="w-full border p-3 rounded mb-2"
        />
        <p className="text-red-500 text-sm mb-2">
          {errors.email}
        </p>

        <input
          type="text"
          name="businessName"
          placeholder="Business Name"
          value={formData.businessName}
          onChange={handleChange}
          className="w-full border p-3 rounded mb-2"
        />
        <p className="text-red-500 text-sm mb-2">
          {errors.businessName}
        </p>

        <textarea
          rows="4"
          name="message"
          placeholder="Message"
          value={formData.message}
          onChange={handleChange}
          className="w-full border p-3 rounded mb-2"
        />

        <p className="text-red-500 text-sm mb-2">
          {errors.message}
        </p>

        <button className="w-full bg-blue-600 text-white py-3 rounded hover:bg-blue-700">
          Submit
        </button>
      </form>
    </div>
  );
}

export default App;
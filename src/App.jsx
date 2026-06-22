import { useState } from "react";
import { Link } from "react-router-dom";

function App() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    businessName: "",
    message: "",
  });

  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

    setErrors({
      ...errors,
      [e.target.name]: "",
      api: "",
    });

    setSuccess("");
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
    setSuccess("");

    if (!validateForm()) return;

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/leads`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (!response.ok) {
        setErrors({
          api: result.message || "Something went wrong",
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

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center px-4">
      <div className="absolute top-5 right-5 flex gap-3">
        <Link
          to="/admin"
          className="bg-gray-900 text-white px-4 py-2 rounded hover:bg-gray-700"
        >
          View Leads
        </Link>

        <Link
          to="/dashboard"
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Dashboard
        </Link>
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
        <p className="text-red-500 text-sm mb-2">{errors.fullName}</p>

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          className="w-full border p-3 rounded mb-2"
        />
        <p className="text-red-500 text-sm mb-2">{errors.email}</p>

        <input
          type="text"
          name="businessName"
          placeholder="Business Name"
          value={formData.businessName}
          onChange={handleChange}
          className="w-full border p-3 rounded mb-2"
        />
        <p className="text-red-500 text-sm mb-2">{errors.businessName}</p>

        <textarea
          rows="4"
          name="message"
          placeholder="Message"
          value={formData.message}
          onChange={handleChange}
          className="w-full border p-3 rounded mb-2"
        />

        <p className="text-red-500 text-sm mb-2">{errors.message}</p>

        <button className="w-full bg-blue-600 text-white py-3 rounded hover:bg-blue-700">
          Submit
        </button>
      </form>
    </div>
  );
}

export default App;

import { useEffect, useState } from "react";

function Admin() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchLeads = async () => {
    try {
      const response = await fetch("http://localhost:5000/leads");
      const result = await response.json();

      if (result.success) {
        setLeads(result.data);
      }
    } catch (error) {
      console.log("Error fetching leads:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  const getScoreClass = (score) => {
    if (score === "Hot") return "score hot";
    if (score === "Warm") return "score warm";
    if (score === "Cold") return "score cold";
    return "score pending";
  };

  if (loading) {
    return <h2 className="loading">Loading leads...</h2>;
  }

  return (
    <div className="admin-page">
      <h1>Admin Panel - Submitted Leads</h1>

      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Business</th>
              <th>Message</th>
              <th>AI Score</th>
              <th>Reason</th>
              <th>Email Draft</th>
            </tr>
          </thead>

          <tbody>
            {leads.map((lead) => (
              <tr key={lead.id}>
                <td>{lead.full_name}</td>
                <td>{lead.email}</td>
                <td>{lead.business_name}</td>
                <td>{lead.message}</td>
                <td>
                  <span className={getScoreClass(lead.ai_score)}>
                    {lead.ai_score || "Pending"}
                  </span>
                </td>
                <td>{lead.ai_reason || "Not generated"}</td>
                <td className="email-draft">
                  {lead.ai_email_draft || "Not generated"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Admin;
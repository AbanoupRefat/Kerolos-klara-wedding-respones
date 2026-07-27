import { useState, useEffect } from "react";
import { FiChevronLeft, FiChevronRight, FiRefreshCw } from "react-icons/fi";
import "./ResponsesDashboard.css";

export default function ResponsesDashboard() {
  const [responses, setResponses] = useState([]);
  const [status, setStatus] = useState("loading"); // loading, success, error
  const [page, setPage] = useState(1);
  const itemsPerPage = 12;

  const fetchResponses = async () => {
    setStatus("loading");
    try {
      const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxnHHw3fhpKvm5uf4rwelIBYiagXfqs0XCL18oIS8-6AnDARX_vedw86aNHKrRSfBjI/exec";
      const response = await fetch(GOOGLE_SCRIPT_URL);
      
      const text = await response.text();
      let data = [];
      try {
        data = JSON.parse(text);
      } catch (err) {
        throw new Error("Invalid response format. Google Script might not have doGet() yet.");
      }

      // Filter out empty rows (where name and message are both blank)
      const validResponses = data.filter(res => {
        const hasName = (res.name || res.Name || "").toString().trim() !== "";
        const hasMessage = (res.message || res.Message || "").toString().trim() !== "";
        return hasName || hasMessage;
      });

      setResponses(validResponses.reverse()); // Newest first
      setStatus("success");
    } catch (error) {
      console.error(error);
      setStatus("error");
    }
  };

  useEffect(() => {
    fetchResponses();
  }, []);

  const totalPages = Math.ceil(responses.length / itemsPerPage);
  const currentResponses = responses.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  const handlePrev = () => setPage((p) => Math.max(1, p - 1));
  const handleNext = () => setPage((p) => Math.min(totalPages, p + 1));

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h2 className="dashboard-title">Guestbook Responses</h2>
        
        <div className="header-actions">
          {status === "success" && responses.length > 0 && (
            <div className="modern-pagination">
              <button className="icon-btn" onClick={handlePrev} disabled={page === 1} aria-label="Previous Page">
                <FiChevronLeft aria-hidden="true" />
              </button>
              <div className="page-pill">
                <span>{page}</span> / <span>{totalPages || 1}</span>
              </div>
              <button className="icon-btn" onClick={handleNext} disabled={page >= totalPages} aria-label="Next Page">
                <FiChevronRight aria-hidden="true" />
              </button>
            </div>
          )}

          <button className="btn-outline refresh-btn" onClick={fetchResponses} disabled={status === "loading"}>
            <FiRefreshCw className={status === "loading" ? "spin" : ""} aria-hidden="true" />
            Refresh
          </button>
        </div>
      </div>

      {status === "loading" && <div className="status-message">Loading responses...</div>}
      {status === "error" && (
        <div className="status-message error">
          Failed to load responses. Please ensure the Google Script has the `doGet` function added.
        </div>
      )}

      {status === "success" && responses.length === 0 && (
        <div className="status-message">No responses found yet.</div>
      )}

      {status === "success" && responses.length > 0 && (
        <>
          <div className="responses-grid">
            {currentResponses.map((res, index) => (
              <div key={index} className="response-card">
                <div className="response-header">
                  <h3 className="response-name">{res.name || "Guest"}</h3>
                  <span className="response-date">
                    {res.timestamp ? new Date(res.timestamp).toLocaleDateString() : ""}
                  </span>
                </div>
                <p className="response-message">{res.message || res.Message}</p>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

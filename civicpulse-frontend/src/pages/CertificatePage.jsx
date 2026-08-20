import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import { getCertificateById } from "../services/certificateService";

import CertificateTemplate from "../components/CertificateTemplate";

import indiaLogo from "../assets/india-logo.png";

export default function CertificatePage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [certificate, setCertificate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadCertificate();
  }, [id]);

  const loadCertificate = async () => {
    try {
      setLoading(true);

      const data =
        await getCertificateById(id);

      setCertificate(data);
    } catch (err) {
      console.error(
        "Failed to load certificate:",
        err
      );

      setError(
        "Unable to load certificate."
      );
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "Arial",
        }}
      >
        <h2>Loading certificate...</h2>
      </div>
    );
  }

  if (error || !certificate) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "Arial",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <h2>Certificate Not Found</h2>

          <p>{error}</p>

          <button
            onClick={() => navigate(-1)}
            style={{
              padding: "10px 22px",
              border: "none",
              borderRadius: "6px",
              background: "#173F6F",
              color: "white",
              cursor: "pointer",
            }}
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div
        className="certificate-controls"
        style={{
          padding: "16px 20px",
          display: "flex",
          justifyContent: "space-between",
          background: "#f3f5f8",
        }}
      >
        <button
          onClick={() => navigate(-1)}
          style={{
            padding: "10px 20px",
            background: "white",
            border:
              "1px solid #173F6F",
            borderRadius: "6px",
            color: "#173F6F",
            cursor: "pointer",
          }}
        >
          ← Back
        </button>

        <button
          onClick={handlePrint}
          style={{
            padding: "10px 24px",
            border: "none",
            borderRadius: "6px",
            background: "#173F6F",
            color: "white",
            cursor: "pointer",
            fontWeight: 600,
          }}
        >
          🖨 Print Certificate
        </button>
      </div>

      <div
        style={{
          background: "#e5e7eb",
          padding: "25px 0",
        }}
      >
        <CertificateTemplate
          certificate={certificate}
          logo={indiaLogo}
          printable
        />
      </div>

      <style>{`
        @media print {
          @page {
            size: A4;
            margin: 0;
          }

          html,
          body {
            margin: 0 !important;
            padding: 0 !important;
            background: white !important;
          }

          .certificate-controls {
            display: none !important;
          }

          .certificate-page {
            margin: 0 !important;
          }
        }
      `}</style>
    </>
  );
}
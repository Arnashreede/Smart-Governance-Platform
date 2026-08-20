import React from "react";

const getCertificateConfig = (serviceName = "") => {
  const type = serviceName.toLowerCase().trim();

  if (type.includes("domicile")) {
    return {
      title: "DOMICILE CERTIFICATE",
      subtitle: "Certificate of Domicile / Permanent Residence Record",
      introduction:
        "This is to certify that the following citizen record is maintained in the civic administrative system:",
      statement:
        "The above-named citizen is recorded in the administrative service system in connection with the domicile certificate service. This certificate represents the corresponding digitally issued certificate record.",
      sectionTitle: "Domicile Certificate Record",
      sectionText:
        "The certificate confirms the registered citizen details associated with the domicile service and remains subject to the validity period shown above.",
    };
  }

  if (type.includes("residence")) {
    return {
      title: "RESIDENCE CERTIFICATE",
      subtitle: "Certificate of Residential Record",
      introduction:
        "This is to certify that the following citizen record is maintained for residential service purposes:",
      statement:
        "The above-named citizen is recorded in the administrative service system for the residence certificate service.",
      sectionTitle: "Residential Record",
      sectionText:
        "The certificate records the residential service associated with the citizen and is valid for the period specified above.",
    };
  }

  if (type.includes("income")) {
    return {
      title: "INCOME CERTIFICATE",
      subtitle: "Certificate of Income Record",
      introduction:
        "This is to certify that the following citizen record has been processed under the income certificate service:",
      statement:
        "The above-named citizen has an income certificate record maintained in the administrative service system.",
      sectionTitle: "Income Certificate Record",
      sectionText:
        "This certificate corresponds to the income-related service application and its digitally issued certificate record.",
    };
  }

  if (type.includes("birth")) {
    return {
      title: "BIRTH CERTIFICATE",
      subtitle: "Certificate of Birth Record",
      introduction:
        "This is to certify that the following citizen record is associated with the birth certificate service:",
      statement:
        "The above-named citizen has a birth certificate record maintained through the administrative certificate service.",
      sectionTitle: "Birth Record",
      sectionText:
        "This certificate represents the digitally issued birth-record certificate associated with the citizen service account.",
    };
  }

  if (type.includes("death")) {
    return {
      title: "DEATH CERTIFICATE",
      subtitle: "Certificate of Death Record",
      introduction:
        "This is to certify that the following certificate record has been issued through the death certificate service:",
      statement:
        "The certificate record associated with this service has been digitally generated and registered in the certificate management system.",
      sectionTitle: "Death Certificate Record",
      sectionText:
        "The certificate number, issue date and verification information identify this certificate record within the platform.",
    };
  }

  if (type.includes("trade")) {
    return {
      title: "TRADE LICENSE",
      subtitle: "Certificate of Trade / Commercial Service Record",
      introduction:
        "This is to certify that the following citizen service record has been processed under the trade licensing service:",
      statement:
        "The above-named citizen has a certificate record associated with the trade licensing service maintained by the administrative system.",
      sectionTitle: "Trade License Record",
      sectionText:
        "This certificate corresponds to the digitally issued trade-license service record and its stated validity period.",
    };
  }

  return {
    title: serviceName
      ? serviceName.toUpperCase()
      : "CERTIFICATE",
    subtitle: "Certificate of Official Administrative Record",
    introduction:
      "This is to certify that the following citizen record has been processed through the administrative service:",
    statement:
      "The above-named citizen has a digitally issued certificate record associated with the service identified above.",
    sectionTitle: "Administrative Certificate Record",
    sectionText:
      "This certificate represents the corresponding digitally issued service record maintained by the platform.",
  };
};

export default function CertificateTemplate({
  certificate,
  logo,
  printable = false,
}) {
  const config = getCertificateConfig(
    certificate?.serviceName
  );

  const citizenName =
    certificate?.citizenName ||
    localStorage.getItem("fullName") ||
    "Citizen";

  return (
    <>
      <div
        className="certificate-page"
        style={{
          width: "210mm",
          height: "297mm",
          margin: "0 auto",
          padding: "14mm",
          position: "relative",
          overflow: "hidden",
          background: "#fffdf7",
          fontFamily:
            "'Times New Roman', Georgia, serif",
          color: "#263238",
          boxSizing: "border-box",
        }}
      >
        {/* OUTER BORDER */}
        <div
          style={{
            position: "absolute",
            top: "7mm",
            left: "7mm",
            right: "7mm",
            bottom: "7mm",
            border: "3px solid #173F6F",
            pointerEvents: "none",
          }}
        />

        {/* INNER BORDER */}
        <div
          style={{
            position: "absolute",
            top: "10mm",
            left: "10mm",
            right: "10mm",
            bottom: "10mm",
            border: "1px solid #B18B35",
            pointerEvents: "none",
          }}
        />

        <div
          style={{
            position: "relative",
            zIndex: 2,
          }}
        >
          {/* HEADER */}
          <div
            style={{
              textAlign: "center",
              paddingBottom: "14px",
              borderBottom:
                "2px solid #173F6F",
            }}
          >
            <img
              src={logo}
              alt="India"
              style={{
                width: "175px",
                maxHeight: "65px",
                objectFit: "contain",
                display: "block",
                margin: "0 auto 10px",
              }}
            />

            <div
              style={{
                fontFamily: "Arial, sans-serif",
                fontSize: "18px",
                fontWeight: 800,
                letterSpacing: "1.6px",
              }}
            >
              SMART GOVERNANCE PLATFORM
            </div>

            <div
              style={{
                fontFamily: "Arial, sans-serif",
                fontSize: "11px",
                marginTop: "5px",
                color: "#555",
                letterSpacing: "1px",
              }}
            >
              DIGITAL CITIZEN SERVICES
            </div>

            <div
              style={{
                fontSize: "27px",
                fontWeight: 900,
                letterSpacing: "1px",
                color: "#173F6F",
                marginTop: "16px",
              }}
            >
              {config.title}
            </div>

            <div
              style={{
                fontSize: "10px",
                color: "#666",
                marginTop: "5px",
              }}
            >
              {config.subtitle}
            </div>
          </div>

          {/* META */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "30px",
              marginTop: "20px",
            }}
          >
            <div>
              <div
                style={{
                  fontFamily: "Arial, sans-serif",
                  fontSize: "9px",
                  color: "#777",
                }}
              >
                CERTIFICATE NUMBER
              </div>
              <div
                style={{
                  fontFamily: "Arial, sans-serif",
                  fontSize: "12px",
                  fontWeight: 800,
                  marginTop: "2px",
                }}
              >
                {certificate?.certificateNumber ||
                  "N/A"}
              </div>
            </div>

            <div
              style={{
                textAlign: "right",
              }}
            >
              <div
                style={{
                  fontFamily: "Arial, sans-serif",
                  fontSize: "9px",
                  color: "#777",
                }}
              >
                VERIFICATION CODE
              </div>
              <div
                style={{
                  fontFamily:
                    "Consolas, monospace",
                  fontSize: "10px",
                  fontWeight: 700,
                  marginTop: "2px",
                  wordBreak: "break-all",
                }}
              >
                {certificate?.verificationCode ||
                  "N/A"}
              </div>
            </div>
          </div>

          {/* INTRODUCTION */}
          <div
            style={{
              marginTop: "28px",
              textAlign: "center",
            }}
          >
            <div
              style={{
                fontSize: "14px",
                lineHeight: 1.7,
              }}
            >
              {config.introduction}
            </div>

            <div
              style={{
                fontSize: "28px",
                fontWeight: 900,
                letterSpacing: "1px",
                textTransform: "uppercase",
                color: "#263238",
                marginTop: "7px",
              }}
            >
              {citizenName}
            </div>

            <div
              style={{
                width: "60%",
                borderBottom:
                  "1px solid #444",
                margin: "8px auto 0",
              }}
            />
          </div>

          {/* STATEMENT */}
          <div
            style={{
              marginTop: "24px",
              fontSize: "13px",
              lineHeight: 1.8,
              textAlign: "justify",
            }}
          >
            {config.statement}
          </div>

          {/* DETAILS */}
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              marginTop: "23px",
              fontSize: "12px",
            }}
          >
            <tbody>
              <DetailRow
                label="Citizen Name"
                value={citizenName}
              />

              <DetailRow
                label="Certificate Type"
                value={
                  certificate?.serviceName
                }
              />

              <DetailRow
                label="Issuing Department"
                value={
                  certificate?.departmentName
                }
              />

              <DetailRow
                label="Certificate Number"
                value={
                  certificate?.certificateNumber
                }
              />

              <DetailRow
                label="Issue Date"
                value={
                  certificate?.issueDate
                }
              />

              <DetailRow
                label="Valid Till"
                value={
                  certificate?.validTill
                }
              />

              <DetailRow
                label="Issuing Authority"
                value={
                  certificate?.officerName ||
                  "Certifying Authority"
                }
              />
            </tbody>
          </table>

          {/* SERVICE SECTION */}
          <div
            style={{
              marginTop: "16px",
              padding: "11px 13px",
              background: "#f7f8fa",
              borderLeft:
                "4px solid #B18B35",
            }}
          >
            <div
              style={{
                fontSize: "12px",
                fontWeight: 800,
                color: "#173F6F",
                marginBottom: "4px",
              }}
            >
              {config.sectionTitle}
            </div>

            <div
              style={{
                fontFamily: "Arial, sans-serif",
                fontSize: "10px",
                lineHeight: 1.6,
              }}
            >
              {config.sectionText}
            </div>
          </div>

          {/* VERIFICATION */}
          <div
            style={{
              marginTop: "15px",
              padding: "10px 13px",
              border:
                "1px solid #dddddd",
              background: "#fafafa",
            }}
          >
            <div
              style={{
                fontSize: "12px",
                fontWeight: 800,
                color: "#173F6F",
                marginBottom: "4px",
              }}
            >
              Certificate Verification
            </div>

            <div
              style={{
                fontFamily: "Arial, sans-serif",
                fontSize: "10px",
                lineHeight: 1.6,
              }}
            >
              This certificate may be verified using
              the certificate number and verification
              code shown above through the Smart
              Governance Platform.
            </div>
          </div>

          {/* SIGNATURES */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "1fr 1fr 1fr",
              gap: "35px",
              alignItems: "end",
              marginTop: "35px",
            }}
          >
            <div
              style={{
                textAlign: "center",
              }}
            >
              <div
                style={{
                  height: "38px",
                  borderBottom:
                    "1px solid #444",
                }}
              />

              <div
                style={{
                  fontFamily: "Arial, sans-serif",
                  fontSize: "10px",
                  fontWeight: 700,
                  marginTop: "5px",
                }}
              >
                Citizen
              </div>

              <div
                style={{
                  fontFamily: "Arial, sans-serif",
                  fontSize: "8px",
                  color: "#777",
                }}
              >
                Signature
              </div>
            </div>

            <div
              style={{
                display: "flex",
                justifyContent:
                  "center",
              }}
            >
              <div
                style={{
                  width: "70px",
                  height: "70px",
                  border:
                    "2px solid #173F6F",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  textAlign: "center",
                  fontFamily:
                    "Arial, sans-serif",
                  fontSize: "8px",
                  fontWeight: 900,
                  lineHeight: 1.3,
                  color: "#173F6F",
                }}
              >
                AUTHORIZED
                <br />
                OFFICE
                <br />
                SEAL
              </div>
            </div>

            <div
              style={{
                textAlign: "center",
              }}
            >
              <div
                style={{
                  height: "38px",
                  borderBottom:
                    "1px solid #444",
                }}
              />

              <div
                style={{
                  fontFamily: "Arial, sans-serif",
                  fontSize: "10px",
                  fontWeight: 700,
                  marginTop: "5px",
                }}
              >
                {certificate?.officerName ||
                  "Certifying Authority"}
              </div>

              <div
                style={{
                  fontFamily: "Arial, sans-serif",
                  fontSize: "8px",
                  color: "#777",
                }}
              >
                Issuing Authority
              </div>
            </div>
          </div>

          {/* FOOTER */}
          <div
            style={{
              marginTop: "20px",
              paddingTop: "8px",
              borderTop:
                "1px solid #bbb",
              textAlign: "center",
              fontFamily:
                "Arial, sans-serif",
              color: "#777",
            }}
          >
            <div style={{ fontSize: "9px" }}>
              Issuing Department:{" "}
              {certificate?.departmentName ||
                "N/A"}
            </div>

            <div
              style={{
                fontSize: "8px",
                marginTop: "3px",
              }}
            >
              Certificate ID:{" "}
              {certificate?.certificateId ||
                "N/A"}
            </div>

            <div
              style={{
                fontSize: "8px",
                marginTop: "3px",
              }}
            >
              Digitally generated through the
              Smart Governance Platform
            </div>
          </div>
        </div>
      </div>

      {printable && (
        <style>{`
          @page {
            size: A4;
            margin: 0;
          }

          html,
          body {
            margin: 0 !important;
            padding: 0 !important;
            width: 210mm;
            height: 297mm;
            background: white !important;
          }

          .certificate-page {
            width: 210mm !important;
            height: 297mm !important;
            margin: 0 !important;
            overflow: hidden !important;
          }
        `}</style>
      )}
    </>
  );
}

function DetailRow({ label, value }) {
  return (
    <tr>
      <td
        style={{
          width: "38%",
          padding: "8px 10px",
          fontWeight: 700,
          color: "#173F6F",
          background: "#fafafa",
          borderBottom:
            "1px solid #ddd",
        }}
      >
        {label}
      </td>

      <td
        style={{
          padding: "8px 10px",
          borderBottom:
            "1px solid #ddd",
        }}
      >
        {value || "N/A"}
      </td>
    </tr>
  );
}
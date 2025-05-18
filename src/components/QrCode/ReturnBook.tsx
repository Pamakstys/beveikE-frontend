import { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router";
import { Html5QrcodeScanner } from "html5-qrcode";
import { Box, Button, Typography } from "@mui/material";
const apiUrl = import.meta.env.VITE_API_BASE_URL;

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export default function ReturnBook() {
  const query = useQuery();
  const orderId = query.get("id");
  const [step, setStep] = useState<"idle" | "scanning">("idle");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const processingRef = useRef(false);
  const scannerRef = useRef<Html5QrcodeScanner | null>(null);
  const userId = localStorage.getItem("id");
  const navigate = useNavigate();
  useEffect(() => {
    if (!orderId) {
      setError("Order ID is missing in URL");
      return;
    }
  }, [orderId]);

  useEffect(() => {
    if (step !== "scanning") return;

    const scanner = new Html5QrcodeScanner(
      "qr-reader",
      { fps: 10, qrbox: { width: 250, height: 250 } },
      false
    );
    scannerRef.current = scanner;

    scanner.render(
      async (decodedText) => {
        if (processingRef.current) return;
        processingRef.current = true;
        try {
          const parsed = JSON.parse(decodedText);

          if (parsed.type !== "bookcase" || !parsed.id)
            throw new Error("Invalid bookcase QR");
          if (!userId) throw new Error("User not logged in");

          const res = await fetch(`${apiUrl}/Order/return-book`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              orderId: Number(orderId),
              userId: userId,
              bookcaseId: parsed.id,
            }),
          });

          if (!res.ok) {
            const errText = await res.text();
            throw new Error(errText || "Failed to return book");
          }

          setSuccessMessage("Book returned successfully!");
          navigate("/orders");
          setStep("idle");
          scanner.clear();
          setError("");
        } catch (err: any) {
          setError(err.message || "QR Processing Error");
        } finally {
          processingRef.current = false;
        }
      },
      () => {}
    );

    return () => {
      scanner.clear().catch(() => {});
      processingRef.current = false;
    };
  }, [step, orderId]);

  return (
    <Box paddingTop={2}>
      <Typography variant="h6" gutterBottom>
        Return Book : Order {orderId}
      </Typography>
      {step === "idle" && orderId && (
        <Button
          variant="contained"
          onClick={() => {
            setError("");
            setSuccessMessage("");
            setStep("scanning");
          }}
        >
          Scan Bookcase QR
        </Button>
      )}

      {step === "scanning" && (
        <div id="qr-reader" style={{ width: "300px", marginTop: "16px" }} />
      )}

      <Box marginTop={2}>
        {!orderId && (
          <Typography color="error" mb={2}>
            Order id is missing in URL
          </Typography>
        )}

        {successMessage && (
          <Typography color="success.main" mb={2}>
            {successMessage}
          </Typography>
        )}

        {error && (
          <Typography color="error" mb={2}>
            {error}
          </Typography>
        )}
      </Box>
    </Box>
  );
}

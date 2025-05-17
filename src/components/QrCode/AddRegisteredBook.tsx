import { useEffect, useState, useRef } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import {
  Box,
  Button,
  Typography,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";

const apiUrl = import.meta.env.VITE_API_BASE_URL;

export default function AddRegisteredBook() {
  const [step, setStep] = useState<
    "idle" | "scanningBook" | "scanningBookcase"
  >("idle");
  const [bookId, setBookId] = useState<number | null>(null);
  const [compatibleBookcases, setCompatibleBookcases] = useState<any[]>([]);
  const [error, setError] = useState("");
  const processingRef = useRef(false);
  const scannerRef = useRef<Html5QrcodeScanner | null>(null);

  useEffect(() => {
    if (step === "idle") return;

    const scanner = new Html5QrcodeScanner(
      "qr-reader",
      {
        fps: 10,
        qrbox: { width: 250, height: 250 },
      },
      false
    );
    scannerRef.current = scanner;

    scanner.render(
      async (decodedText) => {
        if (processingRef.current) return;
        processingRef.current = true;
        try {
          const parsed = JSON.parse(decodedText);

          if (step === "scanningBook") {
            if (parsed.type !== "book" || !parsed.id)
              throw new Error("Invalid book QR");

            const res = await fetch(
              `${apiUrl}/bookcase/get-compatible-bookcases`,
              {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id: parsed.id }),
              }
            );

            if (!res.ok)
              throw new Error("Failed to fetch compatible bookcases");

            const data = await res.json();
            setBookId(parsed.id);
            setCompatibleBookcases(data);
            setStep("idle");
            scanner.clear();
          }

          if (step === "scanningBookcase") {
            if (parsed.type !== "bookcase" || !parsed.id)
              throw new Error("Invalid bookcase QR");

            if (!bookId) throw new Error("Book not scanned yet");
            const matched = compatibleBookcases.find(
              (b) => String(b.id_Lentyna) === String(parsed.id)
            );
            if (!matched) throw new Error("This bookcase is not compatible");

            const res = await fetch(`${apiUrl}/bookcase/place-book`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ BookId: bookId, BookcaseId: parsed.id }),
            });

            if (!res.ok) throw new Error("Failed to place book");

            alert("Book placed successfully!");
            setStep("idle");
            scanner.clear();
            setCompatibleBookcases([]);
            setBookId(null);
            setError("");
          }

          setError("");
        } catch (err: any) {
          console.error("QR Processing Error:", err);
          setError(err.message || "Invalid QR or server error");
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
  }, [step]);

  return (
    <Box paddingTop={2}>
      <Typography variant="h6" gutterBottom>
        Pridėti Knygą į Lentyną
      </Typography>

      {step === "idle" && !bookId && (
        <Box mb={2}>
          <Button
            variant="contained"
            onClick={() => {
              setError("");
              setStep("scanningBook");
            }}
          >
            Skenuoti Knygos QR
          </Button>
        </Box>
      )}
      {bookId && compatibleBookcases.length > 0 && (
        <Box>
          <Button
            variant="contained"
            sx={{ ml: 2 }}
            onClick={() => {
              setError("");
              setStep("scanningBookcase");
            }}
          >
            Scan Pasirinktos Lentynos QR
          </Button>
          <p>Lentyna turi būti viena iš parodytų</p>

        </Box>
      )}

      {step !== "idle" && (
        <div id="qr-reader" style={{ width: "300px", marginTop: "16px" }} />
      )}

      {error && (
        <Typography color="error" mt={2}>
          {error}
        </Typography>
      )}

      {compatibleBookcases.length > 0 && (
        <Box mt={3}>
          <Typography variant="h6">Compatible Bookcases:</Typography>
          <List>
            {compatibleBookcases.map((b: any) => (
              <ListItem key={b.id_Lentyna}>
                <ListItemText
                  primary={`ID: ${b.id_Lentyna}`}
                  secondary={`Size: ${b.ilgis}x${b.aukštis}x${b.plotis} cm`}
                />
              </ListItem>
            ))}
          </List>
        </Box>
      )}
    </Box>
  );
}

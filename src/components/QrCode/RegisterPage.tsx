import { useLocation, useNavigate } from "react-router";
import { Box, Typography, Button, Stack } from "@mui/material";
import { useState, useRef } from "react";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const RegisterPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const id = searchParams.get("id");
  const type = searchParams.get("type") || "unknown";

  const qrData = JSON.stringify({ id: id, type: type });
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(
    qrData
  )}&size=200x200`;

  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isRegistered, setIsRegistered] = useState<boolean | null>(null);

  const printContainerRef = useRef<HTMLDivElement>(null);
  const information = useRef<HTMLDivElement>(null);

  const handlePrintQr = () => {
    if (!printContainerRef.current || !information.current) return;

    information.current.style.display = "none";

    window.print();

    setShowConfirmation(true);
  };

  const handleConfirmation = (printed: boolean) => {
    if (printed) {
      fetch(`${API_BASE_URL}/books/register-book/`, {
        method: "POST",
        body: JSON.stringify({ id: id }),
        headers: { "Content-Type": "application/json" },
      })
        .then(() => {
          setIsRegistered(true);
          navigate("/unregistered-books");
        })
        .catch(() => {
          setIsRegistered(false);
        });
    }

    setShowConfirmation(false);
  };

  const renderPrintPage = () => (
    <Box p={3}>
      <div ref={information}>
        <Typography variant="h5" mb={2}>
          Register {type.charAt(0).toUpperCase() + type.slice(1)} QR
        </Typography>
        <Typography mb={1}>ID: {id}</Typography>
        <Typography mb={3}>Type: {type}</Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={handlePrintQr}
          sx={{ mb: 5 }}
        >
          Print QR Code
        </Button>
      </div>

      <Box component="img" src={qrUrl} alt="QR Code" sx={{ width: 200, height: 200 }} />

      <div style={{ display: "none" }}>
        <div ref={printContainerRef}></div>
      </div>
    </Box>
  );

  const renderConfirmationDialog = () => (
    <Box p={3}>
      <Typography variant="h5" mb={3}>
        Ar QR kodas buvo atspausdintas?
      </Typography>
      <Stack direction="row" spacing={2}>
        <Button
          variant="contained"
          color="success"
          onClick={() => handleConfirmation(true)}
        >
          Yes
        </Button>
        <Button
          variant="contained"
          color="error"
          onClick={() => handleConfirmation(false)}
        >
          No
        </Button>
      </Stack>
    </Box>
  );

  const renderRegistrationStatus = () => (
    <Box p={3}>
      <Typography variant="h5" mb={3}>
        Registration Status
      </Typography>
      <Typography>
        {isRegistered
          ? "QR Code successfully registered!"
          : "Failed to register QR Code."}
      </Typography>
    </Box>
  );

  let content;
  if (isRegistered === null && !showConfirmation) {
    content = renderPrintPage();
  } else if (showConfirmation) {
    content = renderConfirmationDialog();
  } else {
    content = renderRegistrationStatus();
  }

  return content;
};

export default RegisterPage;

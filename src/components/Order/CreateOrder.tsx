import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { Button, Typography, CircularProgress, Box } from "@mui/material";

interface ApiResponse {
  available?: boolean;
  orderId?: number;
  bookId?: number;
  bookcaseId?: number;
  adjusted?: boolean;
  waitingTime?: number;
  message?: string;
  error?: string;
}

export default function CreateOrder() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [orderId, setOrderId] = useState<number | null>(null);
  const [waitingTime, setWaitingTime] = useState<number | null>(null);
  const [showReservationConfirm, setShowReservationConfirm] = useState(false);

  const apiUrl = import.meta.env.VITE_API_BASE_URL;
  const bookId = searchParams.get("id");
  const clientId = localStorage.getItem("id");

  useEffect(() => {
    async function tryCreateOrder() {
      if (!bookId) {
        setError("Book ID missing from URL");
        return;
      }
      if (!clientId) {
        setError("Client ID missing from localStorage");
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`${apiUrl}/order/create-order?type=order`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ BookId: bookId, ClientId: clientId }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Failed to create order");
        }

        const data: ApiResponse = await response.json();
        const available = data.available ??  false;

        if (available) {
          setOrderId(data.orderId ?? null);
          setSuccessMessage("Order successfully created!");
        } else {
          setWaitingTime(data.waitingTime ?? null);
          setShowReservationConfirm(true);
        }
      } catch (err: any) {
        setError(err.message || "Unknown error");
      } finally {
        setLoading(false);
      }
    }

    tryCreateOrder();
  }, [apiUrl, bookId, clientId]);

  async function confirmReservation() {
    if (!bookId || !clientId) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${apiUrl}/order/create-order?type=reservation`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ BookId: bookId, ClientId: clientId }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create reservation");
      }

      const data: ApiResponse = await response.json();

      setOrderId(data.orderId ?? null);
      setSuccessMessage("Reservation successfully created!");
      setShowReservationConfirm(false);
    } catch (err: any) {
      setError(err.message || "Unknown error");
    } finally {
      setLoading(false);
    }
  }

  if (loading) return <CircularProgress />;

  if (error)
    return (
      <Box>
        <Typography color="error" variant="h6" gutterBottom>
          Error: {error}
        </Typography>
        <Button variant="contained" onClick={() => navigate(-1)}>
          Go Back
        </Button>
      </Box>
    );

  if (successMessage)
    return (
      <Box>
        <Typography variant="h5" gutterBottom>
          {successMessage}
        </Typography>
        {orderId && <Typography>Order/Reservation ID: {orderId}</Typography>}
        <Button variant="contained" onClick={() => navigate("/orders")}>
          Go to Orders
        </Button>
      </Box>
    );

  if (showReservationConfirm)
    return (
      <Box>
        <Typography variant="h6" gutterBottom>
          The book is currently unavailable.
        </Typography>
        <Typography gutterBottom>
          Estimated waiting time:{" "}
          {waitingTime !== null ? `${waitingTime} days` : "Unknown"}
        </Typography>
        <Typography gutterBottom>
          Would you like to make a reservation?
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={confirmReservation}
          sx={{ mr: 2 }}
        >
          Yes, reserve
        </Button>
        <Button variant="outlined" onClick={() => navigate(-1)}>
          No, go back
        </Button>
      </Box>
    );

  return null;
}

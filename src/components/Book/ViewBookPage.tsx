import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  CircularProgress,
  Stack,
  Button,
} from "@mui/material";
import { useNavigate, useLocation } from "react-router";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

interface Book {
  id_Knyga: number;
  pavadinimas: string;
  autorius: string;
  reitingas: number;
  kaina: number;
  ilgis: number;
  aukštis: number;
  plotis: number;
  statusas: number;
}

const ViewBookPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const id = searchParams.get("id");

  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const statusMap: Record<number, string> = {
    1: "laisva",
    2: "užsakyta",
    3: "grąžinta",
    4: "neužregistruota",
    5: "užregistruota",
  };

  useEffect(() => {
    if (!id) {
      setError("No book ID provided.");
      setLoading(false);
      return;
    }

    fetch(`${API_BASE_URL}/books/find-book`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id: Number(id) }),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to fetch book");
        }
        return res.json();
      })
      .then((data: Book) => {
        setBook(data);
        setLoading(false);
      })
      .catch((err: Error) => {
        setError(err.message);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <Box p={4} display="flex" justifyContent="center">
        <CircularProgress color="primary" />
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={4} textAlign="center">
        <Typography color="error" mb={2}>
          {error}
        </Typography>
        <Button variant="contained" onClick={() => navigate(-1)}>
          Go Back
        </Button>
      </Box>
    );
  }

  if (!book) {
    return (
      <Box p={4} textAlign="center">
        <Typography>Book not found.</Typography>
        <Button variant="contained" onClick={() => navigate(-1)} sx={{ mt: 2 }}>
          Go Back
        </Button>
      </Box>
    );
  }

  return (
    <Box p={6} maxWidth="600px" mx="auto">
      <Typography variant="h4" gutterBottom>
        {book.pavadinimas}
      </Typography>
      <Stack spacing={1}>
        <Typography>
          <strong>Author:</strong> {book.autorius}
        </Typography>
        <Typography>
          <strong>Rating:</strong> {book.reitingas}
        </Typography>
        <Typography>
          <strong>Price:</strong> €{book.kaina.toFixed(2)}
        </Typography>
        <Typography>
          <strong>Dimensions:</strong> {book.ilgis} x {book.plotis} x {book.aukštis} cm
        </Typography>
        <Typography>
          <strong>Status:</strong> {statusMap[book.statusas]}
        </Typography>
      </Stack>
      <Button
        variant="contained"
        color="warning"
        sx={{ mt: 6 }}
        onClick={() => navigate(-1)}
      >
        Go Back
      </Button>
    </Box>
  );
};

export default ViewBookPage;

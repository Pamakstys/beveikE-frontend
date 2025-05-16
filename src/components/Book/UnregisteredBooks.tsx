import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  CircularProgress,
  Stack,
  Button,
  Paper,
} from "@mui/material";
import { useNavigate } from "react-router";

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
  statusas: string;
}

const Book = () => {
  const navigate = useNavigate();
  const [books, setBooks] = useState<Book[]>([]);
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
    fetch(`${API_BASE_URL}/books/find-unregistered-books`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status: 4 }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch books");
        }
        return response.json();
      })
      .then((data: Book[]) => {
        setBooks(data);
        setLoading(false);
      })
      .catch((error: Error) => {
        setError(error.message);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <Box p={4} display="flex" justifyContent="center">
        <CircularProgress color="primary" />
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={4}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <Box p={4}>
      <Typography variant="h4" gutterBottom>
        Book List 📚
      </Typography>
      <Stack spacing={2}>
        {books.map((book) => (
          <Paper key={book.id_Knyga} variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
            <Typography variant="h6" fontWeight="bold">
              {book.pavadinimas}
            </Typography>
            <Typography>Author: {book.autorius}</Typography>
            <Typography>Rating: {book.reitingas}</Typography>
            <Typography>
              Price: €{book.kaina.toFixed(2)}
            </Typography>
            <Typography>
              Dimensions: {book.ilgis} x {book.plotis} x {book.aukštis} cm
            </Typography>
            <Typography>Status: {statusMap[Number(book.statusas)]}</Typography>
            <Button
              variant="contained"
              color="success"
              sx={{ mt: 2 }}
              onClick={() =>
                navigate(
                  `/unregistered-books/register?id=${book.id_Knyga}&type=book`
                )
              }
            >
              Register Book
            </Button>
          </Paper>
        ))}
      </Stack>
    </Box>
  );
};

export default Book;

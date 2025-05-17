import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  CircularProgress,
  Stack,
  Paper,
  Button,
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

const FavouriteBooks = () => {
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
  const userId = localStorage.getItem("id");
  if (!userId) {
    setError("Naudotojas neprisijungęs.");
    setLoading(false);
    return;
  }

  // 1. Gauti mėgstamų knygų ID
  fetch(`${API_BASE_URL}/books/favourites/${userId}`)
    .then((res) => res.json())
    .then((ids: number[]) => {
      // 2. Gauti visas knygas
      return fetch(`${API_BASE_URL}/books/find-books`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: 1 }),
      }).then((res) => {
        if (!res.ok) throw new Error("Nepavyko gauti knygų");
        return res.json().then((allBooks: Book[]) => {
          // 3. Filtruoti pagal ID (naudojam "ids" tiesiogiai)
          const filteredBooks = allBooks.filter((b) =>
            ids.includes(b.id_Knyga)
          );
          setBooks(filteredBooks);
          setLoading(false);
        });
      });
    })
    .catch((err: any) => {
      setError(err.message || "Įvyko klaida");
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
      <Typography variant="h4" mb={4}>
        Mėgstamiausios knygos ⭐
      </Typography>
      {books.length === 0 ? (
        <Typography>Neturite mėgstamų knygų.</Typography>
      ) : (
        <Stack spacing={2}>
          {books.map((book) => (
            <Paper key={book.id_Knyga} sx={{ p: 2 }} elevation={3}>
              <Typography variant="h6" fontWeight="bold">
                {book.pavadinimas} ⭐
              </Typography>
              <Typography>Autorius: {book.autorius}</Typography>
              <Typography>Reitingas: {book.reitingas}</Typography>
              <Typography>Kaina: €{book.kaina.toFixed(2)}</Typography>
              <Typography>
                Išmatavimai: {book.ilgis} x {book.plotis} x {book.aukštis} cm
              </Typography>
              <Typography>
                Statusas: {statusMap[Number(book.statusas)]}
              </Typography>

              <Stack direction="row" spacing={1} mt={2}>
                <Button
                  variant="contained"
                  color="success"
                  onClick={() =>
                    navigate(`/books/view?id=${book.id_Knyga}`)
                  }
                >
                  View
                </Button>
              </Stack>
            </Paper>
          ))}
        </Stack>
      )}
    </Box>
  );
};

export default FavouriteBooks;

import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  CircularProgress,
  Stack,
  Paper,
} from "@mui/material";
import { useNavigate } from "react-router";
import DeleteModal from "./DeleteModal";

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

const Books = () => {
  const navigate = useNavigate();
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [bookToDelete, setBookToDelete] = useState<number | null>(null);
  const [refresh, setRefresh] = useState(false);
  const [favouriteBookIds, setFavouriteBookIds] = useState<number[]>([]);

  const statusMap: Record<number, string> = {
    1: "laisva",
    2: "užsakyta",
    3: "grąžinta",
    4: "neužregistruota",
    5: "užregistruota",
  };

  useEffect(() => {
    fetch(`${API_BASE_URL}/books/find-books`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status: 1 }),
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
  }, [refresh]);

    useEffect(() => {
      const userId = localStorage.getItem("id");
      if (!userId) return;

      fetch(`${API_BASE_URL}/books/favourites/${userId}`)
        .then((res) => res.json())
        .then((data: number[]) => setFavouriteBookIds(data))
        .catch((err) => console.error("Nepavyko gauti mėgstamiausių knygų", err));
    }, [refresh]);

  const handleDeleteClick = (bookId: number) => {
    setBookToDelete(bookId);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (bookToDelete) {
      console.log(`Deleting book with ID: ${bookToDelete}`);
      fetch(`${API_BASE_URL}/books/delete`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: bookToDelete }),
      });
    }
    setIsDeleteModalOpen(false);
    setBookToDelete(null);
    setRefresh((prev) => !prev);
  };
  const handleAddFavourite = (bookId: number) => {
    const userId = localStorage.getItem("id");
    if (favouriteBookIds.includes(bookId)) {
      alert("Ši knyga jau yra Jūsų mėgstamiausių knygų sąraše");
      return;
  }
    fetch(`${API_BASE_URL}/books/add-favourite`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        BookId: bookId,
        UserId: Number(userId),
      }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Nepavyko pridėti mėgstamos knygos");
        favouriteBookIds.push(bookId);
        setFavouriteBookIds(favouriteBookIds);
        setRefresh((prev) => !prev);
        return res.text();
      })
      .then(() => alert("Knyga pridėta prie mėgstamiausių!"))
      .catch((err) => {
        console.error(err);
        alert("Įvyko klaida pridedant mėgstamą knygą");
      });
  };

  const handleCloseModal = () => {
    setIsDeleteModalOpen(false);
  };

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
        Book List 📚
      </Typography>
      <Stack spacing={2}>
        {books.map((book) => (
          <Paper key={book.id_Knyga} sx={{ p: 2 }} elevation={3}>
            <Typography variant="h6" fontWeight="bold">
                {book.pavadinimas}{" "}
                {favouriteBookIds.includes(book.id_Knyga) && "⭐"}
            </Typography>
            <Typography>Author: {book.autorius}</Typography>
            <Typography>Rating: {book.reitingas}</Typography>
            <Typography>Price: €{book.kaina.toFixed(2)}</Typography>
            <Typography>
              Dimensions: {book.ilgis} x {book.plotis} x {book.aukštis} cm
            </Typography>
            <Typography>Status: {statusMap[Number(book.statusas)]}</Typography>

            <Stack direction="row" spacing={1} mt={2}>
              <Button
                variant="contained"
                color="error"
                onClick={() => handleDeleteClick(book.id_Knyga)}
              >
                Delete
              </Button>

              <Button
                variant="contained"
                color="primary"
                onClick={() => navigate(`/books/edit?id=${book.id_Knyga}`)}
              >
                Edit
              </Button>

              <Button
                variant="contained"
                color="success"
                onClick={() => navigate(`/books/view?id=${book.id_Knyga}`)}
              >
                View
              </Button>
              {!favouriteBookIds.includes(book.id_Knyga) && (
                <Button
                  variant="outlined"
                  color="secondary"
                  onClick={() => handleAddFavourite(book.id_Knyga)}
                >
                  Favourite
                </Button>
              )}
            </Stack>
          </Paper>
        ))}
      </Stack>

      <DeleteModal
        isOpen={isDeleteModalOpen}
        onClose={handleCloseModal}
        onConfirm={handleConfirmDelete}
      />
    </Box>
  );
};

export default Books;

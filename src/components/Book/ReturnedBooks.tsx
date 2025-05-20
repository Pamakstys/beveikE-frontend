import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Typography,
  Card,
  CardContent,
  CardActions,
} from "@mui/material";

const apiUrl = import.meta.env.VITE_API_BASE_URL;

interface Book {
  id_Knyga: number;
  pavadinimas: string;
  autorius: string;
}

export default function ReturnedBooks() {
  const [books, setBooks] = useState<Book[]>([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchUncheckedBooks();
  }, []);

  async function fetchUncheckedBooks() {
    try {
      const res = await fetch(`${apiUrl}/books/get-unchecked-books`);
      const data = await res.json();
      setBooks(data);
    } catch (err) {
      setMessage("Nepavyko gauti grąžintų knygų sąrašo.");
    }
  }

  const handleDamagedNew = async (bookId: number) => {
    try {
      const fineRes = await fetch(`${apiUrl}/Fine/add-fine-to-user`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId: bookId }),
      });

      if (!fineRes.ok) {
        const errorText = await fineRes.text();
        throw new Error("Nepavyko priskirti baudos: " + errorText);
      }
      if (fineRes.ok) {
        fetchUncheckedBooks();
      }
    }
    catch (err: any) {
      setMessage(err.message || "Klaida priskiriant baudą.");
    }
  }

  const handleUndamagedNew = async (bookId: number) => {
    try {
      const res = await fetch(`${apiUrl}/Order/book-check-correct`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bookId),
      });
      if (!res.ok) {
        const errorText = await res.text();
        throw new Error("Nepavyko priskirti baudos: " + errorText);
      }
      if (res.ok) {
        fetchUncheckedBooks();
      }
    } catch (err) {
      setMessage("Klaida apdorojant knygą.");
    }

  }

  return (
    <Box padding={3}>
      <Typography variant="h5" gutterBottom>
        Grąžintos knygos
      </Typography>

      {message && (
        <Typography color="secondary" mb={2}>
          {message}
        </Typography>
      )}

      <Box display="flex" flexWrap="wrap" gap={2}>
        {books.map((book) => (
          <Box
            key={book.id_Knyga}
            width={{ xs: "100%", md: "48%" }}
            display="flex"
            flexDirection="column"
          >
            <Card>
              <CardContent>
                <Typography variant="h6">{book.pavadinimas}</Typography>
                <Typography variant="body2" color="textSecondary">
                  Autorius: {book.autorius}
                </Typography>
              </CardContent>
              <CardActions>
                <Button
                  onClick={() => handleDamagedNew(book.id_Knyga)}
                  color="error"
                  variant="contained"
                >
                  Sugadinta
                </Button>
                <Button
                  onClick={() => handleUndamagedNew(book.id_Knyga)}
                  color="success"
                  variant="contained"
                >
                  Tvarkinga
                </Button>
              </CardActions>
            </Card>
          </Box>
        ))}
      </Box>
    </Box>
  );
}

import React from 'react';
import { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Stack,
} from "@mui/material";

export default function AddBookToBookcase() {
  const [bookcaseId, setBookcaseId] = useState("");
  const [bookId, setBookId] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const apiUrl = import.meta.env.VITE_API_BASE_URL;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const res = await fetch(`${apiUrl}/bookcase/add`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookcaseId, bookId }),
      });

      if (res.ok) {
        setSuccess("Book added to bookcase successfully!");
      } else {
        const data = await res.json();
        setError(data.error || "Failed to add book to bookcase");
      }
    } catch (error) {
      setError("Network error. Please try again.");
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        bgcolor: "#f5f5f5",
        p: 2,
      }}
    >
      <Paper elevation={3} sx={{ p: 4, width: "100%", maxWidth: 400 }}>
        <Typography variant="h5" mb={3} textAlign="center">
          Add Book to Bookcase
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate>
          <Stack spacing={3}>
            <TextField
              label="Bookcase ID"
              variant="outlined"
              value={bookcaseId}
              onChange={(e) => setBookcaseId(e.target.value)}
              required
            />
            <TextField
              label="Book ID"
              variant="outlined"
              value={bookId}
              onChange={(e) => setBookId(e.target.value)}
              required
            />
            {error && (
              <Typography color="error" textAlign="center">
                {error}
              </Typography>
            )}
            {success && (
              <Typography color="success.main" textAlign="center">
                {success}
              </Typography>
            )}
            <Button
                variant="contained"
                color="primary"
                type="submit"
                sx={{ mt: 2 }}
            >
              Add Book
            </Button>
            </Stack>
        </Box>
        </Paper>
    </Box>
    );
}
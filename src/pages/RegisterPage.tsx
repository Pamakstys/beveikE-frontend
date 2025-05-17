import React, { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Stack,
  MenuItem,
} from "@mui/material";
import { useNavigate } from "react-router";

export default function RegisterPage() {
  const [role, setRole] = useState("client");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();
  const apiUrl = import.meta.env.VITE_API_BASE_URL;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const body: any = {
      email,
      password,
      role,
    };

    if (role === "client") {
      body.name = name;
      body.surname = surname;
    } else if (role === "worker") {
      body.phone = phone;
    }

    try {
      const res = await fetch(`${apiUrl}/user/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (res.ok) {
        setSuccess("Registration successful!");
        navigate("/login");
      } else {
        setError(data.error || "Registration failed");
      }
    } catch {
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
      <Paper elevation={3} sx={{ p: 4, width: "100%", maxWidth: 500 }}>
        <Typography variant="h5" mb={3} textAlign="center">
          Register
        </Typography>
        <Box component="form" onSubmit={handleSubmit}>
          <Stack spacing={2}>
            <TextField
              select
              label="Role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              fullWidth
            >
              <MenuItem value="client">Client</MenuItem>
              <MenuItem value="worker">Worker</MenuItem>
              <MenuItem value="admin">Admin</MenuItem>
            </TextField>

            <TextField
              label="Email"
              type="text"
              required
              fullWidth
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <TextField
              label="Password"
              type="password"
              required
              fullWidth
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            {role === "client" && (
              <>
                <TextField
                  label="Name"
                  fullWidth
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
                <TextField
                  label="Surname"
                  fullWidth
                  required
                  value={surname}
                  onChange={(e) => setSurname(e.target.value)}
                />
              </>
            )}

            {role === "worker" && (
              <TextField
                label="Phone"
                fullWidth
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            )}

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

            <Button type="submit" variant="contained" fullWidth>
              Register
            </Button>
            <Typography textAlign="center">
              Already have an account?{" "}
              <Button
                variant="text"
                color="primary"
                onClick={() => {
                  window.location.href = "/login";
                }}
              >
                Login
              </Button>
            </Typography>
          </Stack>
        </Box>
      </Paper>
    </Box>
  );
}

import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Typography,
} from "@mui/material";

interface Book {
  pavadinimas: string;
  autorius: string;
}

interface Order {
  id_Užsakymas: number;
  užsakymo_data: string | null;
  pA_data: string | null;
  pabaigos_data: string | null;
  ar_tinkama_būklė?: boolean | null;
  ar_pratęstas?: boolean | null;
  būsena?: number | null;
  knyga: Book;
}

export default function ViewOrderPage() {
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const apiUrl = import.meta.env.VITE_API_BASE_URL;
  const navigate = useNavigate();
  const location = useLocation();

  // Helper to get query params
  function getQueryParam(param: string) {
    const searchParams = new URLSearchParams(location.search);
    return searchParams.get(param);
  }
  const userid = localStorage.getItem("id");
  useEffect(() => {
    async function fetchOrder() {
      const orderId = getQueryParam("id");
      if (!orderId) {
        setError("Order ID not found in URL");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`${apiUrl}/order/get-order`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ OrderId: orderId, UserId: userid}), 
        });

        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }

        const result = await response.json();
        if (!result || !result.id_Užsakymas) {
          setError("Order not found");
          setOrder(null);
        } else {
          setOrder(result);
        }
      } catch (err: any) {
        setError(err.message || "Unknown error");
      } finally {
        setLoading(false);
      }
    }

    fetchOrder();
  }, [location.search]);

  if (loading) return <div>Loading order...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!order) return <div>No order found</div>;

  const statusMap: Record<number, string> = {
    1: "Active",
    2: "Pending",
    3: "Completed",
    4: "Overdue",
  };

  return (
    <div style={{ padding: 20 }}>
      <Typography variant="h4" gutterBottom>
        Order Details #{order.id_Užsakymas}
      </Typography>

      <TableContainer component={Paper} sx={{ maxWidth: 600, mb: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Field</TableCell>
              <TableCell>Value</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell>Book Title</TableCell>
              <TableCell>{order.knyga.pavadinimas}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Author</TableCell>
              <TableCell>{order.knyga.autorius}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Order Date</TableCell>
              <TableCell>
                {order.užsakymo_data
                  ? new Date(order.užsakymo_data).toLocaleDateString()
                  : "N/A"}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Reservation Date</TableCell>
              <TableCell>
                {order.pA_data
                  ? new Date(order.pA_data).toLocaleDateString()
                  : "N/A"}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>End Date</TableCell>
              <TableCell>
                {order.pabaigos_data
                  ? new Date(order.pabaigos_data).toLocaleDateString()
                  : "N/A"}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Is Extended</TableCell>
              <TableCell>{order.ar_pratęstas ? "Taip" : "Ne"}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Is Book in Good Condition</TableCell>
              <TableCell>
                {order.ar_tinkama_būklė === null
                  ? "N/A"
                  : order.ar_tinkama_būklė
                  ? "Yes"
                  : "No"}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Status</TableCell>
              <TableCell>{order.būsena ? statusMap[order.būsena] : "N/A"}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>

      <Button variant="contained" onClick={() => navigate("/orders")}>
        Back to Orders
      </Button>
    </div>
  );
}

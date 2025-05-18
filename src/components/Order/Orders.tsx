import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
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

export default function Orders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const apiUrl = import.meta.env.VITE_API_BASE_URL;
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchOrders() {
      try {
        const userId = localStorage.getItem("id");
        if (!userId) {
          setError("User ID not found in localStorage");
          setLoading(false);
          return;
        }

        const response = await fetch(`${apiUrl}/order/get-orders`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ UserId: userId }),
        });

        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }
        
        

        var result = await response.json();
        console.log("cia ", result);
        if (Array.isArray(result)) {
          setOrders(result);
        } else if (result.message === false) {
          setOrders([]);
        }
        

      } catch (err: any) {
        setError(err.message || "Unknown error");
      } finally {
        setLoading(false);
      }
    }

    fetchOrders();
  }, []);

  if (loading) return <div>Loading orders...</div>;
  if (error) return <div>Error: {error}</div>;

      
      const būsena14 = orders.filter((o) => o.būsena == 1 || o.būsena == 4);
      const būsena2 = orders.filter((o) => o.būsena === 2);
      const būsena3 = orders.filter((o) => o.būsena === 3);
    
  
  
  
  
  const renderTable = (
    title: string,
    ordersList: Order[],
    columns: React.ReactNode
    
  ) => (
    <>
      <Typography variant="h4" gutterBottom sx={{ mt: 4 }}>
        {title}
      </Typography>
      {ordersList.length === 0 ? (
        <Typography>Nėra įrašų.</Typography>
      ) : (
        <TableContainer component={Paper} sx={{ marginBottom: 4 }}>
          <Table>
            <TableHead>
              <TableRow>{columns}</TableRow>
            </TableHead>
            <TableBody>
              {ordersList.map((o) => (
                <TableRow key={o.id_Užsakymas}>
                  <TableCell>
                    {o.knyga.pavadinimas} by {o.knyga.autorius}
                  </TableCell>

                  {title === "Active orders" && (
                    <>
                      <TableCell>
                        {o.užsakymo_data
                          ? new Date(o.užsakymo_data).toLocaleDateString()
                          : "N/A"}
                      </TableCell>
                      <TableCell>
                        {o.pabaigos_data
                          ? new Date(o.pabaigos_data).toLocaleDateString()
                          : "N/A"}
                      </TableCell>
                      <TableCell>{o.ar_pratęstas ? "Taip" : "Ne"}</TableCell>
                      <TableCell>
                        <Button
                          variant="contained"
                          color="primary"
                          size="small"
                          sx={{ mr: 1 }}
                          onClick={() =>
                            navigate(`/orders/get-order?id=${o.id_Užsakymas}`)
                          }
                        >
                          View
                        </Button>
                        <Button
                          variant="outlined"
                          color="secondary"
                          size="small"
                          onClick={() =>
                            navigate(`/orders/return-book?id=${o.id_Užsakymas}`)
                          }
                        >
                          Return
                        </Button>
                      </TableCell>
                    </>
                  )}

                  {title === "Reservations" && (
                    <>
                      <TableCell>
                        {o.pA_data
                          ? new Date(o.pA_data).toLocaleDateString()
                          : "N/A"}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="contained"
                          color="primary"
                          size="small"
                          sx={{ mr: 1 }}
                        >
                          View
                        </Button>
                      </TableCell>
                    </>
                  )}

                  {title === "Finished orders" && (
                    <>
                      <TableCell>
                        {o.pabaigos_data
                          ? new Date(o.pabaigos_data).toLocaleDateString()
                          : "N/A"}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="contained"
                          color="primary"
                          size="small"
                          sx={{ mr: 1 }}
                        >
                          View
                        </Button>
                      </TableCell>
                    </>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </>
  );

  return (
    <div style={{ paddingTop: "20px" }}>
      {renderTable(
        "Active orders",
        būsena14,
        <>
          <TableCell>Book</TableCell>
          <TableCell>Order date</TableCell>
          <TableCell>Order end date</TableCell>
          <TableCell>Extended?</TableCell>
          <TableCell>Actions</TableCell>
        </>
      )}

      {renderTable(
        "Reservations",
        būsena2,
        <>
          <TableCell>Book</TableCell>
          <TableCell>Reservation date</TableCell>
          <TableCell>Actions</TableCell>
        </>
      )}

      {renderTable(
        "Finished orders",
        būsena3,
        <>
          <TableCell>Book</TableCell>
          <TableCell>Order end date</TableCell>
          <TableCell>Actions</TableCell>
        </>
      )}
    </div>
  );
}

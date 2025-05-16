import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router";

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

const EditBookPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const id = searchParams.get("id");

  const [book, setBook] = useState<Book | null>(null);
  const [error, setError] = useState<string | null>(null);


  useEffect(() => {
    fetch(`${API_BASE_URL}/books/find-book`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id: id }),
    })
      .then(async (res) => {
        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.message || "Knyga nerasta");
        }
        return res.json();
      })
      .then((data) => {
        setBook(data);
      })
      .catch((err) => {
        setError(err.message);
      });
  }, [id]);
  

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    let updatedValue: number = name === "statusas" ? parseInt(value) : parseFloat(value);

    if (name === "reitingas") {
        if (updatedValue > 5) updatedValue = 5;
        if (updatedValue < 0) updatedValue = 0;
      }

    setBook(prev => prev ? { ...prev, [name]: name === "statusas" ? parseInt(value) : parseFloat(value) } : prev);
  };

  const handleSubmit = () => {
    const payload = {
      id: book?.id_Knyga,
      reitingas: book?.reitingas,
      kaina: book?.kaina,
      statusas: book?.statusas,
    };

    fetch(`${API_BASE_URL}/books/edit-book`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      })
        .then(async (res) => {
          if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.message || "Įvyko klaida");
          }
          navigate("/books");
        })
        .catch((err) => {
          setError(err.message);
        });
    }

  if (!book) return <div style={{ padding: "1rem" }}>Įkeliama...</div>;

  return (
    <div style={{ maxWidth: "600px", margin: "0 auto", padding: "1rem" }}>
      <h2 style={{ marginBottom: "1rem" }}>Redaguoti knygą</h2>

      {error && (
        <div style={{ color: "red", marginBottom: "1rem" }}>
          {error}
        </div>
      )}

      {["pavadinimas", "autorius", "ilgis", "aukštis", "plotis"].map(field => (
        <div key={field} style={{ marginBottom: "1rem" }}>
          <label>{field.charAt(0).toUpperCase() + field.slice(1)}:</label>
          <input
            type="text"
            name={field}
            value={(book as any)[field]}
            disabled
            style={{ width: "100%", padding: "8px", background: "#f5f5f5" }}
          />
        </div>
      ))}

      <div style={{ marginBottom: "1rem" }}>
        <label>Reitingas:</label>
        <input
          type="number"
          name="reitingas"
          value={book.reitingas}
          onChange={handleChange}
          step="0.1"
          max={10}
          max-value={10}
          style={{ width: "100%", padding: "8px", background:"white" }}
        />
      </div>

      <div style={{ marginBottom: "1rem" }}>
        <label>Kaina:</label>
        <input
          type="number"
          name="kaina"
          value={book.kaina}
          onChange={handleChange}
          step="0.01"
          style={{ width: "100%", padding: "8px", background:"white" }}
        />
      </div>

      <div style={{ marginBottom: "1rem" }}>
        <label>Statusas:</label>
        <select
          name="statusas"
          value={book.statusas}
          onChange={handleChange}
          style={{ width: "100%", padding: "8px", background:"white" }}
        >
          <option value={1}>Laisva</option>
          <option value={2}>Užsakyta</option>
          <option value={3}>Grąžinta</option>
          <option value={4}>Neužregistruota</option>
          <option value={5}>Užregistruota</option>
        </select>
      </div>

      <button
        onClick={handleSubmit}
        style={{
          backgroundColor: "#3182ce",
          color: "#fff",
          padding: "10px 20px",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer"
        }}
      >
        Išsaugoti
      </button>
    </div>
  );
};

export default EditBookPage;

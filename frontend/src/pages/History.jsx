import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

export default function History() {
  const { user } = useAuth();
  const [rows, setRows] = useState([]);

  useEffect(() => {
    if (!user) return;
    (async () => {
      try {
        const res = await fetch("http://127.0.0.1:8000/history", {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        if (!res.ok) {
          toast.error("Failed to fetch history");
          return;
        }
        const j = await res.json();
        setRows(j.history || []);
      } catch (err) {
        toast.error("Network error");
      }
    })();
  }, [user]);

  if (!user) return <p style={{ padding: 24 }}>Login to view history.</p>;

  return (
    <div style={{ padding: 24 }}>
      <h2>History</h2>
      {rows.length === 0 ? <p>No history yet.</p> : (
        <ul>
          {rows.map((r) => (
            <li key={r._id || Math.random()}>
              <strong>{r.filename}</strong> - {r.status} - {r.confidence}% - {r.timestamp}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

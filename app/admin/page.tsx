"use client";

import { useEffect, useState } from "react";

type UserRole = { _id: string; userId: string; role: "admin" | "recruiter" };

export default function Admin() {
  const [list, setList] = useState<UserRole[]>([]);
  const [userId, setUserId] = useState("");
  const [role, setRole] = useState<"admin" | "recruiter">("recruiter");

  async function load() {
    const res = await fetch("/api/users");
    if (res.ok) setList(await res.json());
  }
  useEffect(() => {
    load();
  }, []);

  async function setUserRole() {
    const res = await fetch("/api/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, role }),
    });
    if (res.ok) {
      setUserId("");
      setRole("recruiter");
      load();
    } else {
      alert("Only admin can set roles.");
    }
  }

  return (
    <div>
      <h2>Admin</h2>
      <div className="card">
        <div className="container" style={{ maxWidth: 600 }}>
          <label>Clerk userId</label>
          <input placeholder="user_123..." value={userId} onChange={(e) => setUserId(e.target.value)} />
          <label>Assign role</label>
          <select value={role} onChange={(e) => setRole(e.target.value as any)}>
            <option value="recruiter">recruiter</option>
            <option value="admin">admin</option>
          </select>
          <button onClick={setUserRole}>Set role</button>
          <p style={{ color: "#666" }}>
            Ask your recruiter to sign up first, then paste their Clerk userId here to assign role.
          </p>
        </div>
      </div>

      <h3>Existing roles</h3>
      <ul>
        {list.map((u) => (
          <li key={u._id} className="card">
            <b>{u.userId}</b> — {u.role}
          </li>
        ))}
      </ul>
    </div>
  );
}
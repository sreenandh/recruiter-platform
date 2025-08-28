"use client";

import { useEffect, useState } from "react";

type Candidate = {
  _id?: string;
  name: string;
  email: string;
  skills: string[];
  experienceYears: number;
  resumeText: string;
};

export default function Candidates() {
  const [list, setList] = useState<Candidate[]>([]);
  const [form, setForm] = useState({
    name: "",
    email: "",
    skills: "",
    experienceYears: 0,
    resumeText: "",
  });

  async function load() {
    const res = await fetch("/api/candidates");
    if (res.ok) setList(await res.json());
  }
  useEffect(() => {
    load();
  }, []);

  async function create() {
    const payload = {
      name: form.name,
      email: form.email,
      skills: form.skills.split(",").map((s) => s.trim()).filter(Boolean),
      experienceYears: Number(form.experienceYears),
      resumeText: form.resumeText,
    };
    const res = await fetch("/api/candidates", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (res.ok) {
      setForm({ name: "", email: "", skills: "", experienceYears: 0, resumeText: "" });
      load();
    } else {
      alert("Only admin can create candidates.");
    }
  }

  async function uploadPdf(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const res = await fetch("/api/pdf", { method: "POST", body: await file.arrayBuffer() });
    const data = await res.json();
    setForm((f) => ({ ...f, resumeText: data.text }));
  }

  return (
    <div>
      <h2>Candidates</h2>
      <div className="card">
        <div className="container" style={{ maxWidth: 600 }}>
          <input placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <input placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          <input
            placeholder="Skills (comma-separated)"
            value={form.skills}
            onChange={(e) => setForm({ ...form, skills: e.target.value })}
          />
          <input
            type="number"
            placeholder="Experience years"
            value={form.experienceYears}
            onChange={(e) => setForm({ ...form, experienceYears: Number(e.target.value) })}
          />
          <input type="file" accept="application/pdf" onChange={uploadPdf} />
          <textarea
            rows={6}
            placeholder="Resume text (auto-filled from PDF)"
            value={form.resumeText}
            onChange={(e) => setForm({ ...form, resumeText: e.target.value })}
          />
          <button onClick={create}>Create (Admin only)</button>
        </div>
      </div>

      <ul>
        {list.map((c) => (
          <li key={c._id} className="card">
            <div className="row" style={{ justifyContent: "space-between" }}>
              <div>
                <b>{c.name}</b> — {c.email}
                <div style={{ color: "#666" }}>
                  Skills: [{(c.skills || []).join(", ")}] | Exp: {c.experienceYears} years
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
"use client";

import { useEffect, useState } from "react";

export default function Roles() {
 // eslint-disable-next-line @typescript-eslint/no-explicit-any
 const [list, setList] = useState<any[]>([]);
  const [form, setForm] = useState({
    title: "",
    description: "",
    requiredSkills: "",
    niceToHaveSkills: "",
    minExperience: 0,
    maxExperience: "",
  });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
const [suggestions, setSuggestions] = useState<any[]>([]);
  const [selectedRoleId, setSelectedRoleId] = useState<string>("");

  async function load() {
    const res = await fetch("/api/roles");
    if (res.ok) setList(await res.json());
  }
  useEffect(() => {
    load();
  }, []);

  async function create() {
    const payload = {
      title: form.title,
      description: form.description,
      requiredSkills: form.requiredSkills.split(",").map((s) => s.trim()).filter(Boolean),
      niceToHaveSkills: form.niceToHaveSkills.split(",").map((s) => s.trim()).filter(Boolean),
      minExperience: Number(form.minExperience),
      maxExperience: form.maxExperience ? Number(form.maxExperience) : undefined,
    };
    const res = await fetch("/api/roles", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (res.ok) {
      setForm({ title: "", description: "", requiredSkills: "", niceToHaveSkills: "", minExperience: 0, maxExperience: "" });
      load();
    } else {
      alert("Only admin can create roles.");
    }
  }

  async function getAI(roleId: string) {
    setSelectedRoleId(roleId);
    setSuggestions([]);
    const res = await fetch(`/api/matches/ai?roleId=${roleId}`);
    if (res.ok) setSuggestions(await res.json());
  }

  async function suggestMatch(roleId: string, candidateId: string, score: number, missingSkills: string[]) {
    const res = await fetch("/api/matches", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ roleId, candidateId, score, missingSkills }),
    });
    if (!res.ok) alert("Failed to suggest match (need recruiter/admin).");
  }

  return (
    <div>
      <h2>Roles</h2>
      <div className="card">
        <div className="container" style={{ maxWidth: 600 }}>
          <input placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          <textarea
            placeholder="Description"
            rows={4}
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
          <input
            placeholder="Required skills (comma-separated)"
            value={form.requiredSkills}
            onChange={(e) => setForm({ ...form, requiredSkills: e.target.value })}
          />
          <input
            placeholder="Nice-to-have skills (comma-separated)"
            value={form.niceToHaveSkills}
            onChange={(e) => setForm({ ...form, niceToHaveSkills: e.target.value })}
          />
          <div className="row">
            <input
              type="number"
              placeholder="Min experience"
              value={form.minExperience}
              onChange={(e) => setForm({ ...form, minExperience: Number(e.target.value) })}
            />
            <input
              type="number"
              placeholder="Max experience (optional)"
              value={form.maxExperience}
              onChange={(e) => setForm({ ...form, maxExperience: e.target.value })}
            />
          </div>
          <button onClick={create}>Create (Admin only)</button>
        </div>
      </div>

      <ul>
        {list.map((r) => (
          <li key={r._id} className="card">
            <div className="row" style={{ justifyContent: "space-between" }}>
              <div>
                <b>{r.title}</b>
                <div style={{ color: "#666" }}>
                  Required: [{(r.requiredSkills || []).join(", ")}]
                </div>
              </div>
              <button onClick={() => getAI(r._id)}>AI suggestions</button>
            </div>
            {selectedRoleId === r._id && suggestions.length > 0 && (
              <ol>
                {suggestions.slice(0, 5).map((// eslint-disable-next-line @typescript-eslint/no-explicit-any
s: any) => (
                  <li key={s.candidateId} className="row" style={{ justifyContent: "space-between" }}>
                    <div>
                      {s.name} — score: {s.score}% — missing: [{(s.missingSkills || []).join(", ")}]
                    </div>
                    <button onClick={() => suggestMatch(r._id, s.candidateId, s.score, s.missingSkills)}>Suggest match</button>
                  </li>
                ))}
              </ol>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
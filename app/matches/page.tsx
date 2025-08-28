"use client";

import { useEffect, useState } from "react";

type Match = {
  _id: string;
  candidateId: string;
  roleId: string;
  suggestedBy: "recruiter" | "ai";
  status: "suggested" | "approved" | "rejected";
  score: number;
  missingSkills: string[];
  notes?: string;
  createdAt: string;
};

export default function Matches() {
  const [list, setList] = useState<Match[]>([]);
  async function load() {
    const res = await fetch("/api/matches");
    if (res.ok) setList(await res.json());
  }
  useEffect(() => {
    load();
  }, []);

  async function approve(id: string) {
    const res = await fetch(`/api/matches/${id}/approve`, { method: "POST" });
    if (res.ok) load();
    else alert("Only admin can approve.");
  }
  async function reject(id: string) {
    const res = await fetch(`/api/matches/${id}/reject`, { method: "POST" });
    if (res.ok) load();
    else alert("Only admin can reject.");
  }

  return (
    <div>
      <h2>Matches</h2>
      <ul>
        {list.map((m) => (
          <li key={m._id} className="card">
            <div className="row" style={{ justifyContent: "space-between" }}>
              <div>
                <div><b>Match:</b> {m.candidateId} → {m.roleId}</div>
                <div className="row" style={{ color: "#666" }}>
                  <span><b>Score:</b> {m.score}%</span>
                  <span><b>By:</b> {m.suggestedBy}</span>
                  <span><b>Status:</b> {m.status}</span>
                </div>
                <div style={{ color: "#666" }}>
                  <b>Missing:</b> [{(m.missingSkills || []).join(", ")}]
                </div>
              </div>
              <div className="row">
                <button onClick={() => approve(m._id)}>Approve</button>
                <button onClick={() => reject(m._id)}>Reject</button>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
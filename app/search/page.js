"use client";

import Link from "next/link";
import { ArrowLeft, CheckCircle2, ImagePlus, Loader2, Search, XCircle } from "lucide-react";
import { useMemo, useState } from "react";

export default function SearchPage() {
  const [file, setFile] = useState(null);
  const [matches, setMatches] = useState([]);
  const [status, setStatus] = useState({ type: "idle", message: "" });

  const previewUrl = useMemo(() => (file ? URL.createObjectURL(file) : null), [file]);

  function handleFileChange(event) {
    setFile(event.target.files?.[0] || null);
    setMatches([]);
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (!file) {
      setStatus({ type: "error", message: "Add a photo to search." });
      return;
    }

    setStatus({ type: "loading", message: "Comparing this photo against the stock library..." });

    const formData = new FormData();
    formData.append("image", file);

    const response = await fetch("/api/search", {
      method: "POST",
      body: formData
    });

    const payload = await response.json();

    if (!response.ok) {
      setStatus({ type: "error", message: payload.error || "Search failed." });
      return;
    }

    setMatches(payload.matches || []);
    setStatus({
      type: "success",
      message: payload.matches?.length ? "Closest matches found." : "No close matches found yet."
    });
  }

  async function recordFeedback(match, isCorrect) {
    await fetch("/api/feedback", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        stockItemId: match.stock_item_id,
        stockCode: match.stock_code,
        similarity: match.similarity,
        isCorrect
      })
    });
  }

  return (
    <main className="shell compact">
      <header className="pageHeader">
        <Link className="iconLink" href="/" aria-label="Back to home">
          <ArrowLeft size={20} aria-hidden="true" />
        </Link>
        <div>
          <p className="eyebrow">Photo lookup</p>
          <h1>Search Stock Code</h1>
        </div>
      </header>

      <section className="split">
        <form className="panel" onSubmit={handleSubmit}>
          <label className="uploadBox">
            <input accept="image/*" capture="environment" name="image" type="file" onChange={handleFileChange} />
            <ImagePlus size={34} aria-hidden="true" />
            <span>Add search photo</span>
          </label>

          {previewUrl && <img alt="Search preview" className="singlePreview" src={previewUrl} />}

          <button className="primaryButton full" disabled={status.type === "loading"} type="submit">
            {status.type === "loading" ? <Loader2 className="spin" size={18} aria-hidden="true" /> : <Search size={18} aria-hidden="true" />}
            Find stock code
          </button>

          {status.message && <p className={`status ${status.type}`}>{status.message}</p>}
        </form>

        <section className="results">
          {matches.length === 0 ? (
            <div className="emptyState">
              <Search size={34} aria-hidden="true" />
              <h2>Matches appear here</h2>
              <p>Take a clear item photo and search the recorded stock library.</p>
            </div>
          ) : (
            matches.map((match, index) => (
              <article className={index === 0 ? "match topMatch" : "match"} key={`${match.stock_item_id}-${match.image_url}`}>
                {match.image_url ? <img alt={match.stock_code} src={match.image_url} /> : <div className="imageFallback" />}
                <div className="matchBody">
                  <div>
                    <span className="rank">Match {index + 1}</span>
                    <h2>{match.stock_code}</h2>
                    <p>{match.description || "No description recorded"}</p>
                    <span className="score">{Math.round((match.similarity || 0) * 100)}% visual similarity</span>
                  </div>
                  <div className="feedback">
                    <button type="button" onClick={() => recordFeedback(match, true)} aria-label="Mark correct">
                      <CheckCircle2 size={19} aria-hidden="true" />
                    </button>
                    <button type="button" onClick={() => recordFeedback(match, false)} aria-label="Mark wrong">
                      <XCircle size={19} aria-hidden="true" />
                    </button>
                  </div>
                </div>
              </article>
            ))
          )}
        </section>
      </section>
    </main>
  );
}

"use client";

import Link from "next/link";
import { ArrowLeft, Camera, ImagePlus, Loader2, Save } from "lucide-react";
import { useMemo, useState } from "react";

export default function RecordPage() {
  const [files, setFiles] = useState([]);
  const [stockCode, setStockCode] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [location, setLocation] = useState("");
  const [status, setStatus] = useState({ type: "idle", message: "" });
  const [recentItems, setRecentItems] = useState([]);

  const previews = useMemo(
    () =>
      files.map((file) => ({
        name: file.name,
        url: URL.createObjectURL(file)
      })),
    [files]
  );

  function handleFileChange(event) {
    setFiles(Array.from(event.target.files || []));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (!stockCode.trim() || files.length === 0) {
      setStatus({ type: "error", message: "Add a stock code and at least one photo." });
      return;
    }

    setStatus({ type: "loading", message: "Recording item and generating image fingerprints..." });

    const formData = new FormData();
    formData.append("stockCode", stockCode.trim());
    formData.append("description", description.trim());
    formData.append("category", category.trim());
    formData.append("location", location.trim());
    files.forEach((file) => formData.append("images", file));

    const response = await fetch("/api/record", {
      method: "POST",
      body: formData
    });

    const payload = await response.json();

    if (!response.ok) {
      setStatus({ type: "error", message: payload.error || "Recording failed." });
      return;
    }

    setRecentItems((items) => [payload.item, ...items].slice(0, 6));
    setStatus({ type: "success", message: `Saved ${payload.imageCount} photo(s) for ${payload.item.stock_code}.` });
    setFiles([]);
    setStockCode("");
    setDescription("");
    setCategory("");
    setLocation("");
    event.currentTarget.reset();
  }

  return (
    <main className="shell compact">
      <header className="pageHeader">
        <Link className="iconLink" href="/" aria-label="Back to home">
          <ArrowLeft size={20} aria-hidden="true" />
        </Link>
        <div>
          <p className="eyebrow">Reference library</p>
          <h1>Record Stock Item</h1>
        </div>
      </header>

      <section className="split">
        <form className="panel" onSubmit={handleSubmit}>
          <label className="uploadBox">
            <input accept="image/*" capture="environment" multiple name="images" type="file" onChange={handleFileChange} />
            <ImagePlus size={34} aria-hidden="true" />
            <span>Add item photos</span>
          </label>

          {previews.length > 0 && (
            <div className="previewGrid">
              {previews.map((preview) => (
                <img alt={preview.name} key={preview.url} src={preview.url} />
              ))}
            </div>
          )}

          <div className="fieldGrid">
            <label>
              Stock code
              <input value={stockCode} onChange={(event) => setStockCode(event.target.value)} placeholder="e.g. STK-10472" />
            </label>
            <label>
              Category
              <input value={category} onChange={(event) => setCategory(event.target.value)} placeholder="Fasteners" />
            </label>
            <label className="wide">
              Description
              <textarea value={description} onChange={(event) => setDescription(event.target.value)} placeholder="Short part description" />
            </label>
            <label>
              Store location
              <input value={location} onChange={(event) => setLocation(event.target.value)} placeholder="Aisle / bin" />
            </label>
          </div>

          <button className="primaryButton full" disabled={status.type === "loading"} type="submit">
            {status.type === "loading" ? <Loader2 className="spin" size={18} aria-hidden="true" /> : <Save size={18} aria-hidden="true" />}
            Save stock item
          </button>

          {status.message && <p className={`status ${status.type}`}>{status.message}</p>}
        </form>

        <aside className="panel quiet">
          <div className="asideTitle">
            <Camera size={20} aria-hidden="true" />
            <h2>Capture Tips</h2>
          </div>
          <ul className="tips">
            <li>Use a clear background where possible.</li>
            <li>Capture multiple angles for similar-looking parts.</li>
            <li>Include labels or packaging if they identify the item.</li>
            <li>Record corrected matches later to improve the library.</li>
          </ul>

          <h2 className="subhead">Recent Saves</h2>
          <div className="recentList">
            {recentItems.length === 0 ? (
              <p className="muted">Saved items will appear here during this session.</p>
            ) : (
              recentItems.map((item) => (
                <div className="recentItem" key={item.id}>
                  <strong>{item.stock_code}</strong>
                  <span>{item.description || "No description"}</span>
                </div>
              ))
            )}
          </div>
        </aside>
      </section>
    </main>
  );
}

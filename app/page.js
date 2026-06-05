import Link from "next/link";
import { ArrowRight, Boxes, Camera, Search } from "lucide-react";

export default function HomePage() {
  return (
    <main className="shell">
      <section className="topbar">
        <div className="brand">
          <Boxes size={28} aria-hidden="true" />
          <div>
            <p>Stores</p>
            <h1>Stock Code Finder</h1>
          </div>
        </div>
        <nav>
          <Link href="/record">Record</Link>
          <Link href="/search">Search</Link>
        </nav>
      </section>

      <section className="hero">
        <div>
          <p className="eyebrow">Photo-based stock lookup</p>
          <h2>Capture known parts once. Find the right stock code later.</h2>
          <p className="heroText">
            Stores staff build the reference library by photographing items and entering stock codes.
            Employees can then search from a new photo and see the closest matching parts.
          </p>
          <div className="actions">
            <Link className="primaryButton" href="/record">
              <Camera size={18} aria-hidden="true" />
              Record an item
            </Link>
            <Link className="secondaryButton" href="/search">
              <Search size={18} aria-hidden="true" />
              Search by photo
            </Link>
          </div>
        </div>

        <div className="workflow" aria-label="Application workflow">
          <div className="workflowStep">
            <span>1</span>
            <strong>Photograph</strong>
            <p>Take clear photos of the part, packaging, or label.</p>
          </div>
          <ArrowRight size={22} aria-hidden="true" />
          <div className="workflowStep">
            <span>2</span>
            <strong>Embed</strong>
            <p>CLIP turns each image into a searchable vector.</p>
          </div>
          <ArrowRight size={22} aria-hidden="true" />
          <div className="workflowStep">
            <span>3</span>
            <strong>Match</strong>
            <p>Supabase returns the closest stored stock-code matches.</p>
          </div>
        </div>
      </section>
    </main>
  );
}

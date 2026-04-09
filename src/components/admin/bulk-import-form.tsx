"use client";

import { useRef, useState } from "react";

type ImportRow = {
  Category: string;
  Material: string;
  Type: string;
  Variant: string;
  Description: string;
  Length: string;
  Colors: string;
  Price: string;
  SKU: string;
  Qty: string;
};

type ImportResult = {
  created: number;
  skipped: number;
  errors: string[];
};

const REQUIRED_COLUMNS = ["Type", "Price"] as const;
const EXPECTED_COLUMNS = ["Category", "Material", "Type", "Variant", "Description", "Length", "Colors", "Price", "SKU", "Qty"];

function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = "";
  let insideQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      if (insideQuotes && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        insideQuotes = !insideQuotes;
      }
    } else if (ch === "," && !insideQuotes) {
      result.push(current.trim());
      current = "";
    } else {
      current += ch;
    }
  }

  result.push(current.trim());
  return result;
}

function parseCSV(text: string): { headers: string[]; rows: Record<string, string>[] } {
  const lines = text.split(/\r?\n/).filter((l) => l.trim());
  if (lines.length < 2) return { headers: [], rows: [] };

  const headers = parseCSVLine(lines[0]).map((h) => h.replace(/^\uFEFF/, "").trim());
  const rows = lines.slice(1).map((line) => {
    const values = parseCSVLine(line);
    return Object.fromEntries(headers.map((h, i) => [h, values[i] ?? ""]));
  });

  return { headers, rows };
}

export function BulkImportForm() {
  const fileRef = useRef<HTMLInputElement>(null);
  const [parsed, setParsed] = useState<{ headers: string[]; rows: Record<string, string>[] } | null>(null);
  const [columnError, setColumnError] = useState<string | null>(null);
  const [status, setStatus] = useState<"idle" | "importing" | "done">("idle");
  const [result, setResult] = useState<ImportResult | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setParsed(null);
    setColumnError(null);
    setResult(null);
    setApiError(null);
    setStatus("idle");

    const reader = new FileReader();
    reader.onload = (ev) => {
      const text = ev.target?.result as string;
      const data = parseCSV(text);

      const missing = REQUIRED_COLUMNS.filter((c) => !data.headers.includes(c));
      if (missing.length > 0) {
        setColumnError(`Missing required columns: ${missing.join(", ")}. Expected: ${EXPECTED_COLUMNS.join(", ")}`);
        return;
      }

      setParsed(data);
    };
    reader.readAsText(file);
  }

  async function handleImport() {
    if (!parsed) return;
    setStatus("importing");
    setApiError(null);

    try {
      const rows = parsed.rows.map((r) => ({
        Category: r["Category"] ?? "",
        Material: r["Material"] ?? "",
        Type: r["Type"] ?? "",
        Variant: r["Variant"] ?? "",
        Description: r["Description"] ?? "",
        Length: r["Length"] ?? "",
        Colors: r["Colors"] ?? "",
        Price: r["Price"] ?? "0",
        SKU: r["SKU"] ?? "",
        Qty: r["Qty"] ?? "0"
      })) as ImportRow[];

      const res = await fetch("/api/admin/products/bulk-import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ rows })
      });

      const json = (await res.json()) as { data?: ImportResult; error?: string };

      if (!res.ok || json.error) {
        setApiError(json.error ?? "Import failed.");
        setStatus("done");
        return;
      }

      setResult(json.data!);
      setStatus("done");
      setParsed(null);
      if (fileRef.current) fileRef.current.value = "";
    } catch {
      setApiError("Network error. Please try again.");
      setStatus("done");
    }
  }

  function handleReset() {
    setParsed(null);
    setColumnError(null);
    setResult(null);
    setApiError(null);
    setStatus("idle");
    if (fileRef.current) fileRef.current.value = "";
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      <div>
        <p style={{ marginBottom: "0.5rem", fontSize: "0.85rem", opacity: 0.7 }}>
          Export your Excel as <strong>CSV (comma-separated)</strong>. Required columns:{" "}
          <code>Type</code>, <code>Price</code>. Optional: Category, Material, Variant, Description, Length, Colors, SKU, Qty.
        </p>
        <input
          accept=".csv"
          disabled={status === "importing"}
          onChange={handleFile}
          ref={fileRef}
          style={{ fontSize: "0.9rem" }}
          type="file"
        />
      </div>

      {columnError && (
        <p style={{ color: "var(--color-error, #c0392b)", fontSize: "0.85rem" }}>{columnError}</p>
      )}

      {parsed && status === "idle" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          <div
            style={{
              background: "var(--color-surface-2, #f5f5f5)",
              borderRadius: "0.5rem",
              padding: "0.75rem 1rem",
              fontSize: "0.875rem"
            }}
          >
            <strong>{parsed.rows.length}</strong> rows found · Columns detected:{" "}
            {parsed.headers.join(", ")}
          </div>

          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", fontSize: "0.8rem", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  {parsed.headers.map((h) => (
                    <th
                      key={h}
                      style={{
                        textAlign: "left",
                        padding: "0.4rem 0.6rem",
                        borderBottom: "1px solid var(--color-border, #ddd)",
                        whiteSpace: "nowrap",
                        fontWeight: 600
                      }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {parsed.rows.slice(0, 5).map((row, i) => (
                  <tr key={i}>
                    {parsed.headers.map((h) => (
                      <td
                        key={h}
                        style={{
                          padding: "0.4rem 0.6rem",
                          borderBottom: "1px solid var(--color-border, #eee)",
                          maxWidth: "200px",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap"
                        }}
                      >
                        {row[h]}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
            {parsed.rows.length > 5 && (
              <p style={{ fontSize: "0.8rem", opacity: 0.6, marginTop: "0.4rem" }}>
                …and {parsed.rows.length - 5} more rows
              </p>
            )}
          </div>

          <div style={{ display: "flex", gap: "0.75rem" }}>
            <button
              className="admin-primary-button"
              onClick={handleImport}
              type="button"
            >
              {`Import ${parsed.rows.length} Products`}
            </button>
            <button className="admin-secondary-button" onClick={handleReset} type="button">
              Cancel
            </button>
          </div>
        </div>
      )}

      {status === "importing" && (
        <p style={{ fontSize: "0.9rem", opacity: 0.7 }}>Importing products, please wait…</p>
      )}

      {status === "done" && result && (
        <div
          style={{
            background: "var(--color-surface-2, #f5f5f5)",
            borderRadius: "0.5rem",
            padding: "1rem",
            display: "flex",
            flexDirection: "column",
            gap: "0.5rem"
          }}
        >
          <p style={{ fontWeight: 600 }}>Import complete</p>
          <p style={{ fontSize: "0.9rem" }}>
            ✓ <strong>{result.created}</strong> products created &nbsp;·&nbsp;
            {result.skipped > 0 && (
              <>
                ⚠ <strong>{result.skipped}</strong> skipped (duplicate SKU) &nbsp;·&nbsp;
              </>
            )}
            {result.errors.length > 0 && (
              <>
                ✗ <strong>{result.errors.length}</strong> errors
              </>
            )}
          </p>
          {result.errors.length > 0 && (
            <ul style={{ fontSize: "0.8rem", color: "var(--color-error, #c0392b)", margin: 0, paddingLeft: "1.2rem" }}>
              {result.errors.map((e, i) => (
                <li key={i}>{e}</li>
              ))}
            </ul>
          )}
          <button className="admin-secondary-button" onClick={handleReset} style={{ alignSelf: "flex-start" }} type="button">
            Import another file
          </button>
        </div>
      )}

      {status === "done" && apiError && (
        <p style={{ color: "var(--color-error, #c0392b)", fontSize: "0.9rem" }}>{apiError}</p>
      )}
    </div>
  );
}

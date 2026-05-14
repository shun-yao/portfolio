import { ReactNode } from "react";

export function H2({ children }: { children: ReactNode }) {
  return (
    <h2 className="mt-16 mb-4 text-2xl font-semibold tracking-tight text-slate-900 dark:text-white">
      {children}
    </h2>
  );
}

export function H3({ children }: { children: ReactNode }) {
  return (
    <h3 className="mt-10 mb-3 text-xl font-semibold text-slate-900 dark:text-white">
      {children}
    </h3>
  );
}

export function P({ children }: { children: ReactNode }) {
  return (
    <p className="mb-5 leading-relaxed text-slate-700 dark:text-slate-300">
      {children}
    </p>
  );
}

export function InlineCode({ children }: { children: ReactNode }) {
  return (
    <code className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-[0.9em] text-slate-800 dark:bg-slate-800 dark:text-slate-200">
      {children}
    </code>
  );
}

export function CodeBlock({
  language,
  children,
}: {
  language?: string;
  children: string;
}) {
  return (
    <div className="mb-6 overflow-hidden rounded-lg border border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-900">
      {language && (
        <div className="border-b border-slate-200 bg-slate-100 px-4 py-1.5 text-xs font-mono text-slate-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400">
          {language}
        </div>
      )}
      <pre className="overflow-x-auto px-4 py-4 text-sm">
        <code className="font-mono text-slate-800 dark:text-slate-200">
          {children}
        </code>
      </pre>
    </div>
  );
}

export function UL({ children }: { children: ReactNode }) {
  return (
    <ul className="mb-6 ml-6 list-disc space-y-2 text-slate-700 dark:text-slate-300">
      {children}
    </ul>
  );
}

export function OL({ children }: { children: ReactNode }) {
  return (
    <ol className="mb-6 ml-6 list-decimal space-y-2 text-slate-700 dark:text-slate-300">
      {children}
    </ol>
  );
}

export function LI({ children }: { children: ReactNode }) {
  return <li className="leading-relaxed">{children}</li>;
}

export function Callout({
  type = "note",
  children,
}: {
  type?: "note" | "warning" | "tip";
  children: ReactNode;
}) {
  const styles = {
    note: "border-blue-300 bg-blue-50 text-blue-900 dark:border-blue-700 dark:bg-blue-950 dark:text-blue-100",
    warning:
      "border-amber-300 bg-amber-50 text-amber-900 dark:border-amber-700 dark:bg-amber-950 dark:text-amber-100",
    tip: "border-emerald-300 bg-emerald-50 text-emerald-900 dark:border-emerald-700 dark:bg-emerald-950 dark:text-emerald-100",
  };
  return (
    <div className={`mb-6 rounded-lg border-l-4 px-5 py-4 ${styles[type]}`}>
      {children}
    </div>
  );
}

export function Table({
  headers,
  rows,
}: {
  headers: string[];
  rows: string[][];
}) {
  return (
    <div className="mb-6 overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
      <table className="w-full text-sm">
        <thead className="bg-slate-50 dark:bg-slate-800">
          <tr>
            {headers.map((h) => (
              <th
                key={h}
                className="px-4 py-3 text-left font-semibold text-slate-900 dark:text-white"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr
              key={i}
              className="border-t border-slate-200 dark:border-slate-700"
            >
              {row.map((cell, j) => (
                <td
                  key={j}
                  className="px-4 py-3 text-slate-700 dark:text-slate-300"
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

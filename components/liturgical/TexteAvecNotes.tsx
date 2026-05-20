"use client";

import { useCallback } from "react";
import { Note } from "@/data/livre-sacre/types";
import { Ornement } from "./Ornement";

interface Props {
  texte: string;
  notes?: Note[];
  className?: string;
}

const SUPERSCRIPT = ["⁰", "¹", "²", "³", "⁴", "⁵", "⁶", "⁷", "⁸", "⁹"];
function toSuper(n: number): string {
  return String(n)
    .split("")
    .map((c) => SUPERSCRIPT[Number(c)] ?? c)
    .join("");
}

function scrollToNote(id: string) {
  if (typeof document === "undefined") return;
  const el = document.getElementById(id);
  if (!el) return;
  el.scrollIntoView({ behavior: "smooth", block: "center" });
  el.classList.add("note-glow");
  setTimeout(() => el.classList.remove("note-glow"), 1600);
}

export function TexteAvecNotes({ texte, notes, className }: Props) {
  const referenceMap = new Map(notes?.map((n) => [n.id, n]) ?? []);
  const onClick = useCallback((id: number) => () => scrollToNote(`note-${id}`), []);

  const paragraphes = texte.split("\n\n");

  return (
    <div className={className}>
      <div className="prose font-serif text-mousse-900 dark:text-parchemin-100">
        {paragraphes.map((para, i) => (
          <p
            key={i}
            id={`para-${i}`}
            className={`mb-4 leading-relaxed text-[1.05rem] ${i === 0 ? "lettrine" : ""}`}
          >
            {renderTextWithNotes(para, referenceMap, onClick)}
          </p>
        ))}
      </div>

      {notes && notes.length > 0 && (
        <>
          <Ornement />
          <aside aria-label="Notes mycéliennes" className="mt-4 rounded-md border border-ocre-500/30 bg-parchemin-50/60 p-4 dark:bg-mousse-950/40">
            <p className="mb-2 font-sans text-xs uppercase tracking-[0.3em] text-ocre-600 dark:text-ocre-400">
              Notes mycéliennes
            </p>
            <ol className="space-y-2">
              {notes.map((n) => (
                <li
                  key={n.id}
                  id={`note-${n.id}`}
                  className="rounded-sm px-2 py-1 text-[0.92rem] leading-relaxed text-mousse-800 transition dark:text-parchemin-200/90"
                >
                  <button
                    onClick={() => {
                      const target = document.querySelector<HTMLAnchorElement>(`a[data-noteref="${n.id}"]`);
                      target?.scrollIntoView({ behavior: "smooth", block: "center" });
                      target?.focus();
                    }}
                    className="mr-1 font-serif text-ocre-700 hover:underline dark:text-ocre-400"
                    aria-label={`Retour au renvoi ${n.id}`}
                  >
                    {toSuper(n.id)}.
                  </button>
                  <span className="font-serif italic">{n.texte}</span>
                </li>
              ))}
            </ol>
          </aside>
        </>
      )}

      <style jsx>{`
        :global(.note-glow) {
          background-color: rgba(201, 162, 39, 0.18) !important;
          box-shadow: 0 0 0 4px rgba(201, 162, 39, 0.18);
        }
      `}</style>
    </div>
  );
}

function renderTextWithNotes(
  text: string,
  notes: Map<number, Note>,
  onClick: (id: number) => () => void
) {
  const parts: (string | { id: number })[] = [];
  const regex = /\[\^(\d+)\]/g;
  let last = 0;
  let m: RegExpExecArray | null;
  while ((m = regex.exec(text)) !== null) {
    if (m.index > last) parts.push(text.slice(last, m.index));
    parts.push({ id: Number(m[1]) });
    last = m.index + m[0].length;
  }
  if (last < text.length) parts.push(text.slice(last));

  return parts.map((p, i) => {
    if (typeof p === "string") return <span key={i}>{p}</span>;
    if (!notes.has(p.id)) return <sup key={i}>{toSuper(p.id)}</sup>;
    return (
      <a
        key={i}
        href={`#note-${p.id}`}
        data-noteref={p.id}
        onClick={(e) => {
          e.preventDefault();
          onClick(p.id)();
        }}
        className="cursor-pointer align-baseline font-serif text-ocre-700 no-underline hover:underline dark:text-ocre-400"
        aria-label={`Note ${p.id}`}
      >
        <sup>{toSuper(p.id)}</sup>
      </a>
    );
  });
}

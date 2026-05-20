"use client";

import { motion } from "framer-motion";

interface Props {
  especeId: string;
  size?: number;
  animate?: boolean;
}

export function EspeceSprite({ especeId, size = 64, animate = false }: Props) {
  const props = { size };
  const sprite = (() => {
    switch (especeId) {
      case "plantain-lanceole":
        return <Plantain {...props} />;
      case "trefle-blanc":
        return <Trefle {...props} />;
      case "luzerne-lupuline":
        return <Luzerne {...props} />;
      case "cardamine-herissee":
        return <Cardamine {...props} />;
      case "pissenlit":
        return <Pissenlit {...props} />;
      case "bourrache":
        return <Bourrache {...props} />;
      case "marguerite":
        return <Marguerite {...props} />;
      case "achillee":
        return <Achillee {...props} />;
      case "coquelicot":
        return <Coquelicot {...props} />;
      case "bleuet":
        return <Bleuet {...props} />;
      case "mauve":
        return <Mauve {...props} />;
      case "veronique-acinus":
        return <Veronique {...props} />;
      default:
        return null;
    }
  })();
  if (!animate) return <>{sprite}</>;
  return (
    <motion.div
      initial={{ scale: 0.4, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
    >
      {sprite}
    </motion.div>
  );
}

const stroke = "#3a562f";
const strokeLight = "#5e7541";

function Plantain({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      {/* Tige + épi */}
      <line x1="32" y1="56" x2="32" y2="14" stroke={stroke} strokeWidth="1.5" />
      <ellipse cx="32" cy="12" rx="2.2" ry="6" fill="#928c5a" stroke={stroke} strokeWidth="0.7" />
      {[14, 18, 22, 26, 30, 34, 38].map((y, i) => (
        <circle key={i} cx={32 + (i % 2 === 0 ? -1.5 : 1.5)} cy={y} r="0.6" fill="#f3e2b0" />
      ))}
      {/* Feuilles lancéolées en rosette */}
      <path d="M 32 56 Q 16 50 12 44 Q 18 48 30 52 Z" fill="#7ea36a" stroke={strokeLight} strokeWidth="0.8" />
      <path d="M 32 56 Q 48 50 52 44 Q 46 48 34 52 Z" fill="#7ea36a" stroke={strokeLight} strokeWidth="0.8" />
      <path d="M 32 56 Q 24 52 18 50 Q 26 52 31 54 Z" fill="#8db178" stroke={strokeLight} strokeWidth="0.7" />
      <path d="M 32 56 Q 40 52 46 50 Q 38 52 33 54 Z" fill="#8db178" stroke={strokeLight} strokeWidth="0.7" />
    </svg>
  );
}

function Trefle({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      <line x1="32" y1="58" x2="32" y2="34" stroke={stroke} strokeWidth="1.2" />
      {/* 3 folioles */}
      <ellipse cx="26" cy="32" rx="6" ry="7" fill="#a3bf91" stroke={strokeLight} strokeWidth="0.8" />
      <ellipse cx="38" cy="32" rx="6" ry="7" fill="#a3bf91" stroke={strokeLight} strokeWidth="0.8" />
      <ellipse cx="32" cy="24" rx="6" ry="7" fill="#a3bf91" stroke={strokeLight} strokeWidth="0.8" />
      {/* Fleur blanche */}
      <circle cx="32" cy="14" r="5" fill="#f6f4e8" stroke="#9a9476" strokeWidth="0.6" />
      <circle cx="29" cy="13" r="1.2" fill="#e8e0c0" />
      <circle cx="34" cy="13" r="1.2" fill="#e8e0c0" />
      <circle cx="32" cy="15.5" r="1.2" fill="#e8e0c0" />
    </svg>
  );
}

function Luzerne({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      <line x1="32" y1="58" x2="22" y2="34" stroke={stroke} strokeWidth="1.2" />
      <line x1="32" y1="58" x2="42" y2="34" stroke={stroke} strokeWidth="1.2" />
      <line x1="32" y1="58" x2="32" y2="38" stroke={stroke} strokeWidth="1.2" />
      {/* Folioles */}
      <ellipse cx="22" cy="32" rx="4" ry="5" fill="#a3bf91" stroke={strokeLight} strokeWidth="0.6" />
      <ellipse cx="42" cy="32" rx="4" ry="5" fill="#a3bf91" stroke={strokeLight} strokeWidth="0.6" />
      <ellipse cx="32" cy="34" rx="4" ry="5" fill="#a3bf91" stroke={strokeLight} strokeWidth="0.6" />
      {/* Sphère jaune (inflorescence) */}
      <circle cx="32" cy="18" r="7" fill="#e5c043" stroke="#a07810" strokeWidth="0.8" />
      {[14, 16, 18, 20, 22].map((y, i) =>
        [28, 30, 32, 34, 36].map((x, j) => (
          <circle key={`${i}-${j}`} cx={x} cy={y} r="0.5" fill="#f1d56c" />
        ))
      )}
    </svg>
  );
}

function Cardamine({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      <line x1="32" y1="58" x2="32" y2="20" stroke={stroke} strokeWidth="1" />
      {/* Feuilles découpées */}
      <ellipse cx="24" cy="46" rx="4" ry="3" fill="#9bbb88" stroke={strokeLight} strokeWidth="0.6" />
      <ellipse cx="40" cy="46" rx="4" ry="3" fill="#9bbb88" stroke={strokeLight} strokeWidth="0.6" />
      <ellipse cx="26" cy="36" rx="3" ry="2.5" fill="#9bbb88" stroke={strokeLight} strokeWidth="0.6" />
      <ellipse cx="38" cy="36" rx="3" ry="2.5" fill="#9bbb88" stroke={strokeLight} strokeWidth="0.6" />
      {/* Petites fleurs croix */}
      {[[32, 16], [28, 22], [36, 22]].map(([cx, cy], i) => (
        <g key={i}>
          <rect x={cx - 0.6} y={cy - 3} width="1.2" height="6" fill="#f6f4e8" stroke="#aaa" strokeWidth="0.3" />
          <rect x={cx - 3} y={cy - 0.6} width="6" height="1.2" fill="#f6f4e8" stroke="#aaa" strokeWidth="0.3" />
          <circle cx={cx} cy={cy} r="0.7" fill="#e5c043" />
        </g>
      ))}
    </svg>
  );
}

function Pissenlit({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      <line x1="32" y1="58" x2="32" y2="22" stroke={stroke} strokeWidth="1.4" />
      {/* Feuilles découpées en pointes */}
      <path d="M 32 56 L 14 50 L 20 50 L 14 46 L 20 46 L 14 42 L 20 42 L 30 50 Z" fill="#7ea36a" stroke={strokeLight} strokeWidth="0.7" />
      <path d="M 32 56 L 50 50 L 44 50 L 50 46 L 44 46 L 50 42 L 44 42 L 34 50 Z" fill="#7ea36a" stroke={strokeLight} strokeWidth="0.7" />
      {/* Fleur jaune en rayons */}
      {Array.from({ length: 18 }).map((_, i) => {
        const a = (i / 18) * Math.PI * 2;
        return (
          <line
            key={i}
            x1={32 + Math.cos(a) * 5}
            y1={20 + Math.sin(a) * 5}
            x2={32 + Math.cos(a) * 11}
            y2={20 + Math.sin(a) * 11}
            stroke="#e5b91f"
            strokeWidth="1.6"
          />
        );
      })}
      <circle cx="32" cy="20" r="5" fill="#f0c130" stroke="#a07810" strokeWidth="0.8" />
      <circle cx="32" cy="20" r="2" fill="#a07810" />
    </svg>
  );
}

function Bourrache({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      <line x1="32" y1="58" x2="32" y2="32" stroke={stroke} strokeWidth="1.3" />
      <line x1="32" y1="40" x2="20" y2="32" stroke={stroke} strokeWidth="1" />
      <line x1="32" y1="40" x2="44" y2="32" stroke={stroke} strokeWidth="1" />
      {/* Feuilles velues */}
      <path d="M 16 50 Q 22 44 28 48 Q 22 52 16 50 Z" fill="#8db178" stroke={strokeLight} strokeWidth="0.7" />
      <path d="M 48 50 Q 42 44 36 48 Q 42 52 48 50 Z" fill="#8db178" stroke={strokeLight} strokeWidth="0.7" />
      {/* 3 étoiles bleues */}
      {[[32, 16, 6], [20, 28, 4], [44, 28, 4]].map(([cx, cy, r], i) => (
        <g key={i}>
          {Array.from({ length: 5 }).map((_, k) => {
            const a = (k / 5) * Math.PI * 2 - Math.PI / 2;
            return (
              <path
                key={k}
                d={`M ${cx} ${cy} L ${cx + Math.cos(a) * r} ${cy + Math.sin(a) * r} L ${cx + Math.cos(a + 0.3) * r * 0.4} ${cy + Math.sin(a + 0.3) * r * 0.4} Z`}
                fill="#5d8fc7"
                stroke="#2f4f7a"
                strokeWidth="0.4"
              />
            );
          })}
          <circle cx={cx} cy={cy} r="1.2" fill="#1c2c4a" />
        </g>
      ))}
    </svg>
  );
}

function Marguerite({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      <line x1="32" y1="58" x2="32" y2="26" stroke={stroke} strokeWidth="1.4" />
      <ellipse cx="22" cy="48" rx="5" ry="2.5" fill="#7ea36a" stroke={strokeLight} strokeWidth="0.6" />
      <ellipse cx="42" cy="48" rx="5" ry="2.5" fill="#7ea36a" stroke={strokeLight} strokeWidth="0.6" />
      {/* Pétales blancs */}
      {Array.from({ length: 10 }).map((_, i) => {
        const a = (i / 10) * Math.PI * 2;
        return (
          <ellipse
            key={i}
            cx={32 + Math.cos(a) * 7}
            cy={22 + Math.sin(a) * 7}
            rx="4"
            ry="2"
            fill="#f6f4e8"
            stroke="#aaa"
            strokeWidth="0.4"
            transform={`rotate(${(a * 180) / Math.PI + 90} ${32 + Math.cos(a) * 7} ${22 + Math.sin(a) * 7})`}
          />
        );
      })}
      <circle cx="32" cy="22" r="4" fill="#f0c130" stroke="#a07810" strokeWidth="0.7" />
    </svg>
  );
}

function Achillee({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      <line x1="32" y1="58" x2="32" y2="18" stroke={stroke} strokeWidth="1.4" />
      {/* Feuilles plumeuses */}
      {[42, 38, 34, 30].map((y, i) => (
        <g key={i}>
          <line x1="32" y1={y} x2="20" y2={y - 1} stroke={strokeLight} strokeWidth="0.5" />
          <line x1="32" y1={y} x2="44" y2={y - 1} stroke={strokeLight} strokeWidth="0.5" />
          {Array.from({ length: 6 }).map((_, k) => (
            <line
              key={k}
              x1={20 + k * 2}
              y1={y - 1}
              x2={20 + k * 2}
              y2={y - 3}
              stroke="#8db178"
              strokeWidth="0.4"
            />
          ))}
          {Array.from({ length: 6 }).map((_, k) => (
            <line
              key={k}
              x1={32 + k * 2}
              y1={y - 1}
              x2={32 + k * 2}
              y2={y - 3}
              stroke="#8db178"
              strokeWidth="0.4"
            />
          ))}
        </g>
      ))}
      {/* Ombelles blanches */}
      {[[28, 14], [32, 12], [36, 14], [30, 16], [34, 16]].map(([cx, cy], i) => (
        <circle key={i} cx={cx} cy={cy} r="1.8" fill="#f6f4e8" stroke="#9a9476" strokeWidth="0.4" />
      ))}
    </svg>
  );
}

function Coquelicot({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      <line x1="32" y1="58" x2="32" y2="24" stroke={stroke} strokeWidth="1.3" />
      <ellipse cx="22" cy="50" rx="4" ry="2" fill="#7ea36a" stroke={strokeLight} strokeWidth="0.6" />
      <ellipse cx="42" cy="50" rx="4" ry="2" fill="#7ea36a" stroke={strokeLight} strokeWidth="0.6" />
      {/* 4 pétales rouges chiffonnés */}
      <path d="M 32 22 Q 22 14 18 22 Q 22 30 32 24 Z" fill="#d12d2d" stroke="#8a1a1a" strokeWidth="0.6" />
      <path d="M 32 22 Q 42 14 46 22 Q 42 30 32 24 Z" fill="#d12d2d" stroke="#8a1a1a" strokeWidth="0.6" />
      <path d="M 32 22 Q 24 12 32 8 Q 40 12 32 22 Z" fill="#e63c3c" stroke="#8a1a1a" strokeWidth="0.6" />
      <path d="M 32 22 Q 26 28 32 32 Q 38 28 32 22 Z" fill="#b32424" stroke="#8a1a1a" strokeWidth="0.5" />
      <circle cx="32" cy="22" r="2" fill="#1c0d04" />
      {[24, 26, 28, 30, 32, 34, 36, 38, 40].map((x, i) => (
        <line key={i} x1="32" y1="22" x2={x} y2={20 + (i % 3) - 1} stroke="#1c0d04" strokeWidth="0.4" />
      ))}
    </svg>
  );
}

function Bleuet({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      <line x1="32" y1="58" x2="32" y2="26" stroke={stroke} strokeWidth="1.3" />
      <line x1="22" y1="50" x2="32" y2="44" stroke={strokeLight} strokeWidth="0.7" />
      <line x1="42" y1="50" x2="32" y2="44" stroke={strokeLight} strokeWidth="0.7" />
      {/* Capitule bleu indigo dentelé */}
      {Array.from({ length: 14 }).map((_, i) => {
        const a = (i / 14) * Math.PI * 2;
        const r = i % 2 === 0 ? 9 : 6;
        return (
          <line
            key={i}
            x1={32}
            y1={22}
            x2={32 + Math.cos(a) * r}
            y2={22 + Math.sin(a) * r}
            stroke="#3f5fa6"
            strokeWidth="2"
            strokeLinecap="round"
          />
        );
      })}
      <circle cx="32" cy="22" r="3.5" fill="#5e7eb8" stroke="#2a4080" strokeWidth="0.6" />
      <circle cx="32" cy="22" r="1.5" fill="#1f2f5e" />
    </svg>
  );
}

function Mauve({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      <line x1="32" y1="58" x2="32" y2="22" stroke={stroke} strokeWidth="1.3" />
      <path d="M 18 50 Q 24 42 30 46 Q 28 52 18 50 Z" fill="#9bbb88" stroke={strokeLight} strokeWidth="0.6" />
      <path d="M 46 50 Q 40 42 34 46 Q 36 52 46 50 Z" fill="#9bbb88" stroke={strokeLight} strokeWidth="0.6" />
      {/* Fleur à 5 pétales violet rayé */}
      {Array.from({ length: 5 }).map((_, i) => {
        const a = (i / 5) * Math.PI * 2 - Math.PI / 2;
        const cx = 32 + Math.cos(a) * 5;
        const cy = 18 + Math.sin(a) * 5;
        return (
          <g key={i}>
            <ellipse
              cx={cx}
              cy={cy}
              rx="5"
              ry="3"
              fill="#b08bb6"
              stroke="#6a4880"
              strokeWidth="0.5"
              transform={`rotate(${(a * 180) / Math.PI + 90} ${cx} ${cy})`}
            />
            <line
              x1={cx}
              y1={cy}
              x2={cx + Math.cos(a) * 3}
              y2={cy + Math.sin(a) * 3}
              stroke="#6a4880"
              strokeWidth="0.5"
            />
          </g>
        );
      })}
      <circle cx="32" cy="18" r="2" fill="#4a2a5e" />
    </svg>
  );
}

function Veronique({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      <line x1="32" y1="58" x2="32" y2="20" stroke={stroke} strokeWidth="1" />
      {[44, 38, 32, 26].map((y, i) => (
        <g key={i}>
          <ellipse cx={26 + (i % 2) * 12} cy={y} rx="2.5" ry="1.5" fill="#9bbb88" stroke={strokeLight} strokeWidth="0.4" />
        </g>
      ))}
      {/* 4 mini pétales bleus tendres */}
      {[[32, 18], [28, 22], [36, 22], [32, 14]].map(([cx, cy], i) => (
        <g key={i}>
          <circle cx={cx} cy={cy - 1.5} r="1.2" fill="#7eb2dc" stroke="#3f5fa6" strokeWidth="0.3" />
          <circle cx={cx} cy={cy + 1.5} r="1.2" fill="#7eb2dc" stroke="#3f5fa6" strokeWidth="0.3" />
          <circle cx={cx - 1.5} cy={cy} r="1.2" fill="#7eb2dc" stroke="#3f5fa6" strokeWidth="0.3" />
          <circle cx={cx + 1.5} cy={cy} r="1.2" fill="#7eb2dc" stroke="#3f5fa6" strokeWidth="0.3" />
          <circle cx={cx} cy={cy} r="0.6" fill="#f0c130" />
        </g>
      ))}
      <text x="32" y="60" textAnchor="middle" fontSize="4" fill={stroke}>protégée</text>
    </svg>
  );
}

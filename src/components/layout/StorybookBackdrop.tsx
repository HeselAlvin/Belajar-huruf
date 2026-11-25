import type { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface StorybookBackdropProps {
  variant?: 'sky' | 'cream';
  children: ReactNode;
}

function CloudSvg({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 180 86" fill="none" className={className}>
      <path
        d="M32 72H148C162 72 172 62 172 50C172 39 164 30 152 29C147 13 132 4 114 4C99 4 86 12 79 24C74 21 68 19 61 19C45 19 33 30 31 45C18 46 8 55 8 64C8 69 18 72 32 72Z"
        fill="#FFFFFF"
        stroke="#3D2314"
        strokeOpacity="0.16"
        strokeWidth="3.5"
      />
      {}
      <path
        d="M36 64H144"
        stroke="#DCEEFF"
        strokeWidth="5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function Flower({
  petalColor,
  centerColor = '#FFD166',
  size = 44,
  delay = 0,
}: {
  petalColor: string;
  centerColor?: string;
  size?: number;
  delay?: number;
}) {
  return (
    <motion.svg
      width={size}
      height={size * 1.35}
      viewBox="0 0 44 60"
      fill="none"
      style={{ originX: '50%', originY: '100%' }}
      animate={{ rotate: [-5, 5, -5] }}
      transition={{ duration: 3.2, delay, repeat: Infinity, ease: 'easeInOut' }}
    >
      {/* Batang & Daun */}
      <path d="M22 24V58" stroke="#2F855A" strokeWidth="4" strokeLinecap="round" />
      <path
        d="M22 45C14 45 10 39 11 35C16 35 21 39 22 45Z"
        fill="#4ADE80"
        stroke="#3D2314"
        strokeWidth="2.2"
      />
      <path
        d="M22 48C30 48 34 42 33 38C28 38 23 42 22 48Z"
        fill="#4ADE80"
        stroke="#3D2314"
        strokeWidth="2.2"
      />
      {/* Kelopak */}
      <circle cx="22" cy="11" r="7" fill={petalColor} stroke="#3D2314" strokeWidth="2.2" />
      <circle cx="32" cy="18" r="7" fill={petalColor} stroke="#3D2314" strokeWidth="2.2" />
      <circle cx="28" cy="29" r="7" fill={petalColor} stroke="#3D2314" strokeWidth="2.2" />
      <circle cx="16" cy="29" r="7" fill={petalColor} stroke="#3D2314" strokeWidth="2.2" />
      <circle cx="12" cy="18" r="7" fill={petalColor} stroke="#3D2314" strokeWidth="2.2" />
      {/* Tengah bunga */}
      <circle cx="22" cy="21" r="6.5" fill={centerColor} stroke="#3D2314" strokeWidth="2.2" />
    </motion.svg>
  );
}

function GrassTuft({ className }: { className?: string }) {
  return (
    <svg width="34" height="22" viewBox="0 0 34 22" fill="none" className={className}>
      <path
        d="M6 20C5 13 3 9 2 6C7 9 11 13 13 18C14 10 16 5 18 2C19 8 20 13 21 18C24 12 27 8 32 6C29 11 27 15 26 20"
        stroke="#3D2314"
        strokeOpacity="0.45"
        strokeWidth="2.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function Butterfly({
  wingColor,
  accentColor,
  className,
  reverse = false,
}: {
  wingColor: string;
  accentColor: string;
  className?: string;
  reverse?: boolean;
}) {
  return (
    <motion.div
      aria-hidden="true"
      className={`pointer-events-none fixed z-0 ${className ?? ''}`}
      animate={{
        x: reverse ? [0, -18, 8, 0] : [0, 20, -10, 0],
        y: [0, -16, -6, 0],
        rotate: reverse ? [4, -8, 6, 4] : [-6, 8, -4, -6],
      }}
      transition={{ duration: 6.5, repeat: Infinity, ease: 'easeInOut' }}
    >
      <motion.svg
        width="44"
        height="36"
        viewBox="0 0 44 36"
        fill="none"
        animate={{ scaleX: [1, 0.72, 1] }}
        transition={{ duration: 0.45, repeat: Infinity, ease: 'easeInOut' }}
      >
        <ellipse cx="13" cy="14" rx="10" ry="8" fill={wingColor} stroke="#3D2314" strokeWidth="2.4" />
        <ellipse cx="31" cy="14" rx="10" ry="8" fill={wingColor} stroke="#3D2314" strokeWidth="2.4" />
        <ellipse cx="15" cy="24" rx="7" ry="6" fill={accentColor} stroke="#3D2314" strokeWidth="2.4" />
        <ellipse cx="29" cy="24" rx="7" ry="6" fill={accentColor} stroke="#3D2314" strokeWidth="2.4" />
        <rect x="19.5" y="9" width="5" height="20" rx="2.5" fill="#3D2314" />
        <path d="M21 9C19 5 17 4 15 4" stroke="#3D2314" strokeWidth="2" strokeLinecap="round" />
        <path d="M23 9C25 5 27 4 29 4" stroke="#3D2314" strokeWidth="2" strokeLinecap="round" />
      </motion.svg>
    </motion.div>
  );
}

export function StorybookBackdrop({
  variant = 'cream',
  children,
}: StorybookBackdropProps) {
  return (
    <div
      className={`relative min-h-screen w-full overflow-x-hidden transition-colors duration-500 ${
        variant === 'sky'
          ? 'bg-gradient-to-b from-[#BDE4FF] via-[#DCF2FF] to-[#F3FBFF]'
          : 'bg-[#FFF8EE]'
      }`}
    >
      {/* ==================== ELEMEN LANGIT (MENU UTAMA) ==================== */}
      {variant === 'sky' && (
        <>
          {/* Pelangi Pastel Lembut di Latar */}
          <svg
            aria-hidden="true"
            viewBox="0 0 800 380"
            fill="none"
            className="pointer-events-none fixed top-6 left-1/2 z-0 w-[680px] -translate-x-1/2 opacity-40 sm:w-[920px]"
          >
            <path d="M70 360 A330 330 0 0 1 730 360" stroke="#FF8FA3" strokeWidth="18" strokeLinecap="round" />
            <path d="M90 360 A310 310 0 0 1 710 360" stroke="#FFB703" strokeWidth="18" strokeLinecap="round" />
            <path d="M110 360 A290 290 0 0 1 690 360" stroke="#FFE066" strokeWidth="18" strokeLinecap="round" />
            <path d="M130 360 A270 270 0 0 1 670 360" stroke="#80ED99" strokeWidth="18" strokeLinecap="round" />
            <path d="M150 360 A250 250 0 0 1 650 360" stroke="#72EFDD" strokeWidth="18" strokeLinecap="round" />
          </svg>

          {/* Matahari Ceria di Pojok Kiri Atas */}
          <div
            aria-hidden="true"
            className="pointer-events-none fixed top-4 left-4 z-0 sm:top-6 sm:left-8"
          >
            <div className="relative flex h-24 w-24 items-center justify-center sm:h-28 sm:w-28">
              {/* Sinar berputar pelan */}
              <motion.svg
                viewBox="0 0 120 120"
                className="absolute inset-0 h-full w-full"
                animate={{ rotate: 360 }}
                transition={{ duration: 28, repeat: Infinity, ease: 'linear' }}
              >
                {Array.from({ length: 12 }).map((_, i) => (
                  <rect
                    key={i}
                    x="57"
                    y="4"
                    width="6"
                    height="15"
                    rx="3"
                    fill="#FBBF24"
                    stroke="#3D2314"
                    strokeWidth="2"
                    transform={`rotate(${i * 30} 60 60)`}
                  />
                ))}
              </motion.svg>
              {/* Wajah Matahari */}
              <svg viewBox="0 0 80 80" className="relative h-16 w-16 sm:h-18 sm:w-18">
                <circle cx="40" cy="40" r="32" fill="#FFD166" stroke="#3D2314" strokeWidth="3.5" />
                <circle cx="30" cy="36" r="3.2" fill="#3D2314" />
                <circle cx="50" cy="36" r="3.2" fill="#3D2314" />
                <ellipse cx="23" cy="43" rx="4.5" ry="2.8" fill="#FB7185" opacity="0.65" />
                <ellipse cx="57" cy="43" rx="4.5" ry="2.8" fill="#FB7185" opacity="0.65" />
                <path
                  d="M32 45C35 50 45 50 48 45"
                  stroke="#3D2314"
                  strokeWidth="3"
                  strokeLinecap="round"
                  fill="none"
                />
              </svg>
            </div>
          </div>

          {/* 3 Awan Melayang Berlapis */}
          <motion.div
            aria-hidden="true"
            className="pointer-events-none fixed top-20 left-[14%] z-0 hidden sm:block"
            animate={{ x: [0, 26, 0] }}
            transition={{ duration: 11, repeat: Infinity, ease: 'easeInOut' }}
          >
            <CloudSvg className="w-36 opacity-95" />
          </motion.div>

          <motion.div
            aria-hidden="true"
            className="pointer-events-none fixed top-12 right-[18%] z-0"
            animate={{ x: [0, -24, 0] }}
            transition={{ duration: 13, repeat: Infinity, ease: 'easeInOut' }}
          >
            <CloudSvg className="w-32 opacity-90 sm:w-44" />
          </motion.div>

          <motion.div
            aria-hidden="true"
            className="pointer-events-none fixed top-40 -right-8 z-0 opacity-80"
            animate={{ x: [0, -18, 0] }}
            transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
          >
            <CloudSvg className="w-36" />
          </motion.div>

          {/* 2 Kupu-kupu Terbang */}
          <Butterfly
            wingColor="#FB923C"
            accentColor="#FDE047"
            className="top-[36%] left-[5%] hidden lg:block"
          />
          <Butterfly
            wingColor="#F472B6"
            accentColor="#FBCFE8"
            className="top-[30%] right-[6%] hidden lg:block"
            reverse
          />

          {/* Bintang & Kilau Kecil */}
          <motion.span
            aria-hidden="true"
            className="pointer-events-none fixed top-16 left-[27%] z-0 text-2xl text-[#FBBF24]"
            animate={{ scale: [1, 1.25, 1], rotate: [0, 14, 0] }}
            transition={{ duration: 3.6, repeat: Infinity, ease: 'easeInOut' }}
          >
            ★
          </motion.span>
          <motion.span
            aria-hidden="true"
            className="pointer-events-none fixed top-24 right-[28%] z-0 text-xl text-[#FB7185]"
            animate={{ scale: [1, 1.22, 1], rotate: [0, -16, 0] }}
            transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
          >
            ★
          </motion.span>

          {/* ==================== BUKIT, TANAH & TAMAN BAWAH ==================== */}
          <div
            aria-hidden="true"
            className="pointer-events-none fixed right-0 bottom-0 left-0 z-0 h-40 overflow-hidden sm:h-48"
          >
            {/* Pohon Kiri (di belakang bukit depan) */}
            <svg
              viewBox="0 0 120 150"
              fill="none"
              className="absolute bottom-14 -left-4 hidden h-36 w-28 md:block"
            >
              <rect x="49" y="88" width="22" height="58" rx="6" fill="#A46B3C" stroke="#3D2314" strokeWidth="3.5" />
              <circle cx="60" cy="60" r="36" fill="#52B75B" stroke="#3D2314" strokeWidth="3.5" />
              <circle cx="36" cy="74" r="24" fill="#63C76B" stroke="#3D2314" strokeWidth="3.5" />
              <circle cx="84" cy="74" r="24" fill="#63C76B" stroke="#3D2314" strokeWidth="3.5" />
              <circle cx="48" cy="54" r="6" fill="#FF6B6B" stroke="#3D2314" strokeWidth="2.2" />
              <circle cx="72" cy="66" r="6" fill="#FF6B6B" stroke="#3D2314" strokeWidth="2.2" />
            </svg>

            {/* Pohon Kanan (di belakang bukit depan) */}
            <svg
              viewBox="0 0 120 150"
              fill="none"
              className="absolute -right-3 bottom-14 hidden h-36 w-28 md:block"
            >
              <rect x="49" y="88" width="22" height="58" rx="6" fill="#A46B3C" stroke="#3D2314" strokeWidth="3.5" />
              <circle cx="60" cy="60" r="36" fill="#4EB358" stroke="#3D2314" strokeWidth="3.5" />
              <circle cx="36" cy="74" r="24" fill="#68CC70" stroke="#3D2314" strokeWidth="3.5" />
              <circle cx="84" cy="74" r="24" fill="#68CC70" stroke="#3D2314" strokeWidth="3.5" />
              <circle cx="66" cy="50" r="6" fill="#FFD166" stroke="#3D2314" strokeWidth="2.2" />
              <circle cx="46" cy="70" r="6" fill="#FFD166" stroke="#3D2314" strokeWidth="2.2" />
            </svg>

            {/* Lapisan 1: Bukit Belakang (Hijau Muda) */}
            <svg
              viewBox="0 0 1440 180"
              preserveAspectRatio="none"
              className="absolute bottom-0 left-0 h-36 w-full sm:h-44"
            >
              <path
                d="M0,95 C220,25 460,120 740,75 C1020,30 1260,110 1440,55 L1440,180 L0,180 Z"
                fill="#B5EC8B"
                stroke="#3D2314"
                strokeOpacity="0.35"
                strokeWidth="3.5"
              />
            </svg>

            {/* Pagar Kayu Mini di Pinggir Kiri */}
            <svg
              viewBox="0 0 130 56"
              fill="none"
              className="absolute bottom-14 left-[7%] hidden h-12 w-28 lg:block"
            >
              <rect x="4" y="20" width="122" height="8" rx="3" fill="#E9B872" stroke="#3D2314" strokeWidth="2.6" />
              <rect x="4" y="36" width="122" height="8" rx="3" fill="#E9B872" stroke="#3D2314" strokeWidth="2.6" />
              {[14, 44, 74, 104].map((x) => (
                <path
                  key={x}
                  d={`M${x} 54V14L${x + 8} 4L${x + 16} 14V54H${x}Z`}
                  fill="#F6CA83"
                  stroke="#3D2314"
                  strokeWidth="2.6"
                />
              ))}
            </svg>

            {/* Lapisan 2: Bukit Tengah (Hijau Cerah) */}
            <svg
              viewBox="0 0 1440 160"
              preserveAspectRatio="none"
              className="absolute bottom-0 left-0 h-26 w-full sm:h-30"
            >
              <path
                d="M0,72 C280,18 540,108 860,52 C1120,8 1310,68 1440,42 L1440,160 L0,160 Z"
                fill="#82D964"
                stroke="#3D2314"
                strokeWidth="4"
              />
            </svg>

            {/* Lapisan 3: Lapisan Tanah/Rumput Bawah Lebih Gelap + Jalan Setapak */}
            <svg
              viewBox="0 0 1440 90"
              preserveAspectRatio="none"
              className="absolute bottom-0 left-0 h-11 w-full sm:h-13"
            >
              <path
                d="M0,38 C320,10 640,62 980,26 C1200,4 1340,34 1440,22 L1440,90 L0,90 Z"
                fill="#63C14C"
              />
              {/* Strip tanah cokelat hangat paling bawah */}
              <path
                d="M0,68 C360,54 780,78 1140,60 C1280,53 1380,62 1440,58 L1440,90 L0,90 Z"
                fill="#C88D55"
                stroke="#3D2314"
                strokeWidth="3"
              />
            </svg>

            {/* Bunga-bunga, Semak, Jamur & Rumput Kecil (Proporsi Tetap Bulat) */}
            <div className="absolute bottom-4 left-[4%]">
              <Flower petalColor="#FF7AA2" size={38} delay={0} />
            </div>
            <div className="absolute bottom-6 left-[12%] hidden sm:block">
              <Flower petalColor="#FFFFFF" centerColor="#FB923C" size={32} delay={0.6} />
            </div>
            <div className="absolute bottom-3 left-[24%] hidden md:block">
              <GrassTuft />
            </div>

            {/* Jamur Lucu di Kanan */}
            <svg
              viewBox="0 0 56 54"
              fill="none"
              className="absolute right-[19%] bottom-5 hidden h-11 w-11 md:block"
            >
              <rect x="20" y="26" width="16" height="24" rx="6" fill="#FFF3D6" stroke="#3D2314" strokeWidth="3" />
              <path
                d="M6 30C6 15 16 6 28 6C40 6 50 15 50 30H6Z"
                fill="#EF4444"
                stroke="#3D2314"
                strokeWidth="3"
              />
              <circle cx="20" cy="18" r="4" fill="#FFFFFF" />
              <circle cx="35" cy="16" r="3.5" fill="#FFFFFF" />
              <circle cx="30" cy="24" r="3" fill="#FFFFFF" />
            </svg>

            <div className="absolute right-[11%] bottom-5 hidden sm:block">
              <Flower petalColor="#FACC15" centerColor="#F97316" size={34} delay={0.9} />
            </div>
            <div className="absolute right-[4%] bottom-4">
              <Flower petalColor="#C084FC" size={40} delay={0.3} />
            </div>
            <div className="absolute right-[30%] bottom-4 hidden md:block">
              <GrassTuft />
            </div>

            {/* Batu Kecil di Lapisan Tanah */}
            <svg
              viewBox="0 0 60 24"
              fill="none"
              className="absolute bottom-1 left-[34%] hidden h-5 w-14 sm:block"
            >
              <ellipse cx="20" cy="14" rx="14" ry="7" fill="#E2B07E" stroke="#3D2314" strokeWidth="2.4" />
              <ellipse cx="44" cy="16" rx="9" ry="5" fill="#D99B66" stroke="#3D2314" strokeWidth="2.4" />
            </svg>
          </div>
        </>
      )}

      {/* ==================== DEKORASI HALAMAN MATERI (CREAM) ==================== */}
      {variant === 'cream' && (
        <>
          {/* Pola Polkadot Lembut */}
          <div
            aria-hidden="true"
            className="pointer-events-none fixed inset-0 z-0 opacity-35"
            style={{
              backgroundImage: 'radial-gradient(#E7C9A9 2px, transparent 2px)',
              backgroundSize: '28px 28px',
            }}
          />
          <motion.div
            aria-hidden="true"
            className="pointer-events-none fixed top-12 -left-10 z-0 opacity-75"
            animate={{ x: [0, 20, 0] }}
            transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
          >
            <CloudSvg className="w-36" />
          </motion.div>
          <motion.div
            aria-hidden="true"
            className="pointer-events-none fixed top-24 -right-8 z-0 opacity-75"
            animate={{ x: [0, -20, 0] }}
            transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
          >
            <CloudSvg className="w-32" />
          </motion.div>
        </>
      )}

      {/* Konten Utama */}
      <div className="relative z-10 min-h-screen">{children}</div>
    </div>
  );
}
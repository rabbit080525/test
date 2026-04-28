import React, { useState, useRef } from 'react';
import { Search, ShoppingBag } from 'lucide-react';

/* ─── data ─────────────────────────────────────────── */
const TABS = [
  { id: '세레모니 룩', label: '세레모니 룩', dot: true },
  { id: '홈',         label: '홈' },
  { id: '추천',       label: '추천' },
  { id: '베스트',     label: '베스트' },
  { id: '세일',       label: '세일' },
  { id: '단독',       label: '단독' },
];

const BRANDS = [
  { id: 1, name: '우이' },
  { id: 2, name: '프론트로우' },
  { id: 3, name: '레이지지' },
  { id: 4, name: '르세지엠' },
  { id: 5, name: '마르디' },
];

const BANNER_IMAGE =
  'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=800&q=90&auto=format&fit=crop';

/* ─── component ─────────────────────────────────────── */
export default function WConceptApp() {
  const [activeTab, setActiveTab] = useState('추천');
  const tabsRef = useRef(null);

  return (
    <div
      className="relative max-w-[390px] mx-auto bg-white min-h-screen overflow-x-hidden select-none"
      style={{
        fontFamily:
          "'Inter', 'Pretendard', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      }}
    >
      {/* ── Status bar spacer (mobile feel) ── */}
      <div className="h-12" />

      {/* ══════════════════════════════════════
          TOP NAVIGATION
      ══════════════════════════════════════ */}
      <header className="flex items-center justify-between px-5 pb-[18px]">
        {/* Logo */}
        <h1
          className="text-black leading-none"
          style={{ fontSize: 21, fontWeight: 700, letterSpacing: '0.2em' }}
        >
          W CONCEPT
        </h1>

        {/* Icons */}
        <div className="flex items-center gap-[18px]">
          <button
            aria-label="검색"
            className="flex items-center justify-center w-8 h-8 -mr-1"
          >
            <Search size={21} strokeWidth={1} className="text-black" />
          </button>

          <button
            aria-label="장바구니"
            className="relative flex items-center justify-center w-8 h-8"
          >
            <ShoppingBag size={21} strokeWidth={1} className="text-black" />
            {/* Badge */}
            <span
              className="absolute top-0 right-0 flex items-center justify-center bg-black rounded-full text-white"
              style={{
                width: 16,
                height: 16,
                fontSize: 9,
                fontWeight: 600,
                lineHeight: 1,
                transform: 'translate(30%, -20%)',
              }}
            >
              8
            </span>
          </button>
        </div>
      </header>

      {/* ══════════════════════════════════════
          CATEGORY TABS
      ══════════════════════════════════════ */}
      <div
        ref={tabsRef}
        className="flex items-center gap-[7px] px-5 pb-5 overflow-x-auto scrollbar-hide"
      >
        {TABS.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={[
                'relative flex-shrink-0 flex items-center gap-[4px]',
                'px-[14px] rounded-full transition-all duration-200',
                isActive
                  ? 'bg-black text-white border border-black'
                  : 'bg-white text-black border border-gray-200',
              ].join(' ')}
              style={{ height: 34, fontSize: 13, fontWeight: isActive ? 500 : 400 }}
            >
              <span>{tab.label}</span>
              {tab.dot && (
                <span
                  className="flex-shrink-0 rounded-full bg-orange-500"
                  style={{ width: 5, height: 5, marginTop: -8, marginRight: -2 }}
                />
              )}
            </button>
          );
        })}
      </div>

      {/* ══════════════════════════════════════
          MAIN BANNER
      ══════════════════════════════════════ */}
      <div className="px-4">
        <div
          className="relative w-full rounded-2xl overflow-hidden"
          style={{ aspectRatio: '3 / 3.7' }}
        >
          {/* Photo */}
          <img
            src={BANNER_IMAGE}
            alt="르세지엠 브랜드 스토리"
            className="absolute inset-0 w-full h-full object-cover"
            style={{ objectPosition: 'center 15%' }}
            loading="eager"
            decoding="async"
          />

          {/* Gradient overlay — bottom to top */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                'linear-gradient(to top, rgba(0,0,0,0.76) 0%, rgba(0,0,0,0.28) 40%, rgba(0,0,0,0) 65%)',
            }}
          />

          {/* Text content */}
          <div className="absolute bottom-0 left-0 right-0 px-5 pb-6 flex flex-col items-start">
            {/* "관심있는 브랜드" badge */}
            <div
              className="flex items-center gap-[5px] mb-[11px]"
              style={{
                background: 'rgba(0,0,0,0.75)',
                borderRadius: 100,
                padding: '5px 12px 5px 10px',
              }}
            >
              <span style={{ fontSize: 11, color: '#ff7070', lineHeight: 1 }}>♥</span>
              <span
                className="text-white"
                style={{ fontSize: 11, fontWeight: 400, letterSpacing: '0.03em', lineHeight: 1 }}
              >
                관심있는 브랜드
              </span>
            </div>

            {/* Main headline */}
            <h2
              className="text-white"
              style={{
                fontSize: 25,
                fontWeight: 300,
                letterSpacing: '-0.01em',
                lineHeight: 1.34,
                margin: 0,
              }}
            >
              출근룩으로 단정하게
              <br />
              입기 좋은 르세지엠
            </h2>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════
          관심 브랜드 새 소식
      ══════════════════════════════════════ */}
      <section className="pt-8 pb-10">
        {/* Section title */}
        <h3
          className="px-5 mb-5 text-black"
          style={{ fontSize: 17, fontWeight: 600, letterSpacing: '-0.025em', margin: '0 0 20px' }}
        >
          관심 브랜드 새 소식
        </h3>

        {/* Brand list */}
        <div
          className="flex gap-[18px] px-5 overflow-x-auto scrollbar-hide"
        >
          {BRANDS.map((brand) => (
            <button
              key={brand.id}
              className="flex flex-col items-center gap-[9px] flex-shrink-0 cursor-pointer"
              aria-label={brand.name}
            >
              {/* Circle avatar placeholder */}
              <div
                className="rounded-full"
                style={{
                  width: 68,
                  height: 68,
                  background: '#F4F4F4',
                  border: '1px solid #E6E6E6',
                  flexShrink: 0,
                }}
              />
              {/* Brand name */}
              <span
                style={{
                  fontSize: 11.5,
                  fontWeight: 400,
                  color: '#555555',
                  letterSpacing: '0.01em',
                  lineHeight: 1,
                  whiteSpace: 'nowrap',
                }}
              >
                {brand.name}
              </span>
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}

import React, { useState, useRef, useCallback } from 'react';
import { Search, ShoppingBag, Heart } from 'lucide-react';

/* ─── data ─────────────────────────────────────────── */
const TABS = [
  { id: '세레모니 룩', label: '세레모니 룩', dot: true },
  { id: '홈',         label: '홈' },
  { id: '추천',       label: '추천' },
  { id: '베스트',     label: '베스트' },
  { id: '세일',       label: '세일' },
  { id: '단독',       label: '단독' },
];

const BANNERS = [
  {
    id: 1,
    image: '/banner.jpg',
    badge: '관심있는 브랜드',
    title: '출근룩으로 단정하게\n입기 좋은 르세지엠',
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&q=90&auto=format&fit=crop',
    title: '봄을 맞이하는\n마르디의 새 컬렉션',
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&q=90&auto=format&fit=crop',
    title: '지금만 만날 수 있는\n프론트로우 시즌 오프',
  },
];

const BRANDS = [
  { id: 1, name: '우이',      hasNewArrivals: true,  logo: '/oui_logo.jpg'        },
  { id: 2, name: '프론트로우', hasNewArrivals: false, logo: '/frontrow_logo.jpg'   },
  { id: 3, name: '레이지지',  hasNewArrivals: false, logo: '/lazy_logo.jpg'        },
  { id: 4, name: '르세지엠',  hasNewArrivals: true,  logo: '/LESEIZIEME_logo.jpg'  },
  { id: 5, name: '마르디',    hasNewArrivals: false, logo: null                   },
];

const RELATED_PRODUCTS = [
  { id: 1,  brand: '마른파이브',   name: '[1+1] 일체형 캠내장 모달 크롭 탑',   discount: 39, price: 24160 },
  { id: 2,  brand: '마른파이브',   name: '[1+1] 모달 코튼 캠내장 크롭 탑',     discount: 34, price: 29832 },
  { id: 3,  brand: '브아빗포우먼', name: '[NEW컬러] 베이직 캐미솔 크롭 탑',     discount: 38, price: 48600 },
  { id: 4,  brand: '시아쥬',       name: 'SITP5147 노블 시어서커 오버핏 셔츠',  discount: 28, price: 62640 },
  { id: 5,  brand: '아무르 무아르', name: '블라인드 시스루 퍼프 블라우스',       discount: 25, price: 81532 },
  { id: 6,  brand: '르베티',       name: '시어서커 루즈핏 스트라이프 블라우스', discount: 37, price: 56010 },
];

/* ─── shared scroll style ────────────────────────────── */
const SCROLL_STYLE = {
  WebkitOverflowScrolling: 'touch', /* iOS 관성 스크롤 */
  scrollbarWidth: 'none',
  msOverflowStyle: 'none',
};

/* ─── BrandAvatar ────────────────────────────────────── */
function BrandAvatar({ brand }) {
  const { name, hasNewArrivals, logo } = brand;
  return (
    <button
      aria-label={name}
      className="flex flex-col items-center flex-shrink-0"
      style={{ gap: 9 }}
    >
      {/* ring + gap layer */}
      <div
        style={{
          borderRadius: '50%',
          padding: 3,
          border: hasNewArrivals ? '2px solid #FF3300' : '1px solid #E6E6E6',
        }}
      >
        {/* avatar circle */}
        <div
          style={{
            width: 64,
            height: 64,
            borderRadius: '50%',
            background: '#F2F2F2',
            overflow: 'hidden',
            outline: '2px solid #fff',
            outlineOffset: -2,
          }}
        >
          {logo ? (
            <img
              src={logo}
              alt={name}
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            />
          ) : (
            <div
              style={{
                width: '100%', height: '100%',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 18, fontWeight: 300, color: '#999',
              }}
            >
              {name.charAt(0)}
            </div>
          )}
        </div>
      </div>

      {/* brand name */}
      <span
        style={{
          fontSize: 11.5,
          fontWeight: hasNewArrivals ? 500 : 400,
          color: hasNewArrivals ? '#111' : '#666',
          letterSpacing: '0.01em',
          lineHeight: 1,
          whiteSpace: 'nowrap',
        }}
      >
        {name}
      </span>
    </button>
  );
}

/* ─── ProductCard ────────────────────────────────────── */
function ProductCard({ item }) {
  const [liked, setLiked] = useState(false);
  return (
    <div className="flex-shrink-0" style={{ width: 152 }}>
      {/* 3:4 이미지 */}
      <div className="relative overflow-hidden rounded-sm" style={{ aspectRatio: '3 / 4' }}>
        <img
          src={`https://loremflickr.com/400/533/fashion,woman?lock=${item.id}`}
          alt={item.name}
          className="w-full h-full object-cover"
          loading="lazy"
          decoding="async"
        />
        {/* 하트 아이콘 */}
        <button
          aria-label="관심 상품"
          onClick={() => setLiked((v) => !v)}
          className="absolute bottom-[7px] right-[7px] flex items-center justify-center"
          style={{
            width: 26, height: 26,
            background: 'rgba(255,255,255,0.82)',
            borderRadius: '50%',
            backdropFilter: 'blur(2px)',
          }}
        >
          <Heart
            size={13}
            strokeWidth={1.5}
            style={{ color: liked ? '#FF3300' : '#888', fill: liked ? '#FF3300' : 'none' }}
          />
        </button>
      </div>

      {/* 텍스트 */}
      <div style={{ marginTop: 8 }}>
        {/* 브랜드명 */}
        <p style={{ fontSize: 11, fontWeight: 400, color: '#999', letterSpacing: '0.01em', lineHeight: 1, marginBottom: 4 }}>
          {item.brand}
        </p>
        {/* 상품명 — 최대 2줄 */}
        <p
          style={{
            fontSize: 12, fontWeight: 400, color: '#222',
            lineHeight: 1.45, marginBottom: 5,
            display: '-webkit-box', WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical', overflow: 'hidden',
            letterSpacing: '-0.01em',
          }}
        >
          {item.name}
        </p>
        {/* 할인율 + 가격 */}
        <div className="flex items-baseline gap-[5px]">
          <span style={{ fontSize: 12, fontWeight: 700, color: '#FF3300', letterSpacing: '-0.01em' }}>
            {item.discount}%
          </span>
          <span style={{ fontSize: 13, fontWeight: 700, color: '#111', letterSpacing: '-0.02em' }}>
            {item.price.toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  );
}

/* ─── main component ─────────────────────────────────── */
export default function WConceptApp() {
  const [activeTab,    setActiveTab]    = useState('추천');
  const [activeBanner, setActiveBanner] = useState(0);
  const bannerTrackRef = useRef(null);

  /* dot indicator: track which banner is snapped */
  const handleBannerScroll = useCallback((e) => {
    const el = e.currentTarget;
    const first = el.firstElementChild;
    if (!first) return;
    const slideStep = first.offsetWidth + 12; /* banner width + gap-3 */
    const idx = Math.round(el.scrollLeft / slideStep);
    setActiveBanner(Math.max(0, Math.min(idx, BANNERS.length - 1)));
  }, []);

  return (
    <div
      className="relative max-w-[390px] mx-auto bg-white min-h-screen overflow-x-hidden select-none"
      style={{
        fontFamily: "'Inter', 'Pretendard', -apple-system, BlinkMacSystemFont, sans-serif",
      }}
    >
      <div className="h-12" />

      {/* ══════════════════════════════════════
          NAVIGATION
      ══════════════════════════════════════ */}
      <header className="flex items-center justify-between px-5 pb-[18px]">
        <h1
          className="text-black leading-none"
          style={{ fontSize: 21, fontWeight: 700, letterSpacing: '0.2em' }}
        >
          W CONCEPT
        </h1>

        <div className="flex items-center gap-[18px]">
          <button aria-label="검색" className="flex items-center justify-center w-8 h-8">
            <Search size={21} strokeWidth={1} className="text-black" />
          </button>

          <button aria-label="장바구니" className="relative flex items-center justify-center w-8 h-8">
            <ShoppingBag size={21} strokeWidth={1} className="text-black" />
            <span
              className="absolute top-0 right-0 flex items-center justify-center bg-black rounded-full text-white"
              style={{ width: 16, height: 16, fontSize: 9, fontWeight: 600, lineHeight: 1, transform: 'translate(30%,-20%)' }}
            >
              8
            </span>
          </button>
        </div>
      </header>

      {/* ══════════════════════════════════════
          CATEGORY TABS  — horizontal scroll
          overflow-x:auto + snap feel via -webkit-overflow-scrolling
      ══════════════════════════════════════ */}
      <div
        className="flex items-center gap-[7px] pb-5 overflow-x-auto scrollbar-hide"
        style={{ ...SCROLL_STYLE, paddingLeft: 20 }}
      >
        {TABS.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={[
                'flex-shrink-0 flex items-center gap-[4px] px-[14px] rounded-full transition-all duration-200',
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
        {/* trailing spacer — right padding 유지 */}
        <div style={{ width: 20, flexShrink: 0 }} />
      </div>

      {/* ══════════════════════════════════════
          BANNER CAROUSEL — snap-x mandatory
          peek: 각 배너가 calc(100%-48px) 너비 →
          오른쪽 끝에서 다음 배너가 살짝 보임
      ══════════════════════════════════════ */}
      <div>
        <div
          ref={bannerTrackRef}
          className="flex overflow-x-auto scrollbar-hide"
          style={{
            ...SCROLL_STYLE,
            scrollSnapType: 'x mandatory',
            scrollPaddingLeft: 16,
            gap: 12,
            paddingLeft: 16,
          }}
          onScroll={handleBannerScroll}
        >
          {BANNERS.map((banner) => (
            <div
              key={banner.id}
              className="relative flex-shrink-0 rounded-2xl overflow-hidden"
              style={{
                /* 100% - (left-pad 16 + gap 12 + peek 20) = 100% - 48px */
                width: 'calc(100% - 48px)',
                aspectRatio: '3 / 3.7',
                scrollSnapAlign: 'start',
              }}
            >
              <img
                src={banner.image}
                alt={banner.title}
                className="absolute inset-0 w-full h-full object-cover"
                style={{ objectPosition: 'center 20%' }}
                loading="eager"
                decoding="async"
              />

              {/* gradient */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background:
                    'linear-gradient(to top, rgba(0,0,0,0.78) 0%, rgba(0,0,0,0.22) 42%, rgba(0,0,0,0) 66%)',
                }}
              />

              {/* text overlay */}
              <div className="absolute bottom-0 left-0 right-0 px-5 pb-6 flex flex-col items-start">
                {banner.badge && (
                  <div
                    className="flex items-center gap-[5px] mb-[12px]"
                    style={{ background: 'rgba(0,0,0,0.72)', borderRadius: 100, padding: '5px 12px 5px 10px' }}
                  >
                    <span style={{ fontSize: 11, color: '#ff6060', lineHeight: 1 }}>♥</span>
                    <span
                      className="text-white"
                      style={{ fontSize: 11, fontWeight: 400, letterSpacing: '0.03em', lineHeight: 1 }}
                    >
                      {banner.badge}
                    </span>
                  </div>
                )}

                <h2
                  className="text-white"
                  style={{
                    fontSize: 25, fontWeight: 300, letterSpacing: '-0.01em',
                    lineHeight: 1.34, margin: 0, whiteSpace: 'pre-line',
                  }}
                >
                  {banner.title}
                </h2>
              </div>
            </div>
          ))}
          {/* trailing spacer — 오른쪽 여백 */}
          <div style={{ width: 16, flexShrink: 0 }} />
        </div>

        {/* ── dot indicator ── */}
        <div className="flex items-center justify-center gap-[6px] mt-[14px]">
          {BANNERS.map((_, i) => (
            <div
              key={i}
              style={{
                height: 4,
                borderRadius: 100,
                background: i === activeBanner ? '#000' : '#D8D8D8',
                width: i === activeBanner ? 18 : 4,
                transition: 'width 0.28s cubic-bezier(0.4,0,0.2,1), background 0.28s ease',
              }}
            />
          ))}
        </div>
      </div>

      {/* ══════════════════════════════════════
          관심 브랜드 새 소식 — horizontal scroll
          마지막 아이템 뒤 trailing spacer로
          오른쪽 여백을 왼쪽 여백과 동일하게 유지
      ══════════════════════════════════════ */}
      <section className="pt-8 pb-10">
        <h3
          className="px-5 text-black"
          style={{ fontSize: 17, fontWeight: 600, letterSpacing: '-0.025em', margin: '0 0 20px' }}
        >
          관심 브랜드 새 소식
        </h3>

        <div
          className="flex overflow-x-auto scrollbar-hide"
          style={{
            ...SCROLL_STYLE,
            gap: 16,
            paddingLeft: 20,
            paddingRight: 20,
            /* ring 테두리(2px) + gap(3px) + outline(2px) = 7px 여유 확보 */
            paddingTop: 8,
            paddingBottom: 8,
          }}
        >
          {BRANDS.map((brand) => (
            <BrandAvatar key={brand.id} brand={brand} />
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════
          연관 추천 상품
      ══════════════════════════════════════ */}
      <section
        style={{
          borderTop: '1px solid #F0F0F0',
          paddingTop: 28,
          paddingBottom: 40,
        }}
      >
        {/* 섹션 헤더 — 최근 본 상품 썸네일 + 타이틀 */}
        <div className="flex items-center gap-[10px] px-5 mb-5">
          <div
            className="flex-shrink-0 overflow-hidden"
            style={{ width: 44, height: 44, borderRadius: 6, background: '#EBEBEB' }}
          >
            <img
              src="https://loremflickr.com/400/533/fashion,woman?lock=99"
              alt="최근 본 상품"
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            />
          </div>
          <div style={{ minWidth: 0 }}>
            <h3
              style={{
                fontSize: 14, fontWeight: 700, color: '#111',
                letterSpacing: '-0.02em', lineHeight: 1.3,
                whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                margin: 0,
              }}
            >
              시어서커 오버핏 스트라이프 셔츠 [핑크]
            </h3>
            <p
              style={{
                fontSize: 11.5, fontWeight: 400, color: '#AAA',
                letterSpacing: '0.01em', marginTop: 3, lineHeight: 1,
              }}
            >
              이 상품과 비슷한 무드의 아이템
            </p>
          </div>
        </div>

        {/* 상품 카드 — 가로 스크롤 */}
        <div
          className="flex overflow-x-auto scrollbar-hide"
          style={{
            ...SCROLL_STYLE,
            gap: 10,
            paddingLeft: 20,
            paddingRight: 20,
          }}
        >
          {RELATED_PRODUCTS.map((item) => (
            <ProductCard key={item.id} item={item} />
          ))}
        </div>
      </section>
    </div>
  );
}

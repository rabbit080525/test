import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart } from 'lucide-react';

const FEED_TABS = [
  { id: '내 취향',   label: '내 취향',   emoji: '✨' },
  { id: '5월 하객룩', label: '5월 하객룩', emoji: '🌸' },
  { id: '주말 캠핑',  label: '주말 캠핑',  emoji: '🏕️' },
];

const ALL_IMAGES = [
  '/pd00.jpg', '/pd01.jpg', '/pd02.jpg', '/pd03.jpg', '/pd04.jpg',
  '/pd05.jpg', '/pd06.jpg', '/pd07.jpg', '/pd08.jpg',
  '/apd01.jpg', '/apd02.jpg', '/apd03.jpg', '/apd04.jpg', '/apd05.jpg',
  '/apd06.jpg', '/apd07.jpg', '/apd08.jpg', '/apd09.jpg', '/apd10.jpg',
  '/bpd01.jpg', '/bpd02.jpg', '/bpd03.jpg', '/bpd04.jpg', '/bpd05.jpg',
  '/bpd06.jpg', '/bpd07.jpg', '/bpd08.jpg',
  '/lpd01.jpg', '/lpd02.jpg', '/lpd03.jpg', '/lpd04.jpg', '/lpd05.jpg',
  '/lpd06.jpg', '/lpd07.jpg', '/lpd08.jpg',
];

const BRANDS    = ['마리떼 프랑소와 저버', '르세지엠', '레이지지', '온앤온', '아무르 무아르', '시아쥬', '프론트로우', '몽돌'];
const NAMES     = ['AEROCOOL LEMON T-SHIRT', '플리츠 와이드 슬랙스', 'Check Maxi Skirt', '실크 루즈핏 블라우스', '오버핏 니트 가디건', 'Classic Oversized Blazer', '미디 플리츠 드레스', '크롭 트위드 자켓'];
const PRICES    = [56050, 89000, 76736, 68000, 52000, 125000, 98000, 72000];
const DISCOUNTS = [5, 10, 15, 20, 25, 30, 12, 18];

function generateItems(tab, page) {
  const tabOffset = FEED_TABS.findIndex(t => t.id === tab) * 11;
  return Array.from({ length: 8 }, (_, i) => {
    const seed = page * 8 + i;
    return {
      id:       `${tab}-p${page}-i${i}`,
      image:    ALL_IMAGES[(seed + tabOffset) % ALL_IMAGES.length],
      brand:    BRANDS[seed % 8],
      name:     NAMES[seed % 8],
      price:    PRICES[seed % 8],
      discount: DISCOUNTS[seed % 8],
      isAd:     tab === '내 취향' && seed % 4 === 3,
    };
  });
}

/* ── DiscoveryTabs ───────────────────────────────────── */
function DiscoveryTabs({ activeTab, onChange }) {
  return (
    <div style={{
      display: 'flex',
      gap: 7,
      padding: '14px 16px 12px',
      overflowX: 'auto',
      scrollbarWidth: 'none',
      msOverflowStyle: 'none',
      WebkitOverflowScrolling: 'touch',
    }}>
      {FEED_TABS.map(({ id, label, emoji }) => {
        const on = activeTab === id;
        return (
          <button
            key={id}
            onClick={() => onChange(id)}
            style={{
              flexShrink: 0,
              display: 'inline-flex',
              alignItems: 'center',
              gap: 5,
              padding: '8px 16px',
              borderRadius: 100,
              border: on ? 'none' : '0.5px solid #D4D8DC',
              background: on ? '#111' : '#F7F8F9',
              color: on ? '#fff' : '#555',
              fontSize: 13,
              fontWeight: on ? 600 : 400,
              letterSpacing: '-0.01em',
              lineHeight: 1,
              whiteSpace: 'nowrap',
              cursor: 'pointer',
              transition: 'background 0.15s, color 0.15s',
            }}
          >
            <span style={{ fontSize: 14 }}>{emoji}</span>
            <span>{label}</span>
          </button>
        );
      })}
    </div>
  );
}

/* ── SkeletonCard ────────────────────────────────────── */
function SkeletonCard() {
  return (
    <div>
      <div className="skeleton-shimmer" style={{ aspectRatio: '3/4' }} />
      <div style={{ padding: '8px 4px 12px' }}>
        <div className="skeleton-shimmer" style={{ height: 10, width: '50%', borderRadius: 3, marginBottom: 6 }} />
        <div className="skeleton-shimmer" style={{ height: 12, width: '80%', borderRadius: 3, marginBottom: 6 }} />
        <div className="skeleton-shimmer" style={{ height: 12, width: '35%', borderRadius: 3 }} />
      </div>
    </div>
  );
}

/* ── FeedCard ────────────────────────────────────────── */
function FeedCard({ item, onProductClick }) {
  const [liked, setLiked] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
      style={{ cursor: 'pointer' }}
      onClick={() => onProductClick(item)}
    >
      <div style={{ position: 'relative', aspectRatio: '3/4', background: '#EBEBEB', overflow: 'hidden' }}>
        <img
          src={item.image} alt={item.name}
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          loading="lazy"
        />
        {item.isAd && (
          <span style={{
            position: 'absolute', bottom: 7, left: 7,
            padding: '2px 5px',
            background: 'rgba(255,255,255,0.80)',
            color: '#999',
            fontSize: 9,
            fontWeight: 300,
            letterSpacing: '0.04em',
            lineHeight: 1,
            borderRadius: 2,
          }}>
            AD
          </span>
        )}
      </div>
      <div style={{ padding: '8px 4px 12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 2 }}>
          <p style={{ margin: 0, fontSize: 11, color: '#999', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', minWidth: 0 }}>{item.brand}</p>
          <button
            onClick={e => { e.stopPropagation(); setLiked(v => !v); }}
            style={{ flexShrink: 0, padding: 2, background: 'none', border: 'none', cursor: 'pointer', lineHeight: 0 }}
          >
            <Heart size={13} strokeWidth={1.5}
              style={{ color: liked ? '#FF3300' : '#C0C0C0', fill: liked ? '#FF3300' : 'none', display: 'block' }} />
          </button>
        </div>
        <p style={{ margin: '0 0 4px', fontSize: 12, color: '#333', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.name}</p>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 3, marginBottom: 6 }}>
          <span style={{ fontSize: 11.5, fontWeight: 700, color: '#FF3300' }}>{item.discount}%</span>
          <span style={{ fontSize: 12.5, fontWeight: 700, color: '#111', letterSpacing: '-0.02em' }}>{item.price.toLocaleString()}</span>
        </div>
      </div>
    </motion.div>
  );
}

/* ── InfiniteFeed ────────────────────────────────────── */
export default function InfiniteFeed({ onProductClick }) {
  const tabRef      = useRef('내 취향');
  const pageRef     = useRef(1);
  const loadingRef  = useRef(false);
  const sentinelRef = useRef(null);

  const [activeTab, setActiveTab] = useState('내 취향');
  const [isLoading, setIsLoading] = useState(false);
  const [feedKey,   setFeedKey]   = useState(0);
  const [items, setItems] = useState(() => generateItems('내 취향', 0));

  const itemsRef = useRef(0);

  const loadMore = useCallback(() => {
    if (loadingRef.current || itemsRef.current >= 100) return;
    loadingRef.current = true;
    setIsLoading(true);
    setTimeout(() => {
      const next = generateItems(tabRef.current, pageRef.current);
      pageRef.current += 1;
      setItems(prev => {
        const combined = [...prev, ...next].slice(0, 100);
        itemsRef.current = combined.length;
        return combined;
      });
      setIsLoading(false);
      loadingRef.current = false;
    }, 600);
  }, []);

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) loadMore(); },
      { rootMargin: '200px', threshold: 0 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [loadMore]);

  const handleTabChange = useCallback((tab) => {
    if (tab === tabRef.current) return;
    tabRef.current     = tab;
    pageRef.current    = 1;
    loadingRef.current = false;
    itemsRef.current   = 8;
    setActiveTab(tab);
    setIsLoading(false);
    setFeedKey(k => k + 1);
    setItems(generateItems(tab, 0));
  }, []);

  return (
    <section style={{ borderTop: '8px solid #F5F5F5', fontFamily: "'Inter','Pretendard',-apple-system,sans-serif" }}>

      {/* 탭만 — 타이틀 없음 */}
      <DiscoveryTabs activeTab={activeTab} onChange={handleTabChange} />

      {/* 피드 그리드 — 탭 전환 시 fade+slide 애니메이션 */}
      <AnimatePresence mode="wait">
        <motion.div
          key={feedKey}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
          style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, padding: '0 16px' }}
        >
          {items.map(item => (
            <FeedCard key={item.id} item={item} onProductClick={onProductClick} />
          ))}
          {isLoading && (
            <>
              <SkeletonCard />
              <SkeletonCard />
              <SkeletonCard />
              <SkeletonCard />
            </>
          )}
        </motion.div>
      </AnimatePresence>

      <div ref={sentinelRef} style={{ height: 40 }} />
    </section>
  );
}

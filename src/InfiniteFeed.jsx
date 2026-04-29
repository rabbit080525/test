import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, X } from 'lucide-react';

/* ─── 상수 ────────────────────────────────────────── */
const FEED_TABS = ['취향', '테마', '무드'];

const HASHTAG_MAP = {
  취향: ['#미니멀', '#클래식', '#캐주얼', '#페미닌', '#스트릿'],
  테마: ['#출근룩', '#데이트룩', '#주말룩', '#여행룩', '#홈웨어'],
  무드: ['#2026SS', '#올블랙', '#어스톤', '#파스텔', '#모노톤'],
};

const BRANDS = [
  '마리떼 프랑소와 저버', '르세지엠', '레이지지', '온앤온',
  '아무르 무아르', '시아쥬', '프론트로우', '몽돌',
];
const NAMES = [
  'AEROCOOL LEMON T-SHIRT', '플리츠 와이드 슬랙스', 'Check Maxi Skirt',
  '실크 루즈핏 블라우스', '오버핏 니트 가디건', 'Classic Oversized Blazer',
  '미디 플리츠 드레스', '크롭 트위드 자켓',
];
const PRICES    = [56050, 89000, 76736, 68000, 52000, 125000, 98000, 72000];
const DISCOUNTS = [5, 10, 15, 20, 25, 30, 12, 18];
const IMG_KW    = { 취향: 'fashion,woman', 테마: 'fashion,street', 무드: 'fashion,minimal' };

/* ─── 데이터 생성 ──────────────────────────────────── */
function generateItems(tab, tag, page) {
  const tags = HASHTAG_MAP[tab] ?? HASHTAG_MAP['취향'];
  const kw   = IMG_KW[tab]    ?? 'fashion,woman';
  return Array.from({ length: 8 }, (_, i) => {
    const idx  = (page * 8 + i) % 8;
    const lock = 850 + page * 8 + i;
    const itemTags = tag
      ? [tag, tags[(i + 1) % tags.length]]
      : [tags[i % tags.length], tags[(i + 2) % tags.length]];
    return {
      id:       `${tab}-p${page}-i${i}`,
      image:    `https://loremflickr.com/400/533/${kw}?lock=${lock}`,
      brand:    BRANDS[idx],
      name:     NAMES[idx],
      price:    PRICES[idx],
      discount: DISCOUNTS[idx],
      tags:     itemTags,
    };
  });
}

/* ─── SkeletonCard ─────────────────────────────────── */
function SkeletonCard() {
  return (
    <div style={{ marginBottom: 1 }}>
      <div className="skeleton-shimmer" style={{ aspectRatio: '4 / 5' }} />
      <div style={{ padding: '12px 16px 16px' }}>
        <div className="skeleton-shimmer" style={{ height: 11, width: '38%', borderRadius: 4, marginBottom: 8 }} />
        <div className="skeleton-shimmer" style={{ height: 13, width: '68%', borderRadius: 4, marginBottom: 8 }} />
        <div className="skeleton-shimmer" style={{ height: 13, width: '28%', borderRadius: 4, marginBottom: 10 }} />
        <div style={{ display: 'flex', gap: 6 }}>
          <div className="skeleton-shimmer" style={{ height: 22, width: 66, borderRadius: 100 }} />
          <div className="skeleton-shimmer" style={{ height: 22, width: 66, borderRadius: 100 }} />
        </div>
      </div>
    </div>
  );
}

/* ─── FeedCard ─────────────────────────────────────── */
function FeedCard({ item, onTagClick, onProductClick }) {
  const [liked, setLiked] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
      style={{ marginBottom: 1, cursor: 'pointer' }}
      onClick={() => onProductClick(item)}
    >
      {/* 이미지 */}
      <div style={{ position: 'relative', aspectRatio: '4 / 5', background: '#EBEBEB', overflow: 'hidden' }}>
        <img
          src={item.image}
          alt={item.name}
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          loading="lazy"
        />
        <button
          onClick={(e) => { e.stopPropagation(); setLiked(v => !v); }}
          style={{
            position: 'absolute', top: 12, right: 12,
            width: 34, height: 34, borderRadius: '50%',
            background: 'rgba(255,255,255,0.9)', border: 'none',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', boxShadow: '0 1px 6px rgba(0,0,0,0.14)',
          }}
        >
          <Heart
            size={15} strokeWidth={1.5}
            style={{ color: liked ? '#FF3300' : '#888', fill: liked ? '#FF3300' : 'none', display: 'block' }}
          />
        </button>
      </div>

      {/* 상품 정보 */}
      <div style={{ padding: '12px 16px 14px', borderBottom: '1px solid #F5F5F5' }}>
        <p style={{ margin: '0 0 3px', fontSize: 11.5, color: '#999', letterSpacing: '-0.01em' }}>{item.brand}</p>
        <p style={{ margin: '0 0 5px', fontSize: 13.5, fontWeight: 500, color: '#111', letterSpacing: '-0.02em', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {item.name}
        </p>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 5, marginBottom: 10 }}>
          <span style={{ fontSize: 13, fontWeight: 700, color: '#FF3300' }}>{item.discount}%</span>
          <span style={{ fontSize: 14.5, fontWeight: 700, color: '#111', letterSpacing: '-0.02em' }}>
            {item.price.toLocaleString()}
          </span>
        </div>

        {/* 해시태그 */}
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {item.tags.map(tag => (
            <button
              key={tag}
              onClick={(e) => { e.stopPropagation(); onTagClick(tag); }}
              style={{
                fontSize: 11, color: '#555', background: '#F5F5F5',
                borderRadius: 100, padding: '4px 10px',
                border: 'none', cursor: 'pointer',
                letterSpacing: '0.01em', lineHeight: 1,
              }}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

/* ─── InfiniteFeed (default export) ───────────────── */
export default function InfiniteFeed({ onProductClick }) {
  const [activeTab, setActiveTab] = useState('취향');
  const [activeTag, setActiveTag] = useState(null);
  const [items,     setItems]     = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  /* refs — 클로저 stale 방지 */
  const tabRef     = useRef('취향');
  const tagRef     = useRef(null);
  const pageRef    = useRef(0);
  const loadingRef = useRef(false);
  const sentinelRef = useRef(null);

  const loadMore = useCallback(() => {
    if (loadingRef.current) return;
    loadingRef.current = true;
    setIsLoading(true);
    setTimeout(() => {
      const next = generateItems(tabRef.current, tagRef.current, pageRef.current);
      pageRef.current += 1;
      setItems(prev => [...prev, ...next]);
      setIsLoading(false);
      loadingRef.current = false;
    }, 800);
  }, []);

  /* 초기 로드 */
  useEffect(() => { loadMore(); }, [loadMore]);

  /* Intersection Observer */
  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) loadMore(); },
      { threshold: 0.1 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [loadMore]);

  /* 탭·태그 변경 시 리셋 */
  const reset = useCallback((tab, tag) => {
    tabRef.current  = tab;
    tagRef.current  = tag;
    pageRef.current = 0;
    loadingRef.current = false;
    setItems([]);
    setIsLoading(false);
    setTimeout(() => loadMore(), 50);
  }, [loadMore]);

  const handleTabChange = useCallback((tab) => {
    if (tab === tabRef.current && tagRef.current === null) return;
    setActiveTab(tab);
    setActiveTag(null);
    reset(tab, null);
  }, [reset]);

  const handleTagClick = useCallback((tag) => {
    const next = tagRef.current === tag ? null : tag;
    setActiveTag(next);
    reset(tabRef.current, next);
  }, [reset]);

  return (
    <section
      style={{
        borderTop: '8px solid #F5F5F5',
        fontFamily: "'Inter','Pretendard',-apple-system,BlinkMacSystemFont,sans-serif",
      }}
    >
      {/* 헤더 */}
      <div style={{ padding: '22px 16px 14px' }}>
        <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: '#111', letterSpacing: '-0.03em' }}>
          취향 기반 추천 피드
        </h2>
      </div>

      {/* 탭 */}
      <div style={{ display: 'flex', gap: 7, paddingLeft: 16, paddingRight: 16, paddingBottom: 12 }}>
        {FEED_TABS.map(tab => (
          <button
            key={tab}
            onClick={() => handleTabChange(tab)}
            style={{
              padding: '7px 18px', borderRadius: 100, border: 'none', cursor: 'pointer',
              background: activeTab === tab ? '#111' : '#F4F4F4',
              color: activeTab === tab ? '#fff' : '#555',
              fontSize: 13, fontWeight: activeTab === tab ? 600 : 400,
              letterSpacing: '-0.01em', lineHeight: 1,
              transition: 'background 0.15s, color 0.15s',
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* 해시태그 필터 */}
      <div style={{ display: 'flex', gap: 6, paddingLeft: 16, paddingRight: 16, paddingBottom: 4, overflowX: 'auto', scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
        {(HASHTAG_MAP[activeTab] ?? []).map(tag => {
          const on = activeTag === tag;
          return (
            <button
              key={tag}
              onClick={() => handleTagClick(tag)}
              style={{
                flexShrink: 0, padding: '5px 13px', borderRadius: 100, cursor: 'pointer',
                background: on ? '#111' : '#fff',
                color:      on ? '#fff' : '#555',
                border: `1px solid ${on ? '#111' : '#E2E2E2'}`,
                fontSize: 12, fontWeight: on ? 600 : 400,
                letterSpacing: '0.01em', lineHeight: 1,
                transition: 'all 0.15s ease',
              }}
            >
              {tag}
            </button>
          );
        })}
      </div>

      {/* 활성 태그 배지 */}
      <AnimatePresence>
        {activeTag && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.18 }}
            style={{ padding: '10px 16px 0' }}
          >
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: '#111', borderRadius: 100, padding: '5px 10px 5px 14px' }}>
              <span style={{ fontSize: 12, color: '#fff', letterSpacing: '0.01em' }}>{activeTag} 필터 적용 중</span>
              <button
                onClick={() => handleTagClick(activeTag)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', padding: 2 }}
              >
                <X size={12} color="rgba(255,255,255,0.75)" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div style={{ height: 14 }} />

      {/* 피드 카드 */}
      {items.map(item => (
        <FeedCard
          key={item.id}
          item={item}
          onTagClick={handleTagClick}
          onProductClick={onProductClick}
        />
      ))}

      {/* 스켈레톤 */}
      {isLoading && Array.from({ length: 3 }, (_, i) => <SkeletonCard key={`sk-${i}`} />)}

      {/* Intersection Observer 센티널 */}
      <div ref={sentinelRef} style={{ height: 40 }} />
    </section>
  );
}

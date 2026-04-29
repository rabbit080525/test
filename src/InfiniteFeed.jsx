import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, X } from 'lucide-react';

const FEED_TABS = ['취향', '테마', '무드'];

const HASHTAG_MAP = {
  취향: ['#미니멀', '#클래식', '#캐주얼', '#페미닌', '#스트릿'],
  테마: ['#출근룩', '#데이트룩', '#주말룩', '#여행룩', '#홈웨어'],
  무드: ['#2026SS', '#올블랙', '#어스톤', '#파스텔', '#모노톤'],
};

const IMG_KW = { 취향: 'fashion,woman', 테마: 'fashion,street', 무드: 'fashion,minimal' };

const BRANDS = ['마리떼 프랑소와 저버', '르세지엠', '레이지지', '온앤온', '아무르 무아르', '시아쥬', '프론트로우', '몽돌'];
const NAMES  = ['AEROCOOL LEMON T-SHIRT', '플리츠 와이드 슬랙스', 'Check Maxi Skirt', '실크 루즈핏 블라우스', '오버핏 니트 가디건', 'Classic Oversized Blazer', '미디 플리츠 드레스', '크롭 트위드 자켓'];
const PRICES    = [56050, 89000, 76736, 68000, 52000, 125000, 98000, 72000];
const DISCOUNTS = [5, 10, 15, 20, 25, 30, 12, 18];

function generateItems(tab, tag, page) {
  const tags = HASHTAG_MAP[tab] ?? HASHTAG_MAP['취향'];
  const kw   = IMG_KW[tab] ?? 'fashion,woman';
  return Array.from({ length: 8 }, (_, i) => {
    const idx      = (page * 8 + i) % 8;
    const itemTags = tag
      ? [tag, tags[(i + 1) % tags.length]]
      : [tags[i % tags.length], tags[(i + 2) % tags.length]];
    return {
      id:       `${tab}-p${page}-i${i}`,
      image:    `https://loremflickr.com/400/533/${kw}?lock=${850 + page * 8 + i}`,
      brand:    BRANDS[idx],
      name:     NAMES[idx],
      price:    PRICES[idx],
      discount: DISCOUNTS[idx],
      tags:     itemTags,
    };
  });
}

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

function FeedCard({ item, onTagClick, onProductClick }) {
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
        <button
          onClick={e => { e.stopPropagation(); setLiked(v => !v); }}
          style={{
            position: 'absolute', top: 8, right: 8,
            width: 28, height: 28, borderRadius: '50%',
            background: 'rgba(255,255,255,0.88)', border: 'none',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer',
          }}
        >
          <Heart size={13} strokeWidth={1.5}
            style={{ color: liked ? '#FF3300' : '#888', fill: liked ? '#FF3300' : 'none', display: 'block' }} />
        </button>
      </div>

      <div style={{ padding: '8px 4px 12px' }}>
        <p style={{ margin: '0 0 2px', fontSize: 11, color: '#999', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {item.brand}
        </p>
        <p style={{ margin: '0 0 4px', fontSize: 12, color: '#333', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {item.name}
        </p>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 3, marginBottom: 6 }}>
          <span style={{ fontSize: 11.5, fontWeight: 700, color: '#FF3300' }}>{item.discount}%</span>
          <span style={{ fontSize: 12.5, fontWeight: 700, color: '#111', letterSpacing: '-0.02em' }}>{item.price.toLocaleString()}</span>
        </div>
        <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
          {item.tags.slice(0, 2).map(tag => (
            <button
              key={tag}
              onClick={e => { e.stopPropagation(); onTagClick(tag); }}
              style={{
                fontSize: 10, color: '#666', background: '#F5F5F5',
                borderRadius: 100, padding: '3px 8px',
                border: 'none', cursor: 'pointer', lineHeight: 1,
              }}
            >{tag}</button>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

export default function InfiniteFeed({ onProductClick }) {
  const tabRef     = useRef('취향');
  const tagRef     = useRef(null);
  const pageRef    = useRef(1);       // page 0 already pre-loaded
  const loadingRef = useRef(false);
  const sentinelRef = useRef(null);

  const [activeTab, setActiveTab] = useState('취향');
  const [activeTag, setActiveTag] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // 첫 8개를 즉시 렌더링 — 로딩 없이 바로 표시
  const [items, setItems] = useState(() => generateItems('취향', null, 0));

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
    }, 600);
  }, []);

  // IntersectionObserver — document scroll 기준 동작
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

  const reset = useCallback((tab, tag) => {
    tabRef.current   = tab;
    tagRef.current   = tag;
    pageRef.current  = 1;
    loadingRef.current = false;
    setIsLoading(false);
    // 즉시 첫 페이지 데이터 표시
    setItems(generateItems(tab, tag, 0));
  }, []);

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
    <section style={{ borderTop: '8px solid #F5F5F5', fontFamily: "'Inter','Pretendard',-apple-system,sans-serif" }}>

      <div style={{ padding: '22px 16px 14px' }}>
        <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: '#111', letterSpacing: '-0.03em' }}>
          취향 기반 추천 피드
        </h2>
      </div>

      {/* 탭 */}
      <div style={{ display: 'flex', gap: 7, padding: '0 16px 12px' }}>
        {FEED_TABS.map(tab => (
          <button
            key={tab}
            onClick={() => handleTabChange(tab)}
            style={{
              padding: '7px 18px', borderRadius: 100, border: 'none', cursor: 'pointer',
              background: activeTab === tab ? '#111' : '#F4F4F4',
              color:      activeTab === tab ? '#fff' : '#555',
              fontSize: 13, fontWeight: activeTab === tab ? 600 : 400,
              letterSpacing: '-0.01em', lineHeight: 1,
            }}
          >{tab}</button>
        ))}
      </div>

      {/* 해시태그 필터 */}
      <div style={{ display: 'flex', gap: 6, padding: '0 16px 12px', overflowX: 'auto', scrollbarWidth: 'none' }}>
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
                fontSize: 12, fontWeight: on ? 600 : 400, lineHeight: 1,
              }}
            >{tag}</button>
          );
        })}
      </div>

      {/* 활성 태그 배지 */}
      <AnimatePresence>
        {activeTag && (
          <motion.div
            initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}
            style={{ padding: '0 16px 12px' }}
          >
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: '#111', borderRadius: 100, padding: '5px 10px 5px 14px' }}>
              <span style={{ fontSize: 12, color: '#fff' }}>{activeTag} 필터 적용 중</span>
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

      {/* 2열 그리드 */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, padding: '0 16px' }}>
        {items.map(item => (
          <FeedCard key={item.id} item={item} onTagClick={handleTagClick} onProductClick={onProductClick} />
        ))}
        {isLoading && (
          <>
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </>
        )}
      </div>

      {/* IntersectionObserver sentinel */}
      <div ref={sentinelRef} style={{ height: 40 }} />
    </section>
  );
}

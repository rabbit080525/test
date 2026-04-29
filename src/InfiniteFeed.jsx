import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, X } from 'lucide-react';

const FEED_TABS = [
  { id: '내 취향',   label: '내 취향',   emoji: '✨' },
  { id: '5월 하객룩', label: '5월 하객룩', emoji: '🌸' },
  { id: '주말 캠핑',  label: '주말 캠핑',  emoji: '🏕️' },
];

const HASHTAG_MAP = {
  '내 취향':   ['#미니멀', '#클래식', '#캐주얼', '#페미닌', '#스트릿'],
  '5월 하객룩': ['#로맨틱', '#드레시', '#세미포멀', '#플로럴', '#우아한'],
  '주말 캠핑':  ['#아웃도어', '#레이어드', '#실용적', '#어스톤', '#캐주얼'],
};

const IMG_KW = {
  '내 취향':   'fashion,woman',
  '5월 하객룩': 'fashion,dress',
  '주말 캠핑':  'outdoor,fashion',
};

const BRANDS    = ['마리떼 프랑소와 저버', '르세지엠', '레이지지', '온앤온', '아무르 무아르', '시아쥬', '프론트로우', '몽돌'];
const NAMES     = ['AEROCOOL LEMON T-SHIRT', '플리츠 와이드 슬랙스', 'Check Maxi Skirt', '실크 루즈핏 블라우스', '오버핏 니트 가디건', 'Classic Oversized Blazer', '미디 플리츠 드레스', '크롭 트위드 자켓'];
const PRICES    = [56050, 89000, 76736, 68000, 52000, 125000, 98000, 72000];
const DISCOUNTS = [5, 10, 15, 20, 25, 30, 12, 18];

function generateItems(tab, tag, page) {
  const tags = HASHTAG_MAP[tab] ?? HASHTAG_MAP['내 취향'];
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
            display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
          }}
        >
          <Heart size={13} strokeWidth={1.5}
            style={{ color: liked ? '#FF3300' : '#888', fill: liked ? '#FF3300' : 'none', display: 'block' }} />
        </button>
      </div>
      <div style={{ padding: '8px 4px 12px' }}>
        <p style={{ margin: '0 0 2px', fontSize: 11, color: '#999', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.brand}</p>
        <p style={{ margin: '0 0 4px', fontSize: 12, color: '#333', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.name}</p>
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
                border: 'none', cursor: 'pointer', lineHeight: 1, whiteSpace: 'nowrap',
              }}
            >{tag}</button>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

/* ── InfiniteFeed ────────────────────────────────────── */
export default function InfiniteFeed({ onProductClick }) {
  const tabRef      = useRef('내 취향');
  const tagRef      = useRef(null);
  const pageRef     = useRef(1);
  const loadingRef  = useRef(false);
  const sentinelRef = useRef(null);

  const [activeTab, setActiveTab] = useState('내 취향');
  const [activeTag, setActiveTag] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [feedKey,   setFeedKey]   = useState(0);
  const [items, setItems] = useState(() => generateItems('내 취향', null, 0));

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
    tabRef.current     = tab;
    tagRef.current     = tag;
    pageRef.current    = 1;
    loadingRef.current = false;
    setIsLoading(false);
    setFeedKey(k => k + 1);
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

      {/* 탭만 — 타이틀 없음 */}
      <DiscoveryTabs activeTab={activeTab} onChange={handleTabChange} />

      {/* 해시태그 필터 */}
      <div style={{ display: 'flex', gap: 6, padding: '0 16px 10px', overflowX: 'auto', scrollbarWidth: 'none', WebkitOverflowScrolling: 'touch' }}>
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
                border: `0.5px solid ${on ? '#111' : '#D4D8DC'}`,
                fontSize: 12, fontWeight: on ? 600 : 400,
                lineHeight: 1, whiteSpace: 'nowrap',
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
            transition={{ duration: 0.18 }}
            style={{ padding: '0 16px 10px' }}
          >
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: '#111', borderRadius: 100, padding: '5px 10px 5px 14px' }}>
              <span style={{ fontSize: 12, color: '#fff', whiteSpace: 'nowrap' }}>{activeTag} 필터 적용 중</span>
              <button onClick={() => handleTagClick(activeTag)} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', padding: 2 }}>
                <X size={12} color="rgba(255,255,255,0.75)" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

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
        </motion.div>
      </AnimatePresence>

      <div ref={sentinelRef} style={{ height: 40 }} />
    </section>
  );
}

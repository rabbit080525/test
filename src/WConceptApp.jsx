import React, { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Heart, Home, LayoutGrid, User, ChevronLeft } from 'lucide-react';
import InfiniteFeed from './InfiniteFeed';
import ScrollToTop from './ScrollToTop';

/* ─── utils ─────────────────────────────────────────── */
function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

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
    image: '/banner3.jpg',
    title: '봄을 맞이하는\n마르디의 새 컬렉션',
  },
  {
    id: 3,
    image: '/banner2.jpg',
    title: '지금만 만날 수 있는\n프론트로우 시즌 오프',
  },
];

const BRANDS = [
  { id: 1, name: '우이',      hasNewArrivals: true,  logo: '/oui_logo.jpg',       url: 'https://display.wconcept.co.kr/rn/brand/105485' },
  { id: 2, name: '프론트로우', hasNewArrivals: false, logo: '/frontrow_logo.jpg',  url: null },
  { id: 3, name: '레이지지',  hasNewArrivals: false, logo: '/lazy_logo.jpg',       url: null },
  { id: 4, name: '르세지엠',  hasNewArrivals: true,  logo: '/LESEIZIEME_logo.jpg', url: null },
  { id: 5, name: '마르디',    hasNewArrivals: false, logo: null,                  url: null },
];

const STYLE_TABS = [
  { id: 'st1', label: '#미니멀',        image: '/apd04.jpg' },
  { id: 'st2', label: '#프렌치시크',    image: '/pd00.jpg'  },
  { id: 'st3', label: '#고프코어',      image: '/apd08.jpg' },
  { id: 'st4', label: '#모던클래식',    image: '/pd03.jpg'  },
  { id: 'st5', label: '#스트리트캐주얼', image: '/apd02.jpg' },
];

const CATEGORY_OPTIONS = [
  { id: 'c1', label: '상의' },    { id: 'c2', label: '하의' },
  { id: 'c3', label: '아우터' },  { id: 'c4', label: '드레스' },
  { id: 'c5', label: '뷰티' },    { id: 'c6', label: '라이프' },
  { id: 'c7', label: '액세서리' },{ id: 'c8', label: '슈즈' },
];

const REALTIME_BEST = [
  { id: 'rb1', brand: '마리떼 프랑소와 저버', name: 'AEROCOOL LEMON T-SHIRT',       discount: 5,  price: 56050,  image: '/pd04.jpg' },
  { id: 'rb2', brand: '레이지지',             name: 'Classic Check Jacket',          discount: 29, price: 76736,  image: '/pd01.jpg' },
  { id: 'rb3', brand: '온앤온',               name: '넥 스트링 라이트 윈드 점퍼',    discount: 34, price: 170940, image: '/pd07.jpg' },
  { id: 'rb4', brand: '르세지엠',             name: '타임리스 와이드 슬랙스',         discount: 15, price: 89000,  image: '/pd00.jpg' },
  { id: 'rb5', brand: '시아쥬',               name: '노블 시어서커 오버핏 셔츠',     discount: 28, price: 62640,  image: '/pd08.jpg' },
  { id: 'rb6', brand: '아무르 무아르',         name: '블라인드 시스루 블라우스',      discount: 25, price: 81532,  image: '/pd05.jpg' },
  { id: 'rb7', brand: '프론트로우',            name: '크리스프 버튼다운 블라우스',    discount: 20, price: 78000,  image: '/pd03.jpg' },
  { id: 'rb8', brand: '몽돌',                 name: '체크 시어서커 오버핏 셔츠',     discount: 26, price: 72410,  image: '/pd02.jpg' },
];

const RELATED_PRODUCTS = [
  { id: 1,  brand: '마리떼 프랑소와 저버', name: 'AEROCOOL LEMON SHORT SLEEVE T-SHIRT', discount: 5,  price: 56050  },
  { id: 2,  brand: '레이지지',             name: 'Loose Fit Classic Check Jacket',       discount: 29, price: 76736  },
  { id: 3,  brand: '마리떼 프랑소와 저버', name: 'SMALL CLASSIC LOGO POLO SHIRT',        discount: 5,  price: 84550  },
  { id: 4,  brand: '온앤온',               name: '넥 스트링 라이트 윈드 점퍼',            discount: 34, price: 170940 },
  { id: 5,  brand: '몽돌',                name: '체크 시어서커 오버핏 스트라이프 셔츠',   discount: 26, price: 72410  },
  { id: 6,  brand: '온앤온',               name: '쉬어 체크 오버사이즈 셔츠',             discount: 20, price: 38000  },
  { id: 7,  brand: '시아쥬',               name: 'SITP5147 노블 시어서커 오버핏 셔츠',    discount: 28, price: 62640  },
  { id: 8,  brand: '아무르 무아르',        name: '블라인드 시스루 퍼프 블라우스',         discount: 25, price: 81532  },
];

const CURATION_PRODUCTS = [
  { id: 'c1', brand: '마리떼 프랑소와 저버', name: 'AEROCOOL LEMON T-SHIRT',    price: 56050, discount: 5,  image: '/pd04.jpg' },
  { id: 'c2', brand: '온앤온',               name: '넥 스트링 라이트 윈드 점퍼', price: 84550, discount: 10, image: '/pd07.jpg' },
  { id: 'c3', brand: '레이지지',             name: 'Loose Fit Classic Check',    price: 76736, discount: 29, image: '/pd01.jpg' },
  { id: 'c4', brand: '시아쥬',               name: '노블 시어서커 오버핏 셔츠',  price: 62640, discount: 28, image: '/pd08.jpg' },
  { id: 'c5', brand: '르세지엠',             name: '타임리스 와이드 슬랙스',      price: 89000, discount: 15, image: '/pd00.jpg' },
  { id: 'c6', brand: '프론트로우',            name: '크리스프 버튼다운 블라우스',  price: 78000, discount: 20, image: '/pd03.jpg' },
  { id: 'c7', brand: '아무르 무아르',         name: '블라인드 시스루 블라우스',    price: 81532, discount: 25, image: '/pd05.jpg' },
  { id: 'c8', brand: '몽돌',                 name: '체크 시어서커 오버핏 셔츠',   price: 72410, discount: 26, image: '/pd02.jpg' },
];

const STYLE_CARDS = [
  {
    id: 'sl1',
    contentImage: '/con02.jpg',
    tag: '룩북',
    product: { image: '/pd02.jpg', brand: '마리떼 프랑소와 저버', name: '다이아 퀼팅 자수 니트', price: 89000, discount: 15 },
  },
  {
    id: 'sl2',
    contentImage: '/con01.jpg',
    tag: '스타일링',
    product: { image: '/pd04.jpg', brand: '레이브', name: 'Leo Shoulder Bag', price: 88000, discount: 10 },
  },
  {
    id: 'sl3',
    contentImage: '/con03.jpg',
    tag: 'W시리즈',
    product: { image: '/pd06.jpg', brand: '온앤온', name: '린넨 와이드 팬츠', price: 62000, discount: 20 },
  },
  {
    id: 'sl4',
    contentImage: '/con04.jpg',
    tag: '브랜드스토리',
    product: { image: '/pd08.jpg', brand: '르세지엠', name: '실크 오버핏 블라우스', price: 115000, discount: 18 },
  },
  {
    id: 'sl5',
    contentImage: '/con05.jpg',
    tag: '라이브',
    product: { image: '/pd01.jpg', brand: '프론트로우', name: '클래식 핀턱 와이드 팬츠', price: 89000, discount: 22 },
  },
];

const BEAUTY_PRODUCTS = [
  { id: 'b1', brand: '이솝',        name: 'Parsley Seed Anti-Oxidant Serum',    price: 82000,  discount: 10, image: '/bpd01.jpg' },
  { id: 'b2', brand: '조말론',      name: '잉글리쉬 페어 앤드 프리지아 크림',   price: 68000,  discount: 15, image: '/bpd02.jpg' },
  { id: 'b3', brand: '라네즈',      name: '워터 슬리핑 마스크 EX 70ml',         price: 29000,  discount: 20, image: '/bpd03.jpg' },
  { id: 'b4', brand: '드렁크엘리펀트', name: 'T.L.C Framboos Glycolic Serum',  price: 138000, discount: 12, image: '/bpd04.jpg' },
  { id: 'b5', brand: '구달',        name: '청귤 비타C 세럼 30ml',               price: 19800,  discount: 30, image: '/bpd05.jpg' },
  { id: 'b6', brand: '클라랑스',    name: '더블 세럼 EX 50ml 기획세트',          price: 142000, discount: 18, image: '/bpd06.jpg' },
  { id: 'b7', brand: '닥터자르트', name: '세라마이딘 크림 15ml + 마이크로 젤',  price: 44000,  discount: 22, image: '/bpd07.jpg' },
  { id: 'b8', brand: '헉슬리',      name: 'Oil; Grab-and-Go 30ml',              price: 38000,  discount: 25, image: '/bpd08.jpg' },
];

const LIFESTYLE_PRODUCTS = [
  { id: 'lf1', brand: '르크루제',      name: '시그니처 라운드 코코트 22cm',    price: 298000, discount: 15, image: '/lpd01.jpg' },
  { id: 'lf2', brand: '이딸라',        name: 'Teema 머그컵 세트 2p',           price: 78000,  discount: 10, image: '/lpd02.jpg' },
  { id: 'lf3', brand: '덴비',          name: '내추럴 캔버스 볼 4p',             price: 62000,  discount: 20, image: '/lpd03.jpg' },
  { id: 'lf4', brand: '스타우브',      name: '피코 코코트 라운드 18cm',         price: 245000, discount: 12, image: '/lpd04.jpg' },
  { id: 'lf5', brand: '아라비아',      name: 'Moomin 머그 0.4L',               price: 48000,  discount: 25, image: '/lpd05.jpg' },
  { id: 'lf6', brand: '헤이',          name: 'Porcelain 접시 세트 4p',          price: 89000,  discount: 18, image: '/lpd06.jpg' },
  { id: 'lf7', brand: '보덤',          name: 'KENYA 커피 프레스 0.5L',          price: 52000,  discount: 22, image: '/lpd07.jpg' },
  { id: 'lf8', brand: '카이보이콧',    name: '린넨 테이블클로스 140×240',       price: 68000,  discount: 30, image: '/lpd08.jpg' },
];

const ACTIVE_PRODUCTS = [
  { id: 'ac1', brand: '젝시믹스',  name: '에어쿨 레깅스 풀렝스',          price: 49000,  discount: 20, image: '/apd07.jpg' },
  { id: 'ac2', brand: '안다르',    name: '시그니처 스포츠브라',            price: 38000,  discount: 15, image: '/apd03.jpg' },
  { id: 'ac3', brand: '뮬라웨어',  name: '에어리 크롭 집업',              price: 62000,  discount: 25, image: '/apd09.jpg' },
  { id: 'ac4', brand: '나이키',    name: 'Dri-FIT 런닝 쇼츠',            price: 55000,  discount: 10, image: '/apd01.jpg' },
  { id: 'ac5', brand: '룰루레몬',  name: 'Align High-Rise Pant 25"',     price: 148000, discount: 12, image: '/apd05.jpg' },
  { id: 'ac6', brand: '젝시믹스',  name: '피치스킨 하이웨이스트 팬츠',    price: 52000,  discount: 30, image: '/apd10.jpg' },
  { id: 'ac7', brand: '안다르',    name: '리얼 퍼포먼스 티셔츠',          price: 42000,  discount: 18, image: '/apd02.jpg' },
  { id: 'ac8', brand: '뮬라웨어',  name: '코어 메쉬 탱크탑',             price: 35000,  discount: 22, image: '/apd06.jpg' },
];

const BRAND_AD = {
  brand: { name: '마르디 메르크디', avatar: '/pd06.jpg' },
  products: [
    { id: 'ad1', name: 'Flower Logo Tee',  price: 65000,  discount: 10, image: '/pd03.jpg' },
    { id: 'ad2', name: '플라워 크롭 자켓',  price: 128000, discount: 15, image: '/pd00.jpg' },
    { id: 'ad3', name: 'Knit Beret Hat',   price: 42000,  discount: 20, image: '/pd05.jpg' },
    { id: 'ad4', name: '로고 니트 가디건',  price: 98000,  discount: 12, image: '/pd02.jpg' },
    { id: 'ad5', name: 'Wide Denim Pants', price: 89000,  discount: 18, image: '/pd07.jpg' },
  ],
};

const BRAND_RECS = [
  {
    id: 1,
    brand: { name: '모어레스트',   nameEn: 'MORREST',     avatar: '/pd01.jpg' },
    name: '촉촉소프트 슬리밍 카라 니트 카디건', discount: 12, price: 47344,
    image: '/pd03.jpg',
  },
  {
    id: 2,
    brand: { name: '르세지엠',    nameEn: 'LESEIZIEME',  avatar: '/LESEIZIEME_logo.jpg' },
    name: '울 혼방 크롭 자켓 세트업', discount: 18, price: 132000,
    image: '/pd07.jpg',
  },
  {
    id: 3,
    brand: { name: '프론트로우',  nameEn: 'FRONTROW',    avatar: '/frontrow_logo.jpg' },
    name: '클래식 핀턱 와이드 팬츠', discount: 22, price: 89000,
    image: '/pd01.jpg',
  },
  {
    id: 4,
    brand: { name: '아무르 무아르', nameEn: 'AMOUR MUAR', avatar: '/pd04.jpg' },
    name: '플로럴 시스루 맥시 원피스', discount: 15, price: 112000,
    image: '/pd05.jpg',
  },
  {
    id: 5,
    brand: { name: '몽돌',        nameEn: 'MONGDOL',     avatar: '/pd08.jpg' },
    name: '체크 오버핏 시어서커 블레이저', discount: 26, price: 72410,
    image: '/pd08.jpg',
  },
];

const SCROLL_STYLE = {
  WebkitOverflowScrolling: 'touch', /* iOS 관성 스크롤 */
  scrollbarWidth: 'none',
  msOverflowStyle: 'none',
};

/* ─── StyleCard ─────────────────────────────────────── */
/* ─── StyleOnboardCard ──────────────────────────────── */
function StyleOnboardCard({ tab, onClick }) {
  return (
    <div
      onClick={onClick}
      style={{ flexShrink: 0, width: 118, cursor: 'pointer' }}
    >
      <div style={{
        position: 'relative',
        width: '100%',
        aspectRatio: '3/4',
        borderRadius: 10,
        overflow: 'hidden',
        background: '#EBEBEB',
      }}>
        <img
          src={tab.image}
          alt={tab.label}
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          loading="lazy"
        />
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to top, rgba(0,0,0,0.52) 0%, transparent 55%)',
        }} />
        <span style={{
          position: 'absolute', bottom: 11, left: 11,
          fontSize: 12.5, fontWeight: 700, color: '#fff',
          letterSpacing: '-0.01em', lineHeight: 1,
        }}>
          {tab.label}
        </span>
      </div>
    </div>
  );
}

/* ─── StyleCard ─────────────────────────────────────── */
function StyleCard({ card, onClick }) {
  return (
    <div style={{ flexShrink: 0, width: 170, cursor: 'pointer' }} onClick={onClick}>
      {/* 에디토리얼 이미지 */}
      <div style={{ aspectRatio: '3 / 4', borderRadius: 10, overflow: 'hidden', position: 'relative', background: '#EBEBEB' }}>
        <img
          src={card.contentImage}
          alt={card.tag}
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          loading="lazy"
        />
        {card.tag && (
          <div style={{
            position: 'absolute', top: 10, left: 10,
            display: 'flex', alignItems: 'center', gap: 5,
            background: 'rgba(30,30,30,0.62)',
            backdropFilter: 'blur(6px)',
            borderRadius: 100,
            padding: '5px 11px 5px 9px',
          }}>
            <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#fff', flexShrink: 0, display: 'block' }} />
            <span style={{ fontSize: 11.5, fontWeight: 500, color: '#fff', letterSpacing: '0.01em', lineHeight: 1 }}>
              {card.tag}
            </span>
          </div>
        )}
      </div>

      {/* 상품 정보 행 */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, paddingTop: 10 }}>
        <div style={{ flexShrink: 0, width: 52, height: 52, borderRadius: 6, overflow: 'hidden', background: '#EBEBEB' }}>
          <img src={card.product.image} alt={card.product.name} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
        </div>
        <div style={{ minWidth: 0 }}>
          <p style={{ margin: 0, fontSize: 12, fontWeight: 600, color: '#111', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', letterSpacing: '-0.01em' }}>
            {card.product.brand}
          </p>
          <p style={{ margin: '3px 0 4px', fontSize: 11, color: '#999', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', letterSpacing: '-0.01em' }}>
            {card.product.name}
          </p>
          <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: '#111', letterSpacing: '-0.02em' }}>
            {card.product.price.toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  );
}

/* ─── ProductDetailPage ─────────────────────────────── */
function ProductDetailPage({ item, onBack }) {
  const image = item.image || `/pd0${item.id}.jpg`;
  const brandName = typeof item.brand === 'string' ? item.brand : (item.brand?.name ?? '');
  return (
    <>
      <header style={{
        position: 'sticky', top: 0, zIndex: 10,
        display: 'flex', alignItems: 'center',
        padding: '0 8px', height: 52,
        background: '#fff', borderBottom: '1px solid #F0F0F0',
      }}>
        <button
          onClick={onBack}
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 40, height: 40, background: 'none', border: 'none', cursor: 'pointer' }}
        >
          <ChevronLeft size={24} strokeWidth={1.5} color="#111" />
        </button>
        <p style={{ flex: 1, textAlign: 'center', fontSize: 15, fontWeight: 500, color: '#111', letterSpacing: '-0.01em', margin: 0 }}>
          상품 상세
        </p>
        <div style={{ width: 40 }} />
      </header>

      <div style={{ aspectRatio: '3 / 4', background: '#EBEBEB' }}>
        <img src={image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
      </div>

      <div style={{ padding: '20px 20px 60px' }}>
        <p style={{ fontSize: 12.5, color: '#888', letterSpacing: '-0.01em', marginBottom: 8, margin: '0 0 8px' }}>{brandName}</p>
        <h1 style={{ fontSize: 16, fontWeight: 500, color: '#111', lineHeight: 1.45, letterSpacing: '-0.02em', margin: '0 0 14px' }}>
          {item.name}
        </h1>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
          <span style={{ fontSize: 16, fontWeight: 700, color: '#FF3300' }}>{item.discount}%</span>
          <span style={{ fontSize: 22, fontWeight: 700, color: '#111', letterSpacing: '-0.03em' }}>
            {item.price.toLocaleString()}원
          </span>
        </div>
      </div>
    </>
  );
}

/* ─── BrandRecCard ──────────────────────────────────── */
function BrandRecCard({ item, onClick }) {
  const [liked, setLiked] = useState(false);
  return (
    <div className="flex-shrink-0" style={{ width: 158, minWidth: 0, cursor: 'pointer' }} onClick={onClick}>

      {/* 1. 브랜드 정보 */}
      <div className="flex items-center justify-between" style={{ marginBottom: 8 }}>
        <div className="flex items-center gap-[7px]" style={{ minWidth: 0 }}>
          <div
            className="flex-shrink-0 overflow-hidden"
            style={{ width: 28, height: 28, borderRadius: '50%', border: '1px solid #E6E6E6', background: '#F4F4F4' }}
          >
            <img
              src={item.brand.avatar}
              alt={item.brand.name}
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
              loading="lazy"
            />
          </div>
          <div style={{ minWidth: 0 }}>
            <p style={{ fontSize: 11.5, fontWeight: 600, color: '#111', lineHeight: 1.2, letterSpacing: '-0.01em', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {item.brand.name}
            </p>
            <p style={{ fontSize: 9.5, fontWeight: 400, color: '#AAA', lineHeight: 1.2, letterSpacing: '0.02em', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {item.brand.nameEn}
            </p>
          </div>
        </div>
        <button
          aria-label="관심 브랜드"
          onClick={(e) => { e.stopPropagation(); setLiked((v) => !v); }}
          style={{ flexShrink: 0, padding: 2 }}
        >
          <Heart
            size={14}
            strokeWidth={1.5}
            style={{ color: liked ? '#FF3300' : '#C0C0C0', fill: liked ? '#FF3300' : 'none', display: 'block' }}
          />
        </button>
      </div>

      {/* 2. 상품 이미지 */}
      <div className="overflow-hidden" style={{ aspectRatio: '3 / 4', borderRadius: 8, background: '#EBEBEB' }}>
        <img
          src={item.image}
          alt={item.name}
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          loading="lazy"
          decoding="async"
        />
      </div>

      {/* 3. 상품명 */}
      <p style={{ fontSize: 12, fontWeight: 400, color: '#333', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', letterSpacing: '-0.01em', marginTop: 8, marginBottom: 3 }}>
        {item.name}
      </p>

      {/* 4. 가격 */}
      <div className="flex items-baseline gap-[4px]">
        <span style={{ fontSize: 11.5, fontWeight: 700, color: '#FF3300' }}>{item.discount}%</span>
        <span style={{ fontSize: 12.5, fontWeight: 700, color: '#111', letterSpacing: '-0.02em' }}>{item.price.toLocaleString()}</span>
      </div>

    </div>
  );
}

/* ─── BottomNav ─────────────────────────────────────── */
const NAV_TABS = [
  { id: 'home',     label: '홈',      Icon: Home      },
  { id: 'category', label: '카테고리', Icon: LayoutGrid },
  { id: 'search',   label: '검색',    Icon: Search    },
  { id: 'heart',    label: '하트',    Icon: Heart     },
  { id: 'my',       label: '마이',    Icon: User      },
];

function BottomNav({ active, onChange }) {
  return (
    <nav
      style={{
        position: 'fixed',
        bottom: 0,
        left: '50%',
        transform: 'translateX(-50%)',
        width: '100%',
        maxWidth: 390,
        background: '#fff',
        borderTop: '1px solid #EFEFEF',
        display: 'flex',
        zIndex: 100,
        /* iOS 홈 인디케이터 영역 확보 */
        paddingBottom: 'env(safe-area-inset-bottom, 0px)',
      }}
    >
      {NAV_TABS.map(({ id, label, Icon }) => {
        const isActive = active === id;
        return (
          <button
            key={id}
            aria-label={label}
            onClick={() => onChange(id)}
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 3,
              padding: '10px 0 8px',
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            <Icon
              size={22}
              strokeWidth={isActive ? 2 : 1.3}
              color={isActive ? '#111' : '#C0C0C0'}
              fill={isActive && id === 'home' ? '#111' : 'none'}
            />
            <span
              style={{
                fontSize: 10,
                fontWeight: isActive ? 600 : 400,
                color: isActive ? '#111' : '#C0C0C0',
                letterSpacing: '0.01em',
                lineHeight: 1,
              }}
            >
              {label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}

/* ─── BrandAvatar ────────────────────────────────────── */
function BrandAvatar({ brand }) {
  const { name, hasNewArrivals, logo, url } = brand;
  return (
    <button
      aria-label={name}
      className="flex flex-col items-center flex-shrink-0"
      style={{ gap: 9 }}
      onClick={() => url && (window.location.href = url)}
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
function ProductCard({ item, onClick }) {
  const [liked, setLiked] = useState(false);
  return (
    <div style={{ minWidth: 0, cursor: 'pointer' }} onClick={onClick}>
      {/* 3:4 이미지 — 하트 없음 */}
      <div
        className="overflow-hidden"
        style={{ aspectRatio: '3 / 4', borderRadius: 4, background: '#EBEBEB' }}
      >
        <img
          src={item.image || `/pd0${item.id}.jpg`}
          alt={item.name}
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          loading="lazy"
          decoding="async"
        />
      </div>

      {/* 텍스트 */}
      <div style={{ marginTop: 7 }}>
        {/* 브랜드명 + 하트 (같은 줄) */}
        <div className="flex items-center justify-between" style={{ gap: 4 }}>
          <span
            style={{
              fontSize: 11.5, fontWeight: 400, color: '#222',
              letterSpacing: '-0.01em', lineHeight: 1,
              overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
              minWidth: 0,
            }}
          >
            {item.brand}
          </span>
          <button
            aria-label="관심 상품"
            onClick={(e) => { e.stopPropagation(); setLiked((v) => !v); }}
            style={{ flexShrink: 0, padding: 1 }}
          >
            <Heart
              size={13}
              strokeWidth={1.5}
              style={{ color: liked ? '#FF3300' : '#C0C0C0', fill: liked ? '#FF3300' : 'none', display: 'block' }}
            />
          </button>
        </div>

        {/* 상품명 — 1줄 말줄임 */}
        <p
          style={{
            fontSize: 11.5, fontWeight: 400, color: '#777',
            whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
            letterSpacing: '-0.01em', lineHeight: 1.35, marginTop: 3,
          }}
        >
          {item.name}
        </p>

        {/* 할인율 + 가격 */}
        <div className="flex items-baseline gap-[4px]" style={{ marginTop: 4 }}>
          <span style={{ fontSize: 11.5, fontWeight: 700, color: '#FF3300', letterSpacing: '-0.01em' }}>
            {item.discount}%
          </span>
          <span style={{ fontSize: 12.5, fontWeight: 700, color: '#111', letterSpacing: '-0.02em' }}>
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
  const [activeNav,    setActiveNav]    = useState('home');
  const bannerTrackRef = useRef(null);

  /* ── 콜드스타트 ── */
  const [isColdStart, setIsColdStart] = useState(true);
  /* ── 스타일 온보딩 ── */
  const [isStylePicked,    setIsStylePicked]    = useState(false);
  const [selectedStyle,    setSelectedStyle]    = useState(null);
  /* ── 카테고리 온보딩 ── */
  const [isCategoryPicked, setIsCategoryPicked] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);

  /* ── 페이지 네비게이션 ── */
  const [page,          setPage]          = useState('home');
  const [selectedItem,  setSelectedItem]  = useState(null);

  /* ── 추천 상품 shuffle ── */
  const [refreshKey,        setRefreshKey]        = useState(0);
  const [displayedRelated,  setDisplayedRelated]  = useState(RELATED_PRODUCTS);
  const [displayedCuration, setDisplayedCuration] = useState(CURATION_PRODUCTS);
  const [displayedBeauty,   setDisplayedBeauty]   = useState(BEAUTY_PRODUCTS);

  const handleProductClick = useCallback((item) => {
    setSelectedItem(item);
    setPage('detail');
  }, []);

  /* 홈으로 돌아올 때 세 구좌 모두 셔플 + refreshKey 증가 → 카드 stagger 재실행 */
  const handleBack = useCallback(() => {
    setPage('home');
    setIsColdStart(false);
    setDisplayedRelated(shuffle(RELATED_PRODUCTS));
    setDisplayedCuration(shuffle(CURATION_PRODUCTS));
    setDisplayedBeauty(shuffle(BEAUTY_PRODUCTS));
    setRefreshKey(k => k + 1);
  }, []);

  const handleBannerScroll = useCallback((e) => {
    const el = e.currentTarget;
    const first = el.firstElementChild;
    if (!first) return;
    const slideStep = first.offsetWidth + 12;
    const idx = Math.round(el.scrollLeft / slideStep);
    setActiveBanner(Math.max(0, Math.min(idx, BANNERS.length - 1)));
  }, []);

  return (
    <div
      style={{
        position: 'relative',
        maxWidth: 390,
        margin: '0 auto',
        minHeight: '100dvh',
        background: '#fff',
        fontFamily: "'Inter', 'Pretendard', -apple-system, BlinkMacSystemFont, sans-serif",
      }}
    >
    {/* ── 홈 컨텐츠 (자연 흐름 — 브라우저 스크롤) ── */}
    <div style={{ paddingBottom: 80 }}>

      {/* ══════════════════════════════════════
          NAVIGATION
      ══════════════════════════════════════ */}
      <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 20px 10px 20px' }}>
        <img src="/logo_new.svg" alt="W CONCEPT" style={{ height: 20, display: 'block' }} />

        {/* 아이콘 그룹 — 우측 여백 포함 */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 18, paddingRight: 4 }}>
          <button aria-label="검색" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 32, height: 32, background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
            <img src="/ic_search_new.svg" alt="검색" style={{ width: 22, height: 22, display: 'block' }} />
          </button>

          <button aria-label="장바구니" style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', width: 32, height: 32, background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
            <img src="/ic_basket_new.svg" alt="장바구니" style={{ width: 22, height: 22, display: 'block' }} />
            <span style={{
              position: 'absolute', top: -1, right: -1,
              width: 16, height: 16,
              background: '#111', borderRadius: '50%',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 9, fontWeight: 600, color: '#fff', lineHeight: 1,
            }}>
              8
            </span>
          </button>
        </div>
      </header>

      {/* ══════════════════════════════════════
          CATEGORY TABS  — horizontal scroll
          overflow-x:auto + snap feel via -webkit-overflow-scrolling
      ══════════════════════════════════════ */}
      <div style={{ position: 'sticky', top: 0, zIndex: 20, background: '#fff', borderBottom: '1px solid #F0F0F0' }}>
        <div
          className="flex items-center gap-[7px] overflow-x-auto scrollbar-hide"
          style={{ ...SCROLL_STYLE, paddingLeft: 20, paddingTop: 14, paddingBottom: 12 }}
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
                {banner.badge && !isColdStart && (
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
      <AnimatePresence>
      {!isColdStart && (
      <motion.section className="pt-3 pb-4"
        initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
        exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.35, ease: [0.4,0,0.2,1] }}
      >
        <h3
          className="px-5 text-black"
          style={{ fontSize: 17, fontWeight: 600, letterSpacing: '-0.025em', margin: '0 0 10px' }}
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
      </motion.section>
      )}
      </AnimatePresence>

      {/* ══════════════════════════════════════
          연관 추천 / 실시간 베스트 (콜드스타트 전환)
      ══════════════════════════════════════ */}
      <AnimatePresence mode="wait">
      {isColdStart ? (
        <motion.section key="best"
          style={{ paddingTop: 28, paddingBottom: 40 }}
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.32, ease: [0.4,0,0.2,1] }}
        >
          <h3 className="px-5" style={{ fontSize: 17, fontWeight: 600, color: '#111', letterSpacing: '-0.025em', margin: '0 0 20px' }}>
            지금 W컨셉에서 주목받는 상품
          </h3>
          <div className="overflow-x-auto scrollbar-hide" style={{ ...SCROLL_STYLE, display: 'grid', gridTemplateRows: 'auto auto', gridAutoFlow: 'column', gridAutoColumns: 98, columnGap: 10, rowGap: 20, paddingLeft: 20, paddingRight: 20, paddingTop: 2, paddingBottom: 4 }}>
            {REALTIME_BEST.map((item, i) => (
              <motion.div key={item.id} style={{ minWidth: 0, position: 'relative' }}
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.22, delay: Math.floor(i / 2) * 0.055, ease: [0.4,0,0.2,1] }}
              >
                <span style={{ position: 'absolute', top: 6, left: 6, zIndex: 1, fontSize: 11, fontWeight: 700, color: i < 3 ? '#FF3300' : '#999', lineHeight: 1 }}>{i + 1}</span>
                <ProductCard item={item} onClick={() => handleProductClick(item)} />
              </motion.div>
            ))}
          </div>
        </motion.section>
      ) : (
        <motion.section key="related"
          style={{ paddingTop: 28, paddingBottom: 40 }}
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.32, ease: [0.4,0,0.2,1] }}
        >
          <div className="flex items-center gap-[10px] px-5 mb-5">
            <div className="flex-shrink-0 overflow-hidden" style={{ width: 44, height: 44, borderRadius: 6, background: '#EBEBEB' }}>
              <img src="/pd00.jpg" alt="최근 본 상품" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
            </div>
            <div style={{ minWidth: 0 }}>
              <h3 style={{ fontSize: 14, fontWeight: 700, color: '#111', letterSpacing: '-0.02em', lineHeight: 1.3, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', margin: 0 }}>
                시어서커 오버핏 스트라이프 셔츠 [핑크]
              </h3>
              <p style={{ fontSize: 11.5, fontWeight: 400, color: '#AAA', letterSpacing: '0.01em', marginTop: 3, lineHeight: 1 }}>
                이 상품과 비슷한 무드의 아이템
              </p>
            </div>
          </div>
          <div className="overflow-x-auto scrollbar-hide" style={{ ...SCROLL_STYLE, display: 'grid', gridTemplateRows: 'auto auto', gridAutoFlow: 'column', gridAutoColumns: 98, columnGap: 10, rowGap: 20, paddingLeft: 20, paddingRight: 20, paddingTop: 2, paddingBottom: 4 }}>
            {displayedRelated.map((item, i) => (
              <motion.div key={refreshKey + '-' + item.id} style={{ minWidth: 0 }}
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.22, delay: Math.floor(i / 2) * 0.055, ease: [0.4,0,0.2,1] }}
              >
                <ProductCard item={item} onClick={() => handleProductClick(item)} />
              </motion.div>
            ))}
          </div>
        </motion.section>
      )}
      </AnimatePresence>

      {/* ══════════════════════════════════════
          스타일 큐레이션 / 스타일 선택 온보딩
      ══════════════════════════════════════ */}
      <AnimatePresence mode="wait">
      {!isStylePicked && isColdStart ? (
        <motion.section key="style-onboard"
          style={{ paddingTop: 28, paddingBottom: 36 }}
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.32, ease: [0.4,0,0.2,1] }}
        >
          <div className="px-5" style={{ marginBottom: 20 }}>
            <h3 style={{ fontSize: 17, fontWeight: 600, color: '#111', letterSpacing: '-0.025em', margin: '0 0 5px' }}>
              어떤 스타일이 취향인가요?
            </h3>
            <p style={{ margin: 0, fontSize: 12.5, color: '#999', letterSpacing: '-0.01em' }}>
              관심 스타일을 선택하시면 맞춤 추천을 드려요
            </p>
          </div>
          <div
            className="flex overflow-x-auto scrollbar-hide"
            style={{ ...SCROLL_STYLE, gap: 10, paddingLeft: 20, paddingRight: 20, paddingBottom: 4 }}
          >
            {STYLE_TABS.map(tab => (
              <StyleOnboardCard
                key={tab.id}
                tab={tab}
                onClick={() => { setSelectedStyle(tab.label); setIsStylePicked(true); }}
              />
            ))}
          </div>
        </motion.section>
      ) : (
        <motion.section key="style-cards"
          style={{ paddingTop: 28, paddingBottom: 44 }}
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.32, ease: [0.4,0,0.2,1] }}
        >
          <div className="px-5" style={{ marginBottom: 20 }}>
            <h3 style={{ fontSize: 17, fontWeight: 600, color: '#111', letterSpacing: '-0.025em', margin: 0 }}>
              주말에 어울리는 모던 시크 룩
            </h3>
          </div>
          <div className="flex overflow-x-auto scrollbar-hide" style={{ ...SCROLL_STYLE, gap: 12, paddingLeft: 16, paddingRight: 16, paddingBottom: 4 }}>
            {STYLE_CARDS.map((card) => (
              <StyleCard key={card.id} card={card} onClick={() => handleProductClick({ ...card.product, id: card.id, brand: card.product.brand })} />
            ))}
          </div>
        </motion.section>
      )}
      </AnimatePresence>

      {/* ══════════════════════════════════════
          추천 브랜드
      ══════════════════════════════════════ */}
      <section style={{ paddingTop: 28, paddingBottom: 44 }}>
        {/* 섹션 헤더 */}
        {isColdStart ? (
          <h3 className="px-5" style={{ fontSize: 17, fontWeight: 600, color: '#111', letterSpacing: '-0.025em', margin: '0 0 20px' }}>
            요즘 사랑받는 브랜드
          </h3>
        ) : (
          <div className="flex items-center gap-[10px] px-5 mb-5">
            <div
              className="flex-shrink-0 overflow-hidden"
              style={{ width: 44, height: 44, borderRadius: 6, background: '#EBEBEB' }}
            >
              <img
                src="/pd07.jpg"
                alt="마리떼 프랑소와 저버"
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
              />
            </div>
            <div style={{ minWidth: 0 }}>
              <h3 style={{ fontSize: 15, fontWeight: 700, color: '#111', letterSpacing: '-0.02em', lineHeight: 1.3, margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                마리떼 프랑소와 저버
              </h3>
              <p style={{ fontSize: 11.5, fontWeight: 400, color: '#AAA', letterSpacing: '0.01em', marginTop: 3, lineHeight: 1 }}>
                이 브랜드와 결이 비슷한 추천 브랜드
              </p>
            </div>
          </div>
        )}

        {/* 브랜드 추천 카드 — 가로 스크롤
            서브 이미지가 카드 우측으로 8px 삐져나오므로
            paddingRight을 넉넉하게 설정
        */}
        <div
          className="flex overflow-x-auto scrollbar-hide"
          style={{
            ...SCROLL_STYLE,
            gap: 20,
            paddingLeft: 20,
            paddingRight: 24,
            paddingTop: 4,
            paddingBottom: 4,
          }}
        >
          {BRAND_RECS.map((item) => (
            <BrandRecCard key={item.id} item={item} onClick={() => handleProductClick(item)} />
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════
          뷰티 추천 / 카테고리 선택 온보딩
      ══════════════════════════════════════ */}
      <AnimatePresence mode="wait">
      {!isCategoryPicked && isColdStart ? (
        <motion.section key="cat-onboard"
          style={{ paddingTop: 28, paddingBottom: 36 }}
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.32, ease: [0.4,0,0.2,1] }}
        >
          <h3 className="px-5" style={{ fontSize: 17, fontWeight: 600, color: '#111', letterSpacing: '-0.025em', margin: '0 0 6px' }}>
            관심 카테고리를 선택해주세요
          </h3>
          <p className="px-5" style={{ fontSize: 12.5, color: '#999', margin: '0 0 18px' }}>선택한 카테고리 기반으로 상품을 추천해 드려요</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10, padding: '0 20px' }}>
            {CATEGORY_OPTIONS.map(opt => (
              <button key={opt.id} onClick={() => { setSelectedCategory(opt.label); setIsCategoryPicked(true); }}
                style={{ padding: '14px 0', borderRadius: 8, border: '1px solid #E0E0E0', background: '#F7F8F9', fontSize: 13, color: '#333', cursor: 'pointer', textAlign: 'center' }}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </motion.section>
      ) : (
      <motion.section key="beauty"
        style={{ paddingTop: 28, paddingBottom: 32 }}
        initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.32, ease: [0.4,0,0.2,1] }}
      >
        <div className="px-5" style={{ marginBottom: 20 }}>
          <h3 style={{ fontSize: 17, fontWeight: 600, color: '#111', letterSpacing: '-0.025em', margin: 0 }}>
            여름 휴가에서 빛나는 수분 글로우 픽
          </h3>
        </div>

        <div
          className="overflow-x-auto scrollbar-hide"
          style={{
            ...SCROLL_STYLE,
            display: 'grid',
            gridTemplateRows: 'auto auto',
            gridAutoFlow: 'column',
            gridAutoColumns: 98,
            columnGap: 10,
            rowGap: 20,
            paddingLeft: 20,
            paddingRight: 20,
            paddingTop: 2,
            paddingBottom: 4,
          }}
        >
          {displayedBeauty.map((item, i) => (
            <motion.div
              key={refreshKey + '-' + item.id}
              style={{ minWidth: 0 }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.22, delay: Math.floor(i / 2) * 0.055, ease: [0.4, 0, 0.2, 1] }}
            >
              <ProductCard item={item} onClick={() => handleProductClick(item)} />
            </motion.div>
          ))}
        </div>
        <div style={{ padding: '16px 20px 0' }}>
          <button style={{ width: '100%', height: 42, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4, background: '#fff', border: '1px solid #E0E0E0', borderRadius: 4, fontSize: 13, fontWeight: 400, color: '#444', letterSpacing: '-0.01em', cursor: 'pointer' }}>
            뷰티 더보기 <span style={{ fontSize: 15, lineHeight: 1 }}>›</span>
          </button>
        </div>
      </motion.section>
      )}
      </AnimatePresence>

      {/* 광고 배너 ~ 액티브 추천: 개인화 상태에서만 노출 */}
      {!isColdStart && (<>
      {/* ══════════════════════════════════════
          광고 배너
      ══════════════════════════════════════ */}
      <div style={{ padding: '4px 0 32px' }}>
        <div
          style={{
            position: 'relative',
            width: '100%',
            aspectRatio: '16 / 9',
            overflow: 'hidden',
            background: '#CFCFCF',
            cursor: 'pointer',
          }}
        >
          <img
            src="/ADBANNER.jpg"
            alt="광고 배너"
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            loading="lazy"
          />
          {/* 하단 그라디언트 */}
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.62) 0%, rgba(0,0,0,0.0) 55%)' }} />

          {/* 광고 태그 — 우상단 */}
          <span style={{
            position: 'absolute', top: 10, right: 10,
            background: 'rgba(255,255,255,0.28)',
            border: '1px solid rgba(255,255,255,0.55)',
            borderRadius: 4,
            padding: '3px 6px',
            fontSize: 10, fontWeight: 500, color: '#fff',
            letterSpacing: '0.04em', lineHeight: 1,
          }}>광고</span>

          {/* 텍스트 — 좌하단 */}
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '14px 16px 18px' }}>
            <p style={{ margin: '0 0 4px', fontSize: 20, fontWeight: 700, color: '#fff', letterSpacing: '-0.01em', lineHeight: 1.2 }}>
              오디에르 SUMMER
            </p>
            <p style={{ margin: 0, fontSize: 13, fontWeight: 400, color: 'rgba(255,255,255,0.88)', letterSpacing: '0.01em', lineHeight: 1, display: 'flex', alignItems: 'center', gap: 3 }}>
              기획전 둘러보기 <span style={{ fontSize: 12 }}>›</span>
            </p>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════
          광고 배너 하단 — 연관 추천 상품
      ══════════════════════════════════════ */}
      <section style={{ paddingTop: 28, paddingBottom: 40 }}>
        <div className="flex items-center gap-[10px] px-5 mb-5">
          <div className="flex-shrink-0 overflow-hidden" style={{ width: 44, height: 44, borderRadius: 6, background: '#EBEBEB' }}>
            <img src="/pd03.jpg" alt="최근 본 상품" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
          </div>
          <div style={{ minWidth: 0 }}>
            <h3 style={{ fontSize: 14, fontWeight: 700, color: '#111', letterSpacing: '-0.02em', lineHeight: 1.3, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', margin: 0 }}>
              울 혼방 크롭 자켓 세트업
            </h3>
            <p style={{ fontSize: 11.5, fontWeight: 400, color: '#AAA', letterSpacing: '0.01em', marginTop: 3, lineHeight: 1 }}>
              이 상품과 비슷한 무드의 아이템
            </p>
          </div>
        </div>
        <div className="overflow-x-auto scrollbar-hide" style={{ ...SCROLL_STYLE, display: 'grid', gridTemplateRows: 'auto auto', gridAutoFlow: 'column', gridAutoColumns: 98, columnGap: 10, rowGap: 20, paddingLeft: 20, paddingRight: 20, paddingTop: 2, paddingBottom: 4 }}>
          {RELATED_PRODUCTS.map((item, i) => (
            <motion.div key={'b2-' + item.id} style={{ minWidth: 0 }} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.22, delay: Math.floor(i / 2) * 0.055, ease: [0.4, 0, 0.2, 1] }}>
              <ProductCard item={item} onClick={() => handleProductClick(item)} />
            </motion.div>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════
          광고 배너 하단 — 에디토리얼
      ══════════════════════════════════════ */}
      <section style={{ paddingTop: 28, paddingBottom: 44 }}>
        <h3 className="px-5" style={{ fontSize: 17, fontWeight: 600, color: '#111', letterSpacing: '-0.025em', margin: '0 0 20px' }}>
          오피스룩으로 입기 좋은 베이직 룩
        </h3>
        <div className="flex overflow-x-auto scrollbar-hide" style={{ ...SCROLL_STYLE, gap: 12, paddingLeft: 16, paddingRight: 16, paddingBottom: 4 }}>
          {STYLE_CARDS.map((card) => (
            <StyleCard
              key={'b2-' + card.id}
              card={card}
              onClick={() => handleProductClick({ ...card.product, id: card.id, brand: card.product.brand })}
            />
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════
          광고 배너 하단 — 브랜드 추천
      ══════════════════════════════════════ */}
      <section style={{ paddingTop: 28, paddingBottom: 44 }}>
        <div className="flex items-center gap-[10px] px-5 mb-5">
          <div className="flex-shrink-0 overflow-hidden" style={{ width: 44, height: 44, borderRadius: 6, background: '#EBEBEB' }}>
            <img src="/lazy_logo.jpg" alt="브랜드 추천" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
          </div>
          <div style={{ minWidth: 0 }}>
            <h3 style={{ fontSize: 15, fontWeight: 700, color: '#111', letterSpacing: '-0.02em', lineHeight: 1.3, margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              레이지지
            </h3>
            <p style={{ fontSize: 11.5, fontWeight: 400, color: '#AAA', letterSpacing: '0.01em', marginTop: 3, lineHeight: 1 }}>
              이 브랜드와 결이 비슷한 추천 브랜드
            </p>
          </div>
        </div>
        <div className="flex overflow-x-auto scrollbar-hide" style={{ ...SCROLL_STYLE, gap: 20, paddingLeft: 20, paddingRight: 24, paddingTop: 4, paddingBottom: 4 }}>
          {BRAND_RECS.map((item) => (
            <BrandRecCard key={'b2-' + item.id} item={item} onClick={() => handleProductClick(item)} />
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════
          광고 배너 하단 — 뷰티 추천
      ══════════════════════════════════════ */}
      <section style={{ paddingTop: 28, paddingBottom: 44 }}>
        <h3 className="px-5" style={{ fontSize: 17, fontWeight: 600, color: '#111', letterSpacing: '-0.025em', margin: '0 0 20px' }}>
          주말 아침을 깨우는 감성 테이블웨어
        </h3>
        <div className="overflow-x-auto scrollbar-hide" style={{ ...SCROLL_STYLE, display: 'grid', gridTemplateRows: 'auto auto', gridAutoFlow: 'column', gridAutoColumns: 98, columnGap: 10, rowGap: 20, paddingLeft: 20, paddingRight: 20, paddingTop: 2, paddingBottom: 4 }}>
          {LIFESTYLE_PRODUCTS.map((item, i) => (
            <motion.div key={'b2-' + item.id} style={{ minWidth: 0 }} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.22, delay: Math.floor(i / 2) * 0.055, ease: [0.4, 0, 0.2, 1] }}>
              <ProductCard item={item} onClick={() => handleProductClick(item)} />
            </motion.div>
          ))}
        </div>
        <div style={{ padding: '16px 20px 0' }}>
          <button style={{ width: '100%', height: 42, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4, background: '#fff', border: '1px solid #E0E0E0', borderRadius: 4, fontSize: 13, fontWeight: 400, color: '#444', letterSpacing: '-0.01em', cursor: 'pointer' }}>
            라이프 더보기 <span style={{ fontSize: 15, lineHeight: 1 }}>›</span>
          </button>
        </div>
      </section>

      {/* ══════════════════════════════════════
          브랜드 광고
      ══════════════════════════════════════ */}
      <section style={{ paddingTop: 20, paddingBottom: 32 }}>
        {/* 헤더: 브랜드 정보 + 광고 태그 */}
        <div className="flex items-center gap-[12px] px-5 mb-4">
          <div style={{ flexShrink: 0, width: 52, height: 52, borderRadius: 8, background: '#EBEBEB', overflow: 'hidden' }}>
            <img src={BRAND_AD.brand.avatar} alt={BRAND_AD.brand.name} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ margin: 0, fontSize: 16, fontWeight: 700, color: '#111', letterSpacing: '-0.02em' }}>{BRAND_AD.brand.name}</p>
            <p style={{ margin: '3px 0 0', fontSize: 12, fontWeight: 400, color: '#AAA', letterSpacing: '0.01em' }}>추천 브랜드</p>
          </div>
          <span style={{ flexShrink: 0, fontSize: 11, fontWeight: 400, color: '#AAA', border: '1px solid #DDD', borderRadius: 4, padding: '3px 7px', lineHeight: 1 }}>광고</span>
        </div>

        {/* 상품 카드 — 단일행 가로 스크롤 */}
        <div className="flex overflow-x-auto scrollbar-hide" style={{ ...SCROLL_STYLE, gap: 10, paddingLeft: 20, paddingRight: 20, paddingBottom: 4 }}>
          {BRAND_AD.products.map((item) => (
            <div
              key={item.id}
              style={{ flexShrink: 0, width: 140, cursor: 'pointer' }}
              onClick={() => handleProductClick({ ...item, brand: BRAND_AD.brand.name })}
            >
              <div style={{ aspectRatio: '3 / 4', borderRadius: 6, overflow: 'hidden', background: '#EBEBEB' }}>
                <img src={item.image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} loading="lazy" />
              </div>
              <p style={{ margin: '8px 0 2px', fontSize: 11.5, fontWeight: 400, color: '#333', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', letterSpacing: '-0.01em' }}>{item.name}</p>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
                <span style={{ fontSize: 11.5, fontWeight: 700, color: '#FF3300' }}>{item.discount}%</span>
                <span style={{ fontSize: 12.5, fontWeight: 700, color: '#111', letterSpacing: '-0.02em' }}>{item.price.toLocaleString()}</span>
              </div>
            </div>
          ))}
        </div>

        {/* CTA 버튼 */}
        <div style={{ paddingLeft: 20, paddingRight: 20, marginTop: 16 }}>
          <button
            style={{
              width: '100%', height: 46,
              border: '1px solid #DEDEDE', borderRadius: 8,
              background: '#fff', cursor: 'pointer',
              fontSize: 14, fontWeight: 500, color: '#111', letterSpacing: '-0.01em',
            }}
          >
            브랜드관 바로가기 &gt;
          </button>
        </div>
      </section>

      {/* ══ 추가 — 연관 추천 상품 ══ */}
      <section style={{ paddingTop: 28, paddingBottom: 40 }}>
        <div className="flex items-center gap-[10px] px-5 mb-5">
          <div className="flex-shrink-0 overflow-hidden" style={{ width: 44, height: 44, borderRadius: 6, background: '#EBEBEB' }}>
            <img src="/pd05.jpg" alt="최근 본 상품" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
          </div>
          <div style={{ minWidth: 0 }}>
            <h3 style={{ fontSize: 14, fontWeight: 700, color: '#111', letterSpacing: '-0.02em', lineHeight: 1.3, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', margin: 0 }}>
              플로럴 시스루 맥시 원피스
            </h3>
            <p style={{ fontSize: 11.5, fontWeight: 400, color: '#AAA', letterSpacing: '0.01em', marginTop: 3, lineHeight: 1 }}>
              이 상품과 비슷한 무드의 아이템
            </p>
          </div>
        </div>
        <div className="overflow-x-auto scrollbar-hide" style={{ ...SCROLL_STYLE, display: 'grid', gridTemplateRows: 'auto auto', gridAutoFlow: 'column', gridAutoColumns: 98, columnGap: 10, rowGap: 20, paddingLeft: 20, paddingRight: 20, paddingTop: 2, paddingBottom: 4 }}>
          {RELATED_PRODUCTS.map((item, i) => (
            <motion.div key={'c3-' + item.id} style={{ minWidth: 0 }} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.22, delay: Math.floor(i / 2) * 0.055, ease: [0.4, 0, 0.2, 1] }}>
              <ProductCard item={item} onClick={() => handleProductClick(item)} />
            </motion.div>
          ))}
        </div>
      </section>

      {/* ══ 추가 — 에디토리얼 ══ */}
      <section style={{ paddingTop: 28, paddingBottom: 44 }}>
        <h3 className="px-5" style={{ fontSize: 17, fontWeight: 600, color: '#111', letterSpacing: '-0.025em', margin: '0 0 20px' }}>
          트렌드를 입다, 이번 주 픽
        </h3>
        <div className="flex overflow-x-auto scrollbar-hide" style={{ ...SCROLL_STYLE, gap: 12, paddingLeft: 16, paddingRight: 16, paddingBottom: 4 }}>
          {STYLE_CARDS.map((card) => (
            <StyleCard key={'c3-' + card.id} card={card} onClick={() => handleProductClick({ ...card.product, id: card.id, brand: card.product.brand })} />
          ))}
        </div>
      </section>

      {/* ══ 추가 — 브랜드 추천 ══ */}
      <section style={{ paddingTop: 28, paddingBottom: 44 }}>
        <div className="flex items-center gap-[10px] px-5 mb-5">
          <div className="flex-shrink-0 overflow-hidden" style={{ width: 44, height: 44, borderRadius: 6, background: '#EBEBEB' }}>
            <img src="/oui_logo.jpg" alt="브랜드 추천" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
          </div>
          <div style={{ minWidth: 0 }}>
            <h3 style={{ fontSize: 15, fontWeight: 700, color: '#111', letterSpacing: '-0.02em', lineHeight: 1.3, margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>온앤온</h3>
            <p style={{ fontSize: 11.5, fontWeight: 400, color: '#AAA', letterSpacing: '0.01em', marginTop: 3, lineHeight: 1 }}>이 브랜드와 결이 비슷한 추천 브랜드</p>
          </div>
        </div>
        <div className="flex overflow-x-auto scrollbar-hide" style={{ ...SCROLL_STYLE, gap: 20, paddingLeft: 20, paddingRight: 24, paddingTop: 4, paddingBottom: 4 }}>
          {BRAND_RECS.map((item) => (
            <BrandRecCard key={'c3-' + item.id} item={item} onClick={() => handleProductClick(item)} />
          ))}
        </div>
      </section>

      {/* ══ 추가 — 액티브 추천 ══ */}
      <section style={{ paddingTop: 28, paddingBottom: 44 }}>
        <h3 className="px-5" style={{ fontSize: 17, fontWeight: 600, color: '#111', letterSpacing: '-0.025em', margin: '0 0 20px' }}>
          활동적인 하루를 위한 액티브웨어
        </h3>
        <div className="overflow-x-auto scrollbar-hide" style={{ ...SCROLL_STYLE, display: 'grid', gridTemplateRows: 'auto auto', gridAutoFlow: 'column', gridAutoColumns: 98, columnGap: 10, rowGap: 20, paddingLeft: 20, paddingRight: 20, paddingTop: 2, paddingBottom: 4 }}>
          {ACTIVE_PRODUCTS.map((item, i) => (
            <motion.div key={item.id} style={{ minWidth: 0 }} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.22, delay: Math.floor(i / 2) * 0.055, ease: [0.4, 0, 0.2, 1] }}>
              <ProductCard item={item} onClick={() => handleProductClick(item)} />
            </motion.div>
          ))}
        </div>
        <div style={{ padding: '16px 20px 0' }}>
          <button style={{ width: '100%', height: 42, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4, background: '#fff', border: '1px solid #E0E0E0', borderRadius: 4, fontSize: 13, fontWeight: 400, color: '#444', letterSpacing: '-0.01em', cursor: 'pointer' }}>
            액티브 더보기 <span style={{ fontSize: 15, lineHeight: 1 }}>›</span>
          </button>
        </div>
      </section>
      </>)}

      {/* ══ 취향 기반 무한 피드 ══ */}
      <InfiniteFeed onProductClick={handleProductClick} coldStart={isColdStart} />

    </div>{/* end 홈 컨텐츠 */}

    {/* ── 상세 페이지 오버레이 (슬라이드 인/아웃) ── */}
    <AnimatePresence>
      {page === 'detail' && selectedItem && (
        <motion.div
          key="detail"
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
          style={{
            position: 'fixed', top: 0, bottom: 0,
            left: '0%', 
            width: '100%',
            background: '#fff', overflowY: 'auto', zIndex: 30,
          }}
        >
          <ProductDetailPage item={selectedItem} onBack={handleBack} />
        </motion.div>
      )}
    </AnimatePresence>

    {/* ── 하단 탭바 ── */}
    <BottomNav active={activeNav} onChange={setActiveNav} />

    <ScrollToTop />

    {/* ── 데모 토글 버튼 ── */}
    <button
      onClick={() => {
        const next = !isColdStart;
        setIsColdStart(next);
        if (next) {
          setIsStylePicked(false);
          setSelectedStyle(null);
          setIsCategoryPicked(false);
          setSelectedCategory(null);
        }
      }}
      style={{
        position: 'fixed',
        bottom: 80,
        right: 12,
        zIndex: 9999,
        padding: '5px 10px',
        borderRadius: 100,
        border: 'none',
        background: isColdStart ? '#3B82F6' : '#10B981',
        color: '#fff',
        fontSize: 10,
        fontWeight: 700,
        letterSpacing: '0.04em',
        cursor: 'pointer',
        boxShadow: '0 2px 8px rgba(0,0,0,0.18)',
        lineHeight: 1,
      }}
    >
      USER: {isColdStart ? 'COLD' : 'WARM'}
    </button>
    </div>
  );
}

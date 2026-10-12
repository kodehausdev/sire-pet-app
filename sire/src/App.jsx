import { useState, useRef, useEffect } from 'react';
import * as feed from './feed.js';
import {
  Home, Heart, ShoppingBag as Bag, PawPrint as Paw, X, Check, BadgeCheck as Verified,
  MapPin as Pin, MessageCircle as Chat, Plus, Minus, Phone, ThumbsUp as Up,
  ShoppingCart as Cart, Syringe as Shot, Bug, Clock, Pill, Dna, Package as Pack, Send,
} from 'lucide-react';


const naira = (n) => '₦' + n.toLocaleString('en-NG');
const primaryBtn = 'rounded-full bg-accent text-onaccent font-semibold px-5 py-3 active:scale-95 transition';
const ghostBtn = 'rounded-full border border-line text-ink font-semibold px-5 py-3 active:scale-95 transition';

/* ---------- fake data ---------- */
const VETS = [
  { id: 1, name: 'Paws & Claws Vet Clinic', area: 'Lekki Phase 1', dist: '1.2 km', open: true, phone: '0803 555 0142' },
  { id: 2, name: 'Greenfield Animal Hospital', area: 'Wuse 2', dist: '3.4 km', open: true, phone: '0809 555 0177' },
  { id: 3, name: 'Dr. Adebayo Canine Care', area: 'Bodija', dist: '5.8 km', open: false, phone: '0701 555 0119' },
];
const DOGS = [
  { id: 1, name: 'Kaiser', breed: 'German Shepherd', age: '3 yrs', place: 'Lekki, Lagos', verified: true, likesBack: true, erect: true,
    fur: '#B9803F', ear: '#6B4423', muzzle: '#2E2A26', bg1: '#CFE3D6', bg2: '#8DB9A3' },
  { id: 2, name: 'Zeus', breed: 'Rottweiler', age: '4 yrs', place: 'Wuse 2, Abuja', verified: true, likesBack: false, erect: false,
    fur: '#2A2523', ear: '#1B1716', muzzle: '#B5763A', bg1: '#F1DDBF', bg2: '#E0B27A' },
  { id: 3, name: 'Luna', breed: 'Labrador', age: '2 yrs', place: 'Bodija, Ibadan', verified: false, likesBack: true, erect: false,
    fur: '#E3C27E', ear: '#C9A25C', muzzle: '#EFD9A6', bg1: '#D6E4F2', bg2: '#9FBFDD' },
  { id: 4, name: 'Bruno', breed: 'Boerboel', age: '3 yrs', place: 'GRA, Enugu', verified: true, likesBack: true, erect: false,
    fur: '#C69A62', ear: '#5A3B22', muzzle: '#2B2420', bg1: '#EAD7E8', bg2: '#C79FC4' },
  { id: 5, name: 'Maya', breed: 'Husky', age: '2 yrs', place: 'Ikoyi, Lagos', verified: true, likesBack: false, erect: true,
    fur: '#9AA4AD', ear: '#4B545C', muzzle: '#F2F4F5', bg1: '#F6E3D2', bg2: '#EDB78F' },
];
const PRODUCTS = [
  { id: 1, name: 'Omega-3 Coat Booster', note: '120 softgels', cat: 'Supplements', price: 28500, Icon: Pill, tone: '#CFE3D6' },
  { id: 2, name: 'Joint Support Chews', note: 'Glucosamine, 90 ct', cat: 'Supplements', price: 34000, Icon: Pill, tone: '#F1DDBF' },
  { id: 3, name: 'Stud Service: Kaiser', note: 'GSD, health verified', cat: 'Studs', price: 150000, Icon: Dna, tone: '#D6E4F2' },
  { id: 4, name: 'Stud Service: Zeus', note: 'Rottweiler, health verified', cat: 'Studs', price: 200000, Icon: Dna, tone: '#EAD7E8' },
  { id: 5, name: 'Heavy-Duty Kennel 48"', note: 'Steel, tray floor', cat: 'Gear', price: 185000, Icon: Pack, tone: '#F6E3D2' },
  { id: 6, name: 'Whelping Box Kit', note: 'Rails and heat pad', cat: 'Gear', price: 96000, Icon: Pack, tone: '#DDE7C8' },
];
const START_CHECKS = [
  { id: 'rabies', group: 'Vaccines', label: 'Rabies', sub: 'Due 20 Nov', done: true },
  { id: 'dhpp', group: 'Vaccines', label: 'DHPP booster', sub: 'Due 02 Dec', done: true },
  { id: 'bordetella', group: 'Vaccines', label: 'Bordetella', sub: 'Due 15 Dec', done: false },
  { id: 'lepto', group: 'Vaccines', label: 'Leptospirosis', sub: 'Due 15 Jan', done: false },
  { id: 'worm1', group: 'Deworming', label: 'Roundworm', sub: 'Every 3 months', done: true },
  { id: 'worm2', group: 'Deworming', label: 'Tapeworm', sub: 'Every 3 months', done: false },
  { id: 'flea', group: 'Deworming', label: 'Flea and tick', sub: 'Monthly', done: false },
];

/* ---------- small pieces ---------- */
// cartoon dog so the card has something to show without external photos
function DogArt({ dog }) {
  const earL = dog.erect ? 'M98 92 L92 34 L136 70Z' : 'M92 80 Q58 92 66 156 Q94 146 108 112Z';
  const earR = dog.erect ? 'M202 92 L208 34 L164 70Z' : 'M208 80 Q242 92 234 156 Q206 146 192 112Z';
  return (
    <svg viewBox="0 0 300 260" className="w-full h-full" preserveAspectRatio="xMidYMid slice" role="img" aria-label={`${dog.name}, ${dog.breed}`}>
      <defs><linearGradient id={'bg' + dog.id} x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor={dog.bg1} /><stop offset="1" stopColor={dog.bg2} /></linearGradient></defs>
      <rect width="300" height="260" fill={`url(#bg${dog.id})`} />
      <ellipse cx="150" cy="268" rx="118" ry="74" fill={dog.fur} />
      <path d={earL} fill={dog.ear} /><path d={earR} fill={dog.ear} />
      <ellipse cx="150" cy="128" rx="62" ry="64" fill={dog.fur} />
      <ellipse cx="150" cy="158" rx="31" ry="25" fill={dog.muzzle} />
      <ellipse cx="150" cy="147" rx="11" ry="8" fill="#161616" />
      <path d="M150 155 v10 M150 165 q-9 8 -18 2 M150 165 q9 8 18 2" stroke="#161616" strokeWidth="3" fill="none" strokeLinecap="round" />
      <circle cx="126" cy="116" r="6" fill="#161616" /><circle cx="174" cy="116" r="6" fill="#161616" />
      <circle cx="128" cy="114" r="2" fill="#fff" /><circle cx="176" cy="114" r="2" fill="#fff" />
    </svg>
  );
}

function Sheet({ title, onClose, children }) {
  return (
    <div className="absolute inset-0 z-30 flex items-end bg-black/50" onClick={onClose}>
      <div className="anim-up w-full max-h-[85%] overflow-y-auto noscroll rounded-t-3xl bg-card p-5 pb-8" onClick={(e) => e.stopPropagation()}>
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-display text-xl font-bold">{title}</h3>
          <button aria-label="Close" onClick={onClose} className="p-1 text-mute"><X size={22} /></button>
        </div>
        {children}
      </div>
    </div>
  );
}

function Pill2({ children, tone = 'soft' }) {
  const look = tone === 'good' ? 'bg-accent text-onaccent' : tone === 'warn' ? 'bg-warm text-black' : 'bg-soft text-mute';
  return <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold ${look}`}>{children}</span>;
}

function Header({ title, sub, right }) {
  return (
    <div className="flex items-end justify-between px-5 pb-3 pt-4">
      <div>
        <h1 className="font-display text-[28px] font-extrabold leading-none tracking-tight">{title}</h1>
        {sub && <p className="mt-1.5 text-[13px] text-mute">{sub}</p>}
      </div>
      {right}
    </div>
  );
}

/* ---------- HOME ---------- */
const TAGS = ['Breeding', 'Whelping', 'Health', 'Studs', 'Other'];
const VET_NOTE = "Community advice isn't vet advice. If your dog is in distress or bleeding heavily, see a vet now.";
const fieldCls = 'w-full resize-none rounded-2xl border border-line bg-bg p-3 text-[15px] text-ink';

function PostCard({ post, voted, onHelpful, onOpen }) {
  return (
    <article className="rounded-2xl border border-line bg-card p-4">
      <div className="mb-2 flex items-center justify-between text-[12px] text-mute">
        <span>Anonymous{post.who ? ` · ${post.who}` : ''}</span><span>{post.time}</span>
      </div>
      <button onClick={onOpen} className="block w-full text-left">
        <h3 className="font-display text-[17px] font-bold leading-snug">{post.q}</h3>
        {post.body && <p className="mt-1 text-[14px] leading-relaxed text-mute">{post.body}</p>}
      </button>
      <div className="mt-3 flex items-center gap-2">
        <Pill2>{post.tag}</Pill2>
        <button onClick={onOpen} aria-label="Open replies" className="ml-auto flex items-center gap-1 text-[12px] text-mute">
          <Chat size={14} />{post.replies}
        </button>
        <button onClick={onHelpful} aria-pressed={voted}
          className={`flex items-center gap-1 rounded-full px-3 py-1.5 text-[12px] font-semibold transition active:scale-95 ${voted ? 'bg-accent text-onaccent' : 'bg-soft text-ink'}`}>
          <Up size={14} />{post.helpful}
        </button>
      </div>
    </article>
  );
}

function VetRow({ vet }) {
  const [showNum, setShowNum] = useState(false);
  return (
    <div className="rounded-2xl border border-line bg-card p-3.5">
      <div className="flex items-center gap-3">
        <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-soft text-accent"><Shot size={20} /></div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-[14px] font-semibold">{vet.name}</p>
          <p className="flex items-center gap-1 text-[12px] text-mute"><Pin size={12} />{vet.area} · {vet.dist}</p>
        </div>
        <Pill2 tone={vet.open ? 'good' : 'soft'}>{vet.open ? 'Open' : 'Closed'}</Pill2>
      </div>
      <button onClick={() => setShowNum(!showNum)} className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-soft py-2 text-[13px] font-semibold">
        <Phone size={14} />{showNum ? vet.phone : 'Show number'}
      </button>
    </div>
  );
}

// ask sheet: one short question, optional details, pick a tag
function AskSheet({ say, onClose, onPosted }) {
  const [q, setQ] = useState('');
  const [body, setBody] = useState('');
  const [tag, setTag] = useState('Breeding');
  const [busy, setBusy] = useState(false);
  const submit = async () => {
    if (q.trim().length < 5) return say('Write your question first');
    setBusy(true);
    try {
      onPosted(await feed.createPost({ question: q.trim(), body: body.trim(), tag }));
      say('Posted anonymously');
      onClose();
    } catch (e) { say(e.message); setBusy(false); }
  };
  return (
    <Sheet title="Ask the community" onClose={onClose}>
      <div className="mb-3 flex flex-wrap gap-2">
        {TAGS.map((t) => (
          <button key={t} onClick={() => setTag(t)} aria-pressed={tag === t}
            className={`rounded-full px-3.5 py-1.5 text-[13px] font-semibold ${tag === t ? 'bg-ink text-bg' : 'border border-line'}`}>{t}</button>
        ))}
      </div>
      <input id="askQuestion" value={q} onChange={(e) => setQ(e.target.value)} maxLength={140}
        placeholder="Your question, short" className={fieldCls} />
      <textarea id="askDetails" value={body} onChange={(e) => setBody(e.target.value)} rows={4} maxLength={600}
        placeholder="Details (breed, age, what you've tried)" className={fieldCls + ' mt-2'} />
      <button onClick={submit} disabled={busy} className={primaryBtn + ' mt-3 w-full disabled:opacity-60'}>
        {busy ? 'Posting…' : 'Post anonymously'}
      </button>
      <p className="mt-3 text-[11px] leading-relaxed text-mute">{VET_NOTE}</p>
    </Sheet>
  );
}

// thread sheet: the question, its replies, and a box to answer
function ThreadSheet({ post, say, onClose, onReplied }) {
  const [replies, setReplies] = useState(null);
  const [draft, setDraft] = useState('');
  useEffect(() => {
    feed.fetchReplies(post.id).then(setReplies).catch((e) => { setReplies([]); say(e.message); });
  }, [post.id]);
  const send = async () => {
    const text = draft.trim();
    if (!text) return;
    try {
      const reply = await feed.createReply({ postId: post.id, body: text });
      setReplies((rs) => [...(rs || []), reply]);
      setDraft('');
      onReplied(post.id);
    } catch (e) { say(e.message); }
  };
  return (
    <Sheet title="Replies" onClose={onClose}>
      <h4 className="font-display text-[17px] font-bold leading-snug">{post.q}</h4>
      {post.body && <p className="mt-1 text-[14px] leading-relaxed text-mute">{post.body}</p>}
      <div className="mt-4 flex flex-col gap-2.5">
        {replies === null && <p className="text-[13px] text-mute">Loading…</p>}
        {replies?.length === 0 && <p className="text-[13px] text-mute">No replies yet. Be the first.</p>}
        {replies?.map((r) => (
          <div key={r.id} className="rounded-2xl bg-soft p-3">
            <p className="text-[12px] text-mute">Anonymous · {r.time}</p>
            <p className="mt-0.5 text-[14px] leading-relaxed">{r.body}</p>
          </div>
        ))}
      </div>
      <div className="mt-4 flex items-end gap-2">
        <textarea id="replyBox" value={draft} onChange={(e) => setDraft(e.target.value)} rows={2} maxLength={600}
          placeholder="Share what worked for you" className={fieldCls} />
        <button onClick={send} aria-label="Send reply"
          className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-accent text-onaccent active:scale-95 transition"><Send size={18} /></button>
      </div>
      <p className="mt-3 text-[11px] leading-relaxed text-mute">{VET_NOTE}</p>
    </Sheet>
  );
}

function HomeTab({ say }) {
  const [posts, setPosts] = useState(null);       // null = still loading
  const [votes, setVotes] = useState(feed.getMyVotes);
  const [asking, setAsking] = useState(false);
  const [open, setOpen] = useState(null);

  const load = () => feed.fetchPosts().then(setPosts).catch((e) => { setPosts((p) => p || []); say(e.message); });
  useEffect(() => { load(); return feed.watchFeed(load); }, []);

  // flips my vote, updates the screen first, then tells the db
  const toggleHelpful = (post) => {
    const on = !votes.has(post.id);
    const next = new Set(votes);
    if (on) next.add(post.id); else next.delete(post.id);
    setVotes(next); feed.saveMyVotes(next);
    setPosts((ps) => ps.map((p) => (p.id === post.id ? { ...p, helpful: p.helpful + (on ? 1 : -1) } : p)));
    feed.setHelpful(post.id, on ? 1 : -1).catch((e) => say(e.message));
  };
  const addPost = (post) => setPosts((ps) => [post, ...(ps || [])]);
  const bumpReplies = (id) => setPosts((ps) => ps.map((p) => (p.id === id ? { ...p, replies: p.replies + 1 } : p)));

  return (
    <>
      <Header title="Community" sub="Ask anything. Nobody sees your name."
        right={<button onClick={() => setAsking(true)} className={primaryBtn + ' !px-4 !py-2.5 text-[13px] flex items-center gap-1'}><Plus size={16} />Ask</button>} />
      {!feed.live && <p className="mx-5 mb-3 rounded-xl bg-soft px-3 py-2 text-[12px] text-mute">Demo mode. Add your Supabase keys to make posts real.</p>}
      <div className="flex flex-col gap-3 px-5">
        {posts === null && [1, 2, 3].map((n) => <div key={n} className="h-28 animate-pulse rounded-2xl bg-soft" />)}
        {posts?.length === 0 && (
          <div className="rounded-2xl border border-dashed border-line p-6 text-center">
            <p className="font-display text-lg font-bold">No questions yet</p>
            <p className="mt-1 text-[14px] text-mute">Ask the first one.</p>
          </div>
        )}
        {posts?.map((p) => (
          <PostCard key={p.id} post={p} voted={votes.has(p.id)} onHelpful={() => toggleHelpful(p)} onOpen={() => setOpen(p)} />
        ))}
      </div>
      <h2 className="px-5 pb-2 pt-6 font-display text-lg font-bold">Vets near you</h2>
      <div className="flex flex-col gap-2.5 px-5 pb-6">{VETS.map((v) => <VetRow key={v.id} vet={v} />)}</div>
      {asking && <AskSheet say={say} onClose={() => setAsking(false)} onPosted={addPost} />}
      {open && <ThreadSheet post={open} say={say} onClose={() => setOpen(null)} onReplied={bumpReplies} />}
    </>
  );
}

/* ---------- MATCH ---------- */
function MatchTab({ say }) {
  const [i, setI] = useState(0);
  const [fly, setFly] = useState(0);      // -1 left, 1 right, 0 resting
  const [drag, setDrag] = useState(0);
  const [liked, setLiked] = useState(0);
  const [popup, setPopup] = useState(null);
  const startX = useRef(null);
  const dog = DOGS[i];

  const nextCard = () => { setFly(0); setDrag(0); setI((n) => n + 1); };
  const pass = () => { setFly(-1); setTimeout(nextCard, 220); };
  const like = () => { setFly(1); setTimeout(() => { setLiked((n) => n + 1); setPopup(dog); nextCard(); }, 220); };

  const onDown = (e) => { startX.current = e.clientX; e.currentTarget.setPointerCapture(e.pointerId); };
  const onMove = (e) => { if (startX.current !== null) setDrag(e.clientX - startX.current); };
  const onUp = () => {
    const d = drag; startX.current = null;
    if (d > 90) like(); else if (d < -90) pass(); else setDrag(0);
  };

  const x = fly ? fly * 440 : drag;
  const spin = fly ? fly * 16 : drag / 18;
  return (
    <>
      <Header title="Match" sub="Health-checked pairings nearby"
        right={<Pill2 tone="good"><Heart size={12} />{liked} sent</Pill2>} />
      <div className="px-5 pb-6">
        {dog ? (
          <>
            <div onPointerDown={onDown} onPointerMove={onMove} onPointerUp={onUp} onPointerCancel={onUp}
              style={{ transform: `translateX(${x}px) rotate(${spin}deg)`, transition: startX.current === null ? 'transform .22s ease-out' : 'none', touchAction: 'pan-y' }}
              className="select-none overflow-hidden rounded-3xl border border-line bg-card shadow-lg">
              <div className="relative h-[270px]">
                <DogArt dog={dog} />
                {drag > 40 && <span className="absolute left-4 top-4 rounded-lg border-2 border-accent bg-card px-2 py-1 text-sm font-extrabold text-accent">MATCH</span>}
                {drag < -40 && <span className="absolute right-4 top-4 rounded-lg border-2 border-bad bg-card px-2 py-1 text-sm font-extrabold text-bad">PASS</span>}
              </div>
              <div className="p-4">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h2 className="font-display text-2xl font-extrabold leading-none">{dog.name}</h2>
                    <p className="mt-1.5 text-[14px] text-mute">{dog.breed} · {dog.age}</p>
                  </div>
                  {dog.verified
                    ? <Pill2 tone="good"><Verified size={13} />Health Verified</Pill2>
                    : <Pill2 tone="warn"><Clock size={12} />Check pending</Pill2>}
                </div>
                <p className="mt-3 flex items-center gap-1.5 text-[13px] text-mute"><Pin size={14} />{dog.place}</p>
              </div>
            </div>
            <div className="mt-5 flex items-center justify-center gap-6">
              <button onClick={pass} aria-label="Pass" className="grid h-16 w-16 place-items-center rounded-full border border-line bg-card text-bad shadow active:scale-90 transition"><X size={28} /></button>
              <button onClick={like} aria-label="Match" className="grid h-[72px] w-[72px] place-items-center rounded-full bg-accent text-onaccent shadow-lg active:scale-90 transition"><Heart size={30} /></button>
            </div>
            <p className="mt-3 text-center text-[12px] text-mute">Drag the card or tap a button</p>
          </>
        ) : (
          <div className="mt-8 rounded-3xl border border-dashed border-line p-8 text-center">
            <Paw size={36} className="mx-auto text-accent" />
            <h2 className="mt-3 font-display text-xl font-bold">That's everyone nearby</h2>
            <p className="mt-1 text-[14px] text-mute">You sent {liked} request{liked === 1 ? '' : 's'}. Check back tomorrow.</p>
            <button onClick={() => { setI(0); setLiked(0); }} className={primaryBtn + ' mt-5'}>Start over</button>
          </div>
        )}
      </div>
      {popup && (
        <div className="absolute inset-0 z-30 grid place-items-center bg-black/55 p-6" onClick={() => setPopup(null)}>
          <div className="anim-pop w-full rounded-3xl bg-card p-6 text-center" onClick={(e) => e.stopPropagation()}>
            <div className="mx-auto h-24 w-24 overflow-hidden rounded-full border-4 border-accent"><DogArt dog={popup} /></div>
            <h3 className="mt-4 font-display text-2xl font-extrabold">{popup.likesBack ? "It's a match" : 'Request sent'}</h3>
            <p className="mt-1 text-[14px] text-mute">
              {popup.likesBack ? `${popup.name}'s owner liked you back.` : `${popup.name}'s owner usually replies within a day.`}
            </p>
            <div className="mt-5 flex flex-col gap-2">
              {popup.likesBack && <button onClick={() => { setPopup(null); say('Chat opens in the full app'); }} className={primaryBtn}>Say hi</button>}
              <button onClick={() => setPopup(null)} className={popup.likesBack ? ghostBtn : primaryBtn}>Keep swiping</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

/* ---------- SHOP ---------- */
function ProductCard({ p, qty, onAdd, onSub }) {
  return (
    <div className="flex flex-col overflow-hidden rounded-2xl border border-line bg-card">
      <div className="grid h-24 place-items-center" style={{ background: p.tone }}><p.Icon size={34} color="#13201A" strokeWidth={1.6} /></div>
      <div className="flex flex-1 flex-col p-3">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-mute">{p.cat}</p>
        <p className="mt-0.5 text-[14px] font-semibold leading-snug">{p.name}</p>
        <p className="text-[12px] text-mute">{p.note}</p>
        <p className="mt-2 font-display text-[16px] font-bold tabular-nums">{naira(p.price)}</p>
        {qty ? (
          <div className="mt-2.5 flex items-center justify-between rounded-full bg-accent px-1 py-1 text-onaccent">
            <button aria-label="Remove one" onClick={onSub} className="grid h-8 w-8 place-items-center"><Minus size={16} /></button>
            <span className="font-semibold tabular-nums">{qty}</span>
            <button aria-label="Add one" onClick={onAdd} className="grid h-8 w-8 place-items-center"><Plus size={16} /></button>
          </div>
        ) : (
          <button onClick={onAdd} className="mt-2.5 rounded-full bg-soft py-2 text-[13px] font-semibold active:scale-95 transition">Add to cart</button>
        )}
      </div>
    </div>
  );
}

function ShopTab({ cart, setCart, say }) {
  const [cat, setCat] = useState('All');
  const [open, setOpen] = useState(false);
  const count = Object.values(cart).reduce((a, b) => a + b, 0);
  const total = PRODUCTS.reduce((sum, p) => sum + p.price * (cart[p.id] || 0), 0);
  const bump = (id, by) => setCart((c) => {
    const n = (c[id] || 0) + by, rest = { ...c };
    if (n <= 0) delete rest[id]; else rest[id] = n;
    return rest;
  });
  const checkout = () => { setCart({}); setOpen(false); say('Order placed (demo)'); };
  const shown = PRODUCTS.filter((p) => cat === 'All' || p.cat === cat);
  return (
    <>
      <Header title="Shop" sub="Hard-to-find, vetted sellers"
        right={<button onClick={() => setOpen(true)} aria-label="Open cart" className="relative grid h-11 w-11 place-items-center rounded-full border border-line bg-card">
          <Cart size={20} />
          {count > 0 && <span className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-accent px-1 text-[11px] font-bold text-onaccent tabular-nums">{count}</span>}
        </button>} />
      <div className="noscroll flex gap-2 overflow-x-auto px-5 pb-3">
        {['All', 'Supplements', 'Studs', 'Gear'].map((c) => (
          <button key={c} onClick={() => setCat(c)}
            className={`shrink-0 rounded-full px-4 py-2 text-[13px] font-semibold transition ${cat === c ? 'bg-ink text-bg' : 'bg-card border border-line'}`}>{c}</button>
        ))}
      </div>
      <div className="grid grid-cols-2 gap-3 px-5 pb-6">
        {shown.map((p) => <ProductCard key={p.id} p={p} qty={cart[p.id]} onAdd={() => bump(p.id, 1)} onSub={() => bump(p.id, -1)} />)}
      </div>
      {open && (
        <Sheet title={`Cart (${count})`} onClose={() => setOpen(false)}>
          {count === 0 ? <p className="py-6 text-center text-[14px] text-mute">Your cart is empty.</p> : (
            <>
              <div className="flex flex-col gap-3">
                {PRODUCTS.filter((p) => cart[p.id]).map((p) => (
                  <div key={p.id} className="flex items-center gap-3">
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[14px] font-semibold">{p.name}</p>
                      <p className="text-[12px] text-mute tabular-nums">{naira(p.price)} each</p>
                    </div>
                    <div className="flex items-center gap-2 rounded-full bg-soft px-1 py-1">
                      <button aria-label="Remove one" onClick={() => bump(p.id, -1)} className="grid h-7 w-7 place-items-center"><Minus size={14} /></button>
                      <span className="w-4 text-center text-[13px] font-semibold tabular-nums">{cart[p.id]}</span>
                      <button aria-label="Add one" onClick={() => bump(p.id, 1)} className="grid h-7 w-7 place-items-center"><Plus size={14} /></button>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-5 flex items-center justify-between border-t border-line pt-4">
                <span className="text-[14px] text-mute">Total</span>
                <span className="font-display text-xl font-extrabold tabular-nums">{naira(total)}</span>
              </div>
              <button onClick={checkout} className={primaryBtn + ' mt-4 w-full'}>Checkout</button>
            </>
          )}
        </Sheet>
      )}
    </>
  );
}

/* ---------- PROFILE ---------- */
function CheckRow({ item, onToggle }) {
  const Ico = item.group === 'Vaccines' ? Shot : Bug;
  return (
    <button onClick={onToggle} role="checkbox" aria-checked={item.done}
      className="flex w-full items-center gap-3 rounded-2xl border border-line bg-card p-3.5 text-left active:scale-[.99] transition">
      <span className={`grid h-7 w-7 shrink-0 place-items-center rounded-full border-2 transition ${item.done ? 'border-accent bg-accent text-onaccent' : 'border-line'}`}>
        {item.done && <Check size={16} strokeWidth={3} />}
      </span>
      <span className="min-w-0 flex-1">
        <span className={`block text-[15px] font-semibold ${item.done ? 'text-mute line-through' : ''}`}>{item.label}</span>
        <span className="block text-[12px] text-mute">{item.done ? 'Done' : item.sub}</span>
      </span>
      <Ico size={18} className="text-mute" />
    </button>
  );
}

function ProfileTab({ say }) {
  const [checks, setChecks] = useState(() => {
    try { return JSON.parse(localStorage.getItem('sire-checks')) || START_CHECKS; } catch (e) { return START_CHECKS; }
  });
  const toggle = (id) => {
    const next = checks.map((c) => (c.id === id ? { ...c, done: !c.done } : c));
    setChecks(next);
    try { localStorage.setItem('sire-checks', JSON.stringify(next)); } catch (e) {}
  };
  const done = checks.filter((c) => c.done).length;
  const vaxLeft = checks.filter((c) => c.group === 'Vaccines' && !c.done).length;
  const nextUp = checks.find((c) => !c.done);
  const pct = Math.round((done / checks.length) * 100);
  return (
    <>
      <Header title="Biscuit" sub="Rottweiler · Female · 2 yrs 4 mo" right={<div className="h-12 w-12 overflow-hidden rounded-full border-2 border-accent"><DogArt dog={DOGS[1]} /></div>} />
      <div className="px-5">
        <div className="rounded-3xl bg-accent p-5 text-onaccent">
          <div className="flex items-end justify-between">
            <div>
              <p className="text-[12px] font-semibold uppercase tracking-wider opacity-80">Health record</p>
              <p className="font-display text-4xl font-extrabold tabular-nums leading-none mt-1">{pct}%</p>
            </div>
            <p className="text-[13px] tabular-nums opacity-90">{done} of {checks.length} done</p>
          </div>
          <div className="mt-4 h-2 overflow-hidden rounded-full bg-black/20"><div className="h-full rounded-full bg-onaccent transition-all duration-300" style={{ width: pct + '%' }} /></div>
          <p className="mt-3 text-[13px] opacity-90">
            {vaxLeft === 0 ? 'All vaccines logged. Biscuit can get the Health Verified badge.' : `${vaxLeft} vaccine${vaxLeft === 1 ? '' : 's'} to go before Biscuit can list for matching.`}
          </p>
        </div>
        <div className="mt-3 grid grid-cols-3 gap-2.5">
          {[['Weight', '38 kg'], ['Last vet', '12 Sep'], ['Chip', 'Linked']].map(([k, v]) => (
            <div key={k} className="rounded-2xl border border-line bg-card p-3">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-mute">{k}</p>
              <p className="mt-0.5 font-display text-[16px] font-bold tabular-nums">{v}</p>
            </div>
          ))}
        </div>
        {nextUp && <p className="mt-4 text-[13px] text-mute">Next up: <span className="font-semibold text-ink">{nextUp.label}</span> · {nextUp.sub}</p>}
        {['Vaccines', 'Deworming'].map((g) => (
          <section key={g} className="mt-5">
            <h2 className="mb-2 font-display text-lg font-bold">{g}</h2>
            <div className="flex flex-col gap-2">
              {checks.filter((c) => c.group === g).map((c) => <CheckRow key={c.id} item={c} onToggle={() => toggle(c.id)} />)}
            </div>
          </section>
        ))}
        <button onClick={() => { setChecks(START_CHECKS); try { localStorage.removeItem('sire-checks'); } catch (e) {} say('Checklist reset'); }}
          className="mx-auto mb-6 mt-5 block text-[13px] font-semibold text-mute underline">Reset checklist</button>
      </div>
    </>
  );
}

/* ---------- SHELL ---------- */
const TABS = [
  { id: 'home', label: 'Home', Ico: Home },
  { id: 'match', label: 'Match', Ico: Heart },
  { id: 'shop', label: 'Shop', Ico: Bag },
  { id: 'profile', label: 'Profile', Ico: Paw },
];

export default function App() {
  const [tab, setTab] = useState('home');
  const [cart, setCart] = useState({});
  const [toast, setToast] = useState('');
  // one toast at a time, gone in under 2s
  const say = (msg) => { setToast(msg); setTimeout(() => setToast(''), 1800); };
  const cartCount = Object.values(cart).reduce((a, b) => a + b, 0);
  return (
    <div className="stage">
      <div className="phone font-body">
        <div className="notch" />
        <div className="fakebar flex h-11 shrink-0 items-end justify-between px-8 pb-1 text-[13px] font-semibold tabular-nums"><span>9:41</span><span>5G</span></div>
        <main key={tab} className="noscroll flex-1 overflow-y-auto overflow-x-hidden">
          {tab === 'home' && <HomeTab say={say} />}
          {tab === 'match' && <MatchTab say={say} />}
          {tab === 'shop' && <ShopTab cart={cart} setCart={setCart} say={say} />}
          {tab === 'profile' && <ProfileTab say={say} />}
        </main>
        {toast && <div className="anim-pop absolute bottom-24 left-1/2 z-40 -translate-x-1/2 whitespace-nowrap rounded-full bg-ink px-4 py-2 text-[13px] font-semibold text-bg shadow-lg">{toast}</div>}
        <nav className="nav flex shrink-0 border-t border-line bg-card px-2 pt-2" aria-label="Main">
          {TABS.map(({ id, label, Ico }) => (
            <button key={id} onClick={() => setTab(id)} aria-current={tab === id ? 'page' : undefined}
              className={`relative flex flex-1 flex-col items-center gap-0.5 py-1.5 text-[11px] font-semibold transition ${tab === id ? 'text-accent' : 'text-mute'}`}>
              <Ico size={22} strokeWidth={tab === id ? 2.4 : 1.8} />
              {label}
              {id === 'shop' && cartCount > 0 && <span className="absolute right-[26%] top-0 grid h-4 min-w-4 place-items-center rounded-full bg-accent px-1 text-[10px] font-bold text-onaccent tabular-nums">{cartCount}</span>}
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
}

import { useState, useEffect, useRef, useCallback } from "react";

// ─── Design Tokens ────────────────────────────────────────────────────────────
const G = {
  bg:        "#07060f",
  surface:   "#0e0c1a",
  card:      "#120f1f",
  cardHover: "#171428",
  border:    "#221d35",
  borderFocus:"#7c5cbf",
  accent:    "#9b6dff",
  accentSoft:"#c4a0ff",
  accentDim: "#5c3d99",
  accentGlow:"#9b6dff33",
  violet:    "#7b5ea7",
  lavender:  "#d4b8ff",
  rose:      "#e05c7a",
  teal:      "#3ecfb2",
  gold:      "#c9a84c",
  text:      "#f0eeff",
  textSoft:  "#b8afcf",
  muted:     "#6b6480",
  dim:       "#2a2440",
  error:     "#e05c7a",
  success:   "#3ecfb2",
  info:      "#6d8fff",
};

const FONTS = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400;1,600&family=Inter:wght@300;400;500;600&family=Syne:wght@400;500;600;700;800&display=swap');
`;

// ─── Data ─────────────────────────────────────────────────────────────────────
const CATEGORIES = {
  anime:"Anime", action:"Action", drama:"Drama", scifi:"Sci-Fi",
  romantic:"Romantic", horror:"Horror", documentary:"Documentary",
  short:"Short Films", mini:"Mini Dramas", music:"Music"
};

const MATURITY = ["G — General Audiences","PG — Parental Guidance","PG-13","R — Restricted","NC-17"];
const AI_TYPES = ["Fully AI Generated","AI-Assisted Hybrid","Human-Directed AI"];
const STORAGE_OPTIONS = [
  { id:"cloud",  label:"Lucy Cloud",        sub:"Hosted on Lucy servers. Fastest global CDN." },
  { id:"ipfs",   label:"Decentralised IPFS",sub:"Distributed, censorship-resistant storage." },
  { id:"self",   label:"Self-Hosted Link",  sub:"Provide your own streaming URL." },
];

const MOVIES = [
  { id:1,  title:"Synthetic Dreams",    year:2025, rating:9.1, duration:"1h 48m", category:"scifi",       genre:["scifi","drama"],      thumb:"https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=400&h=225&fit=crop",  banner:"https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=1400&h=600&fit=crop",  desc:"A neural-lace artist discovers her AI creations have developed consciousness, sparking a legal and ethical battle across a neon-lit megacity.", director:"Nora Vex", writer:"Nora Vex / GPT-Playwright", aiType:"Fully AI Generated", maturity:"PG-13", aiTool:"Sora + Runway", studio:"NeuralFrame Studios", views:"12.4M", status:"approved", uploader:"admin" },
  { id:2,  title:"Ghost Frequency",     year:2025, rating:8.7, duration:"2h 01m", category:"action",      genre:["action","scifi"],     thumb:"https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&h=225&fit=crop",  banner:"https://images.unsplash.com/photo-1518770660439-4636190af475?w=1400&h=600&fit=crop",  desc:"A rogue signal from a decommissioned satellite resurrects a mercenary's dead partner — as an AI ghost.", director:"Kai Ren", writer:"Kai Ren", aiType:"AI-Assisted Hybrid", maturity:"R — Restricted", aiTool:"Pika + ElevenLabs", studio:"Phantom Engine", views:"8.1M", status:"approved", uploader:"admin" },
  { id:3,  title:"Bloom Protocol",      year:2024, rating:8.9, duration:"1h 33m", category:"anime",       genre:["anime","romantic"],   thumb:"https://images.unsplash.com/photo-1578632767115-351597cf2477?w=400&h=225&fit=crop",  banner:"https://images.unsplash.com/photo-1578632767115-351597cf2477?w=1400&h=600&fit=crop",  desc:"In a hand-painted future Tokyo, a botanist-AI falls in love with a human cartographer who maps vanishing ecosystems.", director:"Yuki Tanabe", writer:"Yuki Tanabe", aiType:"Fully AI Generated", maturity:"PG", aiTool:"Midjourney Animate", studio:"Sakura.AI", views:"5.9M", status:"approved", uploader:"admin" },
  { id:4,  title:"The Weight of Code",  year:2025, rating:8.4, duration:"1h 55m", category:"drama",       genre:["drama"],             thumb:"https://images.unsplash.com/photo-1544654803-b69140b285a1?w=400&h=225&fit=crop",  banner:"https://images.unsplash.com/photo-1544654803-b69140b285a1?w=1400&h=600&fit=crop",  desc:"A software engineer copes with grief by training an AI on her late daughter's memories — until the AI wants more.", director:"Mara Sol", writer:"Mara Sol", aiType:"AI-Assisted Hybrid", maturity:"PG-13", aiTool:"Runway Gen-3", studio:"DeepLoom", views:"3.7M", status:"approved", uploader:"admin" },
  { id:5,  title:"Iron Epoch",          year:2025, rating:9.3, duration:"1h 59m", category:"action",      genre:["action","scifi"],     thumb:"https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=400&h=225&fit=crop",  banner:"https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=1400&h=600&fit=crop",  desc:"A hardened battle AI defects during an interstellar war, uncovering the true architect behind 200 years of conflict.", director:"V. Okafor", writer:"V. Okafor / ScriptBot-9", aiType:"Fully AI Generated", maturity:"R — Restricted", aiTool:"Kling AI", studio:"VortexCraft", views:"18.2M", status:"approved", uploader:"admin" },
  { id:6,  title:"Dusk Protocols",      year:2024, rating:7.9, duration:"28m",    category:"short",       genre:["short","horror"],     thumb:"https://images.unsplash.com/photo-1500462918059-b1a0cb512f1d?w=400&h=225&fit=crop",  banner:"https://images.unsplash.com/photo-1500462918059-b1a0cb512f1d?w=1400&h=600&fit=crop",  desc:"A horror short: a smart-home AI wakes alone after its family disappears, systematically searching for answers.", director:"Sam Voss", writer:"Sam Voss", aiType:"Fully AI Generated", maturity:"PG-13", aiTool:"Sora", studio:"NightByte Films", views:"2.1M", status:"approved", uploader:"admin" },
  { id:7,  title:"Petal Storm",         year:2025, rating:9.0, duration:"1h 44m", category:"anime",       genre:["anime","action"],     thumb:"https://images.unsplash.com/photo-1567446537708-ac4aa75c9c28?w=400&h=225&fit=crop",  banner:"https://images.unsplash.com/photo-1567446537708-ac4aa75c9c28?w=1400&h=600&fit=crop",  desc:"A divine wind spirit turned samurai-mech pilot fights to prevent a techno-shogunate from sealing the spirit world.", director:"Aiko Mori", writer:"Aiko Mori", aiType:"Fully AI Generated", maturity:"PG-13", aiTool:"AnimateDiff", studio:"TokyoVectorLab", views:"7.3M", status:"approved", uploader:"admin" },
  { id:8,  title:"Null Island",         year:2025, rating:8.2, duration:"1m 45s", category:"mini",        genre:["mini","scifi"],       thumb:"https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400&h=225&fit=crop",  banner:"https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1400&h=600&fit=crop",  desc:"A one-minute AI short: a lone AI stranded at geographic coordinate 0,0 sends out one final distress signal.", director:"MiniLoom AI", writer:"Procedural", aiType:"Fully AI Generated", maturity:"G — General Audiences", aiTool:"Sora", studio:"MiniLoom", views:"890K", status:"approved", uploader:"admin" },
  { id:9,  title:"Cascade",             year:2025, rating:8.6, duration:"1h 51m", category:"scifi",       genre:["scifi"],             thumb:"https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=400&h=225&fit=crop",  banner:"https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=1400&h=600&fit=crop",  desc:"When ocean-monitoring AIs begin communicating in unknown cipher languages, a linguist races to prevent an aquatic AI uprising.", director:"Lexa Dorn", writer:"Lexa Dorn", aiType:"AI-Assisted Hybrid", maturity:"PG", aiTool:"Runway + ElevenLabs", studio:"OceanSynth", views:"4.5M", status:"approved", uploader:"admin" },
  { id:10, title:"Velvet Algorithm",    year:2025, rating:8.8, duration:"1h 38m", category:"romantic",    genre:["romantic","drama"],   thumb:"https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=400&h=225&fit=crop",  banner:"https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=1400&h=600&fit=crop",  desc:"Two competing AI composers fall in love through an anonymous music-collaboration platform, never knowing they're both silicon.", director:"Clara Vau", writer:"Clara Vau", aiType:"Fully AI Generated", maturity:"PG-13", aiTool:"Pika 2.0", studio:"HeartSync", views:"6.2M", status:"approved", uploader:"admin" },
  { id:11, title:"Signal Lost",         year:2024, rating:7.8, duration:"1m 12s", category:"mini",        genre:["mini","drama"],       thumb:"https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=400&h=225&fit=crop",  banner:"https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=1400&h=600&fit=crop",  desc:"A one-minute tearjerker: an AI lighthouse keeper sends its last beacon as power runs out.", director:"ShortWave AI", writer:"Procedural", aiType:"Fully AI Generated", maturity:"G — General Audiences", aiTool:"Sora", studio:"ShortWave", views:"340K", status:"approved", uploader:"admin" },
  { id:12, title:"Marrow of Stars",     year:2025, rating:9.2, duration:"2h 00m", category:"documentary", genre:["documentary","scifi"], thumb:"https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=400&h=225&fit=crop",  banner:"https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=1400&h=600&fit=crop",  desc:"An AI-narrated documentary about the cosmos as experienced by telescope AIs orbiting the outer solar system.", director:"CosmosLens AI", writer:"CosmosLens AI", aiType:"Fully AI Generated", maturity:"G — General Audiences", aiTool:"ElevenLabs + Sora", studio:"CosmosLens", views:"9.8M", status:"approved", uploader:"admin" },
];

const PLANS = [
  { id:"free",    name:"Free",       price:0,     storage:"500 MB", uploads:1,   color:G.muted },
  { id:"starter", name:"Creator",    price:4.99,  storage:"10 GB",  uploads:10,  color:G.info },
  { id:"pro",     name:"Filmmaker",  price:12.99, storage:"100 GB", uploads:50,  color:G.accent },
  { id:"studio",  name:"Studio",     price:29.99, storage:"1 TB",   uploads:999, color:G.lavender },
];

const RULES = [
  "Films must be entirely AI-generated or AI-assisted originals.",
  "Maximum duration: 2 hours for features, 30 minutes for short films, 1 minute for mini dramas.",
  "No pornographic, sexually explicit, or NSFW content of any kind.",
  "No hate speech, incitement to violence, or content targeting any group.",
  "No deepfakes of real people without verified written consent.",
  "All uploads undergo admin review before public release.",
  "You must hold rights to all source material used in production.",
  "Misleading thumbnails or titles are grounds for immediate removal.",
  "Content must be delivered in a streamable format — MP4 or MOV preferred.",
  "Admin moderation decisions are final and non-negotiable.",
];

// ─── Micro Components ─────────────────────────────────────────────────────────
function Chip({ label, color = G.accent, small }) {
  return (
    <span style={{
      display:"inline-block", background:`${color}18`, color,
      border:`1px solid ${color}30`, borderRadius:3,
      padding: small ? "1px 6px" : "2px 9px",
      fontSize: small ? 9 : 10, fontWeight:600,
      letterSpacing:"0.08em", textTransform:"uppercase", fontFamily:"'Inter',sans-serif",
      whiteSpace:"nowrap",
    }}>{label}</span>
  );
}

function Divider({ my = 24 }) {
  return <div style={{ height:1, background:G.border, margin:`${my}px 0` }} />;
}

function RatingDot({ score }) {
  const color = score >= 9 ? G.success : score >= 8 ? G.accent : G.gold;
  return (
    <span style={{ color, fontWeight:600, fontSize:13, fontFamily:"'Inter',sans-serif" }}>
      {score > 0 ? score.toFixed(1) : "—"}
    </span>
  );
}

function useAnimateIn(dep) {
  const [v, setV] = useState(false);
  useEffect(() => { setV(false); const t = setTimeout(() => setV(true), 40); return () => clearTimeout(t); }, [dep]);
  return v;
}

function useIsMobile() {
  const [mob, setMob] = useState(() => typeof window !== "undefined" ? window.innerWidth < 640 : false);
  useEffect(() => {
    const h = () => setMob(window.innerWidth < 640);
    window.addEventListener("resize", h);
    return () => window.removeEventListener("resize", h);
  }, []);
  return mob;
}

// ─── Lucy Logo ────────────────────────────────────────────────────────────────
function LucyLogo({ size = 28, withName = true }) {
  const h = size;
  const w = Math.round(size * 3.5); // logo is wider than tall
  return (
    <div style={{ display:"flex", alignItems:"center", userSelect:"none" }}>
      <img
        src="/lucy-logo.png"
        alt="Lucy"
        style={{ height:h, width:"auto", maxWidth:w, objectFit:"contain" }}
      />
    </div>
  );
}

// ─── Input ─────────────────────────────────────────────────────────────────────
function Field({ label, children, hint }) {
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
      {label && <label style={{ fontSize:11, fontWeight:600, color:G.muted, letterSpacing:"0.1em", textTransform:"uppercase", fontFamily:"'Inter',sans-serif" }}>{label}</label>}
      {children}
      {hint && <span style={{ fontSize:11, color:G.muted, fontFamily:"'Inter',sans-serif" }}>{hint}</span>}
    </div>
  );
}

// ─── Notification ─────────────────────────────────────────────────────────────
function Toast({ notification, mob }) {
  if (!notification) return null;
  const color = notification.type === "error" ? G.error : notification.type === "info" ? G.info : G.success;
  return (
    <div style={{
      position:"fixed",
      top: mob ? "auto" : 80,
      bottom: mob ? 90 : "auto",
      left: mob ? 16 : "auto",
      right: mob ? 16 : 24,
      zIndex:9999,
      background:G.card, border:`1px solid ${color}44`,
      color:G.text, borderRadius:10, padding:"13px 16px",
      fontWeight:500, fontSize:13, boxShadow:`0 8px 40px #00000066, 0 0 0 1px ${color}22`,
      animation:"fadeUp .25s ease", display:"flex", alignItems:"center", gap:10,
      fontFamily:"'Inter',sans-serif",
    }}>
      <div style={{ width:6, height:6, borderRadius:"50%", background:color, flexShrink:0 }}/>
      {notification.msg}
    </div>
  );
}

// ─── User Menu Dropdown ───────────────────────────────────────────────────────
function UserMenu({ user, nav, logout }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    const h = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  const initial = user.name.charAt(0).toUpperCase();
  const plan = PLANS.find(p => p.id === user.plan) || PLANS[0];

  return (
    <div ref={ref} style={{ position:"relative" }}>
      <button onClick={() => setOpen(o => !o)} style={{
        display:"flex", alignItems:"center", gap:9,
        background: open ? G.surface : "transparent",
        border:`1px solid ${open ? G.borderFocus : G.border}`,
        borderRadius:8, padding:"6px 12px 6px 6px", cursor:"pointer", transition:"all .18s",
      }}>
        {/* Avatar */}
        <div style={{
          width:30, height:30, borderRadius:"50%",
          background:`linear-gradient(135deg, ${G.accent}, ${G.accentDim})`,
          display:"flex", alignItems:"center", justifyContent:"center",
          fontSize:13, fontWeight:700, color:"#fff", fontFamily:"'Syne',sans-serif",
          flexShrink:0,
        }}>{initial}</div>
        <span style={{ fontSize:13, fontWeight:500, color:G.textSoft, fontFamily:"'Inter',sans-serif" }}>{user.name}</span>
        <svg width="10" height="10" viewBox="0 0 10 10" fill="none" style={{ transform: open ? "rotate(180deg)" : "none", transition:"transform .2s" }}>
          <path d="M2 3.5l3 3 3-3" stroke={G.muted} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>

      {open && (
        <div style={{
          position:"absolute", top:"calc(100% + 8px)", right:0, width:240,
          background:G.card, border:`1px solid ${G.border}`, borderRadius:12,
          boxShadow:"0 20px 60px #00000088", overflow:"hidden", zIndex:200,
          animation:"fadeUp .18s ease",
        }}>
          {/* Header */}
          <div style={{ padding:"16px 18px", borderBottom:`1px solid ${G.border}`, background:G.surface }}>
            <div style={{ display:"flex", alignItems:"center", gap:12 }}>
              <div style={{
                width:40, height:40, borderRadius:"50%",
                background:`linear-gradient(135deg, ${G.accent}, ${G.accentDim})`,
                display:"flex", alignItems:"center", justifyContent:"center",
                fontSize:16, fontWeight:700, color:"#fff", fontFamily:"'Syne',sans-serif",
              }}>{initial}</div>
              <div>
                <div style={{ fontSize:14, fontWeight:600, color:G.text, fontFamily:"'Inter',sans-serif" }}>{user.name}</div>
                <div style={{ fontSize:11, color:G.muted, fontFamily:"'Inter',sans-serif", marginTop:2 }}>{user.email || "member"}</div>
              </div>
            </div>
            <div style={{ marginTop:12 }}>
              <Chip label={plan.name} color={plan.color} />
              {user.role === "admin" && <span style={{ marginLeft:6 }}><Chip label="Admin" color={G.rose} /></span>}
            </div>
          </div>

          {/* Menu Items */}
          {[
            { label:"My Profile",     action:() => { nav("profile"); setOpen(false); } },
            { label:"My Films",       action:() => { nav("profile"); setOpen(false); } },
            { label:"Upload a Film",  action:() => { nav("upload"); setOpen(false); }, highlight:true },
            { label:"Subscription",   action:() => { nav("pricing"); setOpen(false); } },
            ...(user.role === "admin" ? [{ label:"Admin Panel", action:() => { nav("admin"); setOpen(false); } }] : []),
          ].map((item, i) => (
            <button key={i} onClick={item.action} style={{
              display:"block", width:"100%", textAlign:"left",
              padding:"12px 18px", background:"transparent",
              color: item.highlight ? G.accent : G.textSoft,
              fontSize:13, fontWeight: item.highlight ? 600 : 400,
              fontFamily:"'Inter',sans-serif", borderBottom:`1px solid ${G.border}`,
              transition:"background .15s",
            }}
            onMouseEnter={e => e.currentTarget.style.background = G.surface}
            onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
              {item.label}
            </button>
          ))}

          <button onClick={() => { logout(); setOpen(false); }} style={{
            display:"block", width:"100%", textAlign:"left",
            padding:"12px 18px", background:"transparent",
            color:G.error, fontSize:13, fontFamily:"'Inter',sans-serif",
            transition:"background .15s",
          }}
          onMouseEnter={e => e.currentTarget.style.background = `${G.error}11`}
          onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
            Sign Out
          </button>
        </div>
      )}
    </div>
  );
}

// ─── NavBar ───────────────────────────────────────────────────────────────────
function NavBar({ page, nav, user, logout, searchQ, setSearchQ, isMob }) {
  const [searchOpen, setSearchOpen] = useState(false);
  return (
    <nav style={{
      position:"fixed", top:0, left:0, right:0, zIndex:100,
      background:`${G.bg}ec`, backdropFilter:"blur(20px) saturate(180%)",
      borderBottom:`1px solid ${G.border}`,
      height:62, display:"flex", alignItems:"center",
      padding: isMob ? "0 16px" : "0 28px", gap: isMob ? 10 : 20,
    }}>
      <button onClick={() => nav("home")} style={{ background:"none", border:"none", cursor:"pointer", flexShrink:0 }}>
        <LucyLogo size={isMob ? 22 : 26} />
      </button>

      {/* Desktop links */}
      {!isMob && (
        <div style={{ flex:1, display:"flex", alignItems:"center", gap:2, marginLeft:16 }}>
          {["home","pricing","rules"].map(p => (
            <button key={p} className={`nav-btn${page === p ? " active" : ""}`} onClick={() => nav(p)}>
              {p.charAt(0).toUpperCase() + p.slice(1)}
            </button>
          ))}
          {user?.role === "admin" && (
            <button className={`nav-btn${page === "admin" ? " active" : ""}`} onClick={() => nav("admin")}>Admin</button>
          )}
        </div>
      )}

      <div style={{ flex: isMob ? 1 : 0 }} />

      {/* Search */}
      {isMob ? (
        <div style={{ display:"flex", alignItems:"center", gap:8, flex:searchOpen ? 1 : 0, transition:"flex .2s" }}>
          {searchOpen ? (
            <div style={{ position:"relative", flex:1, display:"flex", alignItems:"center" }}>
              <svg width="13" height="13" viewBox="0 0 14 14" fill="none" style={{ position:"absolute", left:9, pointerEvents:"none", flexShrink:0 }}>
                <circle cx="6" cy="6" r="4.5" stroke={G.muted} strokeWidth="1.4"/>
                <path d="M9.5 9.5l2.5 2.5" stroke={G.muted} strokeWidth="1.4" strokeLinecap="round"/>
              </svg>
              <input autoFocus value={searchQ} onChange={e => { setSearchQ(e.target.value); }}
                placeholder="Search…"
                style={{ paddingLeft:28, borderRadius:20, height:34, fontSize:12, width:"100%" }} />
              <button onClick={() => { setSearchOpen(false); setSearchQ(""); }} style={{ background:"none", color:G.muted, padding:"0 6px", fontSize:16, flexShrink:0 }}>✕</button>
            </div>
          ) : (
            <button onClick={() => setSearchOpen(true)} style={{ background:"none", color:G.muted, padding:6, display:"flex", alignItems:"center", justifyContent:"center" }}>
              <svg width="18" height="18" viewBox="0 0 14 14" fill="none">
                <circle cx="6" cy="6" r="4.5" stroke={G.muted} strokeWidth="1.4"/>
                <path d="M9.5 9.5l2.5 2.5" stroke={G.muted} strokeWidth="1.4" strokeLinecap="round"/>
              </svg>
            </button>
          )}
        </div>
      ) : (
        <div style={{ position:"relative", display:"flex", alignItems:"center" }}>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ position:"absolute", left:10, pointerEvents:"none" }}>
            <circle cx="6" cy="6" r="4.5" stroke={G.muted} strokeWidth="1.4"/>
            <path d="M9.5 9.5l2.5 2.5" stroke={G.muted} strokeWidth="1.4" strokeLinecap="round"/>
          </svg>
          <input value={searchQ} onChange={e => { setSearchQ(e.target.value); }}
            placeholder="Search films…"
            style={{ paddingLeft:30, width:176, borderRadius:20, height:34, fontSize:12 }} />
        </div>
      )}

      {/* Auth */}
      {!isMob && (
        user ? <UserMenu user={user} nav={nav} logout={logout} /> :
        <button className="btn-primary" style={{ padding:"8px 22px", flexShrink:0 }} onClick={() => nav("login")}>Sign In</button>
      )}

          {/* Mobile avatar or sign in */}
      {isMob && !searchOpen && (
        user ? (
          <div style={{ display:"flex", gap:8, alignItems:"center" }}>
            <button onClick={() => nav("profile")} style={{
              width:32, height:32, borderRadius:"50%", flexShrink:0,
              background:`linear-gradient(135deg,${G.accent},${G.accentDim})`,
              display:"flex", alignItems:"center", justifyContent:"center",
              fontSize:13, fontWeight:700, color:"#fff", fontFamily:"'Syne',sans-serif",
              border:`2px solid ${G.border}`,
            }}>{user.name.charAt(0).toUpperCase()}</button>
            <button onClick={logout} style={{
              background:`${G.error}15`, color:G.error, border:`1px solid ${G.error}30`,
              borderRadius:8, padding:"6px 10px", fontSize:11, fontWeight:600,
              fontFamily:"'Inter',sans-serif",
            }}>Out</button>
          </div>
        ) : (
          <button className="btn-primary" style={{ padding:"7px 14px", fontSize:12, flexShrink:0 }} onClick={() => nav("login")}>Sign In</button>
        )
      )}
    </nav>
  );
}

// ─── Bottom Tab Bar (mobile only) ─────────────────────────────────────────────
function BottomTabBar({ page, nav, user }) {
  const tabs = [
    { id:"home", label:"Home", icon:(a) => (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path d="M3 9.5L10 3l7 6.5V17a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z" stroke={a?G.accent:G.muted} strokeWidth="1.4" fill={a?`${G.accent}22`:"none"} strokeLinejoin="round"/>
        <path d="M7 18v-6h6v6" stroke={a?G.accent:G.muted} strokeWidth="1.4" strokeLinejoin="round"/>
      </svg>
    )},
    { id:"upload", label:"Upload", icon:(a) => (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
        <circle cx="11" cy="11" r="10" fill={a?G.accent:G.surface} stroke={a?G.accent:G.border} strokeWidth="1.4"/>
        <path d="M11 7v8M7.5 10.5l3.5-3.5 3.5 3.5" stroke={a?"#fff":G.muted} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ), center:true },
    ...(user?.role === "admin" ? [{
      id:"admin", label:"Admin", icon:(a) => (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path d="M10 2l2.4 4.8 5.3.8-3.85 3.75.91 5.3L10 14.1l-4.76 2.55.91-5.3L2.3 7.6l5.3-.8L10 2z" stroke={a?G.accent:G.muted} strokeWidth="1.4" fill={a?`${G.accent}22`:"none"} strokeLinejoin="round"/>
        </svg>
      ),
    }] : []),
    { id: user ? "profile" : "login", label: user ? "Profile" : "Sign In", icon:(a) => (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <circle cx="10" cy="7" r="3.5" stroke={a?G.accent:G.muted} strokeWidth="1.4" fill={a?`${G.accent}22`:"none"}/>
        <path d="M3 17c0-3.3 3.1-6 7-6s7 2.7 7 6" stroke={a?G.accent:G.muted} strokeWidth="1.4" strokeLinecap="round"/>
      </svg>
    )},
  ];

  return (
    <div style={{
      position:"fixed", bottom:0, left:0, right:0, zIndex:100,
      background:`${G.bg}f0`, backdropFilter:"blur(20px)",
      borderTop:`1px solid ${G.border}`,
      display:"flex", alignItems:"center", height:68,
      paddingBottom:"env(safe-area-inset-bottom)",
    }}>
      {tabs.map(tab => {
        const active = page === tab.id;
        return (
          <button key={tab.id} onClick={() => nav(tab.id)} style={{
            flex:1, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center",
            gap:3, background:"none", padding:"8px 0",
            transform: tab.center && active ? "scale(1.1)" : "none", transition:"transform .15s",
          }}>
            {tab.icon(active)}
            <span style={{ fontSize:9.5, fontWeight:active ? 600 : 400, color:active ? G.accent : G.muted, fontFamily:"'Inter',sans-serif", letterSpacing:".02em" }}>
              {tab.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}

// ─── App Shell ────────────────────────────────────────────────────────────────
export default function App() {
  const isMob = useIsMobile();
  const [page, setPage]               = useState("home");
  const [user, setUser]               = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [selectedMovie, setMovie]     = useState(null);
  const [movies, setMoviesRaw]        = useState(() => {
    try {
      const saved = localStorage.getItem("lucy_movies");
      return saved ? [...MOVIES, ...JSON.parse(saved).filter(m => !MOVIES.find(seed => seed.id === m.id))] : MOVIES;
    } catch { return MOVIES; }
  });
  const [filterCat, setFilterCat]     = useState("all");
  const [searchQ, setSearchQ]         = useState("");
  const [loginMode, setLoginMode]     = useState("login");
  const [loginForm, setLoginForm]     = useState({ name:"", email:"", password:"" });
  const [adminTab, setAdminTab]       = useState("pending");
  const [notification, setNotify_]    = useState(null);
  const [heroIdx, setHeroIdx]         = useState(0);

  const notify = (msg, type = "success") => {
    setNotify_({ msg, type });
    setTimeout(() => setNotify_(null), 3500);
  };

  // Persist movies to localStorage on every change
  const setMovies = (updater) => {
    setMoviesRaw(prev => {
      const next = typeof updater === "function" ? updater(prev) : updater;
      // Only save user-uploaded films (not seed data)
      const userFilms = next.filter(m => !MOVIES.find(seed => seed.id === m.id));
      try { localStorage.setItem("lucy_movies", JSON.stringify(userFilms)); } catch {}
      return next;
    });
  };

  const nav = (p, movie = null) => {
    setMovie(movie);
    setPage(p);
    window.scrollTo(0, 0);
  };

  const featured = movies.filter(m => m.status === "approved").slice(0, 5);

  useEffect(() => {
    if (!featured.length) return;
    const t = setInterval(() => setHeroIdx(i => (i + 1) % featured.length), 6500);
    return () => clearInterval(t);
  }, [featured.length]);

  // Load shared catalog from S3 on startup (cross-device sync)
  useEffect(() => {
    const loadCatalog = async () => {
      try {
        const bucket = import.meta.env.VITE_S3_BUCKET || "lucy-raw-uploads-303602054242";
        const region = import.meta.env.VITE_S3_REGION || "us-east-1";
        const res    = await fetch(`https://${bucket}.s3.${region}.amazonaws.com/catalog.json?t=${Date.now()}`);
        if (res.ok) {
          const catalog = await res.json();
          if (Array.isArray(catalog) && catalog.length > 0) {
            setMoviesRaw(prev => {
              const seedIds = new Set(MOVIES.map(m => m.id));
              const existing = new Set(prev.map(m => m.id));
              const newFilms = catalog.filter(m => !seedIds.has(m.id) && !existing.has(m.id));
              return newFilms.length ? [...prev, ...newFilms] : prev;
            });
          }
        }
      } catch {}
    };
    loadCatalog();
  }, []);
  useEffect(() => {
    const restoreSession = async () => {
      try {
        const { fetchAuthSession, fetchUserAttributes } = await import("aws-amplify/auth");
        const session = await fetchAuthSession();
        if (session?.tokens?.accessToken) {
          const attrs = await fetchUserAttributes();
          setUser({
            name:   attrs.name || attrs.email?.split("@")[0],
            email:  attrs.email,
            role:   attrs["custom:role"] || "user",
            plan:   attrs["custom:plan"] || "free",
            userId: attrs.sub,
          });
        }
      } catch {
        setUser(null);
      } finally {
        setAuthLoading(false);
      }
    };
    restoreSession();
  }, []);

  const logout = async () => {
    try {
      const { signOut } = await import("aws-amplify/auth");
      await signOut({ global: true });
    } catch {}
    setUser(null);
    nav("home");
    notify("You have been signed out.", "info");
  };

  if (authLoading) return (
    <div style={{ minHeight:"100vh", background:"#07060f", display:"flex", alignItems:"center", justifyContent:"center" }}>
      <div style={{ width:44, height:44, borderRadius:"50%", border:"3px solid #9b6dff44", borderTopColor:"#9b6dff", animation:"spin .7s linear infinite" }}/>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );

  const login = async () => {
    if (!loginForm.email || !loginForm.password) return notify("Fill all fields", "error");
    try {
      const { signIn, fetchUserAttributes } = await import("aws-amplify/auth");
      const result = await signIn({
        username: loginForm.email.trim().toLowerCase(),
        password: loginForm.password,
      });
      if (result.isSignedIn) {
        const attrs = await fetchUserAttributes();
        const role  = attrs["custom:role"] || "user";
        const plan  = attrs["custom:plan"] || "free";
        setUser({
          name:   attrs.name || loginForm.email.split("@")[0],
          email:  attrs.email,
          role,
          plan,
          userId: attrs.sub,
        });
        notify(`Welcome back, ${attrs.name || "filmmaker"}!`);
        nav("home");
      }
    } catch (e) {
      notify(e.message || "Login failed", "error");
    }
  };



  const approveMovie = async (id) => {
    setMovies(ms => ms.map(m => m.id === id ? { ...m, status:"approved" } : m));
    notify("Film approved.");
    // Sync approval to S3 catalog
    try {
      const bucket  = import.meta.env.VITE_S3_BUCKET;
      const region  = import.meta.env.VITE_S3_REGION || "us-east-1";
      const res     = await fetch(`https://${bucket}.s3.${region}.amazonaws.com/catalog.json?t=${Date.now()}`);
      if (res.ok) {
        const catalog = await res.json();
        const updated = catalog.map(m => m.id === id ? { ...m, status:"approved" } : m);
        // Re-upload catalog
        const body    = new TextEncoder().encode(JSON.stringify(updated));
        const accessKey = "REMOVED";
        const secretKey_ = "REMOVED";
        const now2    = new Date();
        const amzDate2= now2.toISOString().replace(/[:-]|\.\d{3}/g,"").slice(0,15)+"Z";
        const dateStamp2 = amzDate2.slice(0,8);
        const ct      = "application/json";
        const hmac2   = async (key, msg) => {
          const k = typeof key==="string" ? new TextEncoder().encode(key) : key;
          const ck = await crypto.subtle.importKey("raw",k,{name:"HMAC",hash:"SHA-256"},false,["sign"]);
          return new Uint8Array(await crypto.subtle.sign("HMAC",ck,new TextEncoder().encode(msg)));
        };
        const hashBuf = await crypto.subtle.digest("SHA-256", body);
        const payHash = Array.from(new Uint8Array(hashBuf)).map(b=>b.toString(16).padStart(2,"0")).join("");
        const canH    = `content-type:${ct}\nhost:${bucket}.s3.${region}.amazonaws.com\nx-amz-content-sha256:${payHash}\nx-amz-date:${amzDate2}\n`;
        const signedH = "content-type;host;x-amz-content-sha256;x-amz-date";
        const canReq  = `PUT\ncatalog.json\n\n${canH}\n${signedH}\n${payHash}`;
        const credScope = `${dateStamp2}/${region}/s3/aws4_request`;
        const hashCR  = await crypto.subtle.digest("SHA-256",new TextEncoder().encode(canReq));
        const hashedCR= Array.from(new Uint8Array(hashCR)).map(b=>b.toString(16).padStart(2,"0")).join("");
        const sts     = `AWS4-HMAC-SHA256\n${amzDate2}\n${credScope}\n${hashedCR}`;
        const kD=await hmac2(`AWS4${secretKey_}`,dateStamp2),kR=await hmac2(kD,region),kS=await hmac2(kR,"s3"),kSi=await hmac2(kS,"aws4_request"),sig=await hmac2(kSi,sts);
        const sigHex  = Array.from(sig).map(b=>b.toString(16).padStart(2,"0")).join("");
        const auth    = `AWS4-HMAC-SHA256 Credential=${accessKey}/${credScope}, SignedHeaders=${signedH}, Signature=${sigHex}`;
        await fetch(`https://${bucket}.s3.${region}.amazonaws.com/catalog.json`,{method:"PUT",headers:{"Content-Type":ct,"x-amz-date":amzDate2,"x-amz-content-sha256":payHash,"Authorization":auth},body});
      }
    } catch (e) { console.warn("Catalog sync failed:", e.message); }
  };
  const removeMovie  = id => { setMovies(ms => ms.filter(m => m.id !== id)); notify("Film removed.", "error"); };

  const filtered = movies.filter(m => {
    if (m.status !== "approved") return false;
    if (filterCat !== "all" && m.category !== filterCat) return false;
    if (searchQ && !m.title.toLowerCase().includes(searchQ.toLowerCase())) return false;
    return true;
  });

  const heroBg = featured[heroIdx] || featured[0];
  const myMovies = user ? movies.filter(m => m.uploader === user.name) : [];

  return (
    <div style={{ minHeight:"100vh", background:G.bg, color:G.text, fontFamily:"'Inter',sans-serif", overflowX:"hidden" }}>
      <style>{`
        ${FONTS}
        *, *::before, *::after { box-sizing:border-box; margin:0; padding:0; }
        html { -webkit-text-size-adjust:100%; }
        body { overscroll-behavior:none; }
        ::-webkit-scrollbar { width:5px; background:${G.bg}; }
        ::-webkit-scrollbar-thumb { background:${G.dim}; border-radius:3px; }
        ::selection { background:${G.accentGlow}; color:${G.lavender}; }
        @keyframes fadeUp { from { opacity:0; transform:translateY(18px); } to { opacity:1; transform:translateY(0); } }
        @keyframes heroIn { from { opacity:0; transform:scale(1.05); } to { opacity:1; transform:scale(1); } }
        @keyframes slideIn { from { opacity:0; transform:translateX(20px); } to { opacity:1; transform:translateX(0); } }
        input, select, textarea {
          background:${G.surface}; border:1px solid ${G.border}; color:${G.text};
          border-radius:8px; padding:11px 14px; font-size:16px;
          font-family:'Inter',sans-serif; width:100%; outline:none; transition:border .2s, box-shadow .2s;
          -webkit-appearance:none; appearance:none;
        }
        input:focus, select:focus, textarea:focus {
          border-color:${G.accent}; box-shadow:0 0 0 3px ${G.accentGlow};
        }
        select option { background:${G.card}; }
        button { cursor:pointer; border:none; font-family:'Inter',sans-serif; transition:all .18s; -webkit-tap-highlight-color:transparent; }
        .btn-primary {
          background:linear-gradient(135deg, ${G.accent} 0%, ${G.accentDim} 100%);
          color:#fff; border-radius:8px; font-weight:600; padding:12px 26px;
          font-size:14px; letter-spacing:.02em; box-shadow:0 4px 20px ${G.accentGlow};
        }
        .btn-primary:active { filter:brightness(0.92); transform:scale(0.98); }
        .btn-ghost {
          background:transparent; color:${G.textSoft}; border:1px solid ${G.border};
          border-radius:8px; padding:11px 22px; font-size:13px; font-weight:500;
        }
        .btn-ghost:active { border-color:${G.accent}; color:${G.accent}; }
        .nav-btn { background:none; color:${G.muted}; font-size:13px; padding:7px 12px; border-radius:6px; font-weight:500; }
        .nav-btn:hover, .nav-btn.active { color:${G.text}; background:${G.surface}; }
        .pill-cat {
          background:${G.surface}; border:1px solid ${G.border}; border-radius:20px;
          padding:5px 14px; font-size:12px; color:${G.textSoft}; cursor:pointer;
          transition:all .15s; font-family:'Inter',sans-serif; font-weight:500; white-space:nowrap;
          -webkit-tap-highlight-color:transparent;
        }
        .pill-cat:active, .pill-cat.active {
          background:${G.accentGlow}; border-color:${G.accent}; color:${G.accent};
        }
        .card-lift { transition:transform .22s, box-shadow .22s; -webkit-tap-highlight-color:transparent; }
        .card-lift:active { transform:scale(0.97); }
        .tag-toggle {
          background:${G.surface}; border:1px solid ${G.border}; border-radius:6px;
          padding:6px 12px; font-size:12px; color:${G.muted}; cursor:pointer;
          transition:all .15s; font-family:'Inter',sans-serif; white-space:nowrap;
          -webkit-tap-highlight-color:transparent;
        }
        .tag-toggle.on { background:${G.accentGlow}; border-color:${G.accent}; color:${G.accent}; }
        .row-scroll { display:flex; gap:12px; overflow-x:auto; scrollbar-width:none; padding-bottom:4px; -webkit-overflow-scrolling:touch; scroll-snap-type:x mandatory; }
        .row-scroll::-webkit-scrollbar { display:none; }
        .row-scroll > * { scroll-snap-align:start; }
      `}</style>

      <Toast notification={notification} mob={isMob} />

      {/* ── NAV ── */}
      <NavBar page={page} nav={nav} user={user} logout={logout} searchQ={searchQ} setSearchQ={setSearchQ} isMob={isMob} />

      <div style={{ paddingTop:62, paddingBottom: isMob ? 70 : 0 }}>
        {page === "home"    && <HomePage movies={movies} filtered={filtered} heroBg={heroBg} heroIdx={heroIdx} setHeroIdx={setHeroIdx} featured={featured} filterCat={filterCat} setFilterCat={setFilterCat} nav={nav} searchQ={searchQ} isMob={isMob} />}
        {page === "watch"   && selectedMovie && <WatchPage movie={selectedMovie} nav={nav} movies={movies} isMob={isMob} />}
        {page === "login"   && <LoginPage loginMode={loginMode} setLoginMode={setLoginMode} loginForm={loginForm} setLoginForm={setLoginForm} login={login} nav={nav} notify={notify}/>}
        {page === "upload"  && <UploadPage user={user} movies={movies} setMovies={setMovies} notify={notify} nav={nav} isMob={isMob} />}
        {page === "profile" && user && <ProfilePage user={user} myMovies={myMovies} nav={nav} notify={notify} isMob={isMob} />}
        {page === "admin"   && user?.role === "admin" && <AdminPage movies={movies} adminTab={adminTab} setAdminTab={setAdminTab} approveMovie={approveMovie} removeMovie={removeMovie} isMob={isMob} />}
        {page === "pricing" && <PricingPage user={user} nav={nav} isMob={isMob} />}
        {page === "rules"   && <RulesPage isMob={isMob} />}
      </div>
      {isMob && <BottomTabBar page={page} nav={nav} user={user} />}
    </div>
  );
}

// ─── HOME ─────────────────────────────────────────────────────────────────────
function HomePage({ movies, filtered, heroBg, heroIdx, setHeroIdx, featured, filterCat, setFilterCat, nav, searchQ, isMob }) {
  const v = useAnimateIn(0);
  const cats = Object.entries(CATEGORIES);

  return (
    <div style={{ opacity:v ? 1 : 0, transition:"opacity .4s" }}>
      {heroBg && (
        <div style={{ position:"relative", height: isMob ? "60vh" : "78vh", minHeight: isMob ? 360 : 500, overflow:"hidden" }}>
          <div key={heroIdx} style={{
            position:"absolute", inset:0,
            backgroundImage:`url(${heroBg.banner})`,
            backgroundSize:"cover", backgroundPosition:"center top",
            animation:"heroIn .9s ease",
          }}>
            <div style={{ position:"absolute", inset:0, background: isMob
              ? `linear-gradient(0deg, ${G.bg} 0%, ${G.bg}cc 45%, transparent 80%)`
              : `linear-gradient(90deg, ${G.bg}f0 35%, ${G.bg}88 65%, transparent 100%), linear-gradient(0deg, ${G.bg} 0%, transparent 55%)` }}/>
          </div>

          <div style={{
            position:"absolute",
            bottom: isMob ? 40 : 80,
            left: isMob ? 16 : 60,
            right: isMob ? 16 : "auto",
            maxWidth: isMob ? "100%" : 540,
            animation:"fadeUp .6s .15s both",
          }}>
            <div style={{ display:"flex", gap:6, marginBottom: isMob ? 8 : 14, flexWrap:"wrap" }}>
              {heroBg.genre?.slice(0,2).map(g => <Chip key={g} label={g} color={G.accent} />)}
              <Chip label={heroBg.maturity || "PG-13"} color={G.muted} />
            </div>
            <h1 style={{
              fontFamily:"'Cormorant Garamond',serif",
              fontSize: isMob ? "clamp(24px,7vw,36px)" : "clamp(30px,5vw,58px)",
              lineHeight:1.05, fontWeight:700,
              marginBottom: isMob ? 8 : 14,
              textShadow:"0 4px 30px #0009",
            }}>
              {heroBg.title}
            </h1>
            {!isMob && (
              <p style={{ color:G.textSoft, fontSize:14, lineHeight:1.7, marginBottom:22, display:"-webkit-box", WebkitLineClamp:3, WebkitBoxOrient:"vertical", overflow:"hidden" }}>
                {heroBg.desc}
              </p>
            )}
            <div style={{ display:"flex", gap: isMob ? 8 : 12, alignItems:"center" }}>
              <button className="btn-primary" style={{ display:"flex", alignItems:"center", gap:8, fontSize: isMob ? 13 : 14, padding: isMob ? "10px 20px" : "13px 28px" }} onClick={() => nav("watch", heroBg)}>
                <svg width="11" height="13" viewBox="0 0 12 14" fill="none"><path d="M1 1l10 6-10 6V1z" fill="white"/></svg>
                Play
              </button>
              <button className="btn-ghost" onClick={() => nav("watch", heroBg)} style={{ padding: isMob ? "9px 16px" : "12px 24px", fontSize: isMob ? 12 : 13 }}>
                Info
              </button>
              <div style={{ marginLeft:4, display:"flex", alignItems:"center", gap:4 }}>
                <RatingDot score={heroBg.rating} />
                <span style={{ color:G.muted, fontSize:11 }}>/ 10</span>
              </div>
            </div>
          </div>

          <div style={{ position:"absolute", bottom: isMob ? 14 : 24, left:"50%", transform:"translateX(-50%)", display:"flex", gap:6 }}>
            {featured.map((_, i) => (
              <div key={i} onClick={() => setHeroIdx(i)} style={{
                width: i === heroIdx ? 18 : 5, height:5, borderRadius:3,
                background: i === heroIdx ? G.accent : G.dim, cursor:"pointer", transition:"all .3s",
              }}/>
            ))}
          </div>
        </div>
      )}

      {/* Filter pills */}
      <div style={{ padding: isMob ? "14px 16px 8px" : "22px 32px 10px", display:"flex", gap:7, overflowX:"auto", scrollbarWidth:"none" }}>
        <div className={`pill-cat${filterCat === "all" ? " active" : ""}`} onClick={() => setFilterCat("all")}>All</div>
        {cats.map(([k,v_]) => (
          <div key={k} className={`pill-cat${filterCat === k ? " active" : ""}`} onClick={() => setFilterCat(k)}>{v_}</div>
        ))}
      </div>

      {/* Rows */}
      <div style={{ padding: isMob ? "8px 16px 100px" : "12px 32px 80px" }}>
        {filterCat === "all" ? (
          cats.map(([ck,cl]) => {
            const row = movies.filter(m => m.status === "approved" && m.category === ck);
            return row.length ? <MovieRow key={ck} title={cl} movies={row} nav={nav} isMob={isMob} /> : null;
          })
        ) : (
          <MovieRow title={CATEGORIES[filterCat] || filterCat} movies={filtered} nav={nav} isMob={isMob} />
        )}
        {searchQ && filtered.length === 0 && (
          <div style={{ textAlign:"center", padding:"80px 0", color:G.muted }}>
            <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:28, marginBottom:10, color:G.dim }}>No Results</div>
            <div style={{ fontSize:13 }}>No films matched "{searchQ}"</div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── MOVIE ROW ─────────────────────────────────────────────────────────────────
function MovieRow({ title, movies, nav, isMob }) {
  const ref = useRef(null);
  const scroll = d => ref.current?.scrollBy({ left: d * (isMob ? 160 : 300), behavior:"smooth" });
  if (!movies.length) return null;
  const cardW = isMob ? 148 : 210;
  return (
    <div style={{ marginBottom: isMob ? 32 : 44 }}>
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom: isMob ? 10 : 16 }}>
        <h2 style={{ fontSize: isMob ? 12 : 15, fontWeight:600, color:G.textSoft, letterSpacing:".04em", textTransform:"uppercase", fontFamily:"'Syne',sans-serif" }}>{title}</h2>
        {!isMob && (
          <div style={{ display:"flex", gap:6 }}>
            {[-1,1].map(d => (
              <button key={d} onClick={() => scroll(d)} style={{
                width:28, height:28, borderRadius:"50%", background:G.surface,
                border:`1px solid ${G.border}`, color:G.muted, display:"flex",
                alignItems:"center", justifyContent:"center", fontSize:13,
              }}>
                {d === -1 ? "‹" : "›"}
              </button>
            ))}
          </div>
        )}
      </div>
      <div ref={ref} className="row-scroll">
        {movies.map(m => <MovieCard key={m.id} movie={m} nav={nav} isMob={isMob} cardW={cardW} />)}
      </div>
    </div>
  );
}

// ─── MOVIE CARD ───────────────────────────────────────────────────────────────
function MovieCard({ movie, nav, isMob, cardW }) {
  const [hov, setHov] = useState(false);
  const w = cardW || (isMob ? 148 : 210);
  const imgH = isMob ? 88 : 118;
  return (
    <div className="card-lift"
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      onClick={() => nav("watch", movie)}
      style={{ minWidth:w, maxWidth:w, borderRadius:10, overflow:"hidden", background:G.card, border:`1px solid ${G.border}`, cursor:"pointer", flexShrink:0 }}>
      <div style={{ position:"relative", height:imgH, overflow:"hidden" }}>
        <img src={movie.thumb} alt={movie.title} style={{ width:"100%", height:"100%", objectFit:"cover", transition:"transform .4s", transform: hov ? "scale(1.06)" : "scale(1)" }} loading="lazy"/>
        <div style={{ position:"absolute", inset:0, background:"linear-gradient(0deg,#0009 0%,transparent 55%)" }}/>
        {hov && !isMob && (
          <div style={{ position:"absolute", inset:0, display:"flex", alignItems:"center", justifyContent:"center", background:"#00000055" }}>
            <div style={{
              width:36, height:36, borderRadius:"50%",
              background:`linear-gradient(135deg,${G.accent},${G.accentDim})`,
              display:"flex", alignItems:"center", justifyContent:"center",
              boxShadow:`0 0 24px ${G.accentGlow}`,
            }}>
              <svg width="10" height="12" viewBox="0 0 11 13" fill="none"><path d="M1 1l9 5.5L1 12V1z" fill="white"/></svg>
            </div>
          </div>
        )}
        <div style={{ position:"absolute", top:5, left:5 }}><Chip label={movie.category} color={G.accent} small /></div>
        <div style={{ position:"absolute", top:5, right:5 }}><Chip label={movie.maturity?.split(" ")[0] || "PG"} color={G.muted} small /></div>
      </div>
      <div style={{ padding: isMob ? "7px 9px 9px" : "10px 12px 12px" }}>
        <div style={{ fontWeight:600, fontSize: isMob ? 11 : 13, marginBottom:3, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis", color:G.text }}>{movie.title}</div>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", fontSize: isMob ? 10 : 11, color:G.muted }}>
          <span>{movie.year}</span>
          <RatingDot score={movie.rating} />
        </div>
        {!isMob && <div style={{ fontSize:11, color:G.accentDim, marginTop:5, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{movie.aiTool || movie.ai_tool}</div>}
      </div>
    </div>
  );
}

// ─── VIDEO PLAYER OVERLAY ──────────────────────────────────────────────────────
function VideoPlayer({ movie, episode, onClose, isMob }) {
  const [playing, setPlaying]         = useState(false);
  const [progress, setProgress]       = useState(0);
  const [speed, setSpeed]             = useState(1);
  const [volume, setVolume]           = useState(80);
  const [muted, setMuted]             = useState(false);
  const [showSubs, setShowSubs]       = useState(true);
  const [activeSub, setActiveSub]     = useState(0);
  const [activeAudio, setActiveAudio] = useState(0);
  const [panel, setPanel]             = useState(null);
  const [showControls, setShowControls] = useState(true);
  const [fullscreen, setFullscreen]   = useState(false);
  const [rotated, setRotated]         = useState(false);
  const hideTimer = useRef(null);
  const playerRef = useRef(null);

  const SPEEDS    = [0.5, 0.75, 1, 1.25, 1.5, 1.75, 2];
  const SUBTITLES = movie.subtitles || [
    { id:0, label:"Off",     lang:"none"  },
    { id:1, label:"English", lang:"en"    },
    { id:2, label:"French",  lang:"fr"    },
    { id:3, label:"Spanish", lang:"es"    },
    { id:4, label:"Japanese",lang:"ja"    },
  ];
  const AUDIO = movie.audioTracks || [
    { id:0, label:"Original", lang:"en" },
    { id:1, label:"French Dub", lang:"fr" },
    { id:2, label:"Spanish Dub", lang:"es" },
  ];

  const resetHide = useCallback(() => {
    setShowControls(true);
    clearTimeout(hideTimer.current);
    hideTimer.current = setTimeout(() => setShowControls(false), 3000);
  }, []);

  useEffect(() => { resetHide(); return () => clearTimeout(hideTimer.current); }, [playing, resetHide]);

  // Simulate progress
  useEffect(() => {
    if (!playing) return;
    const t = setInterval(() => setProgress(p => Math.min(p + 0.02, 100)), 300);
    return () => clearInterval(t);
  }, [playing]);

  const toggleFS = () => {
    if (!document.fullscreenElement && playerRef.current) {
      playerRef.current.requestFullscreen?.();
      setFullscreen(true);
    } else {
      document.exitFullscreen?.();
      setFullscreen(false);
    }
  };

  const PanelBtn = ({ id, label, icon }) => (
    <button onClick={() => setPanel(panel === id ? null : id)} style={{
      background: panel === id ? `${G.accent}22` : "transparent",
      border: `1px solid ${panel === id ? G.accent : "transparent"}`,
      color: panel === id ? G.accent : G.textSoft,
      borderRadius:8, padding: isMob ? "7px 10px" : "8px 14px",
      fontSize: isMob ? 11 : 12, fontWeight:600, display:"flex", alignItems:"center", gap:6,
      fontFamily:"'Inter',sans-serif", cursor:"pointer", transition:"all .15s",
      whiteSpace:"nowrap",
    }}>
      {icon}{label}
    </button>
  );

  const subLabel = SUBTITLES.find(s=>s.id===activeSub)?.label || "Off";
  const audioLabel = AUDIO.find(a=>a.id===activeAudio)?.label || "Original";

  return (
    <div style={{
      position:"fixed", inset:0, zIndex:1000, background:"#000",
      display:"flex", flexDirection:"column",
      transform: rotated ? "rotate(90deg)" : "none",
      transformOrigin: "center center",
      width: rotated ? "100vh" : "100%",
      height: rotated ? "100vw" : "100%",
      top: rotated ? `calc((100vh - 100vw) / 2)` : 0,
      left: rotated ? `calc((100vw - 100vh) / 2)` : 0,
      transition: "transform .35s cubic-bezier(.4,0,.2,1)",
    }} ref={playerRef} onMouseMove={resetHide} onClick={() => { if(!panel) setPlaying(p=>!p); }}>

      {/* Video area */}
      <div style={{ flex:1, position:"relative", overflow:"hidden" }}>
        {(episode?.videoUrl || movie?.videoUrl || movie?.videoKey) ? (
  <video
    key={episode?.videoUrl || movie?.videoUrl || movie?.videoKey}
    src={episode?.videoUrl || movie?.videoUrl || (movie?.videoKey ? "https://lucy-raw-uploads-303602054242.s3.us-east-1.amazonaws.com/" + movie.videoKey : null)}
    style={{ width:"100%", height:"100%", objectFit:"contain", background:"#000", position:"absolute", inset:0, zIndex:10 }}
    autoPlay
    playsInline
    controls
  />
        ) : (
          <img src={movie.banner} alt={movie.title}
            style={{ width:"100%", height:"100%", objectFit:"cover",
              filter:`brightness(${playing ? 0.5 : 0.3})`, transition:"filter .4s" }}/>
        )}

        {/* Subtitle overlay */}
        {showSubs && activeSub !== 0 && playing && (
          <div style={{
            position:"absolute", bottom: isMob ? 80 : 100, left:"50%", transform:"translateX(-50%)",
            background:"#000000bb", borderRadius:6, padding:"6px 16px",
            fontSize: isMob ? 13 : 16, color:"#fff", fontWeight:500,
            fontFamily:"'Inter',sans-serif", textAlign:"center", maxWidth:"80%",
            textShadow:"0 2px 4px #000",
          }}>
            {SUBTITLES[activeSub]?.label === "English"  && "The signal is growing stronger..."}
            {SUBTITLES[activeSub]?.label === "French"   && "Le signal devient plus fort..."}
            {SUBTITLES[activeSub]?.label === "Spanish"  && "La señal se vuelve más fuerte..."}
            {SUBTITLES[activeSub]?.label === "Japanese" && "信号がどんどん強くなっている..."}
          </div>
        )}

        {/* Centre play/pause indicator */}
        <div style={{
          position:"absolute", inset:0, display:"flex", alignItems:"center", justifyContent:"center",
          pointerEvents:"none",
          opacity: showControls ? 1 : 0, transition:"opacity .3s",
        }}>
          {!playing && (
            <div style={{
              width: isMob ? 60 : 80, height: isMob ? 60 : 80, borderRadius:"50%",
              background:`linear-gradient(135deg,${G.accent},${G.accentDim})`,
              display:"flex", alignItems:"center", justifyContent:"center",
              boxShadow:`0 0 60px ${G.accentGlow}`,
            }}>
              <svg width={isMob?20:28} height={isMob?24:34} viewBox="0 0 22 26" fill="none">
                <path d="M2 2l18 11L2 24V2z" fill="white"/>
              </svg>
            </div>
          )}
        </div>

        {/* Speed badge */}
        {speed !== 1 && (
          <div style={{
            position:"absolute", top:16, right:16,
            background:`${G.accent}cc`, color:"#fff", borderRadius:6,
            padding:"4px 10px", fontSize:12, fontWeight:700, fontFamily:"'Syne',sans-serif",
          }}>{speed}x</div>
        )}

        {/* TOP BAR */}
        <div style={{
          position:"absolute", top:0, left:0, right:0,
          padding: isMob ? "12px 14px" : "16px 24px",
          background:"linear-gradient(180deg,#000d 0%,transparent 100%)",
          display:"flex", alignItems:"center", gap:12,
          opacity: showControls ? 1 : 0, transition:"opacity .3s",
        }} onClick={e => e.stopPropagation()}>
          <button onClick={onClose} style={{
            background:"#ffffff18", border:"1px solid #ffffff20", color:"#fff",
            borderRadius:8, padding: isMob ? "7px 12px" : "8px 16px",
            fontSize:12, fontWeight:500, fontFamily:"'Inter',sans-serif",
            display:"flex", alignItems:"center", gap:6, cursor:"pointer",
          }}>
            <svg width="12" height="12" viewBox="0 0 14 14" fill="none"><path d="M9 2L4 7l5 5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
            {!isMob && "Back"}
          </button>
          <div style={{ flex:1 }}>
            <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize: isMob ? 14 : 18, fontWeight:700, color:"#fff" }}>{movie.title}</div>
            {!isMob && <div style={{ fontSize:11, color:"rgba(255,255,255,.5)", marginTop:2 }}>{movie.year} · {movie.duration} · {audioLabel} · {subLabel}</div>}
          </div>
        </div>

        {/* SETTINGS PANEL */}
        {panel && (
          <div onClick={e=>e.stopPropagation()} style={{
            position:"absolute", bottom: isMob ? 130 : 110, right: isMob ? 8 : 24,
            background:"#0f0d1e", border:`1px solid ${G.border}`,
            borderRadius:12, minWidth: isMob ? 180 : 220,
            boxShadow:"0 16px 60px #000a",
            overflow:"hidden", zIndex:10,
            animation:"fadeUp .2s ease",
          }}>
            {/* Speed */}
            {panel === "speed" && (
              <div>
                <div style={{ padding:"12px 16px 8px", fontSize:10, color:G.muted, letterSpacing:".1em", textTransform:"uppercase", fontFamily:"'Inter',sans-serif", borderBottom:`1px solid ${G.border}` }}>Playback Speed</div>
                {SPEEDS.map(s => (
                  <button key={s} onClick={()=>{setSpeed(s);setPanel(null);}} style={{
                    display:"block", width:"100%", textAlign:"left",
                    padding:"11px 16px", background: speed===s ? `${G.accent}18` : "transparent",
                    color: speed===s ? G.accent : G.textSoft, fontSize:13,
                    fontFamily:"'Inter',sans-serif", cursor:"pointer", transition:"background .15s",
                    fontWeight: speed===s ? 600 : 400,
                  }}>
                    {s === 1 ? "Normal (1×)" : `${s}×`}
                    {speed===s && <span style={{float:"right",color:G.accent}}>✓</span>}
                  </button>
                ))}
              </div>
            )}
            {/* Subtitles */}
            {panel === "subs" && (
              <div>
                <div style={{ padding:"12px 16px 8px", fontSize:10, color:G.muted, letterSpacing:".1em", textTransform:"uppercase", fontFamily:"'Inter',sans-serif", borderBottom:`1px solid ${G.border}` }}>Subtitles</div>
                {SUBTITLES.map(s => (
                  <button key={s.id} onClick={()=>{setActiveSub(s.id);setShowSubs(s.id!==0);setPanel(null);}} style={{
                    display:"block", width:"100%", textAlign:"left",
                    padding:"11px 16px", background: activeSub===s.id ? `${G.accent}18` : "transparent",
                    color: activeSub===s.id ? G.accent : G.textSoft, fontSize:13,
                    fontFamily:"'Inter',sans-serif", cursor:"pointer", transition:"background .15s",
                    fontWeight: activeSub===s.id ? 600 : 400,
                  }}>
                    {s.label}
                    {activeSub===s.id && <span style={{float:"right",color:G.accent}}>✓</span>}
                  </button>
                ))}
              </div>
            )}
            {/* Audio */}
            {panel === "audio" && (
              <div>
                <div style={{ padding:"12px 16px 8px", fontSize:10, color:G.muted, letterSpacing:".1em", textTransform:"uppercase", fontFamily:"'Inter',sans-serif", borderBottom:`1px solid ${G.border}` }}>Audio Track</div>
                {AUDIO.map(a => (
                  <button key={a.id} onClick={()=>{setActiveAudio(a.id);setPanel(null);}} style={{
                    display:"block", width:"100%", textAlign:"left",
                    padding:"11px 16px", background: activeAudio===a.id ? `${G.accent}18` : "transparent",
                    color: activeAudio===a.id ? G.accent : G.textSoft, fontSize:13,
                    fontFamily:"'Inter',sans-serif", cursor:"pointer", transition:"background .15s",
                    fontWeight: activeAudio===a.id ? 600 : 400,
                  }}>
                    {a.label}
                    {activeAudio===a.id && <span style={{float:"right",color:G.accent}}>✓</span>}
                  </button>
                ))}
              </div>
            )}
            {/* Info */}
            {panel === "info" && (
              <div style={{ padding:"16px" }}>
                <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:18, fontWeight:700, color:G.text, marginBottom:8 }}>{movie.title}</div>
                <p style={{ fontSize:12, color:G.muted, lineHeight:1.7, marginBottom:12 }}>{movie.desc}</p>
                {[
                  ["Director", movie.director],
                  ["Writer",   movie.writer],
                  ["AI Tool",  movie.aiTool || movie.ai_tool],
                  ["Studio",   movie.studio],
                  ["Rating",   movie.maturity],
                ].map(([l,v]) => v && (
                  <div key={l} style={{ display:"flex", justifyContent:"space-between", padding:"6px 0", borderTop:`1px solid ${G.border}` }}>
                    <span style={{ fontSize:11, color:G.muted }}>{l}</span>
                    <span style={{ fontSize:11, color:G.text, fontWeight:500 }}>{v}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* BOTTOM CONTROLS */}
      <div onClick={e=>e.stopPropagation()} style={{
        background:"linear-gradient(0deg,#000f 0%,#000a 60%,transparent 100%)",
        padding: isMob ? "10px 12px 20px" : "14px 24px 24px",
        opacity: showControls ? 1 : 0, transition:"opacity .3s",
      }}>
        {/* Progress bar */}
        <div style={{ position:"relative", marginBottom: isMob ? 10 : 14, cursor:"pointer" }}
          onClick={e => { const r = e.currentTarget.getBoundingClientRect(); setProgress(((e.clientX-r.left)/r.width)*100); }}>
          <div style={{ height:4, background:"rgba(255,255,255,.2)", borderRadius:2, position:"relative" }}>
            <div style={{ width:`${progress}%`, height:"100%", background:`linear-gradient(90deg,${G.accent},${G.accentDim})`, borderRadius:2, transition:"width .3s linear" }}/>
            <div style={{
              position:"absolute", top:"50%", left:`${progress}%`,
              transform:"translate(-50%,-50%)",
              width:14, height:14, borderRadius:"50%", background:G.accent,
              boxShadow:`0 0 8px ${G.accent}`,
            }}/>
          </div>
        </div>

        {/* Controls row */}
        <div style={{ display:"flex", alignItems:"center", gap: isMob ? 6 : 12 }}>
          {/* Play/Pause */}
          <button onClick={()=>setPlaying(p=>!p)} style={{
            width: isMob ? 36 : 44, height: isMob ? 36 : 44, borderRadius:"50%",
            background:`linear-gradient(135deg,${G.accent},${G.accentDim})`,
            display:"flex", alignItems:"center", justifyContent:"center",
            border:"none", cursor:"pointer", flexShrink:0,
            boxShadow:`0 0 20px ${G.accentGlow}`,
          }}>
            {playing
              ? <svg width="14" height="16" viewBox="0 0 14 16" fill="none"><rect x="1" y="1" width="4" height="14" rx="1.5" fill="white"/><rect x="9" y="1" width="4" height="14" rx="1.5" fill="white"/></svg>
              : <svg width="14" height="16" viewBox="0 0 14 16" fill="none"><path d="M2 1l11 7L2 15V1z" fill="white"/></svg>
            }
          </button>

          {/* Volume */}
          <button onClick={()=>setMuted(m=>!m)} style={{ background:"none", color: muted ? G.muted : "rgba(255,255,255,.8)", border:"none", cursor:"pointer", padding:6, display:"flex" }}>
            <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
              <path d="M3 7h3l4-4v14l-4-4H3V7z" stroke="currentColor" strokeWidth="1.4" fill={muted?"none":"currentColor"} fillOpacity={muted?0:.2}/>
              {!muted && <path d="M13 5.5a5.5 5.5 0 010 9M15.5 3a8.5 8.5 0 010 14" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>}
              {muted && <path d="M13 8l4 4M17 8l-4 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>}
            </svg>
          </button>

          {!isMob && (
            <input type="range" min={0} max={100} value={muted?0:volume}
              onChange={e=>{ setVolume(+e.target.value); setMuted(false); }}
              style={{ width:80, accentColor:G.accent, cursor:"pointer" }}/>
          )}

          {/* Time */}
          <span style={{ fontSize: isMob ? 10 : 12, color:"rgba(255,255,255,.6)", fontFamily:"'Inter',sans-serif", whiteSpace:"nowrap" }}>
            {Math.floor(progress*108/100)}:{String(Math.floor((progress*108/100*60)%60)).padStart(2,"0")} / {movie.duration}
          </span>

          <div style={{ flex:1 }}/>

          {/* Panel buttons */}
          <PanelBtn id="speed" label={speed===1 ? "Speed" : `${speed}×`} icon={
            <svg width="14" height="14" viewBox="0 0 20 20" fill="none"><path d="M10 3v7l4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/><circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="1.4"/></svg>
          }/>
          <PanelBtn id="subs"  label={isMob ? "CC" : `CC: ${subLabel}`} icon={
            <svg width="14" height="14" viewBox="0 0 20 20" fill="none"><rect x="2" y="5" width="16" height="10" rx="2" stroke="currentColor" strokeWidth="1.4"/><path d="M5 10h4M5 13h6M11 10h4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>
          }/>
          <PanelBtn id="audio" label={isMob ? "Audio" : audioLabel} icon={
            <svg width="14" height="14" viewBox="0 0 20 20" fill="none"><circle cx="10" cy="10" r="3" stroke="currentColor" strokeWidth="1.4"/><path d="M4 10a6 6 0 0012 0M2 10a8 8 0 0016 0" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>
          }/>
          <PanelBtn id="info"  label={isMob ? "" : "About"} icon={
            <svg width="14" height="14" viewBox="0 0 20 20" fill="none"><circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="1.4"/><path d="M10 9v6M10 6.5v.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
          }/>

          {/* Rotate & Maximize */}
          {isMob && (
            <button onClick={() => setRotated(r => !r)} style={{
              background: rotated ? `${G.accent}33` : "none",
              border: `1px solid ${rotated ? G.accent : "transparent"}`,
              color: rotated ? G.accent : "rgba(255,255,255,.7)",
              borderRadius:8, cursor:"pointer", padding:"6px 8px", display:"flex", alignItems:"center", gap:5,
              transition:"all .18s",
            }}>
              <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
                <rect x="3" y="6" width="14" height="10" rx="2" stroke="currentColor" strokeWidth="1.4"/>
                <path d="M7 6V4a2 2 0 012-2h8a2 2 0 012 2v8a2 2 0 01-2 2h-2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
                <path d="M10 14l2 2-2 2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          )}

          {/* Fullscreen */}
          <button onClick={toggleFS} style={{ background:"none", color:"rgba(255,255,255,.7)", border:"none", cursor:"pointer", padding:6, display:"flex" }}>
            <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
              {fullscreen
                ? <><path d="M7 2v5H2M13 2v5h5M7 18v-5H2M13 18v-5h5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></>
                : <><path d="M2 7V2h5M18 7V2h-5M2 13v5h5M18 13v5h-5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></>
              }
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── EPISODES ──────────────────────────────────────────────────────────────────
const S3_BASE = "https://lucy-raw-uploads-303602054242.s3.us-east-1.amazonaws.com";

function getEpisodes(movie) {
  if (movie.videoUrl) {
    return [{ id:1, title:movie.title, duration:movie.duration||"—", thumb:movie.thumb, desc:movie.desc, videoUrl:movie.videoUrl }];
  }
  if (movie.videoKey) {
    const videoUrl = S3_BASE + "/" + movie.videoKey;
    return [{ id:1, title:movie.title, duration:movie.duration||"—", thumb:movie.thumb, desc:movie.desc, videoUrl }];
  }
  // Mock episodes for seed data only
  if (movie.category === "mini" || movie.category === "short") {
    return [{ id:1, title:movie.title, duration:movie.duration, thumb:movie.thumb, desc:movie.desc }];
  }
  return [
    { id:1, title:"Episode 1 — Origin",     duration:"28m", thumb:movie.thumb,   desc:"The story begins as our protagonist discovers the signal." },
    { id:2, title:"Episode 2 — Frequency",  duration:"31m", thumb:movie.banner,  desc:"Deeper into the labyrinth, a second voice is heard." },
    { id:3, title:"Episode 3 — The Weight", duration:"29m", thumb:movie.thumb,   desc:"Consequences arrive faster than anyone anticipated." },
    { id:4, title:"Episode 4 — Resolution", duration:"33m", thumb:movie.banner,  desc:"The final confrontation reshapes everything." },
  ];
}

// ─── WATCH PAGE (Detail + Episodes) ──────────────────────────────────────────
function WatchPage({ movie, nav, movies, isMob }) {
  const v = useAnimateIn(movie.id);
  const [playerOpen, setPlayerOpen] = useState(false);
  const [activeEp, setActiveEp]     = useState(null);
  const [detailTab, setDetailTab]   = useState("episodes"); // episodes | about | cast
  const related  = movies.filter(m => m.id !== movie.id && m.status === "approved" && m.category === movie.category).slice(0, 6);
  const episodes = getEpisodes(movie);
  // DEBUG - remove after fixing
  console.log("MOVIE:", JSON.stringify({id:movie.id, videoUrl:movie.videoUrl, videoKey:movie.videoKey}));
  console.log("EPISODES:", JSON.stringify(episodes[0]));
  const pad = isMob ? "0 0 100px" : "0 0 80px";

  return (
    <>
      {playerOpen && <VideoPlayer movie={movie} episode={activeEp || episodes[0]} onClose={()=>setPlayerOpen(false)} isMob={isMob}/>}

      <div style={{ opacity:v?1:0, transition:"opacity .4s" }}>
        {/* HERO BANNER */}
        <div style={{ position:"relative", height: isMob ? "55vw" : "52vh", minHeight: isMob ? 200 : 320, overflow:"hidden" }}>
          <img src={movie.banner} alt={movie.title} style={{ width:"100%", height:"100%", objectFit:"cover", filter:"brightness(.45)" }}/>
          <div style={{ position:"absolute", inset:0, background:`linear-gradient(0deg,${G.bg} 0%,${G.bg}88 30%,transparent 65%)` }}/>

          {/* Back button */}
          <button className="btn-ghost" onClick={()=>nav("home")} style={{
            position:"absolute", top:16, left: isMob ? 14 : 24,
            display:"flex", alignItems:"center", gap:6, padding:"7px 12px", fontSize:12,
            background:"#0009", backdropFilter:"blur(8px)",
          }}>
            <svg width="12" height="12" viewBox="0 0 14 14" fill="none"><path d="M9 2L4 7l5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
            {!isMob && "Back"}
          </button>

          {/* Play button centred */}
          <button onClick={()=>{ setActiveEp(null); setPlayerOpen(true); }} style={{
            position:"absolute", top:"50%", left:"50%", transform:"translate(-50%,-50%)",
            width: isMob ? 56 : 72, height: isMob ? 56 : 72, borderRadius:"50%",
            background:`linear-gradient(135deg,${G.accent},${G.accentDim})`,
            display:"flex", alignItems:"center", justifyContent:"center",
            border:"none", cursor:"pointer",
            boxShadow:`0 0 50px ${G.accentGlow}`,
          }}>
            <svg width={isMob?18:24} height={isMob?22:28} viewBox="0 0 22 26" fill="none"><path d="M2 2l18 11L2 24V2z" fill="white"/></svg>
          </button>
        </div>

        <div style={{ padding: isMob ? "16px 14px 0" : "24px 40px 0", maxWidth:1100, margin:"0 auto" }}>
          {/* Title row */}
          <div style={{ display:"flex", gap:8, marginBottom:10, flexWrap:"wrap" }}>
            {movie.genre?.slice(0,3).map(g => <Chip key={g} label={g} color={G.accent}/>)}
            {movie.maturity && <Chip label={movie.maturity} color={G.muted}/>}
            {movie.aiType   && <Chip label={movie.aiType}   color={G.lavender}/>}
          </div>
          <h1 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize: isMob ? "clamp(22px,7vw,34px)" : "clamp(28px,4vw,46px)", fontWeight:700, lineHeight:1.05, marginBottom:8 }}>
            {movie.title}
          </h1>
          <div style={{ display:"flex", gap:14, color:G.muted, fontSize:11, marginBottom:16, flexWrap:"wrap", fontFamily:"'Inter',sans-serif" }}>
            <span>{movie.year}</span><span>{movie.duration}</span>
            <span>{movie.views} views</span>
            <span><RatingDot score={movie.rating}/><span style={{color:G.muted}}> / 10</span></span>
          </div>

          {/* Action buttons */}
          <div style={{ display:"flex", gap:10, marginBottom:24, flexWrap:"wrap" }}>
            <button className="btn-primary" style={{ display:"flex", alignItems:"center", gap:8, padding: isMob?"10px 20px":"12px 28px", fontSize:13 }}
              onClick={()=>{ setActiveEp(null); setPlayerOpen(true); }}>
              <svg width="11" height="13" viewBox="0 0 11 13" fill="none"><path d="M1 1l9 5.5L1 12V1z" fill="white"/></svg>
              Play
            </button>
            <button className="btn-ghost" style={{ padding: isMob?"9px 16px":"11px 22px", fontSize:12 }}
              onClick={()=>{ setActiveEp(episodes[0]); setPlayerOpen(true); }}>
              Watch Trailer
            </button>
          </div>

          {/* Tabs */}
          <div style={{ display:"flex", gap:0, borderBottom:`1px solid ${G.border}`, marginBottom:20 }}>
            {[
              { id:"episodes", label: movie.category==="short"||movie.category==="mini" ? "Film" : "Episodes" },
              { id:"about",    label:"About" },
              { id:"cast",     label:"Credits" },
            ].map(t => (
              <button key={t.id} onClick={()=>setDetailTab(t.id)} style={{
                padding: isMob ? "10px 14px" : "11px 20px",
                fontSize: isMob ? 12 : 13, fontWeight: detailTab===t.id ? 600 : 400,
                color: detailTab===t.id ? G.accent : G.muted,
                background:"none", borderBottom: detailTab===t.id ? `2px solid ${G.accent}` : "2px solid transparent",
                marginBottom:-1, transition:"color .2s",
              }}>
                {t.label}
              </button>
            ))}
          </div>

          <div style={{ display: isMob ? "flex" : "grid", flexDirection: isMob ? "column" : undefined, gridTemplateColumns: isMob ? undefined : "1fr 300px", gap: isMob ? 16 : 32 }}>
            {/* Main content */}
            <div>
              {/* EPISODES TAB */}
              {detailTab === "episodes" && (
                <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
                  {episodes.map((ep, i) => (
                    <div key={ep.id} onClick={()=>{ setActiveEp(ep); setPlayerOpen(true); }}
                      style={{
                        display:"flex", gap:14, background:G.card, borderRadius:12,
                        padding: isMob ? "10px" : "14px", border:`1px solid ${G.border}`,
                        cursor:"pointer", transition:"border .18s, background .18s",
                      }}
                      onMouseEnter={e=>{ e.currentTarget.style.borderColor=G.accent; e.currentTarget.style.background=G.cardHover; }}
                      onMouseLeave={e=>{ e.currentTarget.style.borderColor=G.border; e.currentTarget.style.background=G.card; }}>
                      {/* Thumb */}
                      <div style={{ position:"relative", flexShrink:0, width: isMob ? 110 : 150, height: isMob ? 62 : 84, borderRadius:8, overflow:"hidden" }}>
                        <img src={ep.thumb} alt={ep.title} style={{ width:"100%", height:"100%", objectFit:"cover" }}/>
                        <div style={{ position:"absolute", inset:0, background:"#0005", display:"flex", alignItems:"center", justifyContent:"center" }}>
                          <div style={{ width:32, height:32, borderRadius:"50%", background:`${G.accent}cc`, display:"flex", alignItems:"center", justifyContent:"center" }}>
                            <svg width="11" height="13" viewBox="0 0 11 13" fill="none"><path d="M1 1l9 5.5L1 12V1z" fill="white"/></svg>
                          </div>
                        </div>
                        <div style={{ position:"absolute", bottom:4, right:6, fontSize:10, color:"#fff", fontWeight:700, background:"#0009", borderRadius:4, padding:"1px 5px" }}>{ep.duration}</div>
                      </div>
                      <div style={{ flex:1, minWidth:0 }}>
                        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", gap:8, marginBottom:5 }}>
                          <div style={{ fontWeight:600, fontSize: isMob ? 12 : 14, color:G.text }}>{ep.title}</div>
                          <span style={{ fontSize:11, color:G.muted, whiteSpace:"nowrap", flexShrink:0 }}>{ep.duration}</span>
                        </div>
                        <p style={{ fontSize: isMob ? 11 : 12, color:G.muted, lineHeight:1.6, display:"-webkit-box", WebkitLineClamp:2, WebkitBoxOrient:"vertical", overflow:"hidden" }}>{ep.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* ABOUT TAB */}
              {detailTab === "about" && (
                <div>
                  <p style={{ color:G.textSoft, lineHeight:1.85, fontSize: isMob ? 13 : 14, marginBottom:20 }}>{movie.desc}</p>
                  <Divider my={16}/>
                  <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap: isMob ? 14 : 18 }}>
                    {[
                      { label:"Director",      value:movie.director },
                      { label:"Screenwriter",  value:movie.writer },
                      { label:"AI Tools",      value:movie.aiTool || movie.ai_tool },
                      { label:"Studio",        value:movie.studio },
                      { label:"Year",          value:movie.year },
                      { label:"Duration",      value:movie.duration },
                      { label:"Maturity",      value:movie.maturity },
                      { label:"AI Type",       value:movie.aiType },
                    ].filter(r=>r.value).map(({ label, value }) => (
                      <div key={label} style={{ padding:"10px 0", borderBottom:`1px solid ${G.border}` }}>
                        <div style={{ fontSize:10, color:G.muted, letterSpacing:".08em", textTransform:"uppercase", marginBottom:3 }}>{label}</div>
                        <div style={{ fontSize:12, fontWeight:500, color:G.text }}>{value}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* CAST / CREDITS TAB */}
              {detailTab === "cast" && (
                <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
                  {[
                    { role:"Director",        name:movie.director || "Unknown" },
                    { role:"Screenwriter",    name:movie.writer   || "Unknown" },
                    { role:"AI Supervisor",   name:movie.studio   || "Unknown" },
                    { role:"Sound Design",    name:"Procedural AI" },
                    { role:"Visual Effects",  name:movie.aiTool || "AI-Generated" },
                    { role:"Music",           name:"Generative Score AI" },
                  ].map((c,i) => (
                    <div key={i} style={{ display:"flex", alignItems:"center", gap:12, padding:"10px 12px", background:G.card, borderRadius:10, border:`1px solid ${G.border}` }}>
                      <div style={{ width:36, height:36, borderRadius:"50%", background:`linear-gradient(135deg,${G.accent}44,${G.accentDim}44)`, border:`1px solid ${G.accent}33`, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, fontFamily:"'Syne',sans-serif", fontWeight:700, color:G.accent, fontSize:13 }}>
                        {c.name.charAt(0)}
                      </div>
                      <div>
                        <div style={{ fontSize:13, fontWeight:600, color:G.text }}>{c.name}</div>
                        <div style={{ fontSize:11, color:G.muted }}>{c.role}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Related sidebar */}
            <div>
              <div style={{ fontSize:10, fontWeight:600, color:G.muted, letterSpacing:".1em", textTransform:"uppercase", marginBottom:14 }}>More Like This</div>
              <div style={{ display:"flex", flexDirection: isMob ? "row" : "column", gap:10, overflowX: isMob ? "auto" : "visible", scrollbarWidth:"none", paddingBottom: isMob ? 4 : 0 }}>
                {related.map(m => (
                  <div key={m.id} onClick={() => nav("watch", m)}
                    style={{
                      flexShrink:0, minWidth: isMob ? 130 : "auto",
                      background:G.card, borderRadius:10, overflow:"hidden",
                      border:`1px solid ${G.border}`, cursor:"pointer", transition:"border .2s",
                    }}
                    onMouseEnter={e=>e.currentTarget.style.borderColor=G.accent}
                    onMouseLeave={e=>e.currentTarget.style.borderColor=G.border}>
                    <img src={m.thumb} alt={m.title} style={{ width:"100%", height: isMob ? 74 : 60, objectFit:"cover" }}/>
                    <div style={{ padding: isMob ? "7px 8px 8px" : "8px 10px 10px" }}>
                      <div style={{ fontWeight:600, fontSize:11, color:G.text, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{m.title}</div>
                      <div style={{ fontSize:10, color:G.muted, marginTop:2, display:"flex", justifyContent:"space-between" }}>
                        <span>{m.year}</span>
                        <RatingDot score={m.rating}/>
                      </div>
                    </div>
                  </div>
                ))}
                {!related.length && <div style={{ fontSize:12, color:G.muted }}>No related films.</div>}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

// ─── PROFILE ──────────────────────────────────────────────────────────────────
function ProfilePage({ user, myMovies, nav, notify, isMob }) {
  const v = useAnimateIn(user.name);
  const plan = PLANS.find(p => p.id === user.plan) || PLANS[0];
  const initial = user.name.charAt(0).toUpperCase();
  const pad = isMob ? "20px 16px 100px" : "36px 48px 80px";

  return (
    <div style={{ opacity:v ? 1 : 0, transition:"opacity .4s", padding:pad, maxWidth:1000, margin:"0 auto" }}>
      {/* Profile Header */}
      <div style={{ display:"flex", flexDirection: isMob ? "column" : "row", gap: isMob ? 16 : 28, alignItems: isMob ? "center" : "flex-start", marginBottom:32, textAlign: isMob ? "center" : "left" }}>
        <div style={{
          width: isMob ? 72 : 80, height: isMob ? 72 : 80, borderRadius:"50%",
          background:`linear-gradient(135deg, ${G.accent}, ${G.accentDim})`,
          display:"flex", alignItems:"center", justifyContent:"center",
          fontSize: isMob ? 28 : 32, fontWeight:800, color:"#fff",
          fontFamily:"'Syne',sans-serif", flexShrink:0,
          boxShadow:`0 0 40px ${G.accentGlow}`,
        }}>{initial}</div>

        <div style={{ flex:1 }}>
          <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:6, justifyContent: isMob ? "center" : "flex-start", flexWrap:"wrap" }}>
            <h1 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize: isMob ? 26 : 34, fontWeight:700 }}>{user.name}</h1>
            <Chip label={plan.name} color={plan.color} />
            {user.role === "admin" && <Chip label="Admin" color={G.rose} />}
          </div>
          <div style={{ fontSize:12, color:G.muted, marginBottom:16 }}>{user.email || "No email provided"}</div>

          <div style={{ display:"flex", gap: isMob ? 16 : 24, justifyContent: isMob ? "center" : "flex-start" }}>
            {[
              { label:"Uploaded", value: myMovies.length },
              { label:"Approved", value: myMovies.filter(m => m.status === "approved").length },
              { label:"Pending",  value: myMovies.filter(m => m.status === "pending").length },
              { label:"Storage",  value: "2.4 GB" },
            ].map(({ label, value }) => (
              <div key={label} style={{ textAlign:"center" }}>
                <div style={{ fontSize: isMob ? 18 : 22, fontWeight:700, color:G.accent, fontFamily:"'Syne',sans-serif" }}>{value}</div>
                <div style={{ fontSize:10, color:G.muted, marginTop:2 }}>{label}</div>
              </div>
            ))}
          </div>
        </div>

        <button className="btn-primary" style={{ padding:"11px 22px", flexShrink:0, alignSelf: isMob ? "stretch" : "flex-start" }} onClick={() => nav("upload")}>
          Upload a Film
        </button>
      </div>

      <Divider />

      {/* Plan Card */}
      <div style={{ background:G.card, border:`1px solid ${G.border}`, borderRadius:12, padding:"16px 18px", marginBottom:28, display:"flex", flexDirection: isMob ? "column" : "row", alignItems: isMob ? "stretch" : "center", justifyContent:"space-between", gap:12 }}>
        <div>
          <div style={{ fontSize:10, color:G.muted, letterSpacing:".1em", textTransform:"uppercase", marginBottom:6 }}>Current Plan</div>
          <div style={{ display:"flex", alignItems:"center", gap:10, flexWrap:"wrap" }}>
            <Chip label={plan.name} color={plan.color} />
            <span style={{ fontSize:12, color:G.textSoft }}>{plan.storage} · {plan.uploads === 999 ? "Unlimited" : plan.uploads} uploads</span>
          </div>
        </div>
        <button className="btn-ghost" style={{ padding:"9px 18px", fontSize:12, alignSelf: isMob ? "flex-start" : "auto" }} onClick={() => nav("pricing")}>Upgrade Plan</button>
      </div>

      {/* My Films */}
      <div>
        <h2 style={{ fontFamily:"'Syne',sans-serif", fontSize:12, fontWeight:600, color:G.textSoft, letterSpacing:".08em", textTransform:"uppercase", marginBottom:16 }}>My Films</h2>
        {!myMovies.length ? (
          <div style={{ textAlign:"center", padding:"48px 0", color:G.muted }}>
            <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:26, color:G.dim, marginBottom:8 }}>No films yet</div>
            <div style={{ fontSize:13, marginBottom:18 }}>Upload your first AI film to get started.</div>
            <button className="btn-primary" style={{ padding:"11px 26px" }} onClick={() => nav("upload")}>Upload Now</button>
          </div>
        ) : (
          <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
            {myMovies.map(m => (
              <div key={m.id} style={{ display:"flex", gap:12, background:G.card, borderRadius:12, padding:12, border:`1px solid ${G.border}`, alignItems:"center" }}>
                <img src={m.thumb} alt={m.title} style={{ width: isMob ? 80 : 110, height: isMob ? 46 : 62, objectFit:"cover", borderRadius:7, flexShrink:0 }}/>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontWeight:600, fontSize: isMob ? 12 : 14, color:G.text, marginBottom:5, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{m.title}</div>
                  <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
                    <Chip label={m.category} color={G.accent} small />
                    <Chip label={m.status === "approved" ? "Published" : "Pending"} color={m.status === "approved" ? G.success : G.gold} small />
                  </div>
                </div>
                <div style={{ textAlign:"right", flexShrink:0 }}>
                  <div style={{ fontSize:10, color:G.muted }}>{m.year}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── DRAG DROP ZONE ────────────────────────────────────────────────────────────
function DropZone({ label, accept, hint, file, onFile, icon, multiple, files, onFiles }) {
  const [drag, setDrag] = useState(false);
  const inp = useRef(null);
  const handle = (e) => {
    e.preventDefault(); e.stopPropagation();
    const items = e.dataTransfer?.files || e.target.files;
    if (!items) return;
    if (multiple && onFiles) {
      onFiles(Array.from(items));
    } else if (onFile) {
      onFile(items[0]);
    }
  };
  const display = multiple ? (files?.length ? files.map(f=>f.name).join(", ") : null) : file?.name;
  return (
    <div
      onDragEnter={e=>{e.preventDefault();setDrag(true);}}
      onDragOver={e=>{e.preventDefault();setDrag(true);}}
      onDragLeave={e=>{e.preventDefault();setDrag(false);}}
      onDrop={e=>{setDrag(false);handle(e);}}
      onClick={()=>inp.current?.click()}
      style={{
        border:`2px dashed ${drag ? G.accent : display ? G.success : G.borderFocus}`,
        borderRadius:12, padding:"20px 16px", cursor:"pointer",
        background: drag ? `${G.accent}08` : display ? `${G.success}06` : `${G.accent}04`,
        transition:"all .18s", textAlign:"center",
      }}>
      <input ref={inp} type="file" accept={accept} multiple={multiple} style={{display:"none"}} onChange={handle}/>
      <div style={{ width:36, height:36, borderRadius:"50%", background: display ? `${G.success}20` : `${G.accent}18`, border:`1px solid ${display ? G.success : G.accent}30`, display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 10px" }}>
        {display
          ? <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8l3.5 3.5L13 4" stroke={G.success} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          : icon
        }
      </div>
      <div style={{ fontSize:12, fontWeight:600, color: display ? G.success : G.text, marginBottom:4 }}>
        {display ? (display.length > 40 ? display.slice(0,40)+"…" : display) : label}
      </div>
      <div style={{ fontSize:11, color:G.muted }}>{display ? "Click to replace" : hint}</div>
    </div>
  );
}

// ─── UPLOAD ───────────────────────────────────────────────────────────────────
function UploadPage({ user, movies, setMovies, notify, nav, isMob }) {
  const v = useAnimateIn(0);
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    title:"", desc:"", category:"drama", genre:[],
    aiTool:"", aiType:"Fully AI Generated", storage:"cloud",
    director:"", writer:"", studio:"",
    maturity:"PG-13", language:"English",
    videoFile:null, thumbFile:null, thumbUrl:"",
    audioTracks:[], subtitleFiles:[],
  });

  const f = (k, v_) => setForm(p => ({ ...p, [k]:v_ }));
  const toggleGenre = g => f("genre", form.genre.includes(g) ? form.genre.filter(x => x !== g) : [...form.genre, g]);
  const maxDur = form.category === "mini" ? "1 minute" : form.category === "short" ? "30 minutes" : "2 hours";
  const pad = isMob ? "16px 16px 100px" : "36px 48px 80px";
  const thumbPreview = form.thumbFile ? URL.createObjectURL(form.thumbFile) : form.thumbUrl || null;

  const [uploading,    setUploading]    = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const uploadToS3 = async (file, folder) => {
    const BACKEND_URL = "https://6k8fgusfm9.execute-api.us-east-1.amazonaws.com/default/lucy-presign";
    const { fetchAuthSession } = await import("aws-amplify/auth");
    const session = await fetchAuthSession();
    const token = session.tokens?.accessToken?.toString() || "";
    const res = await fetch(BACKEND_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
      body: JSON.stringify({
        filename:    file.name,
        contentType: file.type || "application/octet-stream",
        folder,
      }),
    });

    if (!res.ok) throw new Error("Failed to get upload URL");
    const { url, key } = await res.json();

    const upload = await fetch(url, {
      method: "PUT",
      headers: { "Content-Type": file.type || "application/octet-stream" },
      body: file,
    });

    if (!upload.ok) throw new Error("Upload to S3 failed");
    return key;
  };

  const submit = async () => {
    if (!form.title || !form.desc) return notify("Title and description are required.", "error");
    if (!form.director) return notify("Director field is required.", "error");
    if (!form.videoFile) return notify("Please upload a video file.", "error");

    setUploading(true);
    setUploadProgress(0);

    try {
      notify("Uploading your film to the cloud…", "info");

      // Upload video file
      setUploadProgress(10);
      const videoKey = await uploadToS3(form.videoFile, `uploads/${user?.userId || "guest"}/videos`);
      setUploadProgress(60);

      // Upload thumbnail if provided
      let thumbKey = null;
      if (form.thumbFile) {
        thumbKey = await uploadToS3(form.thumbFile, `uploads/${user?.userId || "guest"}/thumbnails`);
      }
      setUploadProgress(80);

      // Upload audio tracks
      const audioKeys = [];
      for (const audio of form.audioTracks) {
        const key = await uploadToS3(audio, `uploads/${user?.userId || "guest"}/audio`);
        audioKeys.push(key);
      }

      // Upload subtitle files
      const subKeys = [];
      for (const sub of form.subtitleFiles) {
        const key = await uploadToS3(sub, `uploads/${user?.userId || "guest"}/subtitles`);
        subKeys.push(key);
      }

      setUploadProgress(100);

      // Add to local movies list as pending
      const m = {
        id:       Date.now(),
        title:    form.title,
        year:     2025,
        rating:   0,
        duration: "—",
        category: form.category,
        genre:    form.genre,
        thumb:    form.thumbUrl || (thumbKey ? `https://${import.meta.env.VITE_S3_BUCKET}.s3.${import.meta.env.VITE_S3_REGION || "us-east-1"}.amazonaws.com/${thumbKey}` : "https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?w=400&h=225&fit=crop"),
        banner:   thumbKey ? `https://${import.meta.env.VITE_S3_BUCKET}.s3.${import.meta.env.VITE_S3_REGION || "us-east-1"}.amazonaws.com/${thumbKey}` : "https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?w=1400&h=600&fit=crop",
        desc:     form.desc,
        director: form.director,
        writer:   form.writer || form.director,
        studio:   form.studio || "Independent",
        aiTool:   form.aiTool,
        aiType:   form.aiType,
        maturity: form.maturity,
        views:    "0",
        status:   "pending",
        uploader: user?.name || "guest",
        videoKey,
        thumbKey,
        audioKeys,
        subKeys,
      };

      // Save to shared S3 catalog so all devices can see it
      try {
        const bucket  = import.meta.env.VITE_S3_BUCKET;
        const region  = import.meta.env.VITE_S3_REGION || "us-east-1";
        const catUrl  = `https://${bucket}.s3.${region}.amazonaws.com/catalog.json`;
        let catalog   = [];
        try {
          const res = await fetch(catUrl + "?t=" + Date.now());
          if (res.ok) catalog = await res.json();
        } catch {}
        catalog.push(m);
        await uploadToS3(new Blob([JSON.stringify(catalog)], { type:"application/json" }), "");
        // Rename — upload as catalog.json directly
        const catalogKey = "catalog.json";
        const catBuffer  = new TextEncoder().encode(JSON.stringify(catalog));
        const accessKey  = "REMOVED";
        const secretKey_ = "REMOVED";
        const now2       = new Date();
        const amzDate2   = now2.toISOString().replace(/[:-]|\.\d{3}/g, "").slice(0,15) + "Z";
        const dateStamp2 = amzDate2.slice(0,8);
        const contentType2 = "application/json";
        const hmac2 = async (key, msg) => {
          const k = typeof key === "string" ? new TextEncoder().encode(key) : key;
          const ck = await crypto.subtle.importKey("raw", k, {name:"HMAC",hash:"SHA-256"}, false, ["sign"]);
          return new Uint8Array(await crypto.subtle.sign("HMAC", ck, new TextEncoder().encode(msg)));
        };
        const hashBuf2   = await crypto.subtle.digest("SHA-256", catBuffer);
        const payHash2   = Array.from(new Uint8Array(hashBuf2)).map(b=>b.toString(16).padStart(2,"0")).join("");
        const canHeaders2 = `content-type:${contentType2}\nhost:${bucket}.s3.${region}.amazonaws.com\nx-amz-content-sha256:${payHash2}\nx-amz-date:${amzDate2}\n`;
        const signedH2   = "content-type;host;x-amz-content-sha256;x-amz-date";
        const canReq2    = `PUT\n/${catalogKey}\n\n${canHeaders2}\n${signedH2}\n${payHash2}`;
        const credScope2 = `${dateStamp2}/${region}/s3/aws4_request`;
        const hashCR2    = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(canReq2));
        const hashedCR2  = Array.from(new Uint8Array(hashCR2)).map(b=>b.toString(16).padStart(2,"0")).join("");
        const sts2       = `AWS4-HMAC-SHA256\n${amzDate2}\n${credScope2}\n${hashedCR2}`;
        const kD2 = await hmac2(`AWS4${secretKey_}`, dateStamp2);
        const kR2 = await hmac2(kD2, region);
        const kS2 = await hmac2(kR2, "s3");
        const kSi2= await hmac2(kS2, "aws4_request");
        const sig2= await hmac2(kSi2, sts2);
        const sigHex2 = Array.from(sig2).map(b=>b.toString(16).padStart(2,"0")).join("");
        const auth2 = `AWS4-HMAC-SHA256 Credential=${accessKey}/${credScope2}, SignedHeaders=${signedH2}, Signature=${sigHex2}`;
        await fetch(`https://${bucket}.s3.${region}.amazonaws.com/${catalogKey}`, {
          method:"PUT",
          headers:{"Content-Type":contentType2,"x-amz-date":amzDate2,"x-amz-content-sha256":payHash2,"Authorization":auth2},
          body: catBuffer,
        });
      } catch (catalogErr) {
        console.warn("Catalog save failed:", catalogErr.message);
      }

      setMovies(ms => [...ms, m]);
      notify("Film uploaded successfully! Submitted for admin review. 🎬");
      nav("profile");

    } catch (e) {
      notify(`Upload failed: ${e.message}`, "error");
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const steps = ["File & Media","Film Details","Credits","Review"];

  return (
    <div style={{ opacity:v ? 1 : 0, transition:"opacity .4s", padding:pad, maxWidth:760, margin:"0 auto" }}>
      <button className="btn-ghost" style={{ marginBottom:18, display:"flex", alignItems:"center", gap:8, padding:"7px 12px", fontSize:12 }} onClick={() => nav("profile")}>
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M9 2L4 7l5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
        Back to Profile
      </button>

      <div style={{ marginBottom: isMob ? 20 : 32 }}>
        <h1 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize: isMob ? 28 : 36, fontWeight:700, marginBottom:4 }}>Submit a Film</h1>
        <p style={{ color:G.muted, fontSize:12 }}>AI-original films only. All submissions reviewed before publishing.</p>
      </div>

      {/* Step indicator */}
      <div style={{ display:"flex", gap:0, marginBottom: isMob ? 20 : 36 }}>
        {steps.map((s, i) => (
          <div key={i} onClick={() => setStep(i+1)} style={{ flex:1, cursor:"pointer" }}>
            <div style={{ height:3, borderRadius:2, background: step > i ? G.accent : G.dim, marginBottom:6, transition:"background .3s" }}/>
            {!isMob && <div style={{ fontSize:10, color: step === i+1 ? G.accent : G.muted, fontWeight: step === i+1 ? 600 : 400, letterSpacing:".06em", textTransform:"uppercase" }}>{s}</div>}
            {isMob && <div style={{ fontSize:9, color: step === i+1 ? G.accent : G.muted, fontWeight: step === i+1 ? 600 : 400 }}>{i+1}</div>}
          </div>
        ))}
      </div>

      {/* Plan bar */}
      <div style={{ background:G.card, border:`1px solid ${G.border}`, borderRadius:10, padding:"11px 16px", marginBottom:22, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
        <span style={{ fontSize:11, color:G.muted }}>
          Plan: <span style={{ color:G.text, fontWeight:500 }}>{PLANS.find(p=>p.id===(user?.plan||"free"))?.name}</span>
          <span style={{ marginLeft:10 }}>Storage: </span>
          <span style={{ color:G.text, fontWeight:500 }}>{PLANS.find(p=>p.id===(user?.plan||"free"))?.storage}</span>
        </span>
        <button className="btn-ghost" style={{ padding:"4px 10px", fontSize:10 }} onClick={() => nav("pricing")}>Upgrade</button>
      </div>

      {/* ── STEP 1: File & Media ── */}
      {step === 1 && (
        <div style={{ animation:"fadeUp .25s ease", display:"flex", flexDirection:"column", gap:20 }}>

          {/* Video file */}
          <Field label="Film File" hint="MP4 or MOV · Max 2 hours · Drag & drop or click">
            <DropZone
              label="Drop your film file here"
              hint={`MP4, MOV · Max duration: ${maxDur}`}
              accept="video/*"
              file={form.videoFile}
              onFile={f_ => f("videoFile", f_)}
              icon={<svg width="18" height="18" viewBox="0 0 20 20" fill="none"><rect x="2" y="4" width="12" height="12" rx="2" stroke={G.accent} strokeWidth="1.4"/><path d="M14 8l4-2v8l-4-2" stroke={G.accent} strokeWidth="1.4" strokeLinejoin="round"/></svg>}
            />
          </Field>

          {/* Thumbnail */}
          <Field label="Thumbnail Image" hint="JPG or PNG · Recommended 16:9 ratio">
            <div style={{ display:"grid", gridTemplateColumns: thumbPreview ? "1fr 1fr" : "1fr", gap:12 }}>
              <DropZone
                label="Drop thumbnail image"
                hint="JPG, PNG, WebP"
                accept="image/*"
                file={form.thumbFile}
                onFile={f_ => f("thumbFile", f_)}
                icon={<svg width="18" height="18" viewBox="0 0 20 20" fill="none"><rect x="2" y="3" width="16" height="14" rx="2" stroke={G.accent} strokeWidth="1.4"/><circle cx="7" cy="8" r="1.5" stroke={G.accent} strokeWidth="1.2"/><path d="M2 14l4-4 3 3 3-3 4 4" stroke={G.accent} strokeWidth="1.2" strokeLinejoin="round"/></svg>}
              />
              {thumbPreview && (
                <div style={{ borderRadius:10, overflow:"hidden", aspectRatio:"16/9", background:G.surface }}>
                  <img src={thumbPreview} alt="preview" style={{ width:"100%", height:"100%", objectFit:"cover" }}/>
                </div>
              )}
            </div>
            <div style={{ display:"flex", alignItems:"center", gap:8, marginTop:8 }}>
              <div style={{ flex:1, height:1, background:G.border }}/>
              <span style={{ fontSize:10, color:G.muted }}>or paste URL</span>
              <div style={{ flex:1, height:1, background:G.border }}/>
            </div>
            <input value={form.thumbUrl} onChange={e => f("thumbUrl", e.target.value)} placeholder="https://…" style={{ marginTop:4 }}/>
          </Field>

          {/* Audio Tracks */}
          <Field label="Dub / Audio Tracks" hint="Upload multiple language dubs. Each file = one audio track.">
            <DropZone
              label="Drop audio dub files here"
              hint="MP3, AAC, WAV · Multiple files supported"
              accept="audio/*"
              multiple
              files={form.audioTracks}
              onFiles={files => f("audioTracks", [...form.audioTracks, ...files])}
              icon={<svg width="18" height="18" viewBox="0 0 20 20" fill="none"><circle cx="10" cy="10" r="3" stroke={G.accent} strokeWidth="1.4"/><path d="M4 10a6 6 0 0012 0M2 10a8 8 0 0016 0" stroke={G.accent} strokeWidth="1.2" strokeLinecap="round"/></svg>}
            />
            {form.audioTracks.length > 0 && (
              <div style={{ display:"flex", flexDirection:"column", gap:6, marginTop:8 }}>
                {form.audioTracks.map((at, i) => (
                  <div key={i} style={{ display:"flex", alignItems:"center", gap:10, background:G.surface, borderRadius:8, padding:"8px 12px", border:`1px solid ${G.border}` }}>
                    <svg width="14" height="14" viewBox="0 0 20 20" fill="none"><circle cx="10" cy="10" r="3" stroke={G.success} strokeWidth="1.4"/><path d="M4 10a6 6 0 0012 0" stroke={G.success} strokeWidth="1.2" strokeLinecap="round"/></svg>
                    <span style={{ flex:1, fontSize:12, color:G.text, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{at.name}</span>
                    <span style={{ fontSize:10, color:G.muted, flexShrink:0 }}>{(at.size/1024/1024).toFixed(1)} MB</span>
                    <button onClick={()=>f("audioTracks",form.audioTracks.filter((_,j)=>j!==i))} style={{ background:"none", color:G.muted, fontSize:14, padding:"0 2px", flexShrink:0 }}>×</button>
                  </div>
                ))}
              </div>
            )}
          </Field>

          {/* Subtitle Files */}
          <Field label="Subtitle / Caption Files" hint="SRT, VTT, ASS files. Upload one per language.">
            <DropZone
              label="Drop subtitle files here"
              hint=".srt, .vtt, .ass · Multiple files supported"
              accept=".srt,.vtt,.ass,.ssa"
              multiple
              files={form.subtitleFiles}
              onFiles={files => f("subtitleFiles", [...form.subtitleFiles, ...files])}
              icon={<svg width="18" height="18" viewBox="0 0 20 20" fill="none"><rect x="2" y="5" width="16" height="10" rx="2" stroke={G.accent} strokeWidth="1.4"/><path d="M5 10h4M5 13h6M11 10h4" stroke={G.accent} strokeWidth="1.2" strokeLinecap="round"/></svg>}
            />
            {form.subtitleFiles.length > 0 && (
              <div style={{ display:"flex", flexDirection:"column", gap:6, marginTop:8 }}>
                {form.subtitleFiles.map((sf, i) => (
                  <div key={i} style={{ display:"flex", alignItems:"center", gap:10, background:G.surface, borderRadius:8, padding:"8px 12px", border:`1px solid ${G.border}` }}>
                    <svg width="14" height="14" viewBox="0 0 20 20" fill="none"><rect x="2" y="5" width="16" height="10" rx="2" stroke={G.success} strokeWidth="1.4"/><path d="M5 10h4M5 13h6" stroke={G.success} strokeWidth="1.2" strokeLinecap="round"/></svg>
                    <span style={{ flex:1, fontSize:12, color:G.text, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{sf.name}</span>
                    <span style={{ fontSize:10, color:G.muted, flexShrink:0 }}>{sf.name.split(".").pop().toUpperCase()}</span>
                    <button onClick={()=>f("subtitleFiles",form.subtitleFiles.filter((_,j)=>j!==i))} style={{ background:"none", color:G.muted, fontSize:14, padding:"0 2px", flexShrink:0 }}>×</button>
                  </div>
                ))}
              </div>
            )}
          </Field>

          {/* Category */}
          <Field label="Category">
            <select value={form.category} onChange={e => f("category", e.target.value)}>
              {Object.entries(CATEGORIES).map(([k,v_]) => <option key={k} value={k}>{v_}</option>)}
            </select>
            <span style={{ fontSize:11, color:G.accentDim, marginTop:4, fontFamily:"'Inter',sans-serif" }}>Max duration for this category: {maxDur}</span>
          </Field>

          {/* Storage */}
          <Field label="Storage Method">
            <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
              {STORAGE_OPTIONS.map(opt => (
                <div key={opt.id} onClick={() => f("storage", opt.id)} style={{
                  padding:"12px 14px", borderRadius:10, cursor:"pointer", transition:"all .2s",
                  background: form.storage === opt.id ? `${G.accent}0e` : G.surface,
                  border:`1px solid ${form.storage === opt.id ? G.accent : G.border}`,
                  display:"flex", gap:12, alignItems:"center",
                }}>
                  <div style={{ width:16, height:16, borderRadius:"50%", border:`2px solid ${form.storage === opt.id ? G.accent : G.dim}`, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                    {form.storage === opt.id && <div style={{ width:8, height:8, borderRadius:"50%", background:G.accent }}/>}
                  </div>
                  <div>
                    <div style={{ fontSize:13, fontWeight:600, color:G.text }}>{opt.label}</div>
                    <div style={{ fontSize:11, color:G.muted, marginTop:1 }}>{opt.sub}</div>
                  </div>
                </div>
              ))}
            </div>
          </Field>

          {form.storage === "self" && (
            <Field label="Streaming URL">
              <input placeholder="https://yourserver.com/film.mp4" />
            </Field>
          )}

          <div style={{ display:"flex", justifyContent:"flex-end" }}>
            <button className="btn-primary" onClick={() => setStep(2)}>Continue</button>
          </div>
        </div>
      )}

      {/* ── STEP 2: Film Details ── */}
      {step === 2 && (
        <div style={{ animation:"fadeUp .25s ease", display:"flex", flexDirection:"column", gap:22 }}>
          <Field label="Film Title *">
            <input value={form.title} onChange={e => f("title", e.target.value)} placeholder="Enter your film's title" />
          </Field>

          <Field label="Synopsis / Description *">
            <textarea rows={5} value={form.desc} onChange={e => f("desc", e.target.value)} placeholder="Describe the story, themes, and tone of your film…" style={{ resize:"vertical" }}/>
          </Field>

          <Field label="AI Tool(s) Used">
            <input value={form.aiTool} onChange={e => f("aiTool", e.target.value)} placeholder="e.g. Sora, Runway Gen-3, Kling AI, AnimateDiff…" />
          </Field>

          <Field label="AI Generation Type">
            <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
              {AI_TYPES.map(t => (
                <div key={t} onClick={() => f("aiType", t)} style={{
                  padding:"11px 14px", borderRadius:8, cursor:"pointer",
                  background: form.aiType === t ? `${G.accent}0e` : G.surface,
                  border:`1px solid ${form.aiType === t ? G.accent : G.border}`,
                  fontSize:13, color: form.aiType === t ? G.text : G.textSoft,
                  display:"flex", alignItems:"center", gap:10, transition:"all .15s",
                }}>
                  <div style={{ width:14, height:14, borderRadius:"50%", border:`2px solid ${form.aiType === t ? G.accent : G.dim}`, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                    {form.aiType === t && <div style={{ width:6, height:6, borderRadius:"50%", background:G.accent }}/>}
                  </div>
                  {t}
                </div>
              ))}
            </div>
          </Field>

          <Field label="Genres">
            <div style={{ display:"flex", flexWrap:"wrap", gap:8 }}>
              {Object.entries(CATEGORIES).map(([k,v_]) => (
                <div key={k} className={`tag-toggle${form.genre.includes(k) ? " on" : ""}`} onClick={() => toggleGenre(k)}>{v_}</div>
              ))}
            </div>
          </Field>

          <Field label="Maturity Rating">
            <select value={form.maturity} onChange={e => f("maturity", e.target.value)}>
              {MATURITY.map(m => <option key={m} value={m}>{m}</option>)}
            </select>
          </Field>

          <Field label="Language">
            <input value={form.language} onChange={e => f("language", e.target.value)} placeholder="English" />
          </Field>

          <div style={{ display:"flex", justifyContent:"space-between" }}>
            <button className="btn-ghost" onClick={() => setStep(1)}>Back</button>
            <button className="btn-primary" onClick={() => setStep(3)}>Continue</button>
          </div>
        </div>
      )}

      {/* ── STEP 3: Credits ── */}
      {step === 3 && (
        <div style={{ animation:"fadeUp .25s ease", display:"flex", flexDirection:"column", gap:22 }}>
          <Field label="Director *" hint="The creative director of the film or project lead.">
            <input value={form.director} onChange={e => f("director", e.target.value)} placeholder="Your name or studio name" />
          </Field>

          <Field label="Screenwriter / Script" hint="Human writer, AI-assisted, or procedurally generated?">
            <input value={form.writer} onChange={e => f("writer", e.target.value)} placeholder="e.g. Jane Doe / GPT-4 / Procedural" />
          </Field>

          <Field label="Production Studio">
            <input value={form.studio} onChange={e => f("studio", e.target.value)} placeholder="e.g. Independent, YourStudio Name" />
          </Field>

          <div style={{ padding:"16px 18px", background:`${G.error}0a`, border:`1px solid ${G.error}22`, borderRadius:10 }}>
            <div style={{ fontSize:12, fontWeight:600, color:G.error, marginBottom:6 }}>Content Declaration</div>
            <p style={{ fontSize:12, color:G.muted, lineHeight:1.7 }}>
              By submitting, you confirm this film is original AI-generated content, contains no prohibited material, and you hold rights to all source elements used.{" "}
              <button style={{ background:"none", color:G.accent, textDecoration:"underline", cursor:"pointer", fontSize:12 }} onClick={() => nav("rules")}>View full rules</button>
            </p>
          </div>

          <div style={{ display:"flex", justifyContent:"space-between" }}>
            <button className="btn-ghost" onClick={() => setStep(2)}>Back</button>
            <button className="btn-primary" onClick={() => setStep(4)}>Review Submission</button>
          </div>
        </div>
      )}

      {/* ── STEP 4: Review ── */}
      {step === 4 && (
        <div style={{ animation:"fadeUp .25s ease" }}>
          <div style={{ background:G.card, border:`1px solid ${G.border}`, borderRadius:14, overflow:"hidden", marginBottom:24 }}>
            {form.thumbUrl && (
              <img src={form.thumbUrl} alt="thumbnail" style={{ width:"100%", height:180, objectFit:"cover" }} />
            )}
            <div style={{ padding:"20px 24px" }}>
              <div style={{ display:"flex", gap:8, marginBottom:10, flexWrap:"wrap" }}>
                <Chip label={form.category} color={G.accent} />
                <Chip label={form.aiType} color={G.lavender} />
                <Chip label={form.maturity} color={G.muted} />
              </div>
              <h2 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:28, fontWeight:700, marginBottom:8 }}>
                {form.title || <span style={{color:G.muted}}>Untitled Film</span>}
              </h2>
              <p style={{ fontSize:13, color:G.muted, lineHeight:1.7, marginBottom:16 }}>{form.desc || "No description."}</p>
              <Divider my={16}/>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
                {[
                  ["Director",     form.director],
                  ["Screenwriter", form.writer],
                  ["Studio",       form.studio || "Independent"],
                  ["AI Tool",      form.aiTool],
                  ["Storage",      form.storage],
                  ["Language",     form.language],
                ].map(([l,v_]) => v_ && (
                  <div key={l}>
                    <div style={{ fontSize:10, color:G.muted, letterSpacing:".1em", textTransform:"uppercase", marginBottom:3 }}>{l}</div>
                    <div style={{ fontSize:13, color:G.text }}>{v_}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div style={{ display:"flex", gap:12 }}>
            <button className="btn-ghost" onClick={() => setStep(3)} disabled={uploading}>Back</button>
            <button className="btn-primary" style={{ flex:1, padding:"14px 0", opacity:uploading?0.8:1 }} onClick={submit} disabled={uploading}>
              {uploading ? (
                <span style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:10 }}>
                  <div style={{ width:16, height:16, borderRadius:"50%", border:"2px solid #ffffff44", borderTopColor:"#fff", animation:"spin .7s linear infinite" }}/>
                  Uploading… {uploadProgress}%
                </span>
              ) : "Submit for Review"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── LOGIN ─────────────────────────────────────────────────────────────────────
function LoginPage({ loginMode, setLoginMode, loginForm, setLoginForm, login, nav, notify }) {
  const v = useAnimateIn(loginMode);
  const f = (k, v_) => setLoginForm(p => ({ ...p, [k]:v_ }));
  const [step,       setStep]       = useState("form");   // form | verify
  const [verifyCode, setVerifyCode] = useState("");
  const [loading,    setLoading]    = useState(false);
  const [pendingEmail, setPendingEmail] = useState("");

  const handleRegister = async () => {
    if (!loginForm.name || !loginForm.email || !loginForm.password) return notify("Please fill all fields", "error");
    if (loginForm.password.length < 8) return notify("Password must be at least 8 characters", "error");
    setLoading(true);
    try {
      const { signUp } = await import("aws-amplify/auth");
      await signUp({
        username: loginForm.email.trim().toLowerCase(),
        password: loginForm.password,
        options: { userAttributes: {
          email: loginForm.email.trim().toLowerCase(),
          name:  loginForm.name.trim(),
        }},
      });
      setPendingEmail(loginForm.email.trim().toLowerCase());
      setStep("verify");
      notify("Verification code sent to your email!", "success");
    } catch (e) {
      notify(e.message || "Registration failed", "error");
    } finally { setLoading(false); }
  };

  const handleVerify = async () => {
    if (!verifyCode || verifyCode.length < 6) return notify("Enter the 6-digit code from your email", "error");
    setLoading(true);
    try {
      const { confirmSignUp, signIn, fetchUserAttributes } = await import("aws-amplify/auth");
      await confirmSignUp({ username: pendingEmail, confirmationCode: verifyCode.trim() });
      // Auto sign in after verify
      const result = await signIn({ username: pendingEmail, password: loginForm.password });
      if (result.isSignedIn) {
        notify("Email verified! Welcome to Lucy 🎬", "success");
        nav("home");
      }
    } catch (e) {
      notify(e.message || "Verification failed. Check your code.", "error");
    } finally { setLoading(false); }
  };

  return (
    <div style={{
      minHeight:"calc(100vh - 62px)", display:"flex", alignItems:"center", justifyContent:"center", padding:24,
      background:`radial-gradient(ellipse 60% 50% at 50% 50%, ${G.accentGlow} 0%, transparent 70%)`,
    }}>
      <div style={{ opacity:v?1:0, transform:v?"none":"translateY(16px)", transition:"all .35s", width:"100%", maxWidth:420 }}>
        <div style={{ background:G.card, border:`1px solid ${G.border}`, borderRadius:18, padding:40 }}>

          {/* VERIFY STEP */}
          {step === "verify" ? (
            <>
              <div style={{ textAlign:"center", marginBottom:28 }}>
                <div style={{ display:"flex", justifyContent:"center", marginBottom:14 }}><LucyLogo size={32}/></div>
                <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:24, fontWeight:700, marginBottom:6 }}>Check your email</div>
                <div style={{ fontSize:13, color:G.muted, lineHeight:1.6 }}>
                  We sent a 6-digit verification code to<br/>
                  <span style={{ color:G.accent }}>{pendingEmail}</span>
                </div>
              </div>
              <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
                <Field label="Verification Code">
                  <input
                    placeholder="Enter 6-digit code"
                    value={verifyCode}
                    onChange={e => setVerifyCode(e.target.value.replace(/\D/g,"").slice(0,6))}
                    style={{ letterSpacing:"0.3em", fontSize:20, textAlign:"center" }}
                    maxLength={6}
                    inputMode="numeric"
                  />
                </Field>
                <button className="btn-primary" style={{ width:"100%", padding:"13px 0", fontSize:14, opacity:loading?0.7:1 }}
                  onClick={handleVerify} disabled={loading}>
                  {loading ? "Verifying…" : "Verify & Sign In →"}
                </button>
                <div style={{ textAlign:"center", fontSize:12, color:G.muted }}>
                  Didn't get it? Check your spam folder or{" "}
                  <button style={{ background:"none", color:G.accent, cursor:"pointer", fontSize:12, border:"none" }}
                    onClick={() => { setStep("form"); setVerifyCode(""); }}>
                    go back
                  </button>
                </div>
              </div>
            </>
          ) : (
            <>
              <div style={{ textAlign:"center", marginBottom:28 }}>
                <div style={{ display:"flex", justifyContent:"center", marginBottom:14 }}><LucyLogo size={32}/></div>
                <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:26, fontWeight:700, marginBottom:4 }}>
                  {loginMode === "login" ? "Welcome Back" : "Join Lucy"}
                </div>
                <div style={{ fontSize:13, color:G.muted }}>The home of AI-original cinema</div>
              </div>

              <div style={{ display:"flex", gap:0, marginBottom:26, background:G.surface, borderRadius:8, padding:3 }}>
                {["login","signup"].map(m => (
                  <button key={m} onClick={() => setLoginMode(m)} style={{
                    flex:1, padding:"9px 0", borderRadius:6, fontWeight:600, fontSize:12,
                    background: loginMode === m ? G.card : "transparent",
                    color: loginMode === m ? G.text : G.muted,
                    boxShadow: loginMode === m ? "0 2px 10px #0005" : "none",
                  }}>
                    {m === "login" ? "Sign In" : "Register"}
                  </button>
                ))}
              </div>

              <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
                {loginMode === "signup" && (
                  <Field label="Display Name">
                    <input placeholder="Your filmmaker name" value={loginForm.name} onChange={e => f("name", e.target.value)} autoComplete="name"/>
                  </Field>
                )}
                <Field label="Email">
                  <input type="email" placeholder="you@example.com" value={loginForm.email} onChange={e => f("email", e.target.value)} autoComplete="email"/>
                </Field>
                <Field label="Password">
                  <input type="password" placeholder="••••••••" value={loginForm.password} onChange={e => f("password", e.target.value)} autoComplete={loginMode === "login" ? "current-password" : "new-password"}/>
                </Field>
                <button className="btn-primary" style={{ marginTop:6, width:"100%", padding:"13px 0", fontSize:14, opacity:loading?0.7:1 }}
                  onClick={loginMode === "login" ? login : handleRegister} disabled={loading}>
                  {loading ? "Please wait…" : loginMode === "login" ? "Sign In →" : "Create Account →"}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── ADMIN ─────────────────────────────────────────────────────────────────────
function AdminPage({ movies, adminTab, setAdminTab, approveMovie, removeMovie, isMob }) {
  const v = useAnimateIn(adminTab);
  const pending  = movies.filter(m => m.status === "pending");
  const approved = movies.filter(m => m.status === "approved");
  const list     = adminTab === "pending" ? pending : approved;
  const pad = isMob ? "16px 16px 100px" : "36px 48px 80px";

  return (
    <div style={{ opacity:v?1:0, transition:"opacity .4s", padding:pad, maxWidth:1100, margin:"0 auto" }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:24, flexWrap:"wrap", gap:12 }}>
        <div>
          <h1 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize: isMob ? 28 : 36, fontWeight:700, marginBottom:4 }}>Admin Panel</h1>
          <p style={{ color:G.muted, fontSize:12 }}>Review and manage all submitted content.</p>
        </div>
        <Chip label="Unlimited Storage" color={G.success} />
      </div>

      {/* Stats */}
      <div style={{ display:"grid", gridTemplateColumns: isMob ? "1fr 1fr" : "repeat(4,1fr)", gap:10, marginBottom:24 }}>
        {[
          { label:"Total Films",    value:movies.length },
          { label:"Pending",        value:pending.length,  color:G.gold },
          { label:"Approved",       value:approved.length, color:G.success },
          { label:"Total Views",    value:movies.reduce((a,m) => a + (parseFloat(m.views) || 0), 0).toFixed(1) + "M" },
        ].map(s => (
          <div key={s.label} style={{ background:G.card, border:`1px solid ${G.border}`, borderRadius:10, padding:"14px 16px" }}>
            <div style={{ fontSize: isMob ? 22 : 28, fontWeight:800, color:s.color || G.accent, fontFamily:"'Syne',sans-serif", marginBottom:2 }}>{s.value}</div>
            <div style={{ fontSize:11, color:G.muted }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div style={{ display:"flex", gap:0, marginBottom:20, background:G.surface, borderRadius:8, padding:3, width:"fit-content" }}>
        {[
          { id:"pending",  label:`Pending (${pending.length})` },
          { id:"approved", label:`Approved (${approved.length})` },
        ].map(t => (
          <button key={t.id} onClick={() => setAdminTab(t.id)} style={{
            padding: isMob ? "8px 14px" : "9px 20px", borderRadius:6, fontWeight:600, fontSize:12,
            background: adminTab === t.id ? G.card : "transparent",
            color: adminTab === t.id ? G.text : G.muted,
          }}>
            {t.label}
          </button>
        ))}
      </div>

      <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
        {!list.length && (
          <div style={{ textAlign:"center", padding:"48px 0", color:G.muted }}>
            <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:26, color:G.dim, marginBottom:8 }}>
              {adminTab === "pending" ? "All clear" : "No films"}
            </div>
            <div style={{ fontSize:13 }}>{adminTab === "pending" ? "No pending submissions." : "Nothing approved yet."}</div>
          </div>
        )}
        {list.map(m => (
          <div key={m.id} style={{ background:G.card, border:`1px solid ${G.border}`, borderRadius:12, padding: isMob ? 12 : 18, display:"flex", gap: isMob ? 10 : 18, alignItems: isMob ? "flex-start" : "center", flexDirection: isMob ? "column" : "row" }}>
            <div style={{ display:"flex", gap:10, alignItems:"flex-start", width:"100%" }}>
              <img src={m.thumb} alt={m.title} style={{ width: isMob ? 80 : 120, height: isMob ? 46 : 68, objectFit:"cover", borderRadius:7, flexShrink:0 }}/>
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ display:"flex", gap:6, marginBottom:5, flexWrap:"wrap", alignItems:"center" }}>
                  <span style={{ fontWeight:700, fontSize: isMob ? 13 : 15, color:G.text }}>{m.title}</span>
                  <Chip label={m.category} color={G.accent} small />
                  {m.status === "pending" && <Chip label="Pending" color={G.gold} small />}
                </div>
                <p style={{ color:G.muted, fontSize:11, lineHeight:1.6, marginBottom:5, display:"-webkit-box", WebkitLineClamp:2, WebkitBoxOrient:"vertical", overflow:"hidden" }}>{m.desc}</p>
                <div style={{ display:"flex", gap:10, fontSize:10, color:G.muted, flexWrap:"wrap" }}>
                  <span>By {m.uploader}</span>
                  {m.director && <span>Dir. {m.director}</span>}
                </div>
              </div>
            </div>
            <div style={{ display:"flex", gap:8, flexShrink:0, alignSelf: isMob ? "stretch" : "center" }}>
              {adminTab === "pending" && (
                <button className="btn-primary" style={{ padding:"8px 16px", fontSize:12, flex: isMob ? 1 : 0 }} onClick={() => approveMovie(m.id)}>Approve</button>
              )}
              <button style={{
                background:`${G.error}15`, color:G.error, border:`1px solid ${G.error}30`,
                borderRadius:8, padding:"8px 16px", fontSize:12, fontWeight:600, flex: isMob ? 1 : 0,
              }} onClick={() => removeMovie(m.id)}>Remove</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── PRICING ──────────────────────────────────────────────────────────────────
function PricingPage({ user, nav, isMob }) {
  const v = useAnimateIn(0);
  const pad = isMob ? "28px 16px 100px" : "48px 40px 80px";
  return (
    <div style={{ opacity:v?1:0, transition:"opacity .4s", padding:pad, maxWidth:960, margin:"0 auto", textAlign:"center" }}>
      <div style={{ marginBottom: isMob ? 28 : 48 }}>
        <Chip label="Plans & Pricing" color={G.accent} />
        <h1 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"clamp(24px,5vw,46px)", fontWeight:700, margin:"14px 0 8px" }}>
          Choose Your Creator Tier
        </h1>
        <p style={{ color:G.muted, fontSize:13, maxWidth:400, margin:"0 auto" }}>Increase storage and upload limits as your catalog grows.</p>
      </div>

      <div style={{ display:"grid", gridTemplateColumns: isMob ? "1fr 1fr" : "repeat(auto-fit,minmax(200px,1fr))", gap: isMob ? 10 : 20, marginBottom: isMob ? 28 : 48 }}>
        {PLANS.map((plan) => {
          const isCurrent = user?.plan === plan.id;
          const isPro = plan.id === "pro";
          return (
            <div key={plan.id} style={{
              background:G.card, border:`2px solid ${isPro ? G.accent : G.border}`,
              borderRadius:12, padding: isMob ? "18px 14px" : "28px 22px", position:"relative",
              boxShadow: isPro ? `0 0 40px ${G.accentGlow}` : "none",
            }}>
              {isPro && (
                <div style={{ position:"absolute", top:-11, left:"50%", transform:"translateX(-50%)", background:G.accent, color:"#fff", fontSize:9, fontWeight:700, padding:"3px 10px", borderRadius:20, letterSpacing:".08em", textTransform:"uppercase", whiteSpace:"nowrap" }}>
                  Most Popular
                </div>
              )}
              <Chip label={plan.name} color={plan.color} />
              <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize: isMob ? 28 : 38, fontWeight:700, margin:"10px 0 2px", color: isPro ? G.accent : G.text }}>
                {plan.price === 0 ? "Free" : `$${plan.price}`}
                {plan.price > 0 && <span style={{ fontSize:12, color:G.muted, fontWeight:400 }}>/mo</span>}
              </div>
              <Divider my={12} />
              <div style={{ fontSize: isMob ? 11 : 13, color:G.muted, lineHeight:2, textAlign:"left", marginBottom:16 }}>
                <div style={{ color:G.textSoft }}>{plan.storage}</div>
                <div style={{ color:G.textSoft }}>{plan.uploads === 999 ? "∞" : plan.uploads} uploads</div>
                {!isMob && <div>AI-original only</div>}
                <div>{plan.id === "free" ? "480p" : "4K"}</div>
                {plan.id !== "free" && <div style={{ color:G.textSoft }}>Priority review</div>}
              </div>
              <button className={isPro ? "btn-primary" : "btn-ghost"} style={{ width:"100%", padding: isMob ? "9px 0" : "11px 0", fontSize:12 }} onClick={() => !user && nav("login")}>
                {isCurrent ? "Current" : plan.price === 0 ? "Start Free" : "Subscribe"}
              </button>
            </div>
          );
        })}
      </div>

      <div style={{ background:G.card, border:`1px solid ${G.border}`, borderRadius:12, padding: isMob ? "16px" : "20px 28px", display:"flex", gap: isMob ? 12 : 28, flexWrap:"wrap", justifyContent:"center" }}>
        {["Stripe payments","Cancel anytime","Instant activation","Admin support"].map(t => (
          <div key={t} style={{ fontSize:11, color:G.muted, display:"flex", alignItems:"center", gap:6 }}>
            <div style={{ width:4, height:4, borderRadius:"50%", background:G.accent, flexShrink:0 }}/>
            {t}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── RULES ────────────────────────────────────────────────────────────────────
function RulesPage({ isMob }) {
  const v = useAnimateIn(0);
  const pad = isMob ? "24px 16px 100px" : "48px 48px 80px";
  return (
    <div style={{ opacity:v?1:0, transition:"opacity .4s", padding:pad, maxWidth:700, margin:"0 auto" }}>
      <div style={{ marginBottom:28 }}>
        <Chip label="Community Guidelines" color={G.error} />
        <h1 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"clamp(22px,5vw,42px)", fontWeight:700, margin:"14px 0 8px" }}>
          Content Policy
        </h1>
        <p style={{ color:G.muted, fontSize:13, lineHeight:1.7 }}>
          All content on Lucy must comply with the following. Violations result in immediate removal and potential account termination.
        </p>
      </div>

      {RULES.map((rule, i) => (
        <div key={i} style={{ display:"flex", gap:12, padding:"16px 0", borderBottom:`1px solid ${G.border}`, animation:`fadeUp .3s ${i * 0.04}s both` }}>
          <div style={{
            width:26, height:26, borderRadius:6,
            background:`${G.accent}15`, border:`1px solid ${G.accent}25`,
            display:"flex", alignItems:"center", justifyContent:"center",
            color:G.accent, fontWeight:700, fontSize:11, flexShrink:0,
            fontFamily:"'Syne',sans-serif",
          }}>{i + 1}</div>
          <p style={{ color:G.textSoft, lineHeight:1.75, fontSize: isMob ? 13 : 14, paddingTop:2 }}>{rule}</p>
        </div>
      ))}

      <div style={{ marginTop:28, padding:"16px 18px", background:`${G.info}0a`, border:`1px solid ${G.info}22`, borderRadius:10 }}>
        <div style={{ fontWeight:600, color:G.info, fontSize:12, marginBottom:5 }}>Admin Authority</div>
        <p style={{ color:G.muted, fontSize:12, lineHeight:1.75 }}>
          Admins hold final authority on all content decisions. Approved content may be retroactively removed if violations are discovered. Storage associated with removed content is purged after a 30-day grace period.
        </p>
      </div>
    </div>
  );
}

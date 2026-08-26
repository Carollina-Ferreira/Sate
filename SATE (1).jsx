import React, { useState, useRef } from "react";
import {
  LayoutDashboard, Users, UserRound, Video, Trophy, BarChart3, GitCompare, Settings,
  Search, Bell, ChevronRight, Plus, Play, Pause, Flag, Target, ShieldAlert, Footprints,
  Zap, MessageSquarePlus, Scissors, Save, TrendingUp, TrendingDown, ArrowLeft, Eye,
  Filter, Calendar, Activity, ImagePlus, Palette, ChevronDown, LogOut, X, Hash,
  Pencil, Film, Star, ListChecks, SlidersHorizontal
} from "lucide-react";
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend, RadarChart, PolarGrid, PolarAngleAxis, Radar
} from "recharts";

const C = {
  green: "#16A875", greenDark: "#0F8C63", greenLight: "#E4F6EF",
  pink: "#EF476F", pinkDark: "#B0345A", pinkLight: "#FDEAEF",
  red: "#D52941", redLight: "#FBEAEE",
  blue: "#4EA5D9", blueDark: "#1E6E9E", blueLight: "#E9F5FC",
  ink: "#122A22", muted: "#6C7C77", border: "#E6EEEA", bg: "#F6F9F7",
};

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700;800&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@500;600&display=swap');
  .sate * { box-sizing: border-box; }
  .sate { font-family: 'Inter', sans-serif; color: ${C.ink}; background: ${C.bg}; }
  .sate h1, .sate h2, .sate h3, .sate .display { font-family: 'Sora', sans-serif; }
  .sate .mono { font-family: 'JetBrains Mono', monospace; }
  .sate .card { background: #fff; border: 1px solid ${C.border}; border-radius: 18px; box-shadow: 0 1px 2px rgba(18,42,34,0.04), 0 8px 24px rgba(18,42,34,0.03); }
  .sate .btn-primary { background: ${C.green}; color: #fff; border: none; border-radius: 12px; font-weight: 600; padding: 11px 20px; cursor: pointer; display: inline-flex; align-items: center; gap: 8px; font-size: 14px; transition: background .15s ease; }
  .sate .btn-primary:hover { background: ${C.greenDark}; }
  .sate .btn-blue { background: ${C.blue}; color: #fff; border: none; border-radius: 12px; font-weight: 600; padding: 11px 20px; cursor: pointer; display: inline-flex; align-items: center; gap: 8px; font-size: 14px; }
  .sate .btn-blue:hover { background: ${C.blueDark}; }
  .sate .btn-pink { background: ${C.pink}; color: #fff; border: none; border-radius: 12px; font-weight: 600; padding: 11px 20px; cursor: pointer; display: inline-flex; align-items: center; gap: 8px; font-size: 14px; }
  .sate .btn-pink:hover { background: ${C.pinkDark}; }
  .sate .btn-outline { background: #fff; color: ${C.ink}; border: 1px solid ${C.border}; border-radius: 12px; font-weight: 600; padding: 10px 16px; cursor: pointer; display: inline-flex; align-items: center; gap: 8px; font-size: 14px; }
  .sate .btn-outline:hover { border-color: ${C.green}; color: ${C.green}; }
  .sate .navitem { display: flex; align-items: center; gap: 12px; padding: 11px 16px; border-radius: 12px; color: rgba(255,255,255,0.68); font-size: 14px; font-weight: 500; cursor: pointer; transition: all .15s ease; }
  .sate .navitem:hover { background: rgba(255,255,255,0.06); color: #fff; }
  .sate .navitem.active { background: ${C.green}; color: #fff; }
  .sate .pill { display: inline-flex; align-items: center; gap: 6px; padding: 4px 12px; border-radius: 999px; font-size: 12px; font-weight: 600; }
  .sate .scrollbar-thin::-webkit-scrollbar { height: 6px; width: 6px; }
  .sate .scrollbar-thin::-webkit-scrollbar-thumb { background: ${C.border}; border-radius: 4px; }
  .sate input, .sate select, .sate textarea { font-family: 'Inter', sans-serif; border: 1px solid ${C.border}; border-radius: 10px; padding: 10px 14px; font-size: 14px; outline: none; background: #fff; color: ${C.ink}; }
  .sate input:focus, .sate select:focus, .sate textarea:focus { border-color: ${C.green}; }
  .sate table { border-collapse: collapse; width: 100%; }
  .sate th { text-align: left; font-size: 12px; text-transform: uppercase; letter-spacing: .04em; color: ${C.muted}; font-weight: 600; padding: 10px 14px; border-bottom: 1px solid ${C.border}; }
  .sate td { padding: 14px; font-size: 14px; border-bottom: 1px solid ${C.border}; }
  .sate tr:last-child td { border-bottom: none; }
  .sate .avatar { border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 700; color: #fff; flex-shrink: 0; }
  .sate .athlete-card { position: relative; overflow: hidden; }
  .sate .athlete-card .overlay { position: absolute; inset: 0; background: rgba(14,42,34,0.86); opacity: 0; transition: opacity .16s ease; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 8px; padding: 14px; }
  .sate .athlete-card:hover .overlay { opacity: 1; }
  .sate .overlay-btn { width: 100%; background: rgba(255,255,255,0.1); color: #fff; border: 1px solid rgba(255,255,255,0.25); border-radius: 10px; padding: 8px 10px; font-size: 12px; font-weight: 600; display: flex; align-items: center; justify-content: center; gap: 6px; cursor: pointer; }
  .sate .overlay-btn:hover { background: ${C.green}; border-color: ${C.green}; }
  .sate .eval-btn { display: flex; flex-direction: column; align-items: center; gap: 6px; padding: 12px 6px; border-radius: 12px; cursor: pointer; border: 1.5px solid ${C.border}; background: #fff; font-size: 12px; font-weight: 600; transition: all .15s ease; }
  .sate .panel-overlay { position: fixed; inset: 0; background: rgba(14,42,34,0.4); z-index: 60; display: flex; justify-content: flex-end; }
  .sate .panel { width: 440px; max-width: 92vw; height: 100%; background: #fff; padding: 26px; overflow-y: auto; }
`;

const jerseyOf = (id) => 4 + (id * 7) % 90;

const teams = [
  { id: 1, name: "Falcões FC", sport: "Futebol", athletes: 22, color: C.green, performance: 78, trend: 4, record: "8V · 2E · 1D", founded: 2018 },
  { id: 2, name: "Águias Basquete", sport: "Basquete", athletes: 14, color: C.blue, performance: 65, trend: -2, record: "12V · 4D", founded: 2020 },
  { id: 3, name: "Fúria Vôlei", sport: "Vôlei", athletes: 12, color: C.pink, performance: 82, trend: 6, record: "9V · 1D", founded: 2019 },
  { id: 4, name: "Leões Rugby", sport: "Rugby", athletes: 18, color: C.red, performance: 58, trend: 1, record: "5V · 5D", founded: 2021 },
];

const athletes = [
  { id: 1, name: "Rafael Souza", team: "Falcões FC", sport: "Futebol", position: "Atacante", age: 24, performance: 88, initials: "RS", color: C.green },
  { id: 2, name: "Bruno Alves", team: "Falcões FC", sport: "Futebol", position: "Meio-campo", age: 27, performance: 74, initials: "BA", color: C.green },
  { id: 3, name: "Carla Mendes", team: "Águias Basquete", sport: "Basquete", position: "Armadora", age: 22, performance: 91, initials: "CM", color: C.blue },
  { id: 4, name: "Diego Ramos", team: "Águias Basquete", sport: "Basquete", position: "Pivô", age: 29, performance: 69, initials: "DR", color: C.blue },
  { id: 5, name: "Fernanda Lima", team: "Fúria Vôlei", sport: "Vôlei", position: "Levantadora", age: 21, performance: 85, initials: "FL", color: C.pink },
  { id: 6, name: "Gustavo Pires", team: "Leões Rugby", sport: "Rugby", position: "Pilar", age: 30, performance: 61, initials: "GP", color: C.red },
  { id: 7, name: "Helena Costa", team: "Fúria Vôlei", sport: "Vôlei", position: "Oposta", age: 23, performance: 79, initials: "HC", color: C.pink },
  { id: 8, name: "Igor Tavares", team: "Falcões FC", sport: "Futebol", position: "Zagueiro", age: 26, performance: 70, initials: "IT", color: C.green },
];

const matches = [
  { id: 1, teamA: "Falcões FC", teamB: "Tigres FC", scoreA: 3, scoreB: 1, date: "18/08/2026", sport: "Futebol", status: "Analisada" },
  { id: 2, teamA: "Águias Basquete", teamB: "Panteras BB", scoreA: 88, scoreB: 76, date: "15/08/2026", sport: "Basquete", status: "Analisada" },
  { id: 3, teamA: "Fúria Vôlei", teamB: "Ventania Vôlei", scoreA: 3, scoreB: 2, date: "12/08/2026", sport: "Vôlei", status: "Em análise" },
  { id: 4, teamA: "Leões Rugby", teamB: "Touros Rugby", scoreA: 21, scoreB: 24, date: "09/08/2026", sport: "Rugby", status: "Pendente" },
  { id: 5, teamA: "Falcões FC", teamB: "Cobras FC", scoreA: 2, scoreB: 2, date: "02/08/2026", sport: "Futebol", status: "Analisada" },
];

const activities = [
  { icon: Video, text: "Vídeo Falcões FC x Tigres FC analisado", time: "há 2 horas", color: C.green },
  { icon: Trophy, text: "Nova partida Fúria Vôlei x Ventania adicionada", time: "há 5 horas", color: C.pink },
  { icon: UserRound, text: "Perfil de Carla Mendes atualizado", time: "ontem", color: C.blue },
  { icon: BarChart3, text: "Estatística de aproveitamento criada", time: "ontem", color: C.red },
];

const perfTrend = [
  { partida: "P1", equipe: 62, adversario: 55 }, { partida: "P2", equipe: 68, adversario: 60 },
  { partida: "P3", equipe: 65, adversario: 63 }, { partida: "P4", equipe: 74, adversario: 58 },
  { partida: "P5", equipe: 71, adversario: 66 }, { partida: "P6", equipe: 78, adversario: 61 },
  { partida: "P7", equipe: 82, adversario: 64 },
];

const ACTION_TYPES_BY_SPORT = {
  Futebol: ["Gol", "Passe", "Assistência", "Finalização", "Defesa", "Roubo de bola", "Contra-ataque", "Falta", "Erro", "Outro"],
  Basquete: ["Ponto", "Assistência", "Rebote", "Roubo de bola", "Bloqueio", "Erro", "Outro"],
  "Vôlei": ["Ponto", "Ataque", "Bloqueio", "Levantamento", "Erro", "Outro"],
  Rugby: ["Try", "Passe", "Tackle", "Erro", "Outro"],
};

const ACTION_ICONS = {
  Gol: Target, Ponto: Target, Try: Target, Passe: Footprints, Assistência: Footprints,
  Finalização: Zap, Ataque: Zap, "Contra-ataque": TrendingUp, Defesa: ShieldAlert,
  Rebote: ShieldAlert, Bloqueio: ShieldAlert, Tackle: ShieldAlert, "Roubo de bola": ShieldAlert,
  Levantamento: Footprints, Falta: Flag, Erro: Flag, Outro: MessageSquarePlus,
};

const EVALUATIONS = [
  { key: "boa", label: "Boa", color: C.green, bg: C.greenLight },
  { key: "ruim", label: "Ruim", color: C.red, bg: C.redLight },
  { key: "neutra", label: "Neutra", color: C.blue, bg: C.blueLight },
  { key: "destaque", label: "Destaque", color: C.pink, bg: C.pinkLight },
];
const evalOf = (key) => EVALUATIONS.find(e => e.key === key) || EVALUATIONS[2];

const initialActions = [
  { id: 1, matchId: 1, athleteId: 1, action: "Gol", evaluation: "boa", time: "04:12", note: "Finalização no ângulo", hasClip: true, clipTitle: "Gol de Rafael Souza", start: 3, end: 5, duration: 2 },
  { id: 2, matchId: 1, athleteId: 2, action: "Erro", evaluation: "ruim", time: "11:35", note: "Perda de bola no meio", hasClip: false },
  { id: 3, matchId: 1, athleteId: 1, action: "Finalização", evaluation: "destaque", time: "18:02", note: "Jogada individual pela direita", hasClip: false },
  { id: 4, matchId: 1, athleteId: 8, action: "Falta", evaluation: "neutra", time: "23:47", note: "Falta tática", hasClip: false },
  { id: 5, matchId: 1, athleteId: 2, action: "Assistência", evaluation: "boa", time: "31:10", note: "Assistência para o 2º gol", hasClip: true, clipTitle: "Assistência de Bruno Alves", start: 30, end: 32, duration: 2 },
  { id: 6, matchId: 1, athleteId: 1, action: "Contra-ataque", evaluation: "destaque", time: "39:20", note: "Contra-ataque decisivo e finalização precisa", hasClip: true, clipTitle: "Contra-ataque decisivo", start: 38, end: 41, duration: 3 },
  { id: 7, matchId: 2, athleteId: 3, action: "Assistência", evaluation: "boa", time: "06:40", note: "Passe entre linhas", hasClip: false },
  { id: 8, matchId: 2, athleteId: 4, action: "Erro", evaluation: "ruim", time: "14:05", note: "Passe interceptado", hasClip: false },
  { id: 9, matchId: 2, athleteId: 3, action: "Ponto", evaluation: "destaque", time: "22:18", note: "Cesta de 3 pontos decisiva", hasClip: true, clipTitle: "Triplo de Carla Mendes", start: 21, end: 23, duration: 2 },
  { id: 10, matchId: 3, athleteId: 5, action: "Levantamento", evaluation: "boa", time: "09:12", note: "Levantamento preciso para ataque", hasClip: false },
  { id: 11, matchId: 3, athleteId: 7, action: "Ataque", evaluation: "destaque", time: "16:30", note: "Cortada no meio de bloqueio duplo", hasClip: true, clipTitle: "Cortada de Helena Costa", start: 16, end: 18, duration: 2 },
  { id: 12, matchId: 3, athleteId: 5, action: "Erro", evaluation: "ruim", time: "27:55", note: "Erro de levantamento", hasClip: false },
];

function initials2(name) { return name.split(" ").map(p => p[0]).slice(0, 2).join("").toUpperCase(); }

function Avatar({ label, size = 40, color, style }) {
  return <div className="avatar" style={{ width: size, height: size, background: color || C.green, fontSize: size * 0.36, ...style }}>{label}</div>;
}

function StatusBadge({ status }) {
  const map = {
    "Analisada": { bg: C.greenLight, fg: C.greenDark },
    "Em análise": { bg: C.blueLight, fg: C.blueDark },
    "Pendente": { bg: C.pinkLight, fg: C.pinkDark },
  };
  const s = map[status] || map["Pendente"];
  return <span className="pill" style={{ background: s.bg, color: s.fg }}>{status}</span>;
}

function EvalBadge({ evalKey }) {
  const e = evalOf(evalKey);
  return <span className="pill" style={{ background: e.bg, color: e.color }}><span style={{ width: 6, height: 6, borderRadius: "50%", background: e.color }} />{e.label}</span>;
}

function TrendTag({ value }) {
  const up = value >= 0;
  return (
    <span className="pill" style={{ background: up ? C.greenLight : C.redLight, color: up ? C.greenDark : C.red }}>
      {up ? <TrendingUp size={12} /> : <TrendingDown size={12} />}{up ? "+" : ""}{value}%
    </span>
  );
}

function Topbar({ title, subtitle, user }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "22px 32px", borderBottom: `1px solid ${C.border}`, background: "#fff" }}>
      <div>
        <h1 className="display" style={{ fontSize: 22, fontWeight: 700, margin: 0 }}>{title}</h1>
        {subtitle && <p style={{ margin: "4px 0 0", color: C.muted, fontSize: 14 }}>{subtitle}</p>}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
        <div style={{ position: "relative" }}>
          <Search size={16} color={C.muted} style={{ position: "absolute", left: 12, top: 11 }} />
          <input placeholder="Pesquisar atletas, equipes, partidas..." style={{ width: 280, paddingLeft: 36 }} />
        </div>
        <div style={{ position: "relative", cursor: "pointer" }}>
          <Bell size={20} color={C.ink} />
          <span style={{ position: "absolute", top: -2, right: -2, width: 8, height: 8, borderRadius: "50%", background: C.pink, border: "2px solid #fff" }} />
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}>
          <Avatar label={user.initials} size={36} color={C.green} />
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, lineHeight: 1.2 }}>{user.name}</div>
            <div style={{ fontSize: 12, color: C.muted }}>{user.role}</div>
          </div>
          <ChevronDown size={14} color={C.muted} />
        </div>
      </div>
    </div>
  );
}

const NAV = [
  { key: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { key: "teams", label: "Equipes", icon: Users },
  { key: "athletes", label: "Atletas", icon: UserRound },
  { key: "video", label: "Análise de Vídeos", icon: Video },
  { key: "matches", label: "Partidas", icon: Trophy },
  { key: "stats", label: "Estatísticas", icon: BarChart3 },
  { key: "compare", label: "Comparações", icon: GitCompare },
  { key: "settings", label: "Configurações", icon: Settings },
];

function Sidebar({ view, setView, onLogout }) {
  const topLevel = ["teamDetail"].includes(view) ? "teams" : ["athleteDetail"].includes(view) ? "athletes" : ["matchDetail"].includes(view) ? "matches" : view;
  return (
    <div style={{ width: 244, minWidth: 244, background: "#0E2A22", height: "100vh", position: "sticky", top: 0, display: "flex", flexDirection: "column", padding: "22px 14px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "6px 10px 26px" }}>
        <div style={{ width: 38, height: 38, borderRadius: 11, background: C.green, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Activity size={20} color="#fff" strokeWidth={2.5} />
        </div>
        <div>
          <div className="display" style={{ color: "#fff", fontWeight: 800, fontSize: 17, letterSpacing: ".02em" }}>SATE</div>
          <div style={{ color: "rgba(255,255,255,0.45)", fontSize: 10.5, fontWeight: 500 }}>Análise Esportiva</div>
        </div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 3, flex: 1 }}>
        {NAV.map(item => (
          <div key={item.key} className={`navitem ${topLevel === item.key ? "active" : ""}`} onClick={() => setView(item.key)}>
            <item.icon size={18} />{item.label}
          </div>
        ))}
      </div>
      <div style={{ borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: 14 }}>
        <div className="navitem" onClick={onLogout}><LogOut size={18} />Sair</div>
      </div>
    </div>
  );
}

function SidePanel({ title, accent, onClose, children }) {
  return (
    <div className="panel-overlay" onClick={onClose}>
      <div className="panel" onClick={e => e.stopPropagation()}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 34, height: 34, borderRadius: 10, background: `${accent}1A`, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <SlidersHorizontal size={16} color={accent} />
            </div>
            <h3 style={{ fontSize: 16.5, fontWeight: 700, margin: 0 }}>{title}</h3>
          </div>
          <X size={19} style={{ cursor: "pointer", color: C.muted }} onClick={onClose} />
        </div>
        {children}
      </div>
    </div>
  );
}

function AthletePicker({ roster, value, onChange }) {
  const [q, setQ] = useState("");
  const filtered = roster.filter(a => a.name.toLowerCase().includes(q.toLowerCase()));
  return (
    <div>
      <div style={{ position: "relative", marginBottom: 8 }}>
        <Search size={14} color={C.muted} style={{ position: "absolute", left: 11, top: 12 }} />
        <input placeholder="Pesquisar atleta..." value={q} onChange={e => setQ(e.target.value)} style={{ width: "100%", paddingLeft: 32 }} />
      </div>
      <div className="scrollbar-thin" style={{ display: "flex", flexDirection: "column", gap: 6, maxHeight: 160, overflowY: "auto" }}>
        {filtered.map(a => (
          <div key={a.id} onClick={() => onChange(a)}
            style={{ display: "flex", alignItems: "center", gap: 10, padding: "7px 9px", borderRadius: 10, cursor: "pointer", border: `1.5px solid ${value?.id === a.id ? C.green : "transparent"}`, background: value?.id === a.id ? C.greenLight : C.bg }}>
            <Avatar label={a.initials} size={28} color={a.color} style={{ fontSize: 10.5 }} />
            <div>
              <div style={{ fontSize: 12.5, fontWeight: 600 }}>{a.name}</div>
              <div style={{ fontSize: 11, color: C.muted }}>{a.position}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function EvaluationPicker({ value, onChange }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 8 }}>
      {EVALUATIONS.map(e => (
        <div key={e.key} className="eval-btn" onClick={() => onChange(e.key)}
          style={{ borderColor: value === e.key ? e.color : C.border, background: value === e.key ? e.bg : "#fff", color: value === e.key ? e.color : C.ink }}>
          <span style={{ width: 10, height: 10, borderRadius: "50%", background: e.color }} />
          {e.label}
        </div>
      ))}
    </div>
  );
}

function FieldLabel({ children }) {
  return <div style={{ fontSize: 12.5, fontWeight: 700, margin: "16px 0 8px" }}>{children}</div>;
}

function RegisterActionPanel({ match, presetAction, onClose, onSave }) {
  const roster = athletes.filter(a => a.team === match.teamA || a.team === match.teamB);
  const [athlete, setAthlete] = useState(null);
  const [action, setAction] = useState(presetAction || "");
  const [evaluation, setEvaluation] = useState("");
  const [note, setNote] = useState("");
  const actionOptions = ACTION_TYPES_BY_SPORT[match.sport] || ACTION_TYPES_BY_SPORT.Futebol;
  const valid = athlete && action && evaluation;
  return (
    <SidePanel title="Registrar ação" accent={C.blue} onClose={onClose}>
      <FieldLabel>Quem realizou a ação?</FieldLabel>
      <AthletePicker roster={roster} value={athlete} onChange={setAthlete} />

      <FieldLabel>Qual foi a ação?</FieldLabel>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
        {actionOptions.map(opt => (
          <span key={opt} onClick={() => setAction(opt)} className="pill"
            style={{ cursor: "pointer", background: action === opt ? C.blueLight : C.bg, color: action === opt ? C.blueDark : C.muted, border: `1px solid ${action === opt ? C.blue : C.border}`, padding: "7px 13px" }}>
            {opt}
          </span>
        ))}
      </div>

      <FieldLabel>Como foi essa ação?</FieldLabel>
      <EvaluationPicker value={evaluation} onChange={setEvaluation} />

      <FieldLabel>Observação</FieldLabel>
      <textarea rows={3} placeholder="Escreva um comentário sobre a jogada..." value={note} onChange={e => setNote(e.target.value)} style={{ width: "100%", resize: "vertical" }} />

      {!valid && <div style={{ fontSize: 12, color: C.muted, marginTop: 14 }}>Selecione o atleta, a ação e a avaliação para salvar.</div>}
      <button className="btn-blue" disabled={!valid} style={{ width: "100%", justifyContent: "center", marginTop: 18, opacity: valid ? 1 : 0.5, cursor: valid ? "pointer" : "not-allowed" }}
        onClick={() => valid && onSave({ athleteId: athlete.id, action, evaluation, note, time: "—:—" })}>
        <Save size={15} /> Salvar ação
      </button>
    </SidePanel>
  );
}

function CreateClipPanel({ match, onClose, onSave }) {
  const roster = athletes.filter(a => a.team === match.teamA || a.team === match.teamB);
  const [title, setTitle] = useState("");
  const [athlete, setAthlete] = useState(null);
  const [action, setAction] = useState("");
  const [evaluation, setEvaluation] = useState("");
  const [note, setNote] = useState("");
  const [start, setStart] = useState(10);
  const [end, setEnd] = useState(14);
  const actionOptions = ACTION_TYPES_BY_SPORT[match.sport] || ACTION_TYPES_BY_SPORT.Futebol;
  const valid = title && athlete && action && evaluation && end > start;
  return (
    <SidePanel title="Criar clipe" accent={C.pink} onClose={onClose}>
      <FieldLabel>Nome do clipe</FieldLabel>
      <input placeholder="Ex: Contra-ataque — 2º tempo" value={title} onChange={e => setTitle(e.target.value)} style={{ width: "100%" }} />

      <FieldLabel>Atleta responsável</FieldLabel>
      <AthletePicker roster={roster} value={athlete} onChange={setAthlete} />

      <FieldLabel>Qual foi a ação?</FieldLabel>
      <select value={action} onChange={e => setAction(e.target.value)} style={{ width: "100%" }}>
        <option value="">Selecionar ação</option>
        {actionOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
      </select>

      <FieldLabel>Como foi a ação?</FieldLabel>
      <EvaluationPicker value={evaluation} onChange={setEvaluation} />

      <FieldLabel>Observação</FieldLabel>
      <textarea rows={2} placeholder="Ex: Boa tomada de decisão e excelente execução do passe." value={note} onChange={e => setNote(e.target.value)} style={{ width: "100%", resize: "vertical" }} />

      <FieldLabel>Duração do clipe</FieldLabel>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: C.muted, marginBottom: 4 }}>
        <span>Início: <b className="mono" style={{ color: C.ink }}>{start} min</b></span>
        <span>Fim: <b className="mono" style={{ color: C.ink }}>{end} min</b></span>
        <span>Duração: <b className="mono" style={{ color: C.pink }}>{Math.max(end - start, 0)} min</b></span>
      </div>
      <input type="range" min="0" max="45" value={start} onChange={e => setStart(Math.min(Number(e.target.value), end - 1))} style={{ width: "100%", accentColor: C.pink }} />
      <input type="range" min="0" max="45" value={end} onChange={e => setEnd(Math.max(Number(e.target.value), start + 1))} style={{ width: "100%", accentColor: C.pink, marginTop: 6 }} />

      {!valid && <div style={{ fontSize: 12, color: C.muted, marginTop: 14 }}>Preencha nome, atleta, ação e avaliação para salvar o clipe.</div>}
      <button className="btn-pink" disabled={!valid} style={{ width: "100%", justifyContent: "center", marginTop: 18, opacity: valid ? 1 : 0.5, cursor: valid ? "pointer" : "not-allowed" }}
        onClick={() => valid && onSave({ athleteId: athlete.id, action, evaluation, note, time: `${start}:00`, hasClip: true, clipTitle: title, start, end, duration: end - start })}>
        <Scissors size={15} /> Salvar clipe
      </button>
    </SidePanel>
  );
}

function DashboardView() {
  const cards = [
    { label: "Total de atletas", value: athletes.length + 58, icon: UserRound, trend: 8, color: C.green },
    { label: "Equipes cadastradas", value: teams.length, icon: Users, trend: 0, color: C.blue },
    { label: "Partidas analisadas", value: 46, icon: Trophy, trend: 12, color: C.pink },
    { label: "Alertas de desempenho", value: 5, icon: TrendingDown, trend: -3, color: C.red },
  ];
  return (
    <div style={{ padding: 32 }}>
      <h2 className="display" style={{ fontSize: 24, fontWeight: 700, margin: "0 0 4px" }}>Olá, Treinador Marcelo! 👋</h2>
      <p style={{ color: C.muted, margin: "0 0 28px", fontSize: 14.5 }}>Acompanhe o desempenho da sua equipe e analise seus resultados.</p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 18, marginBottom: 24 }}>
        {cards.map((c, i) => (
          <div key={i} className="card" style={{ padding: 20, borderTop: `3px solid ${c.color}` }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
              <div style={{ width: 40, height: 40, borderRadius: 11, background: `${c.color}1A`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <c.icon size={20} color={c.color} />
              </div>
              <TrendTag value={c.trend} />
            </div>
            <div className="mono" style={{ fontSize: 28, fontWeight: 600, color: c.color }}>{c.value}</div>
            <div style={{ fontSize: 13, color: C.muted, marginTop: 2 }}>{c.label}</div>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1.6fr 1fr", gap: 18, marginBottom: 18 }}>
        <div className="card" style={{ padding: 22 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
            <h3 style={{ fontSize: 15, fontWeight: 700, margin: 0 }}>Evolução de desempenho</h3>
            <span style={{ fontSize: 12, color: C.muted }}>Últimas 7 partidas</span>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={perfTrend}>
              <CartesianGrid stroke={C.border} vertical={false} />
              <XAxis dataKey="partida" tick={{ fontSize: 12, fill: C.muted }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: C.muted }} axisLine={false} tickLine={false} width={30} />
              <Tooltip contentStyle={{ borderRadius: 10, border: `1px solid ${C.border}`, fontSize: 13 }} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Line type="monotone" dataKey="equipe" name="Sua equipe" stroke={C.green} strokeWidth={3} dot={{ fill: C.green, r: 4 }} />
              <Line type="monotone" dataKey="adversario" name="Adversários" stroke={C.blue} strokeWidth={2.5} strokeDasharray="4 3" dot={{ fill: C.blue, r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="card" style={{ padding: 22 }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, margin: "0 0 14px" }}>Atividades recentes</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {activities.map((a, i) => (
              <div key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                <div style={{ width: 32, height: 32, borderRadius: 9, background: `${a.color}1A`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <a.icon size={15} color={a.color} />
                </div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 500, lineHeight: 1.4 }}>{a.text}</div>
                  <div style={{ fontSize: 12, color: C.muted, marginTop: 2 }}>{a.time}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1.6fr 1fr", gap: 18 }}>
        <div className="card" style={{ padding: 22 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
            <h3 style={{ fontSize: 15, fontWeight: 700, margin: 0 }}>Últimas partidas</h3>
          </div>
          <table>
            <thead><tr><th>Equipes</th><th>Modalidade</th><th>Data</th><th>Resultado</th><th>Status</th></tr></thead>
            <tbody>
              {matches.slice(0, 4).map(m => (
                <tr key={m.id}>
                  <td style={{ fontWeight: 600 }}>{m.teamA} <span style={{ color: C.muted, fontWeight: 400 }}>vs</span> {m.teamB}</td>
                  <td style={{ color: C.muted }}>{m.sport}</td>
                  <td style={{ color: C.muted }}>{m.date}</td>
                  <td className="mono">{m.scoreA} – {m.scoreB}</td>
                  <td><StatusBadge status={m.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="card" style={{ padding: 22 }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, margin: "0 0 14px" }}>Equipes em destaque</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {teams.slice(0, 3).map(t => (
              <div key={t.id} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <Avatar label={t.name.slice(0, 2).toUpperCase()} color={t.color} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13.5, fontWeight: 600 }}>{t.name}</div>
                  <div style={{ fontSize: 12, color: C.muted }}>{t.sport}</div>
                </div>
                <div className="mono" style={{ fontSize: 13, fontWeight: 600, color: t.color }}>{t.performance}%</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function TeamsView({ setView, setSelectedTeam }) {
  return (
    <div style={{ padding: 32 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <div>
          <h2 className="display" style={{ fontSize: 22, fontWeight: 700, margin: 0 }}>Minhas Equipes</h2>
          <p style={{ color: C.muted, margin: "4px 0 0", fontSize: 14 }}>{teams.length} equipes cadastradas em 4 modalidades</p>
        </div>
        <button className="btn-primary"><Plus size={16} /> Nova equipe</button>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 18 }}>
        {teams.map(t => (
          <div key={t.id} className="card" style={{ padding: 22 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div style={{ display: "flex", gap: 14 }}>
                <Avatar label={t.name.slice(0, 2).toUpperCase()} size={52} color={t.color} style={{ fontSize: 17 }} />
                <div>
                  <div style={{ fontWeight: 700, fontSize: 16 }}>{t.name}</div>
                  <div style={{ fontSize: 13, color: C.muted, marginTop: 2 }}>{t.sport} · {t.athletes} atletas</div>
                  <div style={{ fontSize: 12, color: C.muted, marginTop: 4 }} className="mono">{t.record}</div>
                </div>
              </div>
              <TrendTag value={t.trend} />
            </div>
            <div style={{ margin: "18px 0 6px", display: "flex", justifyContent: "space-between", fontSize: 12.5, color: C.muted }}>
              <span>Desempenho geral</span><span className="mono" style={{ fontWeight: 600, color: t.color }}>{t.performance}%</span>
            </div>
            <div style={{ height: 8, background: C.bg, borderRadius: 6, overflow: "hidden" }}>
              <div style={{ width: `${t.performance}%`, height: "100%", background: t.color, borderRadius: 6 }} />
            </div>
            <button className="btn-outline" style={{ width: "100%", justifyContent: "center", marginTop: 18 }}
              onClick={() => { setSelectedTeam(t); setView("teamDetail"); }}>
              <Eye size={15} /> Ver detalhes
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

function TeamDetailView({ team, setView }) {
  const roster = athletes.filter(a => a.team === team.name);
  return (
    <div style={{ padding: 32 }}>
      <div onClick={() => setView("teams")} style={{ display: "flex", alignItems: "center", gap: 6, color: C.muted, fontSize: 13, cursor: "pointer", marginBottom: 18, fontWeight: 500 }}>
        <ArrowLeft size={15} /> Voltar para equipes
      </div>
      <div className="card" style={{ padding: 26, display: "flex", gap: 20, alignItems: "center", marginBottom: 22 }}>
        <Avatar label={team.name.slice(0, 2).toUpperCase()} size={72} color={team.color} style={{ fontSize: 24 }} />
        <div style={{ flex: 1 }}>
          <h2 className="display" style={{ fontSize: 22, fontWeight: 700, margin: 0 }}>{team.name}</h2>
          <div style={{ fontSize: 13.5, color: C.muted, marginTop: 4 }}>{team.sport} · Fundada em {team.founded} · {team.athletes} atletas</div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div className="mono" style={{ fontSize: 26, fontWeight: 700, color: team.color }}>{team.performance}%</div>
          <div style={{ fontSize: 12, color: C.muted }}>desempenho geral</div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 18, marginBottom: 18 }}>
        <div className="card" style={{ padding: 22 }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, margin: "0 0 14px" }}>Desempenho recente</h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={perfTrend}>
              <CartesianGrid stroke={C.border} vertical={false} />
              <XAxis dataKey="partida" tick={{ fontSize: 12, fill: C.muted }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: C.muted }} axisLine={false} tickLine={false} width={30} />
              <Tooltip contentStyle={{ borderRadius: 10, border: `1px solid ${C.border}`, fontSize: 13 }} />
              <Line type="monotone" dataKey="equipe" stroke={team.color} strokeWidth={3} dot={{ fill: team.color, r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="card" style={{ padding: 22 }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, margin: "0 0 14px" }}>Estatísticas gerais</h3>
          {[["Recorde", team.record], ["Modalidade", team.sport], ["Atletas ativos", team.athletes], ["Vídeos relacionados", 9]].map(([k, v], i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: i < 3 ? `1px solid ${C.border}` : "none" }}>
              <span style={{ fontSize: 13.5, color: C.muted }}>{k}</span>
              <span className="mono" style={{ fontSize: 13.5, fontWeight: 600 }}>{v}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="card" style={{ padding: 22 }}>
        <h3 style={{ fontSize: 15, fontWeight: 700, margin: "0 0 14px" }}>Elenco</h3>
        <table>
          <thead><tr><th>Atleta</th><th>Posição</th><th>Idade</th><th>Desempenho</th></tr></thead>
          <tbody>
            {roster.map(a => (
              <tr key={a.id}>
                <td style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <Avatar label={a.initials} size={30} color={a.color} style={{ fontSize: 11 }} /> {a.name}
                </td>
                <td style={{ color: C.muted }}>{a.position}</td>
                <td style={{ color: C.muted }}>{a.age} anos</td>
                <td className="mono" style={{ fontWeight: 600 }}>{a.performance}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function AthletesView({ setView, setSelectedAthlete, actions }) {
  const [q, setQ] = useState("");
  const filtered = athletes.filter(a => a.name.toLowerCase().includes(q.toLowerCase()));
  const goTo = (a) => { setSelectedAthlete(a); setView("athleteDetail"); };
  return (
    <div style={{ padding: 32 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <h2 className="display" style={{ fontSize: 22, fontWeight: 700, margin: 0 }}>Atletas</h2>
        <button className="btn-primary"><Plus size={16} /> Novo atleta</button>
      </div>
      <div style={{ display: "flex", gap: 10, marginBottom: 22, flexWrap: "wrap" }}>
        <div style={{ position: "relative", flex: 1, minWidth: 220 }}>
          <Search size={15} color={C.muted} style={{ position: "absolute", left: 12, top: 12 }} />
          <input placeholder="Buscar atleta..." value={q} onChange={e => setQ(e.target.value)} style={{ width: "100%", paddingLeft: 34 }} />
        </div>
        <select style={{ minWidth: 160 }}><option>Todas as equipes</option>{teams.map(t => <option key={t.id}>{t.name}</option>)}</select>
        <select style={{ minWidth: 160 }}><option>Todas as modalidades</option><option>Futebol</option><option>Basquete</option><option>Vôlei</option><option>Rugby</option></select>
        <button className="btn-outline" style={{ color: C.blueDark, borderColor: C.blue }}><Filter size={15} color={C.blue} /> Filtros</button>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
        {filtered.map(a => {
          const acts = actions.filter(x => x.athleteId === a.id);
          const good = acts.filter(x => x.evaluation === "boa" || x.evaluation === "destaque").length;
          const bad = acts.filter(x => x.evaluation === "ruim").length;
          return (
            <div key={a.id} className="card athlete-card" style={{ padding: 18 }}>
              <Avatar label={a.initials} size={48} color={a.color} style={{ fontSize: 16, marginBottom: 12 }} />
              <div style={{ fontWeight: 700, fontSize: 14.5 }}>{a.name}</div>
              <div style={{ fontSize: 12.5, color: C.muted, marginTop: 2 }}>{a.team}</div>
              <div style={{ fontSize: 12, color: C.muted, marginTop: 2 }}>{a.position} · {a.sport}</div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 12 }}>
                <span className="mono" style={{ fontSize: 11.5, display: "flex", gap: 8 }}>
                  <span style={{ color: C.greenDark, fontWeight: 700 }}>▲{good}</span>
                  <span style={{ color: C.red, fontWeight: 700 }}>▼{bad}</span>
                </span>
                <span className="pill mono" style={{ background: `${a.color}1A`, color: a.color, fontWeight: 700 }}>{a.performance}%</span>
              </div>
              <div className="overlay">
                <div className="overlay-btn" onClick={() => goTo(a)}><Eye size={13} /> Ver perfil</div>
                <div className="overlay-btn" onClick={() => goTo(a)}><BarChart3 size={13} /> Ver estatísticas</div>
                <div className="overlay-btn" onClick={() => goTo(a)}><Film size={13} /> Ver clipes</div>
                <div className="overlay-btn" onClick={() => setView("compare")}><GitCompare size={13} /> Comparar</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function AthleteDetailView({ athlete, setView, actions }) {
  const clipsRef = useRef(null);
  const [filterAction, setFilterAction] = useState("Todas");
  const [filterEval, setFilterEval] = useState("Todas");

  const myActions = actions.filter(a => a.athleteId === athlete.id);
  const myClips = myActions.filter(a => a.hasClip)
    .filter(a => filterAction === "Todas" || a.action === filterAction)
    .filter(a => filterEval === "Todas" || a.evaluation === filterEval);

  const counts = { boa: 0, ruim: 0, neutra: 0, destaque: 0 };
  myActions.forEach(a => { counts[a.evaluation] = (counts[a.evaluation] || 0) + 1; });

  const radarData = [
    { attr: "Ataque", v: 70 + (athlete.id * 3) % 25 }, { attr: "Defesa", v: 55 + (athlete.id * 5) % 30 },
    { attr: "Passe", v: 65 + (athlete.id * 2) % 28 }, { attr: "Físico", v: 60 + (athlete.id * 7) % 32 },
    { attr: "Técnica", v: 75 + (athlete.id * 4) % 20 }, { attr: "Visão de jogo", v: 68 + (athlete.id * 6) % 25 },
  ];
  const actionOptions = ["Todas", ...new Set(myActions.map(a => a.action))];

  return (
    <div style={{ padding: 32 }}>
      <div onClick={() => setView("athletes")} style={{ display: "flex", alignItems: "center", gap: 6, color: C.muted, fontSize: 13, cursor: "pointer", marginBottom: 18, fontWeight: 500 }}>
        <ArrowLeft size={15} /> Voltar para atletas
      </div>

      <div className="card" style={{ padding: 26, display: "flex", gap: 22, alignItems: "center", marginBottom: 14 }}>
        <Avatar label={athlete.initials} size={84} color={athlete.color} style={{ fontSize: 28 }} />
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <h2 className="display" style={{ fontSize: 22, fontWeight: 700, margin: 0 }}>{athlete.name}</h2>
            <span className="pill mono" style={{ background: C.bg, color: C.muted }}><Hash size={11} />{jerseyOf(athlete.id)}</span>
          </div>
          <div style={{ fontSize: 13.5, color: C.muted, marginTop: 5 }}>{athlete.team} · {athlete.position} · {athlete.age} anos · {athlete.sport}</div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div className="mono" style={{ fontSize: 26, fontWeight: 700, color: athlete.color }}>{athlete.performance}%</div>
          <div style={{ fontSize: 12, color: C.muted }}>índice de desempenho</div>
        </div>
      </div>

      <div style={{ display: "flex", gap: 10, marginBottom: 18, flexWrap: "wrap" }}>
        <button className="btn-outline"><Pencil size={14} /> Editar atleta</button>
        <button className="btn-outline"><BarChart3 size={14} color={C.blue} /> Ver estatísticas detalhadas</button>
        <button className="btn-outline" onClick={() => setView("matches")}><Trophy size={14} color={C.pink} /> Ver partidas</button>
        <button className="btn-outline" onClick={() => clipsRef.current?.scrollIntoView({ behavior: "smooth" })}><Film size={14} color={C.pink} /> Ver todos os clipes</button>
        <button className="btn-outline" onClick={() => setView("compare")}><GitCompare size={14} color={C.blue} /> Comparar com outro atleta</button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 14, marginBottom: 18 }}>
        {EVALUATIONS.map(e => (
          <div key={e.key} className="card" style={{ padding: 16, borderTop: `3px solid ${e.color}` }}>
            <div className="mono" style={{ fontSize: 24, fontWeight: 700, color: e.color }}>{counts[e.key] || 0}</div>
            <div style={{ fontSize: 12, color: C.muted, marginTop: 2 }}>Ações {e.label.toLowerCase()}s</div>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18, marginBottom: 18 }}>
        <div className="card" style={{ padding: 22 }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, margin: "0 0 12px" }}>Evolução ao longo do tempo</h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={perfTrend}>
              <CartesianGrid stroke={C.border} vertical={false} />
              <XAxis dataKey="partida" tick={{ fontSize: 12, fill: C.muted }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: C.muted }} axisLine={false} tickLine={false} width={30} />
              <Tooltip contentStyle={{ borderRadius: 10, border: `1px solid ${C.border}`, fontSize: 13 }} />
              <Line type="monotone" dataKey="equipe" stroke={athlete.color} strokeWidth={3} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="card" style={{ padding: 22 }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, margin: "0 0 12px" }}>Perfil de atributos</h3>
          <ResponsiveContainer width="100%" height={200}>
            <RadarChart data={radarData}>
              <PolarGrid stroke={C.border} />
              <PolarAngleAxis dataKey="attr" tick={{ fontSize: 11.5, fill: C.muted }} />
              <Radar dataKey="v" stroke={athlete.color} fill={athlete.color} fillOpacity={0.25} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="card" style={{ padding: 22, marginBottom: 18 }}>
        <h3 style={{ fontSize: 15, fontWeight: 700, margin: "0 0 14px" }}>Linha do tempo de ações</h3>
        <div style={{ display: "flex", flexDirection: "column" }}>
          {myActions.length === 0 && <div style={{ fontSize: 13, color: C.muted }}>Nenhuma ação registrada ainda.</div>}
          {myActions.map((a, i) => {
            const ev = evalOf(a.evaluation);
            const match = matches.find(m => m.id === a.matchId);
            const Icon = ACTION_ICONS[a.action] || MessageSquarePlus;
            return (
              <div key={a.id} style={{ display: "flex", gap: 14, padding: "12px 0", borderBottom: i < myActions.length - 1 ? `1px solid ${C.border}` : "none" }}>
                <div style={{ width: 32, height: 32, borderRadius: 9, background: ev.bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <Icon size={15} color={ev.color} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: 13.5, fontWeight: 700 }}>{a.action}</span>
                    <EvalBadge evalKey={a.evaluation} />
                  </div>
                  <div style={{ fontSize: 12.5, color: C.muted, marginTop: 2 }}>{match?.teamA} vs {match?.teamB} · <span className="mono">{a.time}</span></div>
                  {a.note && <div style={{ fontSize: 12.5, color: C.muted, marginTop: 2 }}>{a.note}</div>}
                </div>
                {a.hasClip && <div className="btn-outline" style={{ padding: "6px 12px", fontSize: 12, alignSelf: "center" }}><Play size={12} /> Assistir</div>}
              </div>
            );
          })}
        </div>
      </div>

      <div className="card" style={{ padding: 22 }} ref={clipsRef}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14, flexWrap: "wrap", gap: 10 }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, margin: 0 }}>Clipes e Momentos</h3>
          <div style={{ display: "flex", gap: 8 }}>
            <select value={filterAction} onChange={e => setFilterAction(e.target.value)}>{actionOptions.map(o => <option key={o}>{o}</option>)}</select>
            <select value={filterEval} onChange={e => setFilterEval(e.target.value)}>
              <option value="Todas">Todas</option>
              {EVALUATIONS.map(e => <option key={e.key} value={e.key}>{e.label}</option>)}
            </select>
          </div>
        </div>
        {myClips.length === 0 && <div style={{ fontSize: 13, color: C.muted }}>Nenhum clipe para os filtros selecionados.</div>}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 14 }}>
          {myClips.map(c => {
            const ev = evalOf(c.evaluation);
            const match = matches.find(m => m.id === c.matchId);
            return (
              <div key={c.id} className="card" style={{ padding: 0, overflow: "hidden" }}>
                <div style={{ background: "#0E2A22", aspectRatio: "16/9", display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
                  <div style={{ width: 40, height: 40, borderRadius: "50%", background: "rgba(255,255,255,0.15)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Play size={16} color="#fff" style={{ marginLeft: 2 }} />
                  </div>
                  <span style={{ position: "absolute", top: 8, right: 8 }}><EvalBadge evalKey={c.evaluation} /></span>
                </div>
                <div style={{ padding: 12 }}>
                  <div style={{ fontSize: 13, fontWeight: 700 }}>{c.clipTitle}</div>
                  <div style={{ fontSize: 11.5, color: C.muted, marginTop: 3 }}>{match?.teamA} vs {match?.teamB}</div>
                  <div style={{ fontSize: 11.5, color: C.muted, marginTop: 1 }}>{c.action} · <span className="mono">{c.time}</span></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function VideoAnalysisView({ match, actions, addAction }) {
  const [scrubber, setScrubber] = useState(42);
  const [highlighted, setHighlighted] = useState(null);
  const [showRegister, setShowRegister] = useState(false);
  const [showClip, setShowClip] = useState(false);
  const [presetAction, setPresetAction] = useState("");

  const events = actions.filter(a => a.matchId === match.id);
  const actionOptions = ACTION_TYPES_BY_SPORT[match.sport] || ACTION_TYPES_BY_SPORT.Futebol;

  const openRegister = (preset) => { setPresetAction(preset || ""); setShowRegister(true); };

  const saveAction = (data) => {
    addAction({ ...data, matchId: match.id, id: Date.now() });
    setShowRegister(false);
  };
  const saveClip = (data) => {
    addAction({ ...data, matchId: match.id, id: Date.now() });
    setShowClip(false);
  };

  return (
    <div style={{ padding: 32 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <div>
          <h2 className="display" style={{ fontSize: 22, fontWeight: 700, margin: 0 }}>Análise de Vídeos</h2>
          <p style={{ color: C.muted, margin: "4px 0 0", fontSize: 14 }}>{match.teamA} vs {match.teamB} · {match.date} · {match.sport}</p>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <button className="btn-blue" onClick={() => openRegister()}><MessageSquarePlus size={15} /> Registrar ação</button>
          <button className="btn-pink" onClick={() => setShowClip(true)}><Scissors size={15} /> Criar clipe</button>
          <button className="btn-primary"><Save size={15} /> Salvar análise</button>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1.7fr 1fr", gap: 18 }}>
        <div>
          <div className="card" style={{ padding: 0, overflow: "hidden", marginBottom: 16 }}>
            <div style={{ background: "#0E2A22", aspectRatio: "16/9", display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
              <div style={{ width: 62, height: 62, borderRadius: "50%", background: "rgba(255,255,255,0.14)", border: "2px solid rgba(255,255,255,0.5)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
                <Play size={24} color="#fff" style={{ marginLeft: 3 }} />
              </div>
              <span style={{ position: "absolute", bottom: 16, left: 18, color: "rgba(255,255,255,0.75)", fontSize: 12.5 }} className="mono">
                {String(Math.floor(scrubber / 2)).padStart(2, "0")}:{String((scrubber * 7) % 60).padStart(2, "0")} / 45:00
              </span>
            </div>
            <div style={{ padding: "16px 20px" }}>
              <input type="range" min="0" max="100" value={scrubber} onChange={e => setScrubber(Number(e.target.value))} style={{ width: "100%", accentColor: C.green }} />
              <div style={{ position: "relative", height: 22, marginTop: 4 }}>
                {events.map(ev => {
                  const e = evalOf(ev.evaluation);
                  const pos = (parseInt(ev.time) / 45) * 100;
                  return (
                    <div key={ev.id} title={`${ev.action} · ${ev.note || ""}`} onClick={() => setHighlighted(ev.id)}
                      style={{ position: "absolute", left: `${Math.min(pos, 98)}%`, top: 0, width: highlighted === ev.id ? 12 : 9, height: highlighted === ev.id ? 12 : 9, borderRadius: "50%", background: e.color, border: "2px solid #fff", boxShadow: "0 0 0 1px " + C.border, cursor: "pointer", transition: "all .12s ease" }} />
                  );
                })}
              </div>
              <div style={{ display: "flex", gap: 14, marginTop: 10, fontSize: 11.5, color: C.muted }}>
                {EVALUATIONS.map(e => (
                  <span key={e.key} style={{ display: "flex", alignItems: "center", gap: 5 }}>
                    <span style={{ width: 8, height: 8, borderRadius: "50%", background: e.color }} />{e.label}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="card" style={{ padding: 20 }}>
            <h3 style={{ fontSize: 14.5, fontWeight: 700, margin: "0 0 4px" }}>Tipos de ação — {match.sport}</h3>
            <p style={{ fontSize: 12.5, color: C.muted, margin: "0 0 14px" }}>Toque em um tipo para registrar rapidamente quem realizou a ação</p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10 }}>
              {actionOptions.map(opt => {
                const Icon = ACTION_ICONS[opt] || MessageSquarePlus;
                return (
                  <div key={opt} onClick={() => openRegister(opt)}
                    style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 7, padding: "14px 8px", borderRadius: 12, border: `1.5px solid ${C.border}`, background: "#fff", cursor: "pointer" }}>
                    <Icon size={19} color={C.blue} />
                    <span style={{ fontSize: 11.5, fontWeight: 600, textAlign: "center" }}>{opt}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="card" style={{ padding: 20, height: "fit-content" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
            <h3 style={{ fontSize: 14.5, fontWeight: 700, margin: 0 }}>Eventos da análise</h3>
            <span className="pill" style={{ background: C.blueLight, color: C.blueDark }}>{events.length} eventos</span>
          </div>
          <div className="scrollbar-thin" style={{ display: "flex", flexDirection: "column", gap: 10, maxHeight: 460, overflowY: "auto" }}>
            {events.map(ev => {
              const e = evalOf(ev.evaluation);
              const athlete = athletes.find(a => a.id === ev.athleteId);
              const Icon = ACTION_ICONS[ev.action] || MessageSquarePlus;
              return (
                <div key={ev.id} onClick={() => setHighlighted(ev.id)} style={{ display: "flex", gap: 10, padding: "10px 12px", borderRadius: 11, border: `1.5px solid ${highlighted === ev.id ? e.color : C.border}`, background: highlighted === ev.id ? e.bg : "#fff", cursor: "pointer" }}>
                  <div style={{ width: 30, height: 30, borderRadius: 9, background: e.bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <Icon size={14} color={e.color} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <span style={{ fontSize: 12.5, fontWeight: 700 }}>{ev.action}</span>
                      <span className="mono" style={{ fontSize: 11.5, color: C.muted }}>{ev.time}</span>
                    </div>
                    <div style={{ fontSize: 12, color: C.muted, marginTop: 2 }}>{athlete?.name || "Atleta"}</div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 4 }}>
                      <EvalBadge evalKey={ev.evaluation} />
                      {ev.hasClip && <span style={{ fontSize: 11, color: C.pink, fontWeight: 600, display: "flex", alignItems: "center", gap: 3 }}><Scissors size={11} /> clipe</span>}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <button className="btn-blue" style={{ width: "100%", justifyContent: "center", marginTop: 14 }} onClick={() => openRegister()}>
            <MessageSquarePlus size={15} /> Adicionar evento
          </button>
        </div>
      </div>

      {showRegister && <RegisterActionPanel match={match} presetAction={presetAction} onClose={() => setShowRegister(false)} onSave={saveAction} />}
      {showClip && <CreateClipPanel match={match} onClose={() => setShowClip(false)} onSave={saveClip} />}
    </div>
  );
}

function MatchesView({ setView, setSelectedMatch }) {
  return (
    <div style={{ padding: 32 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <h2 className="display" style={{ fontSize: 22, fontWeight: 700, margin: 0 }}>Partidas</h2>
        <button className="btn-primary"><Plus size={16} /> Nova partida</button>
      </div>
      <div style={{ display: "flex", gap: 10, marginBottom: 22, flexWrap: "wrap" }}>
        <select><option>Todas as equipes</option>{teams.map(t => <option key={t.id}>{t.name}</option>)}</select>
        <select><option>Todas as modalidades</option><option>Futebol</option><option>Basquete</option><option>Vôlei</option><option>Rugby</option></select>
        <div style={{ position: "relative" }}>
          <Calendar size={15} color={C.muted} style={{ position: "absolute", left: 12, top: 12 }} />
          <input placeholder="Data" style={{ paddingLeft: 34, width: 150 }} />
        </div>
        <select><option>Temporada 2026</option><option>Temporada 2025</option></select>
      </div>
      <div className="card" style={{ padding: 8 }}>
        <table>
          <thead><tr><th>Confronto</th><th>Modalidade</th><th>Data</th><th>Resultado</th><th>Status</th><th></th></tr></thead>
          <tbody>
            {matches.map(m => (
              <tr key={m.id} style={{ cursor: "pointer" }} onClick={() => { setSelectedMatch(m); setView("matchDetail"); }}>
                <td style={{ fontWeight: 600 }}>{m.teamA} <span style={{ color: C.muted, fontWeight: 400 }}>vs</span> {m.teamB}</td>
                <td style={{ color: C.muted }}>{m.sport}</td>
                <td style={{ color: C.muted }}>{m.date}</td>
                <td className="mono" style={{ fontWeight: 600 }}>{m.scoreA} – {m.scoreB}</td>
                <td><StatusBadge status={m.status} /></td>
                <td><ChevronRight size={16} color={C.muted} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function MatchDetailView({ match, setView, actions }) {
  const events = actions.filter(a => a.matchId === match.id);
  const clips = events.filter(a => a.hasClip);
  return (
    <div style={{ padding: 32 }}>
      <div onClick={() => setView("matches")} style={{ display: "flex", alignItems: "center", gap: 6, color: C.muted, fontSize: 13, cursor: "pointer", marginBottom: 18, fontWeight: 500 }}>
        <ArrowLeft size={15} /> Voltar para partidas
      </div>
      <div className="card" style={{ padding: 26, marginBottom: 18 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ textAlign: "center", flex: 1 }}>
            <Avatar label={match.teamA.slice(0, 2).toUpperCase()} size={54} color={C.green} style={{ margin: "0 auto 8px" }} />
            <div style={{ fontWeight: 700, fontSize: 14.5 }}>{match.teamA}</div>
          </div>
          <div style={{ textAlign: "center", padding: "0 30px" }}>
            <div className="mono" style={{ fontSize: 34, fontWeight: 700 }}>{match.scoreA} – {match.scoreB}</div>
            <div style={{ fontSize: 12.5, color: C.muted, marginTop: 4 }}>{match.date} · {match.sport}</div>
            <div style={{ marginTop: 8 }}><StatusBadge status={match.status} /></div>
          </div>
          <div style={{ textAlign: "center", flex: 1 }}>
            <Avatar label={match.teamB.slice(0, 2).toUpperCase()} size={54} color={C.blue} style={{ margin: "0 auto 8px" }} />
            <div style={{ fontWeight: 700, fontSize: 14.5 }}>{match.teamB}</div>
          </div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 18, marginBottom: 18 }}>
        <div className="card" style={{ padding: 22 }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, margin: "0 0 14px" }}>Eventos registrados</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {events.map(ev => {
              const e = evalOf(ev.evaluation);
              const athlete = athletes.find(a => a.id === ev.athleteId);
              return (
                <div key={ev.id} style={{ display: "flex", gap: 12, alignItems: "center", padding: "9px 0", borderBottom: `1px solid ${C.border}` }}>
                  <span className="mono" style={{ fontSize: 12, color: C.muted, width: 42 }}>{ev.time}</span>
                  <span style={{ width: 8, height: 8, borderRadius: "50%", background: e.color }} />
                  <span style={{ fontSize: 13, fontWeight: 600 }}>{ev.action}</span>
                  <span style={{ fontSize: 12.5, color: C.muted }}>{athlete?.name}</span>
                </div>
              );
            })}
          </div>
        </div>
        <div className="card" style={{ padding: 22 }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, margin: "0 0 14px" }}>Momentos importantes</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {clips.map((c) => {
              const e = evalOf(c.evaluation);
              return (
                <div key={c.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: 10, borderRadius: 12, border: `1px solid ${C.border}` }}>
                  <div style={{ width: 46, height: 34, borderRadius: 8, background: "#0E2A22", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Play size={13} color="#fff" />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 12.5, fontWeight: 600 }}>{c.clipTitle}</div>
                    <div className="mono" style={{ fontSize: 11, color: C.muted }}>{c.time}</div>
                  </div>
                  <EvalBadge evalKey={c.evaluation} />
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <div className="card" style={{ padding: 22 }}>
        <h3 style={{ fontSize: 15, fontWeight: 700, margin: "0 0 14px" }}>Atletas participantes</h3>
        <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
          {athletes.filter(a => a.team === match.teamA).map(a => (
            <div key={a.id} style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <Avatar label={a.initials} size={30} color={a.color} style={{ fontSize: 11 }} />
              <span style={{ fontSize: 13 }}>{a.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function StatsView({ actions }) {
  const [team, setTeam] = useState("Falcões FC");
  const statBars = [
    { nome: "Falcões FC", posse: 58, finalizacoes: 14, passes: 82 },
    { nome: "Águias Basquete", posse: 52, finalizacoes: 41, passes: 61 },
    { nome: "Fúria Vôlei", posse: 60, finalizacoes: 22, passes: 74 },
    { nome: "Leões Rugby", posse: 48, finalizacoes: 9, passes: 55 },
  ];
  const evalCounts = { boa: 0, ruim: 0, neutra: 0, destaque: 0 };
  actions.forEach(a => { evalCounts[a.evaluation] = (evalCounts[a.evaluation] || 0) + 1; });
  const evalPie = EVALUATIONS.map(e => ({ name: e.label, value: evalCounts[e.key], color: e.color }));

  return (
    <div style={{ padding: 32 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <h2 className="display" style={{ fontSize: 22, fontWeight: 700, margin: 0 }}>Estatísticas</h2>
      </div>
      <div style={{ display: "flex", gap: 10, marginBottom: 22, flexWrap: "wrap" }}>
        <select value={team} onChange={e => setTeam(e.target.value)}>{teams.map(t => <option key={t.id}>{t.name}</option>)}</select>
        <select><option>Todos os atletas</option>{athletes.map(a => <option key={a.id}>{a.name}</option>)}</select>
        <select><option>Últimos 30 dias</option><option>Últimos 90 dias</option><option>Temporada 2026</option></select>
        <select><option>Todas as modalidades</option><option>Futebol</option><option>Basquete</option><option>Vôlei</option><option>Rugby</option></select>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 14, marginBottom: 18 }}>
        {EVALUATIONS.map(e => (
          <div key={e.key} className="card" style={{ padding: 18, borderTop: `3px solid ${e.color}` }}>
            <div className="mono" style={{ fontSize: 24, fontWeight: 700, color: e.color }}>{evalCounts[e.key] || 0}</div>
            <div style={{ fontSize: 12, color: C.muted, marginTop: 2 }}>Ações {e.label.toLowerCase()}s registradas</div>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 18, marginBottom: 18 }}>
        <div className="card" style={{ padding: 22 }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, margin: "0 0 14px" }}>Comparativo entre equipes</h3>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={statBars}>
              <CartesianGrid stroke={C.border} vertical={false} />
              <XAxis dataKey="nome" tick={{ fontSize: 11, fill: C.muted }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: C.muted }} axisLine={false} tickLine={false} width={30} />
              <Tooltip contentStyle={{ borderRadius: 10, border: `1px solid ${C.border}`, fontSize: 13 }} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Bar dataKey="posse" name="Posse (%)" fill={C.green} radius={[6, 6, 0, 0]} />
              <Bar dataKey="passes" name="Passes certos (%)" fill={C.blue} radius={[6, 6, 0, 0]} />
              <Bar dataKey="finalizacoes" name="Finalizações" fill={C.pink} radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="card" style={{ padding: 22 }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, margin: "0 0 14px" }}>Ações por avaliação</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={evalPie} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={3}>
                {evalPie.map((e, i) => <Cell key={i} fill={e.color} />)}
              </Pie>
              <Tooltip contentStyle={{ borderRadius: 10, border: `1px solid ${C.border}`, fontSize: 13 }} />
            </PieChart>
          </ResponsiveContainer>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10, justifyContent: "center", marginTop: 6 }}>
            {evalPie.map((e, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 12, color: C.muted }}>
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: e.color }} /> {e.name}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="card" style={{ padding: 22 }}>
        <h3 style={{ fontSize: 15, fontWeight: 700, margin: "0 0 14px" }}>Evolução — {team}</h3>
        <ResponsiveContainer width="100%" height={220}>
          <LineChart data={perfTrend}>
            <CartesianGrid stroke={C.border} vertical={false} />
            <XAxis dataKey="partida" tick={{ fontSize: 12, fill: C.muted }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 12, fill: C.muted }} axisLine={false} tickLine={false} width={30} />
            <Tooltip contentStyle={{ borderRadius: 10, border: `1px solid ${C.border}`, fontSize: 13 }} />
            <Legend wrapperStyle={{ fontSize: 12 }} />
            <Line type="monotone" dataKey="equipe" name="Equipe" stroke={C.pink} strokeWidth={3} dot={{ r: 4 }} />
            <Line type="monotone" dataKey="adversario" name="Adversários" stroke={C.blue} strokeWidth={2} strokeDasharray="4 3" dot={{ r: 3 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function CompareView() {
  const [mode, setMode] = useState("partidas");
  const [a, setA] = useState(matches[0]);
  const [b, setB] = useState(matches[1]);
  const rows = [
    { label: "Posse de bola", va: 58, vb: 46, unit: "%" },
    { label: "Finalizações", va: 14, vb: 9, unit: "" },
    { label: "Passes certos", va: 82, vb: 71, unit: "%" },
    { label: "Faltas cometidas", va: 6, vb: 11, unit: "" },
    { label: "Eficiência ofensiva", va: 74, vb: 58, unit: "%" },
  ];
  return (
    <div style={{ padding: 32 }}>
      <h2 className="display" style={{ fontSize: 22, fontWeight: 700, margin: "0 0 20px" }}>Comparações</h2>
      <div style={{ display: "flex", gap: 8, marginBottom: 22 }}>
        {["partidas", "atletas", "períodos"].map(m => (
          <div key={m} onClick={() => setMode(m)} className="pill" style={{ cursor: "pointer", background: mode === m ? C.green : "#fff", color: mode === m ? "#fff" : C.muted, border: `1px solid ${mode === m ? C.green : C.border}`, padding: "8px 16px" }}>
            {m === "partidas" ? "Duas partidas" : m === "atletas" ? "Dois atletas" : "Dois períodos"}
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18, marginBottom: 22 }}>
        <div className="card" style={{ padding: 18 }}>
          <div style={{ fontSize: 12, color: C.muted, marginBottom: 8, fontWeight: 600 }}>PARTIDA A</div>
          <select value={a.id} onChange={e => setA(matches.find(m => m.id === Number(e.target.value)))} style={{ width: "100%" }}>
            {matches.map(m => <option key={m.id} value={m.id}>{m.teamA} vs {m.teamB}</option>)}
          </select>
        </div>
        <div className="card" style={{ padding: 18 }}>
          <div style={{ fontSize: 12, color: C.muted, marginBottom: 8, fontWeight: 600 }}>PARTIDA B</div>
          <select value={b.id} onChange={e => setB(matches.find(m => m.id === Number(e.target.value)))} style={{ width: "100%" }}>
            {matches.map(m => <option key={m.id} value={m.id}>{m.teamA} vs {m.teamB}</option>)}
          </select>
        </div>
      </div>

      <div className="card" style={{ padding: 24 }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 20 }}>
          <div style={{ fontWeight: 700, color: C.green }}>{a.teamA} vs {a.teamB}</div>
          <div style={{ fontWeight: 700, color: C.blue }}>{b.teamA} vs {b.teamB}</div>
        </div>
        {rows.map((r, i) => {
          const aWins = r.va >= r.vb;
          return (
            <div key={i} style={{ marginBottom: 18 }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12.5, color: C.muted, marginBottom: 6 }}>
                <span className="mono" style={{ color: aWins ? C.greenDark : C.ink, fontWeight: aWins ? 700 : 500 }}>{r.va}{r.unit}</span>
                <span>{r.label}</span>
                <span className="mono" style={{ color: !aWins ? C.blueDark : C.ink, fontWeight: !aWins ? 700 : 500 }}>{r.vb}{r.unit}</span>
              </div>
              <div style={{ display: "flex", height: 8, borderRadius: 6, overflow: "hidden", background: C.bg }}>
                <div style={{ width: `${(r.va / (r.va + r.vb)) * 100}%`, background: C.green }} />
                <div style={{ width: `${(r.vb / (r.va + r.vb)) * 100}%`, background: C.blue }} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function SettingsView() {
  const [colors, setColors] = useState([C.green, C.blue, C.pink]);
  const options = [C.green, C.blue, C.pink, C.red, "#8A5CF6", "#F2A93B"];
  return (
    <div style={{ padding: 32, maxWidth: 780 }}>
      <h2 className="display" style={{ fontSize: 22, fontWeight: 700, margin: "0 0 20px" }}>Configurações</h2>

      <div className="card" style={{ padding: 24, marginBottom: 18 }}>
        <h3 style={{ fontSize: 15, fontWeight: 700, margin: "0 0 18px" }}>Perfil do usuário</h3>
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 20 }}>
          <Avatar label="MR" size={64} color={C.green} style={{ fontSize: 22 }} />
          <button className="btn-outline"><ImagePlus size={15} /> Alterar foto</button>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          <div>
            <label style={{ fontSize: 12.5, color: C.muted, fontWeight: 600 }}>Nome</label>
            <input defaultValue="Marcelo Ferreira" style={{ width: "100%", marginTop: 6 }} />
          </div>
          <div>
            <label style={{ fontSize: 12.5, color: C.muted, fontWeight: 600 }}>E-mail</label>
            <input defaultValue="marcelo.ferreira@sate.com" style={{ width: "100%", marginTop: 6 }} />
          </div>
        </div>
      </div>

      <div className="card" style={{ padding: 24, marginBottom: 18 }}>
        <h3 style={{ fontSize: 15, fontWeight: 700, margin: "0 0 4px" }}>Preferências do sistema</h3>
        <p style={{ fontSize: 13, color: C.muted, margin: "0 0 16px" }}>Notificações e segurança</p>
        {[["Notificações por e-mail", true], ["Notificações push", true], ["Autenticação em duas etapas", false]].map(([l, v], i) => (
          <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0", borderBottom: i < 2 ? `1px solid ${C.border}` : "none" }}>
            <span style={{ fontSize: 13.5 }}>{l}</span>
            <div style={{ width: 40, height: 22, borderRadius: 999, background: v ? C.green : C.border, position: "relative", cursor: "pointer" }}>
              <div style={{ width: 16, height: 16, borderRadius: "50%", background: "#fff", position: "absolute", top: 3, left: v ? 21 : 3, transition: "all .15s" }} />
            </div>
          </div>
        ))}
      </div>

      <div className="card" style={{ padding: 24 }}>
        <h3 style={{ fontSize: 15, fontWeight: 700, margin: "0 0 4px", display: "flex", alignItems: "center", gap: 8 }}><Palette size={17} color={C.green} /> Personalização da equipe</h3>
        <p style={{ fontSize: 13, color: C.muted, margin: "0 0 16px" }}>Escolha até 3 cores para representar a identidade da sua equipe</p>
        <div style={{ display: "flex", gap: 10, marginBottom: 18, flexWrap: "wrap" }}>
          {options.map(c => {
            const selected = colors.includes(c);
            return (
              <div key={c} onClick={() => {
                if (selected) setColors(colors.filter(x => x !== c));
                else if (colors.length < 3) setColors([...colors, c]);
              }} style={{ width: 38, height: 38, borderRadius: "50%", background: c, cursor: "pointer", border: selected ? "3px solid " + C.ink : "3px solid transparent", boxShadow: selected ? "0 0 0 2px #fff, 0 0 0 3px " + c : "none" }} />
            );
          })}
        </div>
        <div style={{ fontSize: 12.5, color: C.muted, marginBottom: 10, fontWeight: 600 }}>Prévia</div>
        <div style={{ display: "flex", height: 46, borderRadius: 12, overflow: "hidden" }}>
          {colors.map((c, i) => <div key={i} style={{ flex: 1, background: c }} />)}
        </div>
      </div>
    </div>
  );
}

function LoginView({ onLogin }) {
  return (
    <div style={{ minHeight: "100vh", display: "grid", gridTemplateColumns: "1.1fr 1fr" }}>
      <div style={{ background: "#0E2A22", position: "relative", overflow: "hidden", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: 48 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 38, height: 38, borderRadius: 11, background: C.green, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Activity size={20} color="#fff" strokeWidth={2.5} />
          </div>
          <span className="display" style={{ color: "#fff", fontWeight: 800, fontSize: 17 }}>SATE</span>
        </div>

        <div>
          <svg viewBox="0 0 400 140" width="100%" height="140" style={{ marginBottom: 24 }}>
            <polyline points="0,100 40,80 80,95 120,55 160,70 200,30 240,50 280,20 320,45 360,15 400,35"
              fill="none" stroke={C.green} strokeWidth="3" />
            <polyline points="0,120 40,110 80,118 120,95 160,105 200,85 240,92 280,70 320,88 360,60 400,75"
              fill="none" stroke={C.blue} strokeWidth="2.5" strokeDasharray="5 4" />
            {[[0, 100], [80, 95], [160, 70], [240, 50], [320, 45], [400, 35]].map((p, i) => (
              <circle key={i} cx={p[0]} cy={p[1]} r="4" fill={i % 3 === 1 ? C.pink : C.green} />
            ))}
          </svg>
          <h2 className="display" style={{ color: "#fff", fontSize: 28, fontWeight: 700, lineHeight: 1.25, margin: "0 0 12px" }}>
            Dados que revelam o<br />verdadeiro desempenho.
          </h2>
          <p style={{ color: "rgba(255,255,255,0.6)", fontSize: 14.5, maxWidth: 380 }}>
            Gerencie equipes, analise vídeos e acompanhe estatísticas de qualquer modalidade esportiva em um único painel.
          </p>
        </div>

        <div style={{ display: "flex", gap: 28 }}>
          {[["+180", "atletas", C.green], ["46", "partidas analisadas", C.blue], ["12", "modalidades", C.pink]].map(([v, l, c], i) => (
            <div key={i}>
              <div className="mono" style={{ color: c, fontSize: 20, fontWeight: 700 }}>{v}</div>
              <div style={{ color: "rgba(255,255,255,0.5)", fontSize: 12 }}>{l}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: 40 }}>
        <div style={{ width: "100%", maxWidth: 360 }}>
          <h1 className="display" style={{ fontSize: 26, fontWeight: 700, margin: "0 0 6px" }}>Bem-vindo de volta!</h1>
          <p style={{ color: C.muted, fontSize: 14, margin: "0 0 28px" }}>Entre para continuar acompanhando o desempenho da sua equipe.</p>

          <label style={{ fontSize: 12.5, fontWeight: 600, color: C.muted }}>E-mail</label>
          <div style={{ position: "relative", margin: "6px 0 16px" }}>
            <Search size={16} color={C.muted} style={{ position: "absolute", left: 12, top: 13, opacity: 0 }} />
            <input defaultValue="marcelo.ferreira@sate.com" style={{ width: "100%" }} />
          </div>

          <label style={{ fontSize: 12.5, fontWeight: 600, color: C.muted }}>Senha</label>
          <div style={{ position: "relative", margin: "6px 0 6px" }}>
            <input type="password" defaultValue="••••••••" style={{ width: "100%" }} />
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", margin: "10px 0 22px" }}>
            <label style={{ display: "flex", alignItems: "center", gap: 7, fontSize: 13, color: C.muted, cursor: "pointer" }}>
              <input type="checkbox" style={{ width: "auto", padding: 0 }} defaultChecked /> Lembrar de mim
            </label>
            <span style={{ fontSize: 13, color: C.green, fontWeight: 600, cursor: "pointer" }}>Esqueci minha senha</span>
          </div>

          <button className="btn-primary" style={{ width: "100%", justifyContent: "center", padding: "13px" }} onClick={onLogin}>
            Entrar
          </button>

          <p style={{ textAlign: "center", fontSize: 13.5, color: C.muted, marginTop: 20 }}>
            Ainda não possui uma conta? <span style={{ color: C.green, fontWeight: 600, cursor: "pointer" }}>Criar conta</span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function SATE() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [view, setView] = useState("dashboard");
  const [selectedTeam, setSelectedTeam] = useState(teams[0]);
  const [selectedAthlete, setSelectedAthlete] = useState(athletes[0]);
  const [selectedMatch, setSelectedMatch] = useState(matches[0]);
  const [actions, setActions] = useState(initialActions);

  const addAction = (a) => setActions(prev => [{ ...a, id: a.id || Date.now() }, ...prev]);

  const titles = {
    dashboard: ["Dashboard", ""], teams: ["Equipes", ""], athletes: ["Atletas", ""],
    video: ["Análise de Vídeos", ""], matches: ["Partidas", ""], stats: ["Estatísticas", ""],
    compare: ["Comparações", ""], settings: ["Configurações", ""],
    teamDetail: [selectedTeam?.name, "Detalhes da equipe"], athleteDetail: [selectedAthlete?.name, "Perfil do atleta"],
    matchDetail: ["Detalhes da partida", ""],
  };

  if (!loggedIn) {
    return (
      <div className="sate">
        <style>{CSS}</style>
        <LoginView onLogin={() => setLoggedIn(true)} />
      </div>
    );
  }

  return (
    <div className="sate" style={{ display: "flex" }}>
      <style>{CSS}</style>
      <Sidebar view={view} setView={setView} onLogout={() => setLoggedIn(false)} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <Topbar title={titles[view][0]} subtitle={titles[view][1]} user={{ name: "Marcelo Ferreira", role: "Treinador", initials: "MF" }} />
        {view === "dashboard" && <DashboardView />}
        {view === "teams" && <TeamsView setView={setView} setSelectedTeam={setSelectedTeam} />}
        {view === "teamDetail" && <TeamDetailView team={selectedTeam} setView={setView} />}
        {view === "athletes" && <AthletesView setView={setView} setSelectedAthlete={setSelectedAthlete} actions={actions} />}
        {view === "athleteDetail" && <AthleteDetailView athlete={selectedAthlete} setView={setView} actions={actions} />}
        {view === "video" && <VideoAnalysisView match={selectedMatch} actions={actions} addAction={addAction} />}
        {view === "matches" && <MatchesView setView={setView} setSelectedMatch={setSelectedMatch} />}
        {view === "matchDetail" && <MatchDetailView match={selectedMatch} setView={setView} actions={actions} />}
        {view === "stats" && <StatsView actions={actions} />}
        {view === "compare" && <CompareView />}
        {view === "settings" && <SettingsView />}
      </div>
    </div>
  );
}

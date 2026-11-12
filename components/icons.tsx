const P = { fill: "none", stroke: "#fff", strokeWidth: 2, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
export function ServiceIcon({ name }: { name: string }) {
  switch (name) {
    case "md": return <svg viewBox="0 0 24 24" {...P}><path d="M4 10v4l11 5V5L4 10z" /><path d="M15 9a3 3 0 0 1 0 6" /><path d="M7 15l1 5" /></svg>;
    case "bv": return <svg viewBox="0 0 24 24" {...P}><path d="M3 17l6-6 4 4 8-8" /><path d="M15 7h6v6" /></svg>;
    case "cv": return <svg viewBox="0 0 24 24" {...P}><rect x="3" y="6" width="13" height="12" rx="2.5" /><path d="M16 10.5l5-3v9l-5-3" /></svg>;
    case "ec": return <svg viewBox="0 0 24 24" {...P}><path d="M3 4h2l2.2 11h11L21 8H6.2" /><circle cx="9" cy="19.5" r="1.4" /><circle cx="17" cy="19.5" r="1.4" /></svg>;
    default: return <svg viewBox="0 0 24 24" {...P}><circle cx="9" cy="8" r="3.2" /><path d="M3 19c.6-3.2 3-5 6-5s5.4 1.8 6 5" /><circle cx="17" cy="9" r="2.4" /><path d="M17.5 14c2 .3 3.2 1.8 3.5 4" /></svg>;
  }
}
export const Arrow = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6" /></svg>;

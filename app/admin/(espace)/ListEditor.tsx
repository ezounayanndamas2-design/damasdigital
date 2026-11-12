import { deleteRow, saveRow } from "../actions";

export type Field = { name: string; label: string; type?: "text" | "textarea" | "select"; options?: [string, string][]; hint?: string; rows?: number; placeholder?: string };
type Row = { id: string; is_active: boolean; position: number } & Record<string, unknown>;

const val = (r: Row | null, k: string) => { const v = r?.[k]; return Array.isArray(v) ? v.join("\n") : v == null ? "" : String(v); };

function Fields({ table, row, fields, nextPos }: { table: string; row: Row | null; fields: Field[]; nextPos: number }) {
  const id = row?.id ?? "new";
  return (
    <form action={saveRow} className="form">
      <input type="hidden" name="table" value={table} />
      <input type="hidden" name="id" value={row?.id ?? ""} />
      {fields.map((f) => (
        <div className="f" key={f.name}>
          <label htmlFor={`${f.name}-${id}`}>{f.label}</label>
          {f.type === "textarea" ? <textarea id={`${f.name}-${id}`} name={f.name} rows={f.rows ?? 4} defaultValue={val(row, f.name)} placeholder={f.placeholder} />
            : f.type === "select" ? <select id={`${f.name}-${id}`} name={f.name} defaultValue={val(row, f.name)}>{f.options!.map(([v, l]) => <option key={v} value={v}>{l}</option>)}</select>
            : <input id={`${f.name}-${id}`} name={f.name} defaultValue={val(row, f.name)} placeholder={f.placeholder} />}
          {f.hint && <span className="hint">{f.hint}</span>}
        </div>
      ))}
      <div className="row2">
        <div className="f"><label htmlFor={`position-${id}`}>Ordre d’affichage</label><input id={`position-${id}`} name="position" inputMode="numeric" defaultValue={row ? row.position : nextPos} /></div>
        <div className="f" style={{ alignContent: "end" }}><label className="check"><input type="checkbox" name="is_active" defaultChecked={row ? row.is_active : true} /> Visible sur le site</label></div>
      </div>
      <div className="actions">
        <button className="btn btn-primary btn-sm">{row ? "Enregistrer" : "Ajouter"}</button>
        {row && <button formAction={deleteRow} className="btn btn-danger btn-sm">Supprimer</button>}
      </div>
    </form>
  );
}

export default function ListEditor({ table, rows, fields, title, sub, addLabel }: { table: string; rows: Row[]; fields: Field[]; title: (r: Row) => string; sub: (r: Row) => string; addLabel: string }) {
  const nextPos = rows.reduce((m, r) => Math.max(m, r.position), 0) + 1;
  return (
    <div className="plist">
      {rows.map((r) => (
        <details className={"card edit" + (r.is_active ? "" : " off")} key={r.id}>
          <summary className="prow" style={{ gridTemplateColumns: "auto 1fr auto" }}>
            <span className="pos">{r.position}</span>
            <div style={{ minWidth: 0 }}><h3>{title(r)}</h3><p>{sub(r)}{r.is_active ? "" : " · masqué"}</p></div>
            <span className="btn btn-ghost btn-sm">Modifier</span>
          </summary>
          <Fields table={table} row={r} fields={fields} nextPos={nextPos} />
        </details>
      ))}
      {!rows.length && <div className="card empty">Rien pour l’instant.</div>}
      <details className="card edit">
        <summary><span className="btn btn-primary btn-sm">+ {addLabel}</span></summary>
        <Fields table={table} row={null} fields={fields} nextPos={nextPos} />
      </details>
    </div>
  );
}

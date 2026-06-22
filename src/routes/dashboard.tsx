import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { loadCars, saveCars, formatEGP, type Car, type CarStatus, type FuelType } from "@/lib/cars";

export const Route = createFileRoute("/dashboard")({
  head: () => ({ meta: [{ title: "لوحة التحكم | معرض جوكس" }] }),
  component: Dashboard,
});

const PIN = "1234";
const FUELS: FuelType[] = ["بنزين", "ديزل", "كهربائي", "هجين"];
const STATUSES: CarStatus[] = ["متاح", "محجوز", "مباع"];

const emptyForm = {
  brand: "", model: "", year: new Date().getFullYear(), price: 0,
  color: "", fuel: "بنزين" as FuelType, status: "متاح" as CarStatus, image: ""
};

function Dashboard() {
  const [authed, setAuthed] = useState(false);
  const [pin, setPin] = useState("");
  const [err, setErr] = useState("");
  const [cars, setCars] = useState<Car[]>([]);
  const [form, setForm] = useState({ ...emptyForm });
  const [editId, setEditId] = useState<string | null>(null);

  useEffect(() => {
    if (sessionStorage.getItem("jox_auth") === "1") setAuthed(true);
  }, []);
  useEffect(() => { if (authed) setCars(loadCars()); }, [authed]);

  const stats = useMemo(() => ({
    total: cars.length,
    available: cars.filter(c => c.status === "متاح").length,
    reserved: cars.filter(c => c.status === "محجوز").length,
    sold: cars.filter(c => c.status === "مباع").length,
    value: cars.reduce((s, c) => s + c.price, 0),
  }), [cars]);

  const brandCounts = useMemo(() => {
    const m = new Map<string, number>();
    cars.forEach(c => m.set(c.brand, (m.get(c.brand) || 0) + 1));
    return Array.from(m.entries()).sort((a, b) => b[1] - a[1]);
  }, [cars]);
  const maxBrand = Math.max(1, ...brandCounts.map(([, n]) => n));

  function persist(next: Car[]) { setCars(next); saveCars(next); }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.brand || !form.model || !form.price) return;
    if (editId) {
      persist(cars.map(c => c.id === editId ? { ...c, ...form, price: Number(form.price), year: Number(form.year) } : c));
      setEditId(null);
    } else {
      persist([...cars, { id: Date.now().toString(), ...form, price: Number(form.price), year: Number(form.year) }]);
    }
    setForm({ ...emptyForm });
  }

  function edit(c: Car) {
    setEditId(c.id);
    setForm({ brand: c.brand, model: c.model, year: c.year, price: c.price, color: c.color, fuel: c.fuel, status: c.status, image: c.image || "" });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
  function del(id: string) {
    if (confirm("حذف السيارة؟")) persist(cars.filter(c => c.id !== id));
  }

  if (!authed) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6">
        <form onSubmit={e => {
          e.preventDefault();
          if (pin === PIN) { sessionStorage.setItem("jox_auth", "1"); setAuthed(true); }
          else setErr("الرقم السري غير صحيح");
        }} className="card-luxury rounded-2xl p-8 w-full max-w-sm">
          <div className="w-14 h-14 rounded-xl gold-gradient flex items-center justify-center font-black text-background text-2xl mx-auto mb-6">ج</div>
          <h1 className="text-2xl font-bold text-center mb-2">لوحة التحكم</h1>
          <p className="text-sm text-muted-foreground text-center mb-6">أدخل الرقم السري للدخول</p>
          <input type="password" value={pin} onChange={e => { setPin(e.target.value); setErr(""); }}
            placeholder="••••" maxLength={4}
            className="w-full bg-input border border-border rounded-lg px-4 py-3 text-center text-2xl tracking-[0.5em] focus:border-gold outline-none" />
          {err && <p className="text-rose-400 text-sm text-center mt-3">{err}</p>}
          <button className="w-full mt-6 gold-gradient text-background font-bold py-3 rounded-lg hover:opacity-90 transition">دخول</button>
          <Link to="/" className="block text-center text-xs text-muted-foreground mt-4 hover:text-gold">→ العودة للمعرض</Link>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <header className="border-b border-border/50 backdrop-blur-md sticky top-0 z-50 bg-background/80">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg gold-gradient flex items-center justify-center font-black text-background text-xl">ج</div>
            <div>
              <div className="font-bold">لوحة التحكم</div>
              <div className="text-xs text-muted-foreground">معرض جوكس</div>
            </div>
          </div>
          <div className="flex gap-2">
            <Link to="/" className="text-sm px-4 py-2 rounded-lg border border-border hover:border-gold/50 transition">المعرض</Link>
            <button onClick={() => { sessionStorage.removeItem("jox_auth"); setAuthed(false); }}
              className="text-sm px-4 py-2 rounded-lg border border-border hover:border-rose-500/50 hover:text-rose-400 transition">خروج</button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8 space-y-8">
        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          <StatCard label="إجمالي السيارات" value={stats.total} />
          <StatCard label="متاح" value={stats.available} accent="emerald" />
          <StatCard label="محجوز" value={stats.reserved} accent="amber" />
          <StatCard label="مباع" value={stats.sold} accent="rose" />
          <StatCard label="قيمة المخزون" value={formatEGP(stats.value)} highlight />
        </div>

        {/* Form */}
        <section className="card-luxury rounded-2xl p-6">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <span className="text-gold">{editId ? "✎" : "+"}</span>
            {editId ? "تعديل سيارة" : "إضافة سيارة جديدة"}
          </h2>
          <form onSubmit={submit} className="grid md:grid-cols-3 lg:grid-cols-4 gap-4">
            <Field label="ماركة"><input required value={form.brand} onChange={e => setForm({ ...form, brand: e.target.value })} className={inputCls} /></Field>
            <Field label="موديل"><input required value={form.model} onChange={e => setForm({ ...form, model: e.target.value })} className={inputCls} /></Field>
            <Field label="سنة"><input type="number" required value={form.year} onChange={e => setForm({ ...form, year: Number(e.target.value) })} className={inputCls} /></Field>
            <Field label="سعر (ج.م)"><input type="number" required value={form.price} onChange={e => setForm({ ...form, price: Number(e.target.value) })} className={inputCls} /></Field>
            <Field label="لون"><input value={form.color} onChange={e => setForm({ ...form, color: e.target.value })} className={inputCls} /></Field>
            <Field label="نوع الوقود">
              <select value={form.fuel} onChange={e => setForm({ ...form, fuel: e.target.value as FuelType })} className={inputCls}>
                {FUELS.map(f => <option key={f}>{f}</option>)}
              </select>
            </Field>
            <Field label="الحالة">
              <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value as CarStatus })} className={inputCls}>
                {STATUSES.map(s => <option key={s}>{s}</option>)}
              </select>
            </Field>
            <Field label="رابط صورة (اختياري)"><input value={form.image} onChange={e => setForm({ ...form, image: e.target.value })} className={inputCls} /></Field>
            <div className="md:col-span-3 lg:col-span-4 flex gap-3 justify-end pt-2">
              {editId && (
                <button type="button" onClick={() => { setEditId(null); setForm({ ...emptyForm }); }}
                  className="px-5 py-2.5 rounded-lg border border-border hover:border-rose-500/50 transition">إلغاء</button>
              )}
              <button className="px-6 py-2.5 rounded-lg gold-gradient text-background font-bold hover:opacity-90 transition">
                {editId ? "حفظ التعديلات" : "إضافة السيارة"}
              </button>
            </div>
          </form>
        </section>

        {/* Brand chart */}
        <section className="card-luxury rounded-2xl p-6">
          <h2 className="text-xl font-bold mb-6">المخزون حسب الماركة</h2>
          <div className="space-y-3">
            {brandCounts.map(([b, n]) => (
              <div key={b} className="flex items-center gap-4">
                <div className="w-24 text-sm font-semibold">{b}</div>
                <div className="flex-1 h-8 bg-secondary rounded-lg overflow-hidden">
                  <div className="h-full gold-gradient rounded-lg flex items-center justify-end px-3 text-xs font-bold text-background transition-all"
                    style={{ width: `${(n / maxBrand) * 100}%` }}>
                    {n}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Table */}
        <section className="card-luxury rounded-2xl overflow-hidden">
          <h2 className="text-xl font-bold p-6 pb-4">قائمة السيارات</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-secondary/50 text-xs uppercase text-muted-foreground">
                <tr>
                  {["الماركة", "الموديل", "السنة", "السعر", "اللون", "الوقود", "الحالة", "إجراءات"].map(h =>
                    <th key={h} className="px-4 py-3 text-right">{h}</th>)}
                </tr>
              </thead>
              <tbody>
                {cars.map(c => (
                  <tr key={c.id} className="border-t border-border/50 hover:bg-secondary/30 transition">
                    <td className="px-4 py-3 font-semibold">{c.brand}</td>
                    <td className="px-4 py-3">{c.model}</td>
                    <td className="px-4 py-3">{c.year}</td>
                    <td className="px-4 py-3 text-gold font-semibold">{formatEGP(c.price)}</td>
                    <td className="px-4 py-3">{c.color}</td>
                    <td className="px-4 py-3">{c.fuel}</td>
                    <td className="px-4 py-3">{c.status}</td>
                    <td className="px-4 py-3 flex gap-2">
                      <button onClick={() => edit(c)} className="px-3 py-1 rounded-md border border-gold/40 text-gold hover:bg-gold/10 transition text-xs">تعديل</button>
                      <button onClick={() => del(c.id)} className="px-3 py-1 rounded-md border border-rose-500/40 text-rose-400 hover:bg-rose-500/10 transition text-xs">حذف</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
}

const inputCls = "w-full bg-input border border-border rounded-lg px-3 py-2.5 text-foreground focus:border-gold outline-none text-sm";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="text-xs text-muted-foreground mb-1.5 block">{label}</label>
      {children}
    </div>
  );
}

function StatCard({ label, value, accent, highlight }: { label: string; value: string | number; accent?: "emerald" | "amber" | "rose"; highlight?: boolean }) {
  const color = accent === "emerald" ? "text-emerald-400" : accent === "amber" ? "text-amber-400" : accent === "rose" ? "text-rose-400" : "text-foreground";
  return (
    <div className={`card-luxury rounded-2xl p-5 ${highlight ? "border-gold/40" : ""}`}>
      <div className="text-xs text-muted-foreground mb-2">{label}</div>
      <div className={`text-2xl font-bold ${highlight ? "text-gold" : color}`}>{value}</div>
    </div>
  );
}

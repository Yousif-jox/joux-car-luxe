import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { loadCars, formatEGP, type Car, type CarStatus } from "@/lib/cars";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "معرض السيارات جوكس | أفخم السيارات" },
      { name: "description", content: "تصفح أفخر السيارات في معرض جوكس بأفضل الأسعار في مصر" },
    ],
  }),
  component: Showroom,
});

const STATUSES: (CarStatus | "الكل")[] = ["الكل", "متاح", "محجوز", "مباع"];

function statusBadge(s: CarStatus) {
  const map: Record<CarStatus, string> = {
    "متاح": "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
    "محجوز": "bg-amber-500/15 text-amber-300 border-amber-500/30",
    "مباع": "bg-rose-500/15 text-rose-300 border-rose-500/30",
  };
  return map[s];
}

function Showroom() {
  const [cars, setCars] = useState<Car[]>([]);
  const [brand, setBrand] = useState("الكل");
  const [status, setStatus] = useState<CarStatus | "الكل">("الكل");
  const [maxPrice, setMaxPrice] = useState(6000000);
  const [query, setQuery] = useState("");

  useEffect(() => { setCars(loadCars()); }, []);

  const brands = useMemo(() => ["الكل", ...Array.from(new Set(cars.map(c => c.brand)))], [cars]);
  const filtered = cars.filter(c =>
    (brand === "الكل" || c.brand === brand) &&
    (status === "الكل" || c.status === status) &&
    c.price <= maxPrice &&
    (query.trim() === "" || `${c.brand} ${c.model}`.toLowerCase().includes(query.trim().toLowerCase()))
  );

  return (
    <div className="min-h-screen">
      {/* Nav */}
      <header className="border-b border-border/50 backdrop-blur-md sticky top-0 z-50 bg-background/80">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg gold-gradient flex items-center justify-center font-black text-background text-xl">ج</div>
            <span className="font-bold text-lg">معرض جوكس</span>
          </div>
          <Link to="/dashboard" className="text-sm px-4 py-2 rounded-lg border border-gold/40 text-gold hover:bg-gold/10 transition">
            لوحة التحكم
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden py-24 px-6">
        <div className="container mx-auto text-center relative z-10">
          <div className="inline-block px-4 py-1.5 rounded-full border border-gold/30 text-gold text-xs mb-6 tracking-widest">
            ★ معرض السيارات الفاخرة ★
          </div>
          <h1 className="text-5xl md:text-7xl font-black mb-6 text-gold-gradient leading-tight">
            معرض السيارات جوكس
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            أفخم السيارات الجديدة والمستعملة بأفضل الأسعار في مصر — اكتشف مجموعتنا الحصرية
          </p>
          <div className="mt-10 flex justify-center gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-gold">{cars.length}</div>
              <div className="text-xs text-muted-foreground mt-1">سيارة</div>
            </div>
            <div className="w-px bg-border" />
            <div>
              <div className="text-3xl font-bold text-gold">{cars.filter(c => c.status === "متاح").length}</div>
              <div className="text-xs text-muted-foreground mt-1">متاح للبيع</div>
            </div>
            <div className="w-px bg-border" />
            <div>
              <div className="text-3xl font-bold text-gold">{brands.length - 1}</div>
              <div className="text-xs text-muted-foreground mt-1">ماركة</div>
            </div>
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="container mx-auto px-6 mb-8">
        <div className="card-luxury rounded-2xl p-6 grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div>
            <label className="text-xs text-muted-foreground mb-2 block">بحث</label>
            <input
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="ابحث بالماركة أو الموديل..."
              className="w-full bg-input border border-border rounded-lg px-3 py-2.5 text-foreground focus:border-gold outline-none"
            />
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-2 block">الماركة</label>
            <select value={brand} onChange={e => setBrand(e.target.value)}
              className="w-full bg-input border border-border rounded-lg px-3 py-2.5 text-foreground focus:border-gold outline-none">
              {brands.map(b => <option key={b}>{b}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-2 block">الحالة</label>
            <div className="flex gap-2 flex-wrap">
              {STATUSES.map(s => (
                <button key={s} onClick={() => setStatus(s)}
                  className={`px-3 py-2 rounded-lg text-sm border transition ${status === s ? "gold-gradient text-background border-transparent font-semibold" : "border-border hover:border-gold/50"}`}>
                  {s}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-2 block">
              السعر حتى: <span className="text-gold font-semibold">{formatEGP(maxPrice)}</span>
            </label>
            <input type="range" min={500000} max={6000000} step={50000} value={maxPrice}
              onChange={e => setMaxPrice(Number(e.target.value))}
              className="w-full accent-[#C9A84C]" />
          </div>
        </div>
      </section>

      {/* Grid */}
      <section className="container mx-auto px-6 pb-24">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map(car => (
            <article key={car.id} className="card-luxury card-luxury-hover rounded-2xl overflow-hidden">
              <div className="aspect-[16/10] bg-secondary relative overflow-hidden">
                {car.image ? (
                  <img src={car.image} alt={`${car.brand} ${car.model}`} loading="lazy"
                    className="w-full h-full object-cover transition group-hover:scale-105" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gold/30 text-6xl">🚗</div>
                )}
                <div className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs border ${statusBadge(car.status)}`}>
                  {car.status}
                </div>
              </div>
              <div className="p-5">
                <div className="flex items-baseline justify-between mb-2">
                  <h3 className="font-bold text-lg">{car.brand} {car.model}</h3>
                  <span className="text-xs text-muted-foreground">{car.year}</span>
                </div>
                <div className="flex items-center gap-3 text-xs text-muted-foreground mb-4">
                  <span>⛽ {car.fuel}</span>
                  <span>•</span>
                  <span>🎨 {car.color}</span>
                </div>
                <div className="pt-4 border-t border-border/50 flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">السعر</span>
                  <span className="text-xl font-bold text-gold">{formatEGP(car.price)}</span>
                </div>
              </div>
            </article>
          ))}
        </div>
        {filtered.length === 0 && (
          <div className="text-center py-20 text-muted-foreground">لا توجد سيارات تطابق الفلتر</div>
        )}
      </section>

      <footer className="border-t border-border/50 py-8 text-center text-sm text-muted-foreground">
        © {new Date().getFullYear()} معرض السيارات جوكس — جميع الحقوق محفوظة
      </footer>
    </div>
  );
}

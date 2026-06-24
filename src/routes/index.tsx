import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { loadCars, saveCars, loadRentals, saveRentals, loadSales, saveSales, getCarFeatures, formatEGP, type Car, type CarStatus, type ListingType, type RentalRecord, type SaleRecord } from "@/lib/cars";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "معرض السيارات جوكس | أفخم السيارات" },
      { name: "description", content: "تصفح أفخر السيارات في معرض جوكس بأفضل الأسعار في مصر" },
    ],
  }),
  component: Showroom,
});

type RentPeriod = "يوم" | "أسبوع" | "شهر";
const STATUSES: (CarStatus | "الكل")[] = ["الكل", "متاح", "محجوز", "مباع", "مؤجر"];

function statusBadge(s: CarStatus) {
  const map: Record<CarStatus, string> = {
    "متاح":  "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
    "محجوز": "bg-amber-500/15  text-amber-300  border-amber-500/30",
    "مباع":  "bg-rose-500/15   text-rose-300   border-rose-500/30",
    "مؤجر":  "bg-blue-500/15   text-blue-300   border-blue-500/30",
  };
  return map[s];
}

// ─── Modal ───────────────────────────────────────────────────────────────────
function CarModal({ car, onClose, onRent, onBuy }: {
  car: Car;
  onClose: () => void;
  onRent: (car: Car, period: RentPeriod, name: string, phone: string) => void;
  onBuy: (car: Car, name: string, phone: string) => void;
}) {
  const canBuy  = (car.listingType === "بيع"   || car.listingType === "بيع وإيجار") && car.status === "متاح";
  const canRent = (car.listingType === "إيجار" || car.listingType === "بيع وإيجار") && !!car.rental && car.status === "متاح";

  const [tab, setTab]           = useState<"details" | "buy" | "rent">("details");
  const [period, setPeriod]     = useState<RentPeriod>("يوم");
  const [clientName, setName]   = useState("");
  const [clientPhone, setPhone] = useState("");

  const rentalPrice = car.rental
    ? period === "يوم" ? car.rental.pricePerDay
    : period === "أسبوع" ? car.rental.pricePerWeek
    : car.rental.pricePerMonth
    : 0;

  const features = getCarFeatures(car);

  function submitRent() {
    if (!clientName.trim() || !clientPhone.trim()) { alert("من فضلك ادخل اسم العميل ورقم الهاتف"); return; }
    onRent(car, period, clientName.trim(), clientPhone.trim());
    onClose();
  }
  function submitBuy() {
    if (!clientName.trim() || !clientPhone.trim()) { alert("من فضلك ادخل اسم المشتري ورقم الهاتف"); return; }
    onBuy(car, clientName.trim(), clientPhone.trim());
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
      <div className="relative card-luxury rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl max-h-[90vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}>
        {/* صورة */}
        <div className="aspect-[16/9] relative overflow-hidden flex-shrink-0">
          {car.image
            ? <img src={car.image} alt={`${car.brand} ${car.model}`} className="w-full h-full object-cover" />
            : <div className="w-full h-full flex items-center justify-center text-gold/30 text-7xl bg-secondary">🚗</div>}
          <div className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs border ${statusBadge(car.status)}`}>{car.status}</div>
          <button onClick={onClose} className="absolute top-3 left-3 w-8 h-8 rounded-full bg-black/50 flex items-center justify-center text-white hover:bg-black/80 transition">✕</button>
        </div>

        {/* عنوان */}
        <div className="px-6 pt-5 pb-3 flex items-baseline justify-between">
          <h2 className="text-xl font-bold">{car.brand} {car.model} <span className="text-muted-foreground text-sm font-normal">{car.year}</span></h2>
          <span className="text-xs px-2 py-1 rounded-full border border-gold/30 text-gold">{car.listingType}</span>
        </div>

        {/* تابز */}
        {(canBuy || canRent) && (
          <div className="px-6 flex gap-2 mb-4">
            <button onClick={() => setTab("details")}
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition ${tab === "details" ? "gold-gradient text-background" : "border border-border hover:border-gold/50"}`}>
              التفاصيل
            </button>
            {canBuy && (
              <button onClick={() => setTab("buy")}
                className={`flex-1 py-2 rounded-lg text-sm font-medium transition ${tab === "buy" ? "gold-gradient text-background" : "border border-border hover:border-gold/50"}`}>
                🛒 اشتري
              </button>
            )}
            {canRent && (
              <button onClick={() => setTab("rent")}
                className={`flex-1 py-2 rounded-lg text-sm font-medium transition ${tab === "rent" ? "gold-gradient text-background" : "border border-border hover:border-gold/50"}`}>
                🔑 إيجار
              </button>
            )}
          </div>
        )}

        <div className="px-6 pb-6">
          {/* تاب التفاصيل */}
          {tab === "details" && (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="bg-secondary/50 rounded-xl p-3">
                  <div className="text-muted-foreground text-xs mb-1">الوقود</div>
                  <div className="font-semibold">⛽ {car.fuel}</div>
                </div>
                <div className="bg-secondary/50 rounded-xl p-3">
                  <div className="text-muted-foreground text-xs mb-1">اللون</div>
                  <div className="font-semibold">🎨 {car.color}</div>
                </div>
              </div>
              {(car.listingType === "بيع" || car.listingType === "بيع وإيجار") && (
                <div className="rounded-xl border border-gold/20 bg-gold/5 p-4 flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">سعر البيع</span>
                  <span className="text-xl font-bold text-gold">{formatEGP(car.price)}</span>
                </div>
              )}
              {car.rental && (
                <div className="rounded-xl border border-border/50 p-4 space-y-2">
                  <div className="text-xs text-muted-foreground mb-3 font-semibold">أسعار الإيجار</div>
                  {[["اليوم", car.rental.pricePerDay], ["الأسبوع", car.rental.pricePerWeek], ["الشهر", car.rental.pricePerMonth]].map(([label, price]) => (
                    <div key={label as string} className="flex justify-between text-sm">
                      <span className="text-muted-foreground">{label}</span>
                      <span className="font-semibold text-gold">{formatEGP(price as number)}</span>
                    </div>
                  ))}
                </div>
              )}
              {/* مميزات السيارة */}
              <div className="rounded-xl border border-border/50 p-4">
                <div className="text-xs text-muted-foreground mb-3 font-semibold">⭐ مميزات السيارة</div>
                <ul className="grid grid-cols-1 gap-2">
                  {features.map((feat, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <span className="text-gold mt-0.5">✓</span>
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>
              {canBuy && (
                <button onClick={() => setTab("buy")}
                  className="w-full gold-gradient text-background font-bold py-3 rounded-xl hover:opacity-90 transition text-sm">
                  🛒 اشتري الآن
                </button>
              )}
            </div>
          )}

          {/* تاب الشراء */}
          {tab === "buy" && canBuy && (
            <div className="space-y-4">
              <div className="rounded-xl border border-gold/30 bg-gold/5 p-4 text-center">
                <div className="text-xs text-muted-foreground mb-1">سعر السيارة</div>
                <div className="text-2xl font-black text-gold">{formatEGP(car.price)}</div>
                <div className="text-xs text-muted-foreground mt-1">{car.brand} {car.model} — {car.year}</div>
              </div>
              <div className="space-y-3">
                <div>
                  <label className="text-xs text-muted-foreground mb-1.5 block">اسم المشتري</label>
                  <input type="text" value={clientName} onChange={e => setName(e.target.value)}
                    placeholder="الاسم بالكامل..."
                    className="w-full bg-input border border-border rounded-xl px-4 py-2.5 text-sm focus:border-gold outline-none transition" />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground mb-1.5 block">رقم الهاتف</label>
                  <input type="tel" value={clientPhone} onChange={e => setPhone(e.target.value)}
                    placeholder="01xxxxxxxxx" dir="ltr"
                    className="w-full bg-input border border-border rounded-xl px-4 py-2.5 text-sm focus:border-gold outline-none transition" />
                </div>
              </div>
              <button onClick={submitBuy} className="w-full gold-gradient text-background font-bold py-3 rounded-xl hover:opacity-90 transition text-sm">
                🛒 تأكيد الشراء
              </button>
            </div>
          )}

          {/* تاب الإيجار */}
          {tab === "rent" && canRent && car.rental && (
            <div className="space-y-4">
              <div>
                <label className="text-xs text-muted-foreground mb-2 block">فترة الإيجار</label>
                <div className="grid grid-cols-3 gap-2">
                  {(["يوم", "أسبوع", "شهر"] as RentPeriod[]).map(p => (
                    <button key={p} onClick={() => setPeriod(p)}
                      className={`py-2.5 rounded-xl text-sm font-medium border transition ${period === p ? "gold-gradient text-background border-transparent" : "border-border hover:border-gold/50"}`}>
                      {p}
                    </button>
                  ))}
                </div>
              </div>
              <div className="rounded-xl border border-gold/30 bg-gold/5 p-4 text-center">
                <div className="text-xs text-muted-foreground mb-1">إجمالي الإيجار</div>
                <div className="text-2xl font-black text-gold">{formatEGP(rentalPrice)}</div>
                <div className="text-xs text-muted-foreground mt-1">لمدة {period}</div>
              </div>
              <div className="space-y-3">
                <div>
                  <label className="text-xs text-muted-foreground mb-1.5 block">اسم العميل</label>
                  <input type="text" value={clientName} onChange={e => setName(e.target.value)}
                    placeholder="الاسم بالكامل..."
                    className="w-full bg-input border border-border rounded-xl px-4 py-2.5 text-sm focus:border-gold outline-none transition" />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground mb-1.5 block">رقم الهاتف</label>
                  <input type="tel" value={clientPhone} onChange={e => setPhone(e.target.value)}
                    placeholder="01xxxxxxxxx" dir="ltr"
                    className="w-full bg-input border border-border rounded-xl px-4 py-2.5 text-sm focus:border-gold outline-none transition" />
                </div>
              </div>
              <button onClick={submitRent} className="w-full gold-gradient text-background font-bold py-3 rounded-xl hover:opacity-90 transition text-sm">
                ✓ تأكيد الإيجار
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── الصفحة الرئيسية ─────────────────────────────────────────────────────────
function Showroom() {
  const [cars, setCars]               = useState<Car[]>([]);
  const [brand, setBrand]             = useState("الكل");
  const [status, setStatus]           = useState<CarStatus | "الكل">("الكل");
  const [listingFilter, setListing]   = useState<ListingType | "الكل">("الكل");
  const [maxPrice, setMaxPrice]       = useState(20000000);
  const [query, setQuery]             = useState("");
  const [selectedCar, setSelectedCar] = useState<Car | null>(null);
  const [toast, setToast]             = useState<string | null>(null);

  useEffect(() => { setCars(loadCars()); }, []);

  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(null), 3500);
  }

  function handleRent(car: Car, period: RentPeriod, clientName: string, clientPhone: string) {
    // تحديث حالة السيارة
    const updatedCars = cars.map(c => c.id === car.id ? { ...c, status: "مؤجر" as CarStatus } : c);
    setCars(updatedCars);
    saveCars(updatedCars);

    // حفظ عقد الإيجار
    const price = period === "يوم" ? car.rental!.pricePerDay : period === "أسبوع" ? car.rental!.pricePerWeek : car.rental!.pricePerMonth;
    const record: RentalRecord = {
      id: Date.now().toString(),
      carId: car.id,
      carName: `${car.brand} ${car.model}`,
      clientName,
      clientPhone,
      period,
      totalPrice: price,
      date: new Date().toLocaleDateString("ar-EG"),
    };
    const rentals = loadRentals();
    saveRentals([...rentals, record]);
    showToast(`✓ تم تأجير ${car.brand} ${car.model} للعميل ${clientName} — ${period}`);
  }

  const brands = useMemo(() => ["الكل", ...Array.from(new Set(cars.map(c => c.brand)))], [cars]);

  const filtered = cars.filter(c =>
    (brand === "الكل" || c.brand === brand) &&
    (status === "الكل" || c.status === status) &&
    (listingFilter === "الكل" || c.listingType === listingFilter) &&
    c.price <= maxPrice &&
    (query.trim() === "" || `${c.brand} ${c.model}`.toLowerCase().includes(query.trim().toLowerCase()))
  );

  const availableForRent = cars.filter(c =>
    (c.listingType === "إيجار" || c.listingType === "بيع وإيجار") && c.status === "متاح"
  ).length;

  return (
    <div className="min-h-screen">
      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] bg-emerald-600 text-white px-6 py-3 rounded-xl shadow-xl text-sm font-medium">
          {toast}
        </div>
      )}

      {selectedCar && <CarModal car={selectedCar} onClose={() => setSelectedCar(null)} onRent={handleRent} />}

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
          <div className="inline-block px-4 py-1.5 rounded-full border border-gold/30 text-gold text-xs mb-6 tracking-widest">★ معرض السيارات الفاخرة ★</div>
          <h1 className="text-5xl md:text-7xl font-black mb-6 text-gold-gradient leading-tight">معرض السيارات جوكس</h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            أفخم السيارات الجديدة والمستعملة بأفضل الأسعار في مصر — بيع وإيجار
          </p>
          <div className="mt-10 flex justify-center gap-8 text-center flex-wrap">
            {[
              { val: cars.length, label: "سيارة" },
              { val: cars.filter(c => c.status === "متاح").length, label: "متاح للبيع" },
              { val: availableForRent, label: "متاح للإيجار" },
              { val: brands.length - 1, label: "ماركة" },
            ].map((s, i) => (
              <div key={i} className="flex items-center gap-8">
                {i > 0 && <div className="w-px h-8 bg-border" />}
                <div>
                  <div className="text-3xl font-bold text-gold">{s.val}</div>
                  <div className="text-xs text-muted-foreground mt-1">{s.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="container mx-auto px-6 mb-4">
        <div className="card-luxury rounded-2xl p-6 grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div>
            <label className="text-xs text-muted-foreground mb-2 block">بحث</label>
            <input type="text" value={query} onChange={e => setQuery(e.target.value)}
              placeholder="ابحث بالماركة أو الموديل..."
              className="w-full bg-input border border-border rounded-lg px-3 py-2.5 text-foreground focus:border-gold outline-none" />
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-2 block">الماركة</label>
            <select value={brand} onChange={e => setBrand(e.target.value)}
              className="w-full bg-input border border-border rounded-lg px-3 py-2.5 text-foreground focus:border-gold outline-none">
              {brands.map(b => <option key={b}>{b}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-2 block">النوع</label>
            <div className="flex gap-2 flex-wrap">
              {(["الكل", "بيع", "إيجار", "بيع وإيجار"] as (ListingType | "الكل")[]).map(t => (
                <button key={t} onClick={() => setListing(t)}
                  className={`px-3 py-1.5 rounded-lg text-xs border transition ${listingFilter === t ? "gold-gradient text-background border-transparent font-semibold" : "border-border hover:border-gold/50"}`}>
                  {t}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-2 block">
              السعر حتى: <span className="text-gold font-semibold">{formatEGP(maxPrice)}</span>
            </label>
            <input type="range" min={400000} max={20000000} step={100000} value={maxPrice}
              onChange={e => setMaxPrice(Number(e.target.value))} className="w-full accent-[#C9A84C]" />
          </div>
        </div>
        {/* فلتر الحالة */}
        <div className="flex gap-2 flex-wrap mt-3">
          {STATUSES.map(s => (
            <button key={s} onClick={() => setStatus(s)}
              className={`px-4 py-1.5 rounded-full text-xs border transition ${status === s ? "gold-gradient text-background border-transparent font-semibold" : "border-border hover:border-gold/50"}`}>
              {s}
            </button>
          ))}
        </div>
      </section>

      {/* Grid */}
      <section className="container mx-auto px-6 pb-24">
        <p className="text-xs text-muted-foreground mb-4">{filtered.length} سيارة</p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map(car => {
            const hasRent = (car.listingType === "إيجار" || car.listingType === "بيع وإيجار") && !!car.rental;
            return (
              <article key={car.id} className="card-luxury card-luxury-hover rounded-2xl overflow-hidden cursor-pointer"
                onClick={() => setSelectedCar(car)}>
                <div className="aspect-[16/10] bg-secondary relative overflow-hidden">
                  {car.image
                    ? <img src={car.image} alt={`${car.brand} ${car.model}`} loading="lazy" className="w-full h-full object-cover transition-transform duration-500 hover:scale-105" />
                    : <div className="w-full h-full flex items-center justify-center text-gold/30 text-6xl">🚗</div>}
                  <div className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs border ${statusBadge(car.status)}`}>{car.status}</div>
                  <div className="absolute top-3 left-3 px-2 py-1 rounded-full text-xs border border-gold/30 bg-black/50 text-gold">{car.listingType}</div>
                </div>
                <div className="p-5">
                  <div className="flex items-baseline justify-between mb-2">
                    <h3 className="font-bold text-lg">{car.brand} {car.model}</h3>
                    <span className="text-xs text-muted-foreground">{car.year}</span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground mb-4">
                    <span>⛽ {car.fuel}</span><span>•</span><span>🎨 {car.color}</span>
                  </div>
                  <div className="pt-4 border-t border-border/50 space-y-2">
                    {(car.listingType === "بيع" || car.listingType === "بيع وإيجار") && (
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">سعر البيع</span>
                        <span className="text-lg font-bold text-gold">{formatEGP(car.price)}</span>
                      </div>
                    )}
                    {hasRent && car.rental && (
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">إيجار / يوم</span>
                        <span className="text-sm font-semibold text-blue-400">{formatEGP(car.rental.pricePerDay)}</span>
                      </div>
                    )}
                  </div>
                  {hasRent && car.status === "متاح" && (
                    <button onClick={e => { e.stopPropagation(); setSelectedCar(car); }}
                      className="mt-3 w-full py-2 rounded-xl border border-gold/40 text-gold text-xs hover:bg-gold/10 transition font-medium">
                      🔑 احجز للإيجار
                    </button>
                  )}
                </div>
              </article>
            );
          })}
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

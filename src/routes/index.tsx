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
const EDITABLE_STATUSES: CarStatus[] = ["متاح", "محجوز", "مباع", "مؤجر"];

function statusBadge(s: CarStatus) {
  const map: Record<CarStatus, string> = {
    "متاح":  "bg-emerald-100 text-emerald-700 border-emerald-300",
    "محجوز": "bg-amber-100  text-amber-700  border-amber-300",
    "مباع":  "bg-rose-100   text-rose-700   border-rose-300",
    "مؤجر":  "bg-blue-100   text-blue-700   border-blue-300",
  };
  return map[s];
}

const BRAND_LOGOS = ["Toyota","Kia","Hyundai","BMW","Mercedes","Nissan","Audi","Porsche","Lexus","Ford","Chevrolet","Honda","Jeep","Volkswagen","Peugeot","Tesla"];
const BRAND_EMOJI: Record<string, string> = {
  Toyota: "🚗", Kia: "🚙", Hyundai: "🚘", BMW: "🅱️", Mercedes: "⭐", Nissan: "🏁",
  Audi: "🔗", Porsche: "🏎️", Lexus: "💎", Ford: "🐎", Chevrolet: "✨", Honda: "🏍️",
  Jeep: "🧭", Volkswagen: "🚐", Peugeot: "🦁", Tesla: "⚡",
};

// ─── Modal ───────────────────────────────────────────────────────────────────
function CarModal({ car, onClose, onRent, onBuy, onEdit }: {
  car: Car;
  onClose: () => void;
  onRent: (car: Car, period: RentPeriod, quantity: number, name: string, phone: string, startDate: string, endDate: string) => void;
  onBuy: (car: Car, name: string, phone: string) => void;
  onEdit?: (updated: Car) => void;
}) {
  const canBuy  = (car.listingType === "بيع"   || car.listingType === "بيع وإيجار") && car.status === "متاح";
  const canRent = (car.listingType === "إيجار" || car.listingType === "بيع وإيجار") && !!car.rental && car.status === "متاح";

  const [tab, setTab]           = useState<"details" | "buy" | "rent">("details");
  const [period, setPeriod]     = useState<RentPeriod>("يوم");
  const [startDate, setStartDate] = useState<string>(() => new Date().toISOString().slice(0, 10));
  const [endDate, setEndDate]     = useState<string>("");
  const [clientName, setName]   = useState("");
  const [clientPhone, setPhone] = useState("");
  const [rentError, setRentError] = useState<string | null>(null);

  // quick-edit state
  const [editMode, setEditMode] = useState(false);
  const [editPrice, setEditPrice] = useState(car.price);
  const [editColor, setEditColor] = useState(car.color);
  const [editStatus, setEditStatus] = useState<CarStatus>(car.status);

  const unitPrice = car.rental
    ? period === "يوم" ? car.rental.pricePerDay
    : period === "أسبوع" ? car.rental.pricePerWeek
    : car.rental.pricePerMonth
    : 0;

  // احسب عدد الوحدات من التاريخين
  const daysBetween = (() => {
    if (!startDate || !endDate) return 0;
    const s = new Date(startDate).getTime();
    const e = new Date(endDate).getTime();
    if (isNaN(s) || isNaN(e) || e < s) return 0;
    return Math.floor((e - s) / (1000 * 60 * 60 * 24)) + 1; // inclusive
  })();
  const unitDivisor = period === "يوم" ? 1 : period === "أسبوع" ? 7 : 30;
  const safeQty = Math.max(1, Math.ceil(daysBetween / unitDivisor) || 1);
  const rentalPrice = unitPrice * safeQty;

  const features = getCarFeatures(car);

  function validateRentDates(): string | null {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const s = new Date(startDate);
    s.setHours(0, 0, 0, 0);
    const e = new Date(endDate);
    e.setHours(0, 0, 0, 0);

    if (!clientName.trim() || !clientPhone.trim()) return "من فضلك أدخل اسم العميل ورقم الهاتف";
    if (!startDate || !endDate) return "من فضلك حدد تاريخ بداية ونهاية الإيجار";
    if (isNaN(s.getTime()) || isNaN(e.getTime())) return "تاريخ غير صالح";
    if (s < today) return "تاريخ البداية لا يمكن أن يكون في الماضي";
    if (e <= s) return "تاريخ النهاية يجب أن يكون بعد تاريخ البداية على الأقل بيوم واحد";
    return null;
  }

  function submitRent() {
    const err = validateRentDates();
    if (err) { setRentError(err); return; }
    setRentError(null);
    onRent(car, period, safeQty, clientName.trim(), clientPhone.trim(), startDate, endDate);
    onClose();
  }
  function submitBuy() {
    if (!clientName.trim() || !clientPhone.trim()) { alert("من فضلك ادخل اسم المشتري ورقم الهاتف"); return; }
    onBuy(car, clientName.trim(), clientPhone.trim());
    onClose();
  }
  function submitQuickEdit() {
    if (!onEdit) return;
    onEdit({ ...car, price: Number(editPrice) || car.price, color: editColor.trim() || car.color, status: editStatus });
    setEditMode(false);
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
          <div className="flex items-center gap-2">
            <button onClick={() => setEditMode(!editMode)} className="text-xs px-3 py-1.5 rounded-full border border-gold/40 text-gold hover:bg-gold/10 transition">
              {editMode ? "إلغاء" : "✏️ تعديل سريع"}
            </button>
            <span className="text-xs px-2 py-1 rounded-full border border-gold/30 text-gold">{car.listingType}</span>
          </div>
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
              {/* نموذج التعديل السريع */}
              {editMode && (
                <div className="rounded-xl border border-gold/30 bg-gold/5 p-4 space-y-3">
                  <div className="text-xs text-muted-foreground mb-2 font-semibold">✏️ تعديل سريع</div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs text-muted-foreground mb-1 block">الحالة</label>
                      <select value={editStatus} onChange={e => setEditStatus(e.target.value as CarStatus)}
                        className="w-full bg-input border border-border rounded-lg px-3 py-2 text-sm focus:border-gold outline-none">
                        {EDITABLE_STATUSES.map(s => <option key={s}>{s}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="text-xs text-muted-foreground mb-1 block">السعر (جنيه)</label>
                      <input type="number" value={editPrice} onChange={e => setEditPrice(Number(e.target.value))}
                        className="w-full bg-input border border-border rounded-lg px-3 py-2 text-sm focus:border-gold outline-none" dir="ltr" />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground mb-1 block">اللون</label>
                    <input type="text" value={editColor} onChange={e => setEditColor(e.target.value)}
                      className="w-full bg-input border border-border rounded-lg px-3 py-2 text-sm focus:border-gold outline-none" />
                  </div>
                  <button onClick={submitQuickEdit}
                    className="w-full gold-gradient text-background font-bold py-2.5 rounded-xl hover:opacity-90 transition text-sm">
                    💾 حفظ التعديلات
                  </button>
                </div>
              )}
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
                      اشتري الآن
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
                <label className="text-xs text-muted-foreground mb-2 block">نوع الفترة</label>
                <div className="grid grid-cols-3 gap-2">
                  {(["يوم", "أسبوع", "شهر"] as RentPeriod[]).map(p => (
                    <button key={p} onClick={() => setPeriod(p)}
                      className={`py-2.5 rounded-xl text-sm font-medium border transition ${period === p ? "gold-gradient text-background border-transparent" : "border-border hover:border-gold/50"}`}>
                      {p}
                    </button>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-muted-foreground mb-1.5 block">📅 من تاريخ</label>
                  <input type="date" value={startDate} min={new Date().toISOString().slice(0, 10)}
                    onChange={e => { setStartDate(e.target.value); setRentError(null); }}
                    className="w-full bg-input border border-border rounded-xl px-3 py-2.5 text-sm focus:border-gold outline-none transition" />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground mb-1.5 block">📅 إلى تاريخ</label>
                  <input type="date" value={endDate} min={startDate || new Date().toISOString().slice(0, 10)}
                    onChange={e => { setEndDate(e.target.value); setRentError(null); }}
                    className="w-full bg-input border border-border rounded-xl px-3 py-2.5 text-sm focus:border-gold outline-none transition" />
                </div>
              </div>
              {rentError && (
                <div className="text-xs text-rose-600 bg-rose-50 border border-rose-200 rounded-lg px-3 py-2 flex items-center gap-1.5">
                  <span>⚠️</span>
                  <span>{rentError}</span>
                </div>
              )}
              <div className="text-[11px] text-muted-foreground -mt-1">
                السعر لكل {period}: {formatEGP(unitPrice)}
                {daysBetween > 0 && <> — إجمالي المدة: {daysBetween} يوم ({safeQty} {period})</>}
              </div>
              <div className="rounded-xl border border-gold/30 bg-gold/5 p-4 text-center">
                <div className="text-xs text-muted-foreground mb-1">إجمالي الإيجار</div>
                <div className="text-2xl font-black text-gold">{formatEGP(rentalPrice)}</div>
                <div className="text-xs text-muted-foreground mt-1">
                  {daysBetween > 0 ? `من ${startDate} إلى ${endDate}` : `لمدة ${safeQty} ${period}`}
                </div>
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
  const [brandSplash, setBrandSplash] = useState<string | null>(null);

  const pickBrand = (b: string) => {
    setBrand(b);
    setBrandSplash(b);
    setTimeout(() => {
      setBrandSplash(null);
      document.getElementById("cars")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 900);
  };

  useEffect(() => { setCars(loadCars()); }, []);

  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(null), 3500);
  }

  function handleRent(car: Car, period: RentPeriod, quantity: number, clientName: string, clientPhone: string, startDate: string, endDate: string) {
    // تحديث حالة السيارة
    const updatedCars = cars.map(c => c.id === car.id ? { ...c, status: "مؤجر" as CarStatus } : c);
    setCars(updatedCars);
    saveCars(updatedCars);

    // حفظ عقد الإيجار
    const unit = period === "يوم" ? car.rental!.pricePerDay : period === "أسبوع" ? car.rental!.pricePerWeek : car.rental!.pricePerMonth;
    const qty = Math.max(1, Math.floor(quantity) || 1);
    const record: RentalRecord = {
      id: Date.now().toString(),
      carId: car.id,
      carName: `${car.brand} ${car.model}`,
      clientName,
      clientPhone,
      period,
      quantity: qty,
      totalPrice: unit * qty,
      date: new Date().toLocaleDateString("ar-EG"),
      startDate,
      endDate,
    };
    const rentals = loadRentals();
    saveRentals([...rentals, record]);
    showToast(`✓ تم تأجير ${car.brand} ${car.model} للعميل ${clientName} من ${startDate} إلى ${endDate}`);
  }

  function handleBuy(car: Car, clientName: string, clientPhone: string) {
    const updatedCars = cars.map(c => c.id === car.id ? { ...c, status: "مباع" as CarStatus } : c);
    setCars(updatedCars);
    saveCars(updatedCars);
    const record: SaleRecord = {
      id: Date.now().toString(),
      carId: car.id,
      carName: `${car.brand} ${car.model}`,
      clientName,
      clientPhone,
      price: car.price,
      date: new Date().toLocaleDateString("ar-EG"),
    };
    saveSales([...loadSales(), record]);
    showToast(`🛒 تم بيع ${car.brand} ${car.model} للعميل ${clientName}`);
  }

  function handleQuickEdit(updated: Car) {
    const updatedCars = cars.map(c => c.id === updated.id ? updated : c);
    setCars(updatedCars);
    saveCars(updatedCars);
    setSelectedCar(updated);
    showToast(`✏️ تم تحديث ${updated.brand} ${updated.model}`);
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

      {selectedCar && <CarModal car={selectedCar} onClose={() => setSelectedCar(null)} onRent={handleRent} onBuy={handleBuy} onEdit={handleQuickEdit} />}

      {/* Top contact bar */}
      <div className="bg-[#1a1a1a] text-white text-xs">
        <div className="container mx-auto px-6 py-2 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span>📞 01206178908</span>
            <span className="hidden sm:inline opacity-70">خدمة عملاء على مدار الساعة</span>
          </div>
          <div className="opacity-70 hidden sm:block">hghs;k]vdm — مصر</div>
        </div>
      </div>

      {/* Nav (orange) */}
      <header className="hero-banner sticky top-0 z-50 shadow-lg">
        <div className="container mx-auto px-6 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-lg bg-white text-[#f4511e] flex items-center justify-center font-black text-xl shadow-md">ج</div>
            <div>
              <div className="font-black text-lg leading-tight">معرض جوكس</div>
              <div className="text-[10px] opacity-90 -mt-0.5">Auto Group</div>
            </div>
          </div>
          <nav className="hidden md:flex items-center gap-6 text-sm font-semibold">
            <a href="#cars" className="hover:opacity-80">السيارات</a>
            <a href="#search" className="hover:opacity-80">ابحث</a>
            <a href="#brands" className="hover:opacity-80">الماركات</a>
            <Link to="/dashboard" className="hover:opacity-80">لوحة التحكم</Link>
          </nav>
          <a href="#search" className="bg-white text-[#f4511e] text-xs font-bold px-4 py-2 rounded-full shadow hover:scale-105 transition">
            🚗 اطلب سيارة
          </a>
        </div>
      </header>

      {/* Hero — Ellaithy style finance offer */}
      <section className="hero-banner relative overflow-hidden">
        <div className="hero-cars" aria-hidden="true">
          {[
            { emoji: "🚗", top: "12%", size: "3.5rem", duration: "18s", delay: "0s",   dir: "rtl" },
            { emoji: "🏎️", top: "32%", size: "3rem",   duration: "12s", delay: "3s",   dir: "rtl" },
            { emoji: "🚙", top: "55%", size: "4rem",   duration: "22s", delay: "1.5s", dir: "ltr" },
            { emoji: "🚘", top: "72%", size: "2.8rem", duration: "16s", delay: "6s",   dir: "rtl" },
            { emoji: "🛻", top: "88%", size: "3.2rem", duration: "20s", delay: "4s",   dir: "ltr" },
          ].map((c, i) => (
            <span key={i}
              style={{
                top: c.top, fontSize: c.size,
                animation: `${c.dir === "rtl" ? "car-drive-rtl" : "car-drive-ltr"} ${c.duration} linear ${c.delay} infinite`,
                opacity: 0.22,
              }}>
              {c.emoji}
            </span>
          ))}
        </div>
        <div className="container mx-auto px-6 py-20 md:py-28 relative z-10 text-center">
          <div className="inline-block bg-white/15 backdrop-blur px-4 py-1.5 rounded-full text-xs font-semibold mb-6 border border-white/30">
            🎉 أقوى عروض التمويل في مصر
          </div>
          <div className="flex items-center justify-center gap-3 md:gap-6 mb-4 flex-wrap">
            <span className="text-3xl md:text-5xl font-bold drop-shadow">{"\n"}</span>
            <span className="text-7xl md:text-[10rem] font-black leading-none drop-shadow-lg" style={{textShadow:"0 6px 30px rgba(0,0,0,0.25)"}}>{"\n"}<span className="text-4xl md:text-7xl align-top"></span></span>
          </div>
          <p className="text-lg md:text-2xl font-semibold mb-2">على جميع السيارات الجديدة</p>
          <p className="text-sm md:text-base opacity-90 mb-8">مقدم يبدأ من 30% • أقساط حتى 60 شهر • موافقة فورية</p>
          <div className="flex justify-center gap-3 flex-wrap">
            <a href="#search" className="bg-white text-[#f4511e] font-bold px-6 py-3 rounded-full shadow-lg hover:scale-105 transition">🔍 ابحث عن سيارتك</a>
            <a href="#cars" className="bg-black/30 backdrop-blur border border-white/40 text-white font-bold px-6 py-3 rounded-full hover:bg-black/40 transition">تصفح المعرض</a>
          </div>
          <div className="mt-12 flex justify-center gap-6 md:gap-12 text-center flex-wrap">
            {[
              { val: cars.length, label: "سيارة متوفرة" },
              { val: cars.filter(c => c.status === "متاح").length, label: "متاح للبيع" },
              { val: availableForRent, label: "متاح للإيجار" },
              { val: brands.length - 1, label: "ماركة عالمية" },
            ].map((s, i) => (
              <div key={i}>
                <div className="text-3xl md:text-4xl font-black">{s.val}</div>
                <div className="text-xs opacity-90 mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Brand marquee */}
      <section id="brands" className="bg-white border-y border-border py-5 overflow-hidden">
        <div className="brand-marquee">
          {[...BRAND_LOGOS, ...BRAND_LOGOS].map((b, i) => (
            <span key={i} className="text-2xl font-black text-muted-foreground/60 whitespace-nowrap tracking-wider">
              {b}
            </span>
          ))}
        </div>
      </section>


      {/* Filters */}
      <section id="search" className="container mx-auto px-6 mt-10 mb-4">
        <div className="text-center mb-6">
          <h2 className="text-3xl font-black text-foreground">البحث عن سيارتك</h2>
          <div className="w-16 h-1 gold-gradient rounded-full mx-auto mt-2"></div>
        </div>
        <div className="card-luxury rounded-2xl p-6 grid md:grid-cols-2 lg:grid-cols-4 gap-6 border-2 border-[#f4511e]/30">

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
      <section id="cars" className="container mx-auto px-6 pb-24 pt-8">
        <div className="flex items-end justify-between mb-6">
          <div>
            <h2 className="text-2xl font-black">السيارات المتاحة</h2>
            <p className="text-xs text-muted-foreground mt-1">{filtered.length} سيارة معروضة</p>
          </div>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map(car => {
            const hasRent = (car.listingType === "إيجار" || car.listingType === "بيع وإيجار") && !!car.rental;
            const canBuy = (car.listingType === "بيع" || car.listingType === "بيع وإيجار") && car.status === "متاح";
            return (
              <article key={car.id} className="card-luxury card-luxury-hover rounded-2xl overflow-hidden cursor-pointer"
                onClick={() => setSelectedCar(car)}>
                <div className="aspect-[16/10] bg-secondary relative overflow-hidden">
                  {car.image
                    ? <img src={car.image} alt={`${car.brand} ${car.model}`} loading="lazy" className="w-full h-full object-cover transition-transform duration-500 hover:scale-105" />
                    : <div className="w-full h-full flex items-center justify-center text-[#f4511e]/30 text-6xl">🚗</div>}
                  <div className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs border ${statusBadge(car.status)}`}>{car.status}</div>
                  <div className="absolute top-3 left-3 px-2 py-1 rounded-full text-xs gold-gradient font-semibold shadow">{car.listingType}</div>
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
                  {canBuy && (
                    <button onClick={e => { e.stopPropagation(); setSelectedCar(car); }}
                      className="mt-3 w-full py-2.5 rounded-xl gold-gradient text-background text-sm font-bold hover:opacity-90 transition flex items-center justify-center gap-2">
                      اشتري الآن
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

      <footer className="bg-[#1a1a1a] text-white/80 py-10">
        <div className="container mx-auto px-6 grid md:grid-cols-3 gap-8 text-sm">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg gold-gradient flex items-center justify-center font-black text-xl">ج</div>
              <span className="font-black text-white">معرض جوكس Auto Group</span>
            </div>
            <p className="opacity-70">وكيل معتمد لأفخم الماركات في مصر — بيع وإيجار وتمويل بأفضل الأسعار.</p>
          </div>
          <div>
            <h4 className="font-bold text-white mb-3">روابط سريعة</h4>
            <ul className="space-y-2 opacity-80">
              <li><a href="#cars" className="hover:text-[#ff7a18]">السيارات الجديدة</a></li>
              <li><a href="#search" className="hover:text-[#ff7a18]">البحث المتقدم</a></li>
              <li><Link to="/dashboard" className="hover:text-[#ff7a18]">لوحة التحكم</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-white mb-3">تواصل معنا</h4>
            <ul className="space-y-2 opacity-80">
              <li>📞 01206178908</li>
              <li>📍 hghs;k]vdm — مصر</li>
              <li>🕐 خدمة 24/7</li>
            </ul>
          </div>
        </div>
        <div className="container mx-auto px-6 mt-8 pt-6 border-t border-white/10 text-center text-xs opacity-60">
          © {new Date().getFullYear()} معرض السيارات جوكس — جميع الحقوق محفوظة
        </div>
      </footer>

    </div>
  );
}

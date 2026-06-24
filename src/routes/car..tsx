import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { loadCars, saveCars, loadRentals, saveRentals, formatEGP, type Car, type CarStatus, type RentalRecord } from "@/lib/cars";

export const Route = createFileRoute("/car/$id")({
  component: CarDetail,
});

type RentPeriod = "يوم" | "أسبوع" | "شهر";

function statusBadge(s: CarStatus) {
  const map: Record<CarStatus, string> = {
    "متاح":  "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
    "محجوز": "bg-amber-500/15  text-amber-300  border-amber-500/30",
    "مباع":  "bg-rose-500/15   text-rose-300   border-rose-500/30",
    "مؤجر":  "bg-blue-500/15   text-blue-300   border-blue-500/30",
  };
  return map[s];
}

function CarDetail() {
  const { id } = Route.useParams();
  const navigate = useNavigate();

  const [cars, setCars]           = useState<Car[]>([]);
  const [period, setPeriod]       = useState<RentPeriod>("يوم");
  const [clientName, setName]     = useState("");
  const [clientPhone, setPhone]   = useState("");
  const [toast, setToast]         = useState<string | null>(null);
  const [showRent, setShowRent]   = useState(false);

  useEffect(() => { setCars(loadCars()); }, []);

  const car = cars.find(c => c.id === id);

  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(null), 3500);
  }

  function handleRent() {
    if (!car || !car.rental) return;
    if (!clientName.trim() || !clientPhone.trim()) {
      showToast("⚠ من فضلك ادخل اسم العميل ورقم الهاتف");
      return;
    }
    const price = period === "يوم" ? car.rental.pricePerDay
      : period === "أسبوع" ? car.rental.pricePerWeek
      : car.rental.pricePerMonth;

    const updatedCars = cars.map(c => c.id === car.id ? { ...c, status: "مؤجر" as CarStatus } : c);
    setCars(updatedCars);
    saveCars(updatedCars);

    const record: RentalRecord = {
      id: Date.now().toString(),
      carId: car.id,
      carName: `${car.brand} ${car.model}`,
      clientName: clientName.trim(),
      clientPhone: clientPhone.trim(),
      period,
      totalPrice: price,
      date: new Date().toLocaleDateString("ar-EG"),
    };
    saveRentals([...loadRentals(), record]);
    setName(""); setPhone(""); setShowRent(false);
    showToast(`✓ تم تأجير السيارة للعميل ${clientName.trim()}`);
  }

  if (cars.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-muted-foreground">جاري التحميل...</div>
      </div>
    );
  }

  if (!car) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <div className="text-4xl">🚗</div>
        <div className="text-xl font-bold">السيارة غير موجودة</div>
        <Link to="/" className="text-gold hover:underline text-sm">← العودة للمعرض</Link>
      </div>
    );
  }

  const canRent = (car.listingType === "إيجار" || car.listingType === "بيع وإيجار") && !!car.rental && car.status === "متاح";
  const canBuy  = (car.listingType === "بيع"  || car.listingType === "بيع وإيجار");

  const rentalPrice = car.rental
    ? period === "يوم" ? car.rental.pricePerDay
    : period === "أسبوع" ? car.rental.pricePerWeek
    : car.rental.pricePerMonth
    : 0;

  return (
    <div className="min-h-screen">
      {/* Toast */}
      {toast && (
        <div className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] px-6 py-3 rounded-xl shadow-xl text-sm font-medium text-white ${toast.startsWith("⚠") ? "bg-amber-600" : "bg-emerald-600"}`}>
          {toast}
        </div>
      )}

      {/* Nav */}
      <header className="border-b border-border/50 backdrop-blur-md sticky top-0 z-50 bg-background/80">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition">
              <div className="w-10 h-10 rounded-lg gold-gradient flex items-center justify-center font-black text-background text-xl">ج</div>
              <span className="font-bold text-lg">معرض جوكس</span>
            </Link>
          </div>
          <button onClick={() => navigate({ to: "/" })}
            className="text-sm px-4 py-2 rounded-lg border border-border hover:border-gold/50 transition flex items-center gap-2">
            ← العودة للمعرض
          </button>
        </div>
      </header>

      <div className="container mx-auto px-6 py-10 max-w-5xl">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-muted-foreground mb-8">
          <Link to="/" className="hover:text-gold transition">المعرض</Link>
          <span>/</span>
          <span className="text-foreground">{car.brand} {car.model}</span>
        </div>

        <div className="grid lg:grid-cols-2 gap-10">
          {/* الصورة */}
          <div className="space-y-4">
            <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-secondary relative">
              {car.image
                ? <img src={car.image} alt={`${car.brand} ${car.model}`}
                    className="w-full h-full object-cover" />
                : <div className="w-full h-full flex items-center justify-center text-gold/20 text-9xl">🚗</div>
              }
              {/* badges */}
              <div className={`absolute top-4 right-4 px-3 py-1.5 rounded-full text-sm border font-medium ${statusBadge(car.status)}`}>
                {car.status}
              </div>
              <div className="absolute top-4 left-4 px-3 py-1.5 rounded-full text-xs border border-gold/30 bg-black/60 text-gold">
                {car.listingType}
              </div>
            </div>
          </div>

          {/* التفاصيل */}
          <div className="space-y-6">
            {/* العنوان */}
            <div>
              <p className="text-sm text-muted-foreground mb-1">{car.brand}</p>
              <h1 className="text-4xl font-black mb-1">{car.model}</h1>
              <p className="text-muted-foreground">{car.year}</p>
            </div>

            {/* مواصفات */}
            <div className="grid grid-cols-2 gap-3">
              {[
                { icon: "⛽", label: "الوقود",  val: car.fuel  },
                { icon: "🎨", label: "اللون",   val: car.color },
                { icon: "📅", label: "السنة",   val: String(car.year) },
                { icon: "📋", label: "الإتاحة", val: car.listingType },
              ].map(({ icon, label, val }) => (
                <div key={label} className="card-luxury rounded-xl p-4">
                  <div className="text-xs text-muted-foreground mb-1">{icon} {label}</div>
                  <div className="font-bold">{val}</div>
                </div>
              ))}
            </div>

            {/* سعر البيع */}
            {canBuy && (
              <div className="card-luxury rounded-xl p-5 border border-gold/20">
                <div className="text-xs text-muted-foreground mb-1">سعر البيع</div>
                <div className="text-3xl font-black text-gold">{formatEGP(car.price)}</div>
              </div>
            )}

            {/* أسعار الإيجار */}
            {car.rental && (
              <div className="card-luxury rounded-xl p-5">
                <div className="text-sm font-bold mb-4 text-muted-foreground">أسعار الإيجار</div>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { label: "اليوم",    price: car.rental.pricePerDay   },
                    { label: "الأسبوع", price: car.rental.pricePerWeek  },
                    { label: "الشهر",   price: car.rental.pricePerMonth },
                  ].map(({ label, price }) => (
                    <div key={label} className="text-center bg-secondary/50 rounded-xl p-3">
                      <div className="text-xs text-muted-foreground mb-1">{label}</div>
                      <div className="font-bold text-gold text-sm">{formatEGP(price)}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* أزرار */}
            <div className="space-y-3">
              {canRent && !showRent && (
                <button onClick={() => setShowRent(true)}
                  className="w-full gold-gradient text-background font-bold py-4 rounded-xl hover:opacity-90 transition text-base">
                  🔑 احجز للإيجار
                </button>
              )}
              {car.status !== "متاح" && (
                <div className="w-full text-center py-4 rounded-xl border border-border text-muted-foreground text-sm">
                  هذه السيارة غير متاحة حالياً
                </div>
              )}
            </div>

            {/* فورم الإيجار */}
            {canRent && showRent && (
              <div className="card-luxury rounded-2xl p-6 border border-gold/20 space-y-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-bold text-lg">بيانات الإيجار</h3>
                  <button onClick={() => setShowRent(false)} className="text-muted-foreground hover:text-foreground text-xl">✕</button>
                </div>

                {/* اختيار الفترة */}
                <div>
                  <label className="text-xs text-muted-foreground mb-2 block">فترة الإيجار</label>
                  <div className="grid grid-cols-3 gap-2">
                    {(["يوم", "أسبوع", "شهر"] as RentPeriod[]).map(p => (
                      <button key={p} onClick={() => setPeriod(p)}
                        className={`py-3 rounded-xl text-sm font-medium border transition ${period === p ? "gold-gradient text-background border-transparent" : "border-border hover:border-gold/50"}`}>
                        {p}
                      </button>
                    ))}
                  </div>
                </div>

                {/* السعر */}
                <div className="rounded-xl border border-gold/30 bg-gold/5 p-4 text-center">
                  <div className="text-xs text-muted-foreground mb-1">الإجمالي</div>
                  <div className="text-2xl font-black text-gold">{formatEGP(rentalPrice)}</div>
                  <div className="text-xs text-muted-foreground mt-1">لمدة {period}</div>
                </div>

                {/* بيانات العميل */}
                <div className="space-y-3">
                  <div>
                    <label className="text-xs text-muted-foreground mb-1.5 block">اسم العميل</label>
                    <input type="text" value={clientName} onChange={e => setName(e.target.value)}
                      placeholder="الاسم بالكامل..."
                      className="w-full bg-input border border-border rounded-xl px-4 py-3 text-sm focus:border-gold outline-none transition" />
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground mb-1.5 block">رقم الهاتف</label>
                    <input type="tel" value={clientPhone} onChange={e => setPhone(e.target.value)}
                      placeholder="01xxxxxxxxx" dir="ltr"
                      className="w-full bg-input border border-border rounded-xl px-4 py-3 text-sm focus:border-gold outline-none transition" />
                  </div>
                </div>

                <button onClick={handleRent}
                  className="w-full gold-gradient text-background font-bold py-3 rounded-xl hover:opacity-90 transition">
                  ✓ تأكيد الإيجار
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <footer className="border-t border-border/50 py-8 text-center text-sm text-muted-foreground mt-16">
        © {new Date().getFullYear()} معرض السيارات جوكس — جميع الحقوق محفوظة
      </footer>
    </div>
  );
}

export type CarStatus = "متاح" | "محجوز" | "مباع" | "مؤجر";
export type FuelType = "بنزين" | "ديزل" | "كهربائي" | "هجين";
export type ListingType = "بيع" | "إيجار" | "بيع وإيجار";

export interface RentalPricing {
  pricePerDay: number;
  pricePerWeek: number;
  pricePerMonth: number;
}

export interface Car {
  id: string;
  brand: string;
  model: string;
  year: number;
  price: number;
  color: string;
  fuel: FuelType;
  status: CarStatus;
  image?: string;
  listingType: ListingType;
  rental?: RentalPricing;
  features?: string[];
}

export interface SaleRecord {
  id: string;
  carId: string;
  carName: string;
  clientName: string;
  clientPhone: string;
  price: number;
  date: string;
}

const SALES_KEY = "jox_sales_v1";

/**
 * يرجع قائمة مميزات السيارة. لو السيارة فيها features يستخدمها،
 * وإلا يولد قائمة منطقية بناءً على الفئة السعرية والوقود والماركة.
 */
export function getCarFeatures(car: Car): string[] {
  if (car.features && car.features.length) return car.features;

  const f: string[] = [];
  const luxuryBrands = ["BMW", "Mercedes", "Audi", "Porsche", "Lexus"];
  const isLuxury = luxuryBrands.includes(car.brand) || car.price >= 4_000_000;
  const isMid = !isLuxury && car.price >= 1_200_000;

  // وقود
  if (car.fuel === "كهربائي") {
    f.push("محرك كهربائي 100%", "مدى يصل إلى 450 كم", "شحن سريع DC", "صفر انبعاثات");
  } else if (car.fuel === "هجين") {
    f.push("نظام هجين موفر للوقود", "استرجاع طاقة الفرامل", "وضع كهربائي للسرعات المنخفضة");
  } else if (car.fuel === "ديزل") {
    f.push("محرك ديزل تيربو عالي العزم", "اقتصادي في استهلاك الوقود");
  } else {
    f.push("محرك بنزين اقتصادي", "ناقل حركة أوتوماتيك");
  }

  // الأمان
  f.push("وسائد هوائية متعددة", "نظام ABS و EBD", "نظام تثبيت إلكتروني ESP");
  if (isLuxury) f.push("مثبت سرعة تكيفي", "نظام تنبيه المسار", "كاميرا 360°");
  else if (isMid) f.push("كاميرا خلفية + حساسات ركن");

  // الراحة والترفيه
  if (isLuxury) {
    f.push("شاشة لمس كبيرة + Apple CarPlay / Android Auto", "نظام صوت محيطي", "مقاعد جلد كهربائية مع تدفئة وتبريد", "فتحة سقف بانورامية", "إضاءة LED ذكية");
  } else if (isMid) {
    f.push("شاشة لمس + Apple CarPlay / Android Auto", "مكيف هواء أوتوماتيك", "بلوتوث ومنافذ USB", "جنوط ألومنيوم");
  } else {
    f.push("راديو + بلوتوث", "مكيف هواء", "زجاج كهربائي وقفل مركزي");
  }

  // إضافات حسب نوع الجسم (تخمين من الموديل)
  const suvKeywords = ["X", "Q", "Tucson", "Sportage", "Cayenne", "Rush", "Tiggo", "Patrol", "Land Cruiser", "Outlander", "Eclipse", "Duster", "Vitara", "3008", "ZS", "HS", "Wrangler"];
  if (suvKeywords.some(k => car.model.includes(k))) f.push("دفع رباعي AWD", "خلوص أرضي عالي");

  return f;
}

export interface RentalRecord {
  id: string;
  carId: string;
  carName: string;
  clientName: string;
  clientPhone: string;
  period: "يوم" | "أسبوع" | "شهر";
  totalPrice: number;
  date: string;
}

const KEY = "jox_cars_v7";
const RENTALS_KEY = "jox_rentals_v1";

// صور من Unsplash - مضمونة التحميل
const seed: Car[] = [
  // ===== Toyota =====
  { id: "1", brand: "Toyota", model: "Corolla", year: 2025, price: 1450000, color: "أبيض", fuel: "بنزين", status: "متاح", listingType: "بيع وإيجار",
    image: "https://images.unsplash.com/photo-1623869675781-80aa31012a5a?w=800&auto=format&fit=crop",
    rental: { pricePerDay: 1800, pricePerWeek: 10000, pricePerMonth: 32000 } },
  { id: "2", brand: "Toyota", model: "Camry", year: 2025, price: 1950000, color: "أسود", fuel: "هجين", status: "متاح", listingType: "بيع وإيجار",
    image: "https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=800&auto=format&fit=crop",
    rental: { pricePerDay: 2500, pricePerWeek: 14000, pricePerMonth: 45000 } },
  { id: "3", brand: "Toyota", model: "Yaris", year: 2025, price: 785000, color: "أحمر", fuel: "بنزين", status: "متاح", listingType: "بيع وإيجار",
    image: "https://images.unsplash.com/photo-1590362891991-f776e747a588?w=800&auto=format&fit=crop",
    rental: { pricePerDay: 1200, pricePerWeek: 7000, pricePerMonth: 22000 } },
  { id: "4", brand: "Toyota", model: "Land Cruiser", year: 2025, price: 10700000, color: "أبيض", fuel: "بنزين", status: "متاح", listingType: "بيع",
    image: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800&auto=format&fit=crop" },
  { id: "5", brand: "Toyota", model: "Rush", year: 2025, price: 1050000, color: "رمادي", fuel: "بنزين", status: "متاح", listingType: "بيع وإيجار",
    image: "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800&auto=format&fit=crop",
    rental: { pricePerDay: 1500, pricePerWeek: 8500, pricePerMonth: 28000 } },

  // ===== Nissan =====
  { id: "6", brand: "Nissan", model: "Sunny", year: 2025, price: 750000, color: "أبيض", fuel: "بنزين", status: "متاح", listingType: "بيع وإيجار",
    image: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&auto=format&fit=crop",
    rental: { pricePerDay: 1000, pricePerWeek: 6000, pricePerMonth: 18000 } },
  { id: "7", brand: "Nissan", model: "Patrol", year: 2025, price: 11050000, color: "أبيض", fuel: "بنزين", status: "متاح", listingType: "بيع",
    image: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800&auto=format&fit=crop" },
  { id: "8", brand: "Nissan", model: "Sentra", year: 2025, price: 960000, color: "فضي", fuel: "بنزين", status: "متاح", listingType: "بيع وإيجار",
    image: "https://images.unsplash.com/photo-1619767886558-efdc259cde1a?w=800&auto=format&fit=crop",
    rental: { pricePerDay: 1300, pricePerWeek: 7500, pricePerMonth: 24000 } },

  // ===== Hyundai =====
  { id: "9", brand: "Hyundai", model: "Elantra", year: 2025, price: 1375000, color: "فضي", fuel: "بنزين", status: "متاح", listingType: "بيع وإيجار",
    image: "https://images.unsplash.com/photo-1619767886558-efdc259cde1a?w=800&auto=format&fit=crop",
    rental: { pricePerDay: 1600, pricePerWeek: 9500, pricePerMonth: 30000 } },
  { id: "10", brand: "Hyundai", model: "Accent", year: 2025, price: 790000, color: "أبيض", fuel: "بنزين", status: "متاح", listingType: "بيع وإيجار",
    image: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&auto=format&fit=crop",
    rental: { pricePerDay: 1100, pricePerWeek: 6500, pricePerMonth: 20000 } },
  { id: "11", brand: "Hyundai", model: "Tucson", year: 2025, price: 1700000, color: "أزرق", fuel: "بنزين", status: "متاح", listingType: "بيع وإيجار",
    image: "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=800&auto=format&fit=crop",
    rental: { pricePerDay: 2200, pricePerWeek: 13000, pricePerMonth: 40000 } },
  { id: "12", brand: "Hyundai", model: "Santa Fe", year: 2025, price: 2400000, color: "أسود", fuel: "هجين", status: "متاح", listingType: "بيع وإيجار",
    image: "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800&auto=format&fit=crop",
    rental: { pricePerDay: 3000, pricePerWeek: 17000, pricePerMonth: 55000 } },

  // ===== Kia =====
  { id: "13", brand: "Kia", model: "Cerato", year: 2025, price: 900000, color: "أحمر", fuel: "بنزين", status: "متاح", listingType: "بيع وإيجار",
    image: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&auto=format&fit=crop",
    rental: { pricePerDay: 1300, pricePerWeek: 7500, pricePerMonth: 24000 } },
  { id: "14", brand: "Kia", model: "Sportage", year: 2025, price: 1650000, color: "رمادي", fuel: "بنزين", status: "متاح", listingType: "بيع وإيجار",
    image: "https://images.unsplash.com/photo-1609521263047-f8f205293f24?w=800&auto=format&fit=crop",
    rental: { pricePerDay: 2000, pricePerWeek: 12000, pricePerMonth: 38000 } },
  { id: "15", brand: "Kia", model: "Picanto", year: 2025, price: 530000, color: "أبيض", fuel: "بنزين", status: "متاح", listingType: "بيع وإيجار",
    image: "https://images.unsplash.com/photo-1590362891991-f776e747a588?w=800&auto=format&fit=crop",
    rental: { pricePerDay: 900, pricePerWeek: 5500, pricePerMonth: 16000 } },

  // ===== MG =====
  { id: "16", brand: "MG", model: "MG5", year: 2025, price: 740000, color: "أبيض", fuel: "بنزين", status: "متاح", listingType: "بيع وإيجار",
    image: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&auto=format&fit=crop",
    rental: { pricePerDay: 1100, pricePerWeek: 6500, pricePerMonth: 20000 } },
  { id: "17", brand: "MG", model: "MG6", year: 2025, price: 980000, color: "أسود", fuel: "بنزين", status: "متاح", listingType: "بيع وإيجار",
    image: "https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?w=800&auto=format&fit=crop",
    rental: { pricePerDay: 1400, pricePerWeek: 8000, pricePerMonth: 26000 } },
  { id: "18", brand: "MG", model: "ZS", year: 2025, price: 850000, color: "رمادي", fuel: "بنزين", status: "متاح", listingType: "بيع وإيجار",
    image: "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800&auto=format&fit=crop",
    rental: { pricePerDay: 1200, pricePerWeek: 7000, pricePerMonth: 22000 } },
  { id: "19", brand: "MG", model: "HS", year: 2025, price: 1250000, color: "أحمر", fuel: "بنزين", status: "محجوز", listingType: "بيع وإيجار",
    image: "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=800&auto=format&fit=crop",
    rental: { pricePerDay: 1800, pricePerWeek: 10500, pricePerMonth: 34000 } },
  { id: "20", brand: "MG", model: "MG4 EV", year: 2025, price: 1100000, color: "أبيض", fuel: "كهربائي", status: "متاح", listingType: "بيع وإيجار",
    image: "https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=800&auto=format&fit=crop",
    rental: { pricePerDay: 1600, pricePerWeek: 9000, pricePerMonth: 29000 } },

  // ===== Chery =====
  { id: "21", brand: "Chery", model: "Tiggo 4 Pro", year: 2025, price: 750000, color: "أبيض", fuel: "بنزين", status: "متاح", listingType: "بيع وإيجار",
    image: "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800&auto=format&fit=crop",
    rental: { pricePerDay: 1100, pricePerWeek: 6500, pricePerMonth: 20000 } },
  { id: "22", brand: "Chery", model: "Tiggo 7 Pro", year: 2025, price: 1100000, color: "رمادي", fuel: "بنزين", status: "متاح", listingType: "بيع وإيجار",
    image: "https://images.unsplash.com/photo-1609521263047-f8f205293f24?w=800&auto=format&fit=crop",
    rental: { pricePerDay: 1500, pricePerWeek: 9000, pricePerMonth: 28000 } },
  { id: "23", brand: "Chery", model: "Tiggo 8 Pro", year: 2025, price: 1550000, color: "أسود", fuel: "بنزين", status: "متاح", listingType: "بيع",
    image: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800&auto=format&fit=crop" },

  // ===== BMW =====
  { id: "24", brand: "BMW", model: "X3", year: 2025, price: 5300000, color: "أسود", fuel: "بنزين", status: "متاح", listingType: "بيع وإيجار",
    image: "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800&auto=format&fit=crop",
    rental: { pricePerDay: 5500, pricePerWeek: 32000, pricePerMonth: 100000 } },
  { id: "25", brand: "BMW", model: "X5", year: 2025, price: 8500000, color: "رمادي", fuel: "بنزين", status: "متاح", listingType: "بيع وإيجار",
    image: "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800&auto=format&fit=crop",
    rental: { pricePerDay: 8000, pricePerWeek: 48000, pricePerMonth: 150000 } },
  { id: "26", brand: "BMW", model: "520i", year: 2025, price: 6100000, color: "أبيض", fuel: "بنزين", status: "متاح", listingType: "بيع",
    image: "https://images.unsplash.com/photo-1556189250-72ba954cfc2b?w=800&auto=format&fit=crop" },

  // ===== Mercedes =====
  { id: "27", brand: "Mercedes", model: "C200", year: 2025, price: 4500000, color: "أسود", fuel: "بنزين", status: "متاح", listingType: "بيع وإيجار",
    image: "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800&auto=format&fit=crop",
    rental: { pricePerDay: 5000, pricePerWeek: 28000, pricePerMonth: 90000 } },
  { id: "28", brand: "Mercedes", model: "E200", year: 2025, price: 4920000, color: "رمادي", fuel: "بنزين", status: "متاح", listingType: "بيع وإيجار",
    image: "https://images.unsplash.com/photo-1617531653332-bd46c24f2068?w=800&auto=format&fit=crop",
    rental: { pricePerDay: 6000, pricePerWeek: 35000, pricePerMonth: 110000 } },
  { id: "29", brand: "Mercedes", model: "G63 AMG", year: 2025, price: 18650000, color: "أسود", fuel: "بنزين", status: "متاح", listingType: "بيع",
    image: "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800&auto=format&fit=crop" },

  // ===== Audi =====
  { id: "30", brand: "Audi", model: "A6", year: 2025, price: 5248999, color: "أبيض", fuel: "بنزين", status: "متاح", listingType: "بيع وإيجار",
    image: "https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?w=800&auto=format&fit=crop",
    rental: { pricePerDay: 5500, pricePerWeek: 32000, pricePerMonth: 100000 } },
  { id: "31", brand: "Audi", model: "Q7", year: 2025, price: 6199000, color: "أسود", fuel: "بنزين", status: "متاح", listingType: "بيع",
    image: "https://images.unsplash.com/photo-1614200187106-63d44b89bef9?w=800&auto=format&fit=crop" },

  // ===== Porsche =====
  { id: "32", brand: "Porsche", model: "Cayenne", year: 2025, price: 10623200, color: "أحمر", fuel: "بنزين", status: "متاح", listingType: "بيع وإيجار",
    image: "https://images.unsplash.com/photo-1503376763036-066120622c74?w=800&auto=format&fit=crop",
    rental: { pricePerDay: 10000, pricePerWeek: 60000, pricePerMonth: 180000 } },
  { id: "33", brand: "Porsche", model: "Macan", year: 2025, price: 5698700, color: "أبيض", fuel: "بنزين", status: "متاح", listingType: "بيع",
    image: "https://images.unsplash.com/photo-1503376763036-066120622c74?w=800&auto=format&fit=crop" },

  // ===== Lexus =====
  { id: "34", brand: "Lexus", model: "ES 350", year: 2025, price: 3200000, color: "فضي", fuel: "هجين", status: "متاح", listingType: "بيع وإيجار",
    image: "https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=800&auto=format&fit=crop",
    rental: { pricePerDay: 4000, pricePerWeek: 23000, pricePerMonth: 75000 } },

  // ===== BYD =====
  { id: "35", brand: "BYD", model: "Atto 3", year: 2025, price: 1050000, color: "أبيض", fuel: "كهربائي", status: "متاح", listingType: "بيع وإيجار",
    image: "https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=800&auto=format&fit=crop",
    rental: { pricePerDay: 1500, pricePerWeek: 8500, pricePerMonth: 27000 } },
  { id: "36", brand: "BYD", model: "Seal", year: 2025, price: 1350000, color: "أسود", fuel: "كهربائي", status: "متاح", listingType: "بيع وإيجار",
    image: "https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=800&auto=format&fit=crop",
    rental: { pricePerDay: 1800, pricePerWeek: 10500, pricePerMonth: 33000 } },
  { id: "37", brand: "BYD", model: "Dolphin", year: 2025, price: 750000, color: "أزرق", fuel: "كهربائي", status: "متاح", listingType: "بيع وإيجار",
    image: "https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=800&auto=format&fit=crop",
    rental: { pricePerDay: 1100, pricePerWeek: 6500, pricePerMonth: 20000 } },

  // ===== Suzuki =====
  { id: "38", brand: "Suzuki", model: "Swift", year: 2025, price: 480000, color: "أحمر", fuel: "بنزين", status: "متاح", listingType: "بيع وإيجار",
    image: "https://images.unsplash.com/photo-1542362567-b07e54358753?w=800&auto=format&fit=crop",
    rental: { pricePerDay: 800, pricePerWeek: 4800, pricePerMonth: 15000 } },
  { id: "39", brand: "Suzuki", model: "Vitara", year: 2025, price: 870000, color: "أبيض", fuel: "بنزين", status: "متاح", listingType: "بيع وإيجار",
    image: "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800&auto=format&fit=crop",
    rental: { pricePerDay: 1200, pricePerWeek: 7000, pricePerMonth: 22000 } },

  // ===== Renault =====
  { id: "40", brand: "Renault", model: "Logan", year: 2025, price: 580000, color: "أبيض", fuel: "بنزين", status: "متاح", listingType: "بيع وإيجار",
    image: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&auto=format&fit=crop",
    rental: { pricePerDay: 900, pricePerWeek: 5000, pricePerMonth: 16000 } },
  { id: "41", brand: "Renault", model: "Duster", year: 2025, price: 850000, color: "بني", fuel: "بنزين", status: "متاح", listingType: "بيع وإيجار",
    image: "https://images.unsplash.com/photo-1609521263047-f8f205293f24?w=800&auto=format&fit=crop",
    rental: { pricePerDay: 1200, pricePerWeek: 7000, pricePerMonth: 22000 } },

  // ===== Peugeot =====
  { id: "42", brand: "Peugeot", model: "208", year: 2025, price: 700000, color: "أحمر", fuel: "بنزين", status: "متاح", listingType: "بيع وإيجار",
    image: "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b6?w=800&auto=format&fit=crop",
    rental: { pricePerDay: 1000, pricePerWeek: 6000, pricePerMonth: 19000 } },
  { id: "43", brand: "Peugeot", model: "3008", year: 2025, price: 1300000, color: "رمادي", fuel: "بنزين", status: "متاح", listingType: "بيع وإيجار",
    image: "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b6?w=800&auto=format&fit=crop",
    rental: { pricePerDay: 1800, pricePerWeek: 10500, pricePerMonth: 34000 } },

  // ===== Skoda =====
  { id: "44", brand: "Skoda", model: "Octavia", year: 2025, price: 2000000, color: "أبيض", fuel: "بنزين", status: "متاح", listingType: "بيع",
    image: "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=800&auto=format&fit=crop" },

  // ===== Mitsubishi =====
  { id: "45", brand: "Mitsubishi", model: "Eclipse Cross", year: 2025, price: 1350000, color: "أحمر", fuel: "بنزين", status: "متاح", listingType: "بيع وإيجار",
    image: "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800&auto=format&fit=crop",
    rental: { pricePerDay: 1700, pricePerWeek: 10000, pricePerMonth: 32000 } },
  { id: "46", brand: "Mitsubishi", model: "Outlander", year: 2025, price: 1900000, color: "أبيض", fuel: "هجين", status: "متاح", listingType: "بيع وإيجار",
    image: "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=800&auto=format&fit=crop",
    rental: { pricePerDay: 2500, pricePerWeek: 14000, pricePerMonth: 45000 } },
];

export function loadCars(): Car[] {
  if (typeof window === "undefined") return seed;
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) { localStorage.setItem(KEY, JSON.stringify(seed)); return seed; }
    return JSON.parse(raw);
  } catch { return seed; }
}

export function saveCars(cars: Car[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY, JSON.stringify(cars));
}

export function loadRentals(): RentalRecord[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(RENTALS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

export function saveRentals(rentals: RentalRecord[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(RENTALS_KEY, JSON.stringify(rentals));
}

export function loadSales(): SaleRecord[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(SALES_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

export function saveSales(sales: SaleRecord[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(SALES_KEY, JSON.stringify(sales));
}

export function formatEGP(n: number) {
  return new Intl.NumberFormat("ar-EG").format(n) + " ج.م";
}

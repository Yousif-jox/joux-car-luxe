export type CarStatus = "متاح" | "محجوز" | "مباع";
export type FuelType = "بنزين" | "ديزل" | "كهربائي" | "هجين";

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
}

const KEY = "jox_cars_v1";

const seed: Car[] = [
  { id: "1", brand: "Toyota", model: "Corolla", year: 2024, price: 850000, color: "أبيض", fuel: "بنزين", status: "متاح", image: "https://images.unsplash.com/photo-1623869675781-80aa31012a5a?w=800" },
  { id: "2", brand: "Toyota", model: "Camry", year: 2023, price: 1450000, color: "أسود", fuel: "هجين", status: "متاح", image: "https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=800" },
  { id: "3", brand: "Kia", model: "Sportage", year: 2024, price: 1650000, color: "رمادي", fuel: "بنزين", status: "محجوز", image: "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800" },
  { id: "4", brand: "Kia", model: "Cerato", year: 2023, price: 780000, color: "أحمر", fuel: "بنزين", status: "متاح", image: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800" },
  { id: "5", brand: "Hyundai", model: "Elantra", year: 2024, price: 920000, color: "فضي", fuel: "بنزين", status: "متاح", image: "https://images.unsplash.com/photo-1619767886558-efdc259cde1a?w=800" },
  { id: "6", brand: "Hyundai", model: "Tucson", year: 2023, price: 1550000, color: "أزرق", fuel: "ديزل", status: "مباع", image: "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800" },
  { id: "7", brand: "BMW", model: "X5", year: 2024, price: 5200000, color: "أسود", fuel: "بنزين", status: "متاح", image: "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800" },
  { id: "8", brand: "BMW", model: "320i", year: 2023, price: 3100000, color: "أبيض", fuel: "بنزين", status: "محجوز", image: "https://images.unsplash.com/photo-1556189250-72ba954cfc2b?w=800" },
  { id: "9", brand: "Mercedes", model: "C200", year: 2024, price: 4500000, color: "أسود", fuel: "بنزين", status: "متاح", image: "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800" },
  { id: "10", brand: "Mercedes", model: "E300", year: 2023, price: 5800000, color: "رمادي", fuel: "هجين", status: "متاح", image: "https://images.unsplash.com/photo-1617531653332-bd46c24f2068?w=800" },
  { id: "11", brand: "Nissan", model: "Sunny", year: 2024, price: 720000, color: "أبيض", fuel: "بنزين", status: "متاح", image: "https://images.unsplash.com/photo-1590362891991-f776e747a588?w=800" },
  { id: "12", brand: "Nissan", model: "X-Trail", year: 2023, price: 1380000, color: "بني", fuel: "بنزين", status: "مباع", image: "https://images.unsplash.com/photo-1609521263047-f8f205293f24?w=800" },
];

export function loadCars(): Car[] {
  if (typeof window === "undefined") return seed;
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) {
      localStorage.setItem(KEY, JSON.stringify(seed));
      return seed;
    }
    return JSON.parse(raw);
  } catch {
    return seed;
  }
}

export function saveCars(cars: Car[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY, JSON.stringify(cars));
}

export function formatEGP(n: number) {
  return new Intl.NumberFormat("ar-EG").format(n) + " ج.م";
}

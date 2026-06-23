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

const KEY = "jox_cars_v2";

const seed: Car[] = [
  // Toyota
  { id: "1", brand: "Toyota", model: "Corolla", year: 2024, price: 850000, color: "أبيض", fuel: "بنزين", status: "متاح", image: "https://images.unsplash.com/photo-1623869675781-80aa31012a5a?w=800" },
  { id: "2", brand: "Toyota", model: "Camry", year: 2023, price: 1450000, color: "أسود", fuel: "هجين", status: "متاح", image: "https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=800" },
  // Kia
  { id: "3", brand: "Kia", model: "Sportage", year: 2024, price: 1650000, color: "رمادي", fuel: "بنزين", status: "محجوز", image: "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800" },
  { id: "4", brand: "Kia", model: "Cerato", year: 2023, price: 780000, color: "أحمر", fuel: "بنزين", status: "متاح", image: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800" },
  // Hyundai
  { id: "5", brand: "Hyundai", model: "Elantra", year: 2024, price: 920000, color: "فضي", fuel: "بنزين", status: "متاح", image: "https://images.unsplash.com/photo-1619767886558-efdc259cde1a?w=800" },
  { id: "6", brand: "Hyundai", model: "Tucson", year: 2023, price: 1550000, color: "أزرق", fuel: "ديزل", status: "مباع", image: "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=800" },
  // BMW
  { id: "7", brand: "BMW", model: "X5", year: 2024, price: 5200000, color: "أسود", fuel: "بنزين", status: "متاح", image: "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800" },
  { id: "8", brand: "BMW", model: "320i", year: 2023, price: 3100000, color: "أبيض", fuel: "بنزين", status: "محجوز", image: "https://images.unsplash.com/photo-1556189250-72ba954cfc2b?w=800" },
  // Mercedes
  { id: "9", brand: "Mercedes", model: "C200", year: 2024, price: 4500000, color: "أسود", fuel: "بنزين", status: "متاح", image: "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800" },
  { id: "10", brand: "Mercedes", model: "E300", year: 2023, price: 5800000, color: "رمادي", fuel: "هجين", status: "متاح", image: "https://images.unsplash.com/photo-1617531653332-bd46c24f2068?w=800" },
  // Nissan
  { id: "11", brand: "Nissan", model: "Sunny", year: 2024, price: 720000, color: "أبيض", fuel: "بنزين", status: "متاح", image: "https://images.unsplash.com/photo-1590362891991-f776e747a588?w=800" },
  { id: "12", brand: "Nissan", model: "X-Trail", year: 2023, price: 1380000, color: "بني", fuel: "بنزين", status: "مباع", image: "https://images.unsplash.com/photo-1609521263047-f8f205293f24?w=800" },
  // Audi
  { id: "13", brand: "Audi", model: "A4", year: 2024, price: 2800000, color: "أبيض", fuel: "بنزين", status: "متاح", image: "https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?w=800" },
  { id: "14", brand: "Audi", model: "Q7", year: 2023, price: 4900000, color: "أسود", fuel: "ديزل", status: "متاح", image: "https://images.unsplash.com/photo-1503376763036-066120622c74?w=800" },
  // Porsche
  { id: "15", brand: "Porsche", model: "Cayenne", year: 2024, price: 7500000, color: "أحمر", fuel: "بنزين", status: "متاح", image: "https://images.unsplash.com/photo-1503376763036-066120622c74?w=800" },
  // Lexus
  { id: "16", brand: "Lexus", model: "ES 350", year: 2024, price: 3200000, color: "فضي", fuel: "هجين", status: "متاح", image: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800" },
  // Ford
  { id: "17", brand: "Ford", model: "Focus", year: 2024, price: 950000, color: "أزرق", fuel: "بنزين", status: "متاح", image: "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=800" },
  // Chevrolet
  { id: "18", brand: "Chevrolet", model: "Malibu", year: 2024, price: 1100000, color: "رمادي", fuel: "بنزين", status: "محجوز", image: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=800" },
  // Honda
  { id: "19", brand: "Honda", model: "Civic", year: 2024, price: 1050000, color: "أحمر", fuel: "بنزين", status: "متاح", image: "https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?w=800" },
  // Jeep
  { id: "20", brand: "Jeep", model: "Wrangler", year: 2024, price: 2200000, color: "أخضر", fuel: "بنزين", status: "متاح", image: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800" },
  // Volkswagen
  { id: "21", brand: "Volkswagen", model: "Golf", year: 2024, price: 900000, color: "أبيض", fuel: "بنزين", status: "مباع", image: "https://images.unsplash.com/photo-1542362567-b07e54358753?w=800" },
  // Peugeot
  { id: "22", brand: "Peugeot", model: "3008", year: 2024, price: 1250000, color: "أسود", fuel: "بنزين", status: "متاح", image: "https://images.unsplash.com/photo-1503376763036-066120622c74?w=800" },
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

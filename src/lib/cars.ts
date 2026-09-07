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

const KEY = "jox_cars_v4";

const seed: Car[] = [
  // ===== Toyota =====
  {
    id: "1", brand: "Toyota", model: "Corolla", year: 2025, price: 1450000,
    color: "أبيض", fuel: "بنزين", status: "متاح",
    image: "https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=800"
  },
  {
    id: "2", brand: "Toyota", model: "Camry", year: 2025, price: 1950000,
    color: "أسود", fuel: "هجين", status: "متاح",
    image: "https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=800"
  },
  {
    id: "3", brand: "Toyota", model: "Yaris", year: 2025, price: 785000,
    color: "أحمر", fuel: "بنزين", status: "متاح",
    image: "https://images.unsplash.com/photo-1590362891991-f776e747a588?w=800"
  },
  {
    id: "4", brand: "Toyota", model: "Land Cruiser", year: 2025, price: 10700000,
    color: "أبيض", fuel: "بنزين", status: "محجوز",
    image: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800"
  },
  {
    id: "5", brand: "Toyota", model: "Rush", year: 2025, price: 1050000,
    color: "رمادي", fuel: "بنزين", status: "متاح",
    image: "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800"
  },

  // ===== Nissan =====
  {
    id: "6", brand: "Nissan", model: "Sunny", year: 2025, price: 750000,
    color: "أبيض", fuel: "بنزين", status: "متاح",
    image: "https://images.unsplash.com/photo-1590362891991-f776e747a588?w=800"
  },
  {
    id: "7", brand: "Nissan", model: "Patrol", year: 2025, price: 11050000,
    color: "أبيض", fuel: "بنزين", status: "متاح",
    image: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800"
  },
  {
    id: "8", brand: "Nissan", model: "Sentra", year: 2025, price: 960000,
    color: "فضي", fuel: "بنزين", status: "متاح",
    image: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800"
  },

  // ===== Hyundai =====
  {
    id: "9", brand: "Hyundai", model: "Elantra", year: 2025, price: 1375000,
    color: "فضي", fuel: "بنزين", status: "متاح",
    image: "https://images.unsplash.com/photo-1619767886558-efdc259cde1a?w=800"
  },
  {
    id: "10", brand: "Hyundai", model: "Accent", year: 2025, price: 790000,
    color: "أبيض", fuel: "بنزين", status: "متاح",
    image: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800"
  },
  {
    id: "11", brand: "Hyundai", model: "Tucson", year: 2025, price: 1700000,
    color: "أزرق", fuel: "بنزين", status: "محجوز",
    image: "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=800"
  },
  {
    id: "12", brand: "Hyundai", model: "Santa Fe", year: 2025, price: 2400000,
    color: "أسود", fuel: "هجين", status: "متاح",
    image: "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800"
  },

  // ===== Kia =====
  {
    id: "13", brand: "Kia", model: "Cerato", year: 2025, price: 900000,
    color: "أحمر", fuel: "بنزين", status: "متاح",
    image: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800"
  },
  {
    id: "14", brand: "Kia", model: "Sportage", year: 2025, price: 1650000,
    color: "رمادي", fuel: "بنزين", status: "متاح",
    image: "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800"
  },
  {
    id: "15", brand: "Kia", model: "Sorento", year: 2025, price: 2200000,
    color: "أسود", fuel: "هجين", status: "متاح",
    image: "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=800"
  },
  {
    id: "16", brand: "Kia", model: "Picanto", year: 2025, price: 530000,
    color: "أبيض", fuel: "بنزين", status: "متاح",
    image: "https://images.unsplash.com/photo-1542362567-b07e54358753?w=800"
  },

  // ===== MG (الأكثر مبيعاً في مصر) =====
  {
    id: "17", brand: "MG", model: "MG5", year: 2025, price: 740000,
    color: "أبيض", fuel: "بنزين", status: "متاح",
    image: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800"
  },
  {
    id: "18", brand: "MG", model: "MG6", year: 2025, price: 980000,
    color: "أسود", fuel: "بنزين", status: "متاح",
    image: "https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?w=800"
  },
  {
    id: "19", brand: "MG", model: "ZS", year: 2025, price: 850000,
    color: "رمادي", fuel: "بنزين", status: "متاح",
    image: "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800"
  },
  {
    id: "20", brand: "MG", model: "HS", year: 2025, price: 1250000,
    color: "أحمر", fuel: "بنزين", status: "محجوز",
    image: "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=800"
  },
  {
    id: "21", brand: "MG", model: "MG4 EV", year: 2025, price: 1100000,
    color: "أبيض", fuel: "كهربائي", status: "متاح",
    image: "https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=800"
  },

  // ===== Chery =====
  {
    id: "22", brand: "Chery", model: "Tiggo 4 Pro", year: 2025, price: 750000,
    color: "أبيض", fuel: "بنزين", status: "متاح",
    image: "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800"
  },
  {
    id: "23", brand: "Chery", model: "Tiggo 7 Pro", year: 2025, price: 1100000,
    color: "رمادي", fuel: "بنزين", status: "متاح",
    image: "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=800"
  },
  {
    id: "24", brand: "Chery", model: "Tiggo 8 Pro", year: 2025, price: 1550000,
    color: "أسود", fuel: "بنزين", status: "متاح",
    image: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800"
  },
  {
    id: "25", brand: "Chery", model: "Arrizo 6 Pro", year: 2025, price: 680000,
    color: "أزرق", fuel: "بنزين", status: "متاح",
    image: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800"
  },

  // ===== Changan =====
  {
    id: "26", brand: "Changan", model: "CS35 Plus", year: 2025, price: 690000,
    color: "أبيض", fuel: "بنزين", status: "متاح",
    image: "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800"
  },
  {
    id: "27", brand: "Changan", model: "CS55 Plus", year: 2025, price: 950000,
    color: "رمادي", fuel: "بنزين", status: "متاح",
    image: "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=800"
  },
  {
    id: "28", brand: "Changan", model: "CS75 Plus", year: 2025, price: 1200000,
    color: "أسود", fuel: "بنزين", status: "محجوز",
    image: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800"
  },
  {
    id: "29", brand: "Changan", model: "Uni-T", year: 2025, price: 1050000,
    color: "أحمر", fuel: "بنزين", status: "متاح",
    image: "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800"
  },

  // ===== Geely =====
  {
    id: "30", brand: "Geely", model: "Emgrand", year: 2025, price: 590000,
    color: "أبيض", fuel: "بنزين", status: "متاح",
    image: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800"
  },
  {
    id: "31", brand: "Geely", model: "Coolray", year: 2025, price: 820000,
    color: "رمادي", fuel: "بنزين", status: "متاح",
    image: "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800"
  },
  {
    id: "32", brand: "Geely", model: "Tugella", year: 2025, price: 1350000,
    color: "أسود", fuel: "بنزين", status: "متاح",
    image: "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=800"
  },

  // ===== BMW =====
  {
    id: "33", brand: "BMW", model: "X3", year: 2027, price: 5300000,
    color: "أسود", fuel: "بنزين", status: "متاح",
    image: "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800"
  },
  {
    id: "34", brand: "BMW", model: "520i", year: 2027, price: 6100000,
    color: "أبيض", fuel: "بنزين", status: "محجوز",
    image: "https://images.unsplash.com/photo-1556189250-72ba954cfc2b?w=800"
  },
  {
    id: "35", brand: "BMW", model: "X5", year: 2025, price: 8500000,
    color: "رمادي", fuel: "بنزين", status: "متاح",
    image: "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800"
  },
  {
    id: "36", brand: "BMW", model: "I4", year: 2025, price: 4950000,
    color: "أزرق", fuel: "كهربائي", status: "متاح",
    image: "https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=800"
  },

  // ===== Mercedes =====
  {
    id: "37", brand: "Mercedes", model: "C200", year: 2025, price: 4500000,
    color: "أسود", fuel: "بنزين", status: "متاح",
    image: "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800"
  },
  {
    id: "38", brand: "Mercedes", model: "E200", year: 2026, price: 4920000,
    color: "رمادي", fuel: "بنزين", status: "متاح",
    image: "https://images.unsplash.com/photo-1617531653332-bd46c24f2068?w=800"
  },
  {
    id: "39", brand: "Mercedes", model: "GLC 200", year: 2026, price: 5250000,
    color: "أبيض", fuel: "بنزين", status: "متاح",
    image: "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=800"
  },
  {
    id: "40", brand: "Mercedes", model: "G63 AMG", year: 2026, price: 18650000,
    color: "أسود", fuel: "بنزين", status: "محجوز",
    image: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800"
  },

  // ===== Audi =====
  {
    id: "41", brand: "Audi", model: "A6", year: 2026, price: 5248999,
    color: "أبيض", fuel: "بنزين", status: "متاح",
    image: "https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?w=800"
  },
  {
    id: "42", brand: "Audi", model: "Q7", year: 2026, price: 6199000,
    color: "أسود", fuel: "بنزين", status: "متاح",
    image: "https://images.unsplash.com/photo-1614200187106-63d44b89bef9?w=800"
  },

  // ===== Porsche =====
  {
    id: "43", brand: "Porsche", model: "Cayenne", year: 2025, price: 10623200,
    color: "أحمر", fuel: "بنزين", status: "متاح",
    image: "https://images.unsplash.com/photo-1503376763036-066120622c74?w=800"
  },
  {
    id: "44", brand: "Porsche", model: "Macan", year: 2025, price: 5698700,
    color: "أبيض", fuel: "بنزين", status: "متاح",
    image: "https://images.unsplash.com/photo-1503376763036-066120622c74?w=800"
  },
  {
    id: "45", brand: "Porsche", model: "Panamera", year: 2025, price: 10584000,
    color: "أسود", fuel: "هجين", status: "متاح",
    image: "https://images.unsplash.com/photo-1503376763036-066120622c74?w=800"
  },

  // ===== Lexus =====
  {
    id: "46", brand: "Lexus", model: "ES 350", year: 2025, price: 3200000,
    color: "فضي", fuel: "هجين", status: "متاح",
    image: "https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=800"
  },
  {
    id: "47", brand: "Lexus", model: "LX 570", year: 2020, price: 5450000,
    color: "أسود", fuel: "بنزين", status: "متاح",
    image: "https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=800"
  },

  // ===== Mitsubishi =====
  {
    id: "48", brand: "Mitsubishi", model: "Eclipse Cross", year: 2025, price: 1350000,
    color: "أحمر", fuel: "بنزين", status: "متاح",
    image: "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800"
  },
  {
    id: "49", brand: "Mitsubishi", model: "Outlander", year: 2025, price: 1900000,
    color: "أبيض", fuel: "هجين", status: "متاح",
    image: "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=800"
  },

  // ===== Suzuki =====
  {
    id: "50", brand: "Suzuki", model: "Swift", year: 2025, price: 480000,
    color: "أحمر", fuel: "بنزين", status: "متاح",
    image: "https://images.unsplash.com/photo-1542362567-b07e54358753?w=800"
  },
  {
    id: "51", brand: "Suzuki", model: "Vitara", year: 2025, price: 870000,
    color: "أبيض", fuel: "بنزين", status: "متاح",
    image: "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800"
  },
  {
    id: "52", brand: "Suzuki", model: "Ertiga", year: 2025, price: 650000,
    color: "فضي", fuel: "بنزين", status: "متاح",
    image: "https://images.unsplash.com/photo-1590362891991-f776e747a588?w=800"
  },

  // ===== BYD =====
  {
    id: "53", brand: "BYD", model: "Atto 3", year: 2025, price: 1050000,
    color: "أبيض", fuel: "كهربائي", status: "متاح",
    image: "https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=800"
  },
  {
    id: "54", brand: "BYD", model: "Seal", year: 2025, price: 1350000,
    color: "أسود", fuel: "كهربائي", status: "متاح",
    image: "https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=800"
  },
  {
    id: "55", brand: "BYD", model: "Dolphin", year: 2025, price: 750000,
    color: "أزرق", fuel: "كهربائي", status: "متاح",
    image: "https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=800"
  },

  // ===== Jetour =====
  {
    id: "56", brand: "Jetour", model: "X70", year: 2025, price: 760000,
    color: "أبيض", fuel: "بنزين", status: "متاح",
    image: "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800"
  },
  {
    id: "57", brand: "Jetour", model: "X90", year: 2025, price: 1050000,
    color: "رمادي", fuel: "بنزين", status: "متاح",
    image: "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=800"
  },

  // ===== Skoda =====
  {
    id: "58", brand: "Skoda", model: "Octavia", year: 2025, price: 2000000,
    color: "أبيض", fuel: "بنزين", status: "متاح",
    image: "https://images.unsplash.com/photo-1542362567-b07e54358753?w=800"
  },
  {
    id: "59", brand: "Skoda", model: "Kodiaq", year: 2025, price: 2500000,
    color: "رمادي", fuel: "بنزين", status: "متاح",
    image: "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=800"
  },

  // ===== Renault =====
  {
    id: "60", brand: "Renault", model: "Logan", year: 2025, price: 580000,
    color: "أبيض", fuel: "بنزين", status: "متاح",
    image: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800"
  },
  {
    id: "61", brand: "Renault", model: "Duster", year: 2025, price: 850000,
    color: "بني", fuel: "بنزين", status: "متاح",
    image: "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800"
  },
  {
    id: "62", brand: "Renault", model: "Symbol", year: 2025, price: 490000,
    color: "فضي", fuel: "بنزين", status: "مباع",
    image: "https://images.unsplash.com/photo-1590362891991-f776e747a588?w=800"
  },

  // ===== Land Rover =====
  {
    id: "63", brand: "Land Rover", model: "Range Rover Evoque", year: 2024, price: 4600000,
    color: "أسود", fuel: "بنزين", status: "متاح",
    image: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800"
  },
  {
    id: "64", brand: "Land Rover", model: "Range Rover Sport", year: 2024, price: 7500000,
    color: "أبيض", fuel: "بنزين", status: "محجوز",
    image: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800"
  },

  // ===== Volvo =====
  {
    id: "65", brand: "Volvo", model: "XC40", year: 2025, price: 2450000,
    color: "أزرق", fuel: "كهربائي", status: "متاح",
    image: "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=800"
  },
  {
    id: "66", brand: "Volvo", model: "XC90", year: 2026, price: 5250000,
    color: "أبيض", fuel: "هجين", status: "متاح",
    image: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800"
  },

  // ===== Haval =====
  {
    id: "67", brand: "Haval", model: "H6", year: 2025, price: 980000,
    color: "أبيض", fuel: "هجين", status: "متاح",
    image: "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800"
  },
  {
    id: "68", brand: "Haval", model: "Jolion", year: 2025, price: 780000,
    color: "رمادي", fuel: "هجين", status: "متاح",
    image: "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=800"
  },

  // ===== JAC =====
  {
    id: "69", brand: "JAC", model: "J7", year: 2025, price: 620000,
    color: "أبيض", fuel: "بنزين", status: "متاح",
    image: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800"
  },
  {
    id: "70", brand: "JAC", model: "T8 Pro", year: 2025, price: 850000,
    color: "أسود", fuel: "بنزين", status: "متاح",
    image: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800"
  },

  // ===== Peugeot =====
  {
    id: "71", brand: "Peugeot", model: "208", year: 2025, price: 700000,
    color: "أحمر", fuel: "بنزين", status: "متاح",
    image: "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b6?w=800"
  },
  {
    id: "72", brand: "Peugeot", model: "2008", year: 2025, price: 900000,
    color: "أبيض", fuel: "بنزين", status: "متاح",
    image: "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b6?w=800"
  },
  {
    id: "73", brand: "Peugeot", model: "3008", year: 2025, price: 1300000,
    color: "رمادي", fuel: "بنزين", status: "محجوز",
    image: "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b6?w=800"
  },

  // ===== Citroen =====
  {
    id: "74", brand: "Citroen", model: "C3", year: 2025, price: 560000,
    color: "أبيض", fuel: "بنزين", status: "متاح",
    image: "https://images.unsplash.com/photo-1542362567-b07e54358753?w=800"
  },
  {
    id: "75", brand: "Citroen", model: "C5 Aircross", year: 2025, price: 1250000,
    color: "رمادي", fuel: "بنزين", status: "متاح",
    image: "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800"
  },
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
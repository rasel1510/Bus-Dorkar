// Bangladesh District Data - All 64 Districts grouped by 8 Divisions
// Used for route search, combobox selectors, and map features

export interface District {
  id: string;
  name: string;
  nameBn: string;
  division: string;
  divisionBn: string;
  lat: number;
  lng: number;
}

export interface Division {
  name: string;
  nameBn: string;
  districts: District[];
}

export const divisions: Division[] = [
  {
    name: "Dhaka",
    nameBn: "ঢাকা",
    districts: [
      { id: "dhaka", name: "Dhaka", nameBn: "ঢাকা", division: "Dhaka", divisionBn: "ঢাকা", lat: 23.8103, lng: 90.4125 },
      { id: "gazipur", name: "Gazipur", nameBn: "গাজীপুর", division: "Dhaka", divisionBn: "ঢাকা", lat: 24.0023, lng: 90.4203 },
      { id: "narayanganj", name: "Narayanganj", nameBn: "নারায়ণগঞ্জ", division: "Dhaka", divisionBn: "ঢাকা", lat: 23.6238, lng: 90.5000 },
      { id: "tangail", name: "Tangail", nameBn: "টাঙ্গাইল", division: "Dhaka", divisionBn: "ঢাকা", lat: 24.2513, lng: 89.9163 },
      { id: "kishoreganj", name: "Kishoreganj", nameBn: "কিশোরগঞ্জ", division: "Dhaka", divisionBn: "ঢাকা", lat: 24.4449, lng: 90.7766 },
      { id: "manikganj", name: "Manikganj", nameBn: "মানিকগঞ্জ", division: "Dhaka", divisionBn: "ঢাকা", lat: 23.8617, lng: 90.0003 },
      { id: "munshiganj", name: "Munshiganj", nameBn: "মুন্সিগঞ্জ", division: "Dhaka", divisionBn: "ঢাকা", lat: 23.5422, lng: 90.5305 },
      { id: "narsingdi", name: "Narsingdi", nameBn: "নরসিংদী", division: "Dhaka", divisionBn: "ঢাকা", lat: 23.9322, lng: 90.7151 },
      { id: "faridpur", name: "Faridpur", nameBn: "ফরিদপুর", division: "Dhaka", divisionBn: "ঢাকা", lat: 23.6070, lng: 89.8429 },
      { id: "gopalganj", name: "Gopalganj", nameBn: "গোপালগঞ্জ", division: "Dhaka", divisionBn: "ঢাকা", lat: 23.0050, lng: 89.8266 },
      { id: "madaripur", name: "Madaripur", nameBn: "মাদারীপুর", division: "Dhaka", divisionBn: "ঢাকা", lat: 23.1641, lng: 90.1978 },
      { id: "rajbari", name: "Rajbari", nameBn: "রাজবাড়ী", division: "Dhaka", divisionBn: "ঢাকা", lat: 23.7574, lng: 89.6445 },
      { id: "shariatpur", name: "Shariatpur", nameBn: "শরীয়তপুর", division: "Dhaka", divisionBn: "ঢাকা", lat: 23.2423, lng: 90.4348 },
    ],
  },
  {
    name: "Chattogram",
    nameBn: "চট্টগ্রাম",
    districts: [
      { id: "chattogram", name: "Chattogram", nameBn: "চট্টগ্রাম", division: "Chattogram", divisionBn: "চট্টগ্রাম", lat: 22.3569, lng: 91.7832 },
      { id: "coxs-bazar", name: "Cox's Bazar", nameBn: "কক্সবাজার", division: "Chattogram", divisionBn: "চট্টগ্রাম", lat: 21.4272, lng: 92.0058 },
      { id: "cumilla", name: "Cumilla", nameBn: "কুমিল্লা", division: "Chattogram", divisionBn: "চট্টগ্রাম", lat: 23.4607, lng: 91.1809 },
      { id: "brahmanbaria", name: "Brahmanbaria", nameBn: "ব্রাহ্মণবাড়িয়া", division: "Chattogram", divisionBn: "চট্টগ্রাম", lat: 23.9608, lng: 91.1115 },
      { id: "feni", name: "Feni", nameBn: "ফেনী", division: "Chattogram", divisionBn: "চট্টগ্রাম", lat: 23.0159, lng: 91.3976 },
      { id: "noakhali", name: "Noakhali", nameBn: "নোয়াখালী", division: "Chattogram", divisionBn: "চট্টগ্রাম", lat: 22.8696, lng: 91.0995 },
      { id: "lakshmipur", name: "Lakshmipur", nameBn: "লক্ষ্মীপুর", division: "Chattogram", divisionBn: "চট্টগ্রাম", lat: 22.9447, lng: 90.8282 },
      { id: "chandpur", name: "Chandpur", nameBn: "চাঁদপুর", division: "Chattogram", divisionBn: "চট্টগ্রাম", lat: 23.2332, lng: 90.6712 },
      { id: "rangamati", name: "Rangamati", nameBn: "রাঙামাটি", division: "Chattogram", divisionBn: "চট্টগ্রাম", lat: 22.7324, lng: 92.2985 },
      { id: "bandarban", name: "Bandarban", nameBn: "বান্দরবান", division: "Chattogram", divisionBn: "চট্টগ্রাম", lat: 22.1953, lng: 92.2184 },
      { id: "khagrachhari", name: "Khagrachhari", nameBn: "খাগড়াছড়ি", division: "Chattogram", divisionBn: "চট্টগ্রাম", lat: 23.1193, lng: 91.9847 },
    ],
  },
  {
    name: "Rajshahi",
    nameBn: "রাজশাহী",
    districts: [
      { id: "rajshahi", name: "Rajshahi", nameBn: "রাজশাহী", division: "Rajshahi", divisionBn: "রাজশাহী", lat: 24.3745, lng: 88.6042 },
      { id: "bogura", name: "Bogura", nameBn: "বগুড়া", division: "Rajshahi", divisionBn: "রাজশাহী", lat: 24.8465, lng: 89.3773 },
      { id: "pabna", name: "Pabna", nameBn: "পাবনা", division: "Rajshahi", divisionBn: "রাজশাহী", lat: 24.0064, lng: 89.2372 },
      { id: "natore", name: "Natore", nameBn: "নাটোর", division: "Rajshahi", divisionBn: "রাজশাহী", lat: 24.4206, lng: 89.0000 },
      { id: "sirajganj", name: "Sirajganj", nameBn: "সিরাজগঞ্জ", division: "Rajshahi", divisionBn: "রাজশাহী", lat: 24.4533, lng: 89.7100 },
      { id: "naogaon", name: "Naogaon", nameBn: "নওগাঁ", division: "Rajshahi", divisionBn: "রাজশাহী", lat: 24.7936, lng: 88.9318 },
      { id: "nawabganj", name: "Nawabganj", nameBn: "নবাবগঞ্জ", division: "Rajshahi", divisionBn: "রাজশাহী", lat: 24.5941, lng: 88.2775 },
      { id: "joypurhat", name: "Joypurhat", nameBn: "জয়পুরহাট", division: "Rajshahi", divisionBn: "রাজশাহী", lat: 25.0968, lng: 89.0227 },
    ],
  },
  {
    name: "Khulna",
    nameBn: "খুলনা",
    districts: [
      { id: "khulna", name: "Khulna", nameBn: "খুলনা", division: "Khulna", divisionBn: "খুলনা", lat: 22.8456, lng: 89.5403 },
      { id: "jessore", name: "Jessore", nameBn: "যশোর", division: "Khulna", divisionBn: "খুলনা", lat: 23.1634, lng: 89.2182 },
      { id: "kushtia", name: "Kushtia", nameBn: "কুষ্টিয়া", division: "Khulna", divisionBn: "খুলনা", lat: 23.9013, lng: 89.1200 },
      { id: "satkhira", name: "Satkhira", nameBn: "সাতক্ষীরা", division: "Khulna", divisionBn: "খুলনা", lat: 22.7185, lng: 89.0705 },
      { id: "bagerhat", name: "Bagerhat", nameBn: "বাগেরহাট", division: "Khulna", divisionBn: "খুলনা", lat: 22.6510, lng: 89.7857 },
      { id: "jhenaidah", name: "Jhenaidah", nameBn: "ঝিনাইদহ", division: "Khulna", divisionBn: "খুলনা", lat: 23.5448, lng: 89.1539 },
      { id: "magura", name: "Magura", nameBn: "মাগুরা", division: "Khulna", divisionBn: "খুলনা", lat: 23.4873, lng: 89.4197 },
      { id: "narail", name: "Narail", nameBn: "নড়াইল", division: "Khulna", divisionBn: "খুলনা", lat: 23.1163, lng: 89.5840 },
      { id: "chuadanga", name: "Chuadanga", nameBn: "চুয়াডাঙ্গা", division: "Khulna", divisionBn: "খুলনা", lat: 23.6161, lng: 88.8420 },
      { id: "meherpur", name: "Meherpur", nameBn: "মেহেরপুর", division: "Khulna", divisionBn: "খুলনা", lat: 23.7627, lng: 88.6318 },
    ],
  },
  {
    name: "Sylhet",
    nameBn: "সিলেট",
    districts: [
      { id: "sylhet", name: "Sylhet", nameBn: "সিলেট", division: "Sylhet", divisionBn: "সিলেট", lat: 24.8949, lng: 91.8687 },
      { id: "moulvibazar", name: "Moulvibazar", nameBn: "মৌলভীবাজার", division: "Sylhet", divisionBn: "সিলেট", lat: 24.4829, lng: 91.7774 },
      { id: "habiganj", name: "Habiganj", nameBn: "হবিগঞ্জ", division: "Sylhet", divisionBn: "সিলেট", lat: 24.3740, lng: 91.4164 },
      { id: "sunamganj", name: "Sunamganj", nameBn: "সুনামগঞ্জ", division: "Sylhet", divisionBn: "সিলেট", lat: 25.0658, lng: 91.3950 },
    ],
  },
  {
    name: "Barishal",
    nameBn: "বরিশাল",
    districts: [
      { id: "barishal", name: "Barishal", nameBn: "বরিশাল", division: "Barishal", divisionBn: "বরিশাল", lat: 22.7010, lng: 90.3535 },
      { id: "patuakhali", name: "Patuakhali", nameBn: "পটুয়াখালী", division: "Barishal", divisionBn: "বরিশাল", lat: 22.3596, lng: 90.3290 },
      { id: "bhola", name: "Bhola", nameBn: "ভোলা", division: "Barishal", divisionBn: "বরিশাল", lat: 22.6859, lng: 90.6482 },
      { id: "pirojpur", name: "Pirojpur", nameBn: "পিরোজপুর", division: "Barishal", divisionBn: "বরিশাল", lat: 22.5781, lng: 89.9749 },
      { id: "jhalokathi", name: "Jhalokathi", nameBn: "ঝালকাঠি", division: "Barishal", divisionBn: "বরিশাল", lat: 22.6406, lng: 90.1987 },
      { id: "barguna", name: "Barguna", nameBn: "বরগুনা", division: "Barishal", divisionBn: "বরিশাল", lat: 22.1530, lng: 90.1266 },
    ],
  },
  {
    name: "Rangpur",
    nameBn: "রংপুর",
    districts: [
      { id: "rangpur", name: "Rangpur", nameBn: "রংপুর", division: "Rangpur", divisionBn: "রংপুর", lat: 25.7439, lng: 89.2752 },
      { id: "dinajpur", name: "Dinajpur", nameBn: "দিনাজপুর", division: "Rangpur", divisionBn: "রংপুর", lat: 25.6279, lng: 88.6332 },
      { id: "kurigram", name: "Kurigram", nameBn: "কুড়িগ্রাম", division: "Rangpur", divisionBn: "রংপুর", lat: 25.8072, lng: 89.6295 },
      { id: "gaibandha", name: "Gaibandha", nameBn: "গাইবান্ধা", division: "Rangpur", divisionBn: "রংপুর", lat: 25.3288, lng: 89.5281 },
      { id: "lalmonirhat", name: "Lalmonirhat", nameBn: "লালমনিরহাট", division: "Rangpur", divisionBn: "রংপুর", lat: 25.9165, lng: 89.4537 },
      { id: "nilphamari", name: "Nilphamari", nameBn: "নীলফামারী", division: "Rangpur", divisionBn: "রংপুর", lat: 25.9316, lng: 88.8560 },
      { id: "panchagarh", name: "Panchagarh", nameBn: "পঞ্চগড়", division: "Rangpur", divisionBn: "রংপুর", lat: 26.3411, lng: 88.5542 },
      { id: "thakurgaon", name: "Thakurgaon", nameBn: "ঠাকুরগাঁও", division: "Rangpur", divisionBn: "রংপুর", lat: 26.0336, lng: 88.4616 },
    ],
  },
  {
    name: "Mymensingh",
    nameBn: "ময়মনসিংহ",
    districts: [
      { id: "mymensingh", name: "Mymensingh", nameBn: "ময়মনসিংহ", division: "Mymensingh", divisionBn: "ময়মনসিংহ", lat: 24.7471, lng: 90.4203 },
      { id: "netrokona", name: "Netrokona", nameBn: "নেত্রকোণা", division: "Mymensingh", divisionBn: "ময়মনসিংহ", lat: 24.8703, lng: 90.7279 },
      { id: "jamalpur", name: "Jamalpur", nameBn: "জামালপুর", division: "Mymensingh", divisionBn: "ময়মনসিংহ", lat: 24.9375, lng: 89.9372 },
      { id: "sherpur", name: "Sherpur", nameBn: "শেরপুর", division: "Mymensingh", divisionBn: "ময়মনসিংহ", lat: 25.0204, lng: 90.0153 },
    ],
  },
];

// Flat list of all districts
export const allDistricts: District[] = divisions.flatMap((d) => d.districts);

// Popular routes for the homepage
export const popularRoutes = [
  { from: "Dhaka", to: "Cox's Bazar", fromId: "dhaka", toId: "coxs-bazar", duration: "8-10h", price: "৳1,200 - ৳2,200", operators: 15 },
  { from: "Dhaka", to: "Sylhet", fromId: "dhaka", toId: "sylhet", duration: "5-7h", price: "৳800 - ৳1,500", operators: 12 },
  { from: "Dhaka", to: "Chattogram", fromId: "dhaka", toId: "chattogram", duration: "5-6h", price: "৳700 - ৳1,400", operators: 20 },
  { from: "Dhaka", to: "Rajshahi", fromId: "dhaka", toId: "rajshahi", duration: "5-6h", price: "৳700 - ৳1,200", operators: 10 },
  { from: "Dhaka", to: "Khulna", fromId: "dhaka", toId: "khulna", duration: "6-8h", price: "৳800 - ৳1,300", operators: 8 },
  { from: "Dhaka", to: "Rangpur", fromId: "dhaka", toId: "rangpur", duration: "7-9h", price: "৳900 - ৳1,500", operators: 7 },
  { from: "Dhaka", to: "Barishal", fromId: "dhaka", toId: "barishal", duration: "6-8h", price: "৳700 - ৳1,100", operators: 6 },
  { from: "Dhaka", to: "Dinajpur", fromId: "dhaka", toId: "dinajpur", duration: "8-10h", price: "৳1,000 - ৳1,600", operators: 5 },
];

// Major bus terminals for map display
export const majorTerminals = [
  { name: "Gabtoli Bus Terminal", nameBn: "গাবতলী বাস টার্মিনাল", district: "dhaka", lat: 23.7806, lng: 90.3436 },
  { name: "Sayedabad Bus Terminal", nameBn: "সায়েদাবাদ বাস টার্মিনাল", district: "dhaka", lat: 23.7115, lng: 90.4265 },
  { name: "Mohakhali Bus Terminal", nameBn: "মহাখালী বাস টার্মিনাল", district: "dhaka", lat: 23.7779, lng: 90.4013 },
  { name: "Kamalapur Bus Terminal", nameBn: "কমলাপুর বাস টার্মিনাল", district: "dhaka", lat: 23.7329, lng: 90.4268 },
  { name: "Chattogram Bus Terminal", nameBn: "চট্টগ্রাম বাস টার্মিনাল", district: "chattogram", lat: 22.3326, lng: 91.8130 },
  { name: "Sylhet Bus Terminal", nameBn: "সিলেট বাস টার্মিনাল", district: "sylhet", lat: 24.8986, lng: 91.8687 },
  { name: "Rajshahi Bus Terminal", nameBn: "রাজশাহী বাস টার্মিনাল", district: "rajshahi", lat: 24.3636, lng: 88.6241 },
  { name: "Cox's Bazar Bus Terminal", nameBn: "কক্সবাজার বাস টার্মিনাল", district: "coxs-bazar", lat: 21.4512, lng: 91.9734 },
  { name: "Khulna Bus Terminal", nameBn: "খুলনা বাস টার্মিনাল", district: "khulna", lat: 22.8098, lng: 89.5630 },
  { name: "Rangpur Bus Terminal", nameBn: "রংপুর বাস টার্মিনাল", district: "rangpur", lat: 25.7439, lng: 89.2752 },
];

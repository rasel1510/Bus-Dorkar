import { PrismaClient, Role, OperatorStatus, BusType, BusStatus } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import * as crypto from "crypto";
import bcrypt from "bcryptjs";

const connectionString = process.env.DATABASE_URL || "postgresql://neondb_owner:npg_fEOFu7acCGM1@ep-dark-recipe-azriqhkx.c-3.ap-southeast-1.aws.neon.tech/neondb?sslmode=require";
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const BUS_COMPANIES = [
  { name: "Green Line Paribahan", email: "info@greenline.com.bd", license: "TL-BD-982341", phone: "+8801711000001", buses: 450 },
  { name: "Shohagh Paribahan", email: "info@shohagh.com.bd", license: "TL-BD-559182", phone: "+8801711000002", buses: 320 },
  { name: "Hanif Enterprise", email: "info@hanifenterprise.com.bd", license: "TL-BD-881230", phone: "+8801711000003", buses: 850 },
  { name: "Ena Transport", email: "info@enatransport.com.bd", license: "TL-BD-661099", phone: "+8801711000004", buses: 600 },
  { name: "Shyamoli N.R Travels", email: "info@shyamolinr.com.bd", license: "TL-BD-771922", phone: "+8801711000005", buses: 380 },
  { name: "Saintmartin Travels", email: "info@saintmartintravels.com.bd", license: "TL-BD-442100", phone: "+8801711000006", buses: 150 },
  { name: "Desh Travels Express", email: "info@deshtravels.com.bd", license: "TL-BD-661002", phone: "+8801711000007", buses: 220 },
  { name: "Nabil Paribahan", email: "info@nabilparibahan.com.bd", license: "TL-BD-339011", phone: "+8801711000008", buses: 290 },
  { name: "Saudia Developmental Transport", email: "info@saudiatransport.com.bd", license: "TL-BD-228190", phone: "+8801711000009", buses: 410 },
  { name: "Royal Express", email: "info@royalexpress.com.bd", license: "TL-BD-119283", phone: "+8801711000010", buses: 180 },
  { name: "Silk Line Paribahan", email: "info@silkline.com.bd", license: "TL-BD-882910", phone: "+8801711000011", buses: 120 },
  { name: "Agami Desh Travels", email: "info@agamidesh.com.bd", license: "TL-BD-773821", phone: "+8801711000012", buses: 160 },
  { name: "TR Travels", email: "info@trtravels.com.bd", license: "TL-BD-554918", phone: "+8801711000013", buses: 190 },
  { name: "Eagle Paribahan", email: "info@eagleparibahan.com.bd", license: "TL-BD-994821", phone: "+8801711000014", buses: 350 },
  { name: "S.Alam Transport", email: "info@salamtransport.com.bd", license: "TL-BD-663910", phone: "+8801711000015", buses: 480 },
  { name: "BRTC (Bangladesh Road Transport Corp)", email: "info@brtc.gov.bd", license: "TL-BD-100001", phone: "+8801711000016", buses: 1200 },
  { name: "Rozina Enterprise", email: "info@rozinaenterprise.com.bd", license: "TL-BD-443910", phone: "+8801711000017", buses: 210 },
  { name: "Dipraj Paribahan", email: "info@diprajparibahan.com.bd", license: "TL-BD-883719", phone: "+8801711000018", buses: 170 },
  { name: "Sakura Paribahan", email: "info@sakuraparibahan.com.bd", license: "TL-BD-774910", phone: "+8801711000019", buses: 260 },
  { name: "Manik Express", email: "info@manikexpress.com.bd", license: "TL-BD-551829", phone: "+8801711000020", buses: 140 },
];

async function main() {
  const adminEmail = "rasel4897981@gmail.com";
  const adminPhone = "+8801700000001";

  console.log("Starting Neon DB Seed for Bus Dorkar...");

  const passwordHash = await bcrypt.hash("Admin@123456", 10);

  // 1. Seed Admin
  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: { role: Role.ADMIN },
    create: {
      name: "Rasel Admin",
      email: adminEmail,
      phone: adminPhone,
      passwordHash: passwordHash,
      role: Role.ADMIN,
      phoneVerified: true,
    },
  });
  console.log(`✅ Admin created/verified: ${admin.email}`);

  // 2. Seed All 20 Bus Operators
  for (const company of BUS_COMPANIES) {
    const ownerUser = await prisma.user.upsert({
      where: { email: company.email },
      update: { role: Role.BUS_OPERATOR },
      create: {
        name: `${company.name} Admin`,
        email: company.email,
        phone: company.phone,
        passwordHash,
        role: Role.BUS_OPERATOR,
        phoneVerified: true,
      },
    });

    const operator = await prisma.operatorProfile.upsert({
      where: { userId: ownerUser.id },
      update: {
        companyName: company.name,
        tradeLicenseNo: company.license,
        status: OperatorStatus.APPROVED,
      },
      create: {
        userId: ownerUser.id,
        companyName: company.name,
        tradeLicenseNo: company.license,
        status: OperatorStatus.APPROVED,
        rating: 4.5 + Math.random() * 0.4,
        totalReviews: Math.floor(1000 + Math.random() * 15000),
      },
    });

    // Seed default Bus for operator if none
    const busCount = await prisma.bus.count({ where: { operatorId: operator.id } });
    if (busCount === 0) {
      await prisma.bus.create({
        data: {
          operatorId: operator.id,
          registration: `DHAKA-METRO-B-${1000 + Math.floor(Math.random() * 8999)}`,
          model: "Scania Multi-Axle K410",
          type: BusType.AC_EXECUTIVE,
          totalSeats: 36,
          hasAC: true,
          hasWiFi: true,
          hasCharging: true,
          status: BusStatus.ACTIVE,
        },
      });
    }

    console.log(`✅ Operator seeded: ${company.name} (License: ${company.license})`);
  }

  console.log("🎉 Successfully seeded all 20 bus operators into Neon DB!");
}

main()
  .catch((e) => {
    console.error("Seed script error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });

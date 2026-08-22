import { PrismaClient, Role } from "@prisma/client";
import * as crypto from "crypto";

const prisma = new PrismaClient();

async function main() {
  const adminEmail = "rasel4897981@gmail.com";
  const adminPhone = "+8801700000001";
  
  console.log(`Seeding/Elevating user ${adminEmail} to ADMIN...`);

  // Hash password using crypto for standard seed compatibility
  const passwordHash = crypto
    .createHash("sha256")
    .update("Admin@123456")
    .digest("hex");

  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {
      role: Role.ADMIN,
    },
    create: {
      name: "Rasel Admin",
      email: adminEmail,
      phone: adminPhone,
      passwordHash: passwordHash,
      role: Role.ADMIN,
      phoneVerified: true,
    },
  });

  console.log(`Successfully configured Admin user: ${admin.email} (ID: ${admin.id}, Role: ${admin.role})`);
}

main()
  .catch((e) => {
    console.error("Seed script error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

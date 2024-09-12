import { PrismaClient } from "@prisma/client";
import { prisma } from "./prisma";
import { hash } from "bcrypt";

async function main() {
  await createUsers();
}

async function createUsers() {
  await prisma.user.create({
    data: {
      name: "John Doe",
      email: "john@example.com",
      password: await hash("test", 8),
      debtors: {
        create: {
          name: "Debtor 1",
          phone: "123456789",
          email: "debtor1@example.com",
          bills: {
            create: [
              {
                description: "Bill 1",
                value: 100.0,
                next_charge: new Date("2024-05-15T00:00:00Z"),
                active: true,
              },
              {
                description: "Bill 2",
                value: 150.0,
                next_charge: new Date("2024-05-20T00:00:00Z"),
                active: true,
              },
            ],
          },
        },
      },
    },
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

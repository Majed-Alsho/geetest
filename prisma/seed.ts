import { PrismaClient, UserRole } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Create USER test account
  const userPassword = await bcrypt.hash('EchelonTest123', 12);
  const userAccount = await prisma.user.upsert({
    where: { email: 'user@echelon.com' },
    update: {},
    create: {
      email: 'user@echelon.com',
      name: 'Test User',
      passwordHash: userPassword,
      role: UserRole.USER,
      emailVerified: new Date(),
    },
  });
  console.log('Created user:', userAccount.email);

  // Create ADMIN test account
  const adminPassword = await bcrypt.hash('EchelonTest123', 12);
  const adminAccount = await prisma.user.upsert({
    where: { email: 'admin@echelon.com' },
    update: {},
    create: {
      email: 'admin@echelon.com',
      name: 'Test Admin',
      passwordHash: adminPassword,
      role: UserRole.ADMIN,
      emailVerified: new Date(),
    },
  });
  console.log('Created admin:', adminAccount.email);

  // Create SUPERADMIN test account
  const superAdminPassword = await bcrypt.hash('EchelonTest123', 12);
  const superAdminAccount = await prisma.user.upsert({
    where: { email: 'super@echelon.com' },
    update: {},
    create: {
      email: 'super@echelon.com',
      name: 'Test SuperAdmin',
      passwordHash: superAdminPassword,
      role: UserRole.SUPERADMIN,
      emailVerified: new Date(),
    },
  });
  console.log('Created superadmin:', superAdminAccount.email);

  // Create OWNER test account
  const ownerPassword = await bcrypt.hash('EchelonTest123', 12);
  const ownerAccount = await prisma.user.upsert({
    where: { email: 'owner@echelon.com' },
    update: {},
    create: {
      email: 'owner@echelon.com',
      name: 'Test Owner',
      passwordHash: ownerPassword,
      role: UserRole.OWNER,
      emailVerified: new Date(),
    },
  });
  console.log('Created owner:', ownerAccount.email);

  console.log('\n========================================');
  console.log('DATABASE SEEDED SUCCESSFULLY!');
  console.log('========================================');
  console.log('\nTest Accounts for RBAC Testing:');
  console.log('----------------------------------------');
  console.log('| Role       | Email                | Password        |');
  console.log('|------------|----------------------|-----------------|');
  console.log('| USER       | user@echelon.com     | EchelonTest123  |');
  console.log('| ADMIN      | admin@echelon.com    | EchelonTest123  |');
  console.log('| SUPERADMIN | super@echelon.com    | EchelonTest123  |');
  console.log('| OWNER      | owner@echelon.com    | EchelonTest123  |');
  console.log('----------------------------------------\n');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

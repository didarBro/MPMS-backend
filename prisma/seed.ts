import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import dotenv from "dotenv";

dotenv.config();

const adapter = new PrismaPg({ connectionString: process.env["DATABASE_URL"] ?? "" });
const prisma = new PrismaClient({ adapter });

const SALT_ROUNDS = 12;

async function main(): Promise<void> {
  console.log("Seeding database...");

  // Clean slate — order respects FK constraints
  await prisma.timeLog.deleteMany({});
  await prisma.task.deleteMany({});
  await prisma.sprint.deleteMany({});
  await prisma.teamMember.deleteMany({});
  await prisma.team.deleteMany({});
  await prisma.projectMember.deleteMany({});
  await prisma.project.deleteMany({});
  await prisma.refreshToken.deleteMany({});
  await prisma.user.deleteMany({});
  console.log("Cleared existing data");

  // ─── Users ───────────────────────────────────────────────────────────────
  const adminPassword = await bcrypt.hash("Admin@123456", SALT_ROUNDS);
  const userPassword = await bcrypt.hash("User@123456", SALT_ROUNDS);

  const admin1 = await prisma.user.upsert({
    where: { email: "admin@mpms.dev" },
    update: {},
    create: { name: "Alice Admin", email: "admin@mpms.dev", password: adminPassword, role: "ADMIN" },
  });

  const admin2 = await prisma.user.upsert({
    where: { email: "bob.admin@mpms.dev" },
    update: {},
    create: { name: "Bob Manager", email: "bob.admin@mpms.dev", password: adminPassword, role: "ADMIN" },
  });

  const user1 = await prisma.user.upsert({
    where: { email: "carol@mpms.dev" },
    update: {},
    create: { name: "Carol Dev", email: "carol@mpms.dev", password: userPassword, role: "USER" },
  });

  const user2 = await prisma.user.upsert({
    where: { email: "dave@mpms.dev" },
    update: {},
    create: { name: "Dave Engineer", email: "dave@mpms.dev", password: userPassword, role: "USER" },
  });

  const user3 = await prisma.user.upsert({
    where: { email: "eve@mpms.dev" },
    update: {},
    create: { name: "Eve Designer", email: "eve@mpms.dev", password: userPassword, role: "USER" },
  });

  const user4 = await prisma.user.upsert({
    where: { email: "frank@mpms.dev" },
    update: {},
    create: { name: "Frank QA", email: "frank@mpms.dev", password: userPassword, role: "USER" },
  });

  const user5 = await prisma.user.upsert({
    where: { email: "grace@mpms.dev" },
    update: {},
    create: { name: "Grace DevOps", email: "grace@mpms.dev", password: userPassword, role: "USER" },
  });

  console.log("Users seeded");

  // ─── Projects ────────────────────────────────────────────────────────────
  const project1 = await prisma.project.create({
    data: {
      name: "E-Commerce Platform",
      client: "ShopNest Inc.",
      description: "Full-stack e-commerce solution with payment integration, inventory management, and a customer-facing storefront.",
      status: "ACTIVE",
      startDate: new Date("2024-01-15"),
      endDate: new Date("2024-07-31"),
      budget: 85000,
      thumbnail: "https://picsum.photos/seed/ecommerce/800/220",
    },
  });

  const project2 = await prisma.project.create({
    data: {
      name: "Mobile Banking App",
      client: "FinCore Bank",
      description: "Secure mobile banking application with biometric authentication, real-time transactions, and spending insights.",
      status: "ACTIVE",
      startDate: new Date("2024-03-01"),
      endDate: new Date("2024-12-31"),
      budget: 140000,
      thumbnail: "https://picsum.photos/seed/banking/800/220",
    },
  });

  const project3 = await prisma.project.create({
    data: {
      name: "Data Analytics Dashboard",
      client: "Insight Analytics Co.",
      description: "Business intelligence dashboard with interactive charts, drill-down reports, and automated weekly digests.",
      status: "COMPLETED",
      startDate: new Date("2023-09-01"),
      endDate: new Date("2024-02-28"),
      budget: 52000,
      thumbnail: "https://picsum.photos/seed/analytics/800/220",
    },
  });

  const project4 = await prisma.project.create({
    data: {
      name: "HR Management System",
      client: "PeopleFirst Ltd.",
      description: "Centralized HR platform covering employee onboarding, leave management, payroll integration, and performance reviews.",
      status: "PLANNED",
      startDate: new Date("2024-09-01"),
      endDate: new Date("2025-03-31"),
      budget: 72000,
      thumbnail: "https://picsum.photos/seed/hrms/800/220",
    },
  });

  const project5 = await prisma.project.create({
    data: {
      name: "Legacy CRM Migration",
      client: "RetailGiant Corp.",
      description: "Data migration and modernization of a 10-year-old CRM to a cloud-native microservices architecture.",
      status: "ARCHIVED",
      startDate: new Date("2022-06-01"),
      endDate: new Date("2023-05-31"),
      budget: 200000,
      thumbnail: "https://picsum.photos/seed/crm/800/220",
    },
  });

  console.log("Projects seeded");

  // ─── Project Members ─────────────────────────────────────────────────────
  await prisma.projectMember.createMany({
    data: [
      { projectId: project1.id, userId: admin1.id, role: "OWNER" },
      { projectId: project1.id, userId: user1.id, role: "MEMBER" },
      { projectId: project1.id, userId: user2.id, role: "MEMBER" },
      { projectId: project1.id, userId: user3.id, role: "MEMBER" },
      { projectId: project2.id, userId: admin2.id, role: "OWNER" },
      { projectId: project2.id, userId: user2.id, role: "MEMBER" },
      { projectId: project2.id, userId: user4.id, role: "MEMBER" },
      { projectId: project2.id, userId: user5.id, role: "MEMBER" },
      { projectId: project3.id, userId: admin1.id, role: "OWNER" },
      { projectId: project3.id, userId: user1.id, role: "MEMBER" },
      { projectId: project3.id, userId: user3.id, role: "MEMBER" },
      // HR Management System (PLANNED)
      { projectId: project4.id, userId: admin1.id, role: "OWNER" },
      { projectId: project4.id, userId: user3.id, role: "MEMBER" },
      { projectId: project4.id, userId: user4.id, role: "MEMBER" },
      // Legacy CRM Migration (ARCHIVED)
      { projectId: project5.id, userId: admin2.id, role: "OWNER" },
      { projectId: project5.id, userId: user2.id, role: "MEMBER" },
      { projectId: project5.id, userId: user5.id, role: "MEMBER" },
    ],
    skipDuplicates: true,
  });

  // ─── Teams ───────────────────────────────────────────────────────────────
  const team1 = await prisma.team.create({
    data: {
      name: "Frontend Team",
      description: "Responsible for UI/UX and React components",
      projectId: project1.id,
    },
  });

  const team2 = await prisma.team.create({
    data: {
      name: "Backend Team",
      description: "API development and database management",
      projectId: project1.id,
    },
  });

  const team3 = await prisma.team.create({
    data: {
      name: "Mobile Team",
      description: "iOS and Android development",
      projectId: project2.id,
    },
  });

  await prisma.teamMember.createMany({
    data: [
      { teamId: team1.id, userId: user3.id },
      { teamId: team1.id, userId: user1.id },
      { teamId: team2.id, userId: user1.id },
      { teamId: team2.id, userId: user2.id },
      { teamId: team3.id, userId: user2.id },
      { teamId: team3.id, userId: user4.id },
      { teamId: team3.id, userId: user5.id },
    ],
    skipDuplicates: true,
  });

  console.log("Teams seeded");

  // ─── Sprints ─────────────────────────────────────────────────────────────
  const sprint1 = await prisma.sprint.create({
    data: {
      name: "Sprint 1 – Foundation",
      goal: "Set up project structure, auth, and core APIs",
      status: "COMPLETED",
      startDate: new Date("2024-01-22"),
      endDate: new Date("2024-02-04"),
      projectId: project1.id,
    },
  });

  const sprint2 = await prisma.sprint.create({
    data: {
      name: "Sprint 2 – Core Features",
      goal: "Product catalog, cart, and checkout flow",
      status: "ACTIVE",
      startDate: new Date("2024-02-05"),
      endDate: new Date("2024-02-18"),
      projectId: project1.id,
    },
  });

  const sprint3 = await prisma.sprint.create({
    data: {
      name: "Sprint 3 – Payments & Polish",
      goal: "Payment integration, notifications, and bug fixes",
      status: "PLANNED",
      startDate: new Date("2024-02-19"),
      endDate: new Date("2024-03-03"),
      projectId: project1.id,
    },
  });

  const sprint4 = await prisma.sprint.create({
    data: {
      name: "Sprint 1 – Security Layer",
      goal: "Biometric auth, encryption, and secure storage",
      status: "ACTIVE",
      startDate: new Date("2024-03-04"),
      endDate: new Date("2024-03-17"),
      projectId: project2.id,
    },
  });

  const sprint5 = await prisma.sprint.create({
    data: {
      name: "Sprint 2 – Transaction Engine",
      goal: "Real-time transfers, history, and notifications",
      status: "PLANNED",
      startDate: new Date("2024-03-18"),
      endDate: new Date("2024-03-31"),
      projectId: project2.id,
    },
  });

  console.log("Sprints seeded");

  // ─── Tasks ───────────────────────────────────────────────────────────────
  const tasks = await prisma.task.createManyAndReturn({
    data: [
      // Sprint 1 – Completed
      {
        title: "Initialize project repository and CI/CD pipeline",
        description: "Set up GitHub repo, configure GitHub Actions for automated testing and deployment.",
        status: "DONE",
        priority: "HIGH",
        storyPoints: 5,
        sprintId: sprint1.id,
        assigneeId: user5.id,
        createdById: admin1.id,
        dueDate: new Date("2024-01-26"),
      },
      {
        title: "Implement JWT authentication API",
        description: "Register, login, refresh token, and logout endpoints with bcrypt password hashing.",
        status: "DONE",
        priority: "CRITICAL",
        storyPoints: 8,
        sprintId: sprint1.id,
        assigneeId: user1.id,
        createdById: admin1.id,
        dueDate: new Date("2024-01-30"),
      },
      {
        title: "Design database schema with Prisma",
        description: "Define all models: User, Product, Order, Cart, Category with relations.",
        status: "DONE",
        priority: "HIGH",
        storyPoints: 5,
        sprintId: sprint1.id,
        assigneeId: user2.id,
        createdById: admin1.id,
        dueDate: new Date("2024-01-28"),
      },
      {
        title: "Create reusable UI component library",
        description: "Build Button, Input, Card, Modal, Table components with Tailwind and shadcn.",
        status: "DONE",
        priority: "MEDIUM",
        storyPoints: 5,
        sprintId: sprint1.id,
        assigneeId: user3.id,
        createdById: admin1.id,
        dueDate: new Date("2024-02-02"),
      },
      // Sprint 2 – Active
      {
        title: "Build product catalog with filters and search",
        description: "Category browsing, keyword search with debounce, price range filter, pagination.",
        status: "IN_REVIEW",
        priority: "HIGH",
        storyPoints: 8,
        sprintId: sprint2.id,
        assigneeId: user3.id,
        createdById: admin1.id,
        dueDate: new Date("2024-02-12"),
      },
      {
        title: "Implement shopping cart (add/remove/update quantity)",
        description: "Client-side cart with Zustand, persist to backend, real-time stock check.",
        status: "IN_PROGRESS",
        priority: "HIGH",
        storyPoints: 8,
        sprintId: sprint2.id,
        assigneeId: user1.id,
        createdById: admin1.id,
        dueDate: new Date("2024-02-14"),
      },
      {
        title: "Product detail page with image gallery",
        description: "Hero image carousel, zoom, related products, reviews section.",
        status: "DONE",
        priority: "MEDIUM",
        storyPoints: 5,
        sprintId: sprint2.id,
        assigneeId: user3.id,
        createdById: admin1.id,
        dueDate: new Date("2024-02-10"),
      },
      {
        title: "REST API: Orders CRUD with status workflow",
        description: "Create order, update status (pending→processing→shipped→delivered), cancel order.",
        status: "IN_PROGRESS",
        priority: "HIGH",
        storyPoints: 8,
        sprintId: sprint2.id,
        assigneeId: user2.id,
        createdById: admin1.id,
        dueDate: new Date("2024-02-16"),
      },
      {
        title: "Write unit tests for auth service",
        description: "Jest tests for register, login, refresh, logout with mocked Prisma.",
        status: "TODO",
        priority: "MEDIUM",
        storyPoints: 3,
        sprintId: sprint2.id,
        assigneeId: user4.id,
        createdById: admin1.id,
        dueDate: new Date("2024-02-18"),
      },
      // Sprint 3 – Planned
      {
        title: "Integrate Stripe payment gateway",
        description: "Stripe Elements for card collection, webhooks for payment confirmation.",
        status: "TODO",
        priority: "CRITICAL",
        storyPoints: 13,
        sprintId: sprint3.id,
        assigneeId: user2.id,
        createdById: admin1.id,
        dueDate: new Date("2024-02-26"),
      },
      {
        title: "Email notifications for order events",
        description: "Nodemailer with HTML templates for order confirmation, shipping, delivery.",
        status: "TODO",
        priority: "MEDIUM",
        storyPoints: 5,
        sprintId: sprint3.id,
        assigneeId: user5.id,
        createdById: admin1.id,
        dueDate: new Date("2024-02-28"),
      },
      // Banking project tasks
      {
        title: "Implement biometric authentication (Face ID / Touch ID)",
        description: "React Native Biometrics integration with fallback PIN authentication.",
        status: "IN_PROGRESS",
        priority: "CRITICAL",
        storyPoints: 13,
        sprintId: sprint4.id,
        assigneeId: user2.id,
        createdById: admin2.id,
        dueDate: new Date("2024-03-10"),
      },
      {
        title: "End-to-end encryption for API calls",
        description: "TLS pinning, request signing with HMAC-SHA256, sensitive data masking in logs.",
        status: "TODO",
        priority: "CRITICAL",
        storyPoints: 8,
        sprintId: sprint4.id,
        assigneeId: user5.id,
        createdById: admin2.id,
        dueDate: new Date("2024-03-15"),
      },
      {
        title: "Secure local storage with encryption",
        description: "Encrypt sensitive data stored locally using AES-256, auto-wipe on failed attempts.",
        status: "TODO",
        priority: "HIGH",
        storyPoints: 5,
        sprintId: sprint4.id,
        assigneeId: user4.id,
        createdById: admin2.id,
        dueDate: new Date("2024-03-17"),
      },
      {
        title: "Penetration testing and security audit",
        description: "OWASP Mobile Top 10 assessment, fix identified vulnerabilities.",
        status: "TODO",
        priority: "HIGH",
        storyPoints: 8,
        sprintId: sprint4.id,
        assigneeId: user4.id,
        createdById: admin2.id,
        dueDate: new Date("2024-03-17"),
      },
    ],
  });

  console.log(`${tasks.length} tasks seeded`);

  // ─── Time Logs ───────────────────────────────────────────────────────────
  const doneTasks = tasks.filter((t) => t.status === "DONE");

  for (const task of doneTasks) {
    if (!task.assigneeId) continue;
    await prisma.timeLog.createMany({
      data: [
        {
          hours: 3.5,
          description: "Initial setup and research",
          date: new Date(task.dueDate!.getTime() - 2 * 24 * 60 * 60 * 1000),
          taskId: task.id,
          userId: task.assigneeId,
        },
        {
          hours: 4,
          description: "Core implementation",
          date: new Date(task.dueDate!.getTime() - 24 * 60 * 60 * 1000),
          taskId: task.id,
          userId: task.assigneeId,
        },
        {
          hours: 1.5,
          description: "Testing and review fixes",
          date: task.dueDate!,
          taskId: task.id,
          userId: task.assigneeId,
        },
      ],
    });
  }

  console.log("Time logs seeded");
  console.log("\n✓ Seed complete!");
  console.log("\nDefault accounts:");
  console.log("  Admin: admin@mpms.dev / Admin@123456");
  console.log("  Admin: bob.admin@mpms.dev / Admin@123456");
  console.log("  User:  carol@mpms.dev / User@123456");
  console.log("  User:  dave@mpms.dev / User@123456");
  console.log("  User:  eve@mpms.dev / User@123456");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

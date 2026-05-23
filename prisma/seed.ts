import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import dotenv from "dotenv";

dotenv.config();

const adapter = new PrismaPg({ connectionString: process.env["DATABASE_URL"] ?? "" });
const prisma = new PrismaClient({ adapter });

const SALT_ROUNDS = 12;

async function main(): Promise<void> {
  console.log("🌱 Seeding database...");

  // ─── Cleanup (FK-safe order) ─────────────────────────────────────────────
  await prisma.activityLog.deleteMany({});
  await prisma.comment.deleteMany({});
  await prisma.timeLog.deleteMany({});
  await prisma.attachment.deleteMany({});
  await prisma.task.deleteMany({});
  await prisma.sprint.deleteMany({});
  await prisma.teamMember.deleteMany({});
  await prisma.team.deleteMany({});
  await prisma.projectMember.deleteMany({});
  await prisma.project.deleteMany({});
  await prisma.refreshToken.deleteMany({});
  await prisma.user.deleteMany({});
  console.log("  ✓ Cleared existing data");

  // ─── Users ───────────────────────────────────────────────────────────────
  const adminPassword = await bcrypt.hash("Admin@123456", SALT_ROUNDS);
  const userPassword  = await bcrypt.hash("User@123456",  SALT_ROUNDS);

  const alice = await prisma.user.upsert({
    where: { email: "alice.admin@mpms.dev" },
    update: {},
    create: {
      name: "Alice Thornton",
      email: "alice.admin@mpms.dev",
      password: adminPassword,
      role: "ADMIN",
      department: "Product Management",
      skills: ["Project Management", "Agile", "Roadmapping", "Stakeholder Communication"],
    },
  });

  const bob = await prisma.user.upsert({
    where: { email: "bob.admin@mpms.dev" },
    update: {},
    create: {
      name: "Bob Mercer",
      email: "bob.admin@mpms.dev",
      password: adminPassword,
      role: "ADMIN",
      department: "Engineering Management",
      skills: ["Scrum Master", "Risk Management", "System Architecture", "Team Leadership"],
    },
  });

  const carol = await prisma.user.upsert({
    where: { email: "carol@mpms.dev" },
    update: {},
    create: {
      name: "Carol Rivera",
      email: "carol@mpms.dev",
      password: userPassword,
      role: "USER",
      department: "Frontend Engineering",
      skills: ["React", "TypeScript", "Next.js", "Tailwind CSS", "Accessibility"],
    },
  });

  const dave = await prisma.user.upsert({
    where: { email: "dave@mpms.dev" },
    update: {},
    create: {
      name: "Dave Okafor",
      email: "dave@mpms.dev",
      password: userPassword,
      role: "USER",
      department: "Backend Engineering",
      skills: ["Node.js", "PostgreSQL", "Redis", "Docker", "REST API Design"],
    },
  });

  const eve = await prisma.user.upsert({
    where: { email: "eve@mpms.dev" },
    update: {},
    create: {
      name: "Eve Nakamura",
      email: "eve@mpms.dev",
      password: userPassword,
      role: "USER",
      department: "UX Design",
      skills: ["Figma", "UI/UX Design", "User Research", "Prototyping", "Design Systems"],
    },
  });

  const frank = await prisma.user.upsert({
    where: { email: "frank@mpms.dev" },
    update: {},
    create: {
      name: "Frank Donovan",
      email: "frank@mpms.dev",
      password: userPassword,
      role: "USER",
      department: "Quality Assurance",
      skills: ["Jest", "Cypress", "Playwright", "Test Automation", "Performance Testing"],
    },
  });

  const grace = await prisma.user.upsert({
    where: { email: "grace@mpms.dev" },
    update: {},
    create: {
      name: "Grace Liu",
      email: "grace@mpms.dev",
      password: userPassword,
      role: "USER",
      department: "DevOps & Infrastructure",
      skills: ["AWS", "CI/CD", "Kubernetes", "Terraform", "Monitoring"],
    },
  });

  console.log("  ✓ Users seeded");

  // ─── Projects ────────────────────────────────────────────────────────────
  const ecommerce = await prisma.project.create({
    data: {
      name: "E-Commerce Platform",
      client: "ShopNest Inc.",
      description:
        "Full-stack e-commerce solution with product catalog, shopping cart, Stripe payment integration, order management, and a customer-facing storefront built with Next.js.",
      status: "ACTIVE",
      startDate: new Date("2024-01-15"),
      endDate: new Date("2024-07-31"),
      budget: 85000,
      thumbnail: "https://picsum.photos/seed/ecommerce/800/220",
    },
  });

  const banking = await prisma.project.create({
    data: {
      name: "Mobile Banking App",
      client: "FinCore Bank",
      description:
        "Secure mobile banking application featuring biometric authentication, real-time fund transfers, spending analytics, and push notifications for transaction alerts.",
      status: "ACTIVE",
      startDate: new Date("2024-03-01"),
      endDate: new Date("2024-12-31"),
      budget: 140000,
      thumbnail: "https://picsum.photos/seed/banking/800/220",
    },
  });

  const analytics = await prisma.project.create({
    data: {
      name: "Data Analytics Dashboard",
      client: "Insight Analytics Co.",
      description:
        "Business intelligence platform with interactive charts, drill-down reports, scheduled digest emails, and a self-service query builder for non-technical stakeholders.",
      status: "COMPLETED",
      startDate: new Date("2023-09-01"),
      endDate: new Date("2024-02-28"),
      budget: 52000,
      thumbnail: "https://picsum.photos/seed/analytics/800/220",
    },
  });

  const hrms = await prisma.project.create({
    data: {
      name: "HR Management System",
      client: "PeopleFirst Ltd.",
      description:
        "Centralized HR platform covering employee onboarding, leave management, payroll integration, performance reviews, and org-chart visualisation.",
      status: "PLANNED",
      startDate: new Date("2024-09-01"),
      endDate: new Date("2025-03-31"),
      budget: 72000,
      thumbnail: "https://picsum.photos/seed/hrms/800/220",
    },
  });

  const crmMigration = await prisma.project.create({
    data: {
      name: "Legacy CRM Migration",
      client: "RetailGiant Corp.",
      description:
        "Data migration and modernisation of a decade-old on-premise CRM to a cloud-native microservices architecture with zero-downtime cut-over strategy.",
      status: "ARCHIVED",
      startDate: new Date("2022-06-01"),
      endDate: new Date("2023-05-31"),
      budget: 200000,
      thumbnail: "https://picsum.photos/seed/crm/800/220",
    },
  });

  console.log("  ✓ Projects seeded");

  // ─── Project Members ─────────────────────────────────────────────────────
  await prisma.projectMember.createMany({
    data: [
      // E-Commerce Platform
      { projectId: ecommerce.id, userId: alice.id, role: "OWNER" },
      { projectId: ecommerce.id, userId: carol.id, role: "MEMBER" },
      { projectId: ecommerce.id, userId: dave.id,  role: "MEMBER" },
      { projectId: ecommerce.id, userId: eve.id,   role: "MEMBER" },
      { projectId: ecommerce.id, userId: frank.id, role: "MEMBER" },
      // Mobile Banking App
      { projectId: banking.id, userId: bob.id,   role: "OWNER" },
      { projectId: banking.id, userId: dave.id,  role: "MEMBER" },
      { projectId: banking.id, userId: frank.id, role: "MEMBER" },
      { projectId: banking.id, userId: grace.id, role: "MEMBER" },
      // Data Analytics Dashboard
      { projectId: analytics.id, userId: alice.id, role: "OWNER" },
      { projectId: analytics.id, userId: carol.id, role: "MEMBER" },
      { projectId: analytics.id, userId: eve.id,   role: "MEMBER" },
      // HR Management System
      { projectId: hrms.id, userId: alice.id, role: "OWNER" },
      { projectId: hrms.id, userId: eve.id,   role: "MEMBER" },
      { projectId: hrms.id, userId: frank.id, role: "MEMBER" },
      // Legacy CRM Migration
      { projectId: crmMigration.id, userId: bob.id,   role: "OWNER" },
      { projectId: crmMigration.id, userId: dave.id,  role: "MEMBER" },
      { projectId: crmMigration.id, userId: grace.id, role: "MEMBER" },
    ],
    skipDuplicates: true,
  });

  // ─── Teams ───────────────────────────────────────────────────────────────
  const frontendTeam = await prisma.team.create({
    data: {
      name: "Frontend Team",
      description: "Owns all React/Next.js UI components, design system, and accessibility.",
      projectId: ecommerce.id,
    },
  });

  const backendTeam = await prisma.team.create({
    data: {
      name: "Backend Team",
      description: "Responsible for REST API design, database modelling, and third-party integrations.",
      projectId: ecommerce.id,
    },
  });

  const mobileTeam = await prisma.team.create({
    data: {
      name: "Mobile & Security Team",
      description: "Cross-platform React Native development with a focus on security and performance.",
      projectId: banking.id,
    },
  });

  await prisma.teamMember.createMany({
    data: [
      { teamId: frontendTeam.id, userId: carol.id, role: "ADMIN"   },
      { teamId: frontendTeam.id, userId: eve.id,   role: "MANAGER" },
      { teamId: backendTeam.id,  userId: dave.id,  role: "ADMIN"   },
      { teamId: backendTeam.id,  userId: frank.id, role: "MEMBER"  },
      { teamId: mobileTeam.id,   userId: grace.id, role: "ADMIN"   },
      { teamId: mobileTeam.id,   userId: dave.id,  role: "MANAGER" },
      { teamId: mobileTeam.id,   userId: frank.id, role: "MEMBER"  },
    ],
    skipDuplicates: true,
  });

  console.log("  ✓ Teams seeded");

  // ─── Sprints ─────────────────────────────────────────────────────────────
  // E-Commerce Platform
  const ec_sprint1 = await prisma.sprint.create({
    data: {
      name: "Foundation",
      sprintNumber: 1,
      order: 1,
      goal: "Establish project infrastructure, authentication, and core database schema",
      status: "COMPLETED",
      startDate: new Date("2024-01-22"),
      endDate:   new Date("2024-02-04"),
      projectId: ecommerce.id,
    },
  });

  const ec_sprint2 = await prisma.sprint.create({
    data: {
      name: "Core Shopping Experience",
      sprintNumber: 2,
      order: 2,
      goal: "Deliver product catalog, shopping cart, and order creation flow",
      status: "ACTIVE",
      startDate: new Date("2024-02-05"),
      endDate:   new Date("2024-02-18"),
      projectId: ecommerce.id,
    },
  });

  const ec_sprint3 = await prisma.sprint.create({
    data: {
      name: "Payments & Notifications",
      sprintNumber: 3,
      order: 3,
      goal: "Integrate Stripe, implement email notifications, and address QA feedback",
      status: "PLANNED",
      startDate: new Date("2024-02-19"),
      endDate:   new Date("2024-03-03"),
      projectId: ecommerce.id,
    },
  });

  // Mobile Banking App
  const mb_sprint1 = await prisma.sprint.create({
    data: {
      name: "Security Layer",
      sprintNumber: 1,
      order: 1,
      goal: "Biometric authentication, end-to-end encryption, and secure local storage",
      status: "ACTIVE",
      startDate: new Date("2024-03-04"),
      endDate:   new Date("2024-03-17"),
      projectId: banking.id,
    },
  });

  const mb_sprint2 = await prisma.sprint.create({
    data: {
      name: "Transaction Engine",
      sprintNumber: 2,
      order: 2,
      goal: "Real-time fund transfers, transaction history, and push notification triggers",
      status: "PLANNED",
      startDate: new Date("2024-03-18"),
      endDate:   new Date("2024-03-31"),
      projectId: banking.id,
    },
  });

  // HR Management System
  await prisma.sprint.create({
    data: {
      name: "Discovery & Design",
      sprintNumber: 1,
      order: 1,
      goal: "Stakeholder interviews, user journey mapping, Figma wireframes, and ERD finalisation",
      status: "PLANNED",
      startDate: new Date("2024-09-02"),
      endDate:   new Date("2024-09-15"),
      projectId: hrms.id,
    },
  });

  console.log("  ✓ Sprints seeded");

  // ─── Tasks ───────────────────────────────────────────────────────────────
  const tasks = await prisma.task.createManyAndReturn({
    data: [
      // ── EC Sprint 1 (COMPLETED) ──────────────────────────────────────────
      {
        title: "Set up monorepo, CI/CD pipeline, and deployment environments",
        description:
          "Initialise Git repository, configure GitHub Actions for lint → test → build → deploy pipeline. Provision staging and production environments on Railway.",
        status: "DONE",
        priority: "HIGH",
        storyPoints: 5,
        estimate: 4,
        sprintId: ec_sprint1.id,
        assigneeId: grace.id,
        createdById: alice.id,
        dueDate: new Date("2024-01-26"),
      },
      {
        title: "Implement JWT authentication (register / login / refresh / logout)",
        description:
          "Build auth endpoints with bcrypt password hashing, 15-minute access tokens, 7-day refresh tokens stored in HttpOnly cookies, and refresh token rotation.",
        status: "DONE",
        priority: "CRITICAL",
        storyPoints: 8,
        estimate: 8,
        sprintId: ec_sprint1.id,
        assigneeId: dave.id,
        createdById: alice.id,
        dueDate: new Date("2024-01-30"),
      },
      {
        title: "Design Prisma schema: Product, Category, Order, Cart, Review",
        description:
          "Model all entities with proper relations, indexes, and soft-delete flags. Write the initial migration and validate with seed data.",
        status: "DONE",
        priority: "HIGH",
        storyPoints: 5,
        estimate: 6,
        sprintId: ec_sprint1.id,
        assigneeId: dave.id,
        createdById: alice.id,
        dueDate: new Date("2024-01-28"),
      },
      {
        title: "Build reusable UI component library (shadcn + custom tokens)",
        description:
          "Implement Button, Input, Select, Modal, Table, Badge, Toast, Skeleton components. Document in Storybook and publish design tokens.",
        status: "DONE",
        priority: "MEDIUM",
        storyPoints: 5,
        estimate: 5,
        sprintId: ec_sprint1.id,
        assigneeId: carol.id,
        createdById: alice.id,
        dueDate: new Date("2024-02-02"),
      },
      // ── EC Sprint 2 (ACTIVE) ─────────────────────────────────────────────
      {
        title: "Product catalog: category browsing, search, filters, and pagination",
        description:
          "Keyword search with 300ms debounce, price-range slider, multi-select category filter, sort options (price asc/desc, newest), and URL-persisted filter state.",
        status: "IN_REVIEW",
        priority: "HIGH",
        storyPoints: 8,
        estimate: 8,
        sprintId: ec_sprint2.id,
        assigneeId: carol.id,
        createdById: alice.id,
        dueDate: new Date("2024-02-12"),
      },
      {
        title: "Shopping cart: add / remove / update quantity with real-time stock validation",
        description:
          "Zustand cart store with optimistic updates. Persist cart to backend on change. Show out-of-stock warning when quantity exceeds available inventory.",
        status: "IN_PROGRESS",
        priority: "HIGH",
        storyPoints: 8,
        estimate: 6,
        sprintId: ec_sprint2.id,
        assigneeId: dave.id,
        createdById: alice.id,
        dueDate: new Date("2024-02-14"),
      },
      {
        title: "Product detail page: image gallery, specs, reviews, and related items",
        description:
          "Hero image carousel with zoom, tabbed specification view, paginated reviews with star rating, and a 'You may also like' row powered by category similarity.",
        status: "DONE",
        priority: "MEDIUM",
        storyPoints: 5,
        estimate: 4,
        sprintId: ec_sprint2.id,
        assigneeId: carol.id,
        createdById: alice.id,
        dueDate: new Date("2024-02-10"),
      },
      {
        title: "Orders REST API: CRUD with status-machine workflow",
        description:
          "POST /orders, GET /orders/:id, PATCH /orders/:id/status. Enforce state transitions: pending → processing → shipped → delivered (cancel allowed from pending/processing).",
        status: "IN_PROGRESS",
        priority: "HIGH",
        storyPoints: 8,
        estimate: 8,
        sprintId: ec_sprint2.id,
        assigneeId: dave.id,
        createdById: alice.id,
        dueDate: new Date("2024-02-16"),
      },
      {
        title: "Write integration tests for auth and product endpoints",
        description:
          "Supertest + Jest test suite covering happy paths and edge cases (expired tokens, duplicate email, invalid product IDs). Target 80%+ branch coverage.",
        status: "TODO",
        priority: "MEDIUM",
        storyPoints: 3,
        estimate: 4,
        sprintId: ec_sprint2.id,
        assigneeId: frank.id,
        createdById: alice.id,
        dueDate: new Date("2024-02-18"),
      },
      // ── EC Sprint 3 (PLANNED) ────────────────────────────────────────────
      {
        title: "Integrate Stripe Checkout: card payment and webhook confirmation",
        description:
          "Use Stripe Elements for card collection. Handle payment_intent.succeeded and payment_intent.payment_failed webhooks. Idempotent order fulfillment on success.",
        status: "TODO",
        priority: "CRITICAL",
        storyPoints: 13,
        estimate: 12,
        sprintId: ec_sprint3.id,
        assigneeId: dave.id,
        createdById: alice.id,
        dueDate: new Date("2024-02-26"),
      },
      {
        title: "Transactional email notifications for order lifecycle events",
        description:
          "Resend/Nodemailer HTML templates for: order confirmation, payment receipt, shipment tracking link, delivery confirmation. Retry on failure with exponential back-off.",
        status: "TODO",
        priority: "MEDIUM",
        storyPoints: 5,
        estimate: 4,
        sprintId: ec_sprint3.id,
        assigneeId: grace.id,
        createdById: alice.id,
        dueDate: new Date("2024-02-28"),
      },
      // ── MB Sprint 1 (ACTIVE) ─────────────────────────────────────────────
      {
        title: "Biometric authentication: Face ID / Touch ID with PIN fallback",
        description:
          "react-native-biometrics integration. Detect enrolled biometrics, prompt on login, fall back to a 6-digit PIN. Store PIN hash in encrypted AsyncStorage.",
        status: "IN_PROGRESS",
        priority: "CRITICAL",
        storyPoints: 13,
        estimate: 10,
        sprintId: mb_sprint1.id,
        assigneeId: dave.id,
        createdById: bob.id,
        dueDate: new Date("2024-03-10"),
      },
      {
        title: "End-to-end API encryption: TLS pinning and HMAC-SHA256 request signing",
        description:
          "Pin the server certificate in the mobile client. Sign every API request with HMAC-SHA256 using a device-bound secret. Strip sensitive data from logs.",
        status: "TODO",
        priority: "CRITICAL",
        storyPoints: 8,
        estimate: 8,
        sprintId: mb_sprint1.id,
        assigneeId: grace.id,
        createdById: bob.id,
        dueDate: new Date("2024-03-15"),
      },
      {
        title: "Encrypted local storage with AES-256 and auto-wipe on failed PIN attempts",
        description:
          "Wrap AsyncStorage with AES-256 encryption via react-native-encrypted-storage. Wipe stored credentials after 5 consecutive failed PIN entries.",
        status: "TODO",
        priority: "HIGH",
        storyPoints: 5,
        estimate: 4,
        sprintId: mb_sprint1.id,
        assigneeId: frank.id,
        createdById: bob.id,
        dueDate: new Date("2024-03-17"),
      },
      {
        title: "OWASP Mobile Top 10 security audit and penetration test",
        description:
          "Run MobSF static analysis, manual pen-test against OWASP MAS checklist. Document findings in a security report and track remediation items as follow-up tasks.",
        status: "TODO",
        priority: "HIGH",
        storyPoints: 8,
        estimate: 6,
        sprintId: mb_sprint1.id,
        assigneeId: frank.id,
        createdById: bob.id,
        dueDate: new Date("2024-03-17"),
      },
    ],
  });

  console.log(`  ✓ ${tasks.length} tasks seeded`);

  // ─── Subtasks ────────────────────────────────────────────────────────────
  // Subtasks for "Stripe Checkout" task
  const stripeTask = tasks[9]!;
  await prisma.task.createMany({
    data: [
      {
        title: "Configure Stripe SDK and environment keys",
        status: "TODO",
        priority: "HIGH",
        storyPoints: 2,
        estimate: 1,
        parentId: stripeTask.id,
        sprintId: ec_sprint3.id,
        assigneeId: dave.id,
        createdById: alice.id,
      },
      {
        title: "Implement payment intent creation and confirmation UI",
        status: "TODO",
        priority: "HIGH",
        storyPoints: 5,
        estimate: 5,
        parentId: stripeTask.id,
        sprintId: ec_sprint3.id,
        assigneeId: carol.id,
        createdById: alice.id,
      },
      {
        title: "Set up Stripe webhook handler with idempotency key",
        status: "TODO",
        priority: "CRITICAL",
        storyPoints: 5,
        estimate: 4,
        parentId: stripeTask.id,
        sprintId: ec_sprint3.id,
        assigneeId: dave.id,
        createdById: alice.id,
      },
    ],
  });

  console.log("  ✓ Subtasks seeded");

  // ─── Time Logs ───────────────────────────────────────────────────────────
  const doneTasks = tasks.filter((t) => t.status === "DONE");

  for (const task of doneTasks) {
    if (!task.assigneeId || !task.dueDate) continue;
    await prisma.timeLog.createMany({
      data: [
        {
          hours: 3.5,
          description: "Initial research and planning",
          date: new Date(task.dueDate.getTime() - 2 * 86400000),
          taskId: task.id,
          userId: task.assigneeId,
        },
        {
          hours: task.estimate ?? 4,
          description: "Core implementation",
          date: new Date(task.dueDate.getTime() - 86400000),
          taskId: task.id,
          userId: task.assigneeId,
        },
        {
          hours: 1.5,
          description: "Review feedback and final polish",
          date: task.dueDate,
          taskId: task.id,
          userId: task.assigneeId,
        },
      ],
    });
  }

  console.log("  ✓ Time logs seeded");

  // ─── Activity Logs ────────────────────────────────────────────────────────
  // "created" entry for every task, plus status transitions for non-TODO tasks
  const statusHistory: Record<string, string[]> = {
    DONE:        ["TODO", "IN_PROGRESS", "IN_REVIEW", "DONE"],
    IN_REVIEW:   ["TODO", "IN_PROGRESS", "IN_REVIEW"],
    IN_PROGRESS: ["TODO", "IN_PROGRESS"],
    TODO:        [],
  };

  for (const task of tasks) {
    const actor = task.assigneeId ?? task.createdById;
    const base  = task.dueDate ?? new Date("2024-01-22");

    await prisma.activityLog.create({
      data: {
        taskId: task.id,
        userId: task.createdById,
        action: "created",
        detail: task.title,
        createdAt: new Date(base.getTime() - 7 * 86400000),
      },
    });

    const transitions = statusHistory[task.status] ?? [];
    for (let i = 1; i < transitions.length; i++) {
      await prisma.activityLog.create({
        data: {
          taskId: task.id,
          userId: actor,
          action: "status_changed",
          detail: `${transitions[i - 1]} → ${transitions[i]}`,
          createdAt: new Date(base.getTime() - (transitions.length - i) * 2 * 86400000),
        },
      });
    }
  }

  console.log("  ✓ Activity logs seeded");

  // ─── Comments ────────────────────────────────────────────────────────────
  // JWT auth task (DONE) – code review discussion
  const jwtTask    = tasks[1]!;
  const jwtComment = await prisma.comment.create({
    data: {
      taskId: jwtTask.id,
      userId: dave.id,
      content:
        "Implemented refresh token rotation with token-family tracking to prevent replay attacks. Each refresh invalidates the old token and issues a new pair.",
      createdAt: new Date("2024-01-28T09:00:00Z"),
    },
  });
  await prisma.comment.create({
    data: {
      taskId:   jwtTask.id,
      userId:   alice.id,
      parentId: jwtComment.id,
      content:
        "Solid approach. Please also revoke the entire token family if a reuse attempt is detected — that's the industry standard for breach containment.",
      createdAt: new Date("2024-01-28T10:30:00Z"),
    },
  });
  await prisma.comment.create({
    data: {
      taskId:   jwtTask.id,
      userId:   dave.id,
      parentId: jwtComment.id,
      content:
        "Done — on detected reuse the family is fully invalidated and a security alert is logged. Pushed in the latest commit.",
      createdAt: new Date("2024-01-28T14:00:00Z"),
    },
  });

  // Product catalog task (IN_REVIEW) – review sign-off thread
  const catalogTask    = tasks[4]!;
  const catalogComment = await prisma.comment.create({
    data: {
      taskId: catalogTask.id,
      userId: carol.id,
      content:
        "Catalog is ready for review. Search uses a 300ms debounce, all filter state is URL-persisted, and I added sort-by-price after the last standup feedback.",
      createdAt: new Date("2024-02-10T08:45:00Z"),
    },
  });
  await prisma.comment.create({
    data: {
      taskId:   catalogTask.id,
      userId:   alice.id,
      parentId: catalogComment.id,
      content:
        "Tested on mobile viewport — looks great. One nit: the 'No results' empty state needs an illustration. Can you add one before I approve?",
      createdAt: new Date("2024-02-10T11:00:00Z"),
    },
  });
  await prisma.comment.create({
    data: {
      taskId:   catalogTask.id,
      userId:   carol.id,
      parentId: catalogComment.id,
      content:
        "Added the empty state illustration and a 'Clear all filters' shortcut. Ready for final approval.",
      createdAt: new Date("2024-02-10T15:20:00Z"),
    },
  });

  // Shopping cart task (IN_PROGRESS) – technical blocker
  const cartTask = tasks[5]!;
  await prisma.comment.create({
    data: {
      taskId: cartTask.id,
      userId: dave.id,
      content:
        "Running into a cache staleness issue with the stock endpoint — inventory can show available for up to 30 s after a purchase clears it. Considering a server-sent event or short-poll approach.",
      createdAt: new Date("2024-02-12T10:00:00Z"),
    },
  });
  await prisma.comment.create({
    data: {
      taskId: cartTask.id,
      userId: alice.id,
      content:
        "Use a 5-minute TTL on the inventory cache and manually invalidate on confirmed purchase. SSE adds complexity we don't need for MVP — let's revisit in sprint 3 if latency is still an issue.",
      createdAt: new Date("2024-02-12T11:30:00Z"),
    },
  });

  // Orders API task (IN_PROGRESS) – architecture discussion
  const ordersTask    = tasks[7]!;
  const ordersComment = await prisma.comment.create({
    data: {
      taskId: ordersTask.id,
      userId: dave.id,
      content:
        "The order state machine has 12 valid transitions and 6 forbidden ones. I'm using a transition table pattern instead of nested ifs — much easier to audit.",
      createdAt: new Date("2024-02-13T09:00:00Z"),
    },
  });
  await prisma.comment.create({
    data: {
      taskId:   ordersTask.id,
      userId:   alice.id,
      parentId: ordersComment.id,
      content:
        "Good call. Make sure cancelled orders remain immutable — no further transitions should be possible from CANCELLED state.",
      createdAt: new Date("2024-02-13T10:15:00Z"),
    },
  });

  // Biometric auth task (IN_PROGRESS) – progress update
  const bioTask = tasks[11]!;
  await prisma.comment.create({
    data: {
      taskId: bioTask.id,
      userId: dave.id,
      content:
        "Face ID integration is working on iOS 17. Android biometric prompt is next — testing on Pixel 7 and Samsung Galaxy. Fallback PIN flow is complete.",
      createdAt: new Date("2024-03-07T09:00:00Z"),
    },
  });
  await prisma.comment.create({
    data: {
      taskId: bioTask.id,
      userId: bob.id,
      content:
        "Great progress! Confirm the PIN-change flow also re-encrypts the AsyncStorage keys — changing the PIN shouldn't leave old data accessible.",
      createdAt: new Date("2024-03-07T11:00:00Z"),
    },
  });

  console.log("  ✓ Comments seeded");
  console.log("\n✅ Seed complete!\n");
  console.log("Default accounts:");
  console.log("  Admin │ alice.admin@mpms.dev / Admin@123456");
  console.log("  Admin │ bob.admin@mpms.dev   / Admin@123456");
  console.log("  User  │ carol@mpms.dev        / User@123456");
  console.log("  User  │ dave@mpms.dev         / User@123456");
  console.log("  User  │ eve@mpms.dev          / User@123456");
  console.log("  User  │ frank@mpms.dev        / User@123456");
  console.log("  User  │ grace@mpms.dev        / User@123456");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

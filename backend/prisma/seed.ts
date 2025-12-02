import { PrismaClient, UserRole, ProjectStatus, DocumentPhase } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

async function main() {
  console.log('🌱 Starting database seed...');

  // Clean existing data
  await prisma.notification.deleteMany();
  await prisma.refreshToken.deleteMany();
  await prisma.workflowLog.deleteMany();
  await prisma.workflow.deleteMany();
  await prisma.documentVersion.deleteMany();
  await prisma.document.deleteMany();
  await prisma.milestone.deleteMany();
  await prisma.user.deleteMany();
  await prisma.project.deleteMany();

  console.log('🧹 Cleaned existing data');

  // Create Demo Project
  const project = await prisma.project.create({
    data: {
      name: 'Demo KI-Automatisierung',
      description: 'Ein Beispielprojekt für das Client Portal - Lead Generation & Email Automation',
      status: ProjectStatus.ACTIVE,
      healthScore: 87,
    },
  });
  console.log(`📁 Created project: ${project.name}`);

  // Create Users
  const adminPassword = await hashPassword('Admin123!');
  const admin = await prisma.user.create({
    data: {
      email: 'admin@ki-agentur.com',
      passwordHash: adminPassword,
      firstName: 'Admin',
      lastName: 'User',
      role: UserRole.ADMIN,
      projectId: project.id,
    },
  });

  const cto = await prisma.user.create({
    data: {
      email: 'cto@demo-kunde.de',
      passwordHash: await hashPassword('Cto123!'),
      firstName: 'Max',
      lastName: 'Mustermann',
      role: UserRole.CTO,
      projectId: project.id,
    },
  });

  const ceo = await prisma.user.create({
    data: {
      email: 'ceo@demo-kunde.de',
      passwordHash: await hashPassword('Ceo123!'),
      firstName: 'Erika',
      lastName: 'Musterfrau',
      role: UserRole.CEO,
      projectId: project.id,
    },
  });

  const pm = await prisma.user.create({
    data: {
      email: 'pm@demo-kunde.de',
      passwordHash: await hashPassword('Pm1234!'),
      firstName: 'Thomas',
      lastName: 'Schmidt',
      role: UserRole.PM,
      projectId: project.id,
    },
  });

  console.log(`👥 Created ${4} users`);

  // Create Workflows
  const leadGenWorkflow = await prisma.workflow.create({
    data: {
      name: 'Lead Generation Pipeline',
      n8nId: 'wf_lead_gen_001',
      description: 'Automatische Lead-Erfassung von Website, LinkedIn und Email',
      successRate: 98.5,
      avgExecTime: 1250,
      projectId: project.id,
      isActive: true,
      lastRunAt: new Date(Date.now() - 1000 * 60 * 30), // 30 min ago
    },
  });

  const emailWorkflow = await prisma.workflow.create({
    data: {
      name: 'Email Automation Sequence',
      n8nId: 'wf_email_auto_002',
      description: 'Automatische Email-Sequenzen für Onboarding und Follow-ups',
      successRate: 99.2,
      avgExecTime: 890,
      projectId: project.id,
      isActive: true,
      lastRunAt: new Date(Date.now() - 1000 * 60 * 15), // 15 min ago
    },
  });

  const reportWorkflow = await prisma.workflow.create({
    data: {
      name: 'Weekly Report Generator',
      n8nId: 'wf_report_003',
      description: 'Wöchentliche KPI-Reports und Zusammenfassungen',
      successRate: 100,
      avgExecTime: 3500,
      projectId: project.id,
      isActive: true,
      lastRunAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2), // 2 days ago
    },
  });

  console.log(`⚙️ Created ${3} workflows`);

  // Create Workflow Logs
  const statuses = ['SUCCESS', 'SUCCESS', 'SUCCESS', 'SUCCESS', 'FAILED'] as const;
  for (let i = 0; i < 20; i++) {
    const workflow = i % 3 === 0 ? leadGenWorkflow : i % 3 === 1 ? emailWorkflow : reportWorkflow;
    const status = statuses[Math.floor(Math.random() * statuses.length)];

    await prisma.workflowLog.create({
      data: {
        workflowId: workflow.id,
        status: status,
        executionTime: Math.floor(Math.random() * 2000) + 500,
        errorMessage: status === 'FAILED' ? 'Connection timeout to external API' : null,
        createdAt: new Date(Date.now() - Math.random() * 1000 * 60 * 60 * 24 * 7), // Random within last 7 days
      },
    });
  }
  console.log(`📊 Created 20 workflow logs`);

  // Create Documents
  const documents = await Promise.all([
    prisma.document.create({
      data: {
        name: 'Projektplan Q1 2025.pdf',
        description: 'Detaillierter Projektplan für das erste Quartal',
        phase: DocumentPhase.PLANNING,
        filePath: '/documents/projektplan-q1-2025.pdf',
        fileSize: 2456789,
        mimeType: 'application/pdf',
        projectId: project.id,
        uploadedById: pm.id,
        version: 2,
      },
    }),
    prisma.document.create({
      data: {
        name: 'Technische Spezifikation.docx',
        description: 'Technische Anforderungen und Architektur',
        phase: DocumentPhase.DEVELOPMENT,
        filePath: '/documents/tech-spec.docx',
        fileSize: 1234567,
        mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        projectId: project.id,
        uploadedById: cto.id,
        version: 1,
      },
    }),
    prisma.document.create({
      data: {
        name: 'Workflow Dokumentation.md',
        description: 'Dokumentation aller n8n Workflows',
        phase: DocumentPhase.MAINTENANCE,
        filePath: '/documents/workflow-docs.md',
        fileSize: 567890,
        mimeType: 'text/markdown',
        projectId: project.id,
        uploadedById: admin.id,
        version: 3,
      },
    }),
  ]);
  console.log(`📄 Created ${documents.length} documents`);

  // Create Document Versions
  await prisma.documentVersion.createMany({
    data: [
      {
        documentId: documents[0].id,
        version: 1,
        filePath: '/documents/archive/projektplan-q1-2025-v1.pdf',
        fileSize: 2234567,
        changeNote: 'Initial version',
      },
      {
        documentId: documents[2].id,
        version: 1,
        filePath: '/documents/archive/workflow-docs-v1.md',
        fileSize: 234567,
        changeNote: 'Initial documentation',
      },
      {
        documentId: documents[2].id,
        version: 2,
        filePath: '/documents/archive/workflow-docs-v2.md',
        fileSize: 456789,
        changeNote: 'Added email automation section',
      },
    ],
  });
  console.log(`📚 Created document versions`);

  // Create Milestones
  await prisma.milestone.createMany({
    data: [
      {
        title: 'Phase 1: Discovery Complete',
        description: 'Anforderungsanalyse und Planung abgeschlossen',
        dueDate: new Date('2024-11-15'),
        completedAt: new Date('2024-11-14'),
        projectId: project.id,
      },
      {
        title: 'Phase 2: Workflow Integration',
        description: 'Alle n8n Workflows implementiert und getestet',
        dueDate: new Date('2024-12-15'),
        completedAt: null,
        projectId: project.id,
      },
      {
        title: 'Phase 3: Go Live',
        description: 'Production Launch mit Monitoring',
        dueDate: new Date('2025-01-15'),
        completedAt: null,
        projectId: project.id,
      },
    ],
  });
  console.log(`🎯 Created 3 milestones`);

  // Create Notifications
  await prisma.notification.createMany({
    data: [
      {
        userId: cto.id,
        type: 'WORKFLOW_SUCCESS',
        title: 'Lead Generation erfolgreich',
        body: 'Der Lead Generation Workflow wurde erfolgreich ausgeführt. 12 neue Leads erfasst.',
        data: { workflowId: leadGenWorkflow.id, leadsCount: 12 },
        createdAt: new Date(Date.now() - 1000 * 60 * 30),
      },
      {
        userId: ceo.id,
        type: 'MILESTONE_DUE',
        title: 'Milestone fällig in 2 Wochen',
        body: 'Phase 2: Workflow Integration ist am 15. Dezember fällig.',
        data: { dueDate: '2024-12-15' },
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2),
      },
      {
        userId: pm.id,
        type: 'DOCUMENT_UPLOADED',
        title: 'Neues Dokument hochgeladen',
        body: 'Max Mustermann hat "Technische Spezifikation.docx" hochgeladen.',
        data: { documentId: documents[1].id },
        readAt: new Date(Date.now() - 1000 * 60 * 60),
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 3),
      },
      {
        userId: cto.id,
        type: 'WORKFLOW_FAILED',
        title: 'Workflow fehlgeschlagen',
        body: 'Email Automation Sequence ist fehlgeschlagen: Connection timeout',
        data: { workflowId: emailWorkflow.id, error: 'Connection timeout' },
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5),
      },
    ],
  });
  console.log(`🔔 Created 4 notifications`);

  console.log('\n✅ Database seed completed successfully!');
  console.log('\n📋 Summary:');
  console.log(`   - 1 Project: "${project.name}"`);
  console.log(`   - 4 Users (admin, cto, ceo, pm)`);
  console.log(`   - 3 Workflows`);
  console.log(`   - 20 Workflow Logs`);
  console.log(`   - 3 Documents with versions`);
  console.log(`   - 3 Milestones`);
  console.log(`   - 4 Notifications`);
  console.log('\n🔐 Login Credentials:');
  console.log('   admin@ki-agentur.com / Admin123!');
  console.log('   cto@demo-kunde.de / Cto123!');
  console.log('   ceo@demo-kunde.de / Ceo123!');
  console.log('   pm@demo-kunde.de / Pm1234!');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

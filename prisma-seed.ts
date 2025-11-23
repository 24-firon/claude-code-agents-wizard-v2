// Prisma Seed Script for KI Agentur Client Portal
// File location: backend/prisma/seed.ts
// Run: npx prisma db seed

import { PrismaClient, UserRole, ProjectStatus, DocumentPhase, NotificationType } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Clear existing data (for development only!)
  await prisma.notification.deleteMany({});
  await prisma.notificationPreference.deleteMany({});
  await prisma.documentPermission.deleteMany({});
  await prisma.document.deleteMany({});
  await prisma.workflowLog.deleteMany({});
  await prisma.apiKey.deleteMany({});
  await prisma.session.deleteMany({});
  await prisma.auditLog.deleteMany({});
  await prisma.user.deleteMany({});
  await prisma.project.deleteMany({});

  // ============================================================================
  // 1. CREATE ADMIN USER
  // ============================================================================
  const adminPassword = 'dev-admin-123'; // Development only!
  const adminUser = await prisma.user.create({
    data: {
      email: 'admin@example.com',
      passwordHash: await bcrypt.hash(adminPassword, 12),
      firstName: 'Admin',
      lastName: 'User',
      role: UserRole.ADMIN,
      lastLogin: new Date(),
    },
  });
  console.log('✅ Admin user created:', adminUser.email);

  // ============================================================================
  // 2. CREATE SAMPLE PROJECTS WITH USERS
  // ============================================================================

  // Project 1: CTO-focused (e-commerce)
  const project1 = await prisma.project.create({
    data: {
      name: 'E-Commerce Platform Integration',
      description: 'Integrate Salesforce CRM with warehouse management system using n8n',
      ownerId: adminUser.id,
      healthScore: 85,
      status: ProjectStatus.ON_TRACK,
    },
  });

  const ctoUser = await prisma.user.create({
    data: {
      email: 'cto@example.com',
      passwordHash: await bcrypt.hash('dev-cto-123', 12),
      firstName: 'Sarah',
      lastName: 'Chen',
      role: UserRole.CTO,
      projectId: project1.id,
      lastLogin: new Date(),
    },
  });

  // Project 2: CEO-focused (operations)
  const project2 = await prisma.project.create({
    data: {
      name: 'Supply Chain Optimization',
      description: 'Automate supplier management and order processing',
      ownerId: adminUser.id,
      healthScore: 72,
      status: ProjectStatus.AT_RISK,
    },
  });

  const ceoUser = await prisma.user.create({
    data: {
      email: 'ceo@example.com',
      passwordHash: await bcrypt.hash('dev-ceo-123', 12),
      firstName: 'Michael',
      lastName: 'Mueller',
      role: UserRole.CEO,
      projectId: project2.id,
      lastLogin: new Date(),
    },
  });

  // Project 3: PM-focused (documents)
  const project3 = await prisma.project.create({
    data: {
      name: 'Customer Data Migration',
      description: 'Migrate 50k customer records from legacy system to modern CRM',
      ownerId: adminUser.id,
      healthScore: 64,
      status: ProjectStatus.BLOCKED,
    },
  });

  const pmUser = await prisma.user.create({
    data: {
      email: 'pm@example.com',
      passwordHash: await bcrypt.hash('dev-pm-123', 12),
      firstName: 'Jessica',
      lastName: 'Schmidt',
      role: UserRole.PM,
      projectId: project3.id,
      lastLogin: new Date(),
    },
  });

  console.log('✅ Created 3 projects with CEO/CTO/PM users');

  // ============================================================================
  // 3. CREATE SAMPLE DOCUMENTS
  // ============================================================================

  const doc1 = await prisma.document.create({
    data: {
      projectId: project1.id,
      name: 'Requirements_v2.3.pdf',
      phase: DocumentPhase.REQUIREMENTS,
      filePath: 's3://ki-agentur-documents/project1/requirements_v2.3.pdf',
      fileSize: 2048000,
      mimeType: 'application/pdf',
      version: 3,
      uploaderId: pmUser.id,
      searchVector: 'requirement salesforce crm integration workflow',
    },
  });

  const doc2 = await prisma.document.create({
    data: {
      projectId: project1.id,
      name: 'System_Architecture.pdf',
      phase: DocumentPhase.DESIGN,
      filePath: 's3://ki-agentur-documents/project1/architecture.pdf',
      fileSize: 5242880,
      mimeType: 'application/pdf',
      version: 1,
      uploaderId: ctoUser.id,
      searchVector: 'architecture design microservices api n8n workflow',
    },
  });

  const doc3 = await prisma.document.create({
    data: {
      projectId: project1.id,
      name: 'Development_Guide.md',
      phase: DocumentPhase.DEVELOPMENT,
      filePath: 's3://ki-agentur-documents/project1/dev_guide.md',
      fileSize: 512000,
      mimeType: 'text/markdown',
      version: 5,
      uploaderId: ctoUser.id,
      searchVector: 'development guide setup environment nodejs typescript',
    },
  });

  const doc4 = await prisma.document.create({
    data: {
      projectId: project2.id,
      name: 'Test_Plan.docx',
      phase: DocumentPhase.TESTING,
      filePath: 's3://ki-agentur-documents/project2/test_plan.docx',
      fileSize: 1024000,
      mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      version: 2,
      uploaderId: pmUser.id,
      searchVector: 'test plan testing strategy scenarios coverage',
    },
  });

  const doc5 = await prisma.document.create({
    data: {
      projectId: project3.id,
      name: 'Data_Migration_Mapping.xlsx',
      phase: DocumentPhase.DESIGN,
      filePath: 's3://ki-agentur-documents/project3/migration_mapping.xlsx',
      fileSize: 2097152,
      mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      version: 4,
      uploaderId: pmUser.id,
      searchVector: 'data mapping migration customer records fields',
    },
  });

  console.log('✅ Created 5 sample documents');

  // ============================================================================
  // 4. CREATE DOCUMENT PERMISSIONS
  // ============================================================================

  // Doc1: All roles can read
  await prisma.documentPermission.createMany({
    data: [
      { documentId: doc1.id, role: UserRole.CEO, permissionLevel: 'READ_ONLY' },
      { documentId: doc1.id, role: UserRole.CTO, permissionLevel: 'DOWNLOAD' },
      { documentId: doc1.id, role: UserRole.PM, permissionLevel: 'EDIT' },
      { documentId: doc1.id, role: UserRole.ADMIN, permissionLevel: 'EDIT' },
    ],
  });

  // Doc2: CTO and Admin only
  await prisma.documentPermission.createMany({
    data: [
      { documentId: doc2.id, role: UserRole.CTO, permissionLevel: 'EDIT' },
      { documentId: doc2.id, role: UserRole.ADMIN, permissionLevel: 'EDIT' },
    ],
  });

  console.log('✅ Created document permissions');

  // ============================================================================
  // 5. CREATE n8n WORKFLOW LOGS (Sample Executions)
  // ============================================================================

  const now = new Date();

  // Recent successful execution
  await prisma.workflowLog.create({
    data: {
      projectId: project1.id,
      n8nWorkflowId: 'wf_salesforce_crm_sync',
      n8nWorkflowName: 'Salesforce CRM Sync',
      executionId: 'exec_20251122_143200_001',
      status: 'SUCCESS',
      executionTimeMs: 2340,
      errorMessage: null,
      executionDetails: {
        recordsProcessed: 1250,
        recordsCreated: 1200,
        recordsUpdated: 50,
        recordsFailed: 0,
        successRate: 100,
      },
      inputData: {
        source: 'salesforce',
        batchSize: 1250,
        dateRange: '2025-11-21 to 2025-11-22',
      },
      outputData: {
        recordsWritten: 1250,
        databaseUpdatedAt: '2025-11-22T14:34:00Z',
      },
      createdAt: new Date(now.getTime() - 2 * 60 * 60 * 1000), // 2 hours ago
    },
  });

  // Recent failed execution
  await prisma.workflowLog.create({
    data: {
      projectId: project2.id,
      n8nWorkflowId: 'wf_supplier_orders',
      n8nWorkflowName: 'Supplier Order Processing',
      executionId: 'exec_20251122_100500_002',
      status: 'FAILED',
      executionTimeMs: 5670,
      errorMessage: 'API timeout: Supplier API did not respond within 5s timeout. Retry scheduled.',
      executionDetails: {
        failureStep: 'Call Supplier API',
        retryCount: 2,
        nextRetryAt: '2025-11-22T11:05:00Z',
      },
      inputData: {
        ordersToProcess: 523,
        suppliers: ['supplier_a', 'supplier_b', 'supplier_c'],
      },
      outputData: null,
      createdAt: new Date(now.getTime() - 4 * 60 * 60 * 1000), // 4 hours ago
    },
  });

  // Earlier successful execution
  await prisma.workflowLog.create({
    data: {
      projectId: project1.id,
      n8nWorkflowId: 'wf_warehouse_sync',
      n8nWorkflowName: 'Warehouse Inventory Sync',
      executionId: 'exec_20251121_220000_003',
      status: 'SUCCESS',
      executionTimeMs: 3450,
      errorMessage: null,
      executionDetails: {
        itemsProcessed: 8934,
        itemsMatched: 8920,
        discrepancies: 14,
        successRate: 99.8,
      },
      inputData: {
        source: 'warehouse_system',
        scope: 'all_locations',
      },
      outputData: {
        syncedItems: 8920,
        reportGenerated: true,
        discrepancyReport: 'Available in admin dashboard',
      },
      createdAt: new Date(now.getTime() - 26 * 60 * 60 * 1000), // 26 hours ago
    },
  });

  // Day-old workflow (for health score calculations)
  for (let i = 0; i < 10; i++) {
    await prisma.workflowLog.create({
      data: {
        projectId: project1.id,
        n8nWorkflowId: `wf_scheduled_${i}`,
        n8nWorkflowName: `Scheduled Task ${i}`,
        executionId: `exec_scheduled_${i}_${new Date().getTime()}`,
        status: i % 3 === 0 ? 'FAILED' : 'SUCCESS',
        executionTimeMs: Math.floor(Math.random() * 3000) + 500,
        errorMessage: i % 3 === 0 ? 'Random failure for demo' : null,
        executionDetails: { demo: true },
        createdAt: new Date(now.getTime() - (24 + i) * 60 * 60 * 1000), // 24-34 hours ago
      },
    });
  }

  console.log('✅ Created workflow execution logs');

  // ============================================================================
  // 6. CREATE NOTIFICATIONS
  // ============================================================================

  await prisma.notification.createMany({
    data: [
      {
        userId: ctoUser.id,
        type: NotificationType.WORKFLOW_COMPLETED,
        title: 'Salesforce Sync Completed',
        body: 'Successfully synced 1,250 customer records from Salesforce CRM',
        data: {
          workflowId: 'wf_salesforce_crm_sync',
          executionId: 'exec_20251122_143200_001',
          recordsProcessed: 1250,
        },
        createdAt: new Date(now.getTime() - 2 * 60 * 60 * 1000),
      },
      {
        userId: ctoUser.id,
        type: NotificationType.WORKFLOW_FAILED,
        title: 'Supplier Order Processing Failed',
        body: 'Workflow failed with API timeout. Retrying automatically.',
        data: {
          workflowId: 'wf_supplier_orders',
          executionId: 'exec_20251122_100500_002',
          error: 'API timeout',
        },
        createdAt: new Date(now.getTime() - 4 * 60 * 60 * 1000),
        readAt: new Date(now.getTime() - 3.5 * 60 * 60 * 1000),
      },
      {
        userId: ceoUser.id,
        type: NotificationType.MILESTONE_COMPLETED,
        title: 'Milestone: Requirements Complete',
        body: 'The Requirements phase is now 100% complete',
        data: {
          projectId: project2.id,
          phase: 'REQUIREMENTS',
        },
        createdAt: new Date(now.getTime() - 24 * 60 * 60 * 1000),
        readAt: new Date(now.getTime() - 23.5 * 60 * 60 * 1000),
      },
      {
        userId: pmUser.id,
        type: NotificationType.DOCUMENT_UPLOADED,
        title: 'New Document: Development Guide',
        body: 'CTO Sarah Chen uploaded Development_Guide.md',
        data: {
          documentId: doc3.id,
          uploader: 'Sarah Chen',
        },
        createdAt: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000),
      },
    ],
  });

  console.log('✅ Created sample notifications');

  // ============================================================================
  // 7. CREATE NOTIFICATION PREFERENCES
  // ============================================================================

  await prisma.notificationPreference.createMany({
    data: [
      {
        userId: ctoUser.id,
        workflowCompleted: true,
        workflowFailed: true,
        documentUploaded: true,
        emailEnabled: true,
        inAppEnabled: true,
        emailFrequency: 'IMMEDIATE',
      },
      {
        userId: ceoUser.id,
        workflowCompleted: false,
        workflowFailed: true,
        milestoneCompleted: true,
        weeklySummary: true,
        emailEnabled: true,
        inAppEnabled: true,
        emailFrequency: 'WEEKLY',
      },
      {
        userId: pmUser.id,
        documentUploaded: true,
        milestoneCompleted: true,
        emailEnabled: true,
        inAppEnabled: true,
        emailFrequency: 'DAILY',
      },
    ],
  });

  console.log('✅ Created notification preferences');

  // ============================================================================
  // 8. CREATE API KEYS
  // ============================================================================

  // Hash the API keys (in real code, these would be randomly generated)
  const crypto = require('crypto');

  const apiKeySecret = 'dev-secret-key-123';
  const key1Hash = crypto
    .createHmac('sha256', apiKeySecret)
    .update('sk_test_salesforce_integration_key')
    .digest('hex');

  const key2Hash = crypto
    .createHmac('sha256', apiKeySecret)
    .update('sk_test_warehouse_sync_key')
    .digest('hex');

  await prisma.apiKey.createMany({
    data: [
      {
        projectId: project1.id,
        userId: ctoUser.id,
        name: 'Salesforce Integration Key (Test)',
        keyHash: key1Hash,
        lastUsedAt: new Date(now.getTime() - 1 * 60 * 60 * 1000),
      },
      {
        projectId: project1.id,
        userId: ctoUser.id,
        name: 'Warehouse Sync Key (Prod)',
        keyHash: key2Hash,
        lastUsedAt: new Date(now.getTime() - 5 * 60 * 1000),
      },
    ],
  });

  console.log('✅ Created API keys');

  // ============================================================================
  // 9. CREATE AUDIT LOGS
  // ============================================================================

  await prisma.auditLog.createMany({
    data: [
      {
        userId: pmUser.id,
        resourceType: 'Document',
        resourceId: doc1.id,
        action: 'CREATE',
        changes: {
          name: 'Requirements_v2.3.pdf',
          phase: 'REQUIREMENTS',
        },
        ipAddress: '192.168.1.1',
        createdAt: new Date(now.getTime() - 48 * 60 * 60 * 1000),
      },
      {
        userId: ctoUser.id,
        resourceType: 'Document',
        resourceId: doc1.id,
        action: 'DOWNLOAD',
        changes: null,
        ipAddress: '192.168.1.2',
        createdAt: new Date(now.getTime() - 24 * 60 * 60 * 1000),
      },
      {
        userId: adminUser.id,
        resourceType: 'User',
        resourceId: pmUser.id,
        action: 'UPDATE',
        changes: {
          before: { role: 'USER' },
          after: { role: 'PM' },
        },
        ipAddress: '192.168.1.100',
        createdAt: new Date(now.getTime() - 72 * 60 * 60 * 1000),
      },
      {
        userId: ctoUser.id,
        resourceType: 'ApiKey',
        resourceId: key1Hash,
        action: 'REVOKE_API_KEY',
        changes: { revoked_at: new Date() },
        ipAddress: '192.168.1.2',
        createdAt: new Date(now.getTime() - 12 * 60 * 60 * 1000),
      },
    ],
  });

  console.log('✅ Created audit logs');

  // ============================================================================
  // SUMMARY
  // ============================================================================

  console.log('\n✅ Database seeded successfully!\n');
  console.log('📊 Summary:');
  console.log('  • 1 Admin user');
  console.log('  • 3 Projects (CTO, CEO, PM focused)');
  console.log('  • 3 Project users (CEO, CTO, PM roles)');
  console.log('  • 5 Sample documents with versioning');
  console.log('  • 15+ Workflow execution logs');
  console.log('  • 5 Notifications');
  console.log('  • 3 Notification preferences');
  console.log('  • 2 API keys');
  console.log('  • 4 Audit log entries');

  console.log('\n🔑 Test Credentials (Development Only!):');
  console.log('  Admin:  admin@example.com / dev-admin-123');
  console.log('  CTO:    cto@example.com    / dev-cto-123');
  console.log('  CEO:    ceo@example.com    / dev-ceo-123');
  console.log('  PM:     pm@example.com     / dev-pm-123');

  console.log('\n🎉 Ready for testing! Open Prisma Studio:');
  console.log('    npx prisma studio\n');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

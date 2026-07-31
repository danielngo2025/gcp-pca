// 9 study weeks at ~15 h/week, Mon 3 Aug – Sun 4 Oct 2026. Exam Fri 9 Oct.
// `topics` are blueprint ids so the Plan and Blueprint views stay in sync.
window.PLAN = {
  start: '2026-08-03',
  examDate: '2026-10-09',
  finalReview: { from: '2026-10-05', to: '2026-10-08' },
  retakeWindow: '2026-10-23',
  hoursPerWeek: 15,
  weeks: [
    {
      n: 1, from: '2026-08-03', to: '2026-08-09',
      theme: 'Orientation + Well-Architected Framework',
      topics: ['1.5', '6.1'],
      why: 'Calibrate before you study. The diagnostic mock tells weeks 2–9 where to spend the hours.',
      tasks: [
        'Book the exam for Fri 9 Oct 2026 (cp.certmetrics.com) — do this first, it is the forcing function',
        'Read all six Well-Architected Framework pillars end to end',
        'Read all four case studies once, no note-taking — just absorb the shape',
        'Read Google\'s Enterprise Foundation Blueprint — the reference mental model for org structure',
        'Take the baseline diagnostic mock — expect 45–55%, that is the point',
        'Record your baseline score on the Dashboard and set confidence ratings for all 22 sub-sections'
      ]
    },
    {
      n: 2, from: '2026-08-10', to: '2026-08-16',
      theme: 'Business + technical requirements (§1.1, §1.2)',
      topics: ['1.1', '1.2'],
      why: '§1.1 is the heaviest sub-section on the exam and the one candidates most often dismiss as soft. Do not.',
      tasks: [
        'Drill requirement decomposition: for each case study, split requirements into functional / non-functional / business / compliance',
        'Learn the vocabulary cold: KPI, ROI, TCO, SLA vs SLO vs SLI, RTO vs RPO',
        'Workload disposition: build / buy / modify / deprecate — when each is the right call',
        'Business continuity planning vs disaster recovery — know the distinction',
        'Cost optimization fundamentals: committed use vs sustained use vs spot, rightsizing, budget alerts',
        'HA and failover design: zonal vs regional vs multi-regional, and what each costs',
        'Read up on Gemini Cloud Assist (named in both §1.2 and §5.1)',
        'Checkpoint quiz: §1.1 + §1.2'
      ]
    },
    {
      n: 3, from: '2026-08-17', to: '2026-08-23',
      theme: 'Compute (§1.3 mapping, §2.3)',
      topics: ['1.3', '2.3'],
      why: 'Your strongest ground for GKE — but the serverless half is where exam questions actually live.',
      tasks: [
        'Build the compute decision table: GKE vs Cloud Run vs Cloud Run functions vs App Engine vs GCE vs Batch',
        'Read a real GKE cluster definition line by line — every flag is an exam-relevant decision',
        'GKE modes and features: Autopilot vs Standard, node pools, NAP, HPA/VPA, VPC-native',
        'Cloud Run depth: concurrency, min/max instances, cold starts, jobs vs services, serverless VPC access',
        'Spot VMs, custom machine types, sole-tenant nodes, GPU/TPU attachment, machine families',
        'Google Cloud VMware Engine — what it is for and when it beats a rewrite',
        'Patch management and infrastructure orchestration (OS Config, managed instance groups)',
        'Checkpoint quiz: compute selection scenarios'
      ]
    },
    {
      n: 4, from: '2026-08-24', to: '2026-08-30',
      theme: 'Storage & data (§1.3 storage, §2.2)',
      topics: ['1.3', '2.2'],
      why: 'The database decision tree is the most reliably tested thing on this exam.',
      tasks: [
        'Build the database decision table: Cloud SQL vs AlloyDB vs Spanner vs Bigtable vs Firestore vs BigQuery vs Memorystore',
        'Memorize the discriminators: relational vs not, global vs regional, strong vs eventual consistency, OLTP vs OLAP, scale ceiling',
        'GCS storage classes (Standard/Nearline/Coldline/Archive), lifecycle policies, retention locks, versioning',
        'Filestore tiers and when a network filesystem is the right answer',
        'Data processing: Dataflow vs Dataproc vs Composer vs Datastream vs Pub/Sub vs BigQuery scheduled queries',
        'Data transfer: Storage Transfer Service, Transfer Appliance, BigQuery Data Transfer',
        'Backup and recovery per store — build this table from the docs, it rarely comes from practice',
        'Checkpoint quiz: storage + data selection scenarios'
      ]
    },
    {
      n: 5, from: '2026-08-31', to: '2026-09-06',
      theme: 'Networking incl. hybrid (§2.1, §1.3 networking)',
      topics: ['2.1', '1.3'],
      why: 'Single-cloud VPC design usually transfers from practice. Hybrid connectivity and the load balancer taxonomy do not.',
      tasks: [
        'Re-fetch the exam guide PDF and diff it against data/blueprint.js — catch any revision',
        'Build the load balancer decision table: all 7 types, global vs regional, external vs internal, L4 vs L7',
        'Hybrid connectivity table: Dedicated Interconnect vs Partner Interconnect vs HA VPN vs Direct/Carrier Peering — bandwidth, SLA, cost',
        'Shared VPC vs VPC peering vs Network Connectivity Center — when each applies',
        'Private Service Connect and Private Google Access — the exam loves these',
        'Cloud CDN, Cloud DNS routing policies, Cloud NAT, Cloud Armor',
        'Firewall rules vs hierarchical firewall policies; network tags vs service accounts as targets',
        'Checkpoint quiz: networking scenarios'
      ]
    },
    {
      n: 6, from: '2026-09-07', to: '2026-09-13',
      theme: 'AI & agent platform (§2.4, §2.5) — the big gap',
      topics: ['2.4', '2.5'],
      priority: true,
      why: 'New in the Oct 2025 rewrite, and most prep material has not caught up. Highest-risk week — protect it.',
      tasks: [
        'Gemini Enterprise Agent Platform: what it is, what it replaces, how it is structured',
        'Agent Platform Pipelines for the ML lifecycle — orchestration, components, artifacts',
        'AI Hypercomputer: GPUs vs TPUs, when each wins, consumption models (on-demand, reservations, spot, DWS)',
        'Model Garden and Agent Builder — how a model gets from catalogue into a solution',
        'Build the prebuilt-API decision table: Search, Conversation, Vision, Image, Video, Audio',
        'Gemini Enterprise features: AI Agents, NotebookLM Enterprise',
        'Securing AI: Model Armor, Sensitive Data Protection, secure model deployment (also §3.1)',
        'Hands-on: build one small agent end to end — grounding, tool call, deploy. Non-negotiable, reading alone will not stick',
        'Re-read all four case studies through a GenAI lens — every one of them has an AI angle now',
        'Checkpoint quiz: §2.4 + §2.5'
      ]
    },
    {
      n: 7, from: '2026-09-14', to: '2026-09-20',
      theme: 'Security & compliance (§3.1, §3.2)',
      topics: ['3.1', '3.2'],
      why: '17.5% of the exam, and IAM fundamentals usually transfer from practice. Highest return per hour after week 6.',
      tasks: [
        'Build one IAM mental model end to end: hierarchy → policy inheritance → member → role → condition',
        'Predefined vs basic vs custom roles; least privilege; separation of duties; service account impersonation',
        'Workload Identity vs Workload Identity Federation — know the difference cold',
        'Organization policy constraints and hierarchical firewall policies',
        'VPC Service Controls: perimeters, bridges, ingress/egress rules, dry-run mode',
        'Identity-Aware Proxy, context-aware access, Chrome Enterprise Premium (BeyondCorp model)',
        'Encryption: default vs CMEK vs CSEK, Cloud KMS key hierarchy, envelope encryption, Cloud HSM',
        'Software supply chain: Binary Authorization, Artifact Analysis, attestations, SLSA levels',
        'Compliance regimes: HIPAA (→ EHR Healthcare), PCI-DSS, GDPR, COPPA, SOC 2; data residency and Assured Workloads',
        'Checkpoint quiz: §3.1 + §3.2'
      ]
    },
    {
      n: 8, from: '2026-09-21', to: '2026-09-27',
      theme: 'Migration, DR, process & implementation (§1.4, §4.1, §4.2, §5)',
      topics: ['1.4', '4.1', '4.2', '5.1', '5.2'],
      why: 'Migration and DR are cold starts. §4.2 and §5.2 are cheap points that reward a single focused pass.',
      tasks: [
        'Re-fetch the exam guide PDF and diff it again',
        'The 5 Rs: rehost, replatform, refactor, repurchase, retire — plus retain. Map each to a GCP tool',
        'Migration Center: assessment, discovery, TCO modelling, dependency mapping',
        'Migration mechanics: Migrate to Virtual Machines, Database Migration Service, Storage Transfer, Transfer Appliance',
        'License implications: BYOL vs pay-as-you-go, sole-tenant nodes for licence compliance',
        'DR patterns and their RTO/RPO: backup-and-restore, cold, warm standby, hot/multi-site active-active',
        'DR testing and failback; the difference between a DR plan and a BCP',
        '§4.2 business: stakeholder management, change management, skills readiness, CapEx vs OpEx',
        '§5.1: Apigee and API management best practices, load/unit/integration test frameworks',
        '§5.2: Cloud Shell Editor / Cloud Code, gcloud+gsutil+bq, Cloud Emulators, IaC — skim and bank it',
        'Checkpoint quiz: §1.4 + §4 + §5'
      ]
    },
    {
      n: 9, from: '2026-09-28', to: '2026-10-04',
      theme: 'Ops excellence, case study intensive, full mocks (§6)',
      topics: ['6.1', '6.2', '6.3', '6.4', '6.5', '6.6'],
      why: 'Finish the syllabus, then convert knowledge into exam performance. Mocks are diagnostic, not practice.',
      tasks: [
        'Read the operational excellence pillar end to end (§6.1 is literally "know this pillar")',
        'Observability: Cloud Monitoring, Logging, Trace, Profiler; log-based metrics and sinks',
        'SLI vs SLO vs SLA, error budgets, alerting strategy (symptom-based over cause-based)',
        'Deployment strategies by name: blue/green, canary, rolling, recreate — and when each fits',
        'Support models, incident response, escalation, postmortems; quality control gates',
        'Reliability testing: chaos engineering, penetration testing, load testing — what each proves',
        'Case study intensive: write a full architecture from scratch for each of the four, then compare to the reference',
        'Full timed mock #1 — review only wrong answers and add them to the leech list',
        'Full timed mock #2 — same discipline',
        'Full timed mock #3 — then re-drill your two lowest-scoring sections',
        'Go/no-go: ≥75% on section drills → sit Oct 9. Below that → move to Oct 23 and attack the weak sections'
      ]
    }
  ],
  finalReviewTasks: [
    'Run all nine decision tables from memory, on paper',
    'Full flashcard pass — leeches only on the last day',
    'Re-read all four case studies one final time',
    'Re-read your own notes; no new material from here',
    'Logistics: check ID, test the proctoring setup, clear the desk, confirm the time slot'
  ]
};

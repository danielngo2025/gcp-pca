// Verbatim from the official PCA exam guide (rev. 30 Oct 2025). Do not paraphrase bullets —
// they are the exam's own wording and the site's source of truth.
// prep: 'foundational' (most practising cloud engineers arrive with this) | 'partial'
// (partly familiar, named gaps to fill) | 'gap' (commonly under-prepared — budget real time).
window.BLUEPRINT = {
  guideRevision: '2025-10-30',
  guideUrl: 'https://services.google.com/fh/files/misc/professional_cloud_architect_exam_guide_english.pdf',
  examUrl: 'https://cloud.google.com/learn/certification/cloud-architect',
  sampleQuestionsUrl: 'https://docs.google.com/forms/d/e/1FAIpQLSf54f7FbtSJcXUY6-DUHfBG31jZ3pujgb8-a5io_9biJsNpqg/viewform',
  exam: {
    date: '2026-10-09',
    minutes: 120,
    questions: '50–60',
    price: '$200',
    validityYears: 2,
    caseStudyShare: '20–30%'
  },
  // Canonical v6.1 standard-exam PDFs, taken from the hyperlinks embedded in the exam guide.
  // (The unprefixed altostrat_/cymbal_ PDFs are the RENEWAL exam versions — different documents.)
  caseStudies: [
    { id: 'altostrat', name: 'Altostrat Media', status: 'new Oct 2025',
      url: 'https://services.google.com/fh/files/misc/v6.1_pca_altostrat_media_case_study_english.pdf',
      hook: 'Media library on GKE + Cloud Storage, BigQuery warehouse, Cloud Run functions. Generative AI for recommendations, summarization and harmful-content detection. Needs Kubernetes on-prem AND in cloud.' },
    { id: 'cymbal', name: 'Cymbal Retail', status: 'new Oct 2025',
      url: 'https://services.google.com/fh/files/misc/v6.1_pca_cymbal_retail_case_study_english.pdf',
      hook: 'Online retailer with an unmanageable catalog and keyword-only search. Gen-AI attribute and image generation, conversational commerce, mandatory human-in-the-loop review.' },
    { id: 'ehr', name: 'EHR Healthcare', status: 'carried over',
      url: 'https://services.google.com/fh/files/misc/v6.1_pca_ehr_healthcare_case_study_english.pdf',
      hook: 'SaaS electronic health records leaving colocation. HIPAA, 99.9%, and permanent on-prem insurance integrations that will never move.' },
    { id: 'knightmotives', name: 'KnightMotives Automotive', status: 'new Oct 2025',
      url: 'https://services.google.com/fh/files/misc/v6.1_pca_knightmotives_automotive_case_study_english.pdf',
      hook: 'Autonomous vehicle manufacturer. Mainframe supply chain, GDPR on autonomous data, unreliable rural connectivity, dealers with no equipment budget, data monetization to fund it all.' }
  ],
  retiredCaseStudies: ['Mountkirk Games', 'TerramEarth', 'Helicopter Racing League'],
  sections: [
    {
      id: '1', weight: 25,
      title: 'Designing and planning a cloud solution architecture',
      topics: [
        {
          id: '1.1', prep: 'gap',
          title: 'Designing a cloud solution infrastructure that meets business requirements',
          bullets: [
            'Business use cases and product strategy',
            'Identifying functional and non-functional requirements',
            'Business continuity plan',
            'Cost optimization',
            'Supporting the application design',
            'Integration patterns with external systems',
            'Movement of data',
            'Design decision trade-offs',
            'Workload disposition strategies (e.g., build, buy, modify, or deprecate)',
            'Success measurements (e.g., key performance indicators [KPI], return on investment [ROI], and metrics)',
            'Security and compliance',
            'Observability'
          ],
          note: 'The single heaviest sub-section on the exam, and pure judgment — no service trivia to fall back on. Commonly dismissed as "soft", which is exactly why drilling it is cheap points.',
          docs: [
            { label: 'Well-Architected Framework', url: 'https://cloud.google.com/architecture/framework' },
            { label: 'Cost optimization pillar', url: 'https://cloud.google.com/architecture/framework/cost-optimization' }
          ]
        },
        {
          id: '1.2', prep: 'partial',
          title: 'Designing a cloud solution infrastructure that meets technical requirements',
          bullets: [
            'Familiarity with the Google Cloud Well-Architected Framework',
            'High availability and fail-over design',
            'Flexibility of cloud resources',
            'Scalability to meet growth requirements',
            'Performance and latency',
            'Gemini Cloud Assist',
            'Backup and recovery'
          ],
          note: 'HA and autoscaling instincts usually transfer from practice. Backup and recovery design, and Gemini Cloud Assist, usually do not.',
          docs: [
            { label: 'Reliability pillar', url: 'https://cloud.google.com/architecture/framework/reliability' },
            { label: 'Gemini Cloud Assist', url: 'https://cloud.google.com/gemini/docs/cloud-assist/overview' }
          ]
        },
        {
          id: '1.3', prep: 'partial',
          title: 'Designing network, storage, and compute resources',
          bullets: [
            'Integration with on-premises/multicloud environments',
            'Google Cloud AI and machine learning solutions (e.g., Gemini LLMs, Agent Builder, Model Garden, Gemini models, and AI Hypercomputer)',
            'Cloud-native networking (e.g., virtual private cloud [VPC], peering, firewalls, load balancers, routing, container networking, shared VPC, and Private Service Connect)',
            'Choosing data processing solutions',
            'Choosing appropriate storage types (e.g., object, file, and databases)',
            'Mapping compute needs to platform products (e.g., Google Kubernetes Engine [GKE], Cloud Run, and Cloud Run functions)',
            'Choosing compute resources (e.g., spot VMs, custom machine types, and specialized workload)'
          ],
          note: 'The widest bullet list on the exam. Compute and storage selection reward experience; the AI/ML product line, Shared VPC, Private Service Connect and the broader data-processing catalogue almost always need deliberate study.',
          docs: [
            { label: 'Private Service Connect', url: 'https://cloud.google.com/vpc/docs/private-service-connect' },
            { label: 'Shared VPC', url: 'https://cloud.google.com/vpc/docs/shared-vpc' },
            { label: 'Model Garden', url: 'https://cloud.google.com/model-garden' }
          ]
        },
        {
          id: '1.4', prep: 'gap',
          title: 'Creating a migration plan (i.e., documents and architectural diagrams)',
          bullets: [
            'Integrating solutions with existing systems',
            'Assessing and migrating systems and data to support the solution (e.g., Google Cloud Migration Center)',
            'Using migration methodologies, workload testing, network planning, and dependency planning',
            'Determining software license implications and financial impact'
          ],
          note: 'A cold start for anyone who has only worked cloud-native: lift-and-shift, dependency mapping and BYOL economics have no day-job equivalent.',
          docs: [
            { label: 'Migration Center', url: 'https://cloud.google.com/migration-center/docs/migration-center-overview' },
            { label: 'Migration to Google Cloud (series)', url: 'https://cloud.google.com/architecture/migration-to-gcp-getting-started' }
          ]
        },
        {
          id: '1.5', prep: 'gap',
          title: 'Envisioning future solution improvements',
          bullets: [
            'Cloud and technology improvements',
            'Evolution of business needs',
            'Cloud-first design approach'
          ],
          note: 'Small and conceptual. Read once, do a handful of questions, move on.',
          docs: [{ label: 'Well-Architected Framework', url: 'https://cloud.google.com/architecture/framework' }]
        }
      ]
    },
    {
      id: '2', weight: 17.5,
      title: 'Managing and provisioning a cloud solution infrastructure',
      topics: [
        {
          id: '2.1', prep: 'partial',
          title: 'Configuring network topologies',
          bullets: [
            'Extending to on-premises environments (hybrid networking)',
            'Extending to a multicloud environment that may include Google Cloud-to-Google Cloud communication',
            'Security protection (e.g. intrusion protection, access control, and firewalls)',
            'VPC design and load balancing (e.g., access to cloud, internet, and cloud adjacent services)'
          ],
          note: 'Single-cloud VPC design usually transfers. Hybrid is the gap: Interconnect, HA VPN, Network Connectivity Center, plus the full load balancer taxonomy.',
          docs: [
            { label: 'Hybrid connectivity options', url: 'https://cloud.google.com/network-connectivity/docs/how-to/choose-product' },
            { label: 'Load balancer types', url: 'https://cloud.google.com/load-balancing/docs/choosing-load-balancer' },
            { label: 'Cloud Armor', url: 'https://cloud.google.com/armor/docs/cloud-armor-overview' }
          ]
        },
        {
          id: '2.2', prep: 'partial',
          title: 'Configuring individual storage systems',
          bullets: [
            'Data storage allocation',
            'Data processing and compute provisioning',
            'Security and access management',
            'Configuration for data transfer and latency',
            'Data retention and data lifecycle management',
            'Data growth planning',
            'Data protection (e.g., backup and recovery)'
          ],
          note: 'Knowing the products is not enough — the exam wants lifecycle policies, storage classes, transfer choices and backup/recovery design.',
          docs: [
            { label: 'GCS storage classes', url: 'https://cloud.google.com/storage/docs/storage-classes' },
            { label: 'Object lifecycle management', url: 'https://cloud.google.com/storage/docs/lifecycle' },
            { label: 'Database decision guide', url: 'https://cloud.google.com/products/databases' }
          ]
        },
        {
          id: '2.3', prep: 'foundational',
          title: 'Configuring compute systems',
          bullets: [
            'Compute resource provisioning',
            'Compute volatility configuration (spot vs. standard)',
            'Cloud-native network configuration for compute resources (e.g., Compute Engine, GKE, serverless networking, and Google Cloud VMware Engine)',
            'Infrastructure orchestration, resource configuration, and patch management',
            'Container orchestration',
            'Serverless computing'
          ],
          note: 'Container orchestration and provisioning are common lived experience. Serverless networking and VMware Engine are the usual blind spots.',
          docs: [
            { label: 'Spot VMs', url: 'https://cloud.google.com/compute/docs/instances/spot' },
            { label: 'Cloud Run', url: 'https://cloud.google.com/run/docs/overview/what-is-cloud-run' },
            { label: 'VMware Engine', url: 'https://cloud.google.com/vmware-engine/docs/overview' }
          ]
        },
        {
          id: '2.4', prep: 'gap', priority: true,
          title: 'Leveraging Gemini Enterprise Agent Platform for end-to-end ML workflows',
          bullets: [
            'Using Agent Platform Pipelines to automate and orchestrate the ML lifecycle',
            'Preparing for Agent Platform data integration',
            'Using AI Hypercomputer (e.g., using AI Hypercomputer, Cloud Run functions, and Agent Platform for ML/AI workloads; integrating GPUs and TPUs in ML model training and serving; optimizing for different consumption models; and running large-scale AI model trainings)'
          ],
          note: 'New in the Oct 2025 rewrite, and most third-party prep material has not caught up. The highest-risk topic on the exam — week 6 exists for this.',
          docs: [
            { label: 'Gemini Enterprise', url: 'https://cloud.google.com/gemini-enterprise/docs/overview' },
            { label: 'Vertex AI Pipelines', url: 'https://cloud.google.com/vertex-ai/docs/pipelines/introduction' },
            { label: 'AI Hypercomputer', url: 'https://cloud.google.com/ai-hypercomputer/docs/overview' },
            { label: 'TPU overview', url: 'https://cloud.google.com/tpu/docs/intro-to-tpu' }
          ]
        },
        {
          id: '2.5', prep: 'gap', priority: true,
          title: 'Configuring prebuilt solutions or APIs with Agent Platform',
          bullets: [
            'Differentiating between the Google AI APIs (e.g., Search, Conversation, Vision, Image, Video, and Audio)',
            'Integrating Gemini Enterprise features (AI Agents and NotebookLM) to enhance workflows',
            'Integrating AI models from Model Garden into the solution'
          ],
          note: 'Also new. Mostly "which prebuilt API for which scenario" — a decision table, so it drills fast once you have the table.',
          docs: [
            { label: 'Vision API', url: 'https://cloud.google.com/vision/docs' },
            { label: 'Vertex AI Search', url: 'https://cloud.google.com/enterprise-search' },
            { label: 'Model Garden', url: 'https://cloud.google.com/model-garden' },
            { label: 'NotebookLM Enterprise', url: 'https://cloud.google.com/agentspace/notebooklm-enterprise/docs/overview' }
          ]
        }
      ]
    },
    {
      id: '3', weight: 17.5,
      title: 'Designing for security and compliance',
      topics: [
        {
          id: '3.1', prep: 'foundational',
          title: 'Designing for security',
          bullets: [
            'Identity and Access Management (IAM)',
            'Resource hierarchy (organizations, folders, and projects)',
            'Data security (key management, encryption, secret management)',
            'Separation of duties',
            'Security controls (e.g., auditing, VPC Service Controls, context aware access, organization policy, and hierarchical firewall policy)',
            'Managing customer-managed encryption keys with Cloud Key Management Service (Cloud KMS)',
            'Secure remote access (e.g., Identity-Aware Proxy, service account impersonation, Chrome Enterprise Premium, and Workload Identity Federation)',
            'Securing software supply chain',
            'Securing AI (e.g., Model Armor, Sensitive Data Protection, and secure model deployment)'
          ],
          note: 'Broad and heavily weighted, but IAM and encryption fundamentals usually transfer. Commonly missed: VPC Service Controls, context-aware access, IAP, organization policy, hierarchical firewall policy, and the whole "Securing AI" bullet.',
          docs: [
            { label: 'VPC Service Controls', url: 'https://cloud.google.com/vpc-service-controls/docs/overview' },
            { label: 'Identity-Aware Proxy', url: 'https://cloud.google.com/iap/docs/concepts-overview' },
            { label: 'Organization policy constraints', url: 'https://cloud.google.com/resource-manager/docs/organization-policy/overview' },
            { label: 'Model Armor', url: 'https://cloud.google.com/security-command-center/docs/model-armor-overview' },
            { label: 'Sensitive Data Protection', url: 'https://cloud.google.com/sensitive-data-protection/docs' }
          ]
        },
        {
          id: '3.2', prep: 'partial',
          title: 'Designing for compliance',
          bullets: [
            'Legislation and regulation (e.g., health record privacy, children’s privacy, data privacy, ownership, and data sovereignty)',
            'Commercial (e.g., sensitive data such as credit card information handling and personally identifiable information [PII])',
            'Industry certifications (e.g., SOC 2)',
            'Audits (including logs)'
          ],
          note: 'Learn the regulations themselves: HIPAA (drives EHR Healthcare), PCI-DSS, GDPR, COPPA — children’s privacy is named explicitly — plus data residency and Assured Workloads.',
          docs: [
            { label: 'Compliance offerings', url: 'https://cloud.google.com/security/compliance/offerings' },
            { label: 'Assured Workloads', url: 'https://cloud.google.com/assured-workloads/docs/overview' },
            { label: 'Cloud Audit Logs', url: 'https://cloud.google.com/logging/docs/audit' }
          ]
        }
      ]
    },
    {
      id: '4', weight: 15,
      title: 'Analyzing and optimizing technical and business processes',
      topics: [
        {
          id: '4.1', prep: 'partial',
          title: 'Analyzing and defining technical processes',
          bullets: [
            'Software development lifecycle (SDLC)',
            'Continuous integration/continuous deployment',
            'Troubleshooting/root cause analysis best practices',
            'Testing and validation of software and infrastructure',
            'Service catalog and provisioning',
            'Disaster recovery'
          ],
          note: 'CI/CD and provisioning are usually day-job knowledge. Disaster recovery is the hard gap — RTO/RPO and the four DR patterns rarely come from practice.',
          docs: [
            { label: 'DR planning guide', url: 'https://cloud.google.com/architecture/dr-scenarios-planning-guide' },
            { label: 'DR building blocks', url: 'https://cloud.google.com/architecture/dr-scenarios-building-blocks' }
          ]
        },
        {
          id: '4.2', prep: 'gap',
          title: 'Analyzing and defining business processes',
          bullets: [
            'Stakeholder management (e.g., influencing and facilitation)',
            'Change management',
            'Team assessment/skills readiness',
            'Decision-making processes',
            'Customer success management',
            'Cost optimization/resource optimization (CapEx/OpEx)',
            'Business continuity'
          ],
          note: 'Feels non-technical and gets skipped — which is exactly why it is worth the hours. Learn the CapEx/OpEx framing and committed-use vs on-demand economics.',
          docs: [
            { label: 'Cost optimization pillar', url: 'https://cloud.google.com/architecture/framework/cost-optimization' },
            { label: 'Committed use discounts', url: 'https://cloud.google.com/docs/cuds' }
          ]
        }
      ]
    },
    {
      id: '5', weight: 12.5,
      title: 'Managing implementation',
      topics: [
        {
          id: '5.1', prep: 'partial',
          title: 'Advising development and operation teams to ensure the successful deployment of the solution',
          bullets: [
            'Application and infrastructure deployment',
            'API management best practices (e.g., Apigee)',
            'Testing frameworks (load/unit/integration)',
            'Data and system migration and management tooling',
            'Gemini Cloud Assist'
          ],
          note: 'Deployment practice usually transfers. Apigee specifically often does not — know it as a full API management platform, not just a gateway.',
          docs: [
            { label: 'Apigee overview', url: 'https://cloud.google.com/apigee/docs/api-platform/get-started/what-apigee' },
            { label: 'Gemini Cloud Assist', url: 'https://cloud.google.com/gemini/docs/cloud-assist/overview' }
          ]
        },
        {
          id: '5.2', prep: 'foundational',
          title: 'Interacting with Google Cloud programmatically',
          bullets: [
            'Cloud Shell Editor, Cloud Code, and Cloud Shell Terminal',
            'Google Cloud SDKs (e.g., gcloud, gsutil, and bq)',
            'Cloud Emulators (e.g., Bigtable, Spanner, Pub/Sub, and Firestore)',
            'Infrastructure as Code (e.g., IaC and Terraform)',
            'Accessing Google API best practices',
            'Google API client libraries'
          ],
          note: 'Nearly free points if you already write infrastructure as code. Skim the emulators and the gcloud/gsutil/bq surface and bank the section.',
          docs: [
            { label: 'gcloud reference', url: 'https://cloud.google.com/sdk/gcloud/reference' },
            { label: 'Emulators', url: 'https://cloud.google.com/sdk/gcloud/reference/emulators' }
          ]
        }
      ]
    },
    {
      id: '6', weight: 12.5,
      title: 'Ensuring solution and operations excellence',
      topics: [
        {
          id: '6.1', prep: 'gap',
          title: 'Understanding the principles and recommendations of the operational excellence pillar of the Google Cloud Well-Architected Framework',
          bullets: [],
          note: 'Read the pillar itself, end to end. It is a primary source the exam quotes from, not background reading.',
          docs: [{ label: 'Operational excellence pillar', url: 'https://cloud.google.com/architecture/framework/operational-excellence' }]
        },
        {
          id: '6.2', prep: 'foundational',
          title: 'Familiarity with Google Cloud Observability solutions',
          bullets: ['Monitoring and logging', 'Profiling and benchmarking', 'Alerting strategies'],
          note: 'Logging and alerting usually transfer. Add Cloud Profiler and Cloud Trace, and the SLI/SLO/error-budget vocabulary.',
          docs: [
            { label: 'Cloud Observability', url: 'https://cloud.google.com/stackdriver/docs' },
            { label: 'SLIs, SLOs, error budgets', url: 'https://cloud.google.com/architecture/framework/reliability/define-reliability-goals' },
            { label: 'Cloud Profiler', url: 'https://cloud.google.com/profiler/docs' }
          ]
        },
        {
          id: '6.3', prep: 'foundational',
          title: 'Deployment and release management',
          bullets: [],
          note: 'Know the named strategies by name: blue/green, canary, rolling, recreate — and when each is right.',
          docs: [{ label: 'Deployment strategies', url: 'https://cloud.google.com/deploy/docs/deployment-strategies' }]
        },
        {
          id: '6.4', prep: 'gap',
          title: 'Assisting with the support of deployed solutions',
          bullets: [],
          note: 'Support models, escalation, incident response, on-call. Small, but explicitly listed.',
          docs: [{ label: 'Incident response', url: 'https://cloud.google.com/architecture/framework/reliability/perform-incident-management' }]
        },
        {
          id: '6.5', prep: 'gap',
          title: 'Evaluating quality control measures',
          bullets: [],
          note: 'Quality gates, code review, automated policy checks. Lint and scan tooling is adjacent but not the same thing.',
          docs: [{ label: 'Operational excellence pillar', url: 'https://cloud.google.com/architecture/framework/operational-excellence' }]
        },
        {
          id: '6.6', prep: 'gap',
          title: 'Ensuring the reliability of solutions in production',
          bullets: ['Chaos engineering', 'Penetration testing', 'Load testing'],
          note: 'Named techniques that rarely come from practice. Learn what each proves and when you would reach for it.',
          docs: [
            { label: 'Reliability pillar', url: 'https://cloud.google.com/architecture/framework/reliability' },
            { label: 'Testing for reliability', url: 'https://cloud.google.com/architecture/framework/reliability/perform-testing-for-recovery' }
          ]
        }
      ]
    }
  ]
};

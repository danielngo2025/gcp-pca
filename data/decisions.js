// The nine decision tables. This exam is won on service selection, so these are the
// highest-value content in the site. Each row's `tell` is the phrase in a question stem
// that points at that answer — that is what you drill, not the feature list.
window.DECISIONS = [
  {
    id: 'compute', topic: '1.3', title: 'Compute selection',
    intro: 'Work down: does it need to be a container? Does it scale to zero? Do you need node-level control?',
    cols: ['Option', 'Pick it when', 'The tell in the question'],
    rows: [
      ['Cloud Run', 'Containerized, request-driven, bursty; want scale-to-zero and no cluster', '"no infrastructure to manage", "pay per request", "scale to zero", "already containerized"'],
      ['Cloud Run functions', 'Single-purpose, event-driven glue reacting to a trigger', '"when a file is uploaded", "on a Pub/Sub message", "lightweight event handler"'],
      ['GKE Autopilot', 'Need Kubernetes APIs but not node management; pay per pod request', '"Kubernetes without managing nodes", "per-pod billing"'],
      ['GKE Standard', 'Need node-level control: custom node pools, DaemonSets, GPUs, specific OS', '"node pools", "privileged access to nodes", "custom kernel", "GPU nodes"'],
      ['App Engine standard', 'Legacy-supported languages, fast scale-to-zero web apps', '"existing App Engine app", "simple web app, minimal ops"'],
      ['Compute Engine', 'Lift-and-shift, licensed software, OS-level control, unusual dependencies', '"lift and shift", "cannot be containerized", "requires specific OS", "legacy"'],
      ['Sole-tenant nodes', 'Licence terms require dedicated physical hardware, or compliance demands isolation', '"per-physical-core licence", "BYOL", "no shared tenancy"'],
      ['VMware Engine', 'Hundreds of VMware VMs to move fast, keeping vSphere tooling and skills', '"existing VMware estate", "keep current tooling", "minimal retraining"'],
      ['Spot VMs', 'Fault-tolerant, checkpointed, restartable batch work; cost dominates', '"fault-tolerant", "batch", "restartable", "checkpointed", "lowest cost"'],
      ['Batch / managed batch', 'Queued batch jobs needing scheduling across pooled capacity', '"job queue", "scheduled batch processing at scale"']
    ]
  },
  {
    id: 'database', topic: '1.3', title: 'Database selection',
    intro: 'The most reliably tested table on the exam. Discriminate on: relational or not, regional or global, consistency, and OLTP or OLAP.',
    cols: ['Option', 'Pick it when', 'The tell in the question'],
    rows: [
      ['Cloud SQL', 'Standard relational OLTP, regional, fits on one primary (MySQL/Postgres/SQL Server)', '"existing MySQL/PostgreSQL", "lift and shift the database", "regional relational"'],
      ['AlloyDB', 'PostgreSQL-compatible but needs more transactional throughput, or mixed transactional + analytical', '"PostgreSQL-compatible at higher performance", "HTAP", "analytics on operational data"'],
      ['Spanner', 'Relational + strong consistency + horizontal write scale, often multi-region/global', '"global", "strongly consistent", "unlimited scale", "relational at planet scale", "99.999%"'],
      ['Bigtable', 'Huge sustained write throughput, key/range access, single-digit ms; no joins needed', '"IoT", "time series", "petabytes", "millions of writes per second", "row key"'],
      ['Firestore', 'Document model, mobile/web clients, offline sync, real-time listeners', '"mobile app", "offline support", "real-time updates to clients", "document"'],
      ['BigQuery', 'Analytical queries over large datasets; warehouse, not an operational store', '"data warehouse", "analytics", "ad hoc SQL over terabytes", "BI dashboards"'],
      ['Memorystore', 'Cache or session store in front of a database; Redis or Memcached', '"reduce database load", "cache", "session state", "sub-millisecond"'],
      ['Bare Metal Solution', 'Oracle or other workloads that cannot run on Google Cloud native services', '"Oracle", "specialized licensed database that must stay as-is"']
    ]
  },
  {
    id: 'storage', topic: '2.2', title: 'Cloud Storage class & object storage',
    intro: 'Every class serves the first byte in milliseconds. They differ on storage price, retrieval cost and minimum storage duration — never on latency.',
    cols: ['Option', 'Pick it when', 'The tell in the question'],
    rows: [
      ['Standard', 'Frequently accessed, or short-lived data', '"hot data", "served to users", "accessed constantly"'],
      ['Nearline', 'Accessed roughly monthly; 30-day minimum duration', '"accessed about once a month", "backups read occasionally"'],
      ['Coldline', 'Accessed roughly quarterly; 90-day minimum duration', '"accessed a few times a year", "DR copy"'],
      ['Archive', 'Accessed at most yearly; 365-day minimum duration; cheapest storage', '"long-term retention", "compliance archive", "rarely if ever read"'],
      ['Autoclass', 'Access pattern is unknown or varies and you want automatic class transitions', '"unpredictable access pattern", "do not want to manage lifecycle"'],
      ['Lifecycle rules', 'Deterministic ageing: transition class at N days, delete at M days', '"delete after N days", "move to colder storage after 30 days"'],
      ['Object versioning', 'Must recover from overwrite or accidental delete', '"accidental deletion", "recover a previous version"'],
      ['Retention policy + bucket lock', 'Regulator requires immutability; even admins must not delete', '"WORM", "immutable", "cannot be deleted even by an administrator"'],
      ['Filestore', 'Shared POSIX filesystem mounted by many VMs concurrently', '"NFS", "shared file system", "POSIX", "mounted by multiple instances"']
    ]
  },
  {
    id: 'loadbalancer', topic: '2.1', title: 'Load balancer selection',
    intro: 'Three questions in order: L7 (application) or L4 (network)? Global or regional? External or internal? Passthrough only preserves the client source IP.',
    cols: ['Option', 'Pick it when', 'The tell in the question'],
    rows: [
      ['Global external Application LB', 'Internet-facing HTTP(S), global users, need Cloud CDN / Cloud Armor / URL routing', '"global", "HTTP(S)", "CDN", "WAF", "single anycast IP", "path-based routing"'],
      ['Regional external Application LB', 'Internet-facing HTTP(S) confined to one region, often for data residency', '"must stay in one region", "regional HTTP(S)"'],
      ['Cross-region internal Application LB', 'Internal HTTP(S) with clients in several regions', '"internal", "HTTP(S)", "multi-region clients", "private"'],
      ['Regional internal Application LB', 'Internal HTTP(S) within one region — typical microservice-to-microservice', '"internal only", "within the VPC", "L7 routing"'],
      ['External proxy Network LB', 'Internet-facing non-HTTP TCP/SSL where you want proxying and offload', '"TCP", "SSL offload", "not HTTP"'],
      ['External passthrough Network LB', 'Must preserve client source IP, or need UDP/ESP/ICMP', '"preserve source IP", "UDP", "non-TCP protocol", "no proxying"'],
      ['Internal passthrough Network LB', 'Internal L4, or LB as next hop for a route', '"internal TCP/UDP", "next hop", "preserve source IP internally"'],
      ['Cloud CDN', 'Cacheable content served from the edge (attaches to the global external Application LB)', '"static content", "reduce latency for global users", "cache at the edge"']
    ]
  },
  {
    id: 'hybrid', topic: '2.1', title: 'Hybrid & multicloud connectivity',
    intro: 'Watch for the SLA number and whether the requirement is private VPC connectivity or merely reaching Google public endpoints.',
    cols: ['Option', 'Pick it when', 'The tell in the question'],
    rows: [
      ['Dedicated Interconnect', 'Private 10/100 Gbps, you can reach a colocation facility where Google is present', '"10 Gbps or more", "private", "colocation", "dedicated physical connection"'],
      ['Dedicated, redundant across edge availability domains', 'Need the 99.99% SLA', '"99.99%", "highly available private connection"'],
      ['Partner Interconnect', 'Private connectivity but you cannot reach a colo, or need less than 10 Gbps', '"service provider", "50 Mbps to 50 Gbps", "no colocation presence"'],
      ['HA VPN', 'Encrypted over the internet, 99.99% SLA, modest bandwidth, fast to stand up', '"IPsec", "encrypted over the internet", "quickly", "99.99% VPN"'],
      ['Classic VPN', 'Legacy single-tunnel VPN — 99.9% only; prefer HA VPN for anything new', '"existing VPN", "single tunnel"'],
      ['Direct / Carrier Peering', 'Optimized reach to Google PUBLIC endpoints — NOT private VPC connectivity', 'Trap answer whenever the question says "private" or "internal IP"'],
      ['Cross-Cloud Interconnect', 'Dedicated private link between Google Cloud and another cloud provider', '"connect to AWS/Azure privately", "multicloud"'],
      ['Network Connectivity Center', 'Hub-and-spoke transit across many VPCs and hybrid connections', '"transit", "many sites", "hub and spoke", "centralized connectivity"'],
      ['VPC Network Peering', 'Private VPC-to-VPC, non-transitive, no overlapping ranges', '"two VPCs", "private", but watch for overlapping CIDR or transitivity needs'],
      ['Private Service Connect', 'Consume a service privately via an endpoint with an internal IP in your VPC', '"no peering", "avoid IP range conflicts", "private access to a managed/partner service"'],
      ['Shared VPC', 'One team owns the network; other projects deploy into it', '"central network team", "separation of duties", "many projects, one network"']
    ]
  },
  {
    id: 'dr', topic: '4.1', title: 'Disaster recovery patterns',
    intro: 'Read the stated RTO and RPO, then pick the cheapest pattern that meets both. Cost rises monotonically down this table.',
    cols: ['Pattern', 'RTO / RPO profile', 'What runs when idle'],
    rows: [
      ['Backup & restore', 'RTO hours to days; RPO = backup interval', 'Nothing but backups, replicated cross-region. Cheapest.'],
      ['Cold standby (pilot light)', 'RTO hours; RPO minutes to hours', 'Infrastructure defined (IaC) and core data replicating; compute off.'],
      ['Warm standby', 'RTO minutes; RPO seconds to minutes', 'A scaled-down but live replica of the stack, ready to scale up.'],
      ['Hot / multi-site active-active', 'RTO near zero; RPO near zero', 'Full capacity live in both regions serving traffic. Most expensive, hardest to build.'],
      ['— test regularly —', 'An untested plan has an unknown RTO', 'Failover AND failback rehearsal is what converts a document into a capability.']
    ]
  },
  {
    id: 'migration', topic: '1.4', title: 'Migration strategy & tooling',
    intro: 'The strategy follows the constraint — deadline, differentiation, or licence economics. The tool follows the strategy.',
    cols: ['Strategy / tool', 'Pick it when', 'The tell in the question'],
    rows: [
      ['Rehost (lift & shift)', 'Hard deadline, no time or appetite to redesign', '"datacenter lease expires", "as quickly as possible", "no application changes"'],
      ['Replatform (move & improve)', 'Modest changes unlock a managed service (e.g. self-managed MySQL → Cloud SQL)', '"reduce operational burden", "managed service", "minimal code change"'],
      ['Refactor / re-architect', 'Workload is a differentiator and current architecture blocks growth', '"scale beyond current limits", "cloud-native", "monolith to microservices"'],
      ['Repurchase', 'Commodity, undifferentiated function with a mature SaaS equivalent', '"not a competitive differentiator", "off-the-shelf", "payroll/CRM/HR"'],
      ['Retire', 'Nobody uses it, or another system already covers it', '"low usage", "duplicated functionality"'],
      ['Retain', 'Cannot move yet — regulatory, latency, or licence blocker', '"must remain on-premises", "regulatory constraint"'],
      ['Migration Center', 'Assessment phase: discovery, inventory, dependency mapping, TCO', '"build the business case", "assess", "dependencies", "TCO"'],
      ['Migrate to Virtual Machines', 'Executing VM migration into Compute Engine', '"migrate VMs", "convert to Compute Engine"'],
      ['Database Migration Service', 'Minimal-downtime database migration with continuous replication', '"minimal downtime", "migrate MySQL/PostgreSQL", "keep replicating until cutover"'],
      ['Storage Transfer Service', 'Online bulk transfer where bandwidth × time is sufficient', '"transfer from S3", "online", "scheduled recurring transfer"'],
      ['Transfer Appliance', 'Data volume ÷ available bandwidth exceeds the time budget', 'Do the arithmetic: hundreds of TB on a small link ⇒ ship it'],
      ['Datastream', 'Ongoing change data capture into BigQuery or Cloud Storage', '"CDC", "replicate changes continuously for analytics"']
    ]
  },
  {
    id: 'iam', topic: '3.1', title: 'IAM & security control selection',
    intro: 'Separate the questions: WHO can act (IAM) · WHAT config is allowed (org policy) · WHERE FROM (VPC-SC) · WHICH IMAGE (Binary Auth).',
    cols: ['Control', 'Use it for', 'The tell in the question'],
    rows: [
      ['Predefined roles', 'Normal least-privilege grants', '"least privilege", "grant only what is needed"'],
      ['Custom roles', 'No predefined role fits and you need an exact permission set', '"specific set of permissions", "no predefined role matches"'],
      ['Basic roles (Owner/Editor/Viewer)', 'Almost never — flag as the wrong answer in production', 'If an option grants Editor or Owner broadly, it is usually the distractor'],
      ['Service account impersonation', 'Human or workload temporarily acts as a service account, no keys', '"without creating keys", "short-lived", "act as"'],
      ['Workload Identity (GKE)', 'Pods authenticate as a Google service account, keylessly', '"GKE pod needs access to a Google Cloud API"'],
      ['Workload Identity Federation', 'External IdP or another cloud/CI authenticates to Google Cloud keylessly', '"outside Google Cloud", "no service account keys", "GitHub Actions/AWS/on-prem"'],
      ['Organization policy', 'Guardrail on resource configuration that binds even Owners', '"prevent anyone from", "must never be possible", "regardless of permissions"'],
      ['VPC Service Controls', 'Stop exfiltration across a boundary despite valid credentials', '"data exfiltration", "stolen credentials", "insider", "even with IAM access"'],
      ['IAP + context-aware access', 'Identity- and device-aware app access without a VPN', '"without a VPN", "BeyondCorp", "device posture", "per-user access to internal app"'],
      ['CMEK (Cloud KMS)', 'You must control, rotate and be able to destroy the keys', '"control our own keys", "disable the key to render data unreadable"'],
      ['CSEK', 'You supply raw key material per request and Google stores nothing', '"we hold the key material ourselves", rare and operationally heavy'],
      ['Cloud HSM', 'Keys must live in FIPS 140-2 Level 3 hardware', '"hardware security module", "FIPS 140-2 Level 3"'],
      ['Secret Manager', 'Application secrets: API keys, passwords, certificates', '"store credentials", "rotate secrets", "not in source control"'],
      ['Binary Authorization', 'Only attested images may be deployed', '"only signed images", "trusted images", "supply chain"'],
      ['Sensitive Data Protection', 'Find, classify, mask or tokenize PII in data', '"de-identify", "redact", "discover PII", "tokenize"'],
      ['Model Armor', 'Screen LLM prompts and responses for injection and harmful content', '"prompt injection", "jailbreak", "filter model responses"'],
      ['PAM entitlement', 'Time-bound just-in-time elevated access with approval', '"temporary elevated access", "expires automatically", "break-glass with audit"']
    ]
  },
  {
    id: 'ai', topic: '2.5', title: 'AI & agent product selection',
    intro: 'Naming shifted when Vertex AI became the Gemini Enterprise Agent Platform at Next 2026 — verify current product names against live docs. The selection logic below is stable.',
    cols: ['Option', 'Pick it when', 'The tell in the question'],
    rows: [
      ['Prebuilt AI API (Vision / Video / Speech / Natural Language)', 'Common perception task, no labelled data, no ML team', '"no ML expertise", "no training data", "detect objects/faces/text in images"'],
      ['Enterprise search + grounding', 'Natural-language answers over your own corpus, with citations, staying current', '"our internal documents", "cite sources", "employees ask questions"'],
      ['Foundation model via Model Garden', 'Need a specific model — Gemini or third-party — as a building block', '"choose a model", "compare models", "open-model or third-party"'],
      ['Prompt engineering / grounding', 'Model needs facts it does not have', '"up-to-date information", "our data", "reduce hallucination"'],
      ['Fine-tuning', 'Model needs a consistent style, format or domain behaviour — not fresh facts', '"specific tone", "domain terminology", "structured output format"'],
      ['Agent build (ADK / Agent Studio)', 'Multi-step task with tool calls, not a single prompt-response', '"take actions", "call our APIs", "multi-turn workflow", "agent"'],
      ['ML pipelines', 'Repeatable, auditable, scheduled ML lifecycle with lineage', '"reproducible", "retrain on a schedule", "track artifacts", "lineage"'],
      ['TPUs', 'Very large matrix-heavy training/inference with XLA-supporting frameworks', '"large-scale training", "JAX/TensorFlow at scale", "transformer pretraining"'],
      ['GPUs', 'Broad framework and CUDA compatibility, varied or smaller workloads', '"CUDA", "custom kernels", "PyTorch", "mixed workloads", "inference serving"'],
      ['AI Hypercomputer', 'Large-scale coordinated accelerator infrastructure for major training runs', '"thousands of accelerators", "large-scale training infrastructure"'],
      ['NotebookLM Enterprise', 'Grounded research and synthesis over a curated document set', '"summarize our documents", "research assistant over a corpus"']
    ]
  }
];

// Flashcards drilled with spaced repetition. Generated from the tables above plus the
// high-confusion pairs the exam keeps returning to.
window.FLASHCARDS = [
  { id: 'f01', topic: '1.1', q: 'RPO vs RTO', a: 'RPO (recovery POINT) = how much DATA you may lose ⇒ drives backup/replication frequency. RTO (recovery TIME) = how long you may be DOWN ⇒ drives standby capacity and automation.' },
  { id: 'f02', topic: '4.1', q: 'SLI vs SLO vs SLA', a: 'SLI = the measurement. SLO = your internal target for it. SLA = the external contract with consequences, set looser than the SLO. Error budget = 1 − SLO.' },
  { id: 'f03', topic: '1.1', q: 'Functional vs non-functional requirement', a: 'Functional = what the system does ("place an order"). Non-functional = how well ("99.99% available", "p99 under 200ms", "data stays in the EU").' },
  { id: 'f04', topic: '1.3', q: 'When Spanner over Cloud SQL?', a: 'When you need relational + strong consistency + horizontal WRITE scale, usually multi-region. Cloud SQL writes stay on one primary; its replicas are async reads.' },
  { id: 'f05', topic: '1.3', q: 'When Bigtable over BigQuery?', a: 'Bigtable = operational, huge write throughput, single-digit ms, key/range access. BigQuery = analytical warehouse for scans and aggregation. Ingest rate ⇒ Bigtable; ad-hoc SQL ⇒ BigQuery.' },
  { id: 'f06', topic: '1.3', q: 'Firestore\'s three distinguishing client features', a: 'Offline persistence on the device, automatic sync on reconnect, and real-time snapshot listeners. If a question says "mobile" plus "offline" or "real-time updates", it is Firestore.' },
  { id: 'f07', topic: '2.2', q: 'Do colder Cloud Storage classes have higher latency?', a: 'No. All classes serve the first byte in milliseconds. They differ on storage price, retrieval cost and minimum storage duration (Nearline 30d, Coldline 90d, Archive 365d).' },
  { id: 'f08', topic: '2.2', q: 'Which controls protect against DELETION rather than infrastructure failure?', a: 'Object versioning (recover superseded/deleted generations) and a retention policy with bucket lock (deletion impossible, even for admins). Replication copies your delete — it does not protect you.' },
  { id: 'f09', topic: '2.1', q: 'Which load balancer preserves the client source IP?', a: 'Only passthrough Network Load Balancers. Application LBs and proxy Network LBs terminate the connection and replace the source IP. Passthrough is also the only option for UDP/ESP/ICMP.' },
  { id: 'f10', topic: '2.1', q: 'Which LB attaches to Cloud CDN and Cloud Armor?', a: 'The global external Application Load Balancer — anycast IP, URL maps, CDN caching, WAF policies.' },
  { id: 'f11', topic: '2.1', q: 'Dedicated Interconnect SLA: 99.9% vs 99.99%?', a: '99.9% = a single circuit. 99.99% requires redundant circuits in SEPARATE edge availability domains. If the question says 99.99%, one circuit is the wrong answer.' },
  { id: 'f12', topic: '2.1', q: 'Why is Direct Peering the wrong answer for private connectivity?', a: 'It gives optimized reach to Google PUBLIC endpoints. It does not attach to your VPC or carry RFC 1918 traffic. Private VPC connectivity needs Cloud VPN or Interconnect.' },
  { id: 'f13', topic: '2.1', q: 'Private Service Connect vs VPC Network Peering', a: 'PSC = consume a service through an endpoint with an internal IP in YOUR VPC; no address-range merge, no transitivity problem. Peering joins two VPCs\' address spaces and is non-transitive.' },
  { id: 'f14', topic: '2.1', q: 'Cloud NAT vs Private Google Access', a: 'Cloud NAT = egress to the ARBITRARY internet for instances with no external IP. Private Google Access = reach GOOGLE APIs privately. "Download from a public repo" ⇒ Cloud NAT.' },
  { id: 'f15', topic: '2.3', q: 'GKE Autopilot vs Standard', a: 'Autopilot: Google manages nodes, billed per pod resource request, no node access. Standard: you own node pools, upgrades, capacity — needed for DaemonSets, privileged workloads, custom node config.' },
  { id: 'f16', topic: '2.3', q: 'Spot VMs — runtime limit?', a: 'None. They can be reclaimed at any time and have no maximum runtime; the 24-hour cap belonged to older preemptible VMs. No availability SLA, so only interruption-tolerant work.' },
  { id: 'f17', topic: '2.3', q: 'How does a serverless service reach a private IP in your VPC?', a: 'Direct VPC egress or a Serverless VPC Access connector. Serverless workloads sit outside your VPC by default. Adding a public IP to the target is always the wrong answer.' },
  { id: 'f18', topic: '2.3', q: 'When sole-tenant nodes?', a: 'Licence terms billed per physical core or forbidding shared tenancy, or compliance requiring dedicated hardware. Custom machine types only shape vCPU/memory — they give no physical isolation.' },
  { id: 'f19', topic: '3.1', q: 'How do IAM allow policies combine down the hierarchy?', a: 'Union. Effective permissions = every grant at org + folder + project + resource. A narrower grant higher up never subtracts. Only deny policies or org policy constraints remove access.' },
  { id: 'f20', topic: '3.1', q: 'IAM vs organization policy', a: 'IAM = WHO may do what. Organization policy = WHAT resource configurations are permitted, binding even on Owners. "Must never be possible regardless of permissions" ⇒ org policy.' },
  { id: 'f21', topic: '3.1', q: 'What does VPC Service Controls add over IAM?', a: 'A context boundary: WHERE FROM. Even a validly authorized identity cannot move data across the perimeter — which is what defeats stolen credentials and insider exfiltration.' },
  { id: 'f22', topic: '3.1', q: 'Workload Identity vs Workload Identity Federation', a: 'Workload Identity = GKE Kubernetes SA → Google SA, for pods. Workload Identity Federation = EXTERNAL identity provider (GitHub Actions, AWS, on-prem) → short-lived Google credentials. Both keyless.' },
  { id: 'f23', topic: '3.1', q: 'CMEK vs CSEK vs Google-managed keys', a: 'Google-managed = default, no key control. CMEK = your keys in Cloud KMS; you can rotate, disable and destroy (crypto-shredding). CSEK = you supply raw key material per request; Google stores nothing.' },
  { id: 'f24', topic: '3.1', q: 'What enforces "only images our pipeline built may run"?', a: 'Binary Authorization — a deploy-time gate requiring attestations from designated attestors. Registry permissions and IAM control who pushes and deploys, not what the cluster admits.' },
  { id: 'f25', topic: '3.1', q: 'Which control gives temporary elevated access that expires by itself?', a: 'A PAM (Privileged Access Manager) time-bound just-in-time entitlement, with approval and audit. Manual removal is the control that gets forgotten.' },
  { id: 'f26', topic: '3.2', q: 'What technically enforces data residency?', a: 'The resource location organization policy constraint, plus Assured Workloads for regulated regimes. Choosing a regional bucket once does not stop the next resource landing elsewhere.' },
  { id: 'f27', topic: '3.2', q: 'How do you shrink PCI DSS scope most?', a: 'Never store card data — tokenize through a compliant provider so your systems hold only tokens. Encrypting or isolating stored card data reduces risk but keeps you in scope.' },
  { id: 'f28', topic: '3.2', q: 'Admin Activity vs Data Access audit logs', a: 'Admin Activity = configuration changes, always on, free. Data Access = reads of user data, mostly OFF by default because of volume. "Prove who read the record" ⇒ enable Data Access logs.' },
  { id: 'f29', topic: '3.2', q: 'Regulation triggers', a: 'Health records ⇒ HIPAA. Card data ⇒ PCI DSS. EU personal data ⇒ GDPR. Under-13 US users ⇒ COPPA (named explicitly in the guide as children\'s privacy).' },
  { id: 'f30', topic: '4.1', q: 'The four DR patterns, cheapest to most expensive', a: 'Backup & restore (RTO hours-days) → cold standby/pilot light (hours) → warm standby (minutes) → hot multi-site active-active (near zero). Pick the cheapest that meets the STATED RTO and RPO.' },
  { id: 'f31', topic: '4.1', q: 'Blue/green vs canary', a: 'Blue/green = two complete environments, all-at-once switch, rollback in seconds, needs 2x capacity. Canary = small traffic percentage to the new version, real-user signal before full exposure.' },
  { id: 'f32', topic: '4.1', q: 'What happens when the error budget is exhausted?', a: 'Feature releases pause and effort shifts to reliability until the budget recovers. Raising the SLO to fix the number discards the signal.' },
  { id: 'f33', topic: '4.2', q: 'CapEx → OpEx, in one line', a: 'Owning datacenter hardware is capital expenditure (large, up-front, depreciated). Cloud consumption is operating expenditure (ongoing, variable, expensed in-period).' },
  { id: 'f34', topic: '4.2', q: 'Cost optimization order of operations', a: 'Attribute spend (project/label/service) → rightsize to actual utilization → THEN commit. Committing before rightsizing locks in the waste for 1–3 years.' },
  { id: 'f35', topic: '4.2', q: 'Business continuity vs disaster recovery', a: 'BCP is the superset: keeping the whole business running — people, process, suppliers, manual fallbacks. DR is the IT-restoration subset within it.' },
  { id: 'f36', topic: '4.2', q: 'Workload disposition: build / buy / modify / deprecate', a: 'Turns on differentiation. Differentiator ⇒ build or modify. Commodity with a mature market ⇒ buy. Unused or duplicated ⇒ deprecate.' },
  { id: 'f37', topic: '5.1', q: 'When Apigee?', a: 'Many APIs needing consistent auth, rate limiting, quotas, versioning, a developer portal and analytics — API PRODUCT management, not just traffic routing. A load balancer plus WAF does not do this.' },
  { id: 'f38', topic: '5.1', q: 'Minimal-downtime database migration tool', a: 'Database Migration Service: initial load, then continuous replication, so downtime is just the cutover. Dump-and-import needs downtime for the whole transfer.' },
  { id: 'f39', topic: '5.2', q: 'Which CLI for which service?', a: 'bq ⇒ BigQuery. gsutil ⇒ Cloud Storage (gcloud storage is the recommended successor). gcloud ⇒ most everything else. kubectl ⇒ Kubernetes.' },
  { id: 'f40', topic: '5.2', q: 'Best-practice credentials for a workload on Compute Engine', a: 'Attach a service account and let client libraries use Application Default Credentials — the metadata server supplies short-lived tokens. No key file, nothing to rotate or leak.' },
  { id: 'f41', topic: '5.2', q: 'Terraform state in a team', a: 'Remote backend with locking, never local, never committed to Git (it holds sensitive values and Git has no locking). Apply from a pipeline, not laptops.' },
  { id: 'f42', topic: '6.2', q: 'The four golden signals', a: 'Latency, traffic, errors, saturation. Alert on these user-visible symptoms tied to SLO burn — not on causes like CPU above 80%.' },
  { id: 'f43', topic: '6.2', q: 'Cloud Trace vs Cloud Profiler', a: 'Trace = latency across request spans, where time goes between services. Profiler = continuous CPU/memory sampling attributed to functions and call stacks, which code burns resources.' },
  { id: 'f44', topic: '6.2', q: 'How do you alert on a log pattern?', a: 'Create a log-based metric on the pattern, then an alerting policy on that metric. A sink to BigQuery plus a scheduled query is far too slow.' },
  { id: 'f45', topic: '6.2', q: 'Cheap seven-year log retention?', a: 'A log sink to Cloud Storage with lifecycle rules to colder classes; keep only recent operational logs in log buckets. Long retention in log buckets or BigQuery costs much more.' },
  { id: 'f46', topic: '6.6', q: 'Chaos vs load vs penetration testing', a: 'Chaos = inject failure, verify graceful degradation. Load = apply traffic, verify capacity and SLO. Penetration = probe for security weaknesses. Match the technique to what is being proven.' },
  { id: 'f47', topic: '6.3', q: 'What decouples deploying from releasing?', a: 'Feature flags. Code ships dark and is enabled per-cohort at runtime with an instant kill switch. Blue/green decouples deploy from downtime, not from feature exposure.' },
  { id: 'f48', topic: '1.4', q: 'Online transfer or ship it?', a: 'Do the arithmetic: data volume ÷ available bandwidth vs the time budget. Hundreds of TB on a small shared link ⇒ Transfer Appliance. Otherwise Storage Transfer Service.' },
  { id: 'f49', topic: '2.4', q: 'TPU or GPU?', a: 'TPU = very large matrix-heavy training/inference with XLA-supporting frameworks (JAX, TensorFlow, PyTorch/XLA). GPU = broad framework and CUDA compatibility, custom kernels, varied or smaller workloads.' },
  { id: 'f50', topic: '2.5', q: 'Grounding vs fine-tuning', a: 'Grounding/retrieval supplies FACTS the model lacks and stays current as data changes — and can cite sources. Fine-tuning teaches STYLE, format and domain behaviour, not fresh facts.' },
  { id: 'f51', topic: '2.5', q: 'Model Armor vs Cloud Armor', a: 'Model Armor screens LLM prompts and responses (injection, jailbreak, harmful content). Cloud Armor is a network-edge WAF on a load balancer. Easy name trap.' },
  { id: 'f52', topic: '2.4', q: 'Why use ML pipelines rather than scheduled notebooks?', a: 'Reproducibility, artifact lineage, caching and comparable runs. Chaining notebooks by scheduler or event glue gives automation with none of that.' },
  { id: 'f53', topic: '1.3', q: 'Cloud Tasks vs Pub/Sub', a: 'Cloud Tasks = point-to-point "do this work", one target per task, native per-queue rate limiting and retries. Pub/Sub = fan-out "this happened", many subscribers per topic.' },
  { id: 'f54', topic: '1.2', q: 'What does Cloud SQL HA actually protect against?', a: 'Zone loss within one region — synchronous standby in a second zone, automatic failover. The standby serves NO traffic (no read scaling), and it does not cover region loss or logical corruption.' },
  { id: 'f55', topic: '3.1', q: 'Resource hierarchy design, in one line', a: 'Folders per environment (prod / non-prod) with per-application projects inside; apply IAM and org policy at the folder. The PROJECT is the isolation boundary. Labels enforce nothing.' }
];

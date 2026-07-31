// Question bank. Authored from the official exam guide bullets (rev. 30 Oct 2025), the four
// case studies and the Well-Architected Framework. Counts are weighted to the real section
// percentages. These train reasoning; they are not real exam wording.
//   t  = blueprint topic id (section derives from it)
//   a  = array of correct option indices (length > 1 ⇒ multi-select)
//   cs = case study id this leans on, or null
window.QUESTIONS = [

  /* ===================== §1.1 — business requirements (8) ===================== */
  {
    id: 'q001', t: '1.1', a: [1], cs: null,
    q: 'A retailer must keep its storefront serving during a full regional outage. Leadership will fund it, but wants the cheapest option that satisfies "no customer-visible downtime". Which requirement type is "no customer-visible downtime during a regional outage"?',
    o: ['A functional requirement, because it describes what the system does',
        'A non-functional requirement, because it constrains how well the system must behave',
        'A business requirement, because leadership approved the budget',
        'A compliance requirement, because outages must be reported'],
    why: 'Functional = what the system does (place an order). Non-functional = qualities and constraints (availability, latency, throughput, durability). Availability targets are the classic non-functional requirement, and the exam expects you to sort a case study\'s requirements into these buckets before choosing services.'
  },
  {
    id: 'q002', t: '1.1', a: [2], cs: null,
    q: 'A CFO asks you to justify a migration in terms she can defend to the board. Which pairing best expresses the financial shift from running your own datacenter to Google Cloud?',
    o: ['OpEx to CapEx, because you now pay for reserved capacity up front',
        'CapEx to CapEx, because hardware is still being purchased, just by Google',
        'CapEx to OpEx, because up-front hardware purchases become ongoing consumption charges',
        'Neither, because TCO is unchanged by the delivery model'],
    why: 'Owning datacenter hardware is capital expenditure — large, up-front, depreciated. Cloud consumption is operating expenditure — ongoing, variable, expensed in-period. This CapEx→OpEx shift is the standard board-level framing and appears explicitly in §4.2.'
  },
  {
    id: 'q003', t: '1.1', a: [0, 3], cs: null,
    q: 'You are defining success measurements for a customer-facing API modernization. Which two are genuine KPIs rather than vanity metrics? (Choose two.)',
    o: ['p99 request latency for the checkout endpoint',
        'Number of microservices deployed',
        'Lines of Terraform written',
        'Percentage of support tickets resolved without human escalation'],
    why: 'A KPI must connect to a business or user outcome and be actionable. Latency at a high percentile and self-service resolution rate both do. Service counts and lines of code measure activity, not outcome — the exam consistently rewards outcome metrics.'
  },
  {
    id: 'q004', t: '1.1', a: [3], cs: null,
    q: 'An enterprise runs a heavily customized, 15-year-old payroll system. It works, is not a differentiator, and a mature SaaS equivalent exists. Which workload disposition strategy fits best?',
    o: ['Build — rewrite it cloud-native to gain full control',
        'Modify — replatform it onto GKE with minimal changes',
        'Deprecate — switch it off and absorb the process manually',
        'Buy — replace it with the SaaS product'],
    why: 'Workload disposition (build / buy / modify / deprecate) turns on whether the workload differentiates the business. Payroll is undifferentiated commodity function with a mature market, so buy. Rewriting spends scarce engineering on something that earns no competitive advantage.'
  },
  {
    id: 'q005', t: '1.1', a: [1], cs: 'ehr',
    q: 'EHR Healthcare must integrate with hospital systems that expose only nightly HL7 batch files, while its new patient portal needs near-real-time record updates. Which integration pattern best bridges the two?',
    o: ['Point-to-point synchronous API calls from the portal to each hospital system',
        'Land the batch files in Cloud Storage, publish an event per file, and process asynchronously into the portal\'s datastore',
        'Have the portal query the hospital systems directly at read time',
        'Replicate each hospital database into the portal database with synchronous writes'],
    why: 'You cannot make a nightly-batch source behave synchronously. Landing files in object storage and fanning out events decouples the cadences, absorbs source outages, and gives you replay. Synchronous coupling to a batch system makes portal availability depend on every hospital system.'
  },
  {
    id: 'q006', t: '1.1', a: [2], cs: null,
    q: 'Your business continuity plan states RPO = 15 minutes and RTO = 4 hours for a core database. What does this actually commit you to?',
    o: ['Restore within 15 minutes, losing at most 4 hours of data',
        'Detect the failure within 15 minutes and finish the postmortem within 4 hours',
        'Lose at most 15 minutes of data, and be serving again within 4 hours',
        'Take a backup every 4 hours and test restores every 15 minutes'],
    why: 'RPO (recovery point) bounds acceptable data loss — it drives backup and replication frequency. RTO (recovery time) bounds how long you may be down — it drives standby capacity and automation. Reversing them is the single most common error on this topic.'
  },
  {
    id: 'q007', t: '1.1', a: [0], cs: null,
    q: 'A workload has steady baseline demand plus unpredictable spikes to 5x. Cost must be minimized without risking spike capacity. What is the strongest commitment strategy?',
    o: ['Cover the steady baseline with committed use discounts and absorb spikes with on-demand capacity',
        'Commit to peak capacity so spikes are always covered at a discount',
        'Run entirely on Spot VMs to get the deepest discount',
        'Run entirely on-demand to retain maximum flexibility'],
    why: 'Commitments are cheapest per unit but you pay whether or not you use them, so you commit only to demand you are certain of — the baseline. Spikes ride on-demand. Committing to peak wastes the difference year-round; all-Spot risks eviction on a customer-facing path.'
  },
  {
    id: 'q008', t: '1.1', a: [1], cs: 'altostrat',
    q: 'Altostrat wants generative-AI personalized recommendations across a large audio/video library. Which consideration should most shape the initial architecture decision?',
    o: ['Which programming language the recommendation service uses',
        'Where the content metadata already lives and how it can be made available to the model as grounding data',
        'Whether to use a global or regional load balancer for the API',
        'How many Cloud Tasks queues the pipeline will need'],
    why: 'Generative recommendation quality is dominated by grounding — getting authoritative, current data to the model. Altostrat already warehouses behavioural and metadata signals in BigQuery, so data access and freshness drive the design. Language and load balancer choice are downstream details.'
  },

  /* ===================== §1.2 — technical requirements (5) ===================== */
  {
    id: 'q009', t: '1.2', a: [2], cs: null,
    q: 'A stateless web tier must survive the loss of an entire zone with no manual intervention. What is the minimum viable design?',
    o: ['A single zonal managed instance group with autohealing enabled',
        'Two VMs in the same zone behind an internal passthrough load balancer',
        'A regional managed instance group spanning multiple zones behind a load balancer',
        'A zonal instance group plus nightly snapshots to another zone'],
    why: 'Surviving zone loss requires capacity in more than one zone. A regional MIG distributes instances across zones and recreates lost capacity automatically. Autohealing only restarts unhealthy instances — it cannot help when the whole zone is gone, and snapshots address data loss, not availability.'
  },
  {
    id: 'q010', t: '1.2', a: [0], cs: null,
    q: 'Global users report slow first-byte times on a read-heavy site whose origin is in us-central1. Content is largely static. What gives the largest latency improvement for the least change?',
    o: ['Put a global external Application Load Balancer with Cloud CDN in front of the origin',
        'Migrate the origin to Spanner for global reads',
        'Increase the origin instance machine size',
        'Add a regional internal Application Load Balancer in each region'],
    why: 'For static, read-heavy content the win comes from serving from an edge location near the user, which is exactly Cloud CDN behind a global external Application LB with anycast. Scaling up the origin does not reduce distance, and an internal LB is not internet-facing.'
  },
  {
    id: 'q011', t: '1.2', a: [1], cs: null,
    q: 'You need to understand the Well-Architected Framework pillar that governs monitoring, incident response, automation and release practice. Which pillar is it?',
    o: ['Reliability', 'Operational excellence', 'Performance optimization', 'Security'],
    why: 'Operational excellence covers how you run and evolve the system: observability, incident management, automation, deployment practice. Reliability is about meeting availability and resilience goals. §6.1 asks specifically for the operational excellence pillar, so read it directly.'
  },
  {
    id: 'q012', t: '1.2', a: [3], cs: null,
    q: 'Which statement about a Cloud SQL instance configured for high availability is correct?',
    o: ['It serves reads from the standby to double read throughput',
        'It replicates across regions by default for regional outage protection',
        'It removes the need for backups because the standby is always current',
        'It maintains a standby in another zone in the same region and fails over automatically'],
    why: 'Cloud SQL HA is a zonal-redundancy feature: a synchronous standby in a second zone within the same region, with automatic failover. The standby serves no traffic, so it adds no read capacity, and it protects against zone loss — not region loss and not logical corruption, which is why you still need backups and cross-region replicas.'
  },
  {
    id: 'q013', t: '1.2', a: [0, 2], cs: null,
    q: 'Which two designs specifically protect against accidental or malicious data deletion, as opposed to infrastructure failure? (Choose two.)',
    o: ['Object versioning on the Cloud Storage bucket',
        'A regional managed instance group',
        'A retention policy with a bucket lock',
        'Multi-zone replication of the database'],
    why: 'Replication and multi-zone deployment copy whatever you do, including a delete — they address infrastructure failure. Versioning preserves superseded and deleted object generations, and a locked retention policy prevents deletion outright, even by an administrator. The exam repeatedly separates durability from protection against human error.'
  },

  /* ===================== §1.3 — network/storage/compute selection (8) ===================== */
  {
    id: 'q014', t: '1.3', a: [2], cs: null,
    q: 'A financial application needs a relational schema, strongly consistent transactions across three continents, and horizontal write scale beyond a single machine. Which service fits?',
    o: ['Cloud SQL with cross-region read replicas',
        'Bigtable with a multi-cluster routing policy',
        'Spanner with a multi-region instance configuration',
        'Firestore in Native mode'],
    why: 'Only Spanner delivers relational semantics, external (strong) consistency and horizontal write scale globally. Cloud SQL read replicas are asynchronous and writes stay on one primary. Bigtable is not relational and offers no cross-row ACID transactions at that scope. Firestore is a document store.'
  },
  {
    id: 'q015', t: '1.3', a: [1], cs: null,
    q: 'An IoT fleet writes 800,000 sensor readings per second, queried almost always by device ID and time range. Which storage service is the best fit?',
    o: ['BigQuery, because it handles petabyte scale',
        'Bigtable, because it gives high write throughput with row-key range scans',
        'Cloud SQL, because readings are structured',
        'Firestore, because devices are documents'],
    why: 'This is the canonical Bigtable profile: enormous sustained write throughput, single-digit millisecond latency, and access by a row key you design as deviceID#timestamp. BigQuery is an analytical warehouse, not a high-rate operational write sink, and Cloud SQL cannot absorb that write volume.'
  },
  {
    id: 'q016', t: '1.3', a: [3], cs: null,
    q: 'A mobile app needs offline data access on the device, automatic sync when connectivity returns, and real-time listeners pushing changes to clients. Which service is designed for this?',
    o: ['Cloud SQL with a REST API in front', 'Bigtable', 'Memorystore for Redis', 'Firestore'],
    why: 'Firestore\'s client SDKs provide offline persistence, transparent sync on reconnect, and real-time snapshot listeners — features that live in the datastore, not in your code. Reaching the other options from a mobile client means building all of that yourself.'
  },
  {
    id: 'q017', t: '1.3', a: [1], cs: null,
    q: 'Compliance requires archived records be retained seven years, retrievable within milliseconds when auditors ask, and accessed at most once a year. Which storage class minimizes cost?',
    o: ['Nearline', 'Archive', 'Coldline', 'Standard'],
    why: 'All Cloud Storage classes serve first byte in milliseconds — the classes differ in storage price, retrieval cost and minimum storage duration, not latency. Yearly access with a seven-year horizon matches Archive (365-day minimum). Candidates often wrongly reject Archive believing it is slow, confusing it with tape.'
  },
  {
    id: 'q018', t: '1.3', a: [0], cs: null,
    q: 'A team wants to run an existing containerized HTTP service with no cluster to operate, scale to zero between bursts, and pay only per request. Which platform fits best?',
    o: ['Cloud Run', 'GKE Standard', 'Compute Engine with a managed instance group', 'App Engine flexible environment'],
    why: 'Cloud Run runs containers as a fully managed request-driven service, scales to zero, and bills per use — no nodes, no cluster. GKE Standard means operating a cluster; a MIG means operating VMs; App Engine flexible runs on always-warm VM instances that do not scale to zero.'
  },
  {
    id: 'q019', t: '1.3', a: [2], cs: null,
    q: 'A batch rendering job runs for six hours, is fully checkpointed, and can restart any unit of work safely. Cost is the dominant concern. Which compute choice is best?',
    o: ['Standard on-demand VMs in a regional MIG',
        'Sole-tenant nodes for predictable performance',
        'Spot VMs, with the job resuming from checkpoints after eviction',
        'A 3-year committed use discount on standard VMs'],
    why: 'Spot VMs are the deepest discount available and can be reclaimed at any time — acceptable precisely because the workload is checkpointed and restartable. The exam signals Spot with words like "fault-tolerant", "batch", "restartable" or "checkpointed". Commitments suit steady long-lived demand, not intermittent batch.'
  },
  {
    id: 'q020', t: '1.3', a: [1], cs: null,
    q: 'A licensed database product is billed per physical core and the vendor forbids running it on shared hardware. You still want it on Google Cloud. What do you use?',
    o: ['Custom machine types sized to the licence', 'Sole-tenant nodes', 'Spot VMs to reduce licence cost', 'GKE Autopilot with resource limits'],
    why: 'Sole-tenant nodes give you a dedicated physical host with no other tenants, which is what per-physical-core and dedicated-hardware licence terms require, and they let you bring your own licence. Custom machine types only shape vCPU and memory; they do not guarantee physical isolation.'
  },
  {
    id: 'q021', t: '1.3', a: [2], cs: null,
    q: 'A managed service must be reachable privately from your VPC, using internal IP addresses only, with no traffic traversing the internet and no VPC peering address-range conflicts. Which feature do you use?',
    o: ['Cloud NAT', 'VPC Network Peering', 'Private Service Connect', 'Shared VPC'],
    why: 'Private Service Connect exposes a service through an endpoint with an internal IP in your own VPC, so you consume it privately without peering and without importing the producer\'s address ranges. Peering would join address spaces and can collide; Cloud NAT is for egress; Shared VPC is about sharing one network across projects.'
  },

  /* ===================== §1.4 — migration (3) ===================== */
  {
    id: 'q022', t: '1.4', a: [0], cs: null,
    q: 'A legacy monolith on ageing VMs must leave the datacenter in eight weeks because the lease expires. There is no time to redesign. Which migration approach fits?',
    o: ['Rehost (lift and shift) onto Compute Engine, then modernize afterwards',
        'Refactor into microservices on GKE before migrating',
        'Repurchase by finding a SaaS replacement',
        'Retire the application and rebuild cloud-native'],
    why: 'A hard external deadline with no redesign time is the textbook rehost signal: move the workload as-is to get out of the datacenter, then modernize once the pressure is off. Refactoring first couples an unmovable deadline to an open-ended engineering effort.'
  },
  {
    id: 'q023', t: '1.4', a: [1], cs: null,
    q: 'Before migrating 400 servers you need an inventory, dependency map and TCO comparison to build the business case. Which Google Cloud service is intended for this assessment phase?',
    o: ['Database Migration Service', 'Migration Center', 'Transfer Appliance', 'Migrate to Virtual Machines'],
    why: 'Migration Center is the assessment and planning tool: discovery, inventory, dependency mapping and TCO modelling. The others execute a migration — Migrate to Virtual Machines moves VMs, DMS moves databases, Transfer Appliance ships bulk offline data.'
  },
  {
    id: 'q024', t: '1.4', a: [3], cs: null,
    q: 'You must move 900 TB from an on-premises NAS to Cloud Storage. The site has a 500 Mbps internet link that production also uses. What is the most practical approach?',
    o: ['Storage Transfer Service over the existing internet link',
        'gsutil rsync run in parallel from several hosts',
        'Provision a 10 Gbps Dedicated Interconnect for the duration of the transfer',
        'Use Transfer Appliance to ship the data physically'],
    why: '900 TB over a shared 500 Mbps link needs roughly six months of saturated bandwidth, which is not viable. Transfer Appliance exists for exactly this: bulk data shipped physically. Recognise the pattern by comparing data volume against available bandwidth and time budget before choosing.'
  },

  /* ===================== §1.5 — future improvements (1) ===================== */
  {
    id: 'q025', t: '1.5', a: [1], cs: null,
    q: 'Which design choice best preserves your ability to adopt future managed services rather than locking the architecture in place?',
    o: ['Embedding provider-specific logic directly in business code for efficiency',
        'Keeping integration behind well-defined interfaces and using managed services through standard protocols',
        'Standardizing on self-managed open-source software on VMs everywhere',
        'Deferring all architectural decisions until requirements are fully certain'],
    why: 'A cloud-first posture with clean interface boundaries lets you swap implementations as the platform evolves without rewriting business logic. Self-managing everything on VMs forfeits managed-service improvements, and deferring decisions indefinitely is paralysis, not flexibility.'
  },

  /* ===================== §2.1 — network topologies (5) ===================== */
  {
    id: 'q026', t: '2.1', a: [2], cs: null,
    q: 'You need 99.99% availability on a private 10 Gbps connection between an on-premises datacenter and your VPC. Your facility is in a colocation site where Google is present. What do you provision?',
    o: ['A single Dedicated Interconnect circuit',
        'HA VPN with two tunnels',
        'Redundant Dedicated Interconnect circuits in separate edge availability domains',
        'Partner Interconnect through a service provider'],
    why: 'A single circuit tops out at the 99.9% SLA; the 99.99% figure requires redundant circuits placed in separate edge availability domains. Partner Interconnect is the answer when you cannot reach a colocation facility — here you can. HA VPN reaches 99.99% but runs over the public internet, not a private 10 Gbps link.'
  },
  {
    id: 'q027', t: '2.1', a: [1], cs: null,
    q: 'A team asks for Direct Peering so their VMs can reach an on-premises database privately. Why is this the wrong tool?',
    o: ['Direct Peering has no SLA, so it cannot be used in production',
        'Direct Peering provides access to Google public IP addresses, not private connectivity into your VPC',
        'Direct Peering supports only egress traffic',
        'Direct Peering requires a Partner Interconnect underneath it'],
    why: 'Direct and Carrier Peering give optimized reach to Google public endpoints; they do not attach to your VPC or carry RFC 1918 traffic. Private VPC connectivity requires Cloud VPN or Interconnect. This distinction is a favourite exam trap.'
  },
  {
    id: 'q028', t: '2.1', a: [0], cs: null,
    q: 'Central networking must own subnets, routes and firewall rules, while application teams deploy into their own projects using that network. Which design does this?',
    o: ['Shared VPC, with a host project owning the network and service projects attached',
        'VPC Network Peering between each application project and a central project',
        'A separate VPC per application project with Cloud VPN between them',
        'One project containing every application and a single VPC'],
    why: 'Shared VPC centralizes network administration in a host project while service projects run resources on those subnets — the standard separation-of-duties network pattern. Peering keeps network administration decentralized in each project, and one shared project destroys workload isolation.'
  },
  {
    id: 'q029', t: '2.1', a: [3], cs: null,
    q: 'A UDP-based game server must receive traffic while seeing the real client source IP address. Which load balancer do you use?',
    o: ['Global external Application Load Balancer',
        'Regional external Application Load Balancer',
        'Global external proxy Network Load Balancer',
        'External passthrough Network Load Balancer'],
    why: 'Only passthrough load balancing forwards packets without terminating the connection, so the original source IP survives and non-TCP protocols like UDP work. Application load balancers are L7 HTTP(S) proxies; proxy Network LBs terminate TCP and replace the source IP.'
  },
  {
    id: 'q030', t: '2.1', a: [1], cs: null,
    q: 'Private GKE nodes with no external IP addresses must download patches from a public repository. What do you configure?',
    o: ['A firewall rule allowing egress to 0.0.0.0/0',
        'Cloud NAT for the subnet',
        'Private Google Access on the subnet',
        'An external passthrough Network Load Balancer'],
    why: 'Cloud NAT gives instances without external IPs outbound internet connectivity, with no inbound path opened. A firewall rule permits traffic but provides no address translation, so packets have no return route. Private Google Access reaches Google APIs only, not arbitrary public repositories.'
  },

  /* ===================== §2.2 — storage configuration (3) ===================== */
  {
    id: 'q031', t: '2.2', a: [2], cs: null,
    q: 'Logs must be immediately queryable for 30 days, cheaply retained for a year, and deleted after that, with no operational effort. What do you configure?',
    o: ['A Cloud Function on a schedule that rewrites and deletes objects',
        'Separate buckets per tier with an application that writes to the right one',
        'One bucket with lifecycle rules transitioning Standard to Nearline at 30 days and deleting at 365 days',
        'Autoclass, which deletes objects when they stop being accessed'],
    why: 'Object lifecycle management performs class transitions and deletions declaratively, at no operational cost. Custom code re-implements a platform feature and can fail silently. Autoclass moves objects between classes based on access patterns but never deletes them, so it cannot satisfy the 365-day requirement.'
  },
  {
    id: 'q032', t: '2.2', a: [0], cs: null,
    q: 'A compute-intensive analytics cluster needs a shared POSIX filesystem mounted by many VMs simultaneously with low latency. Which service fits?',
    o: ['Filestore', 'Cloud Storage with gcsfuse', 'Persistent Disk in multi-writer mode', 'Bigtable'],
    why: 'Filestore is managed NFS: a genuine shared POSIX filesystem for concurrent mounts. gcsfuse presents object storage as files but does not give real POSIX semantics or comparable latency, and Persistent Disk multi-writer is narrowly scoped, not a general shared filesystem.'
  },
  {
    id: 'q033', t: '2.2', a: [1], cs: null,
    q: 'Which practice most directly limits the blast radius of a compromised application service account against Cloud Storage data?',
    o: ['Enabling object versioning on all buckets',
        'Granting the service account a role scoped to only the specific buckets it needs',
            'Using CMEK instead of Google-managed encryption keys',
        'Enabling uniform bucket-level access'],
    why: 'Blast radius is an authorization question: scope the grant to only the resources required, so a stolen identity reaches nothing else. Versioning aids recovery after the fact, CMEK changes key custody without narrowing access, and uniform bucket-level access simplifies the model without reducing scope by itself.'
  },

  /* ===================== §2.3 — compute configuration (4) ===================== */
  {
    id: 'q034', t: '2.3', a: [1], cs: null,
    q: 'A team wants Kubernetes without managing nodes, node pools or capacity, and wants to pay for pod resource requests rather than provisioned nodes. What do you recommend?',
    o: ['GKE Standard with cluster autoscaling and node auto-provisioning',
        'GKE Autopilot',
        'Cloud Run with a sidecar container',
        'Compute Engine with a managed instance group running kubelet'],
    why: 'Autopilot is GKE\'s node-less mode: Google provisions and manages nodes, and you are billed for pod resource requests. GKE Standard with autoscaling still leaves you owning node pools, upgrades and capacity decisions even though scaling is automated.'
  },
  {
    id: 'q035', t: '2.3', a: [2], cs: null,
    q: 'A Cloud Run service must reach a Cloud SQL instance that has only a private IP address. What do you configure?',
    o: ['Cloud NAT on the Cloud Run service',
        'A public IP on the Cloud SQL instance restricted by authorized networks',
        'Direct VPC egress or a Serverless VPC Access connector so the service can reach the VPC',
        'A VPC firewall rule allowing ingress from Cloud Run'],
    why: 'Serverless workloads sit outside your VPC by default; reaching private IPs requires attaching them to the network via Direct VPC egress or a Serverless VPC Access connector. Adding a public IP moves the resource onto the internet — the opposite of the requirement.'
  },
  {
    id: 'q036', t: '2.3', a: [0], cs: null,
    q: 'Which statement about Spot VMs is correct?',
    o: ['They can be reclaimed by Compute Engine at any time and have no maximum runtime',
        'They are guaranteed to run for 24 hours before preemption',
        'They cannot be used in managed instance groups',
        'They provide the same availability SLA as standard VMs at a lower price'],
    why: 'Spot VMs are deeply discounted and may be reclaimed whenever Compute Engine needs the capacity, with no runtime limit — the 24-hour cap belonged to the older preemptible VM model. They carry no availability SLA, which is why they suit only interruption-tolerant work.'
  },
  {
    id: 'q037', t: '2.3', a: [3], cs: null,
    q: 'An enterprise must migrate hundreds of VMware virtual machines quickly, keeping existing VMware tooling and operational practices intact. What fits best?',
    o: ['Rewrite each workload for GKE',
        'Migrate to Virtual Machines, converting each VM to Compute Engine',
        'Cloud Run for each application tier',
        'Google Cloud VMware Engine'],
    why: 'VMware Engine runs a native VMware stack on Google Cloud, so existing tooling, vSphere skills and operational practice carry over with minimal change. Converting to Compute Engine abandons that tooling, and rewriting for containers is a far longer programme than the requirement allows.'
  },

  /* ===================== §2.4 — agent platform / ML workflows (3) ===================== */
  {
    id: 'q038', t: '2.4', a: [1], cs: null,
    q: 'A data science team hands you a training workflow that runs as a chain of manual notebook steps. It must become repeatable, scheduled, and auditable with lineage across preprocessing, training, evaluation and deployment. What do you recommend?',
    o: ['A Cloud Scheduler job that executes each notebook in sequence',
        'An ML pipeline that defines each step as a component, producing tracked artifacts and lineage between runs',
        'A single long-running VM that executes the notebooks nightly',
        'Cloud Run functions triggered by Cloud Storage events between each step'],
    why: 'Pipelines exist to make the ML lifecycle reproducible and auditable: steps become versioned components, inputs and outputs become tracked artifacts, and runs are comparable. Chaining notebooks by scheduler or event glue gives you automation without lineage, caching or reproducibility. (Note: this capability moved under the Gemini Enterprise Agent Platform in the 2026 rebrand of Vertex AI — verify current product naming against live docs.)'
  },
  {
    id: 'q039', t: '2.4', a: [2], cs: null,
    q: 'You must train a very large transformer model. The framework supports XLA compilation and the workload is dominated by large dense matrix operations at scale. Which accelerator choice is most appropriate?',
    o: ['CPU instances with many vCPUs, to avoid accelerator cost',
        'A single high-memory GPU instance',
        'TPUs, which target large-scale matrix-heavy training with XLA-based frameworks',
        'Spot GPU instances, because training is restartable'],
    why: 'TPUs are purpose-built for exactly this profile — very large matrix computation via XLA-compiled frameworks — and scale efficiently across pods. GPUs remain the right answer for broader framework and CUDA-kernel compatibility or more varied workloads. Match the accelerator to framework support and operation profile, not to price alone.'
  },
  {
    id: 'q040', t: '2.4', a: [0, 3], cs: null,
    q: 'Which two decisions most affect the cost of a large, long-running model training programme? (Choose two.)',
    o: ['The consumption model chosen — on-demand, reservations, commitments or Spot capacity',
            'The programming language of the training script',
        'The name of the storage bucket holding checkpoints',
        'Whether the job checkpoints frequently enough to survive interruption on discounted capacity'],
    why: 'Accelerator cost dominates training budgets, so how you buy that capacity is the primary lever. Checkpointing is what makes cheaper interruptible capacity usable at all — without it you cannot safely take the discount. Language and bucket naming are immaterial to cost.'
  },

  /* ===================== §2.5 — prebuilt AI APIs (3) ===================== */
  {
    id: 'q041', t: '2.5', a: [1], cs: null,
    q: 'A retailer wants to extract product attributes and detect unsafe content from millions of supplier-submitted photos. There is no ML team and no labelled training data. What is the fastest sound approach?',
    o: ['Train a custom image classification model from scratch',
        'Use the prebuilt Vision API for label detection and safe-search classification',
        'Fine-tune a foundation model on the supplier images',
        'Have a human review queue classify every image'],
    why: 'Prebuilt AI APIs solve common perception tasks with no training data and no ML expertise — label detection and safe-search are stock Vision API features. Custom training and fine-tuning both require labelled data and expertise you do not have, and cost far more time.'
  },
  {
    id: 'q042', t: '2.5', a: [2], cs: null,
    q: 'Employees must ask natural-language questions and get answers grounded in the company\'s own internal documents, with citations. Which approach fits the requirement best?',
    o: ['Fine-tune a foundation model on the document corpus each time documents change',
        'Send the entire corpus in the prompt on every request',
        'Use an enterprise search and grounding capability that retrieves from the indexed corpus and cites sources',
        'Use the Conversation API to script dialogue flows over the documents'],
    why: 'Retrieval-based grounding over an indexed corpus keeps answers current as documents change and can cite sources — the requirement here. Fine-tuning teaches style and behaviour, not fresh facts, and re-tuning on every change is impractical. Corpus-in-prompt does not scale past the context window.'
  },
  {
    id: 'q043', t: '2.5', a: [0], cs: null,
    q: 'Before exposing a customer-facing generative assistant, security asks how you will screen prompts and model responses for injection attempts, harmful content and leaked sensitive data. Which pairing addresses this?',
    o: ['Model Armor for prompt and response screening, with Sensitive Data Protection for identifying and de-identifying sensitive data',
        'Cloud Armor for prompt filtering, with VPC Service Controls for response filtering',
        'IAM conditions on the model endpoint, with audit logging',
        'Binary Authorization on the model container, with Artifact Analysis'],
    why: 'Model Armor inspects prompts and responses for injection, jailbreak and harmful content; Sensitive Data Protection finds and de-identifies PII in the data flowing through. Cloud Armor is a network-edge WAF, and Binary Authorization governs which container images may run — neither inspects model traffic.'
  },

  /* ===================== §3.1 — security design (13) ===================== */
  {
    id: 'q044', t: '3.1', a: [2], cs: null,
    q: 'An IAM policy grants roles/storage.objectViewer at the folder level. A project in that folder grants roles/storage.admin to the same user. What is the user\'s effective access to buckets in that project?',
    o: ['Object viewer only, because the folder policy is more restrictive and wins',
        'No access, because conflicting grants cancel out',
        'Storage admin, because IAM policies are the union of inherited and local grants',
        'It depends on which policy was applied most recently'],
    why: 'Allow policies accumulate down the hierarchy — effective permissions are the union of every grant at or above the resource. A narrower grant higher up never subtracts from a broader grant below. Only IAM deny policies (or org policy constraints) can remove access.'
  },
  {
    id: 'q045', t: '3.1', a: [1], cs: null,
    q: 'A CI system running outside Google Cloud must deploy to your projects. Security forbids long-lived service account keys. What do you implement?',
    o: ['A service account key stored in Secret Manager and rotated monthly',
        'Workload Identity Federation, letting the external system exchange its own credential for short-lived Google Cloud credentials',
        'Workload Identity on a GKE cluster',
        'A user account with a strong password and MFA for the CI system'],
    why: 'Workload Identity Federation lets an external identity provider\'s token be exchanged for short-lived Google Cloud credentials, so no key ever exists. Storing a key in Secret Manager still leaves an exportable long-lived credential; Workload Identity applies to Kubernetes service accounts inside GKE.'
  },
  {
    id: 'q046', t: '3.1', a: [3], cs: null,
    q: 'Even with correct IAM, you must stop data in a set of projects from being copied to resources outside your organization by an insider or a stolen credential. What do you implement?',
    o: ['Hierarchical firewall policies across the folders',
        'Organization policy constraints preventing public IP addresses',
        'CMEK on all storage resources',
        'A VPC Service Controls perimeter around the projects'],
    why: 'VPC Service Controls adds a context boundary on top of IAM: even a validly authorized identity cannot move data across the perimeter. IAM answers who may act; VPC-SC answers from where, which is what defeats credential theft and insider exfiltration. Firewalls govern network traffic, not API-level service access.'
  },
  {
    id: 'q047', t: '3.1', a: [0], cs: null,
    q: 'An internal web application must be reachable by employees from anywhere without a VPN, with access decided per-user identity and device posture. What do you use?',
    o: ['Identity-Aware Proxy with context-aware access policies',
        'A VPC firewall rule allowing the corporate IP range',
        'Cloud VPN for every employee device',
        'An internal passthrough Network Load Balancer with private DNS'],
    why: 'IAP enforces identity-based authorization in front of the application, and context-aware access adds device and contextual conditions — the BeyondCorp model, no VPN required. IP allowlisting authenticates a network location rather than a person and breaks for remote work.'
  },
  {
    id: 'q048', t: '3.1', a: [1], cs: null,
    q: 'Organization policy must guarantee that no VM in any project can ever be given an external IP address, regardless of project owners\' IAM permissions. What do you configure?',
    o: ['Remove roles/compute.admin from all project owners',
        'An organization policy constraint denying external IP assignment, applied at the organization node',
        'A hierarchical firewall policy denying all ingress from the internet',
        'A VPC Service Controls perimeter around every project'],
    why: 'Organization policy constrains what resource configurations are permitted and applies regardless of IAM — a project owner with full permissions still cannot violate it. Removing roles is fragile because they can be re-granted; firewall rules block traffic but the external IP would still be assigned.'
  },
  {
    id: 'q049', t: '3.1', a: [2], cs: null,
    q: 'Regulators require that your organization control the encryption keys protecting data at rest, with the ability to disable a key and render data unreadable. Which approach fits?',
    o: ['Google-managed default encryption, which already encrypts all data at rest',
        'Client-side encryption before upload, with keys held in a spreadsheet',
        'Customer-managed encryption keys in Cloud KMS, referenced by the storage resources',
        'Customer-supplied encryption keys provided on every API call'],
    why: 'CMEK keeps keys in Cloud KMS under your control, with the ability to rotate, disable or destroy them — disabling makes data undecryptable, which is the "crypto-shredding" control regulators ask for. Default encryption gives you no key control. CSEK also gives control but forces you to supply raw key material on every request, which is far heavier operationally.'
  },
  {
    id: 'q050', t: '3.1', a: [3], cs: null,
    q: 'Only container images built by your CI pipeline and scanned for vulnerabilities may run in production GKE. How do you enforce this at deploy time?',
    o: ['A GKE admission webhook that checks image name prefixes',
        'IAM roles restricting who can deploy to the cluster',
        'Artifact Registry permissions preventing unapproved pushes',
        'Binary Authorization requiring attestations from your build and scan process'],
    why: 'Binary Authorization is the deploy-time gate: images run only if they carry valid attestations from the attestors you designate, so an unsigned image is rejected even by an authorized deployer. Registry permissions and IAM control who pushes and deploys, not what the cluster will admit.'
  },
  {
    id: 'q051', t: '3.1', a: [1], cs: null,
    q: 'A GKE pod needs to read from a Cloud Storage bucket. Which approach follows current best practice?',
    o: ['Mount a service account JSON key as a Kubernetes secret',
        'Use Workload Identity to let the Kubernetes service account impersonate a Google service account',
        'Give the node pool\'s service account project-wide storage admin',
        'Embed the key in the container image and restrict registry access'],
    why: 'Workload Identity binds a Kubernetes service account to a Google service account so pods obtain short-lived credentials with no key material anywhere. Mounted or embedded keys are long-lived and exportable, and broadening the node service account grants every pod on the node the same access.'
  },
  {
    id: 'q052', t: '3.1', a: [0], cs: null,
    q: 'An auditor asks you to demonstrate separation of duties for production database changes. Which design best demonstrates it?',
    o: ['The engineers who author a change cannot approve or apply it; approval and deployment authority sit with different identities',
        'All engineers hold roles/editor so any of them can respond to incidents',
        'A single break-glass account is shared by the on-call rotation',
        'Every change is logged to Cloud Audit Logs and reviewed monthly'],
    why: 'Separation of duties means no single identity can both propose and enact a sensitive change. Splitting authoring from approval and deployment is the control. Broad shared roles are the opposite, and audit logging is detective — valuable, but it records violations rather than preventing them.'
  },
  {
    id: 'q053', t: '3.1', a: [2], cs: null,
    q: 'An engineer needs elevated production access for a two-hour incident investigation, after which it must disappear automatically. What do you use?',
    o: ['A permanent grant of the required role, removed manually afterwards',
        'A second highly privileged user account for incidents',
        'A time-bound just-in-time entitlement that grants the role for a limited window with approval and audit',
        'Adding the engineer to a group that holds roles/owner'],
    why: 'Just-in-time, time-bound privileged access — Privileged Access Manager entitlements — grants elevated roles for a bounded window with approval and an audit trail, and expires without human action. Manual removal is the control that gets forgotten, which is how standing privilege accumulates.'
  },
  {
    id: 'q054', t: '3.1', a: [1, 3], cs: null,
    q: 'Which two statements correctly distinguish IAM from organization policy? (Choose two.)',
    o: ['Organization policy grants permissions to principals; IAM restricts resource configuration',
        'IAM determines who can do what; organization policy determines what configurations are allowed',
        'Both are evaluated only at the project level',
        'Organization policy applies even to principals holding the Owner role'],
    why: 'IAM is about principals and permissions; organization policy is a guardrail on resource configuration that binds regardless of how much IAM authority a principal holds. Both attach to the resource hierarchy at organization, folder or project level — not projects only.'
  },
  {
    id: 'q055', t: '3.1', a: [0], cs: 'ehr',
    q: 'EHR Healthcare stores protected health information and must ensure engineers debugging a production issue never see real patient identifiers in exported log or analytics datasets. What do you implement?',
    o: ['Sensitive Data Protection to inspect and de-identify sensitive fields before the data reaches the analysis dataset',
        'CMEK on the analytics dataset so data is encrypted at rest',
        'A VPC Service Controls perimeter around the analytics project',
        'Uniform bucket-level access on the log export bucket'],
    why: 'The requirement is that identifiers not be present in the data engineers legitimately access, which means de-identification — inspection, masking, tokenization or redaction — before it lands. Encryption and perimeters restrict who and where, but an authorized engineer inside the boundary still reads plaintext PHI.'
  },
  {
    id: 'q056', t: '3.1', a: [2], cs: null,
    q: 'Which resource hierarchy design best supports environment isolation with centrally enforced guardrails?',
    o: ['One project containing all environments, separated by resource labels',
        'One project per application, with environments separated by IAM conditions',
        'Separate folders for production and non-production, each containing per-application projects, with policies applied at the folder level',
        'A separate organization for each environment'],
    why: 'The project is the isolation boundary for resources, billing and IAM, and folders let you apply IAM and organization policy to whole environments at once. Labels are metadata and enforce nothing. Separate organizations fragment identity and billing administration for no isolation benefit.'
  },

  /* ===================== §3.2 — compliance (5) ===================== */
  {
    id: 'q057', t: '3.2', a: [1], cs: null,
    q: 'A European customer requires that its data be stored and processed only within the EU, with technical enforcement rather than a written promise. What do you use?',
    o: ['A regional Cloud Storage bucket in europe-west1 and a code review policy',
        'An organization policy constraint restricting resource locations, combined with Assured Workloads for the regulated environment',
        'CMEK with keys in a European key ring',
        'VPC Service Controls limiting API access to European IP ranges'],
    why: 'The resource location organization policy constraint prevents resources being created outside permitted regions, and Assured Workloads adds data residency and personnel controls for regulated regimes. Choosing a European region for one bucket does not stop the next resource landing elsewhere, and key location does not constrain where data is stored.'
  },
  {
    id: 'q058', t: '3.2', a: [2], cs: null,
    q: 'An application will handle payment card data. Which architectural decision most reduces PCI DSS scope?',
    o: ['Encrypt card numbers with CMEK and store them in your primary database',
        'Store card numbers in a separate project with restricted IAM',
        'Never store card data — tokenize through a compliant payment provider so systems hold only tokens',
        'Store card data in BigQuery with column-level security'],
    why: 'PCI scope follows the cardholder data environment: every system that stores, processes or transmits card data is in scope. Tokenizing at a compliant provider means your systems hold non-sensitive tokens, collapsing scope. Encrypting or isolating stored card data reduces risk but keeps you in scope.'
  },
  {
    id: 'q059', t: '3.2', a: [0], cs: null,
    q: 'Which log type must you specifically ensure is retained to prove who accessed sensitive data during an audit?',
    o: ['Cloud Audit Logs — Data Access logs',
        'Cloud Audit Logs — Admin Activity logs',
        'VPC Flow Logs',
        'Application logs written by the service'],
    why: 'Admin Activity logs record configuration changes and are always on; Data Access logs record reads of user data and are mostly disabled by default because of volume, so proving data access requires enabling and retaining them deliberately. Flow logs show network conversations, not which identity read which record.'
  },
  {
    id: 'q060', t: '3.2', a: [3], cs: null,
    q: 'A product will be used by children under 13 in the United States. Which regulation most directly governs your data handling design?',
    o: ['HIPAA', 'PCI DSS', 'GDPR', 'COPPA'],
    why: 'COPPA governs collection of personal information from children under 13 and drives parental consent, data minimization and retention limits. The exam guide names children\'s privacy explicitly, so recognize the trigger. HIPAA covers protected health information and PCI DSS covers cardholder data.'
  },
  {
    id: 'q061', t: '3.2', a: [1], cs: null,
    q: 'Your organization must produce SOC 2 evidence continuously rather than scrambling before each audit. What is the sound architectural approach?',
    o: ['Take manual screenshots of console settings each quarter',
        'Export audit logs and configuration state to a durable, access-controlled store and monitor controls continuously',
        'Rely on Google Cloud\'s own SOC 2 report to cover your controls',
        'Restrict console access so fewer changes need evidencing'],
    why: 'Continuous compliance means control state and audit trails are captured automatically and durably so evidence is a query, not a project. Google\'s certifications cover Google\'s infrastructure only — under the shared responsibility model your own configuration and access controls remain yours to evidence.'
  },

  /* ===================== §4.1 — technical processes (8) ===================== */
  {
    id: 'q062', t: '4.1', a: [2], cs: null,
    q: 'A business tolerates roughly a day of downtime and up to an hour of data loss after a regional disaster, and wants the lowest possible standing cost. Which DR pattern fits?',
    o: ['Multi-site active-active across two regions',
        'Warm standby with a scaled-down replica running continuously',
        'Backup and restore, with backups replicated to a second region',
        'Cold standby with infrastructure defined but not deployed'],
    why: 'A day of RTO is generous enough that restoring into freshly provisioned infrastructure is viable, and cross-region backups at the right frequency satisfy a one-hour RPO. Standby patterns buy shorter RTO at continuous cost you do not need here. Match the pattern to the stated RTO/RPO rather than to instinct.'
  },
  {
    id: 'q063', t: '4.1', a: [0], cs: null,
    q: 'What most reliably distinguishes a DR plan that will work from one that will not?',
    o: ['It is tested regularly, including a real failover and failback',
        'It is documented in detail and approved by leadership',
        'It specifies aggressive RTO and RPO targets',
        'It replicates data to three regions instead of two'],
    why: 'Untested DR plans fail in practice — stale runbooks, missing dependencies, permissions nobody holds, restores that were never actually attempted. Regular testing including failback is the control that converts intent into capability. Documentation and ambitious targets are worthless unexercised.'
  },
  {
    id: 'q064', t: '4.1', a: [1], cs: null,
    q: 'Which deployment strategy lets you expose a new version to a small fraction of real users, observe metrics, and roll back with minimal impact?',
    o: ['Blue/green', 'Canary', 'Recreate', 'Rolling update'],
    why: 'Canary shifts a small traffic percentage to the new version so real-user signals arrive before full exposure, bounding blast radius. Blue/green switches all traffic at once between two full environments — fast rollback, but no partial exposure. Recreate incurs downtime; rolling replaces instances without a traffic-percentage control.'
  },
  {
    id: 'q065', t: '4.1', a: [3], cs: null,
    q: 'Which practice best supports rapid root cause analysis of a production incident spanning several microservices?',
    o: ['Increasing log verbosity to debug level across all services permanently',
        'Having each team keep its own dashboard in its own tool',
        'Storing logs only on the instances that produced them',
        'Propagating a trace context across service boundaries so requests can be followed end to end'],
    why: 'Distributed tracing with a propagated context lets you follow one request across every hop and see where latency or errors originate — the fastest path to cause in a microservice architecture. Permanent debug logging buries signal in noise, and fragmented tooling or instance-local logs prevent correlation entirely.'
  },
  {
    id: 'q066', t: '4.1', a: [0], cs: null,
    q: 'Which testing approach validates that your infrastructure-as-code produces the intended configuration before it reaches production?',
    o: ['Policy validation against the planned changes in the CI pipeline, plus applying to a non-production environment first',
        'Manual console review of production after each apply',
        'Running the apply directly against production during a maintenance window',
        'Relying on the provider to reject invalid configuration'],
    why: 'Shift validation left: evaluate the plan against policy in CI and prove the change in a lower environment before production. Providers reject syntactically invalid input but happily create a valid, compliant-looking, wrong configuration. Post-hoc console review detects problems after users do.'
  },
  {
    id: 'q067', t: '4.1', a: [2], cs: null,
    q: 'Application teams repeatedly provision non-compliant infrastructure. What organizational mechanism most directly addresses this?',
    o: ['Mandatory security training for all engineers each quarter',
        'A review board approving every infrastructure request',
        'A service catalog of pre-approved, compliant infrastructure modules teams provision themselves',
        'Removing infrastructure permissions from application teams entirely'],
    why: 'A curated service catalog makes the compliant path the easy path, preserving self-service while encoding standards in the modules. A review board becomes a bottleneck teams route around, and removing permissions moves the work to a central team without removing the demand.'
  },
  {
    id: 'q068', t: '4.1', a: [1], cs: null,
    q: 'Which pair correctly orders the concepts from measurement to contractual commitment?',
    o: ['SLA → SLO → SLI', 'SLI → SLO → SLA', 'SLO → SLI → SLA', 'SLI → SLA → SLO'],
    why: 'An SLI is the measurement (observed latency, availability). An SLO is your internal target for that indicator. An SLA is the external contract with consequences, normally set looser than the SLO so you have margin. The error budget is what remains of the SLO — 1 minus the target.'
  },
  {
    id: 'q069', t: '4.1', a: [0], cs: null,
    q: 'A team has exhausted its error budget three weeks into the quarter. What is the appropriate response under an error-budget policy?',
    o: ['Pause feature releases and direct effort to reliability work until the budget recovers',
        'Raise the SLO so the budget is no longer exhausted',
        'Continue releasing, since the SLA has not yet been breached',
        'Stop measuring the indicator until the next quarter'],
    why: 'The error budget is a decision mechanism: exhausting it triggers a shift from feature velocity to reliability work. Raising the SLO to make the number look acceptable discards the signal, and continuing to ship until the contractual SLA breaks means customers absorb the risk first.'
  },

  /* ===================== §4.2 — business processes (7) ===================== */
  {
    id: 'q070', t: '4.2', a: [2], cs: null,
    q: 'A migration is technically sound but the operations team has no Kubernetes experience and no plan to gain it. What should you do?',
    o: ['Proceed — the platform is managed, so operational skills matter less',
        'Choose a different technology purely to avoid the training cost',
        'Treat skills readiness as a project risk with an explicit plan: training, staged handover, and possibly a simpler platform for the first phase',
        'Outsource operations permanently to avoid the problem'],
    why: 'Team assessment and skills readiness is an explicit exam consideration. A design the operators cannot run is not a good design, so the gap is surfaced and planned for. Neither ignoring it nor letting it dictate technology unexamined is right — and permanent outsourcing trades a skills gap for a dependency.'
  },
  {
    id: 'q071', t: '4.2', a: [1], cs: null,
    q: 'A major platform change will alter daily workflows for hundreds of employees. Which activity most reduces the risk of adoption failure?',
    o: ['A detailed technical design document circulated before launch',
        'A change management plan with stakeholder communication, training and phased rollout',
        'A hard cutover so nobody keeps using the legacy system',
        'A post-launch survey measuring satisfaction'],
    why: 'Adoption failure is a people problem: it is addressed by communicating early, training users, involving stakeholders and phasing exposure so feedback arrives while change is still possible. A technical document does not reach affected users, and a hard cutover maximizes disruption. Surveys measure the outcome too late.'
  },
  {
    id: 'q072', t: '4.2', a: [0], cs: null,
    q: 'Engineering wants Spanner; finance objects to the cost. As architect, what is the most appropriate way to resolve this?',
    o: ['Frame the decision as an explicit trade-off: what requirement drives Spanner, what a cheaper option would cost in risk or capability, and the price of each',
        'Defer to finance, since cost is the binding constraint',
        'Defer to engineering, since they understand the technical requirements',
        'Escalate to the CTO for a ruling'],
    why: 'Design decision trade-offs are core to the role: make the requirement, the alternatives and the cost of each visible so stakeholders decide with information. Deferring to either side by default abdicates the architect\'s job, and escalating without framing the trade-off just relocates the same undecided question.'
  },
  {
    id: 'q073', t: '4.2', a: [3], cs: null,
    q: 'Monthly cloud spend is rising faster than usage. Which action gives the best early insight into where the waste is?',
    o: ['Set an organization-wide budget alert at the current spend level',
        'Move all workloads to Spot VMs',
        'Negotiate a committed use discount immediately',
        'Attribute costs by project, label and service, then find resources with low utilization'],
    why: 'You cannot optimize what you cannot attribute. Breaking spend down by project, label and service exposes idle and oversized resources — the usual cause of cost growing faster than usage. Committing to discounts before rightsizing locks in waste; budget alerts tell you the total, not the cause.'
  },
  {
    id: 'q074', t: '4.2', a: [1], cs: null,
    q: 'Which statement about business continuity planning versus disaster recovery is correct?',
    o: ['They are interchangeable terms for restoring IT systems',
        'Business continuity covers keeping the whole business operating, including people and processes; disaster recovery is the IT subset that restores technology',
        'Disaster recovery is broader, since it includes business processes',
        'Business continuity applies only to natural disasters'],
    why: 'BCP is the superset: how the organization keeps functioning through disruption, including staff, facilities, suppliers and manual fallbacks. DR is the technology-restoration component within it. The exam tests this distinction because §1.1 and §4.2 both name business continuity.'
  },
  {
    id: 'q075', t: '4.2', a: [2], cs: null,
    q: 'You are asked to reduce compute cost for a workload with stable, predictable 24/7 demand that has run unchanged for two years. What is the highest-value action?',
    o: ['Move it to Spot VMs',
        'Enable an aggressive autoscaler',
        'Rightsize the instances to actual utilization, then apply committed use discounts',
        'Move it to Cloud Run so it scales to zero'],
    why: 'Rightsize first, then commit — committing to oversized capacity locks in the waste for one to three years. Steady 24/7 demand is the ideal commitment profile. Spot is wrong for a continuous production workload, autoscaling adds nothing when demand is flat, and a scale-to-zero platform helps nothing that never idles.'
  },
  {
    id: 'q076', t: '4.2', a: [0], cs: null,
    q: 'Which approach best manages a stakeholder who keeps adding requirements late in the design phase?',
    o: ['Document each new requirement with its cost and schedule impact, and have the stakeholder prioritize against existing scope',
        'Accept the requirements to maintain the relationship',
        'Refuse further changes once design is signed off',
        'Implement them quietly and absorb the effort'],
    why: 'Stakeholder management means making consequences visible and letting the owner choose, rather than silently absorbing scope or blocking it outright. Trade-offs surfaced with cost and schedule attached turn an argument into a prioritization decision.'
  },

  /* ===================== §5.1 — advising teams (6) ===================== */
  {
    id: 'q077', t: '5.1', a: [1], cs: null,
    q: 'Dozens of internal and partner-facing APIs need consistent authentication, rate limiting, versioning, quota enforcement and analytics without each team rebuilding it. What do you recommend?',
    o: ['A shared library every service imports',
        'Apigee as an API management layer in front of the services',
        'A global external Application Load Balancer with Cloud Armor',
        'Cloud Endpoints configured per service'],
    why: 'Apigee is the full API management platform: policy enforcement, developer portal, monetization, quota, analytics and lifecycle management across many APIs. A shared library requires every team to adopt and upgrade it in every language; a load balancer with a WAF handles traffic and threats but not API product management.'
  },
  {
    id: 'q078', t: '5.1', a: [2], cs: null,
    q: 'Which testing type most directly validates that a service meets its latency SLO under expected peak traffic?',
    o: ['Unit testing', 'Integration testing', 'Load testing', 'Penetration testing'],
    why: 'Load testing applies representative traffic at expected volume and measures behaviour against the SLO. Unit and integration tests verify correctness, not performance under concurrency, and penetration testing probes security weaknesses.'
  },
  {
    id: 'q079', t: '5.1', a: [0], cs: null,
    q: 'A team asks how to migrate a 2 TB MySQL database to Cloud SQL with minimal downtime. What do you advise?',
    o: ['Database Migration Service with continuous replication, cutting over once the replica has caught up',
        'A mysqldump export to Cloud Storage and an import during a long maintenance window',
        'Transfer Appliance to ship the data',
        'A one-time snapshot restore into Cloud SQL'],
    why: 'Database Migration Service performs an initial load then streams ongoing changes, so downtime is only the brief cutover. Dump-and-import requires downtime for the entire transfer and load. Transfer Appliance addresses bulk object data, not live database replication.'
  },
  {
    id: 'q080', t: '5.1', a: [3], cs: null,
    q: 'Which practice most improves the reliability of application deployments across many teams?',
    o: ['Requiring a manual approval gate before every production deploy',
        'Deploying only during scheduled monthly windows',
        'Letting each team define its own deployment process for autonomy',
        'A standard automated pipeline with automated tests, progressive rollout and automated rollback'],
    why: 'Automation, progressive exposure and automated rollback shrink both the frequency and the impact of failed deploys. Monthly windows make each release large and risky, and fully divergent per-team processes prevent any shared reliability improvement. Manual gates add latency without catching much.'
  },
  {
    id: 'q081', t: '5.1', a: [1], cs: null,
    q: 'Which is the most appropriate use of an AI assistant such as Gemini Cloud Assist in an operations context?',
    o: ['Granting it authority to apply production changes autonomously',
        'Helping engineers investigate issues, understand configuration and draft changes that humans review before applying',
        'Replacing monitoring and alerting',
        'Making architectural decisions without human involvement'],
    why: 'Assistive tooling accelerates investigation, explanation and drafting while humans retain the decision and the apply. Autonomous production change and unreviewed architectural decisions remove the accountability the architect role exists to hold, and an assistant complements rather than replaces telemetry.'
  },
  {
    id: 'q082', t: '5.1', a: [2], cs: null,
    q: 'A team plans to deploy infrastructure changes by having each engineer run Terraform from a laptop. What is the primary risk to raise?',
    o: ['Terraform runs more slowly on laptops than in CI',
        'Engineers may use different Terraform versions',
        'Uncoordinated state and unreviewed, unaudited changes — concurrent applies can corrupt state and drift from the repository',
        'Laptops may lack sufficient disk space for the provider plugins'],
    why: 'The serious risks are shared-state contention, changes bypassing review, and no audit trail of who applied what. Running applies from a pipeline against remote state with locking fixes all three. Version drift is real but secondary, and performance is irrelevant.'
  },

  /* ===================== §5.2 — programmatic interaction (6) ===================== */
  {
    id: 'q083', t: '5.2', a: [1], cs: null,
    q: 'Developers need to test Pub/Sub and Firestore integration locally without incurring cost or touching shared cloud resources. What do you recommend?',
    o: ['A shared development project every developer uses',
        'The Cloud Emulators for Pub/Sub and Firestore, run locally',
        'Mocking the client libraries in unit tests only',
        'A per-developer cloud project created on demand'],
    why: 'Cloud Emulators run those services locally, giving fast, free, isolated tests against real client-library behaviour. Mocks verify your code but not the service contract. A shared project creates interference between developers; per-developer projects cost more and are slower than local emulation.'
  },
  {
    id: 'q084', t: '5.2', a: [2], cs: null,
    q: 'Which statement about Terraform remote state is correct for a team environment?',
    o: ['Each engineer should keep local state to avoid conflicts',
        'State should be committed to the Git repository so it is versioned',
        'State should live in a shared backend with locking, so concurrent applies cannot corrupt it',
        'State is optional if all resources are tagged'],
    why: 'Remote state with locking is what makes team use safe — one apply at a time, one source of truth. Local state fragments reality across laptops. State must never be committed to Git: it contains sensitive values and Git provides no locking.'
  },
  {
    id: 'q085', t: '5.2', a: [0], cs: null,
    q: 'A script must call Google Cloud APIs from a Compute Engine instance. Which credential approach is best practice?',
    o: ['Attach a service account to the instance and let the client library use Application Default Credentials',
        'Store a service account key file on the instance disk',
        'Use the developer\'s own user credentials via gcloud auth login',
        'Pass an API key as an environment variable'],
    why: 'An attached service account plus Application Default Credentials means the metadata server supplies short-lived tokens automatically, with no key to leak or rotate. Key files and API keys are long-lived static secrets, and user credentials tie a workload\'s access to an individual\'s account.'
  },
  {
    id: 'q086', t: '5.2', a: [3], cs: null,
    q: 'Which practice best handles transient errors when calling Google Cloud APIs at scale?',
    o: ['Retry immediately in a tight loop until the call succeeds',
        'Fail the operation and surface the error to the user',
        'Increase the client timeout so slow calls eventually complete',
        'Retry with exponential backoff and jitter, bounded by a maximum attempt count'],
    why: 'Exponential backoff with jitter spreads retries so clients do not synchronize into a thundering herd against a recovering service, and a bounded attempt count prevents unbounded work. Tight retry loops amplify the outage they are reacting to.'
  },
  {
    id: 'q087', t: '5.2', a: [1], cs: null,
    q: 'Which command-line tool is intended for querying and managing BigQuery from a terminal?',
    o: ['gsutil', 'bq', 'gcloud compute', 'kubectl'],
    why: 'bq is the BigQuery command-line tool. gsutil handles Cloud Storage (with gcloud storage now the recommended successor), gcloud covers most other services, and kubectl targets Kubernetes. The exam expects you to map tool to service without hesitation.'
  },
  {
    id: 'q088', t: '5.2', a: [0], cs: null,
    q: 'What is the main advantage of defining infrastructure as code rather than configuring it through the console?',
    o: ['Changes are reviewable, repeatable and auditable, and environments can be recreated consistently',
        'It is always faster to write code than to click through the console',
        'It removes the need for IAM permissions on the resources',
        'It guarantees the configuration is secure'],
    why: 'IaC brings infrastructure into version control: peer review, history, reproducibility across environments and disaster recovery by re-apply. It does not bypass IAM, is often slower for a one-off change, and encodes whatever configuration you wrote — secure or not.'
  },

  /* ===================== §6 — operations excellence (12) ===================== */
  {
    id: 'q089', t: '6.1', a: [2], cs: null,
    q: 'According to the operational excellence pillar, what should drive the majority of your alerting?',
    o: ['Every anomaly detected in any infrastructure metric',
        'Resource utilization thresholds such as CPU above 80%',
        'Symptoms that indicate users are affected, tied to your SLOs',
        'Log lines containing the word "error"'],
    why: 'Alert on user-visible symptoms against SLO burn, not on causes. High CPU may be healthy; an error line may be benign. Cause-based and anomaly-based alerting generates volume that trains responders to ignore pages, which is how real incidents get missed.'
  },
  {
    id: 'q090', t: '6.1', a: [1], cs: null,
    q: 'Which practice most reflects operational excellence in handling repeated manual operational work?',
    o: ['Documenting the manual runbook in more detail',
        'Automating the toil away, or eliminating the condition that causes it',
        'Rotating the work across the team so nobody is overloaded',
        'Accepting it as the cost of running a complex system'],
    why: 'Toil is manual, repetitive, automatable work that scales with service growth and produces no lasting value. The pillar\'s answer is to automate or eliminate it. Better documentation and fairer rotation make toil more tolerable while letting it keep growing.'
  },
  {
    id: 'q091', t: '6.2', a: [0], cs: null,
    q: 'You must retain audit logs for seven years cheaply while keeping recent logs queryable for operations. What is the standard approach?',
    o: ['A log sink exporting to Cloud Storage with lifecycle rules for long-term retention, while operational logs stay in a log bucket with a shorter retention period',
        'Raise the retention period on the default log bucket to seven years',
        'Export everything to BigQuery and keep it indefinitely',
        'Write logs to a Persistent Disk and snapshot it monthly'],
    why: 'Route logs to the storage whose cost and access profile matches the use: object storage with lifecycle transitions for cheap long retention, log buckets with short retention for operational querying. Seven years in log buckets or BigQuery is far more expensive when the data is almost never read.'
  },
  {
    id: 'q092', t: '6.2', a: [2], cs: null,
    q: 'An application intermittently consumes excessive CPU in production, and you need to know which functions are responsible without reproducing it locally. Which tool fits?',
    o: ['Cloud Logging with increased verbosity', 'Cloud Trace', 'Cloud Profiler', 'Cloud Monitoring uptime checks'],
    why: 'Cloud Profiler continuously samples CPU and memory in production and attributes consumption to functions and call stacks — exactly the "which code is burning CPU" question. Cloud Trace shows latency across request spans, not per-function resource cost, and logging tells you what happened, not where cycles went.'
  },
  {
    id: 'q093', t: '6.2', a: [1], cs: null,
    q: 'You need a Cloud Monitoring alert when a specific error pattern appears in application logs. What do you configure?',
    o: ['A log sink to BigQuery with a scheduled query',
        'A log-based metric on the pattern, with an alerting policy on that metric',
        'An uptime check against the affected endpoint',
        'A budget alert on the project'],
    why: 'A log-based metric turns matching log entries into a time series that alerting policies can evaluate — the standard bridge from Logging to Monitoring. A sink plus scheduled query introduces minutes-to-hours of delay, and an uptime check probes availability rather than a log pattern.'
  },
  {
    id: 'q094', t: '6.2', a: [3], cs: null,
    q: 'Which set of signals is the most useful starting point for monitoring a request-driven service?',
    o: ['CPU, memory, disk and network utilization',
        'Instance count, deploy frequency, and open pull requests',
        'Log volume, log severity distribution, and index size',
        'Latency, traffic, errors and saturation'],
    why: 'The four golden signals — latency, traffic, errors, saturation — describe the service as users experience it and generalize across request-driven systems. Pure utilization metrics are causes rather than symptoms; they matter for diagnosis after a symptom-based alert fires.'
  },
  {
    id: 'q095', t: '6.3', a: [1], cs: null,
    q: 'A release must be reversible within seconds, and you can afford to run two full production environments briefly. Which strategy fits?',
    o: ['Rolling update across the existing instances',
        'Blue/green, switching traffic between two complete environments',
        'Recreate, replacing all instances at once',
        'Canary at 1% for 24 hours'],
    why: 'Blue/green keeps the previous environment intact and fully warm, so rollback is a traffic switch measured in seconds — at the cost of double capacity during the change. A rolling update has no intact previous version to return to, and recreate deliberately incurs downtime.'
  },
  {
    id: 'q096', t: '6.3', a: [2], cs: null,
    q: 'Which practice best decouples deploying code from releasing a feature to users?',
    o: ['Deploying only during scheduled maintenance windows',
        'Maintaining a long-lived release branch per feature',
        'Feature flags that gate behaviour at runtime, so code ships dark and is enabled separately',
        'Blue/green deployment of the whole application'],
    why: 'Feature flags separate the two decisions: code reaches production continuously and unexercised, then the feature is enabled for chosen users independently — with an instant kill switch. Blue/green decouples deployment from downtime, not from feature exposure, and long-lived branches make integration harder.'
  },
  {
    id: 'q097', t: '6.4', a: [0], cs: null,
    q: 'Which practice most improves the quality of incident response for a newly deployed production service?',
    o: ['Runbooks for known failure modes, clear escalation paths and defined on-call ownership before launch',
        'A requirement that the development team be available by phone after launch',
        'A postmortem template prepared in advance',
        'A monitoring dashboard shared with leadership'],
    why: 'Operational readiness before launch — documented failure modes, escalation, named ownership — is what makes response fast when something breaks at 3am. Informal availability is not ownership, and a postmortem template helps only after the incident is over.'
  },
  {
    id: 'q098', t: '6.5', a: [1], cs: null,
    q: 'Which combination best implements quality control on infrastructure changes?',
    o: ['Requiring a senior engineer to review every change manually',
        'Automated policy validation and tests in CI, with peer review, so violations are blocked before merge',
        'Auditing changes monthly and correcting drift',
        'Restricting who may open a pull request'],
    why: 'Effective quality control is automated, applied at merge time, and consistent — policy checks and tests block violations before they exist in production, with human review for judgment. Monthly auditing detects problems after the fact, and manual-only review scales poorly and misses mechanically checkable rules.'
  },
  {
    id: 'q099', t: '6.6', a: [2], cs: null,
    q: 'You want confidence that your system degrades gracefully when a dependency fails, before it happens for real. Which practice addresses this?',
    o: ['Load testing at twice expected peak',
        'Penetration testing of the dependency\'s API',
        'Chaos engineering — deliberately injecting failures in a controlled way and verifying the system behaves as designed',
        'Increasing the dependency\'s timeout'],
    why: 'Chaos engineering tests resilience hypotheses by injecting real failure — killing instances, adding latency, severing dependencies — and observing whether fallbacks work. Load testing probes capacity, penetration testing probes security, and raising a timeout changes behaviour without validating anything.'
  },
  {
    id: 'q100', t: '6.6', a: [1], cs: null,
    q: 'Before a major product launch you must verify the system handles projected traffic. Which approach gives the most trustworthy answer?',
    o: ['Extrapolate from current production metrics to the projected load',
        'Load test in an environment matching production topology and data volume, at and beyond projected peak',
        'Over-provision to three times projected peak and skip testing',
        'Enable autoscaling with a high maximum and rely on it'],
    why: 'Only exercising a production-like environment at and beyond projected load reveals the real bottleneck, which is usually a shared dependency — a database connection limit, a quota, a lock — that does not appear in extrapolation. Over-provisioning and generous autoscaling do not help when the constraint is not the scaling tier.'
  },

  /* ===================== case-study drills (12) ===================== */
  {
    id: 'q101', t: '2.1', a: [1], cs: 'ehr',
    q: 'EHR Healthcare states there is no plan to upgrade or move its on-premises file- and API-based insurance integrations. How should this shape the target architecture?',
    o: ['Plan a phased migration of those integrations over the next two years anyway',
        'Treat hybrid connectivity as a permanent architectural component, not a transitional one',
        'Replace the integrations with Pub/Sub so they become cloud-native',
        'Keep them on-premises but route all traffic over the public internet to reduce cost'],
    why: 'The case study says explicitly that these systems stay. That makes private hybrid connectivity — redundant Interconnect with VPN failover — a permanent part of the design. Any option that migrates or replaces them contradicts a stated constraint, which is the fastest way to eliminate distractors.'
  },
  {
    id: 'q102', t: '1.2', a: [2], cs: 'ehr',
    q: 'EHR Healthcare requires a minimum of 99.9% availability for customer-facing systems. Which design meets it without over-engineering?',
    o: ['Multi-region active-active across three regions with global failover',
        'A single-zone GKE cluster with aggressive autohealing',
        'Regional GKE across multiple zones, with Cloud SQL HA in the same region',
        'Two independent deployments in separate clouds with DNS failover'],
    why: '99.9% is a regional target and multi-zone redundancy within one region satisfies it. Multi-region active-active targets 99.99%+ and multiplies cost and complexity — reading the stated number rather than reaching for maximum resilience is the skill being tested.'
  },
  {
    id: 'q103', t: '6.2', a: [3], cs: 'ehr',
    q: 'EHR Healthcare notes that alerts are sent via email and are often ignored. What is the correct architectural response?',
    o: ['Route the same alerts to SMS as well so they are harder to miss',
        'Reduce the alert threshold sensitivity so fewer alerts fire',
        'Add a second monitoring tool for redundancy',
        'Define SLOs and alert on error-budget burn against user-visible symptoms, with real notification channels and clear ownership'],
    why: 'Ignored alerts are a symptom of low signal-to-noise: too many cause-based alerts nobody can act on. The fix is symptom-based, SLO-driven alerting with defined ownership. More channels or another tool delivers the same noise; blunting thresholds hides real problems.'
  },
  {
    id: 'q104', t: '3.2', a: [1], cs: 'ehr',
    q: 'EHR Healthcare wants to generate industry-trend predictions from provider data while maintaining regulatory compliance. What must happen before that data reaches the analytics environment?',
    o: ['It must be encrypted with CMEK in the analytics dataset',
        'Protected health information must be de-identified — inspected and masked or tokenized',
        'It must be placed behind a VPC Service Controls perimeter',
        'Access must be restricted to a dedicated analytics service account'],
    why: 'All four are reasonable controls, but only de-identification removes PHI from data that analysts and data scientists legitimately read. Encryption, perimeters and IAM govern who and where — an authorized analyst inside the boundary still sees plaintext PHI, which is the compliance problem.'
  },
  {
    id: 'q105', t: '2.3', a: [2], cs: 'altostrat',
    q: 'Altostrat requires scalable, performant Kubernetes environments both on-premises and in Google Cloud, managed centrally. What satisfies this?',
    o: ['GKE Autopilot clusters in multiple Google Cloud regions',
        'Self-managed Kubernetes on Compute Engine plus self-managed clusters on-premises',
        'GKE Enterprise fleet management spanning cloud and on-premises clusters, with Config Sync and Policy Controller',
        'Cloud Run in the cloud with Docker Compose on-premises'],
    why: 'The requirement names both environments plus centralized management, which is the fleet-management proposition: one control plane, declarative config and policy applied consistently across cloud and on-prem clusters. Cloud-only GKE fails the on-premises half however many regions you add.'
  },
  {
    id: 'q106', t: '2.2', a: [0], cs: 'altostrat',
    q: 'Altostrat must optimize storage costs for a growing media library whose access pattern is unpredictable, while keeping high availability. What do you recommend?',
    o: ['Cloud Storage with Autoclass, letting Google move objects between classes based on observed access',
        'Move the entire library to Archive to minimize storage cost',
        'Keep everything in Standard so no retrieval fees are ever incurred',
        'Move objects to Coldline on a fixed 90-day lifecycle rule'],
    why: 'Unpredictable access is precisely the Autoclass signal — deterministic lifecycle rules require you to know the pattern. Blanket Archive incurs retrieval costs and minimum-duration charges on anything still popular; blanket Standard forgoes the savings the requirement asks for.'
  },
  {
    id: 'q107', t: '2.5', a: [1], cs: 'altostrat',
    q: 'Altostrat needs to extract rich metadata from its audio and video library using NLP and computer vision. It has no labelled training data. What is the right approach?',
    o: ['Train custom vision and language models on the media library',
        'Use prebuilt APIs — Video Intelligence, Vision, Speech-to-Text and Natural Language — orchestrated by the existing Cloud Run functions',
        'Fine-tune a foundation model on the entire media catalog',
        'Have contractors manually tag the library to create training data'],
    why: 'Prebuilt perception APIs need no training data and cover labels, shots, objects, transcription and entity extraction. Custom training and fine-tuning both require labelled data the case says does not exist, and Altostrat already uses Cloud Run functions for exactly this event-driven enrichment pattern.'
  },
  {
    id: 'q108', t: '3.1', a: [2], cs: 'altostrat',
    q: 'Altostrat requires AI-powered detection of harmful content and wants its AI systems to be auditable with explainable decisions. Which combination addresses both?',
    o: ['Cloud Armor for content filtering, with Cloud Audit Logs for explainability',
        'Binary Authorization on model containers, with Artifact Analysis scanning',
        'Content safety screening (Video Intelligence explicit content detection plus Model Armor on model traffic), with a model registry, prediction explainability and pipeline lineage',
        'VPC Service Controls around the AI project, with CMEK on the media bucket'],
    why: 'Two distinct requirements need two answers: safety screening of ingested media and of model prompts/responses, plus governance — versioned models, explanations attached to predictions, and lineage so a decision can be reconstructed. Cloud Armor is a network WAF, and perimeters and key management do not make a model explainable.'
  },
  {
    id: 'q109', t: '2.5', a: [3], cs: 'cymbal',
    q: 'Cymbal needs to generate product image variations from a base image — different colours, background changes and text overlays. Which service does this?',
    o: ['Vision API, which analyzes image content',
        'Video Intelligence API',
        'Gemini multimodal models, which can interpret images',
        'Imagen, which generates and edits images'],
    why: 'This requirement is image generation and editing, not image understanding. Imagen generates variations and performs edits like background replacement. Vision API and Gemini interpret images — they do not create them. Cymbal needs both capabilities for different requirements, so keep the distinction sharp.'
  },
  {
    id: 'q110', t: '1.1', a: [0], cs: 'cymbal',
    q: 'Cymbal requires a UI for associates to approve, reject or modify AI-generated content before the product catalog is updated. A proposed design writes generated attributes straight to the catalog and flags low-confidence items for later audit. Why is this wrong?',
    o: ['It violates the stated human-in-the-loop requirement — generated content must be reviewed before it updates the catalog, not after',
        'It will not scale to Cymbal\'s catalog size',
        'It cannot handle image generation, only text attributes',
        'It requires more expensive infrastructure than a review queue'],
    why: 'The case states human-in-the-loop review as a requirement with an explicit approval gate. Post-hoc auditing inverts it: incorrect content reaches customers first. When a case study names a control, an otherwise elegant design that removes it is wrong on requirements, not on engineering.'
  },
  {
    id: 'q111', t: '1.3', a: [1], cs: 'knightmotives',
    q: 'KnightMotives needs real-time AI features in vehicles, but vehicle connectivity in rural areas is unreliable. Which architecture is correct?',
    o: ['Stream all sensor data to the cloud for inference and return results over the mobile network',
        'Run inference on the vehicle, buffering telemetry locally and syncing to the cloud when connectivity returns',
        'Cache the last cloud response in the vehicle and reuse it while offline',
        'Require a connectivity check before enabling AI features, disabling them in rural areas'],
    why: 'When connectivity is not guaranteed, safety-relevant real-time inference must run at the edge, with store-and-forward for telemetry. A cloud round trip fails exactly where the case says the network fails. Disabling features in rural areas contradicts delivering a consistent experience across all models.'
  },
  {
    id: 'q112', t: '4.2', a: [2], cs: 'knightmotives',
    q: 'KnightMotives wants to monetize corporate data to help fund its technology investment, while adhering to EU data protection regulation. What is the right mechanism?',
    o: ['Export curated datasets to cloud storage buckets that paying partners can download',
        'Grant partners read access to the relevant BigQuery datasets with IAM',
        'Publish governed data products through a data exchange, using clean rooms where partners must analyze without accessing raw records',
        'Build a REST API that returns raw records to authenticated partners'],
    why: 'Monetization under GDPR means governed sharing with the data never leaving your control boundary: a data exchange for discovery and entitlement, and clean rooms so partners compute on data they cannot extract. Exports, raw IAM grants and record-level APIs all hand over data you remain accountable for.'
  },

  /* ===================== case-study drills, second pass (10) ===================== */
  {
    id: 'q113', t: '5.1', a: [2], cs: 'cymbal',
    q: 'Cymbal wants to retire its SFTP file transfers and ETL batch integrations with suppliers, which it cites as a source of cost, delay and errors. What replacement pattern do you advise?',
    o: ['A faster managed SFTP service with a tighter batch schedule',
        'Direct database writes from supplier systems into the product catalog',
        'Suppliers land files in Cloud Storage, which publishes a notification to Pub/Sub triggering per-file processing',
        'A nightly Dataproc job that pulls from each supplier in turn'],
    why: 'Event-driven landing decouples supplier cadence from your processing, gives per-file retry and replay, and removes the batch window entirely. Speeding up the batch keeps every structural problem. Letting suppliers write to your catalog directly destroys the review gate the case explicitly requires.'
  },
  {
    id: 'q114', t: '6.2', a: [1], cs: 'cymbal',
    q: 'Cymbal currently monitors with Grafana, Nagios and Elastic, and wants proactive monitoring as part of its stack modernization. What is the most valuable first step?',
    o: ['Keep all three tools and add Cloud Monitoring alongside for cloud resources',
        'Consolidate onto Cloud Observability, define SLOs for the customer-facing storefront and search, and alert on error-budget burn',
        'Migrate the Grafana dashboards to Cloud Monitoring dashboards unchanged',
        'Add uptime checks against the storefront from several regions'],
    why: 'Proactive means you learn before customers complain, which requires SLOs on user-visible behaviour and burn-rate alerting — not more dashboards. Running four tools perpetuates the fragmentation, and porting dashboards verbatim carries over cause-based metrics without adding a single actionable signal.'
  },
  {
    id: 'q115', t: '1.3', a: [0], cs: 'cymbal',
    q: 'Cymbal\'s storefront currently finds products by querying relational tables on name and category, and search relevance is poor. Which change addresses the root cause?',
    o: ['Semantic retrieval over the catalog with generated product attributes enriching what is searchable',
        'Adding full-text indexes to the name and category columns',
        'Caching the most common queries in Memorystore',
        'Sharding the product tables to reduce query latency'],
    why: 'The failure is semantic, not performance: a customer asking in natural language does not match column values however fast the query runs. Semantic retrieval plus richer generated metadata fixes relevance. Indexes, caching and sharding all make a fundamentally wrong match faster.'
  },
  {
    id: 'q116', t: '4.2', a: [3], cs: 'cymbal',
    q: 'Cymbal lists two cost-reduction goals: reduce call-center staffing costs and reduce data-center hosting costs. How should you treat them?',
    o: ['As one cost programme, since both reduce operating expense',
        'As a single migration project, since moving to cloud addresses both',
        'Defer the call-center goal, since it depends on the AI work completing first',
        'As two separate levers with different solutions — conversational commerce deflects contacts, while migration and rightsizing reduce hosting'],
    why: 'They share a label and nothing else. Staffing cost falls when the agent can complete transactions customers currently phone in; hosting cost falls through migration, rightsizing and then commitments. Conflating them produces a plan that under-delivers on one, and the exam does test whether you read requirements individually.'
  },
  {
    id: 'q117', t: '1.4', a: [2], cs: 'knightmotives',
    q: 'KnightMotives runs its supply chain on an outdated mainframe and has a five-year modernization horizon. What is the sound approach?',
    o: ['Rewrite the supply chain system cloud-native as the first project, since it is the biggest constraint',
        'Leave the mainframe untouched for the full five years and modernize only customer-facing systems',
        'Assess with Migration Center to map dependencies, retain the mainframe initially while integrating with it, then modernize or replace it in a later phase',
        'Rehost the mainframe workload onto Compute Engine immediately'],
    why: 'A five-year horizon and a stated intent to modernize gradually calls for assessment first, then phased disposition — with integration in place so other modernization is not blocked waiting. Rewriting the most complex system first maximizes risk, and mainframe workloads do not simply rehost onto general-purpose VMs.'
  },
  {
    id: 'q118', t: '5.1', a: [1], cs: 'knightmotives',
    q: 'KnightMotives needs modern dealer tools for sales, service and inventory. The case states dealers have no budget for new equipment. What does this constrain?',
    o: ['Nothing architecturally — it only affects the rollout schedule',
        'The tools must be browser-based with no dealer-side hardware or on-premises installation',
        'The tools must run offline on dealer laptops with periodic sync',
        'KnightMotives must fund dealer hardware as part of the programme'],
    why: 'A stated budget constraint eliminates any design requiring dealer-side infrastructure. Browser-delivered applications on Cloud Run or GKE need nothing but a device dealers already have. Watch for this pattern: one sentence about money or skills often disqualifies the technically obvious answer.'
  },
  {
    id: 'q119', t: '1.1', a: [0], cs: 'knightmotives',
    q: 'KnightMotives wants a comprehensive CRM to track customer interactions and personalize experiences. Which workload disposition is appropriate?',
    o: ['Buy — adopt a SaaS CRM and integrate it with the data platform',
        'Build — a custom CRM will fit the automotive sales process better',
        'Modify — extend the existing outdated ERP to cover CRM functions',
        'Deprecate — rely on dealer-managed customer relationships instead'],
    why: 'CRM is mature commodity functionality and not what differentiates a car manufacturer, so buy and integrate. KnightMotives\' scarce engineering capacity belongs on autonomy, the in-vehicle experience and the data platform. Extending an ERP the case already calls outdated compounds the problem.'
  },
  {
    id: 'q120', t: '3.2', a: [2], cs: 'knightmotives',
    q: 'KnightMotives states that adherence to EU data protection regulation is critical, especially for emerging autonomous platforms. How should this appear in the architecture?',
    o: ['As a documented policy commitment reviewed annually by legal',
        'As encryption of all autonomous-platform data with customer-managed keys',
        'As technical enforcement: resource location constraints via organization policy, Assured Workloads for the regulated environment, and de-identification of telemetry',
        'As a VPC Service Controls perimeter around the autonomous vehicle projects'],
    why: 'Sovereignty and residency requirements must be enforced by the platform, not promised in a document: location constraints stop resources being created outside permitted regions, and Assured Workloads adds residency and personnel controls. CMEK and VPC-SC are valuable complements but neither constrains where data comes to rest.'
  },
  {
    id: 'q121', t: '6.3', a: [1], cs: 'knightmotives',
    q: 'KnightMotives must update in-vehicle software across a large fleet of legacy hybrid and ICE vehicles. What rollout approach is appropriate?',
    o: ['Push the update to the whole fleet simultaneously during a maintenance window',
        'Over-the-air updates rolled out by cohort, with feature flags so capability degrades gracefully on older hardware',
        'Require owners to visit a dealer for each software update',
        'Update only new vehicles and leave legacy models on their current software'],
    why: 'Cohort-based OTA rollout is canary deployment applied to a physical fleet: expose a small segment, observe, expand. Feature flags let one code base run across hardware generations. A simultaneous fleet-wide push has an unbounded blast radius, and the other options contradict the goal of a consistent experience across all models.'
  },
  {
    id: 'q122', t: '5.2', a: [2], cs: 'ehr',
    q: 'EHR Healthcare must dynamically scale and provision new container-based environments as it onboards insurance providers. What makes this repeatable?',
    o: ['A documented runbook the platform team follows for each new environment',
        'Cloning an existing project through the console when a new environment is needed',
        'Parameterized Terraform modules applied from a pipeline against remote state, exposed as a service catalog entry',
        'A Cloud Function that calls the Compute Engine API to create resources on demand'],
    why: 'Codified, parameterized infrastructure applied from a pipeline gives reviewable, auditable, reproducible environments, and publishing it as a catalog entry keeps teams self-service on the compliant path. Runbooks drift, console cloning copies mistakes silently, and hand-rolled API glue re-implements Terraform badly.'
  }
];

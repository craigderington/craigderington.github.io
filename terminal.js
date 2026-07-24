// Terminal CV - Craig Derington
// Tokyo Night Theme

class Terminal {
    constructor() {
        this.output = document.getElementById('output');
        this.input = document.getElementById('input');
        this.prompt = document.getElementById('prompt');
        this.commandHistory = [];
        this.historyIndex = -1;
        this.currentDirectory = '~';
        this.directories = {
            '~': ['about.txt', 'skills.json', 'experience.md', 'projects/', 'contact.txt', 'company.txt', 'education.txt', 'certifications.txt', 'README.md'],
            'projects': ['gb10-studio/', 'gracesquad/', 'tradefix/', 'curalis/', 'vestix/']
        };

        this.init();
    }

    init() {
        this.input.addEventListener('keydown', (e) => this.handleKeyDown(e));
        this.displayWelcome();
        this.input.focus();

        // Refocus on click anywhere
        document.addEventListener('click', () => this.input.focus());
    }

    handleKeyDown(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            const command = this.input.value.trim();
            if (command) {
                this.commandHistory.push(command);
                this.historyIndex = this.commandHistory.length;
                this.executeCommand(command);
            } else {
                this.addOutput('', '');
            }
            this.input.value = '';
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            if (this.historyIndex > 0) {
                this.historyIndex--;
                this.input.value = this.commandHistory[this.historyIndex];
            }
        } else if (e.key === 'ArrowDown') {
            e.preventDefault();
            if (this.historyIndex < this.commandHistory.length - 1) {
                this.historyIndex++;
                this.input.value = this.commandHistory[this.historyIndex];
            } else {
                this.historyIndex = this.commandHistory.length;
                this.input.value = '';
            }
        } else if (e.key === 'Tab') {
            e.preventDefault();
            this.autoComplete();
        } else if (e.ctrlKey && e.key === 'l') {
            e.preventDefault();
            this.clearScreen();
        } else if (e.ctrlKey && e.key === 'c') {
            e.preventDefault();
            this.addOutput(this.input.value, '^C');
            this.input.value = '';
        }
    }

    displayWelcome() {
        const asciiArt = `
╔═══════════════════════════════════════════════════════════════════╗
║                                                                   ║
║              C R A I G   D E R I N G T O N                        ║
║         Full Stack Developer & DevOps Engineer                    ║
║                     Orlando, Florida                              ║
║                                                                   ║
╚═══════════════════════════════════════════════════════════════════╝
        `;

        const welcome = `<div class="ascii-art">${asciiArt}</div>
<div class="welcome-banner">
    <div class="banner-title">Welcome to my interactive terminal CV!</div>
    <div class="banner-text">
        Full Stack Developer & DevOps Engineer | Orlando, FL<br>
        Building resilient, fault-tolerant systems with Java, Python & Kubernetes
    </div>
</div>

<span class="info">Type <span class="highlight">'help'</span> to see available commands or <span class="highlight">'ls'</span> to list files.</span>
`;

        const div = document.createElement('div');
        div.innerHTML = welcome;
        this.output.appendChild(div);
        this.scrollToBottom();
    }

    executeCommand(input) {
        const parts = input.trim().split(' ');
        const command = parts[0].toLowerCase();
        const args = parts.slice(1);

        this.addCommandToOutput(input);

        const commands = {
            'help': () => this.help(),
            'ls': () => this.ls(args),
            'cat': () => this.cat(args),
            'cd': () => this.cd(args),
            'pwd': () => this.pwd(),
            'whoami': () => this.whoami(),
            'clear': () => this.clearScreen(),
            'nerdfetch': () => this.nerdfetch(),
            'vim': () => this.vim(),
            'nvim': () => this.vim(),
            'sudo': () => this.sudo(args),
            'exit': () => this.exit(),
            'tree': () => this.tree(),
            'curl': () => this.curl(args),
            'git': () => this.git(args),
            'echo': () => this.echo(args),
            'history': () => this.history(),
        };

        if (commands[command]) {
            commands[command]();
        } else if (input.trim() === '') {
            // Empty command, just show prompt
        } else {
            this.addOutput('', `<span class="error">Command not found: ${command}</span>\n<span class="info">Type 'help' for available commands.</span>`);
        }

        this.scrollToBottom();
    }

    addCommandToOutput(command) {
        const promptSymbol = this.currentDirectory === '~'
            ? `guest@craig:~$`
            : `guest@craig:~/${this.currentDirectory}$`;

        const div = document.createElement('div');
        div.className = 'output-line command';
        div.innerHTML = `<span class="prompt-text">${promptSymbol}</span><span class="command-text">${this.escapeHtml(command)}</span>`;
        this.output.appendChild(div);
    }

    addOutput(command, result) {
        if (result) {
            const div = document.createElement('div');
            div.className = 'output-line result';
            div.innerHTML = result;
            this.output.appendChild(div);
        }
    }

    help() {
        const helpText = `<span class="success">Available Commands:</span>

<table>
  <tr><td class="key">help</td><td class="value">Display this help message</td></tr>
  <tr><td class="key">ls</td><td class="value">List directory contents</td></tr>
  <tr><td class="key">cat [file]</td><td class="value">Display file contents</td></tr>
  <tr><td class="key">cd [dir]</td><td class="value">Change directory</td></tr>
  <tr><td class="key">pwd</td><td class="value">Print working directory</td></tr>
  <tr><td class="key">whoami</td><td class="value">Display user information</td></tr>
  <tr><td class="key">nerdfetch</td><td class="value">Display system information</td></tr>
  <tr><td class="key">tree</td><td class="value">Display directory tree</td></tr>
  <tr><td class="key">history</td><td class="value">Show command history</td></tr>
  <tr><td class="key">clear</td><td class="value">Clear terminal (Ctrl+L)</td></tr>
  <tr><td class="key">vim/nvim</td><td class="value">Just kidding...</td></tr>
  <tr><td class="key">git status</td><td class="value">Show repository status</td></tr>
  <tr><td class="key">curl [endpoint]</td><td class="value">Fetch data (try: contact, github)</td></tr>
</table>

<span class="info">Pro tips:</span>
  • Use <span class="highlight">Tab</span> for auto-completion
  • Use <span class="highlight">↑/↓</span> arrows for command history
  • Try <span class="highlight">cat README.md</span> for a quick overview`;

        this.addOutput('', helpText);
    }

    ls(args) {
        const dir = this.currentDirectory;
        const files = this.directories[dir] || [];

        let output = files.map(file => {
            if (file.endsWith('/')) {
                return `<span class="info">${file}</span>`;
            } else if (file.endsWith('.txt') || file.endsWith('.md')) {
                return `<span class="value">${file}</span>`;
            } else if (file.endsWith('.json')) {
                return `<span class="warning">${file}</span>`;
            } else {
                return `<span class="success">${file}</span>`;
            }
        }).join('  ');

        this.addOutput('', output);
    }

    cat(args) {
        if (args.length === 0) {
            this.addOutput('', '<span class="error">cat: missing file operand</span>');
            return;
        }

        const file = args[0];
        const content = this.getFileContent(file);

        if (content) {
            this.addOutput('', content);
        } else {
            this.addOutput('', `<span class="error">cat: ${file}: No such file or directory</span>`);
        }
    }

    getFileContent(filename) {
        const files = {
            'about.txt': this.aboutContent(),
            'README.md': this.readmeContent(),
            'skills.json': this.skillsContent(),
            'experience.md': this.experienceContent(),
            'contact.txt': this.contactContent(),
            'company.txt': this.companyContent(),
            'education.txt': this.educationContent(),
            'certifications.txt': this.certificationsContent(),
            'projects/gb10-studio/info.md': this.projectGb10Studio(),
            'projects/gracesquad/info.md': this.projectGraceSquad(),
            'projects/tradefix/info.md': this.projectTradefix(),
            'projects/curalis/info.md': this.projectCuralis(),
            'projects/vestix/info.md': this.projectVestix(),
        };

        return files[filename] || files[`${this.currentDirectory}/${filename}`] || null;
    }

    aboutContent() {
        return `<span class="success">╔═══════════════════════════════════════════════════════════╗</span>
<span class="success">║</span>  <span class="highlight">CRAIG LAWRENCE DERINGTON</span>                              <span class="success">║</span>
<span class="success">║</span>  Full Stack Developer & DevOps Engineer                  <span class="success">║</span>
<span class="success">╚═══════════════════════════════════════════════════════════╝</span>

<span class="info">LOCATION:</span>     Orlando, FL
<span class="info">PASSION:</span>      Open Source, Linux, Docker & Automation
<span class="info">PHILOSOPHY:</span>   "There is no spoon..."

<span class="highlight">ABOUT ME:</span>
I'm a veteran full-stack developer who specializes in building
resilient, fault-tolerant, high-availability systems. My expertise
spans both on-premises infrastructure and cloud environments.

<span class="highlight">CURRENT FOCUS:</span>
• Architecting event-driven microservices with Java Spring Boot
• Managing multi-node Kubernetes clusters (k3s, microk8s)
• Building secure CI/CD pipelines with GitHub Actions
• Pursuing Network+ & Security+ certifications

<span class="highlight">DEVELOPMENT ENVIRONMENT:</span>
• Editor:     Neovim (of course)
• OS:         Arch Linux / Fedora
• WM:         Hyprland / i3wm
• Shell:      Bash with custom configs
• Terminal:   Alacritty / Kitty

<span class="info">Quote:</span> "I write the code that makes the whole world sing"`;
    }

    readmeContent() {
        return `<span class="highlight"># Craig Derington - Terminal CV</span>

<span class="success">## Quick Start</span>
Try these commands to explore my professional profile:

  <span class="cyan">cat about.txt</span>            - Learn about me
  <span class="cyan">cat skills.json</span>          - View my technical skills
  <span class="cyan">cat experience.md</span>        - See my work history
  <span class="cyan">cat company.txt</span>          - About Pathfinder Networks
  <span class="cyan">cat education.txt</span>        - View my education & honors
  <span class="cyan">cat certifications.txt</span>   - View certifications & learning path
  <span class="cyan">cd projects</span>              - Browse my projects
  <span class="cyan">nerdfetch</span>                - System information
  <span class="cyan">curl contact</span>             - Get contact information

<span class="success">## Navigation</span>
This terminal supports standard Unix commands like cd, ls, pwd,
and cat to navigate through my CV content.

<span class="success">## Source Code</span>
This interactive CV is open source! Check out the repository:
<a href="https://github.com/craigderington" target="_blank">github.com/craigderington</a>

<span class="info">Powered by: HTML, CSS, JavaScript & Tokyo Night theme</span>`;
    }

    skillsContent() {
        return `<span class="warning">{</span>
  <span class="cyan">"core_languages"</span>: [
    <span class="green">"Java"</span>,
    <span class="green">"Python"</span>,
    <span class="green">"SQL"</span>,
    <span class="green">"Bash"</span>,
    <span class="green">"JavaScript"</span>
  ],
  <span class="cyan">"frameworks"</span>: [
    <span class="green">"Spring Boot"</span>,
    <span class="green">"Django"</span>,
    <span class="green">"Flask"</span>,
    <span class="green">"FastAPI"</span>,
    <span class="green">"React"</span>
  ],
  <span class="cyan">"devops_cloud"</span>: {
    <span class="cyan">"containers"</span>: [<span class="green">"Docker"</span>, <span class="green">"Kubernetes"</span>, <span class="green">"k3s"</span>, <span class="green">"microk8s"</span>],
    <span class="cyan">"ci_cd"</span>: [<span class="green">"GitHub Actions"</span>, <span class="green">"Jenkins"</span>, <span class="green">"GitLab CI"</span>],
    <span class="cyan">"infrastructure"</span>: [<span class="green">"Terraform"</span>, <span class="green">"Ansible"</span>],
    <span class="cyan">"monitoring"</span>: [<span class="green">"Prometheus"</span>, <span class="green">"Grafana"</span>],
    <span class="cyan">"proxy"</span>: [<span class="green">"Traefik"</span>, <span class="green">"Nginx"</span>]
  },
  <span class="cyan">"databases"</span>: [
    <span class="green">"PostgreSQL"</span>,
    <span class="green">"MySQL"</span>,
    <span class="green">"Redis"</span>,
    <span class="green">"MongoDB"</span>
  ],
  <span class="cyan">"cloud_platforms"</span>: [
    <span class="green">"Azure"</span>,
    <span class="green">"AWS"</span>,
    <span class="green">"DigitalOcean"</span>
  ],
  <span class="cyan">"microsoft_stack"</span>: [
    <span class="green">"Azure AD"</span>,
    <span class="green">"Intune"</span>,
    <span class="green">"Office 365"</span>
  ],
  <span class="cyan">"operating_systems"</span>: [
    <span class="green">"Linux (Arch, Fedora, Ubuntu)"</span>,
    <span class="green">"Windows Server"</span>
  ],
  <span class="cyan">"tools"</span>: [
    <span class="green">"Git"</span>,
    <span class="green">"Neovim"</span>,
    <span class="green">"tmux"</span>,
    <span class="green">"Postman"</span>
  ]
<span class="warning">}</span>`;
    }

    experienceContent() {
        return `<span class="highlight"># Professional Experience</span>

<div class="project-item">
<span class="project-title">🚀 Full Stack Developer & DevOps Engineer</span>
<span class="value">Current Role | Building Resilient Systems</span>

<span class="info">Responsibilities:</span>
• Architecting and deploying event-driven microservices using Java Spring Boot
• Managing multi-node Kubernetes clusters (k3s, microk8s) in HA configuration
• Implementing CI/CD pipelines with GitHub Actions for secure container delivery
• Designing and maintaining PostgreSQL databases for high-traffic applications
• Automating infrastructure deployment with Docker and container orchestration

<span class="info">Key Achievements:</span>
• Successfully migrated legacy monolithic applications to microservices architecture
• Reduced deployment time by 70% through automated CI/CD pipelines
• Implemented monitoring and alerting systems for 99.9% uptime
• Built scalable solutions handling thousands of concurrent users
</div>

<div class="project-item">
<span class="project-title">💼 Previous Experience</span>
<span class="value">Various Organizations | Building Web Solutions</span>

• Developed full-stack web applications using Python (Django/Flask) and JavaScript
• Integrated payment processing systems (Stripe, PayPal) for e-commerce platforms
• Implemented RESTful APIs and microservices for distributed systems
• Managed Linux servers and cloud infrastructure (Azure, AWS)
• Mentored junior developers in best practices and modern development workflows
</div>

<span class="info">Want to know more? Download my full CV or connect via LinkedIn!</span>`;
    }

    contactContent() {
        return `<span class="success">╔═══════════════════════════════════════════════════╗</span>
<span class="success">║</span>  <span class="highlight">CONTACT INFORMATION</span>                            <span class="success">║</span>
<span class="success">╚═══════════════════════════════════════════════════╝</span>

<span class="cyan">📧 EMAIL:</span>      craig@craigderington.dev
<span class="cyan">🐙 GITHUB:</span>     <a href="https://github.com/craigderington" target="_blank">github.com/craigderington</a>
<span class="cyan">🐦 TWITTER:</span>    <a href="https://twitter.com/craig_derington" target="_blank">@craig_derington</a>
<span class="cyan">🌐 WEBSITE:</span>    <a href="https://craigderington.github.io" target="_blank">craigderington.github.io</a>
<span class="cyan">🔑 GPG KEY:</span>    59DA1EF95CC57D132B1DC966B95F3C25F2CEB10D

<span class="success">💰 SUPPORT MY WORK:</span>
<span class="warning">₿  BITCOIN:</span>    <a href="https://strike.me/cderington17" target="_blank">strike.me/cderington17</a>

<span class="info">Feel free to reach out for:</span>
  • Freelance opportunities
  • Open source collaboration
  • Technical consulting
  • Coffee and code discussions`;
    }

    companyContent() {
        return `<span class="highlight">Pathfinder Networks</span>
<a href="https://pathfinder-networks.org" target="_blank">pathfinder-networks.org</a>

<span class="success">🏢 ABOUT:</span>
A Florida LLC building premium digital platforms for non-profit and
faith-based organizations.

<span class="info">"Technology should serve the mission, never distract from it."</span>

<span class="warning">🛠 PLATFORMS:</span>
  • <span class="cyan">GraceSquad</span>   Volunteer scheduling & member CRM    <a href="https://gracesquad.org" target="_blank">gracesquad.org</a>
  • <span class="cyan">Curalis</span>      HIPAA care coordination             <a href="https://curalis.care" target="_blank">curalis.care</a>
  • <span class="cyan">TradeFix</span>     Field service management            <a href="https://tradefix.org" target="_blank">tradefix.org</a>
  • <span class="cyan">Vestix</span>       Property management                <a href="https://vestix.org" target="_blank">vestix.org</a>
  • <span class="cyan">GB10 Studio</span>  GB10 compute marketplace            <a href="https://gb10.studio" target="_blank">gb10.studio</a>

<span class="success">⚖ VALUES:</span>
  Mission First · Built to Last · Radical Simplicity · Generous by Design

<span class="info">🔗 LINKS:</span>
  Web:     <a href="https://pathfinder-networks.org" target="_blank">pathfinder-networks.org</a>
  GitHub:  <a href="https://github.com/Pathfinder-Networks" target="_blank">github.com/Pathfinder-Networks</a>

<span class="cyan">💡 TIP:</span> Run <span class="cyan">cd projects</span> for engineering detail on each platform.`;
    }

    educationContent() {
        return `<span class="highlight">Education</span>

<span class="success">🎓 DEGREE:</span>
  ✓ Associate of Science — Specialization in Cybersecurity
    Seminole State College of Florida
    Conferred August 2026

<span class="warning">🏆 HONORS:</span>
  ✓ Dean's List
  ✓ Cumulative GPA: 3.6

<span class="cyan">💡 TIP:</span> See <span class="cyan">cat certifications.txt</span> for certifications and
continuous learning.`;
    }

    certificationsContent() {
        return `<span class="highlight">Certifications & Learning Path</span>

<span class="success">🎓 EDUCATION:</span>
  ✓ A.S. Cybersecurity — Seminole State College (August 2026)
    Dean's List · 3.6 GPA — see <span class="cyan">cat education.txt</span>

<span class="success">🎯 CURRENT FOCUS (2025):</span>
  ☐ CompTIA Network+ (In Progress)
  ☐ CompTIA Security+ (In Progress)

<span class="info">📚 CONTINUOUS LEARNING:</span>
  ✓ Kubernetes Administration
  ✓ Spring Boot Microservices Architecture
  ✓ Cloud Security Best Practices
  ✓ DevOps & CI/CD Pipelines
  ✓ Container Orchestration

<span class="warning">🛠 PRACTICAL EXPERIENCE:</span>
  ✓ AWS Cloud Architecture (Hands-on Production Experience)
  ✓ Azure Cloud Services (Active Development & Deployment)
  ✓ Docker & Kubernetes (Multi-node Production Clusters)
  ✓ Django & Flask (Cloud-Native Production Web Applications)
  ✓ Celery Task Queue (Distributed Asynchronous Processing Architecture)

<span class="cyan">💡 TIP:</span> I believe in practical experience over paper certifications,
but I'm actively pursuing industry-recognized credentials to
formalize my expertise.`;
    }

    projectGb10Studio() {
        return `<div class="project-item">
<span class="project-title">⚡ GB10 Studio - GB10 Compute Marketplace</span>

<span class="info">Description:</span>
On-demand access to NVIDIA Grace Blackwell (GB10) hardware for private
LLM inference. Users reserve dedicated hardware slots by the minute and
run 70B+ parameter models through an OpenAI-compatible API, while
hardware owners list their devices on a global marketplace.

<span class="info">Tech Stack:</span>
<span class="project-tech">NVIDIA Grace Blackwell GB10 • NVLink-C2C • OpenAI-compatible API • Stripe • LangChain / LlamaIndex</span>

<span class="info">Key Features:</span>
• OpenAI-compatible API — swap base URL and key, no client rewrite
• Dedicated slot reservation with no queueing or tenant sharing
• Two-sided marketplace with provider onboarding and payouts
• Encrypted slot tokens with on-demand rotation
• Per-minute metering and billing
• Drop-in integrations for LangChain, LlamaIndex and Cursor

<span class="info">Technical Highlights:</span>
• 128 GB unified memory and 1 PFLOP FP8 addressable per slot
• Serves 70B+ parameter models on single-node hardware
• Escrow and payout pipeline for third-party hardware providers

<span class="success">Status:</span> Live — marketplace open to providers and users
<span class="cyan">Web:</span> <a href="https://gb10.studio" target="_blank">gb10.studio</a>
</div>`;
    }

    projectGraceSquad() {
        return `<div class="project-item">
<span class="project-title">🙌 GraceSquad - Volunteer Scheduling for Churches & Nonprofits</span>

<span class="info">Description:</span>
Volunteer scheduling and member CRM for churches and nonprofits, built
to replace the usual sprawl of Planning Center, SignUpGenius,
spreadsheets and group chats with one integrated system. Includes a
child-safety compliance module.

<span class="info">Tech Stack:</span>
<span class="project-tech">Stripe • SMS & Email Delivery • QR Check-in • CSV / PDF Export</span>

<span class="info">Key Features:</span>
• Auto-fill scheduling engine with 7-rule conflict detection
• Volunteer and member CRM with skill and certification tracking
• Child safety: background-check tracking, two-adult rule enforcement,
  QR check-in kiosk
• Automated SMS and email reminders
• Donation and giving management
• Drag-and-drop scheduling grid with a 10-report library

<span class="info">Technical Highlights:</span>
• Bulk generation of 20-slot schedules in under 2 seconds
• Scales from small teams to unlimited membership rosters
• Zero platform fee on donations — processor pass-through only

<span class="success">Status:</span> Live — free and paid tiers; mobile app in progress
<span class="cyan">Web:</span> <a href="https://gracesquad.org" target="_blank">gracesquad.org</a>
</div>`;
    }

    projectTradefix() {
        return `<div class="project-item">
<span class="project-title">🔧 TradeFix - Field Service Platform for Trade Contractors</span>

<span class="info">Description:</span>
Field service management for independent HVAC, plumbing and electrical
contractors — dispatch, estimates, invoicing and recurring memberships,
scoped for 1-25 tech shops rather than enterprise fleets.

<span class="info">Tech Stack:</span>
<span class="project-tech">iOS • Android • Stripe (Card / ACH) • QuickBooks Online • Google Maps</span>

<span class="info">Key Features:</span>
• Drag-and-drop dispatch calendar with live GPS and travel-time ETA
• SMS dispatch notifications to technicians and customers
• Three-tier estimate builder with e-signature capture and PDF delivery
• Auto-generated invoicing with overdue reminders
• Membership module: plan tiers, visit tracking, renewal automation
• Two-way QuickBooks Online sync

<span class="info">Technical Highlights:</span>
• 99.95% uptime SLA
• 30-minute onboarding for a new shop
• SOC 2 certification in progress

<span class="success">Status:</span> Live — v1.0 in production
<span class="cyan">Web:</span> <a href="https://tradefix.org" target="_blank">tradefix.org</a>
</div>`;
    }

    projectCuralis() {
        return `<div class="project-item">
<span class="project-title">🩺 Curalis - HIPAA-Compliant Care Coordination</span>

<span class="info">Description:</span>
Care coordination platform for home care agencies, assisted living
facilities and family caregivers. Centralizes caregiver scheduling,
medication administration records and secure family-provider
communication under HIPAA controls.

<span class="info">Key Features:</span>
• Caregiver shift scheduling with GPS-verified clock-in / clock-out
• Electronic medication administration record (eMAR) covering
  scheduled, PRN and witnessed doses
• HIPAA-compliant secure messaging across caregivers, agencies, families
• Real-time care plan visibility and shift summaries
• Multi-tenant organization support for facilities
• Full audit trails for compliance review

<span class="info">Technical Highlights:</span>
• Designed around HIPAA safeguards from the schema up
• Multi-tenant isolation for facility and agency operators

<span class="success">Status:</span> In development — early access waitlist open
<span class="cyan">Web:</span> <a href="https://curalis.care" target="_blank">curalis.care</a>
</div>`;
    }

    projectVestix() {
        return `<div class="project-item">
<span class="project-title">🏠 Vestix - Property Management for Independent Landlords</span>

<span class="info">Description:</span>
Property management software for independent landlords running 10-50
units. Covers Section 8 voucher tracking, mixed portfolios and
rent-to-own agreements — capabilities normally gated behind enterprise
platforms with 50-unit minimums.

<span class="info">Tech Stack:</span>
<span class="project-tech">Stripe Connect • Browser-based E-Signature • CSV Import</span>

<span class="info">Key Features:</span>
• Section 8 / voucher tracking with dual-payer ledger management
• Mixed portfolio dashboard: multifamily, short-term rentals,
  manufactured housing
• Rent-to-own lease tracking
• Built-in e-signature with full audit trails
• Owner statements with P&L and NOI calculations
• Tenant payment portal and document storage

<span class="info">Technical Highlights:</span>
• AI-assisted lease renewal risk scoring and predictive maintenance
• Dual-payer reconciliation surfaces housing-authority underpayments

<span class="success">Status:</span> Live — 14-day trial, three pricing tiers
<span class="cyan">Web:</span> <a href="https://vestix.org" target="_blank">vestix.org</a>
</div>`;
    }

    cd(args) {
        if (args.length === 0 || args[0] === '~') {
            this.currentDirectory = '~';
            this.updatePrompt();
            return;
        }

        const dir = args[0];

        if (dir === '..') {
            if (this.currentDirectory !== '~') {
                this.currentDirectory = '~';
                this.updatePrompt();
            }
            return;
        }

        // Check if directory exists
        const targetDir = dir.replace('/', '');
        if (this.directories[targetDir]) {
            this.currentDirectory = targetDir;
            this.updatePrompt();
        } else if (this.currentDirectory === '~' && this.directories['~'].includes(dir)) {
            // It's a directory in home
            if (dir.endsWith('/')) {
                const dirName = dir.slice(0, -1);
                if (this.directories[dirName]) {
                    this.currentDirectory = dirName;
                    this.updatePrompt();
                    return;
                }
            }
            this.addOutput('', `<span class="error">cd: ${dir}: Not a directory</span>`);
        } else {
            this.addOutput('', `<span class="error">cd: ${dir}: No such file or directory</span>`);
        }
    }

    pwd() {
        const path = this.currentDirectory === '~' ? '/home/craig' : `/home/craig/${this.currentDirectory}`;
        this.addOutput('', `<span class="value">${path}</span>`);
    }

    whoami() {
        const info = `<span class="highlight">craig@orlando</span>

<span class="cyan">User:</span>         Craig Lawrence Derington
<span class="cyan">Role:</span>         Full Stack Developer & DevOps Engineer
<span class="cyan">Location:</span>     Orlando, Florida
<span class="cyan">Shell:</span>        /bin/bash
<span class="cyan">Editor:</span>       nvim
<span class="cyan">Superpower:</span>   Turning coffee into code

<span class="info">For more details, try:</span> cat about.txt`;

        this.addOutput('', info);
    }

    nerdfetch() {
        const nerdfetch = `<span class="cyan">                   -\`                </span>    <span class="cyan">craig</span>@<span class="cyan">orlando</span>
<span class="cyan">                  .o+\`               </span>    ─────────────────────────
<span class="cyan">                 \`ooo/               </span>    <span class="cyan">OS:</span> Arch Linux / Fedora
<span class="cyan">                \`+oooo:              </span>    <span class="cyan">Editor:</span> Neovim
<span class="cyan">               \`+oooooo:             </span>    <span class="cyan">WM:</span> Hyprland / i3wm
<span class="cyan">               -+oooooo+:            </span>    <span class="cyan">Shell:</span> bash 5.2.15
<span class="cyan">             \`/:-:++oooo+:           </span>    <span class="cyan">Terminal:</span> Alacritty
<span class="cyan">            \`/++++/+++++++:          </span>    <span class="cyan">Theme:</span> Tokyo Night
<span class="cyan">           \`/++++++++++++++:         </span>    <span class="cyan">Font:</span> JetBrains Mono
<span class="cyan">          \`/+++ooooooooooooo/\`       </span>    <span class="cyan">Languages:</span> Java, Python, SQL
<span class="cyan">         ./ooosssso++osssssso+\`      </span>    <span class="cyan">Containers:</span> Docker, k3s
<span class="cyan">        .oossssso-\`\`\`\`/ossssss+\`     </span>    <span class="cyan">Cloud:</span> Azure, AWS
<span class="cyan">       -osssssso.      :ssssssso.    </span>    <span class="cyan">Coffee:</span> ☕☕☕☕☕☕☕☕ (100%)
<span class="cyan">      :osssssss/        osssso+++.   </span>
<span class="cyan">     /ossssssss/        +ssssooo/-   </span>
<span class="cyan">   \`/ossssso+/:-        -:/+osssso+- </span>
<span class="cyan">  \`+sso+:-\`                 \`.-/+oso:</span>
<span class="cyan"> \`++:.                           \`-/+</span>
<span class="cyan"> .\`                                 \`/</span>`;

        this.addOutput('', nerdfetch);
    }

    vim() {
        const vimJoke = `<span class="green">Starting nvim...</span>

<span class="warning">Just kidding! This is a web terminal.</span>

<span class="info">But in real life, I use Neovim with:</span>
  • LazyVim configuration
  • LSP for Java, Python, JavaScript
  • Telescope for fuzzy finding
  • Which-key for discoverability
  • Treesitter for syntax highlighting
  • Custom keybindings and workflows

<span class="cyan">Tip:</span> Real Neovim users know that :q is the hardest command to learn 😄`;

        this.addOutput('', vimJoke);
    }

    sudo(args) {
        const command = args.join(' ');

        if (command.includes('rm -rf')) {
            this.addOutput('', `<span class="error">Nice try! But I'm not letting you delete anything 😄</span>`);
        } else {
            this.addOutput('', `<span class="warning">[sudo] password for craig:</span>
<span class="error">Sorry, try again.</span>
<span class="warning">[sudo] password for craig:</span>
<span class="error">Sorry, try again.</span>
<span class="warning">[sudo] password for craig:</span>
<span class="error">sudo: 3 incorrect password attempts</span>`);
        }
    }

    exit() {
        this.addOutput('', `<span class="info">Thanks for visiting! 👋</span>

<span class="success">To actually leave, just close the browser tab.</span>
<span class="cyan">Or stick around and explore more with 'help'!</span>`);
    }

    tree() {
        const treeOutput = `<span class="value">.</span>
├── <span class="value">about.txt</span>
├── <span class="warning">skills.json</span>
├── <span class="value">experience.md</span>
├── <span class="value">contact.txt</span>
├── <span class="value">company.txt</span>
├── <span class="value">education.txt</span>
├── <span class="value">certifications.txt</span>
├── <span class="value">README.md</span>
└── <span class="info">projects/</span>
    ├── <span class="info">gb10-studio/</span>
    │   └── <span class="value">info.md</span>
    ├── <span class="info">gracesquad/</span>
    │   └── <span class="value">info.md</span>
    ├── <span class="info">tradefix/</span>
    │   └── <span class="value">info.md</span>
    ├── <span class="info">curalis/</span>
    │   └── <span class="value">info.md</span>
    └── <span class="info">vestix/</span>
        └── <span class="value">info.md</span>`;

        this.addOutput('', treeOutput);
    }

    curl(args) {
        if (args.length === 0) {
            this.addOutput('', '<span class="error">curl: no URL specified</span>');
            return;
        }

        const endpoint = args[0];

        const endpoints = {
            'contact': this.contactContent(),
            'github': `<span class="success">HTTP/1.1 200 OK</span>
<span class="cyan">Content-Type:</span> application/json

{
  "login": "craigderington",
  "name": "Craig Derington",
  "location": "Orlando, FL",
  "email": "craig@craigderington.dev",
  "bio": "I write the code that makes the whole world sing",
  "public_repos": 156,
  "followers": 22,
  "html_url": "<a href="https://github.com/craigderington" target="_blank">https://github.com/craigderington</a>"
}`,
            'wttr.in': `<span class="cyan">Weather for Orlando, FL:</span>

      \\   /     <span class="yellow">Sunny</span>
       .-.      <span class="warning">🌡️  82°F</span>
    ― (   ) ―   <span class="cyan">💧 45% humidity</span>
       \`-'      <span class="info">💨 8 mph winds</span>
      /   \\

<span class="green">Perfect weather for coding!</span>`,
        };

        if (endpoints[endpoint]) {
            this.addOutput('', endpoints[endpoint]);
        } else {
            this.addOutput('', `<span class="error">curl: (6) Could not resolve host: ${endpoint}</span>
<span class="info">Try: contact, github, wttr.in</span>`);
        }
    }

    git(args) {
        if (args.length === 0) {
            this.addOutput('', `<span class="info">usage: git [--version] [--help] [-C <path>] [-c <name>=<value>]
           [--exec-path[=<path>]] [--html-path] [--man-path] [--info-path]
           [-p | --paginate | -P | --no-pager] [--no-replace-objects] [--bare]
           [--git-dir=<path>] [--work-tree=<path>] [--namespace=<name>]
           <command> [<args>]</span>`);
            return;
        }

        const subcommand = args[0];

        if (subcommand === 'status') {
            this.addOutput('', `<span class="green">On branch master</span>
<span class="green">Your branch is up to date with 'origin/master'.</span>

nothing to commit, working tree clean`);
        } else if (subcommand === 'log') {
            this.addOutput('', `<span class="yellow">commit a1b2c3d</span> (HEAD -> master, origin/master)
Author: Craig Derington <craig@craigderington.dev>
Date:   ${new Date().toDateString()}

    feat: Add interactive terminal CV with Tokyo Night theme

    - Built terminal emulator with command system
    - Implemented Tokyo Night color scheme
    - Added comprehensive CV content
    - Interactive file system navigation`);
        } else {
            this.addOutput('', `<span class="error">git: '${subcommand}' is not a git command. See 'git --help'.</span>`);
        }
    }

    echo(args) {
        const text = args.join(' ');
        this.addOutput('', `<span class="value">${this.escapeHtml(text)}</span>`);
    }

    history() {
        if (this.commandHistory.length === 0) {
            this.addOutput('', '<span class="info">No commands in history yet.</span>');
            return;
        }

        const historyList = this.commandHistory
            .map((cmd, index) => `<span class="comment">${index + 1}</span>  ${this.escapeHtml(cmd)}`)
            .join('\n');

        this.addOutput('', historyList);
    }

    clearScreen() {
        this.output.innerHTML = '';
    }

    updatePrompt() {
        const promptSymbol = this.currentDirectory === '~'
            ? 'guest@craig:~$'
            : `guest@craig:~/${this.currentDirectory}$`;
        this.prompt.textContent = promptSymbol;
    }

    autoComplete() {
        const value = this.input.value;
        const parts = value.split(' ');
        const command = parts[0];

        // Simple autocomplete for file names
        if (parts.length > 1) {
            const partial = parts[parts.length - 1];
            const files = this.directories[this.currentDirectory] || [];
            const matches = files.filter(f => f.startsWith(partial));

            if (matches.length === 1) {
                parts[parts.length - 1] = matches[0];
                this.input.value = parts.join(' ');
            }
        }
    }

    scrollToBottom() {
        this.output.parentElement.scrollTop = this.output.parentElement.scrollHeight;
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// Initialize terminal when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new Terminal();
});

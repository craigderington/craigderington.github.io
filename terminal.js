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
            '~': ['about.txt', 'skills.json', 'experience.md', 'projects/', 'contact.txt', 'certifications.txt', 'README.md'],
            'projects': ['fleetwave/', 'menupilot/', 'k3s-observatory/', 'counters-demo/', 'tckt/']
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
            'certifications.txt': this.certificationsContent(),
            'projects/fleetwave/info.md': this.projectFleetwave(),
            'projects/menupilot/info.md': this.projectMenupilot(),
            'projects/k3s-observatory/info.md': this.projectK3sObservatory(),
            'projects/counters-demo/info.md': this.projectCounters(),
            'projects/tckt/info.md': this.projectTckt(),
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

    certificationsContent() {
        return `<span class="highlight">Certifications & Learning Path</span>

<span class="success">🎯 CURRENT FOCUS (2025):</span>
  ☐ Associate of Science (specialization in Cybersecurity)
    from Seminole State College - completion Spring 2026
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

    projectFleetwave() {
        return `<div class="project-item">
<span class="project-title">🚚 FleetWave - Radio Fleet Management System</span>

<span class="info">Description:</span>
A comprehensive microservice-based fleet management system for radio
communication devices. Complete rewrite from legacy monolithic
architecture into modern distributed services.

<span class="info">Tech Stack:</span>
<span class="project-tech">Java Spring Boot • PostgreSQL • Docker • RESTful API • Microservices</span>

<span class="info">Key Features:</span>
• 100% API endpoint coverage with comprehensive testing
• Event-driven architecture for real-time updates
• Multi-tenant support with role-based access control
• Equipment tracking and maintenance scheduling
• Cloud-ready deployment with containerization
• Automated CI/CD pipeline

<span class="info">Highlights:</span>
• Migrated from monolithic PHP application to microservices
• Reduced response times by 85% through optimized architecture
• Implemented comprehensive unit and integration tests
• Designed for horizontal scalability

<span class="success">Status:</span> Production-ready, actively maintained
</div>`;
    }

    projectMenupilot() {
        return `<div class="project-item">
<span class="project-title">🧑‍🍳 Menu Pilot - Club Menu Order Management</span>

<span class="info">Description:</span>
Full-featured point-of-sale and inventory management system for
food service operations, including menu planning and order tracking.

<span class="info">Tech Stack:</span>
<span class="project-tech">Spring Boot • PostgreSQL • Stripe API • React • Docker</span>

<span class="info">Key Features:</span>
• Complete POS system with payment processing (Stripe integration)
• Real-time inventory tracking for food and bar items
• Menu suggestion engine based on ingredient availability
• Order management with kitchen queue system
• Reporting and analytics dashboard
• Multi-location support

<span class="info">Business Impact:</span>
• Reduced order errors by 60% with digital ordering
• Improved inventory accuracy to 95%+
• Streamlined kitchen operations with queue management
• Increased revenue through data-driven menu optimization

<span class="success">Status:</span> In production, serving multiple locations
</div>`;
    }

    projectK3sObservatory() {
        return `<div class="project-item">
<span class="project-title">🔭 k3s Observatory - 3D Cluster Visualization</span>

<span class="info">Description:</span>
An innovative 3D visualization tool for Kubernetes (k3s) clusters,
providing real-time monitoring and interactive cluster exploration.

<span class="info">Tech Stack:</span>
<span class="project-tech">Python • Three.js • k3s API • WebGL • Real-time Monitoring</span>

<span class="info">Key Features:</span>
• 3D interactive visualization of cluster topology
• Real-time node and pod status updates
• Resource utilization metrics and graphs
• Multi-cluster support
• Custom alerts and notifications
• Performance metrics dashboard

<span class="info">Innovation:</span>
• Unique approach to cluster monitoring with 3D interface
• Makes complex cluster relationships visually intuitive
• Helps identify bottlenecks and optimization opportunities

<span class="success">Status:</span> Open source project, active development
<span class="cyan">GitHub:</span> Check my repositories for source code
</div>`;
    }

    projectCounters() {
        return `<div class="project-item">
<span class="project-title">🔁 Distributed Visitors Demo - k3s Autoscaling</span>

<span class="info">Description:</span>
A demonstration project showcasing Kubernetes autoscaling capabilities
with Python and Redis on multi-node k3s clusters.

<span class="info">Tech Stack:</span>
<span class="project-tech">Python • Redis • k3s • Kubernetes • Docker • YAML Manifests</span>

<span class="info">Key Features:</span>
• Horizontal Pod Autoscaling (HPA) demonstration
• Multi-node cluster in High Availability mode
• Real-time visitor counter with Redis backend
• Load testing and performance monitoring
• Complete deployment manifests and documentation

<span class="info">Learning Resource:</span>
• Perfect for learning Kubernetes autoscaling concepts
• Demonstrates HA cluster configuration
• Shows best practices for stateful applications in k8s
• Includes step-by-step deployment guide

<span class="success">Status:</span> Educational project, fully documented
<span class="cyan">Purpose:</span> Teaching and demonstrating k8s capabilities
</div>`;
    }

    projectTckt() {
        return `<div class="project-item">
<span class="project-title">🎫 Tckt - Kitchen Queue Management on Kubernetes</span>

<span class="info">Description:</span>
Cloud-native kitchen order queueing system designed to run on
Kubernetes, optimizing food preparation workflow.

<span class="info">Tech Stack:</span>
<span class="project-tech">Python • Kubernetes • Redis • WebSockets • Docker</span>

<span class="info">Key Features:</span>
• Real-time order queue updates via WebSockets
• Priority-based ticket routing
• Kitchen station assignment
• Order timing and performance analytics
• Scalable architecture on Kubernetes

<span class="info">Technical Highlights:</span>
• Demonstrates cloud-native application design
• Implements event-driven architecture
• Shows practical Kubernetes deployment patterns
• Integrates with existing POS systems

<span class="success">Status:</span> Production deployment on k3s cluster
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
├── <span class="value">certifications.txt</span>
├── <span class="value">README.md</span>
└── <span class="info">projects/</span>
    ├── <span class="info">fleetwave/</span>
    │   └── <span class="value">info.md</span>
    ├── <span class="info">menupilot/</span>
    │   └── <span class="value">info.md</span>
    ├── <span class="info">k3s-observatory/</span>
    │   └── <span class="value">info.md</span>
    ├── <span class="info">counters-demo/</span>
    │   └── <span class="value">info.md</span>
    └── <span class="info">tckt/</span>
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

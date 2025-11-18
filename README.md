# Claude Code Agent Orchestration System v2 🚀

A comprehensive orchestration system for Claude Code that uses 8 specialized agents to manage complex projects from start to finish, with mandatory human oversight, visual testing, research capabilities, security auditing, performance optimization, and more.

## 🎯 What Is This?

This is a **production-ready Claude Code orchestration system** that transforms how you build software projects. Claude Code itself acts as the orchestrator with its 200k context window, managing the big picture while delegating individual tasks to specialized subagents:

- **🧠 Claude (You)** - The orchestrator with 200k context managing todos and the big picture
- **✍️ Coder** - Implements one todo at a time in its own clean context
- **👁️ Tester** - Visual verification using Playwright in its own context
- **🆘 Stuck** - Human escalation point when ANY problem occurs
- **🔍 Researcher** - Web research & documentation analysis with Jina AI (NEW)
- **🔒 Security Auditor** - OWASP checks & vulnerability scanning (NEW)
- **⚡ Performance Optimizer** - Lighthouse audits & optimization (NEW)
- **🔄 Recovery** - Pattern-based error recovery (NEW)

## ⚡ Key Features

- **No Fallbacks**: When ANY agent hits a problem, you get asked - no assumptions, no workarounds
- **Visual Testing**: Playwright MCP integration for screenshot-based verification
- **Todo Tracking**: Always see exactly where your project stands
- **Simple Flow**: Claude creates todos → delegates to coder → tester verifies → repeat
- **Human Control**: The stuck agent ensures you're always in the loop
- **Multi-Project Support**: Manage multiple projects with workspace system
- **Plugin Architecture**: Hot-reloadable plugins for extending functionality
- **Production Ready**: Deployment templates, monitoring dashboards, and CI/CD pipelines

## 🚀 Advanced Features

### 1. Extended Agent System (8 Agents Total)

**Core Agents:**
- **✍️ Coder** - Implementation specialist for clean, functional code
- **👁️ Tester** - Visual testing with Playwright MCP for screenshot-based verification
- **🆘 Stuck** - Human escalation for ANY problem - the only agent that can ask questions

**Specialized Agents:**
- **🔍 Researcher** - Web research & documentation analysis powered by Jina AI
  - Fetches and analyzes documentation from any URL
  - Provides context-aware insights for implementation
  - Helps answer technical questions with real-time web data

- **🔒 Security Auditor** - OWASP Top 10 checks & vulnerability scanning
  - Scans code for common security vulnerabilities
  - Checks for SQL injection, XSS, insecure dependencies
  - Provides remediation recommendations

- **⚡ Performance Optimizer** - Lighthouse audits & optimization recommendations
  - Runs Google Lighthouse audits on web applications
  - Identifies performance bottlenecks
  - Provides actionable optimization suggestions

- **🔄 Recovery** - Pattern-based error recovery system
  - Analyzes errors and suggests recovery strategies
  - Learns from common error patterns
  - Automated retry logic with exponential backoff

- **📝 Code Reviewer** - AI-powered code review and quality analysis
  - Reviews code for best practices and patterns
  - Identifies potential bugs and code smells
  - Suggests improvements and refactoring opportunities

### 2. Multi-Project Workspace System

Manage multiple projects seamlessly with the workspace system:

**Location**: `.claude/workspaces/`

**Features**:
- **Project Isolation**: Each workspace has its own configuration and todo list
- **Easy Switching**: Switch between projects without losing context
- **Workspace Templates**: Create new projects from templates
- **Project-Specific Settings**: Customize agent behavior per project

**Structure**:
```
.claude/workspaces/
├── my-app/
│   ├── workspace.json      # Project metadata
│   ├── todos.json          # Project-specific todos
│   └── config.json         # Custom configuration
├── another-project/
│   ├── workspace.json
│   ├── todos.json
│   └── config.json
└── active.json             # Tracks current workspace
```

### 3. Persistence & Metrics

**Todo Persistence** (`.claude/persistence/`):
- JSON schema-based todo storage
- Automatic save/load of todo lists
- Version control for todo history
- Cross-session persistence

**Metrics Tracking** (`.claude/metrics/`):
- Session tracking with start/end times
- Daily and weekly aggregation
- Agent performance metrics
- Success/failure rates
- All-time statistics

**Files**:
```
.claude/metrics/
├── sessions/               # Individual session logs
│   └── 2025-01-18-abc123.json
├── daily/                  # Daily aggregations
│   └── 2025-01-18.json
├── weekly/                 # Weekly summaries
│   └── 2025-W03.json
└── all-time.json          # Cumulative stats
```

### 4. Plugin System

**Location**: `.claude/plugins/`

Hot-reloadable plugin system for extending functionality without modifying core code.

**Features**:
- **Hot Reload**: Plugins load without restart
- **Sandboxed Execution**: Plugins run in isolated environments
- **Plugin CLI**: Manage plugins via command line
- **Plugin API**: Simple API for creating custom plugins

**Example Plugins Included**:
1. **hello-world**: Basic example showing plugin structure
2. **jira**: Integrate with Jira for issue tracking
3. **slack**: Send notifications to Slack channels
4. **git-analyzer**: Analyze git repository patterns

**Plugin Structure**:
```javascript
// .claude/plugins/my-plugin/index.js
module.exports = {
  name: 'my-plugin',
  version: '1.0.0',

  async initialize(api) {
    // Setup code
  },

  async execute(context) {
    // Plugin logic
  }
};
```

**Plugin CLI**:
```bash
cd .claude/plugins
./plugin-cli.js list                    # List all plugins
./plugin-cli.js enable my-plugin        # Enable a plugin
./plugin-cli.js disable my-plugin       # Disable a plugin
./plugin-cli.js test my-plugin          # Test a plugin
```

### 5. Deployment Support

**Location**: `.claude/deployment/`

Production-ready deployment templates for major platforms:

**Supported Platforms**:
- **Docker**: Multi-stage builds with optimization
- **Vercel**: Serverless deployment with edge functions
- **Netlify**: JAMstack deployments with redirects
- **Railway**: Container-based deployment
- **AWS**: EC2, ECS, Lambda configurations
- **Kubernetes**: Helm charts and manifests

**Files Included**:
```
.claude/deployment/
├── docker/
│   ├── Dockerfile
│   ├── docker-compose.yml
│   └── .dockerignore
├── vercel/
│   ├── vercel.json
│   └── api/
├── netlify/
│   ├── netlify.toml
│   └── _redirects
├── railway/
│   └── railway.json
├── aws/
│   ├── ec2-user-data.sh
│   ├── ecs-task-definition.json
│   └── lambda/
└── k8s/
    ├── deployment.yaml
    ├── service.yaml
    └── ingress.yaml
```

### 6. Monitoring Dashboards

**CLI Dashboard** (`.claude/cli-dashboard/`):
- Terminal-based real-time monitoring
- Live metrics visualization with ASCII graphs
- Agent status tracking
- Todo progress indicators
- Session statistics

**Start CLI Dashboard**:
```bash
cd .claude/cli-dashboard
./start.sh
```

**Web Dashboard** (`.claude/web-dashboard/`):
- React + Express with live WebSocket updates
- Beautiful UI with charts and graphs
- Real-time agent activity monitoring
- Historical metrics visualization
- Docker-ready with docker-compose

**Start Web Dashboard**:
```bash
cd .claude/web-dashboard
docker-compose up
# Open http://localhost:3000
```

**Features**:
- Real-time agent status
- Todo completion rates
- Performance metrics over time
- Session history
- Error tracking and analysis

### 7. Development Tools

**Changelog Generator** (`.claude/changelog/`):
- Automated changelog from git commits
- Semantic versioning support
- Categorized changes (feat, fix, docs, etc.)
- Markdown output

```bash
cd .claude/changelog
./cli.js generate                    # Generate changelog
./cli.js generate --version 2.0.0    # Generate for specific version
```

**Performance Benchmarking** (`.claude/benchmarks/`):
- **57 benchmarks** across all agents
- Measures agent response times
- Tests throughput and concurrency
- Compares agent performance

```bash
cd .claude/benchmarks
npm install
npm run bench:all                    # Run all benchmarks
npm run bench:coder                  # Benchmark coder agent
npm run bench:tester                 # Benchmark tester agent
```

**Integration Tests** (`.tests/integration/`):
- **280+ test cases** covering all agents
- End-to-end workflow testing
- Visual regression testing
- Performance regression tests

```bash
cd tests/integration
npm install
npm test                            # Run all tests
npm run test:agents                 # Test agents only
npm run test:plugins                # Test plugins
```

**CI/CD Pipeline** (`.github/workflows/`):
- **6 GitHub Actions workflows**
- Automated testing on push
- Dependency updates with Dependabot
- Security scanning
- Performance benchmarking
- Automated releases

### 8. Example Projects

**React Todo App** (`tests/examples/react-todo/`):
- Full TypeScript + Vite setup
- Component library with tests
- State management
- Comprehensive test coverage
- Production build configuration

**Express REST API** (`tests/examples/express-api/`):
- TypeScript + Prisma
- Authentication & authorization
- Database migrations
- API documentation
- Docker deployment ready

Both examples include:
- Complete test suites
- Documentation
- Deployment configurations
- CI/CD pipelines

## 🚀 Quick Start

### Prerequisites

1. **Claude Code CLI** installed ([get it here](https://docs.claude.com/en/docs/claude-code))
2. **Node.js** v18+ (for Playwright MCP and tools)

### Installation

```bash
# Clone this repository
git clone https://github.com/IncomeStreamSurfer/claude-code-agents-wizard-v2.git
cd claude-code-agents-wizard-v2

# Start Claude Code in this directory
claude
```

That's it! The agents are automatically loaded from the `.claude/` directory.

### Quick Start Examples

**1. Use the CLI Dashboard**:
```bash
cd .claude/cli-dashboard
./start.sh
```

**2. Start Web Dashboard**:
```bash
cd .claude/web-dashboard
docker-compose up
# Open http://localhost:3000
```

**3. Run Benchmarks**:
```bash
cd .claude/benchmarks
npm install
npm run bench:all
```

**4. Generate Changelog**:
```bash
cd .claude/changelog
./cli.js generate
```

**5. Run Integration Tests**:
```bash
cd tests/integration
npm install
npm test
```

**6. Try Example Projects**:
```bash
# React Todo App
cd tests/examples/react-todo
npm install
npm run dev

# Express API
cd tests/examples/express-api
npm install
npm run dev
```

## 📖 How to Use

### Starting a Project

When you want to build something, just tell Claude your requirements:

```
You: "Build a todo app with React and TypeScript"
```

Claude will automatically:
1. Create a detailed todo list using TodoWrite
2. Delegate the first todo to the **coder** subagent
3. The coder implements in its own clean context window
4. Delegate verification to the **tester** subagent (Playwright screenshots)
5. If ANY problem occurs, the **stuck** subagent asks you what to do
6. Mark todo complete and move to the next one
7. Repeat until project complete

### The Workflow

```
USER: "Build X"
    ↓
CLAUDE: Creates detailed todos with TodoWrite
    ↓
CLAUDE: Invokes coder subagent for todo #1
    ↓
CODER (own context): Implements feature
    ↓
    ├─→ Problem? → Invokes STUCK → You decide → Continue
    ↓
CODER: Reports completion
    ↓
CLAUDE: Invokes tester subagent
    ↓
TESTER (own context): Playwright screenshots & verification
    ↓
    ├─→ Test fails? → Invokes STUCK → You decide → Continue
    ↓
TESTER: Reports success
    ↓
CLAUDE: Marks todo complete, moves to next
    ↓
Repeat until all todos done ✅
```

## 📁 Repository Structure

```
.
├── .claude/
│   ├── CLAUDE.md              # Orchestration instructions for main Claude
│   ├── agents/                # 8 specialized agents
│   │   ├── coder.md          # Implementation specialist
│   │   ├── tester.md         # Visual testing with Playwright
│   │   ├── stuck.md          # Human escalation
│   │   ├── researcher.md     # Web research & docs (NEW)
│   │   ├── security.md       # Security auditing (NEW)
│   │   ├── performance.md    # Performance optimization (NEW)
│   │   ├── recovery.md       # Error recovery (NEW)
│   │   └── reviewer.md       # Code review (NEW)
│   ├── workspaces/            # Multi-project support
│   │   ├── my-app/
│   │   │   ├── workspace.json
│   │   │   ├── todos.json
│   │   │   └── config.json
│   │   └── active.json
│   ├── persistence/           # Todo persistence layer
│   │   ├── schema.json
│   │   └── store.js
│   ├── metrics/               # Session & performance metrics
│   │   ├── sessions/
│   │   ├── daily/
│   │   ├── weekly/
│   │   └── all-time.json
│   ├── plugins/               # Hot-reloadable plugin system
│   │   ├── hello-world/
│   │   ├── jira/
│   │   ├── slack/
│   │   ├── git-analyzer/
│   │   └── plugin-cli.js
│   ├── deployment/            # Deployment templates
│   │   ├── docker/
│   │   ├── vercel/
│   │   ├── netlify/
│   │   ├── railway/
│   │   ├── aws/
│   │   └── k8s/
│   ├── cli-dashboard/         # Terminal monitoring tool
│   │   ├── start.sh
│   │   └── dashboard.js
│   ├── web-dashboard/         # Web-based monitoring
│   │   ├── frontend/          # React dashboard
│   │   ├── backend/           # Express + WebSocket
│   │   └── docker-compose.yml
│   ├── changelog/             # Changelog generator
│   │   ├── cli.js
│   │   └── templates/
│   └── benchmarks/            # Performance benchmarks
│       ├── package.json
│       └── suites/
├── .github/
│   └── workflows/             # CI/CD pipelines (6 workflows)
│       ├── test.yml
│       ├── benchmark.yml
│       ├── security.yml
│       ├── deploy.yml
│       ├── dependabot.yml
│       └── release.yml
├── tests/
│   ├── integration/           # 280+ integration tests
│   │   ├── agents/
│   │   ├── plugins/
│   │   └── workflows/
│   └── examples/              # Example projects
│       ├── react-todo/        # React + TypeScript + Vite
│       └── express-api/       # Express + TypeScript + Prisma
├── .mcp.json                  # Playwright MCP configuration
├── .gitignore
└── README.md
```

## 📊 Project Statistics

- **Total Agents**: 8 specialized agents (4 core + 4 specialized)
- **Total Files**: 200+ files across the system
- **Integration Tests**: 280+ test cases
- **Benchmarks**: 57 performance benchmarks
- **Example Projects**: 2 production-ready examples
- **Deployment Platforms**: 6 supported platforms
- **Plugin Examples**: 4 example plugins included
- **CI/CD Workflows**: 6 GitHub Actions workflows
- **Documentation**: Comprehensive guides throughout

## 🛠️ How It Works

### Claude (The Orchestrator)
**Your 200k Context Window**

- Creates and maintains comprehensive todo lists
- Sees the complete project from A-Z
- Delegates individual todos to specialized subagents
- Tracks overall progress across all tasks
- Maintains project state and context

**How it works**: Claude IS the orchestrator - it uses its 200k context to manage everything

### Coder Subagent
**Fresh Context Per Task**

- Gets invoked with ONE specific todo item
- Works in its own clean context window
- Writes clean, functional code
- **Never uses fallbacks** - invokes stuck agent immediately
- Reports completion back to Claude

**When it's used**: Claude delegates each coding todo to this subagent

### Tester Subagent
**Fresh Context Per Verification**

- Gets invoked after each coder completion
- Works in its own clean context window
- Uses **Playwright MCP** to see rendered output
- Takes screenshots to verify layouts
- Tests interactions (clicks, forms, navigation)
- **Never marks failing tests as passing**
- Reports pass/fail back to Claude

**When it's used**: Claude delegates testing after every implementation

### Stuck Subagent
**Fresh Context Per Problem**

- Gets invoked when coder or tester hits a problem
- Works in its own clean context window
- **ONLY subagent** that can ask you questions
- Presents clear options for you to choose
- Blocks progress until you respond
- Returns your decision to the calling agent
- Ensures no blind fallbacks or workarounds

**When it's used**: Whenever ANY subagent encounters ANY problem

### Researcher Subagent
**Fresh Context Per Research Task**

- Fetches documentation from URLs using Jina AI
- Analyzes documentation for relevant information
- Provides context-aware insights
- Helps answer technical questions with real-time data

**When it's used**: When implementation needs external documentation or research

### Security Auditor Subagent
**Fresh Context Per Security Scan**

- Scans code for OWASP Top 10 vulnerabilities
- Checks dependencies for known CVEs
- Identifies security anti-patterns
- Provides remediation recommendations

**When it's used**: After implementations to ensure security best practices

### Performance Optimizer Subagent
**Fresh Context Per Optimization**

- Runs Google Lighthouse audits
- Identifies performance bottlenecks
- Analyzes bundle sizes and load times
- Provides actionable optimization suggestions

**When it's used**: To optimize application performance

### Recovery Subagent
**Fresh Context Per Error**

- Analyzes error patterns
- Suggests recovery strategies
- Implements retry logic
- Learns from common failures

**When it's used**: When errors occur that have known recovery patterns

## 🚨 The "No Fallbacks" Rule

**This is the key differentiator:**

Traditional AI: Hits error → tries workaround → might fail silently
**This system**: Hits error → asks you → you decide → proceeds correctly

Every agent is **hardwired** to invoke the stuck agent rather than use fallbacks. You stay in control.

## 💡 Example Session

```
You: "Build a landing page with a contact form"

Claude creates todos:
  [ ] Set up HTML structure
  [ ] Create hero section
  [ ] Add contact form with validation
  [ ] Style with CSS
  [ ] Test form submission

Claude invokes coder(todo #1: "Set up HTML structure")

Coder (own context): Creates index.html
Coder: Reports completion to Claude

Claude invokes tester("Verify HTML structure loads")

Tester (own context): Uses Playwright to navigate
Tester: Takes screenshot
Tester: Verifies HTML structure visible
Tester: Reports success to Claude

Claude: Marks todo #1 complete ✓

Claude invokes coder(todo #2: "Create hero section")

Coder (own context): Implements hero section
Coder: ERROR - image file not found
Coder: Invokes stuck subagent

Stuck (own context): Asks YOU:
  "Hero image 'hero.jpg' not found. How to proceed?"
  Options:
  - Use placeholder image
  - Download from Unsplash
  - Skip image for now

You choose: "Download from Unsplash"

Stuck: Returns your decision to coder
Coder: Proceeds with Unsplash download
Coder: Reports completion to Claude

... and so on until all todos done
```

## 🎓 Learn More

### Resources

- **[SEO Grove](https://seogrove.ai)** - AI-powered SEO automation platform
- **[ISS AI Automation School](https://www.skool.com/iss-ai-automation-school-6342/about)** - Join our community to learn AI automation
- **[Income Stream Surfers YouTube](https://www.youtube.com/incomestreamsurfers)** - Tutorials, breakdowns, and AI automation content

### Support

Have questions or want to share what you built?
- Join the [ISS AI Automation School community](https://www.skool.com/iss-ai-automation-school-6342/about)
- Subscribe to [Income Stream Surfers on YouTube](https://www.youtube.com/incomestreamsurfers)
- Check out [SEO Grove](https://seogrove.ai) for automated SEO solutions

## 🤝 Contributing

This is an open system! Feel free to:
- Add new specialized agents
- Improve existing agent prompts
- Share your agent configurations
- Submit PRs with enhancements
- Create new plugins
- Add deployment templates

## 📝 How It Works Under the Hood

This system leverages Claude Code's [subagent system](https://docs.claude.com/en/docs/claude-code/sub-agents):

1. **CLAUDE.md** instructs main Claude to be the orchestrator
2. **Subagents** are defined in `.claude/agents/*.md` files
3. **Each subagent** gets its own fresh context window
4. **Main Claude** maintains the 200k context with todos and project state
5. **Playwright MCP** is configured in `.mcp.json` for visual testing
6. **Plugins** extend functionality via hot-reloadable modules
7. **Metrics** track performance and provide insights
8. **Workspaces** enable multi-project management

The magic happens because:
- **Claude (200k context)** = Maintains big picture, manages todos
- **Coder (fresh context)** = Implements one task at a time
- **Tester (fresh context)** = Verifies one implementation at a time
- **Stuck (fresh context)** = Handles one problem at a time with human input
- **Specialized agents** = Handle specific tasks (research, security, performance, recovery)
- **Each subagent** has specific tools and hardwired escalation rules

## 🎯 Best Practices

1. **Trust Claude** - Let it create and manage the todo list
2. **Review screenshots** - The tester provides visual proof of every implementation
3. **Make decisions when asked** - The stuck agent needs your guidance
4. **Don't interrupt the flow** - Let subagents complete their work
5. **Check the todo list** - Always visible, tracks real progress
6. **Use monitoring dashboards** - Track progress in real-time
7. **Review metrics** - Learn from performance data
8. **Leverage plugins** - Extend functionality as needed
9. **Run benchmarks** - Ensure performance meets requirements
10. **Deploy with templates** - Use provided deployment configurations

## 🔥 Pro Tips

- Use `/agents` command to see all available subagents
- Claude maintains the todo list in its 200k context - check anytime
- Screenshots from tester are saved and can be reviewed
- Each subagent has specific tools - check their `.md` files
- Subagents get fresh contexts - no context pollution!
- Use the CLI dashboard for real-time monitoring
- Check metrics to identify bottlenecks
- Create custom plugins for project-specific needs
- Use example projects as templates for new projects
- Run integration tests before major deployments

## 📜 License

MIT - Use it, modify it, share it!

## 🙏 Credits

Built by [Income Stream Surfer](https://www.youtube.com/incomestreamsurfers)

Powered by Claude Code's agent system and Playwright MCP.

Special thanks to:
- Anthropic for Claude Code
- Jina AI for research capabilities
- Google for Lighthouse performance audits
- The open-source community

---

**Ready to build something amazing?** Just run `claude` in this directory and tell it what you want to create! 🚀

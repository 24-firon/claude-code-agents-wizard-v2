# Build an Entire Fake Software Company with Claude Code 🚀

Turn a single idea into a complete software product using 12 specialized AI agents working together like a real startup team.

Inspired by the viral Reddit post about building a fake company with Claude Code, this is a complete software company simulation where you're the CEO and Claude Code orchestrates 12 specialized agents from strategy to deployment.

## 🎯 What Is This?

This is a **complete software company simulation** built on Claude Code's agent orchestration system. Give it a product idea, and watch as 12 specialized AI agents collaborate like a real startup team to:

- Define product strategy and vision (CPO)
- Plan features and roadmap (Product Manager)
- Design brand and marketing (Marketer)
- Create user experience (UX Designer)
- Design interfaces (Product Designer)
- Architect the system (Software Architect)
- Design the database (DBA)
- Build the frontend (Frontend Developer)
- Build the backend (Backend Engineer)
- Secure the application (Security Engineer)
- Test everything (QA Engineer)
- Deploy to production (DevOps Engineer)

**You're the CEO. They're your team. Let's build something amazing.**

## 🏢 Meet Your Complete Team

### Strategy Phase

**Chief Product Officer (CPO)**
- Defines product vision and strategy
- Creates go-to-market plans
- Sets success metrics and KPIs
- Makes high-level product decisions

**Senior Product Manager**
- Translates vision into detailed requirements
- Creates user stories and acceptance criteria
- Prioritizes features and roadmap
- Manages product backlog

**Marketer**
- Develops brand identity and messaging
- Creates marketing copy and content
- Plans customer acquisition strategy
- Designs landing pages and campaigns

### Design Phase

**UX Designer**
- Creates user flows and journeys
- Designs information architecture
- Plans user interactions
- Creates wireframes and prototypes

**Product Designer**
- Designs complete visual interfaces
- Creates design systems and components
- Ensures brand consistency
- Produces high-fidelity mockups

### Architecture Phase

**Software Architect**
- Designs system architecture
- Chooses technology stack
- Plans scalability and performance
- Creates technical specifications

**Database Administrator (DBA)**
- Designs database schema
- Plans data models and relationships
- Optimizes queries and performance
- Ensures data integrity and security

### Engineering Phase

**Frontend Developer**
- Implements user interfaces
- Builds responsive layouts
- Integrates with backend APIs
- Ensures cross-browser compatibility

**Backend Engineer**
- Builds server-side logic
- Creates RESTful APIs
- Implements business logic
- Manages data persistence

**App Security Engineer**
- Implements authentication and authorization
- Secures APIs and endpoints
- Prevents common vulnerabilities (XSS, CSRF, SQL injection)
- Conducts security audits

### Quality Phase

**Senior QA Engineer**
- Creates comprehensive test plans
- Writes automated tests
- Performs visual testing with Playwright
- Validates functionality across scenarios

### Deployment Phase

**DevOps Engineer**
- Sets up CI/CD pipelines
- Configures production infrastructure
- Manages deployments
- Monitors and maintains systems

### Human Escalation

**Stuck Agent**
- Escalates to you (the CEO) when any agent hits a problem
- Presents clear options for decision-making
- Ensures no fallbacks or workarounds
- Keeps you in control of all critical decisions

## ⚡ How It Works

Claude Code with its 200k context window acts as the **orchestrator** - like a VP of Engineering managing the entire team. Here's the complete workflow:

### The 6 Phases

**Phase 1: Strategy**
1. CPO defines product vision and strategy
2. Senior PM creates detailed requirements and user stories
3. Marketer develops brand identity and messaging

**Phase 2: Design**
4. UX Designer creates user flows and wireframes
5. Product Designer builds high-fidelity mockups

**Phase 3: Architecture**
6. Software Architect designs system architecture
7. DBA designs database schema

**Phase 4: Engineering**
8. Frontend Developer builds the UI
9. Backend Engineer builds the API
10. Security Engineer secures the application

**Phase 5: Quality**
11. QA Engineer tests everything with Playwright

**Phase 6: Deployment**
12. DevOps Engineer deploys to production

**Throughout:** Stuck agent escalates any problems to you for decisions

### The Orchestration Flow

```
YOU (CEO): "Build a SaaS task management app"
    ↓
CLAUDE (Orchestrator): Creates comprehensive todo list
    ↓
PHASE 1: STRATEGY
├─→ Invokes CPO → Product vision & strategy
├─→ Invokes Senior PM → Requirements & user stories
└─→ Invokes Marketer → Brand identity & messaging
    ↓
PHASE 2: DESIGN
├─→ Invokes UX Designer → User flows & wireframes
└─→ Invokes Product Designer → High-fidelity mockups
    ↓
PHASE 3: ARCHITECTURE
├─→ Invokes Software Architect → System architecture
└─→ Invokes DBA → Database schema
    ↓
PHASE 4: ENGINEERING
├─→ Invokes Frontend Developer → UI implementation
├─→ Invokes Backend Engineer → API implementation
└─→ Invokes Security Engineer → Security implementation
    ↓
PHASE 5: QUALITY
└─→ Invokes QA Engineer → Comprehensive testing
    ↓
PHASE 6: DEPLOYMENT
└─→ Invokes DevOps Engineer → Production deployment
    ↓
CLAUDE: Project complete! ✅
```

At **any point**, if an agent encounters a problem, they invoke the **stuck agent** which escalates to you for a decision.

## 🚀 Quick Start

### Prerequisites

1. **Claude Code CLI** installed ([get it here](https://docs.claude.com/en/docs/claude-code))
2. **Node.js** (for Playwright MCP and development)

### Installation

```bash
# Clone this repository
git clone https://github.com/IncomeStreamSurfer/claude-code-agents-wizard-v2.git
cd claude-code-agents-wizard-v2

# Start Claude Code in this directory
claude
```

That's it! Your entire fake company is ready to go.

### Starting Your First Project

Just tell Claude what you want to build:

```
You: "Build a modern SaaS landing page with pricing tiers and a contact form"
```

Claude will:
1. Create a comprehensive todo list covering all 6 phases
2. Delegate to each specialized agent in sequence
3. Ask you for decisions when needed (via stuck agent)
4. Test everything with Playwright
5. Deploy to production
6. Report completion with all deliverables

## 💡 Complete Example Workflow

Let's see the fake company build a real project:

### Project: "Build a blog platform with authentication"

**Phase 1: Strategy (CPO → PM → Marketer)**

```
Claude invokes CPO:
→ CPO creates product vision:
  - Target: content creators and bloggers
  - Value prop: simple, fast, SEO-optimized
  - Success metrics: user signups, posts created

Claude invokes Senior PM:
→ PM creates user stories:
  - As a user, I can sign up and log in
  - As a user, I can create and edit blog posts
  - As a user, I can publish posts publicly
  - As a reader, I can view published posts

Claude invokes Marketer:
→ Marketer creates brand:
  - Name: "BlogFlow"
  - Tagline: "Blogging made effortless"
  - Color scheme: Blue & white, clean and modern
  - Landing page copy and CTAs
```

**Phase 2: Design (UX → Product Designer)**

```
Claude invokes UX Designer:
→ UX creates user flows:
  - Authentication flow (signup → verify → login)
  - Blog creation flow (draft → edit → publish)
  - Reader flow (browse → read → share)
  - Wireframes for all pages

Claude invokes Product Designer:
→ Designer creates mockups:
  - Login/signup pages
  - Dashboard with post list
  - Blog post editor (rich text)
  - Public blog post view
  - Design system with components
```

**Phase 3: Architecture (Software Architect → DBA)**

```
Claude invokes Software Architect:
→ Architect designs system:
  - Tech stack: React + TypeScript frontend
  - Node.js + Express backend
  - PostgreSQL database
  - JWT authentication
  - RESTful API architecture

Claude invokes DBA:
→ DBA designs database:
  - Users table (id, email, password_hash, created_at)
  - Posts table (id, user_id, title, content, published, created_at)
  - Schema with foreign keys and indexes
```

**Phase 4: Engineering (Frontend → Backend → Security)**

```
Claude invokes Frontend Developer:
→ Frontend builds UI:
  - React app with TypeScript
  - Login/signup forms
  - Dashboard with post list
  - Rich text editor for posts
  - Public post viewing pages

Frontend hits error: Rich text editor library not found
→ Frontend invokes Stuck agent
→ Stuck asks YOU: "Which rich text editor library?"
  Options: TipTap, Slate, Draft.js
→ You choose: "TipTap"
→ Frontend continues with TipTap

Claude invokes Backend Engineer:
→ Backend builds API:
  - Express server with TypeScript
  - REST endpoints: /auth/signup, /auth/login
  - REST endpoints: /posts (CRUD operations)
  - Connects to PostgreSQL

Claude invokes Security Engineer:
→ Security secures app:
  - Implements JWT authentication
  - Adds password hashing (bcrypt)
  - Prevents SQL injection
  - Adds CORS configuration
  - Implements rate limiting
```

**Phase 5: Quality (QA Engineer)**

```
Claude invokes QA Engineer:
→ QA tests everything:
  - Uses Playwright to test signup flow
  - Takes screenshots of login page
  - Tests blog post creation
  - Tests publishing flow
  - Verifies public posts are visible
  - All tests pass ✅
```

**Phase 6: Deployment (DevOps Engineer)**

```
Claude invokes DevOps Engineer:
→ DevOps deploys:
  - Creates Docker containers
  - Sets up CI/CD with GitHub Actions
  - Configures environment variables
  - Deploys to production (Vercel + Railway)
  - Project live at blogflow.com ✅
```

**Result:**
- Complete product vision and strategy
- Detailed requirements and user stories
- Brand identity and marketing messaging
- Complete UX flows and wireframes
- Professional UI designs
- System architecture documentation
- Database schema
- Working frontend application
- Working backend API
- Secured authentication
- Comprehensive test suite
- Deployed to production

**All from a single prompt!**

## 📁 Repository Structure

```
.
├── .claude/
│   ├── CLAUDE.md                       # Orchestration instructions for Claude
│   └── agents/
│       ├── chief-product-officer.md   # CPO agent (strategy)
│       ├── senior-product-manager.md  # PM agent (requirements)
│       ├── marketer.md                # Marketing agent (brand)
│       ├── ux-designer.md             # UX agent (wireframes)
│       ├── product-designer.md        # Designer agent (mockups)
│       ├── software-architect.md      # Architect agent (system design)
│       ├── dba.md                     # DBA agent (database)
│       ├── frontend-developer.md      # Frontend agent (UI)
│       ├── backend-engineer.md        # Backend agent (API)
│       ├── app-security-engineer.md   # Security agent (auth & security)
│       ├── senior-qa-engineer.md      # QA agent (testing)
│       ├── devops-engineer.md         # DevOps agent (deployment)
│       ├── stuck.md                   # Stuck agent (human escalation)
│       ├── coder.md                   # Legacy coder agent
│       └── tester.md                  # Legacy tester agent
├── .mcp.json                           # Playwright MCP configuration
├── .gitignore
└── README.md
```

## 🎯 Why This Works

### Specialized Contexts
Each agent gets a **fresh, focused context window** for their specific expertise:
- CPO thinks about strategy, not code
- Frontend dev thinks about UI, not database
- Security engineer focuses only on security
- No context pollution, no confusion

### Orchestration
Claude with its **200k context window** maintains:
- Complete project vision across all phases
- Comprehensive todo list tracking progress
- Context from all agent interactions
- Big picture from idea to deployment

### Human-in-the-Loop
The **stuck agent** ensures:
- No blind assumptions or fallbacks
- You make all critical decisions
- Agents present options, you choose
- Complete control over your project

### Real Company Workflow
Mimics how real startups work:
- Strategy before design
- Design before engineering
- Security integrated into development
- Testing throughout
- DevOps handles deployment

## 🎓 Best Practices

### 1. Start with a Clear Vision
Give Claude enough detail to work with:

**Good:**
```
"Build a SaaS project management tool for remote teams with
kanban boards, time tracking, and team chat"
```

**Too Vague:**
```
"Build a web app"
```

### 2. Trust the Process
Let each agent do their job:
- Let CPO define strategy before jumping to code
- Let designers create mockups before development
- Let QA test thoroughly
- Don't skip phases

### 3. Make Decisions When Asked
When the stuck agent asks you something:
- Read the options carefully
- Choose based on your project needs
- Don't ignore escalations

### 4. Review Deliverables
Each agent produces specific outputs:
- CPO: Product vision docs
- PM: User stories and requirements
- Marketer: Brand guidelines and copy
- Designers: Wireframes and mockups
- Engineers: Working code
- QA: Test results and screenshots
- DevOps: Deployment URLs

### 5. Use Playwright Testing
The QA engineer uses Playwright to:
- Take screenshots of your app
- Test interactions and flows
- Verify visual layouts
- Ensure everything works

### 6. Iterate if Needed
If tests fail or you want changes:
- The stuck agent will ask what to do
- You can request modifications
- Agents will iterate until it's right

## 💡 Pro Tips

- **Check progress anytime:** Claude maintains the complete todo list in its 200k context
- **Review screenshots:** QA engineer provides visual proof of every feature
- **See all agents:** Use `/agents` command to see your complete team
- **Customize agents:** Edit agent files in `.claude/agents/` to adjust behavior
- **Add new agents:** Create new specialized roles for specific needs

## 🔥 Advanced Use Cases

### Multi-Project Company
Use the same team for multiple projects:
```
"Build three landing pages for different products"
```
The team will work on each one sequentially.

### Iterative Development
Build an MVP, then enhance:
```
"Build a basic todo app"
... team builds MVP ...
"Now add user authentication and cloud sync"
... team adds features ...
```

### Specific Phase Focus
Only use certain phases:
```
"I need a complete product strategy and design
for a fitness tracking app - no development yet"
```
Claude will only invoke Strategy and Design phase agents.

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

Want to make the fake company better?

**Add new specialized agents:**
- Sales Engineer (demos and sales enablement)
- Data Analyst (analytics and insights)
- Content Writer (documentation and blog posts)
- Customer Support (help docs and FAQs)

**Improve existing agents:**
- Enhance agent prompts and instructions
- Add new tools and capabilities
- Share your agent configurations

**Submit PRs:**
- Fork the repository
- Create your feature branch
- Submit a pull request

## 🚨 Important Notes

### The "No Fallbacks" Rule
Every agent is hardwired to:
- **Never** use workarounds when they hit problems
- **Never** make assumptions about unclear requirements
- **Always** invoke the stuck agent for human decisions
- **Always** report exactly what happened

This ensures you stay in control and nothing fails silently.

### Playwright MCP Integration
The QA Engineer uses Playwright to:
- Actually render your app in a browser
- Take real screenshots
- Test real interactions
- Provide visual proof

Make sure Playwright MCP is configured in `.mcp.json`.

### Context Window Magic
The system works because:
- **Claude (200k)** sees everything and orchestrates
- **Each agent (fresh)** focuses only on their job
- **No interference** between agent contexts
- **Clean handoffs** between phases

## 🎉 What Can You Build?

The fake company can build almost anything:

**SaaS Products:**
- Project management tools
- CRM systems
- Marketing automation platforms
- Analytics dashboards

**Content Platforms:**
- Blog platforms
- Social networks
- Video streaming sites
- Course platforms

**E-commerce:**
- Online stores
- Marketplace platforms
- Subscription services
- Booking systems

**Mobile Apps:**
- React Native apps
- Progressive web apps
- Hybrid mobile experiences

**Enterprise Tools:**
- Admin dashboards
- Internal tools
- Workflow automation
- Reporting systems

## 📜 License

MIT License - Use it, modify it, share it, build amazing things with it!

## 🙏 Credits

Built by [Income Stream Surfer](https://www.youtube.com/incomestreamsurfers)

Inspired by the viral Reddit post about building a fake company with Claude Code.

Powered by:
- Claude Code's agent orchestration system
- Playwright MCP for visual testing
- The amazing Claude Sonnet 4.5 model

---

## 🚀 Ready to Start Your Fake Company?

```bash
cd claude-code-agents-wizard-v2
claude
```

Then just say:

```
"Build me a [your idea here]"
```

And watch your fake company turn it into reality! 🎯

Your 12-person startup team is waiting. Let's build something amazing together.

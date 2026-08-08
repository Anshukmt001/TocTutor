# TOCTutor 🎓

> **An interactive web-based learning platform for Theory of Computation
> (TOC)**

TOCTutor is an educational platform designed to help students learn and
practice **Theory of Computation** through interactive tools, structured
learning content, quizzes, progress tracking, and an AI-powered tutor.

The project focuses on making traditionally theoretical TOC concepts
more visual, practical, and engaging.

------------------------------------------------------------------------

## ✨ Features

### 📊 Student Dashboard

-   Personalized student dashboard
-   Tracks time spent learning
-   Displays latest quiz score
-   Shows learning/progress statistics
-   Quick access to all major TOC modules

### 🔐 Student & Administrator Authentication

-   Student registration and login
-   Administrator login
-   Role-based access between student and admin views
-   Session information stored in browser `localStorage`
-   Automatic authentication guard for protected pages

### 🧠 TOC Learning Library

The Library provides structured explanations and examples for important
Theory of Computation concepts, including: - DFA --- Deterministic
Finite Automata - NFA --- Nondeterministic Finite Automata - Regular
Languages - Grammars - Turing Machines - Complexity-related concepts -
Formal definitions, examples, use cases, and explanations

Mathematical notation is rendered using **KaTeX**.

### 🧩 Turing / DFA Lab

An interactive visual automata laboratory where students can: - Create
states - Add transitions - Set a start state - Set accepting states -
Clear the automaton - Simulate an input string - Observe whether the
string is accepted or rejected

The simulator uses an HTML `<canvas>` for interactive visualization.

### 🔄 NFA → DFA Converter

A dedicated converter based on the **subset construction algorithm**.

Students can: - Enter an NFA definition - Generate a DFA - Use random
NFA examples - Study the conversion process - Understand how
nondeterministic states become DFA state subsets

### 📝 Exam Center

-   Timed quizzes
-   Multiple-choice questions
-   Question-by-question navigation
-   Automatic score calculation
-   Final result display
-   Latest score synchronization with the student dashboard
-   Student performance storage

### 🛠️ Administrator Dashboard

Administrators can: - View registered students - Monitor student
information - Create/publish quizzes - Select TOC topics - Generate
sample quiz questions - Push an active quiz to the Student Exam Center -
Manage learning-platform data stored in the browser

### 🤖 AI TOC Tutor

TOCTutor includes an AI chatbot designed specifically for Theory of
Computation.

The chatbot is configured to help with: - DFA - NFA - Turing Machines -
Grammars - Complexity - Mathematical explanations - TOC-related
questions

The current implementation is configured to communicate with a **local
Ollama-compatible API** using the `llama3.2:1b` model.

### 🎨 Modern UI

-   Dark glassmorphism interface
-   Responsive sidebar navigation
-   Neon-style visual accents
-   Interactive cards and buttons
-   Phosphor icons
-   Responsive layouts
-   Animated/confetti feedback for quiz and admin actions

------------------------------------------------------------------------

## 🏗️ Technology Stack

  Technology          Purpose
  ------------------- --------------------------------------------------
  HTML5               Page structure
  CSS3                Styling, responsive design, glassmorphism UI
  JavaScript (ES6+)   Application logic and interactivity
  HTML Canvas         DFA visualization and simulation
  LocalStorage API    Authentication, progress, quiz and registry data
  KaTeX               Mathematical formula rendering
  Marked.js           Markdown rendering
  Phosphor Icons      UI icons
  Google Fonts        Outfit typography
  Canvas Confetti     Success/result animations
  Ollama              Local AI chatbot backend
  GitHub Actions      Automated GitHub Pages deployment
  GitHub Pages        Static website hosting

------------------------------------------------------------------------

## 📁 Project Structure

``` text
TocTutor/
│
├── .github/
│   └── workflows/
│       └── static.yml          # GitHub Pages deployment workflow
│
├── js/
│   ├── chatbot.js              # AI TOC Tutor logic
│   ├── converter.js            # NFA → DFA conversion
│   ├── dashboard.js            # Dashboard statistics/progress
│   ├── exam.js                 # Quiz and exam logic
│   ├── lab.js                  # Interactive DFA simulator
│   └── library.js              # TOC learning library
│
├── admin.html                  # Administrator dashboard
├── converter.html              # NFA → DFA Converter
├── exam.html                   # Student Exam Center
├── index.html                  # Student Dashboard
├── index.css                   # Global styling
├── library.html                # TOC Learning Library
├── login.html                  # Login/registration
├── shared.js                   # Shared authentication/UI logic
└── turing.html                 # Interactive DFA/Turing Lab
```

------------------------------------------------------------------------

## 🚀 Getting Started

TOCTutor is a **static web application**, so no Node.js or backend
installation is required for the core platform.

### 1. Clone the repository

``` bash
git clone https://github.com/anshukmt001/TocTutor.git
cd TocTutor
```

### 2. Open the project

You can simply open:

``` text
login.html
```

in a modern web browser.

For a better development experience, use a local static server.

### 3. Run with VS Code Live Server

Install the **Live Server** extension in VS Code and open:

``` text
login.html
```

using **Open with Live Server**.

Alternatively, any static HTTP server can be used.

------------------------------------------------------------------------

## 🔑 Authentication

The current version uses browser `localStorage` rather than a production
database.

### Student

Students can create an account through the registration flow and then
log in to access the platform.

### Administrator

The current source code contains a demonstration administrator login
implemented directly in `login.html`.

> ⚠️ **Security note:** The current admin credentials are hard-coded for
> demonstration purposes. This is suitable only for a college/demo
> project. A production deployment should use a secure backend, hashed
> passwords, sessions/JWT, HTTPS, and server-side authorization.

------------------------------------------------------------------------

## 🤖 Setting Up the AI Tutor

The AI Tutor is configured in:

``` text
js/chatbot.js
```

The current configuration uses:

``` text
Model: llama3.2:1b
API: http://localhost:11434/v1/chat/completions
```

### Install Ollama

Install Ollama from its official website and pull the configured model:

``` bash
ollama pull llama3.2:1b
```

Start Ollama if it is not already running:

``` bash
ollama serve
```

Then open TOCTutor through a local HTTP server and use the AI Tutor.

> If the AI service is unavailable, the rest of the static learning
> platform can still be used.

------------------------------------------------------------------------

## 💾 Data Storage

The current application is intentionally lightweight and uses browser
`localStorage`.

Important stored values include:

  Storage Key          Purpose
  -------------------- -----------------------------------
  `currentUser`        Current logged-in user
  `studentRegistry`    Registered student information
  `timeSpentSeconds`   Learning time
  `latestScore`        Latest quiz score
  `activeQuiz`         Quiz currently published by admin

Because the data is stored in the browser: - Data is device/browser
specific. - Clearing browser storage can remove saved data. - There is
no centralized database in the current version. - It should not be used
for sensitive production data.

------------------------------------------------------------------------

## 🔄 Application Flow

``` text
                    ┌─────────────────┐
                    │   Login / Sign  │
                    │      Up         │
                    └────────┬────────┘
                             │
                 ┌───────────┴───────────┐
                 │                       │
             Student                  Admin
                 │                       │
                 ▼                       ▼
        ┌─────────────────┐     ┌─────────────────┐
        │ Student         │     │ Admin Dashboard │
        │ Dashboard       │     └────────┬────────┘
        └───────┬─────────┘              │
                │                        │
       ┌────────┼─────────┐              │
       │        │         │              │
       ▼        ▼         ▼              ▼
    Library   TOC Lab   Converter     Quiz Creation
       │        │         │              │
       │        │         │              ▼
       │        │         │         Active Quiz
       │        │         │              │
       └────────┴─────────┴──────────────┘
                         │
                         ▼
                  ┌─────────────┐
                  │ Exam Center │
                  └──────┬──────┘
                         │
                         ▼
                  Score / Progress
```

------------------------------------------------------------------------

## 🧮 NFA → DFA Conversion

The Converter implements the **subset construction** approach.

Conceptually:

``` text
NFA
 │
 ├── Read states
 ├── Read alphabet
 ├── Determine reachable state sets
 ├── Create DFA states from subsets
 ├── Generate DFA transitions
 └── Identify accepting DFA states
         │
         ▼
        DFA
```

This helps students understand the theoretical conversion algorithm
through an interactive interface.

------------------------------------------------------------------------

## 🧪 DFA Simulation

The Lab allows students to construct an automaton visually.

Typical workflow:

``` text
1. Add states
2. Add transitions
3. Select start state
4. Select accepting state
5. Enter an input string
6. Run simulation
7. Observe Accept / Reject result
```

This provides hands-on practice with DFA state transitions and language
recognition.

------------------------------------------------------------------------

## 📚 Learning Experience

TOCTutor combines several learning methods:

``` text
Learn → Visualize → Practice → Test → Track
```

### Learn

Use the Library for definitions, formal notation, examples, and
applications.

### Visualize

Use the interactive automata Lab.

### Practice

Experiment with DFA states and NFA → DFA conversion.

### Test

Take timed quizzes in the Exam Center.

### Track

Review scores and learning time from the Dashboard.

------------------------------------------------------------------------

## 🌐 Deployment on GitHub Pages

The project already includes a GitHub Actions workflow:

``` text
.github/workflows/static.yml
```

The workflow automatically deploys the repository to **GitHub Pages**
when changes are pushed to the `main` branch.

### Deployment steps

1.  Push the project to GitHub.
2.  Go to **Repository → Settings → Pages**.
3.  Select GitHub Actions as the deployment source if required.
4.  Push changes to `main`.
5.  GitHub Actions builds/deploys the static files.
6.  Open the generated GitHub Pages URL.

Because TOCTutor is a static application, it works well with GitHub
Pages.

------------------------------------------------------------------------

## ⚠️ Current Limitations

The current version is primarily a **front-end/educational prototype**.

Known limitations include:

-   Authentication is client-side.
-   User data is stored in `localStorage`.
-   Admin credentials are hard-coded.
-   Quiz data is browser-based.
-   No centralized database.
-   No server-side authorization.
-   AI Tutor requires a locally running Ollama-compatible service.
-   The AI API configuration currently points to `localhost`.
-   Production deployment would require a backend for secure AI/API
    access.

------------------------------------------------------------------------

## 🔮 Future Enhancements

Possible improvements for a production-ready version:

### Backend

-   Node.js / Express or Next.js backend
-   MongoDB / PostgreSQL database
-   Secure authentication
-   Password hashing
-   JWT/session-based authorization
-   Server-side admin role validation

### Student Features

-   Course/module completion tracking
-   Detailed performance analytics
-   Leaderboards
-   Bookmarks and notes
-   Certificates
-   Assignment submission
-   Personalized learning paths

### TOC Tools

-   NFA simulator
-   PDA simulator
-   Turing Machine simulator
-   CFG parser
-   Regular expression → automata conversion
-   DFA minimization
-   Grammar simplification
-   Step-by-step algorithm visualization

### AI Features

-   Personalized AI tutor
-   AI-generated explanations
-   AI-generated quizzes
-   Hint generation
-   Answer evaluation
-   Context-aware tutoring based on student progress

### Administration

-   Real-time student analytics
-   Question bank management
-   Course management
-   Quiz scheduling
-   Student performance reports
-   Database-backed content management

------------------------------------------------------------------------

## 🎯 Educational Objective

The primary objective of TOCTutor is to bridge the gap between
**theoretical concepts and practical understanding** in Theory of
Computation.

Instead of learning only from textbooks, students can interact with
computational models, experiment with automata, solve quizzes, and
receive guided explanations.

### Core Objective

> **Learn the theory. Visualize the machine. Practice the concept. Test
> your knowledge.**

------------------------------------------------------------------------

## 👨‍💻 Project Type

**Academic / Educational Web Application**

**Domain:** Theory of Computation / Computer Science Education

**Application Type:** Interactive Learning Platform

**Deployment:** Static Web Application / GitHub Pages

------------------------------------------------------------------------

## 📄 License

This project is intended for educational and academic use.

If you plan to reuse or distribute the project, add an appropriate
open-source license such as MIT License and update this section
accordingly.

------------------------------------------------------------------------

## 🙌 Acknowledgements

This project uses the following open-source/community resources:

-   Phosphor Icons
-   KaTeX
-   Marked.js
-   Canvas Confetti
-   Google Fonts
-   Ollama
-   GitHub Pages
-   GitHub Actions

------------------------------------------------------------------------

## ⭐ Support

If you find TOCTutor useful for learning Theory of Computation, consider
giving the repository a ⭐ on GitHub.

**TOCTutor --- Making Theory of Computation Interactive.**

# InterviewReady - AI-Powered Resume Matcher & Tailor Engine

**InterviewReady** is a responsive, minimalist frontend dashboard designed to help job applicants optimize their resumes for Applicant Tracking Systems (ATS) in seconds. By aligning resume bullets directly with job descriptions, users can instantly scan compatibility, view missing keywords, and get tailored AI-style bullet rewrites.

The design implements a clean, high-contrast, light-mode teal aesthetic matching the layout specifications of premium software dashboards.

---

## 🚀 Key Features

* **Inputs Panel**: Simple textareas for job description pasting and resume text, alongside a visual file drag-and-drop uploader.
* **Match Score Gauge**: An animated, responsive SVG circular progress ring displaying ATS compatibility percentage.
* **Missing Keywords Tracker**: Interactive badge tags highlighting critical skills, framework names, and tool requirements missing from the resume. Supports live tag removal and keyword additions.
* **Tailored Bullet Suggestions**: Side-by-side card comparisons showing "Original" bullet lines versus "Tailored AI Rewrite" suggestions (with metrics and active verbs), accompanied by copy-to-clipboard functionality and rationale explanations.
* **Built-in Sample Data Loader**: One-click mock button in the header nav to prefill inputs and demonstrate the matching algorithm immediately.

---

## 🛠️ Tech Stack

* **Core**: [Next.js 16 (App Router)](https://nextjs.org/)
* **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
* **Language**: [TypeScript](https://www.typescriptlang.org/)
* **Icons**: [Lucide React](https://lucide.dev/)

---

## 💻 Local Development

Follow these steps to run the project locally on your machine:

1. **Clone the repository**:
   ```bash
   git clone https://github.com/roshanroy-lang/interview-ready.git
   cd interview-ready
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   ```
   *Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.*

4. **Compile production build**:
   ```bash
   npm run build
   ```

---

## 🌐 Production Deployment

The project is optimized for deployment on the [Vercel Platform](https://vercel.com/):

1. Log into Vercel and link your GitHub account.
2. Select **Import Project** and choose the `interview-ready` repository.
3. Vercel will auto-detect Next.js and build the application.
4. (Optional) Turn on **Vercel Web Analytics** in your project dashboard with one click to monitor visitors and user engagement.

---

## 🔍 Search Engine Optimization (SEO) & AI Optimization (AISO)

The app is built with modern search and discovery practices:
* **AI Search Optimization (GEO/AISO)**: Integrates an [llms.txt](file:///c:/Users/ROSHAN%20ROY/Desktop/resume_checker/public/llms.txt) file at the root to declare capabilities directly to LLM crawlers (like Perplexity, ChatGPT Search, Gemini, and Claude).
* **JSON-LD Structured Data**: Includes schemas in the head representing the app as a `SoftwareApplication` and a `WebSite` containing a Google `SearchAction` (enables Google Sitelinks Search Box features).
* **Robots & Sitemap**: Statically exports `/sitemap.xml` and `/robots.txt` upon production compilation for standard crawlers.
* **Metadata**: Full OpenGraph and Twitter card attributes are pre-configured in the layout shell.


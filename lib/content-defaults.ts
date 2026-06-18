import type { PortfolioContent } from "@/types/content";

export const defaultPortfolioContent: PortfolioContent = {
  siteIntro: {
    id: "site-intro",
    eyebrow: "Nimantha Hewawasam logo",
    headline_line_1: "Nimantha",
    headline_line_2: "Hewawasam.",
    intro_label: "Introducing",
    intro_heading: "Software Developer, building digital products for modern businesses.",
    intro_body:
      "I design and develop professional web applications, mobile apps, dashboards, automation systems, and AI-powered solutions that help businesses grow with confidence.",
    cta_label: "View Projects",
    cta_href: "#projects",
    work_link_label: "My work",
    work_link_href: "#projects",
  },
  aboutSection: {
    id: "about-section",
    eyebrow: "About Me",
    title: "I build practical, modern, and scalable digital solutions.",
    intro:
      "I work across interface, backend, database structure, and deployment so clients get systems that are clean to use and ready to operate.",
    body:
      "I'm a software developer from Sri Lanka, focused on building web applications, mobile apps, admin dashboards, automation systems, and AI-powered tools for real business needs. My work combines clean UI design, strong backend logic, database structure, and deployment-ready development.",
  },
  contactSection: {
    id: "contact-section",
    eyebrow: "Let's Build Something",
    title: "Have a project idea? Let's turn it into a professional digital product.",
    body:
      "I'm available for web applications, mobile apps, dashboards, CMS platforms, automation systems, and AI-powered solutions.",
    email: "vidunethnim@gmail.com",
    location: "Sri Lanka",
    availability: "Open for international freelance projects",
  },
  socialLinks: [
    {
      id: "social-github",
      sort_order: 1,
      label: "GitHub",
      href: "#",
      icon_key: "code2",
      is_active: true,
    },
    {
      id: "social-linkedin",
      sort_order: 2,
      label: "LinkedIn",
      href: "#",
      icon_key: "briefcaseBusiness",
      is_active: true,
    },
    {
      id: "social-instagram",
      sort_order: 3,
      label: "Instagram",
      href: "#",
      icon_key: "camera",
      is_active: true,
    },
    {
      id: "social-email",
      sort_order: 4,
      label: "Email",
      href: "mailto:vidunethnim@gmail.com",
      icon_key: "mail",
      is_active: true,
    },
  ],
  aboutStats: [
    { id: "about-stat-1", sort_order: 1, label: "20+ Projects Completed", is_active: true },
    { id: "about-stat-2", sort_order: 2, label: "Web, Mobile & AI Solutions", is_active: true },
    { id: "about-stat-3", sort_order: 3, label: "Full-Stack Development", is_active: true },
    { id: "about-stat-4", sort_order: 4, label: "International Client Ready", is_active: true },
  ],
  services: [
    {
      id: "service-1",
      sort_order: 1,
      title: "Custom Web Applications",
      description: "Modern business websites, portals, dashboards, and full-stack systems.",
      fit: "For founders and teams who need a polished product surface.",
      icon_key: "globe2",
      is_active: true,
    },
    {
      id: "service-2",
      sort_order: 2,
      title: "Mobile App Development",
      description: "Cross-platform mobile applications with clean UI and practical features.",
      fit: "For ideas that need a reliable mobile experience.",
      icon_key: "smartphone",
      is_active: true,
    },
    {
      id: "service-3",
      sort_order: 3,
      title: "Admin Dashboards",
      description:
        "Powerful dashboards to manage users, products, bookings, reports, and business operations.",
      fit: "For businesses that need control panels and daily workflows.",
      icon_key: "monitorSmartphone",
      is_active: true,
    },
    {
      id: "service-4",
      sort_order: 4,
      title: "AI & Automation Solutions",
      description: "Smart tools, AI workflows, automation systems, and data-driven features.",
      fit: "For teams looking to reduce manual work and speed up decisions.",
      icon_key: "bot",
      is_active: true,
    },
    {
      id: "service-5",
      sort_order: 5,
      title: "E-Commerce Development",
      description: "Online stores, product management, payment flows, and order systems.",
      fit: "For selling products with clean management and checkout flows.",
      icon_key: "briefcaseBusiness",
      is_active: true,
    },
    {
      id: "service-6",
      sort_order: 6,
      title: "Deployment & Maintenance",
      description: "Hosting setup, CI/CD pipelines, bug fixing, optimization, and long-term support.",
      fit: "For projects that need to stay fast, stable, and supported.",
      icon_key: "settings2",
      is_active: true,
    },
  ],
  projects: [
    {
      id: "project-1",
      sort_order: 1,
      category: "Web Application",
      title: "StudentStay - Hostel & Boarding Management System",
      description:
        "A complete hostel and boarding management platform with student, parent, manager, and admin roles.",
      role: "Full-stack product build",
      problem: "Multi-role housing operations and communication",
      tags: ["React", "Node.js", "MongoDB", "Maps", "JWT"],
      is_featured: true,
      is_active: true,
    },
    {
      id: "project-2",
      sort_order: 2,
      category: "Website + CMS",
      title: "Serenity Wedding Films CMS",
      description:
        "A premium wedding portfolio website with admin content management for videos, testimonials, SEO, and services.",
      role: "Frontend and CMS workflow",
      problem: "Editable portfolio content for a visual brand",
      tags: ["React", "Supabase", "CMS", "Hosting"],
      is_featured: false,
      is_active: true,
    },
    {
      id: "project-3",
      sort_order: 3,
      category: "Full-Stack Platform",
      title: "Mental Health Support Platform",
      description:
        "A web platform with chat, session management, user roles, and in-page voice calling integration.",
      role: "Platform architecture",
      problem: "Private support flows with real-time communication",
      tags: ["Node.js", "MongoDB", "LiveKit", "React"],
      is_featured: false,
      is_active: true,
    },
    {
      id: "project-4",
      sort_order: 4,
      category: "AI Project",
      title: "Wedding Speech Analyzer",
      description:
        "An AI-powered system designed to identify emotional moments in wedding speeches for video editors.",
      role: "AI workflow prototype",
      problem: "Finding story moments faster in long speeches",
      tags: ["Python", "AI", "NLP", "Whisper", "BERT"],
      is_featured: false,
      is_active: true,
    },
    {
      id: "project-5",
      sort_order: 5,
      category: "Business System",
      title: "E-Commerce & Inventory Systems",
      description: "Custom online stores and inventory workflows for real business operations.",
      role: "Business system development",
      problem: "Orders, products, stock, and dashboard workflows",
      tags: ["React", "Firebase", "Express", "Dashboard"],
      is_featured: false,
      is_active: true,
    },
  ],
  techGroups: [
    {
      id: "tech-group-1",
      sort_order: 1,
      title: "Frontend",
      icon_key: "code2",
      is_active: true,
      items: [
        { id: "tech-item-1", tech_group_id: "tech-group-1", sort_order: 1, label: "React" },
        { id: "tech-item-2", tech_group_id: "tech-group-1", sort_order: 2, label: "Next.js" },
        {
          id: "tech-item-3",
          tech_group_id: "tech-group-1",
          sort_order: 3,
          label: "TypeScript",
        },
        {
          id: "tech-item-4",
          tech_group_id: "tech-group-1",
          sort_order: 4,
          label: "Tailwind CSS",
        },
        {
          id: "tech-item-5",
          tech_group_id: "tech-group-1",
          sort_order: 5,
          label: "Material UI",
        },
      ],
    },
    {
      id: "tech-group-2",
      sort_order: 2,
      title: "Backend",
      icon_key: "server",
      is_active: true,
      items: [
        { id: "tech-item-6", tech_group_id: "tech-group-2", sort_order: 1, label: "Node.js" },
        { id: "tech-item-7", tech_group_id: "tech-group-2", sort_order: 2, label: "Express.js" },
        { id: "tech-item-8", tech_group_id: "tech-group-2", sort_order: 3, label: "REST APIs" },
        {
          id: "tech-item-9",
          tech_group_id: "tech-group-2",
          sort_order: 4,
          label: "JWT Authentication",
        },
      ],
    },
    {
      id: "tech-group-3",
      sort_order: 3,
      title: "Databases",
      icon_key: "database",
      is_active: true,
      items: [
        { id: "tech-item-10", tech_group_id: "tech-group-3", sort_order: 1, label: "MongoDB" },
        { id: "tech-item-11", tech_group_id: "tech-group-3", sort_order: 2, label: "Supabase" },
        { id: "tech-item-12", tech_group_id: "tech-group-3", sort_order: 3, label: "Firebase" },
        {
          id: "tech-item-13",
          tech_group_id: "tech-group-3",
          sort_order: 4,
          label: "PostgreSQL",
        },
      ],
    },
    {
      id: "tech-group-4",
      sort_order: 4,
      title: "Mobile",
      icon_key: "smartphone",
      is_active: true,
      items: [
        { id: "tech-item-14", tech_group_id: "tech-group-4", sort_order: 1, label: "Flutter" },
        { id: "tech-item-15", tech_group_id: "tech-group-4", sort_order: 2, label: "Android" },
      ],
    },
    {
      id: "tech-group-5",
      sort_order: 5,
      title: "AI & Automation",
      icon_key: "bot",
      is_active: true,
      items: [
        { id: "tech-item-16", tech_group_id: "tech-group-5", sort_order: 1, label: "Python" },
        {
          id: "tech-item-17",
          tech_group_id: "tech-group-5",
          sort_order: 2,
          label: "Machine Learning",
        },
        { id: "tech-item-18", tech_group_id: "tech-group-5", sort_order: 3, label: "NLP" },
        {
          id: "tech-item-19",
          tech_group_id: "tech-group-5",
          sort_order: 4,
          label: "AI Workflows",
        },
        { id: "tech-item-20", tech_group_id: "tech-group-5", sort_order: 5, label: "n8n" },
      ],
    },
    {
      id: "tech-group-6",
      sort_order: 6,
      title: "Deployment",
      icon_key: "rocket",
      is_active: true,
      items: [
        {
          id: "tech-item-21",
          tech_group_id: "tech-group-6",
          sort_order: 1,
          label: "GitHub Actions",
        },
        { id: "tech-item-22", tech_group_id: "tech-group-6", sort_order: 2, label: "Railway" },
        { id: "tech-item-23", tech_group_id: "tech-group-6", sort_order: 3, label: "cPanel" },
        {
          id: "tech-item-24",
          tech_group_id: "tech-group-6",
          sort_order: 4,
          label: "Namecheap",
        },
        { id: "tech-item-25", tech_group_id: "tech-group-6", sort_order: 5, label: "CI/CD" },
      ],
    },
  ],
  processSteps: [
    {
      id: "process-1",
      sort_order: 1,
      title: "Discover",
      description: "Understand your business, goals, users, and required features.",
      is_active: true,
    },
    {
      id: "process-2",
      sort_order: 2,
      title: "Plan",
      description: "Create the system structure, pages, database flow, and development roadmap.",
      is_active: true,
    },
    {
      id: "process-3",
      sort_order: 3,
      title: "Design",
      description: "Build clean UI layouts with user-friendly experiences.",
      is_active: true,
    },
    {
      id: "process-4",
      sort_order: 4,
      title: "Develop",
      description: "Implement frontend, backend, database, authentication, and core features.",
      is_active: true,
    },
    {
      id: "process-5",
      sort_order: 5,
      title: "Launch & Support",
      description: "Deploy the project, test it properly, and provide ongoing improvements.",
      is_active: true,
    },
  ],
  whyWorkItems: [
    {
      id: "why-work-1",
      sort_order: 1,
      title: "Business-Focused Development",
      description: "I focus on real business needs, not just technical features.",
      icon_key: "briefcaseBusiness",
      is_active: true,
    },
    {
      id: "why-work-2",
      sort_order: 2,
      title: "Clean & Modern User Experience",
      description:
        "Every interface is designed to feel simple, professional, and easy to use.",
      icon_key: "sparkles",
      is_active: true,
    },
    {
      id: "why-work-3",
      sort_order: 3,
      title: "Scalable System Structure",
      description:
        "Projects are built with organized code, database structure, and future growth in mind.",
      icon_key: "workflow",
      is_active: true,
    },
    {
      id: "why-work-4",
      sort_order: 4,
      title: "Reliable Communication",
      description:
        "Clear updates, honest timelines, and professional delivery from start to finish.",
      icon_key: "shieldCheck",
      is_active: true,
    },
  ],
  testimonials: [
    {
      id: "testimonial-1",
      sort_order: 1,
      quote:
        "Nimantha understood the project clearly and delivered a clean, working system with the features we needed.",
      name: "Client Name",
      role: "Business Owner",
      is_active: true,
    },
    {
      id: "testimonial-2",
      sort_order: 2,
      quote:
        "The communication was smooth, and the final result looked professional and easy to manage.",
      name: "Client Name",
      role: "Startup Founder",
      is_active: true,
    },
    {
      id: "testimonial-3",
      sort_order: 3,
      quote:
        "He was able to turn the idea into a real digital product with proper structure and practical features.",
      name: "Project Supervisor",
      role: "Academic Platform",
      is_active: true,
    },
  ],
  trustedBrands: [
    {
      id: "trusted-brand-1",
      sort_order: 1,
      name: "Playstation.lk",
      url: "#",
      logo_src: null,
      industry: "Gaming & Retail",
      is_active: true,
    },
    {
      id: "trusted-brand-2",
      sort_order: 2,
      name: "Serenity Wedding Films (Pvt) Ltd",
      url: "#",
      logo_src: null,
      industry: "Wedding Films",
      is_active: true,
    },
    {
      id: "trusted-brand-3",
      sort_order: 3,
      name: "Priyadarshana Dristributors (Pvt) Ltd",
      url: "#",
      logo_src: null,
      industry: "Distribution",
      is_active: true,
    },
    {
      id: "trusted-brand-4",
      sort_order: 4,
      name: "Athukorala Group (Pvt) Ltd",
      url: "#",
      logo_src: null,
      industry: "Business Group",
      is_active: true,
    },
    {
      id: "trusted-brand-5",
      sort_order: 5,
      name: "Nextgen code (Pvt) Ltd",
      url: "#",
      logo_src: null,
      industry: "Technology",
      is_active: true,
    },
    {
      id: "trusted-brand-6",
      sort_order: 6,
      name: "DN Tours Ahungalla",
      url: "#",
      logo_src: null,
      industry: "Travel",
      is_active: true,
    },
  ],
  blogSettings: {
    id: "blog-settings",
    eyebrow: "Writing & Notes",
    title: "Thoughtful writing on product building, software craft, and digital strategy.",
    intro:
      "A curated journal of lessons from building real systems, refining interfaces, structuring CMS platforms, and turning business ideas into practical software.",
    featured_title: "Featured Article",
    featured_intro:
      "A deeper look at the thinking, systems, and design decisions that shape reliable digital products.",
  },
  blogCategories: [
    { id: "blog-category-1", sort_order: 1, name: "Development", slug: "development", is_active: true },
    { id: "blog-category-2", sort_order: 2, name: "UI & UX", slug: "ui-ux", is_active: true },
    { id: "blog-category-3", sort_order: 3, name: "CMS & Systems", slug: "cms-systems", is_active: true },
    { id: "blog-category-4", sort_order: 4, name: "Freelance", slug: "freelance", is_active: true },
  ],
  blogPosts: [
    {
      id: "blog-post-1",
      sort_order: 1,
      title: "What Makes a Client Dashboard Actually Useful",
      slug: "what-makes-a-client-dashboard-useful",
      excerpt:
        "A practical look at the difference between a dashboard that looks impressive and one that truly supports day-to-day operations.",
      cover_image: "/images/nimantha-hero.png",
      content_markdown: `## The real job of a dashboard

A dashboard is not there to show how many charts we can fit on one screen. Its job is to help people make decisions quickly and with confidence.

### What good dashboards usually have

- clear hierarchy
- important metrics first
- simple navigation
- actions placed close to the data they affect

### What usually goes wrong

Too many dashboards are built like presentations. They look polished, but they slow down the people who actually use them every day.

The best dashboard work starts with workflow questions:

- What does the team check first every morning?
- Which actions happen most often?
- What is urgent versus useful?

When those questions guide the build, the final product feels calm, focused, and professional.`,
      author_name: "Nimantha Hewawasam",
      reading_time: "5 min read",
      published_at: "2026-06-10T09:00:00.000Z",
      seo_title: "What Makes a Client Dashboard Actually Useful",
      seo_description:
        "A practical guide to building dashboards that support real business workflows instead of just looking impressive.",
      is_featured: true,
      is_published: true,
      category_ids: ["blog-category-1", "blog-category-3"],
    },
    {
      id: "blog-post-2",
      sort_order: 2,
      title: "Designing Portfolio Sites That Feel Personal Without Feeling Messy",
      slug: "designing-portfolio-sites-that-feel-personal",
      excerpt:
        "How to make a personal site feel authored and memorable while still keeping the structure sharp and professional.",
      cover_image: null,
      content_markdown: `## Personal does not mean unstructured

A strong portfolio site should show personality, but it should still guide people clearly.

### The balance I look for

- a recognizable visual identity
- strong spacing and type hierarchy
- fewer, better choices
- content that sounds like a real person

Creativity works best when the layout is disciplined. That is usually the difference between a site that feels premium and one that feels noisy.`,
      author_name: "Nimantha Hewawasam",
      reading_time: "4 min read",
      published_at: "2026-06-06T08:30:00.000Z",
      seo_title: "Designing Portfolio Sites That Feel Personal Without Feeling Messy",
      seo_description:
        "A short breakdown of how to make a portfolio site feel personal, original, and professionally structured.",
      is_featured: false,
      is_published: true,
      category_ids: ["blog-category-2", "blog-category-4"],
    },
    {
      id: "blog-post-3",
      sort_order: 3,
      title: "Why CMS Projects Need Better Content Structures From Day One",
      slug: "why-cms-projects-need-better-content-structures",
      excerpt:
        "A better content model makes editing easier, reduces future bugs, and gives businesses more control over their own platforms.",
      cover_image: null,
      content_markdown: `## CMS work is product design

When content structure is treated as an afterthought, the admin experience becomes fragile very quickly.

### Strong content models help with

- maintainability
- editorial clarity
- better API responses
- easier future features

I like CMS systems where the editing experience is obvious, the data is typed, and the public site stays fast.`,
      author_name: "Nimantha Hewawasam",
      reading_time: "6 min read",
      published_at: "2026-05-29T10:00:00.000Z",
      seo_title: "Why CMS Projects Need Better Content Structures From Day One",
      seo_description:
        "Why a solid content model matters for maintainability, editorial control, and long-term product quality.",
      is_featured: false,
      is_published: true,
      category_ids: ["blog-category-3", "blog-category-1"],
    },
    {
      id: "blog-post-4",
      sort_order: 4,
      title: "From Freelance Request to Clear Build Plan",
      slug: "from-freelance-request-to-clear-build-plan",
      excerpt:
        "A simple framework for turning a vague client request into a scoped, buildable, and professional implementation plan.",
      cover_image: null,
      content_markdown: `## Clarity builds trust

Some of the most important freelance work happens before the first line of code.

### A better planning rhythm

1. understand the business goal
2. identify the real workflow
3. define the content and data shape
4. reduce vague requests into explicit decisions

When the plan is clear, the build gets faster and the client feels more confident from the start.`,
      author_name: "Nimantha Hewawasam",
      reading_time: "4 min read",
      published_at: "2026-05-22T07:45:00.000Z",
      seo_title: "From Freelance Request to Clear Build Plan",
      seo_description:
        "A practical planning approach for turning freelance project requests into clean implementation plans.",
      is_featured: false,
      is_published: true,
      category_ids: ["blog-category-4", "blog-category-1"],
    },
  ],
};

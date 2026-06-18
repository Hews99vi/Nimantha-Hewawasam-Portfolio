import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  Mail,
  MapPin,
  Workflow,
} from "lucide-react";
import { getPortfolioContent } from "@/lib/content";
import { iconMap } from "@/lib/icons";
import type {
  AboutSection as AboutSectionType,
  ContactSection as ContactSectionType,
  PortfolioContent,
  ProcessStep,
  ProjectItem,
  ServiceItem,
  SiteIntro,
  SocialLink,
  TechGroup,
  TrustedBrand,
  WhyWorkItem,
} from "@/types/content";

function ButtonLink({
  href,
  children,
  variant = "primary",
}: {
  href: string;
  children: React.ReactNode;
  variant?: "primary" | "secondary";
}) {
  const styles =
    variant === "primary"
      ? "rounded-full bg-[#0057D9] text-white shadow-[0_14px_32px_rgba(0,87,217,0.22)] hover:bg-[#102A4C]"
      : "rounded-full border border-[#102A4C]/16 bg-white/72 text-[#071426] hover:border-[#0057D9]/40 hover:bg-white";

  return (
    <a
      href={href}
      className={`inline-flex min-h-12 items-center justify-center gap-2 px-6 text-sm font-bold transition hover:-translate-y-0.5 ${styles}`}
    >
      {children}
    </a>
  );
}

function SectionHeading({
  eyebrow,
  title,
  intro,
  tone = "light",
}: {
  eyebrow: string;
  title: string;
  intro?: string;
  tone?: "light" | "dark";
}) {
  return (
    <div className="mb-12 grid gap-6 md:grid-cols-[0.72fr_1fr] md:items-end">
      <div>
        <p
          className={`mb-4 text-xs font-extrabold uppercase tracking-[0.22em] ${
            tone === "dark" ? "text-[#82B9F1]" : "text-[#0057D9]"
          }`}
        >
          {eyebrow}
        </p>
        <h2
          className={`text-balance text-3xl font-extrabold leading-tight sm:text-4xl lg:text-5xl ${
            tone === "dark" ? "text-white" : "text-[#071426]"
          }`}
        >
          {title}
        </h2>
      </div>
      {intro ? (
        <p
          className={`max-w-2xl text-base leading-8 md:justify-self-end ${
            tone === "dark" ? "text-white/68" : "text-[#52657C]"
          }`}
        >
          {intro}
        </p>
      ) : null}
    </div>
  );
}

function HeroSection({
  intro,
  socialLinks,
}: {
  intro: SiteIntro;
  socialLinks: SocialLink[];
}) {
  return (
    <section
      id="home"
      className="flex min-h-screen items-center bg-[#c5d0d6] px-4 py-8 sm:px-8 lg:px-12 lg:py-10"
    >
      <div className="relative mx-auto min-h-[920px] w-full max-w-[1760px] overflow-hidden rounded-[28px] bg-[#aebbd1] shadow-[0_8px_34px_rgba(16,42,76,0.08)] md:min-h-[760px] lg:h-[calc(100vh-5rem)] lg:min-h-[680px] lg:max-h-[980px]">
        <div className="absolute left-[10%] top-[7%] z-20 text-[#0057D9]">
          <a href="#home" className="block" aria-label="Nimantha Hewawasam home">
            <Image
              src="/images/Main logo.png?v=2"
              alt="Nimantha Hewawasam logo"
              width={88}
              height={88}
              priority
              unoptimized
              className="h-14 w-14 object-contain lg:h-[72px] lg:w-[72px]"
            />
          </a>
        </div>

        <nav className="absolute right-[10%] top-[8%] z-20 hidden items-start gap-10 text-[clamp(1.35rem,1.45vw,1.75rem)] font-medium tracking-[-0.02em] text-[#728095] md:flex">
          <a href="#services" className="relative text-white">
            Services
            <span className="absolute -bottom-8 left-1/2 h-4 w-4 -translate-x-1/2 rounded-full bg-[#0057D9]" />
          </a>
          <a href="#projects" className="transition hover:text-white">
            Works
          </a>
          <Link href="/blog" className="transition hover:text-white">
            Blogs
          </Link>
        </nav>

        <div className="absolute left-[8%] top-[15%] z-10 max-w-[520px] lg:left-[10%] lg:top-[30%]">
          <h1 className="text-[clamp(3.2rem,5vw,6.65rem)] font-black leading-[0.92] tracking-[-0.035em] text-white drop-shadow-[0_2px_0_rgba(7,20,38,0.08)]">
            {intro.headline_line_1}
            <span className="block">{intro.headline_line_2}</span>
          </h1>
          <div className="mt-9 h-3 w-32 bg-[#0057D9]" />

          <div className="mt-12 flex items-center gap-7 lg:mt-[clamp(3.5rem,8vh,7rem)] lg:gap-9">
            {socialLinks
              .filter((item) => item.is_active)
              .sort((a, b) => a.sort_order - b.sort_order)
              .map((item) => {
                const Icon = iconMap[item.icon_key];
                return (
                  <a
                    key={item.id}
                    href={item.href}
                    aria-label={item.label}
                    className="transition hover:-translate-y-1"
                    style={{ color: "#ffffff" }}
                  >
                    <Icon className="text-current" size={24} strokeWidth={2.4} />
                  </a>
                );
              })}
          </div>
        </div>

        <div className="absolute bottom-0 left-1/2 z-10 flex h-[40%] w-[86%] -translate-x-1/2 items-end justify-center lg:left-[49%] lg:h-[80%] lg:w-[44%]">
          <div className="absolute bottom-0 h-[82%] w-[70%] rounded-t-full bg-white/8 blur-sm" />
          {/* Use a direct image tag so user-replaced transparent PNGs render without optimization surprises. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/nimantha-hero.png"
            alt="Nimantha Hewawasam"
            className="relative z-10 block h-full max-w-none object-contain object-bottom drop-shadow-[0_32px_48px_rgba(7,20,38,0.18)]"
          />
        </div>

        <div className="absolute left-[8%] right-[8%] top-[40%] z-10 lg:left-auto lg:right-[6%] lg:top-[27%] lg:w-[350px]">
          <p className="mb-5 text-[1.05rem] font-medium text-[#7c8798] lg:mb-6 lg:text-[1.25rem]">
            &mdash; {intro.intro_label}
          </p>
          <h2 className="text-[1.8rem] font-black leading-[1.25] tracking-[-0.02em] text-white lg:text-[clamp(1.7rem,1.8vw,2.05rem)] lg:leading-[1.32]">
            {intro.intro_heading}
          </h2>
          <p className="mt-6 max-w-[330px] text-[0.98rem] leading-7 text-white/86 lg:mt-8 lg:max-w-none lg:text-[clamp(0.9rem,0.9vw,1.02rem)] lg:leading-8">
            {intro.intro_body}
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-4 lg:mt-10">
            <ButtonLink href={intro.cta_href}>{intro.cta_label}</ButtonLink>
            <a
              href={intro.work_link_href}
              className="inline-flex items-center gap-4 text-[1.05rem] font-black underline decoration-2 underline-offset-4 transition hover:gap-6 lg:gap-5 lg:text-[1.15rem]"
              style={{ color: "#0057D9" }}
            >
              {intro.work_link_label} <ArrowRight size={26} />
            </a>
          </div>
        </div>

        <div className="absolute bottom-8 left-8 right-8 z-20 flex items-center justify-between text-xs font-bold uppercase tracking-[0.18em] text-white/38 md:hidden">
          <a href="#services">Services</a>
          <a href="#projects">Works</a>
          <Link href="/blog">Blog</Link>
        </div>
      </div>
    </section>
  );
}

function TrustedBrandsSection({ brands }: { brands: TrustedBrand[] }) {
  const activeBrands = brands
    .filter((brand) => brand.is_active)
    .sort((a, b) => a.sort_order - b.sort_order);

  if (activeBrands.length === 0) {
    return null;
  }

  return (
    <section className="bg-[#F8FAFC] py-24 lg:py-28">
      <div className="container-shell">
        <div className="mb-14 grid gap-8 rounded-[28px] border border-[#102A4C]/8 bg-white/40 p-7 lg:grid-cols-[0.95fr_1.05fr] lg:items-end">
          <div>
            <p className="mb-5 text-[0.72rem] font-extrabold uppercase tracking-[0.34em] text-[#0057D9]">
              Trusted By
            </p>
            <h2 className="max-w-3xl text-balance text-4xl font-extrabold leading-[1.06] tracking-[-0.025em] text-[#071426] sm:text-5xl lg:text-6xl">
              Brands that trust me to build with care.
            </h2>
          </div>
          <div className="lg:justify-self-end">
            <p className="max-w-xl text-base leading-8 text-[#52657C]">
              A selected group of companies and teams across creative, travel,
              retail, distribution, and technology work.
            </p>
            <div className="mt-7 flex items-center gap-4">
              <span className="h-px w-14 bg-[#0057D9]" />
              <span className="text-xs font-extrabold uppercase tracking-[0.22em] text-[#6E7F95]">
                {activeBrands.length} selected {activeBrands.length === 1 ? "name" : "names"}
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {activeBrands.map((brand) => {
            const content = brand.logo_src ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={brand.logo_src}
                alt={`${brand.name} logo`}
                className="max-h-12 max-w-[190px] object-contain opacity-85 transition duration-300 ease-out group-hover:scale-[1.025] group-hover:opacity-100"
              />
            ) : (
              <span className="max-w-[220px] text-center text-xl font-black leading-tight tracking-[-0.03em] text-[#102A4C] transition duration-300 ease-out group-hover:text-[#0057D9]">
                {brand.name}
              </span>
            );
            const inner = (
              <>
                <div className="flex min-h-16 items-center justify-center">
                  {content}
                </div>
                {brand.industry ? (
                  <span className="mt-5 text-center text-[0.66rem] font-extrabold uppercase tracking-[0.18em] text-[#6E7F95]/80 transition duration-300 ease-out group-hover:text-[#102A4C]">
                    {brand.industry}
                  </span>
                ) : null}
              </>
            );
            const tileClass =
              "group relative flex min-h-36 flex-col items-center justify-center overflow-hidden rounded-[20px] border border-[#102A4C]/8 bg-white/72 px-8 py-8 shadow-[0_18px_54px_rgba(7,20,38,0.04)] transition duration-300 ease-out hover:-translate-y-1 hover:border-[#0057D9]/22 hover:bg-white hover:shadow-[0_26px_70px_rgba(7,20,38,0.08)]";

            return brand.url && brand.url !== "#" ? (
              <a
                key={brand.id}
                href={brand.url}
                target="_blank"
                rel="noreferrer"
                className={tileClass}
              >
                <span className="pointer-events-none absolute inset-x-6 top-0 h-px bg-[#0057D9]/0 transition duration-300 ease-out group-hover:bg-[#0057D9]/45" />
                {inner}
              </a>
            ) : (
              <div key={brand.id} className={tileClass}>
                <span className="pointer-events-none absolute inset-x-6 top-0 h-px bg-[#0057D9]/0 transition duration-300 ease-out group-hover:bg-[#0057D9]/45" />
                {inner}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function AboutSection({
  section,
  stats,
}: {
  section: AboutSectionType;
  stats: PortfolioContent["aboutStats"];
}) {
  return (
    <section id="about" className="bg-white py-24">
      <div className="container-shell">
        <SectionHeading
          eyebrow={section.eyebrow}
          title={section.title}
          intro={section.intro}
        />
        <div className="grid gap-10 lg:grid-cols-[0.74fr_1fr] lg:items-start">
          <div className="rounded-[20px] border border-[#0057D9]/16 bg-[#EEF4FA]/60 p-6">
            <p className="text-lg leading-9 text-[#36475C]">{section.body}</p>
          </div>
          <div className="grid overflow-hidden rounded-[24px] border border-[#102A4C]/10 bg-white sm:grid-cols-2">
            {stats
              .filter((stat) => stat.is_active)
              .sort((a, b) => a.sort_order - b.sort_order)
              .map((stat) => (
                <div
                  key={stat.id}
                  className="flex min-h-28 items-start gap-4 border-[#102A4C]/10 p-6 sm:odd:border-r"
                >
                  <CheckCircle2 className="mt-1 shrink-0 text-[#0057D9]" size={22} />
                  <p className="text-lg font-extrabold leading-7 text-[#071426]">
                    {stat.label}
                  </p>
                </div>
              ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function ServicesSection({ services }: { services: ServiceItem[] }) {
  return (
    <section id="services" className="bg-[#EEF4FA] py-24">
      <div className="container-shell">
        <SectionHeading
          eyebrow="Services"
          title="Digital solutions built for business growth."
          intro="Each service is shaped around real business workflows, not decoration. The goal is a system people can understand, use, and keep improving."
        />
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {services
            .filter((service) => service.is_active)
            .sort((a, b) => a.sort_order - b.sort_order)
            .map((service, index) => {
              const Icon = iconMap[service.icon_key];
              return (
                <article
                  key={service.id}
                  className="group rounded-[20px] border border-[#102A4C]/10 bg-white/64 p-7 transition duration-300 ease-out hover:-translate-y-1 hover:border-[#0057D9]/30 hover:bg-white hover:shadow-[0_18px_44px_rgba(7,20,38,0.06)]"
                >
                  <div className="mb-7 flex items-center justify-between">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#102A4C] text-white transition group-hover:bg-[#0057D9]">
                      <Icon size={22} />
                    </div>
                    <span className="text-sm font-extrabold text-[#6E7F95]">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                  </div>
                  <h3 className="text-xl font-extrabold text-[#071426]">
                    {service.title}
                  </h3>
                  <p className="mt-4 leading-7 text-[#52657C]">
                    {service.description}
                  </p>
                  <p className="mt-5 rounded-2xl bg-[#EEF4FA] px-4 py-3 text-sm font-bold leading-6 text-[#102A4C]">
                    {service.fit}
                  </p>
                </article>
              );
            })}
        </div>
      </div>
    </section>
  );
}

function ProjectsSection({ projects }: { projects: ProjectItem[] }) {
  const activeProjects = projects
    .filter((project) => project.is_active)
    .sort((a, b) => a.sort_order - b.sort_order);
  const featuredProject =
    activeProjects.find((project) => project.is_featured) ?? activeProjects[0];
  const supportingProjects = activeProjects.filter(
    (project) => project.id !== featuredProject?.id,
  );

  if (!featuredProject) {
    return null;
  }

  return (
    <section id="projects" className="bg-white py-24">
      <div className="container-shell">
        <SectionHeading
          eyebrow="Selected Projects"
          title="Real-world projects designed with purpose."
          intro="A small selection of platforms, CMS builds, automation ideas, and business systems shaped around actual workflows."
        />
        <article className="grid overflow-hidden rounded-[28px] border border-[#102A4C]/12 bg-[#071426] text-white lg:grid-cols-[0.9fr_1.1fr]">
          <div className="bg-[#102A4C] p-8 md:p-10">
            <p className="text-xs font-extrabold uppercase tracking-[0.22em] text-[#82B9F1]">
              Featured Case Study
            </p>
            <h3 className="mt-5 max-w-xl text-3xl font-extrabold leading-tight md:text-5xl">
              {featuredProject.title}
            </h3>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-white/76">
              {featuredProject.description}
            </p>
            <a
              href="#contact"
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-extrabold text-[#071426] transition hover:bg-[#DCE7F3]"
            >
              View Case Study <ArrowRight size={16} />
            </a>
          </div>
          <div className="grid gap-0 border-t border-white/10 lg:border-l lg:border-t-0">
            <ProjectMeta label="Category" value={featuredProject.category} />
            <ProjectMeta label="Role" value={featuredProject.role} />
            <ProjectMeta label="Problem" value={featuredProject.problem} />
            <div className="p-6 md:p-8">
              <p className="mb-4 text-xs font-extrabold uppercase tracking-[0.2em] text-white/45">
                Built with
              </p>
              <div className="flex flex-wrap gap-2">
                {featuredProject.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-white/14 bg-white/[0.06] px-3 py-2 text-sm font-bold text-white/82"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </article>

        <div className="mt-6 grid gap-4 lg:grid-cols-2">
          {supportingProjects.map((project) => (
            <article
              key={project.id}
              className="rounded-[20px] border border-[#102A4C]/12 bg-[#F8FAFC] p-6 transition duration-300 ease-out hover:-translate-y-1 hover:border-[#0057D9]/32 hover:bg-white hover:shadow-[0_18px_44px_rgba(7,20,38,0.06)]"
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-[#0057D9]">
                  {project.category}
                </p>
                <p className="text-sm font-bold text-[#6E7F95]">{project.role}</p>
              </div>
              <h3 className="mt-5 text-2xl font-extrabold leading-tight text-[#071426]">
                {project.title}
              </h3>
              <p className="mt-4 leading-7 text-[#52657C]">
                {project.description}
              </p>
              <div className="mt-5 rounded-2xl bg-[#EEF4FA] px-4 py-3 text-sm font-bold leading-6 text-[#102A4C]">
                {project.problem}
              </div>
              <div className="mt-6 flex flex-wrap gap-2">
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-[#EEF4FA] px-3 py-1.5 text-xs font-bold text-[#36475C]"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function ProjectMeta({ label, value }: { label: string; value: string }) {
  return (
    <div className="border-b border-white/10 p-6 md:p-8">
      <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-white/45">
        {label}
      </p>
      <p className="mt-3 text-lg font-bold leading-7 text-white">{value}</p>
    </div>
  );
}

function TechStackSection({ techGroups }: { techGroups: TechGroup[] }) {
  return (
    <section className="bg-[#EEF4FA] py-24">
      <div className="container-shell">
        <SectionHeading
          eyebrow="Tech Stack"
          title="A practical stack for reliable product delivery."
          intro="The tools change by project, but the approach stays consistent: clear interfaces, sensible APIs, structured data, and deployment-aware development."
        />
        <div className="grid gap-4">
          {techGroups
            .filter((group) => group.is_active)
            .sort((a, b) => a.sort_order - b.sort_order)
            .map((group) => {
              const Icon = iconMap[group.icon_key];
              return (
                <article
                  key={group.id}
                  className="grid gap-5 rounded-[20px] border border-[#102A4C]/10 bg-white/64 p-5 md:grid-cols-[220px_1fr] md:items-center"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#102A4C] text-white">
                      <Icon size={20} />
                    </div>
                    <h3 className="text-lg font-extrabold text-[#071426]">
                      {group.title}
                    </h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {group.items
                      .sort((a, b) => a.sort_order - b.sort_order)
                      .map((item) => (
                        <span
                          key={item.id}
                          className="rounded-full border border-[#102A4C]/10 bg-[#F8FAFC] px-3 py-2 text-sm font-bold text-[#36475C]"
                        >
                          {item.label}
                        </span>
                      ))}
                  </div>
                </article>
              );
            })}
        </div>
      </div>
    </section>
  );
}

function ProcessSection({ processSteps }: { processSteps: ProcessStep[] }) {
  return (
    <section className="bg-white py-24">
      <div className="container-shell">
        <SectionHeading
          eyebrow="Process"
          title="From idea to launch, every step is clear."
          intro="A simple, visible process keeps momentum high and makes sure every feature has a reason to exist."
        />
        <div className="relative grid gap-5 lg:grid-cols-5">
          {processSteps
            .filter((step) => step.is_active)
            .sort((a, b) => a.sort_order - b.sort_order)
            .map((step, index) => (
              <article
                key={step.id}
                className="relative rounded-[20px] border border-[#102A4C]/10 bg-[#F8FAFC] p-6 transition duration-300 ease-out hover:-translate-y-1 hover:border-[#0057D9]/22 hover:bg-white"
              >
                <div className="mb-7 inline-flex h-10 min-w-10 items-center justify-center rounded-full bg-[#071426] px-3 text-sm font-extrabold text-white">
                  {String(index + 1).padStart(2, "0")}
                </div>
                <h3 className="text-xl font-extrabold text-[#071426]">
                  {step.title}
                </h3>
                <p className="mt-4 text-sm leading-7 text-[#52657C]">
                  {step.description}
                </p>
              </article>
            ))}
        </div>
      </div>
    </section>
  );
}

function WhyWorkWithMeSection({ items }: { items: WhyWorkItem[] }) {
  return (
    <section className="bg-[#071426] py-24 text-white">
      <div className="container-shell">
        <SectionHeading
          eyebrow="Why Work With Me"
          title="More than code. I build solutions that support your business."
          intro="The work is measured by whether the final system is understandable, usable, stable, and ready for real people."
          tone="dark"
        />
        <div className="grid gap-px overflow-hidden rounded-[28px] border border-white/10 bg-white/10 md:grid-cols-2 lg:grid-cols-4">
          {items
            .filter((item) => item.is_active)
            .sort((a, b) => a.sort_order - b.sort_order)
            .map((item) => {
              const Icon = iconMap[item.icon_key];
              return (
                <article
                  key={item.id}
                  className="bg-[#071426] p-7 transition duration-300 ease-out hover:bg-[#102A4C]"
                >
                  <Icon className="mb-8 text-[#82B9F1]" size={27} />
                  <h3 className="text-lg font-extrabold">{item.title}</h3>
                  <p className="mt-4 text-sm leading-7 text-white/66">
                    {item.description}
                  </p>
                </article>
              );
            })}
        </div>
      </div>
    </section>
  );
}

function ContactSection({ section }: { section: ContactSectionType }) {
  return (
    <section id="contact" className="bg-[#DCE7F3] py-24">
      <div className="container-shell">
        <div className="grid gap-10 rounded-[28px] border border-[#102A4C]/12 bg-[#071426] p-8 text-white md:p-12 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
          <div>
            <p className="mb-4 text-xs font-extrabold uppercase tracking-[0.24em] text-[#82B9F1]">
              {section.eyebrow}
            </p>
            <h2 className="text-balance text-3xl font-extrabold leading-tight sm:text-4xl lg:text-5xl">
              {section.title}
            </h2>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-white/72">
              {section.body}
            </p>
            <div className="mt-9 flex flex-wrap gap-4">
              <ButtonLink href={`mailto:${section.email}`}>Start a Project</ButtonLink>
              <a
                href={`mailto:${section.email}`}
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-white/18 px-6 text-sm font-bold text-white transition hover:border-white/40 hover:bg-white/8"
              >
                Send Email <ArrowRight size={17} />
              </a>
            </div>
          </div>
          <div className="rounded-[20px] border border-white/10 bg-white/[0.04] p-6">
            <div className="space-y-5">
              <ContactItem icon={Mail} label="Email" value={section.email} />
              <ContactItem icon={MapPin} label="Location" value={section.location} />
              <ContactItem
                icon={Workflow}
                label="Availability"
                value={section.availability}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ContactItem({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <div className="flex gap-4">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white text-[#0057D9]">
        <Icon size={20} />
      </div>
      <div>
        <p className="text-sm font-bold text-white/50">{label}</p>
        <p className="mt-1 font-extrabold text-white">{value}</p>
      </div>
    </div>
  );
}

function Footer() {
  return (
    <footer className="bg-[#071426] py-8 text-white">
      <div className="container-shell flex flex-col gap-6 border-t border-white/10 pt-8 text-sm md:flex-row md:items-center md:justify-between">
        <p className="font-bold">Nimantha Hewawasam - Software Developer</p>
        <nav className="flex flex-wrap gap-5 text-white/58">
          <a href="#home" className="hover:text-white">
            Home
          </a>
          <a href="#services" className="hover:text-white">
            Services
          </a>
          <a href="#projects" className="hover:text-white">
            Projects
          </a>
          <a href="#about" className="hover:text-white">
            About
          </a>
          <a href="#contact" className="hover:text-white">
            Contact
          </a>
          <Link href="/blog" className="hover:text-white">
            Blog
          </Link>
        </nav>
        <p className="text-white/58">&copy; 2026 All Rights Reserved</p>
      </div>
    </footer>
  );
}

export default async function Home() {
  const content = await getPortfolioContent();

  return (
    <main>
      <HeroSection intro={content.siteIntro} socialLinks={content.socialLinks} />
      <AboutSection section={content.aboutSection} stats={content.aboutStats} />
      <ServicesSection services={content.services} />
      <ProjectsSection projects={content.projects} />
      <TechStackSection techGroups={content.techGroups} />
      <ProcessSection processSteps={content.processSteps} />
      <WhyWorkWithMeSection items={content.whyWorkItems} />
      <TrustedBrandsSection brands={content.trustedBrands} />
      <ContactSection section={content.contactSection} />
      <Footer />
    </main>
  );
}

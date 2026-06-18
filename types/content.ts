export type IconKey =
  | "code2"
  | "briefcaseBusiness"
  | "camera"
  | "mail"
  | "globe2"
  | "smartphone"
  | "monitorSmartphone"
  | "bot"
  | "settings2"
  | "server"
  | "database"
  | "rocket"
  | "sparkles"
  | "shieldCheck"
  | "workflow";

export type SiteIntro = {
  id: string;
  eyebrow: string;
  headline_line_1: string;
  headline_line_2: string;
  intro_label: string;
  intro_heading: string;
  intro_body: string;
  cta_label: string;
  cta_href: string;
  work_link_label: string;
  work_link_href: string;
};

export type AboutSection = {
  id: string;
  eyebrow: string;
  title: string;
  intro: string;
  body: string;
};

export type ContactSection = {
  id: string;
  eyebrow: string;
  title: string;
  body: string;
  email: string;
  location: string;
  availability: string;
};

export type SocialLink = {
  id: string;
  sort_order: number;
  label: string;
  href: string;
  icon_key: IconKey;
  is_active: boolean;
};

export type AboutStat = {
  id: string;
  sort_order: number;
  label: string;
  is_active: boolean;
};

export type ServiceItem = {
  id: string;
  sort_order: number;
  title: string;
  description: string;
  fit: string;
  icon_key: IconKey;
  is_active: boolean;
};

export type ProjectItem = {
  id: string;
  sort_order: number;
  category: string;
  title: string;
  description: string;
  role: string;
  problem: string;
  tags: string[];
  is_featured: boolean;
  is_active: boolean;
};

export type TechGroup = {
  id: string;
  sort_order: number;
  title: string;
  icon_key: IconKey;
  items: TechGroupItem[];
  is_active: boolean;
};

export type TechGroupItem = {
  id: string;
  tech_group_id: string;
  sort_order: number;
  label: string;
};

export type ProcessStep = {
  id: string;
  sort_order: number;
  title: string;
  description: string;
  is_active: boolean;
};

export type WhyWorkItem = {
  id: string;
  sort_order: number;
  title: string;
  description: string;
  icon_key: IconKey;
  is_active: boolean;
};

export type TestimonialItem = {
  id: string;
  sort_order: number;
  quote: string;
  name: string;
  role: string;
  is_active: boolean;
};

export type TrustedBrand = {
  id: string;
  sort_order: number;
  name: string;
  url: string | null;
  logo_src: string | null;
  industry: string | null;
  is_active: boolean;
};

export type BlogSettings = {
  id: string;
  eyebrow: string;
  title: string;
  intro: string;
  featured_title: string;
  featured_intro: string;
};

export type BlogCategory = {
  id: string;
  sort_order: number;
  name: string;
  slug: string;
  is_active: boolean;
};

export type BlogPost = {
  id: string;
  sort_order: number;
  title: string;
  slug: string;
  excerpt: string;
  cover_image: string | null;
  content_markdown: string;
  author_name: string;
  reading_time: string;
  published_at: string | null;
  seo_title: string | null;
  seo_description: string | null;
  is_featured: boolean;
  is_published: boolean;
  category_ids: string[];
};

export type BlogPostSummary = Omit<BlogPost, "content_markdown">;

export type BlogPostWithCategories = BlogPost & {
  categories: BlogCategory[];
};

export type BlogPostCategory = {
  post_id: string;
  category_id: string;
};

export type BlogLandingContent = {
  settings: BlogSettings;
  categories: BlogCategory[];
  featuredPost: BlogPostWithCategories | null;
  posts: BlogPostWithCategories[];
};

export type PortfolioContent = {
  siteIntro: SiteIntro;
  aboutSection: AboutSection;
  contactSection: ContactSection;
  socialLinks: SocialLink[];
  aboutStats: AboutStat[];
  services: ServiceItem[];
  projects: ProjectItem[];
  techGroups: TechGroup[];
  processSteps: ProcessStep[];
  whyWorkItems: WhyWorkItem[];
  testimonials: TestimonialItem[];
  trustedBrands: TrustedBrand[];
  blogSettings: BlogSettings;
  blogCategories: BlogCategory[];
  blogPosts: BlogPost[];
};

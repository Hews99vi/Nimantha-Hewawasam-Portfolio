"use client";

import { useState, useTransition } from "react";
import type {
  AboutStat,
  IconKey,
  PortfolioContent,
  ProcessStep,
  ProjectItem,
  ServiceItem,
  SocialLink,
  TechGroup,
  TechGroupItem,
  TestimonialItem,
  TrustedBrand,
  WhyWorkItem,
} from "@/types/content";
import { normalizePublicAssetPath } from "@/lib/asset-path";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { BlogCategoriesEditor, BlogPostsEditor, BlogSettingsEditor } from "@/app/admin/BlogEditors";
import { IconSelect } from "@/app/admin/IconSelect";

type AdminDashboardProps = {
  initialData: PortfolioContent;
  adminEmail: string;
};

type RunAction = (action: () => Promise<void>) => void;
type MessageSetter = (message: string | null) => void;
type ListField = {
  key: string;
  label: string;
  type: "text" | "textarea" | "number" | "checkbox" | "icon";
};

const sectionTabs = [
  { id: "intro", label: "Introduction" },
  { id: "trustedBrands", label: "Trusted Brands" },
  { id: "about", label: "About" },
  { id: "services", label: "Services" },
  { id: "projects", label: "Projects" },
  { id: "tech", label: "Tech Stack" },
  { id: "process", label: "Process" },
  { id: "why", label: "Why Work With Me" },
  { id: "testimonials", label: "Testimonials" },
  { id: "contact", label: "Contact" },
  { id: "blogSettings", label: "Blog Settings" },
  { id: "blogCategories", label: "Blog Categories" },
  { id: "blogPosts", label: "Blog Posts" },
] as const;

const TEMP_ID_PREFIX = "temp-";

type ApiResult<T> = {
  success: boolean;
  message?: string;
  data?: T;
  fieldErrors?: Record<string, string[]>;
};

function createTempId() {
  return `${TEMP_ID_PREFIX}${crypto.randomUUID()}`;
}

function isTempId(id: string) {
  return id.startsWith(TEMP_ID_PREFIX);
}

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : "Something went wrong.";
}

async function requestJson<T>(
  endpoint: string,
  options: RequestInit,
): Promise<ApiResult<T>> {
  const response = await fetch(endpoint, options);
  const result = (await response.json()) as ApiResult<T>;

  if (!response.ok || !result.success) {
    const fieldMessage = result.fieldErrors
      ? Object.values(result.fieldErrors)
          .flat()
          .filter(Boolean)
          .join(" ")
      : "";
    throw new Error(fieldMessage || result.message || "Request failed.");
  }

  return result;
}

function updateCollectionItem<T extends { id: string }>(
  items: T[],
  id: string,
  recipe: (item: T) => T,
) {
  return items.map((item) => (item.id === id ? recipe(item) : item));
}

export function AdminDashboard({ initialData, adminEmail }: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<(typeof sectionTabs)[number]["id"]>("intro");
  const [data, setData] = useState(initialData);
  const [message, setMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function runAction(action: () => Promise<void>) {
    setMessage(null);
    startTransition(async () => {
      try {
        await action();
      } catch (error) {
        setMessage(getErrorMessage(error));
      }
    });
  }

  function updateSingleton<K extends keyof PortfolioContent>(
    key: K,
    field: keyof PortfolioContent[K],
    value: string,
  ) {
    setData((current) => ({
      ...current,
      [key]: {
        ...(current[key] as Record<string, unknown>),
        [field]: value,
      },
    }));
  }

  function saveSingleton<T extends object>(endpoint: string, payload: T, successMessage: string) {
    runAction(async () => {
      const result = await requestJson<T>(endpoint, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      setMessage(result.message ?? successMessage);
    });
  }

  async function handleSignOut() {
    const supabase = createSupabaseBrowserClient();
    await supabase.auth.signOut();
    window.location.reload();
  }

  return (
    <div className="min-h-screen bg-[#EEF4FA] p-6 md:p-10">
      <div className="mx-auto grid max-w-[1500px] gap-6 lg:grid-cols-[260px_1fr]">
        <aside className="border border-[#102A4C]/10 bg-white p-5">
          <div className="border-b border-[#102A4C]/10 pb-5">
            <p className="text-xs font-extrabold uppercase tracking-[0.22em] text-[#0057D9]">
              Admin Panel
            </p>
            <p className="mt-3 text-sm font-semibold text-[#52657C]">{adminEmail}</p>
            <button
              type="button"
              onClick={handleSignOut}
              className="mt-4 text-sm font-bold text-[#071426] underline underline-offset-4"
            >
              Sign out
            </button>
          </div>
          <nav className="mt-5 space-y-2">
            {sectionTabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`block w-full px-4 py-3 text-left text-sm font-bold transition ${
                  activeTab === tab.id
                    ? "bg-[#0057D9] text-white"
                    : "bg-[#F8FAFC] text-[#071426] hover:bg-[#DCE7F3]"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </aside>

        <section className="border border-[#102A4C]/10 bg-white p-6 md:p-8">
          <div className="mb-6 flex items-start justify-between gap-4 border-b border-[#102A4C]/10 pb-5">
            <div>
              <h1 className="text-2xl font-extrabold text-[#071426]">
                {sectionTabs.find((tab) => tab.id === activeTab)?.label}
              </h1>
              <p className="mt-2 text-sm leading-6 text-[#52657C]">
                Edit portfolio content and save updates to Supabase.
              </p>
            </div>
            {message ? <p className="max-w-sm text-right text-sm font-semibold text-[#0057D9]">{message}</p> : null}
          </div>

          {activeTab === "intro" ? (
            <div className="space-y-8">
              <div className="space-y-5">
                <AdminField
                  label="Eyebrow"
                  value={data.siteIntro.eyebrow}
                  onChange={(value) => updateSingleton("siteIntro", "eyebrow", value)}
                />
                <AdminField
                  label="Headline line 1"
                  value={data.siteIntro.headline_line_1}
                  onChange={(value) => updateSingleton("siteIntro", "headline_line_1", value)}
                />
                <AdminField
                  label="Headline line 2"
                  value={data.siteIntro.headline_line_2}
                  onChange={(value) => updateSingleton("siteIntro", "headline_line_2", value)}
                />
                <AdminField
                  label="Intro label"
                  value={data.siteIntro.intro_label}
                  onChange={(value) => updateSingleton("siteIntro", "intro_label", value)}
                />
                <AdminField
                  label="Intro heading"
                  value={data.siteIntro.intro_heading}
                  onChange={(value) => updateSingleton("siteIntro", "intro_heading", value)}
                />
                <AdminArea
                  label="Intro body"
                  value={data.siteIntro.intro_body}
                  onChange={(value) => updateSingleton("siteIntro", "intro_body", value)}
                />
                <div className="grid gap-5 md:grid-cols-2">
                  <AdminField
                    label="CTA label"
                    value={data.siteIntro.cta_label}
                    onChange={(value) => updateSingleton("siteIntro", "cta_label", value)}
                  />
                  <AdminField
                    label="CTA href"
                    value={data.siteIntro.cta_href}
                    onChange={(value) => updateSingleton("siteIntro", "cta_href", value)}
                  />
                </div>
                <div className="grid gap-5 md:grid-cols-2">
                  <AdminField
                    label="Work link label"
                    value={data.siteIntro.work_link_label}
                    onChange={(value) => updateSingleton("siteIntro", "work_link_label", value)}
                  />
                  <AdminField
                    label="Work link href"
                    value={data.siteIntro.work_link_href}
                    onChange={(value) => updateSingleton("siteIntro", "work_link_href", value)}
                  />
                </div>
                <SaveButton
                  pending={isPending}
                  onClick={() =>
                    saveSingleton("/api/admin/site-intro", data.siteIntro, "Introduction updated.")
                  }
                />
              </div>

              <ListEditor<SocialLink>
                title="Social Links"
                items={data.socialLinks}
                onChange={(items) => setData((current) => ({ ...current, socialLinks: items }))}
                createItem={(count) => ({
                  id: createTempId(),
                  sort_order: count + 1,
                  label: "",
                  href: "",
                  icon_key: "code2",
                  is_active: true,
                })}
                fields={[
                  { key: "label", label: "Label", type: "text" },
                  { key: "href", label: "Href", type: "text" },
                  { key: "icon_key", label: "Icon", type: "icon" },
                  { key: "sort_order", label: "Order", type: "number" },
                  { key: "is_active", label: "Active", type: "checkbox" },
                ]}
                saveEndpoint="/api/admin/social-links"
                pending={isPending}
                runAction={runAction}
                setMessage={setMessage}
              />
            </div>
          ) : null}

          {activeTab === "trustedBrands" ? (
            <TrustedBrandsEditor
              brands={data.trustedBrands}
              onChange={(trustedBrands) =>
                setData((current) => ({ ...current, trustedBrands }))
              }
              pending={isPending}
              runAction={runAction}
              setMessage={setMessage}
            />
          ) : null}

          {activeTab === "about" ? (
            <div className="space-y-8">
              <div className="space-y-5">
                <AdminField
                  label="Eyebrow"
                  value={data.aboutSection.eyebrow}
                  onChange={(value) => updateSingleton("aboutSection", "eyebrow", value)}
                />
                <AdminField
                  label="Title"
                  value={data.aboutSection.title}
                  onChange={(value) => updateSingleton("aboutSection", "title", value)}
                />
                <AdminArea
                  label="Intro"
                  value={data.aboutSection.intro}
                  onChange={(value) => updateSingleton("aboutSection", "intro", value)}
                />
                <AdminArea
                  label="Body"
                  value={data.aboutSection.body}
                  onChange={(value) => updateSingleton("aboutSection", "body", value)}
                />
                <SaveButton
                  pending={isPending}
                  onClick={() =>
                    saveSingleton("/api/admin/about-section", data.aboutSection, "About section updated.")
                  }
                />
              </div>
              <ListEditor<AboutStat>
                title="About Stats"
                items={data.aboutStats}
                onChange={(items) => setData((current) => ({ ...current, aboutStats: items }))}
                createItem={(count) => ({
                  id: createTempId(),
                  sort_order: count + 1,
                  label: "",
                  is_active: true,
                })}
                fields={[
                  { key: "label", label: "Label", type: "text" },
                  { key: "sort_order", label: "Order", type: "number" },
                  { key: "is_active", label: "Active", type: "checkbox" },
                ]}
                saveEndpoint="/api/admin/about-stats"
                pending={isPending}
                runAction={runAction}
                setMessage={setMessage}
              />
            </div>
          ) : null}

          {activeTab === "services" ? (
            <ListEditor<ServiceItem>
              title="Services"
              items={data.services}
              onChange={(items) => setData((current) => ({ ...current, services: items }))}
              createItem={(count) => ({
                id: createTempId(),
                sort_order: count + 1,
                title: "",
                description: "",
                fit: "",
                icon_key: "globe2",
                is_active: true,
              })}
              fields={[
                { key: "title", label: "Title", type: "text" },
                { key: "description", label: "Description", type: "textarea" },
                { key: "fit", label: "Fit", type: "textarea" },
                { key: "icon_key", label: "Icon", type: "icon" },
                { key: "sort_order", label: "Order", type: "number" },
                { key: "is_active", label: "Active", type: "checkbox" },
              ]}
              saveEndpoint="/api/admin/services"
              pending={isPending}
              runAction={runAction}
              setMessage={setMessage}
            />
          ) : null}

          {activeTab === "projects" ? (
            <ProjectsEditor
              projects={data.projects}
              onChange={(projects) => setData((current) => ({ ...current, projects }))}
              pending={isPending}
              runAction={runAction}
              setMessage={setMessage}
            />
          ) : null}

          {activeTab === "tech" ? (
            <TechEditor
              techGroups={data.techGroups}
              onChange={(techGroups) => setData((current) => ({ ...current, techGroups }))}
              pending={isPending}
              runAction={runAction}
              setMessage={setMessage}
            />
          ) : null}

          {activeTab === "process" ? (
            <ListEditor<ProcessStep>
              title="Process Steps"
              items={data.processSteps}
              onChange={(items) => setData((current) => ({ ...current, processSteps: items }))}
              createItem={(count) => ({
                id: createTempId(),
                sort_order: count + 1,
                title: "",
                description: "",
                is_active: true,
              })}
              fields={[
                { key: "title", label: "Title", type: "text" },
                { key: "description", label: "Description", type: "textarea" },
                { key: "sort_order", label: "Order", type: "number" },
                { key: "is_active", label: "Active", type: "checkbox" },
              ]}
              saveEndpoint="/api/admin/process-steps"
              pending={isPending}
              runAction={runAction}
              setMessage={setMessage}
            />
          ) : null}

          {activeTab === "why" ? (
            <ListEditor<WhyWorkItem>
              title="Why Work With Me"
              items={data.whyWorkItems}
              onChange={(items) => setData((current) => ({ ...current, whyWorkItems: items }))}
              createItem={(count) => ({
                id: createTempId(),
                sort_order: count + 1,
                title: "",
                description: "",
                icon_key: "workflow",
                is_active: true,
              })}
              fields={[
                { key: "title", label: "Title", type: "text" },
                { key: "description", label: "Description", type: "textarea" },
                { key: "icon_key", label: "Icon", type: "icon" },
                { key: "sort_order", label: "Order", type: "number" },
                { key: "is_active", label: "Active", type: "checkbox" },
              ]}
              saveEndpoint="/api/admin/why-work-items"
              pending={isPending}
              runAction={runAction}
              setMessage={setMessage}
            />
          ) : null}

          {activeTab === "testimonials" ? (
            <ListEditor<TestimonialItem>
              title="Testimonials"
              items={data.testimonials}
              onChange={(items) => setData((current) => ({ ...current, testimonials: items }))}
              createItem={(count) => ({
                id: createTempId(),
                sort_order: count + 1,
                quote: "",
                name: "",
                role: "",
                is_active: true,
              })}
              fields={[
                { key: "quote", label: "Quote", type: "textarea" },
                { key: "name", label: "Name", type: "text" },
                { key: "role", label: "Role", type: "text" },
                { key: "sort_order", label: "Order", type: "number" },
                { key: "is_active", label: "Active", type: "checkbox" },
              ]}
              saveEndpoint="/api/admin/testimonials"
              pending={isPending}
              runAction={runAction}
              setMessage={setMessage}
            />
          ) : null}

          {activeTab === "contact" ? (
            <div className="space-y-5">
              <AdminField
                label="Eyebrow"
                value={data.contactSection.eyebrow}
                onChange={(value) => updateSingleton("contactSection", "eyebrow", value)}
              />
              <AdminField
                label="Title"
                value={data.contactSection.title}
                onChange={(value) => updateSingleton("contactSection", "title", value)}
              />
              <AdminArea
                label="Body"
                value={data.contactSection.body}
                onChange={(value) => updateSingleton("contactSection", "body", value)}
              />
              <div className="grid gap-5 md:grid-cols-3">
                <AdminField
                  label="Email"
                  value={data.contactSection.email}
                  onChange={(value) => updateSingleton("contactSection", "email", value)}
                />
                <AdminField
                  label="Location"
                  value={data.contactSection.location}
                  onChange={(value) => updateSingleton("contactSection", "location", value)}
                />
                <AdminField
                  label="Availability"
                  value={data.contactSection.availability}
                  onChange={(value) => updateSingleton("contactSection", "availability", value)}
                />
              </div>
              <SaveButton
                pending={isPending}
                onClick={() =>
                  saveSingleton("/api/admin/contact-section", data.contactSection, "Contact section updated.")
                }
              />
            </div>
          ) : null}

          {activeTab === "blogSettings" ? (
            <BlogSettingsEditor
              settings={data.blogSettings}
              onChange={(blogSettings) => setData((current) => ({ ...current, blogSettings }))}
              pending={isPending}
              runAction={runAction}
              setMessage={setMessage}
            />
          ) : null}

          {activeTab === "blogCategories" ? (
            <BlogCategoriesEditor
              categories={data.blogCategories}
              onChange={(blogCategories) => setData((current) => ({ ...current, blogCategories }))}
              pending={isPending}
              runAction={runAction}
              setMessage={setMessage}
            />
          ) : null}

          {activeTab === "blogPosts" ? (
            <BlogPostsEditor
              posts={data.blogPosts}
              categories={data.blogCategories}
              onChange={(blogPosts) => setData((current) => ({ ...current, blogPosts }))}
              pending={isPending}
              runAction={runAction}
              setMessage={setMessage}
            />
          ) : null}
        </section>
      </div>
    </div>
  );
}

function TrustedBrandsEditor({
  brands,
  onChange,
  pending,
  runAction,
  setMessage,
}: {
  brands: TrustedBrand[];
  onChange: (brands: TrustedBrand[]) => void;
  pending: boolean;
  runAction: RunAction;
  setMessage: MessageSetter;
}) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-extrabold text-[#071426]">Trusted Brands</h2>
          <p className="mt-2 text-sm leading-6 text-[#52657C]">
            Add companies, optional links, and optional logo paths. If no logo is set,
            the public site uses a clean text wordmark.
          </p>
        </div>
        <button
          type="button"
          onClick={() =>
            onChange([
              ...brands,
              {
                id: createTempId(),
                sort_order: brands.length + 1,
                name: "",
                url: "#",
                logo_src: null,
                industry: "",
                is_active: true,
              },
            ])
          }
          className="bg-[#0057D9] px-4 py-3 text-sm font-bold text-white"
        >
          Add Brand
        </button>
      </div>

      {brands.map((brand, index) => {
        const previewLogoSrc = normalizePublicAssetPath(brand.logo_src);

        return (
          <div key={brand.id} className="border border-[#102A4C]/10 p-5">
            <div className="mb-4 flex items-center justify-between">
              <p className="text-sm font-extrabold text-[#071426]">Brand {index + 1}</p>
              <button
                type="button"
                onClick={() =>
                  handleDeleteListItem({
                    item: brand,
                    items: brands,
                    onChange,
                    saveEndpoint: "/api/admin/trusted-brands",
                    runAction,
                    setMessage,
                  })
                }
                className="text-sm font-bold text-[#B91C1C]"
              >
                Remove
              </button>
            </div>

            <div className="mb-5 flex min-h-24 items-center justify-center border border-[#102A4C]/10 bg-[#F8FAFC] px-5">
              {previewLogoSrc ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={previewLogoSrc}
                  alt={`${brand.name || "Brand"} logo preview`}
                  className="max-h-14 max-w-[220px] object-contain"
                />
              ) : (
                <span className="text-center text-lg font-black tracking-[-0.03em] text-[#102A4C]">
                  {brand.name || "Text wordmark preview"}
                </span>
              )}
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <AdminField
                label="Brand name"
                value={brand.name}
                onChange={(value) =>
                  onChange(updateCollectionItem(brands, brand.id, (item) => ({ ...item, name: value })))
                }
              />
              <AdminField
                label="URL"
                value={brand.url ?? ""}
                onChange={(value) =>
                  onChange(updateCollectionItem(brands, brand.id, (item) => ({ ...item, url: value })))
                }
              />
              <div>
                <AdminField
                  label="Logo path or URL"
                  value={brand.logo_src ?? ""}
                  onChange={(value) =>
                    onChange(updateCollectionItem(brands, brand.id, (item) => ({ ...item, logo_src: value })))
                  }
                />
                <p className="mt-2 text-xs font-semibold text-[#52657C]">
                  Use /images/... for files inside public/images. public/images/... also works.
                </p>
              </div>
              <AdminField
                label="Industry label"
                value={brand.industry ?? ""}
                onChange={(value) =>
                  onChange(updateCollectionItem(brands, brand.id, (item) => ({ ...item, industry: value })))
                }
              />
              <AdminField
                label="Order"
                value={String(brand.sort_order)}
                onChange={(value) =>
                  onChange(
                    updateCollectionItem(brands, brand.id, (item) => ({
                      ...item,
                      sort_order: Number(value) || 0,
                    })),
                  )
                }
              />
              <div className="flex items-end pb-3">
                <CheckField
                  label="Active"
                  checked={brand.is_active}
                  onChange={(checked) =>
                    onChange(updateCollectionItem(brands, brand.id, (item) => ({ ...item, is_active: checked })))
                  }
                />
              </div>
            </div>

            <div className="mt-4 flex gap-3">
              <button
                type="button"
                disabled={pending}
                onClick={() =>
                  handleSaveListItem({
                    item: brand,
                    items: brands,
                    onChange,
                    saveEndpoint: "/api/admin/trusted-brands",
                    runAction,
                    setMessage,
                  })
                }
                className="inline-flex min-h-11 items-center justify-center bg-[#071426] px-4 text-sm font-bold text-white disabled:opacity-60"
              >
                {pending ? "Saving..." : "Save Brand"}
              </button>
            </div>
          </div>
        );
      })}

      <button
        type="button"
        disabled={pending}
        onClick={() =>
          handleSaveOrder({
            items: brands,
            endpoint: "/api/admin/trusted-brands/reorder",
            runAction,
            setMessage,
          })
        }
        className="inline-flex min-h-11 items-center justify-center border border-[#102A4C]/14 px-4 text-sm font-bold text-[#071426] disabled:opacity-60"
      >
        Save Order
      </button>
    </div>
  );
}

function ProjectsEditor({
  projects,
  onChange,
  pending,
  runAction,
  setMessage,
}: {
  projects: ProjectItem[];
  onChange: (projects: ProjectItem[]) => void;
  pending: boolean;
  runAction: RunAction;
  setMessage: MessageSetter;
}) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-extrabold text-[#071426]">Projects</h2>
        <button
          type="button"
          onClick={() =>
            onChange([
              ...projects,
              {
                id: createTempId(),
                sort_order: projects.length + 1,
                category: "",
                title: "",
                description: "",
                role: "",
                problem: "",
                tags: [],
                is_featured: false,
                is_active: true,
              },
            ])
          }
          className="bg-[#0057D9] px-4 py-3 text-sm font-bold text-white"
        >
          Add Project
        </button>
      </div>

      {projects.map((project, index) => (
        <div key={project.id} className="border border-[#102A4C]/10 p-5">
          <div className="mb-4 flex items-center justify-between">
            <p className="text-sm font-extrabold text-[#071426]">Project {index + 1}</p>
            <button
              type="button"
              onClick={() =>
                handleDeleteListItem({
                  item: project,
                  items: projects,
                  onChange,
                  saveEndpoint: "/api/admin/projects",
                  runAction,
                  setMessage,
                })
              }
              className="text-sm font-bold text-[#B91C1C]"
            >
              Remove
            </button>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <AdminField
              label="Category"
              value={project.category}
              onChange={(value) =>
                onChange(updateCollectionItem(projects, project.id, (item) => ({ ...item, category: value })))
              }
            />
            <AdminField
              label="Title"
              value={project.title}
              onChange={(value) =>
                onChange(updateCollectionItem(projects, project.id, (item) => ({ ...item, title: value })))
              }
            />
            <AdminField
              label="Role"
              value={project.role}
              onChange={(value) =>
                onChange(updateCollectionItem(projects, project.id, (item) => ({ ...item, role: value })))
              }
            />
            <AdminField
              label="Problem"
              value={project.problem}
              onChange={(value) =>
                onChange(updateCollectionItem(projects, project.id, (item) => ({ ...item, problem: value })))
              }
            />
            <AdminField
              label="Order"
              value={String(project.sort_order)}
              onChange={(value) =>
                onChange(
                  updateCollectionItem(projects, project.id, (item) => ({
                    ...item,
                    sort_order: Number(value) || 0,
                  })),
                )
              }
            />
            <AdminField
              label="Tags"
              value={project.tags.join(", ")}
              onChange={(value) =>
                onChange(
                  updateCollectionItem(projects, project.id, (item) => ({
                    ...item,
                    tags: value.split(",").map((tag) => tag.trim()).filter(Boolean),
                  })),
                )
              }
            />
          </div>

          <div className="mt-4">
            <AdminArea
              label="Description"
              value={project.description}
              onChange={(value) =>
                onChange(updateCollectionItem(projects, project.id, (item) => ({ ...item, description: value })))
              }
            />
          </div>

          <div className="mt-4 flex flex-wrap gap-5">
            <CheckField
              label="Featured"
              checked={project.is_featured}
              onChange={(checked) =>
                onChange(
                  projects.map((item) => ({
                    ...item,
                    is_featured: item.id === project.id ? checked : false,
                  })),
                )
              }
            />
            <CheckField
              label="Active"
              checked={project.is_active}
              onChange={(checked) =>
                onChange(updateCollectionItem(projects, project.id, (item) => ({ ...item, is_active: checked })))
              }
            />
          </div>

          <div className="mt-4 flex gap-3">
            <button
              type="button"
              disabled={pending}
              onClick={() =>
                handleSaveListItem({
                  item: project,
                  items: projects,
                  onChange,
                  saveEndpoint: "/api/admin/projects",
                  runAction,
                  setMessage,
                })
              }
              className="inline-flex min-h-11 items-center justify-center bg-[#071426] px-4 text-sm font-bold text-white disabled:opacity-60"
            >
              {pending ? "Saving..." : "Save Item"}
            </button>
          </div>
        </div>
      ))}

      <button
        type="button"
        disabled={pending}
        onClick={() =>
          handleSaveOrder({
            items: projects,
            endpoint: "/api/admin/projects/reorder",
            runAction,
            setMessage,
          })
        }
        className="inline-flex min-h-11 items-center justify-center border border-[#102A4C]/14 px-4 text-sm font-bold text-[#071426] disabled:opacity-60"
      >
        Save Order
      </button>
    </div>
  );
}

function ListEditor<T extends { id: string; sort_order: number }>({
  title,
  items,
  onChange,
  createItem,
  fields,
  saveEndpoint,
  pending,
  runAction,
  setMessage,
}: {
  title: string;
  items: T[];
  onChange: (items: T[]) => void;
  createItem: (count: number) => T;
  fields: ListField[];
  saveEndpoint: string;
  pending: boolean;
  runAction: RunAction;
  setMessage: MessageSetter;
}) {
  function updateItem(id: string, field: string, value: unknown) {
    onChange(updateCollectionItem(items, id, (item) => ({ ...item, [field]: value })));
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-extrabold text-[#071426]">{title}</h2>
        <button
          type="button"
          onClick={() => onChange([...items, createItem(items.length)])}
          className="bg-[#0057D9] px-4 py-3 text-sm font-bold text-white"
        >
          Add Item
        </button>
      </div>

      {items.map((item, index) => (
        <div key={item.id} className="border border-[#102A4C]/10 p-5">
          <div className="mb-4 flex items-center justify-between">
            <p className="text-sm font-extrabold text-[#071426]">
              {title} Item {index + 1}
            </p>
            <button
              type="button"
              onClick={() =>
                handleDeleteListItem({
                  item,
                  items,
                  onChange,
                  saveEndpoint,
                  runAction,
                  setMessage,
                })
              }
              className="text-sm font-bold text-[#B91C1C]"
            >
              Remove
            </button>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {fields.map((field) => (
              <div key={field.key} className={field.type === "textarea" ? "md:col-span-2" : ""}>
                {field.type === "checkbox" ? (
                  <CheckField
                    label={field.label}
                    checked={Boolean((item as Record<string, unknown>)[field.key])}
                    onChange={(checked) => updateItem(item.id, field.key, checked)}
                  />
                ) : field.type === "icon" ? (
                  <IconSelect
                    label={field.label}
                    value={(item as Record<string, unknown>)[field.key] as IconKey}
                    onChange={(value) => updateItem(item.id, field.key, value)}
                  />
                ) : field.type === "textarea" ? (
                  <AdminArea
                    label={field.label}
                    value={String((item as Record<string, unknown>)[field.key] ?? "")}
                    onChange={(value) => updateItem(item.id, field.key, value)}
                  />
                ) : (
                  <AdminField
                    label={field.label}
                    value={String((item as Record<string, unknown>)[field.key] ?? "")}
                    onChange={(value) =>
                      updateItem(
                        item.id,
                        field.key,
                        field.type === "number" ? Number(value) || 0 : value,
                      )
                    }
                  />
                )}
              </div>
            ))}
          </div>

          <div className="mt-4 flex gap-3">
            <button
              type="button"
              disabled={pending}
              onClick={() =>
                handleSaveListItem({
                  item,
                  items,
                  onChange,
                  saveEndpoint,
                  runAction,
                  setMessage,
                })
              }
              className="inline-flex min-h-11 items-center justify-center bg-[#071426] px-4 text-sm font-bold text-white disabled:opacity-60"
            >
              {pending ? "Saving..." : "Save Item"}
            </button>
          </div>
        </div>
      ))}

      <button
        type="button"
        disabled={pending}
        onClick={() =>
          handleSaveOrder({
            items,
            endpoint: `${saveEndpoint}/reorder`,
            runAction,
            setMessage,
          })
        }
        className="inline-flex min-h-11 items-center justify-center border border-[#102A4C]/14 px-4 text-sm font-bold text-[#071426] disabled:opacity-60"
      >
        Save Order
      </button>
    </div>
  );
}

function TechEditor({
  techGroups,
  onChange,
  pending,
  runAction,
  setMessage,
}: {
  techGroups: TechGroup[];
  onChange: (techGroups: TechGroup[]) => void;
  pending: boolean;
  runAction: RunAction;
  setMessage: MessageSetter;
}) {
  function updateGroup(id: string, recipe: (group: TechGroup) => TechGroup) {
    onChange(updateCollectionItem(techGroups, id, recipe));
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-extrabold text-[#071426]">Tech Groups</h2>
        <button
          type="button"
          onClick={() =>
            onChange([
              ...techGroups,
              {
                id: createTempId(),
                sort_order: techGroups.length + 1,
                title: "",
                icon_key: "code2",
                items: [],
                is_active: true,
              },
            ])
          }
          className="bg-[#0057D9] px-4 py-3 text-sm font-bold text-white"
        >
          Add Tech Group
        </button>
      </div>

      {techGroups.map((group, index) => (
        <div key={group.id} className="border border-[#102A4C]/10 p-5">
          <div className="mb-4 flex items-center justify-between">
            <p className="text-sm font-extrabold text-[#071426]">Tech Group {index + 1}</p>
            <button
              type="button"
              onClick={() =>
                handleDeleteTechGroup({
                  group,
                  techGroups,
                  onChange,
                  runAction,
                  setMessage,
                })
              }
              className="text-sm font-bold text-[#B91C1C]"
            >
              Remove
            </button>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <AdminField
              label="Title"
              value={group.title}
              onChange={(value) => updateGroup(group.id, (item) => ({ ...item, title: value }))}
            />
            <IconSelect
              label="Icon"
              value={group.icon_key}
              onChange={(value) =>
                updateGroup(group.id, (item) => ({ ...item, icon_key: value }))
              }
            />
            <AdminField
              label="Order"
              value={String(group.sort_order)}
              onChange={(value) =>
                updateGroup(group.id, (item) => ({ ...item, sort_order: Number(value) || 0 }))
              }
            />
          </div>

          <div className="mt-4">
            <CheckField
              label="Active"
              checked={group.is_active}
              onChange={(checked) => updateGroup(group.id, (item) => ({ ...item, is_active: checked }))}
            />
          </div>

          <div className="mt-4 flex flex-wrap gap-3">
            <button
              type="button"
              disabled={pending}
              onClick={() =>
                handleSaveTechGroup({
                  group,
                  techGroups,
                  onChange,
                  runAction,
                  setMessage,
                })
              }
              className="inline-flex min-h-11 items-center justify-center bg-[#071426] px-4 text-sm font-bold text-white disabled:opacity-60"
            >
              {pending ? "Saving..." : "Save Group"}
            </button>
            <button
              type="button"
              disabled={pending}
              onClick={() =>
                handleSaveTechItemOrder({
                  group,
                  runAction,
                  setMessage,
                })
              }
              className="inline-flex min-h-11 items-center justify-center border border-[#102A4C]/14 px-4 text-sm font-bold text-[#071426] disabled:opacity-60"
            >
              Save Item Order
            </button>
          </div>

          <div className="mt-6 space-y-3">
            {group.items.map((item, itemIndex) => (
              <div
                key={item.id}
                className="grid gap-3 border border-[#102A4C]/8 p-4 md:grid-cols-[1fr_120px_auto_auto]"
              >
                <AdminField
                  label={`Item ${itemIndex + 1}`}
                  value={item.label}
                  onChange={(value) =>
                    updateGroup(group.id, (entry) => ({
                      ...entry,
                      items: updateCollectionItem(entry.items, item.id, (child) => ({
                        ...child,
                        label: value,
                      })),
                    }))
                  }
                />
                <AdminField
                  label="Order"
                  value={String(item.sort_order)}
                  onChange={(value) =>
                    updateGroup(group.id, (entry) => ({
                      ...entry,
                      items: updateCollectionItem(entry.items, item.id, (child) => ({
                        ...child,
                        sort_order: Number(value) || 0,
                      })),
                    }))
                  }
                />
                <button
                  type="button"
                  disabled={pending}
                  onClick={() =>
                    handleSaveTechItem({
                      group,
                      item,
                      techGroups,
                      onChange,
                      runAction,
                      setMessage,
                    })
                  }
                  className="self-end bg-[#102A4C] px-4 py-3 text-sm font-bold text-white disabled:opacity-60"
                >
                  Save
                </button>
                <button
                  type="button"
                  onClick={() =>
                    handleDeleteTechItem({
                      group,
                      item,
                      techGroups,
                      onChange,
                      runAction,
                      setMessage,
                    })
                  }
                  className="self-end px-3 pb-3 text-sm font-bold text-[#B91C1C]"
                >
                  Remove
                </button>
              </div>
            ))}

            <button
              type="button"
              onClick={() =>
                updateGroup(group.id, (entry) => ({
                  ...entry,
                  items: [
                    ...entry.items,
                    {
                      id: createTempId(),
                      tech_group_id: group.id,
                      sort_order: entry.items.length + 1,
                      label: "",
                    },
                  ],
                }))
              }
              className="text-sm font-bold text-[#0057D9]"
            >
              Add Tech Item
            </button>
          </div>
        </div>
      ))}

      <button
        type="button"
        disabled={pending}
        onClick={() =>
          handleSaveOrder({
            items: techGroups,
            endpoint: "/api/admin/tech-groups/reorder",
            runAction,
            setMessage,
          })
        }
        className="inline-flex min-h-11 items-center justify-center border border-[#102A4C]/14 px-4 text-sm font-bold text-[#071426] disabled:opacity-60"
      >
        Save Group Order
      </button>
    </div>
  );
}

function AdminField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block text-sm font-bold text-[#071426]">
      {label}
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-2 w-full border border-[#102A4C]/12 px-4 py-3 text-sm"
      />
    </label>
  );
}

function AdminArea({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block text-sm font-bold text-[#071426]">
      {label}
      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        rows={4}
        className="mt-2 w-full border border-[#102A4C]/12 px-4 py-3 text-sm"
      />
    </label>
  );
}

function CheckField({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <label className="inline-flex items-center gap-3 text-sm font-bold text-[#071426]">
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
      />
      {label}
    </label>
  );
}

function SaveButton({
  pending,
  onClick,
}: {
  pending: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={pending}
      className="inline-flex min-h-12 items-center justify-center bg-[#0057D9] px-5 text-sm font-bold text-white disabled:opacity-60"
    >
      {pending ? "Saving..." : "Save Changes"}
    </button>
  );
}

function handleSaveOrder<T extends { id: string; sort_order: number }>({
  items,
  endpoint,
  runAction,
  setMessage,
}: {
  items: T[];
  endpoint: string;
  runAction: RunAction;
  setMessage: MessageSetter;
}) {
  if (items.some((item) => isTempId(item.id))) {
    setMessage("Save new items before saving order.");
    return;
  }

  runAction(async () => {
    const result = await requestJson<null>(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        items: items.map((item, index) => ({
          id: item.id,
          sort_order: item.sort_order || index + 1,
        })),
      }),
    });
    setMessage(result.message ?? "Order updated.");
  });
}

function handleSaveListItem<T extends { id: string }>({
  item,
  items,
  onChange,
  saveEndpoint,
  runAction,
  setMessage,
}: {
  item: T;
  items: T[];
  onChange: (items: T[]) => void;
  saveEndpoint: string;
  runAction: RunAction;
  setMessage: MessageSetter;
}) {
  runAction(async () => {
    const isNew = isTempId(item.id);
    const endpoint = isNew ? saveEndpoint : `${saveEndpoint}/${item.id}`;
    const method = isNew ? "POST" : "PUT";
    const result = await requestJson<T>(endpoint, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(item),
    });

    if (result.data) {
      onChange(updateCollectionItem(items, item.id, () => result.data as T));
    }
    setMessage(result.message ?? "Item saved.");
  });
}

function handleDeleteListItem<T extends { id: string }>({
  item,
  items,
  onChange,
  saveEndpoint,
  runAction,
  setMessage,
}: {
  item: T;
  items: T[];
  onChange: (items: T[]) => void;
  saveEndpoint: string;
  runAction: RunAction;
  setMessage: MessageSetter;
}) {
  if (isTempId(item.id)) {
    onChange(items.filter((entry) => entry.id !== item.id));
    setMessage("Unsaved item removed.");
    return;
  }

  runAction(async () => {
    const result = await requestJson<null>(`${saveEndpoint}/${item.id}`, {
      method: "DELETE",
    });
    onChange(items.filter((entry) => entry.id !== item.id));
    setMessage(result.message ?? "Item deleted.");
  });
}

function handleSaveTechGroup({
  group,
  techGroups,
  onChange,
  runAction,
  setMessage,
}: {
  group: TechGroup;
  techGroups: TechGroup[];
  onChange: (techGroups: TechGroup[]) => void;
  runAction: RunAction;
  setMessage: MessageSetter;
}) {
  runAction(async () => {
    const isNew = isTempId(group.id);
    const endpoint = isNew ? "/api/admin/tech-groups" : `/api/admin/tech-groups/${group.id}`;
    const method = isNew ? "POST" : "PUT";
    const payload = {
      sort_order: group.sort_order,
      title: group.title,
      icon_key: group.icon_key,
      is_active: group.is_active,
    };
    const result = await requestJson<Omit<TechGroup, "items">>(endpoint, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (result.data) {
      const savedGroupId = result.data.id;
      onChange(
        techGroups.map((entry) =>
          entry.id === group.id
            ? {
                ...entry,
                ...result.data,
                items: entry.items.map((item) => ({
                  ...item,
                  tech_group_id: savedGroupId,
                })),
              }
            : entry,
        ),
      );
    }
    setMessage(result.message ?? "Tech group saved.");
  });
}

function handleDeleteTechGroup({
  group,
  techGroups,
  onChange,
  runAction,
  setMessage,
}: {
  group: TechGroup;
  techGroups: TechGroup[];
  onChange: (techGroups: TechGroup[]) => void;
  runAction: RunAction;
  setMessage: MessageSetter;
}) {
  if (isTempId(group.id)) {
    onChange(techGroups.filter((entry) => entry.id !== group.id));
    setMessage("Unsaved tech group removed.");
    return;
  }

  runAction(async () => {
    const result = await requestJson<null>(`/api/admin/tech-groups/${group.id}`, {
      method: "DELETE",
    });
    onChange(techGroups.filter((entry) => entry.id !== group.id));
    setMessage(result.message ?? "Tech group deleted.");
  });
}

function handleSaveTechItem({
  group,
  item,
  techGroups,
  onChange,
  runAction,
  setMessage,
}: {
  group: TechGroup;
  item: TechGroupItem;
  techGroups: TechGroup[];
  onChange: (techGroups: TechGroup[]) => void;
  runAction: RunAction;
  setMessage: MessageSetter;
}) {
  if (isTempId(group.id)) {
    setMessage("Save the tech group before saving its items.");
    return;
  }

  runAction(async () => {
    const isNew = isTempId(item.id);
    const endpoint = isNew
      ? "/api/admin/tech-group-items"
      : `/api/admin/tech-group-items/${item.id}`;
    const method = isNew ? "POST" : "PUT";
    const payload = {
      tech_group_id: group.id,
      sort_order: item.sort_order,
      label: item.label,
    };
    const result = await requestJson<TechGroupItem>(endpoint, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (result.data) {
      onChange(
        techGroups.map((entry) =>
          entry.id === group.id
            ? {
                ...entry,
                items: updateCollectionItem(entry.items, item.id, () => result.data as TechGroupItem),
              }
            : entry,
        ),
      );
    }
    setMessage(result.message ?? "Tech item saved.");
  });
}

function handleDeleteTechItem({
  group,
  item,
  techGroups,
  onChange,
  runAction,
  setMessage,
}: {
  group: TechGroup;
  item: TechGroupItem;
  techGroups: TechGroup[];
  onChange: (techGroups: TechGroup[]) => void;
  runAction: RunAction;
  setMessage: MessageSetter;
}) {
  if (isTempId(item.id)) {
    onChange(
      techGroups.map((entry) =>
        entry.id === group.id
          ? { ...entry, items: entry.items.filter((child) => child.id !== item.id) }
          : entry,
      ),
    );
    setMessage("Unsaved tech item removed.");
    return;
  }

  runAction(async () => {
    const result = await requestJson<null>(`/api/admin/tech-group-items/${item.id}`, {
      method: "DELETE",
    });
    onChange(
      techGroups.map((entry) =>
        entry.id === group.id
          ? { ...entry, items: entry.items.filter((child) => child.id !== item.id) }
          : entry,
      ),
    );
    setMessage(result.message ?? "Tech item deleted.");
  });
}

function handleSaveTechItemOrder({
  group,
  runAction,
  setMessage,
}: {
  group: TechGroup;
  runAction: RunAction;
  setMessage: MessageSetter;
}) {
  if (isTempId(group.id)) {
    setMessage("Save the tech group before saving item order.");
    return;
  }
  if (group.items.some((item) => isTempId(item.id))) {
    setMessage("Save new tech items before saving order.");
    return;
  }

  runAction(async () => {
    const result = await requestJson<null>("/api/admin/tech-group-items/reorder", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        items: group.items.map((item, index) => ({
          id: item.id,
          sort_order: item.sort_order || index + 1,
        })),
      }),
    });
    setMessage(result.message ?? "Tech item order updated.");
  });
}

export function IconKeyHint() {
  return null;
}

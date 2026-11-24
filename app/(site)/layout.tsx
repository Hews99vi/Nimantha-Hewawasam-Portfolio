import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { getPortfolioContent } from "@/lib/content";
export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const content = await getPortfolioContent();
  return (
    <>
      <a className="skip-link" href="#content">
        Skip to content
      </a>
      <SiteHeader />
      {children}
      <SiteFooter contact={content.contactSection} />
    </>
  );
}

import { AdminDashboard } from "@/app/admin/AdminDashboard";
import { LoginForm } from "@/app/admin/LoginForm";
import { getAdminContext } from "@/lib/admin/auth";
import { getAdminBootstrapData } from "@/lib/content";

export default async function AdminPage() {
  const admin = await getAdminContext();

  if (!admin.configured) {
    return (
      <main className="min-h-screen bg-[#EEF4FA] p-8">
        <div className="mx-auto max-w-2xl border border-[#102A4C]/10 bg-white p-8">
          <h1 className="text-2xl font-extrabold text-[#071426]">Supabase not configured</h1>
          <p className="mt-3 text-sm leading-7 text-[#52657C]">
            Add `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` to enable the admin CMS.
          </p>
        </div>
      </main>
    );
  }

  if (!admin.user) {
    return (
      <main className="min-h-screen bg-[#EEF4FA] p-8">
        <LoginForm />
      </main>
    );
  }

  if (!admin.isAdmin) {
    return (
      <main className="min-h-screen bg-[#EEF4FA] p-8">
        <div className="mx-auto max-w-2xl border border-[#102A4C]/10 bg-white p-8">
          <h1 className="text-2xl font-extrabold text-[#071426]">Access denied</h1>
          <p className="mt-3 text-sm leading-7 text-[#52657C]">
            Your account is signed in, but it is not present in the `admins` table.
          </p>
        </div>
      </main>
    );
  }

  const initialData = await getAdminBootstrapData();

  return <AdminDashboard initialData={initialData} adminEmail={admin.user.email ?? "Admin"} />;
}


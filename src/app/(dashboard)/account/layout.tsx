import { redirect } from "next/navigation"; // Add this for client-side redirect
import ClientOnly from "@/components/common/shared/ClientOnly";
import BottomFixedSection from "@/components/layout/bottomFixedSection";
import { Footer } from "@/components/layout/footer";
import MobileNavigation from "@/components/layout/mobile-navigation";
import { SidebarMobile } from "@/components/layout/sidebar-mobile";
import { SidebarNav } from "@/components/layout/sidebar-nav";
import { SiteHeader } from "@/components/layout/site-header";
import Breadcrumb from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Icons } from "@/components/ui/icons";
import { dashboardConfig } from "@/configs/dashboard";
import Link from "next/link";
import { getCurrentUser } from "@/lib/actions/user.action";
interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default async function DashboardLayout({
  children,
}: DashboardLayoutProps) {
  const currentUser = await getCurrentUser();
  // console.log("currentUser", currentUser);
  if (!currentUser) {
    redirect("/signin");
  }

  return (
    <div className="relative flex min-h-screen flex-col">
      <SiteHeader currentUser={currentUser} />
      {/* <section className="h-12 py-10 bg-gray-100 dark:bg-gray-900 flex justify-center items-center my-6">
        <Breadcrumb />
      </section> */}
      <div className="container flex-1 items-start md:grid md:grid-cols-[260px_minmax(0,1fr)] md:gap-6 lg:grid-cols-[340px_minmax(0,1fr)] lg:gap-10 mb-8">
        <DropdownMenu>
          <DropdownMenuTrigger asChild className="md:hidden my-5">
            <Button size="sm" className="bg-purple-600 border-none">
              <Icons.menu className="h-4 w-4" aria-hidden="true" /> القائمة
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1"></div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <SidebarMobile
                items={dashboardConfig.sidebarNav}
                className="p-1"
              />
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/signout">
                <Icons.logout className="mr-2 h-4 w-4" aria-hidden="true" />
                تسجيل الخروج
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <aside className="sticky max-w-[350px] bg-gray-100 dark:bg-gray-900 top-14 z-30 -ml-2 hidden h-auto w-full shrink-0 border-r md:block rounded-xl shadow-md">
          <SidebarNav
            items={dashboardConfig.sidebarNav}
            className=""
            currentUser={currentUser}
          />
        </aside>
        <main className="flex w-full flex-col overflow-hidden">{children}</main>
      </div>
      <Footer />
      <ClientOnly>
        <MobileNavigation />
      </ClientOnly>
      <BottomFixedSection />
    </div>
  );
}

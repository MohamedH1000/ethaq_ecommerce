import ClientOnly from "@/components/common/shared/ClientOnly";
import HeaderBottom from "@/components/layout/HeaderBottom";
import TopBar from "@/components/layout/TopBar";
import BottomFixedSection from "@/components/layout/bottomFixedSection";
import { Footer } from "@/components/layout/footer";
import MobileNavigation from "@/components/layout/mobile-navigation";
import { SiteHeader } from "@/components/layout/site-header";
import { getOrdersItemsByUserId } from "@/lib/actions/order.action";
import { getCurrentUser } from "@/lib/actions/user.action";
interface LobbyLayoutProps {
  children: React.ReactNode;
}
export default async function LobbyLayout({ children }: LobbyLayoutProps) {
  const currentUser = await getCurrentUser();
  const orderItems = await getOrdersItemsByUserId(currentUser?.id);
  return (
    <div className="relative">
      <TopBar />
      <SiteHeader currentUser={currentUser} orderItems={orderItems} />
      {/* <HeaderBottom /> */}

      <main className=" flex min-h-screen flex-col">{children}</main>
      <Footer />
      <ClientOnly>
        <MobileNavigation currentUser={currentUser}></MobileNavigation>
      </ClientOnly>
      <BottomFixedSection />
    </div>
  );
}

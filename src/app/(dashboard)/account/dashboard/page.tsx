import {
  PageHeader,
  PageHeaderHeading,
} from "@/components/common/shared/page-header";
import AccountInformation from "./components/AccountInformation";
import ClientOnly from "@/components/common/shared/ClientOnly";
import AccountWallets from "./components/AccountWallets";
import { getCurrentUser } from "@/lib/actions/user.action";

export default async function AccountPage() {
  const currentUser = await getCurrentUser();
  return (
    <div className="bg-gray-100 dark:bg-gray-900 p-3 md:p-8 rounded-xl min-h-[calc(83vh-3.5rem)]">
      <PageHeader
        id="account-header"
        aria-labelledby="account-header-heading"
        className="relative "
      >
        <PageHeaderHeading size="sm">لوحة التحكم الخاصة بي</PageHeaderHeading>
        <div className="border-l-4 border-primary h-7 absolute -left-8 top-0" />
      </PageHeader>

      <section className="w-full overflow-hidden mt-6">
        <AccountWallets currentUser={currentUser} />
        <ClientOnly>
          <AccountInformation currentUser={currentUser} />
        </ClientOnly>
      </section>
    </div>
  );
}

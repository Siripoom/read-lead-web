import MainLayout from "@/components/layout/MainLayout";
import RouteGuard from "@/components/layout/RouteGuard";
import ProfileCard from "@/components/dashboard/ProfileCard";
import WalletCard from "@/components/dashboard/WalletCard";
import BookmarkList from "@/components/dashboard/BookmarkList";
import PurchaseHistory from "@/components/dashboard/PurchaseHistory";
import FollowedStories from "@/components/dashboard/FollowedStories";
import Card from "@/components/ui/Card";

export default function DashboardPage() {
  return (
    <MainLayout>
      <RouteGuard allowed={["user", "creator", "admin"]}>
      <div className="p-6">
        <h1 className="text-xl font-bold text-text-primary mb-6">My Dashboard</h1>
        <div className="flex gap-6">
          {/* Left Column */}
          <div className="w-[220px] shrink-0">
            <ProfileCard />
            <WalletCard />
          </div>
          {/* Right Column */}
          <div className="flex-1">
            <Card className="p-6">
              <BookmarkList />
              <PurchaseHistory />
              <FollowedStories />
            </Card>
          </div>
        </div>
      </div>
      </RouteGuard>
    </MainLayout>
  );
}

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FloatingAds from "@/components/FloatingAds";
import { getCurrentUser } from "@/services/user-service";

export default async function MainLayout({ children }: Readonly<{ children: React.ReactNode; }>) {
    const user = await getCurrentUser();

    return (
        <div className="main-container">
            <Navbar user={user} />

            <main className="flex-1">{children}</main>

            <Footer />

            <FloatingAds />
        </div>
    );
}

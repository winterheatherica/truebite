import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FloatingAds from "@/components/FloatingAds";

export default function MainLayout({ children }: Readonly<{ children: React.ReactNode; }>) {
    return (
        <div className="main-container">
            <Navbar />

            <main className="flex-1">{children}</main>

            <Footer />

            <FloatingAds />
        </div>
    );
}
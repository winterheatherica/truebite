export default function AuthLayout({ children }: Readonly<{ children: React.ReactNode; }>) {
    return (
        <div className="min-h-screen bg-linear-to-br from-rp-dark-3 via-rp-dark-2 to-rp-foreground flex items-center justify-center p-4 relative overflow-hidden">
            {/* Decorative gradient blobs */}
            <div className="absolute inset-0">
                <div className="absolute w-96 h-96 bg-rp-primary/15 rounded-full blur-3xl -top-20 -left-20"></div>
                <div className="absolute w-96 h-96 bg-rp-secondary/10 rounded-full blur-3xl -bottom-20 -right-20"></div>
            </div>
            
            <main className="relative z-10 w-full max-w-md">
                {children}
            </main>
        </div>
    );
}
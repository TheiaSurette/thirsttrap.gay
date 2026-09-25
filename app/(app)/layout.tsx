import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="site">
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <Navbar />
      {children}
      <Footer />
    </div>
  );
}

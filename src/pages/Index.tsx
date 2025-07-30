import { useAuth } from "@/hooks/useAuth";
import Landing from "./Landing";
import Dashboard from "./Dashboard";

const Index = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-hero">
        <div className="text-center text-white">
          <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p>Carregando...</p>
        </div>
      </div>
    );
  }

  // Se autenticado, vai para o dashboard
  if (isAuthenticated) {
    return <Dashboard />;
  }

  // Se não autenticado, mostra a landing page
  return <Landing />;
};

export default Index;
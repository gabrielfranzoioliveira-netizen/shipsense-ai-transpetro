import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Ship, Home, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-grid-pattern opacity-30" />
      <div className="relative text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-primary/10 mb-6">
          <Ship className="w-10 h-10 text-primary" />
        </div>
        <h1 className="text-6xl font-bold mb-4 text-gradient-emerald">404</h1>
        <p className="text-xl text-muted-foreground mb-8">
          Oops! Esta rota não foi encontrada
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/">
            <Button className="gap-2">
              <Home className="h-4 w-4" />
              Voltar ao Início
            </Button>
          </Link>
          <Link to="/dashboard">
            <Button variant="outline" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Ir ao Dashboard
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;


import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { HelmetProvider } from 'react-helmet-async';
import { lazy, Suspense, useEffect } from "react";

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
}
import PWAReloadPrompt from "./components/PWAReloadPrompt";

const Index = lazy(() => import("./pages/Index"));
const NotFound = lazy(() => import("./pages/NotFound"));
const CategoryPage = lazy(() => import("./pages/CategoryPage"));
const RecipePage = lazy(() => import("./pages/RecipePage"));
const NewRecipePage = lazy(() => import("./pages/NewRecipePage"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: Infinity,         // recipes rarely change — never refetch within a session
      gcTime: 1000 * 60 * 30,     // keep unused cache for 30 min
    },
  },
});

const App = () => (
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <PWAReloadPrompt />
        <BrowserRouter>
          <ScrollToTop />
          <Suspense>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/category/:categoryName" element={<CategoryPage />} />
              <Route path="/recipe/:recipeId" element={<RecipePage />} />
              <Route path="/new-recipe" element={<NewRecipePage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </HelmetProvider>
);

export default App;

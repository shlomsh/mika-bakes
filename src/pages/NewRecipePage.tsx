
import React from 'react';
import RecipeCreateForm from '@/components/RecipeCreateForm';
import AppHeader from '@/components/AppHeader';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ChefHat } from 'lucide-react';

const NewRecipePage: React.FC = () => {
    const { isAuthenticated, loading } = useAuth();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const categoryId = searchParams.get('categoryId');

    React.useEffect(() => {
        if (!loading && !isAuthenticated) {
            navigate('/');
        }
    }, [isAuthenticated, loading, navigate]);

    if (loading) {
        return (
            <div className="min-h-screen w-full flex flex-col bg-gradient-mesh" style={{ direction: 'rtl' }}>
                <AppHeader />
                <div className="flex flex-col items-center justify-center flex-1">
                    <ChefHat className="h-16 w-16 text-choco animate-pulse mb-4" />
                    <p className="text-choco text-xl font-fredoka">טוען...</p>
                </div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return null;
    }

    return (
        <div className="min-h-screen w-full flex flex-col bg-gradient-mesh" style={{ direction: 'rtl' }}>
            <AppHeader />
            <main className="flex flex-col items-center px-4 md:px-8 py-8 w-full flex-1 relative z-10">
                <div className="w-full max-w-5xl">
                    <RecipeCreateForm categoryId={categoryId} />
                </div>
            </main>
        </div>
    );
};

export default NewRecipePage;

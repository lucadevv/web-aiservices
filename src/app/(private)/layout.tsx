'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/(public)/auth/hooks/useAuth';
import { useCEOAI } from './shared/hooks/useCEOAI';
import CreateCEOAIModal from './shared/components/CreateCEOAIModal';
import {
    BuildingOfficeIcon,
    PlusIcon,
    UserIcon,
    Cog6ToothIcon,
    CreditCardIcon,
    ChartBarIcon,
    ArrowRightOnRectangleIcon
} from '@heroicons/react/24/outline';



export default function PrivateLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { isAuthenticated, isLoading, user, logout } = useAuth();
    const router = useRouter();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { ceoAIs, isLoading: isLoadingCEOAIs, createCEOAI, isCreating } = useCEOAI();

    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            router.push('/auth/login');
        }
    }, [isAuthenticated, isLoading, router]);



    const handleCreateCEOAI = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    const handleSubmitCEOAI = async (data: any) => {
        try {
            await createCEOAI(data);
            // Modal will close automatically on success
        } catch (error) {
            console.error('Error creating CEO AI:', error);
            // Keep modal open on error so user can fix and retry
        }
    };

    const handleLogout = () => {
        logout();
        router.push('/auth/login');
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Verificando autenticación...</p>
                </div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return null;
    }

    return (
        <div className="h-screen bg-gray-50 flex overflow-hidden">
            {/* Sidebar */}
            <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out lg:translate-x-0 lg:relative lg:inset-0 flex flex-col`}>
                {/* Header del sidebar */}
                <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200 flex-shrink-0">
                    <h1 className="text-xl font-semibold text-gray-900">CEO AI Platform</h1>
                    <button
                        onClick={() => setSidebarOpen(false)}
                        className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100"
                    >
                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* CEO AIs Section */}
                <div className="flex-1 overflow-y-auto py-6 px-3">
                    {/* Create CEO AI Button - Only show when no CEO AIs exist */}
                    {ceoAIs.length === 0 && (
                        <div className="mb-6">
                            <button
                                onClick={handleCreateCEOAI}
                                className="w-full flex items-center justify-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                            >
                                <PlusIcon className="w-4 h-4 mr-2" />
                                Crear CEO AI
                            </button>
                        </div>
                    )}

                    {/* CEO AIs List */}
                    <div className="space-y-1">
                        <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                            Mis CEO AIs
                        </h3>

                        {isLoadingCEOAIs ? (
                            <div className="px-3 py-2">
                                <div className="animate-pulse flex space-x-3">
                                    <div className="rounded-full bg-gray-200 h-8 w-8"></div>
                                    <div className="flex-1 space-y-2">
                                        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                                        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                                    </div>
                                </div>
                            </div>
                        ) : ceoAIs.length > 0 ? (
                            ceoAIs.map((ceoAI: any) => (
                                <a
                                    key={ceoAI.id}
                                    href={`/ceo-ai/${ceoAI.id}`}
                                    className="group flex items-center px-3 py-2 text-sm font-medium rounded-lg text-gray-700 hover:text-gray-900 hover:bg-gray-100 transition-colors duration-200"
                                >
                                    <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                                        <BuildingOfficeIcon className="w-4 h-4 text-blue-600" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-gray-900 truncate">
                                            {ceoAI.name}
                                        </p>
                                        <p className="text-xs text-gray-500 truncate">
                                            {ceoAI.company_name}
                                        </p>
                                    </div>
                                    <div className="flex-shrink-0">
                                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${ceoAI.status === 'active'
                                            ? 'bg-green-100 text-green-800'
                                            : 'bg-gray-100 text-gray-800'
                                            }`}>
                                            {ceoAI.status === 'active' ? 'Activo' : 'Inactivo'}
                                        </span>
                                    </div>
                                </a>
                            ))
                        ) : (
                            <div className="px-3 py-4 text-center">
                                <BuildingOfficeIcon className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                                <p className="text-xs text-gray-500">No hay CEO AIs</p>
                                <p className="text-xs text-gray-400">Crea tu primer CEO AI</p>
                            </div>
                        )}
                    </div>

                    {/* Divider */}
                    <div className="border-t border-gray-200 my-6"></div>

                    {/* Navigation */}
                    <div className="space-y-1">
                        <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                            Navegación
                        </h3>

                        <a
                            href="/dashboard"
                            className="group flex items-center px-3 py-2 text-sm font-medium rounded-lg text-gray-700 hover:text-gray-900 hover:bg-gray-100 transition-colors duration-200"
                        >
                            <svg className="mr-3 h-5 w-5 text-gray-400 group-hover:text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
                            </svg>
                            Dashboard
                        </a>

                        <a
                            href="/dashboard/billing"
                            className="group flex items-center px-3 py-2 text-sm font-medium rounded-lg text-gray-700 hover:text-gray-900 hover:bg-gray-100 transition-colors duration-200"
                        >
                            <CreditCardIcon className="mr-3 h-5 w-5 text-gray-400 group-hover:text-blue-600" />
                            Facturación
                        </a>

                        <a
                            href="/dashboard/analytics"
                            className="group flex items-center px-3 py-2 text-sm font-medium rounded-lg text-gray-700 hover:text-gray-900 hover:bg-gray-100 transition-colors duration-200"
                        >
                            <ChartBarIcon className="mr-3 h-5 w-5 text-gray-400 group-hover:text-blue-600" />
                            Analytics
                        </a>

                        <a
                            href="/dashboard/settings"
                            className="group flex items-center px-3 py-2 text-sm font-medium rounded-lg text-gray-700 hover:text-gray-900 hover:bg-gray-100 transition-colors duration-200"
                        >
                            <Cog6ToothIcon className="mr-3 h-5 w-5 text-gray-400 group-hover:text-blue-600" />
                            Configuración
                        </a>
                    </div>
                </div>

                {/* User Section */}
                <div className="border-t border-gray-200 p-4 flex-shrink-0">
                    <div className="flex items-center">
                        <div className="flex-shrink-0">
                            <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                                <UserIcon className="w-4 h-4 text-gray-600" />
                            </div>
                        </div>
                        <div className="ml-3 flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">
                                {user?.first_name} {user?.last_name}
                            </p>
                            <p className="text-xs text-gray-500 truncate">
                                {user?.email}
                            </p>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="flex-shrink-0 p-1 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100"
                        >
                            <ArrowRightOnRectangleIcon className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Main content */}
            <div className="flex-1 lg:ml-0 flex flex-col overflow-hidden">
                {/* Top bar */}
                <div className="sticky top-0 z-40 flex items-center gap-x-6 bg-white px-4 py-4 shadow-sm sm:px-6 lg:hidden border-b border-gray-200 flex-shrink-0">
                    <button
                        type="button"
                        className="-m-2.5 p-2.5 text-gray-700 lg:hidden"
                        onClick={() => setSidebarOpen(true)}
                    >
                        <span className="sr-only">Open sidebar</span>
                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                        </svg>
                    </button>
                    <div className="flex-1 text-sm font-semibold leading-6 text-gray-900">Dashboard</div>
                </div>

                {/* Contenido principal con scroll independiente */}
                <main className="flex-1 overflow-y-auto">
                    <div className="py-6">
                        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                            {children}
                        </div>
                    </div>
                </main>
            </div>

            {/* Create CEO AI Modal */}
            <CreateCEOAIModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                onSubmit={handleSubmitCEOAI}
                isLoading={isCreating}
            />
        </div>
    );
} 
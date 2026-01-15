'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function HomePage() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <div className="min-h-screen">
            {/* Header */}
            <header className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        {/* Logo */}
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <h1 className="text-2xl font-bold text-black">AirServices</h1>
                            </div>
                        </div>

                        {/* Navigation */}
                        <nav className="hidden md:flex space-x-8">
                            <a href="#features" className="text-base text-black hover:text-gray-700 transition-colors">
                                Características
                            </a>
                            <a href="#pricing" className="text-base text-black hover:text-gray-700  transition-colors">
                                Precios
                            </a>
                            <a href="#about" className="text-base text-black hover:text-gray-700  transition-colors">
                                Nosotros
                            </a>
                        </nav>

                        {/* CTA Buttons */}
                        <div className="hidden md:flex items-center space-x-4">
                            <Link
                                href="/auth/login"
                                className="text-black hover:text-gray-700 transition-colors"
                            >
                                Iniciar Sesión
                            </Link>
                            <Link
                                href="/auth/register"
                                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                            >
                                Comenzar Gratis
                            </Link>
                        </div>

                        {/* Mobile menu button */}
                        <div className="md:hidden">
                            <button
                                onClick={() => setIsMenuOpen(!isMenuOpen)}
                                className="text-gray-700 hover:text-blue-600"
                            >
                                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile menu */}
                {isMenuOpen && (
                    <div className="md:hidden bg-white border-t border-gray-200">
                        <div className="px-2 pt-2 pb-3 space-y-1">
                            <a href="#features" className="block px-3 py-2 text-gray-700 hover:text-blue-600">
                                Características
                            </a>
                            <a href="#pricing" className="block px-3 py-2 text-gray-700 hover:text-blue-600">
                                Precios
                            </a>
                            <a href="#about" className="block px-3 py-2 text-gray-700 hover:text-blue-600">
                                Nosotros
                            </a>
                            <Link href="/auth/login" className="block px-3 py-2 text-gray-700 hover:text-blue-600">
                                Iniciar Sesión
                            </Link>
                            <Link href="/auth/register" className="block px-3 py-2 text-blue-600 hover:text-blue-700">
                                Comenzar Gratis
                            </Link>
                        </div>
                    </div>
                )}
            </header>

            {/* Hero Section */}
            <section className="relative py-20 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto text-center">
                    <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
                        Automatiza tu negocio con{' '}
                        <span className="text-blue-600">Inteligencia Artificial</span>
                    </h1>
                    <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
                        Crea bots de WhatsApp, flujos de trabajo y automatizaciones avanzadas sin escribir una sola línea de código.
                        Potenciado por n8n y IA.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                            href="/auth/register"
                            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-colors"
                        >
                            Comenzar Gratis
                        </Link>
                        <Link
                            href="#demo"
                            className="border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 px-8 py-4 rounded-lg text-lg font-semibold transition-colors"
                        >
                            Ver Demo
                        </Link>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                            Todo lo que necesitas para automatizar
                        </h2>
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                            Herramientas poderosas diseñadas para que cualquier persona pueda crear automatizaciones profesionales.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {/* Feature 1 */}
                        <div className="bg-gray-50 p-8 rounded-xl">
                            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">Bots de WhatsApp</h3>
                            <p className="text-gray-600">
                                Crea bots inteligentes que respondan automáticamente a tus clientes 24/7 con respuestas personalizadas.
                            </p>
                        </div>

                        {/* Feature 2 */}
                        <div className="bg-gray-50 p-8 rounded-xl">
                            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">Flujos de Trabajo</h3>
                            <p className="text-gray-600">
                                Diseña flujos complejos con nuestro editor visual drag & drop. Conecta apps y servicios sin código.
                            </p>
                        </div>

                        {/* Feature 3 */}
                        <div className="bg-gray-50 p-8 rounded-xl">
                            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">IA Inteligente</h3>
                            <p className="text-gray-600">
                                Agentes de IA con memoria conversacional, análisis predictivo y respuestas contextuales avanzadas.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 bg-blue-600">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                        ¿Listo para automatizar tu negocio?
                    </h2>
                    <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
                        Únete a miles de empresas que ya están ahorrando tiempo y dinero con AirServices.
                    </p>
                    <Link
                        href="/auth/register"
                        className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 rounded-lg text-lg font-semibold transition-colors inline-block"
                    >
                        Comenzar Ahora
                    </Link>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-gray-900 text-white py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid md:grid-cols-4 gap-8">
                        <div>
                            <h3 className="text-xl font-bold mb-4">AirServices</h3>
                            <p className="text-gray-400">
                                Automatización inteligente para todos.
                            </p>
                        </div>
                        <div>
                            <h4 className="font-semibold mb-4">Producto</h4>
                            <ul className="space-y-2 text-gray-400">
                                <li><a href="#" className="hover:text-white">Características</a></li>
                                <li><a href="#" className="hover:text-white">Precios</a></li>
                                <li><a href="#" className="hover:text-white">Templates</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-semibold mb-4">Soporte</h4>
                            <ul className="space-y-2 text-gray-400">
                                <li><a href="#" className="hover:text-white">Documentación</a></li>
                                <li><a href="#" className="hover:text-white">Comunidad</a></li>
                                <li><a href="#" className="hover:text-white">Contacto</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-semibold mb-4">Legal</h4>
                            <ul className="space-y-2 text-gray-400">
                                <li><a href="#" className="hover:text-white">Privacidad</a></li>
                                <li><a href="#" className="hover:text-white">Términos</a></li>
                                <li><a href="#" className="hover:text-white">Cookies</a></li>
                            </ul>
                        </div>
                    </div>
                    <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
                        <p>&copy; 2024 AirServices. Todos los derechos reservados.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
} 
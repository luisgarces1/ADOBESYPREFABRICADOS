import type { Metadata } from 'next';
import './globals.css';
import Chatbot from '@/components/Chat/Chatbot';

export const metadata: Metadata = {
    title: 'Concreto & Diseño | Adobes y Prefabricados',
    description: 'Soluciones duraderas en concreto: adobes, prefabricados y mobiliario de alta calidad para tus proyectos.',
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="es">
            <body>
                <main>{children}</main>
                <Chatbot />
            </body>
        </html>
    );
}

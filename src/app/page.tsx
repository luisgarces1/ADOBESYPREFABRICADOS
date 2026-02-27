import {
    Building2,
    Armchair,
    Construction,
    MapPin,
    Phone,
    Mail,
    CheckCircle2,
    Clock,
    Truck,
    Shield
} from 'lucide-react';
import Image from 'next/image';
import BookingCalendar from '@/components/Booking/Calendar';
import Catalog from '@/components/Catalog';

export default function Home() {
    return (
        <div className="landing-page">
            <nav style={{
                padding: '1.25rem 2rem',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                background: 'white',
                position: 'sticky',
                top: 0,
                zIndex: 1000,
                borderBottom: '4px solid var(--accent)',
                boxShadow: 'var(--shadow)'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                    <Image
                        src="/images/LOGO.jpeg"
                        alt="Logo INVERSIONES CONSTRU WT"
                        width={65}
                        height={65}
                        style={{ objectFit: 'contain' }}
                    />
                    <div style={{ lineHeight: 1.1 }}>
                        <div style={{ fontWeight: 900, fontSize: '1.3rem', color: 'var(--primary)', letterSpacing: '-0.02em' }}>
                            INVERSIONES
                        </div>
                        <div style={{ fontWeight: 900, fontSize: '1.3rem', color: 'var(--accent)', marginTop: '-2px', letterSpacing: '-0.02em' }}>
                            CONSTRU <span style={{ color: 'var(--primary)' }}>WT</span>
                        </div>
                    </div>
                </div>
                <div style={{ display: 'flex', gap: '2.5rem', alignItems: 'center' }}>
                    <a href="#productos" style={{ fontWeight: 700, fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Catálogo</a>
                    <a href="#beneficios" style={{ fontWeight: 700, fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Beneficios</a>
                    <a href="#agenda" style={{ fontWeight: 700, fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Agendar</a>
                    <a href="https://wa.me/573166211316" target="_blank" className="btn btn-primary" style={{ padding: '0.8rem 1.5rem' }}>
                        Contacto Directo
                    </a>
                </div>
            </nav>

            {/* Hero Section */}
            <section style={{
                padding: '10rem 1.5rem',
                textAlign: 'left',
                background: 'linear-gradient(rgba(33, 37, 41, 0.7), rgba(33, 37, 41, 0.85)), url("/images/FABRICACION  EN SITIO.jpeg")',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundAttachment: 'fixed',
                color: 'white',
                position: 'relative',
                overflow: 'hidden',
                display: 'flex',
                alignItems: 'center'
            }}>
                <div className="container animate-fade-in" style={{ position: 'relative', zIndex: 1, maxWidth: '1000px', margin: '0 0' }}>
                    <span style={{
                        background: 'var(--accent)',
                        padding: '0.6rem 1.2rem',
                        fontSize: '0.75rem',
                        fontWeight: 900,
                        marginBottom: '2rem',
                        display: 'inline-block',
                        textTransform: 'uppercase',
                        letterSpacing: '0.2rem',
                        color: 'var(--accent-foreground)'
                    }}>
                        Ingeniería en Concreto
                    </span>
                    <h1 style={{ fontSize: '5.5rem', marginBottom: '2rem', lineHeight: 0.95, fontWeight: 900, textTransform: 'uppercase' }}>
                        Solidez que <br />
                        <span style={{ color: 'var(--accent)' }}>Trasciende</span>
                    </h1>
                    <p style={{ fontSize: '1.4rem', marginBottom: '3.5rem', maxWidth: '700px', opacity: 0.95, fontWeight: 300, lineHeight: 1.6 }}>
                        Fabricamos prefabricados de alto rendimiento para proyectos que exigen durabilidad, diseño y precisión técnica en todo el territorio nacional.
                    </p>
                    <div style={{ display: 'flex', gap: '1.5rem' }}>
                        <a href="#productos" className="btn btn-accent" style={{ padding: '1.2rem 2.5rem' }}>
                            Ver Catálogo Pro
                        </a>
                        <a href="#agenda" className="btn" style={{ background: 'transparent', color: 'white', border: '2px solid white', padding: '1.2rem 2.5rem' }}>
                            Agendar Visita
                        </a>
                    </div>
                </div>
            </section>

            {/* Stats/Highlights */}
            <section style={{ padding: '4rem 1.5rem', marginTop: '-50px', position: 'relative', zIndex: 10 }}>
                <div className="container">
                    <div className="grid grid-cols-3" style={{ gap: '1.5rem' }}>
                        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', border: 'none', background: 'white' }}>
                            <div style={{ background: 'var(--muted)', padding: '1rem', borderRadius: '12px', color: 'var(--accent)' }}>
                                <Truck size={32} />
                            </div>
                            <div>
                                <h4 style={{ margin: 0 }}>Entregas Ágiles</h4>
                                <p style={{ fontSize: '0.85rem', color: 'var(--muted-foreground)', margin: 0 }}>Envíos a todo el país.</p>
                            </div>
                        </div>
                        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', border: 'none', background: 'white' }}>
                            <div style={{ background: 'var(--muted)', padding: '1rem', borderRadius: '12px', color: 'var(--accent)' }}>
                                <Shield size={32} />
                            </div>
                            <div>
                                <h4 style={{ margin: 0 }}>Calidad Certificada</h4>
                                <p style={{ fontSize: '0.85rem', color: 'var(--muted-foreground)', margin: 0 }}>Materiales de alta carga.</p>
                            </div>
                        </div>
                        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', border: 'none', background: 'white' }}>
                            <div style={{ background: 'var(--muted)', padding: '1rem', borderRadius: '12px', color: 'var(--accent)' }}>
                                <Clock size={32} />
                            </div>
                            <div>
                                <h4 style={{ margin: 0 }}>Soporte 24/7</h4>
                                <p style={{ fontSize: '0.85rem', color: 'var(--muted-foreground)', margin: 0 }}>Asesoría personalizada.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Booking Section */}
            <section id="agenda" style={{ padding: '7rem 1.5rem', background: 'var(--muted)' }}>
                <div className="container" style={{ maxWidth: '900px' }}>
                    <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
                        <h2 style={{ fontSize: '3rem', marginBottom: '1rem' }}>Agende una Asesoría</h2>
                        <p style={{ color: 'var(--muted-foreground)' }}>Seleccione el horario que mejor le convenga para una visita técnica o cita de ventas.</p>
                    </div>
                    <div style={{ background: 'white', padding: '2rem', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-lg)' }}>
                        <BookingCalendar />
                    </div>
                </div>
            </section>

            {/* Catalog Section (Integrated with Shopping Cart) */}
            <Catalog />

            {/* Features/Services */}
            <section id="beneficios" style={{ padding: '6rem 1.5rem', background: '#fcfcfc' }}>
                <div className="container">
                    <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
                        <h2 style={{ fontSize: '2.8rem', marginBottom: '1rem' }}>¿Por qué elegirnos?</h2>
                        <p style={{ color: 'var(--muted-foreground)', maxWidth: '600px', margin: '0 auto' }}>Más que productos, entregamos soluciones integrales para tus proyectos de infraestructura y diseño.</p>
                    </div>

                    <div className="grid grid-cols-3">
                        <div className="card" style={{ textAlign: 'center', border: 'none', background: 'transparent', boxShadow: 'none' }}>
                            <div style={{ background: 'white', width: '80px', height: '80px', borderRadius: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 2rem', boxShadow: 'var(--shadow)' }}>
                                <Construction size={40} color="var(--accent)" />
                            </div>
                            <h3 style={{ marginBottom: '1rem' }}>Prefabricados Pro</h3>
                            <p style={{ color: 'var(--muted-foreground)' }}>Desde cordones hasta adobes estructurales con procesos industriales estandarizados.</p>
                        </div>
                        <div className="card" style={{ textAlign: 'center', border: 'none', background: 'transparent', boxShadow: 'none' }}>
                            <div style={{ background: 'white', width: '80px', height: '80px', borderRadius: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 2rem', boxShadow: 'var(--shadow)' }}>
                                <Building2 size={40} color="var(--accent)" />
                            </div>
                            <h3 style={{ marginBottom: '1rem' }}>Mobiliario Urbano</h3>
                            <p style={{ color: 'var(--muted-foreground)' }}>Bancas y calados que combinan funcionalidad con una estética moderna en concreto natural.</p>
                        </div>
                        <div className="card" style={{ textAlign: 'center', border: 'none', background: 'transparent', boxShadow: 'none' }}>
                            <div style={{ background: 'white', width: '80px', height: '80px', borderRadius: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 2rem', boxShadow: 'var(--shadow)' }}>
                                <Armchair size={40} color="var(--accent)" />
                            </div>
                            <h3 style={{ marginBottom: '1rem' }}>Soluciones de Sitio</h3>
                            <p style={{ color: 'var(--muted-foreground)' }}>Mesones, lavaescobas y acabados técnicos directamente en su obra para un ajuste perfecto.</p>
                        </div>
                    </div>
                </div>
            </section>


            {/* Experience / Detailed Benefits */}
            <section style={{ padding: '6rem 1.5rem' }}>
                <div className="container">
                    <div className="grid grid-cols-2" style={{ alignItems: 'center', gap: '5rem' }}>
                        <div>
                            <h2 style={{ fontSize: '3rem', marginBottom: '2rem', lineHeight: 1.1 }}>Experiencia que Respalda su <span style={{ color: 'var(--accent)' }}>Inversión</span></h2>
                            <p style={{ fontSize: '1.2rem', color: 'var(--muted-foreground)', marginBottom: '2.5rem' }}>
                                En INVERSIONES CONSTRU WT, nos comprometemos con la excelencia técnica y el cumplimiento. Nuestro NIT 901,936,089-0 garantiza una operación legal y profesional.
                            </p>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                {[
                                    'Materiales con pruebas de laboratorio de alta resistencia.',
                                    'Diseños innovadores en grano y concreto arquitectónico.',
                                    'Logística eficiente desde nuestra sede en Bello, Antioquia.',
                                    'Atención directa en obra por ingenieros expertos.'
                                ].map((text, i) => (
                                    <div key={i} style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                        <div style={{ background: 'var(--accent)', borderRadius: '50%', padding: '0.4rem' }}>
                                            <CheckCircle2 color="white" size={20} />
                                        </div>
                                        <span style={{ fontSize: '1.1rem', fontWeight: 500 }}>{text}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div style={{ position: 'relative' }}>
                            <div style={{
                                position: 'absolute',
                                top: '-20px',
                                left: '-20px',
                                width: '100%',
                                height: '100%',
                                border: '4px solid var(--accent)',
                                borderRadius: 'var(--radius)',
                                zIndex: -1
                            }} />
                            <div style={{ borderRadius: 'var(--radius)', overflow: 'hidden', height: '500px', boxShadow: 'var(--shadow-lg)' }}>
                                <img
                                    src="/images/WhatsApp Image 2026-02-25 at 1.08.52 PM (1).jpeg"
                                    alt="Proceso de alta calidad"
                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer style={{ padding: '5rem 1.5rem', background: '#0f172a', color: 'white' }}>
                <div className="container">
                    <div className="grid grid-cols-3">
                        <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                                <Image
                                    src="/images/LOGO.jpeg"
                                    alt="Logo Small"
                                    width={50}
                                    height={50}
                                    style={{ borderRadius: '6px' }}
                                />
                                <div style={{ lineHeight: 1.1 }}>
                                    <div style={{ fontSize: '1.1rem', fontWeight: 800 }}>INVERSIONES</div>
                                    <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--accent)' }}>CONSTRU WT</div>
                                </div>
                            </div>
                            <p style={{ opacity: 0.7, fontSize: '0.95rem', lineHeight: 1.8 }}>
                                NIT 901,936,089-0. Especialistas en prefabricados y mobiliario en concreto de alta especificación para toda Colombia.
                            </p>
                        </div>
                        <div>
                            <h4 style={{ marginBottom: '2rem', color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '1px' }}>Canales de Atención</h4>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                <p style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', margin: 0 }}>
                                    <MapPin size={20} color="var(--accent)" /> Vereda Potrerito, Bello - Antioquia
                                </p>
                                <p style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', margin: 0 }}>
                                    <Phone size={20} color="var(--accent)" /> +57 316 621 1316
                                </p>
                                <p style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', margin: 0 }}>
                                    <Phone size={20} color="var(--accent)" /> 604 327 8898
                                </p>
                                <p style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', margin: 0 }}>
                                    <Mail size={20} color="var(--accent)" /> precontruwt7@gmail.com
                                </p>
                            </div>
                        </div>
                        <div>
                            <h4 style={{ marginBottom: '2rem', color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '1px' }}>Certificación</h4>
                            <p style={{ opacity: 0.7 }}>Cumplimos con las normativas locales de construcción y resistencia de materiales.</p>
                            <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem' }}>
                                {/* Mock Badges */}
                                <div style={{ width: '40px', height: '40px', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>★</div>
                                <div style={{ width: '40px', height: '40px', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>C</div>
                                <div style={{ width: '40px', height: '40px', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>W</div>
                            </div>
                        </div>
                    </div>
                    <div style={{ textAlign: 'center', marginTop: '5rem', paddingTop: '2rem', borderTop: '1px solid rgba(255,255,255,0.1)', opacity: 0.5, fontSize: '0.85rem' }}>
                        © 2026 INVERSIONES CONSTRU WT. Innovación sólida para grandes proyectos.
                    </div>
                </div>
            </footer>
        </div>
    );
}

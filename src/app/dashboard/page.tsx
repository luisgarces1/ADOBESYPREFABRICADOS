'use client';

import React, { useState, useEffect } from 'react';
import {
    BarChart3,
    Users,
    Calendar as CalendarIcon,
    LogOut,
    ExternalLink,
    Clock,
    MessageSquare,
    CheckCircle,
    Mail
} from 'lucide-react';

interface Lead {
    id: string;
    name: string;
    email: string;
    phone: string;
    product: string;
    priority: string;
    status: string;
    created_at: string;
}

export default function Dashboard() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [leads, setLeads] = useState<Lead[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('All'); // All, Pedidos, Asesorías

    useEffect(() => {
        if (isAuthenticated) {
            fetchLeads();
        }
    }, [isAuthenticated]);

    async function fetchLeads() {
        setLoading(true);
        let allLeads: Lead[] = [];

        // 1. Fetch from Google Sheets (SheetDB) - PRIMARY
        try {
            const response = await fetch('https://sheetdb.io/api/v1/5w6qrdltna61x');
            const sheetData = await response.json();
            if (Array.isArray(sheetData)) {
                // Map Google Sheet long headers to internal Lead interface
                const mappedData = sheetData
                    .filter(item => item["id (Identificador único del registro)"]) // Filter empty rows
                    .map(item => ({
                        id: item["id (Identificador único del registro)"],
                        name: item["name (Nombre del Cliente)"] || 'Sin nombre',
                        email: item["email (Correo Electrónico)"] || 'Sin email',
                        phone: item["phone (Teléfono / WhatsApp)"] || 'Sin teléfono',
                        product: item["product (Detalle de los productos o de la cita técnica)"] || 'Sin detalle',
                        priority: item["priority (Prioridad: Alta, Media o Baja)"] || 'Medium',
                        status: item["status (Estado: Nuevo, Agendado, Procesado)"] || 'Nuevo',
                        created_at: item["created_at (Fecha y hora exacta del registro)"] || new Date().toISOString()
                    }));
                allLeads = [...mappedData];
            }
        } catch (err) {
            console.error('Error fetching from Google Sheets:', err);
        }

        // 2. Remove duplicates and sort
        const uniqueLeads = Array.from(new Map(allLeads.map(item => [item.id, item])).values())
            .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

        setLeads(uniqueLeads);
        setLoading(false);
    }

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        setIsAuthenticated(true);
    };

    async function updateLeadStatus(id: string, newStatus: string) {
        setLoading(true);
        try {
            const response = await fetch(`https://sheetdb.io/api/v1/5w6qrdltna61x/id (Identificador único del registro)/${id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    data: {
                        "status (Estado: Nuevo, Agendado, Procesado)": newStatus
                    }
                })
            });

            if (response.ok) {
                // Update local state without full reload for speed
                setLeads(prev => prev.map(lead => lead.id === id ? { ...lead, status: newStatus } : lead));
            } else {
                alert('Error al actualizar el estado en Google Sheets');
            }
        } catch (err) {
            console.error('Update status error:', err);
            alert('Error de conexión al actualizar el estado');
        } finally {
            setLoading(false);
        }
    }

    if (!isAuthenticated) {
        return (
            <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f1f5f9' }}>
                <form onSubmit={handleLogin} className="card" style={{ width: '100%', maxWidth: '400px', padding: '2.5rem', borderRadius: '24px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}>
                    <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                        <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--primary)', marginBottom: '0.5rem' }}>Administración</h2>
                        <p style={{ color: 'var(--muted-foreground)', fontSize: '0.9rem' }}>Ingresa tus credenciales para continuar</p>
                    </div>
                    <div style={{ marginBottom: '1.25rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem', fontWeight: 600 }}>Email de Acceso</label>
                        <input type="email" required style={inputStyle} defaultValue="admin@construwt.com" />
                    </div>
                    <div style={{ marginBottom: '2rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem', fontWeight: 600 }}>Contraseña</label>
                        <input type="password" required style={inputStyle} defaultValue="password" />
                    </div>
                    <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '1rem', borderRadius: '12px', fontWeight: 700 }}>Iniciar Sesión</button>
                </form>
            </div>
        );
    }

    const filteredLeads = leads.filter(l => {
        if (activeTab === 'All') return true;
        if (activeTab === 'Pedidos') return !l.product.includes('Asesoría Técnica');
        if (activeTab === 'Asesorías') return l.product.includes('Asesoría Técnica');
        return true;
    });

    return (
        <div style={{ minHeight: '100vh', display: 'flex', background: '#f8fafc' }}>
            {/* Sidebar */}
            <aside style={{ width: '280px', background: 'white', borderRight: '1px solid var(--border)', padding: '2rem', display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
                <div>
                    <div style={{ fontWeight: 900, fontSize: '1.3rem', color: 'var(--primary)', letterSpacing: '-0.5px' }}>
                        CONSTRU <span style={{ color: 'var(--accent)' }}>WT</span>
                    </div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--muted-foreground)', fontWeight: 600, marginTop: '2px' }}>DASHBOARD ADMINISTRATIVO</div>
                </div>

                <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <button
                        onClick={() => setActiveTab('All')}
                        className="btn"
                        style={{ justifyContent: 'flex-start', background: activeTab === 'All' ? 'rgba(var(--primary-rgb), 0.1)' : 'transparent', color: activeTab === 'All' ? 'var(--primary)' : 'inherit', borderRadius: '12px' }}
                    >
                        <BarChart3 size={20} /> Todas las Solicitudes
                    </button>
                    <button
                        onClick={() => setActiveTab('Pedidos')}
                        className="btn"
                        style={{ justifyContent: 'flex-start', background: activeTab === 'Pedidos' ? 'rgba(var(--primary-rgb), 0.1)' : 'transparent', color: activeTab === 'Pedidos' ? 'var(--primary)' : 'inherit', borderRadius: '12px' }}
                    >
                        <Users size={20} /> Pedidos (Web)
                    </button>
                    <button
                        onClick={() => setActiveTab('Asesorías')}
                        className="btn"
                        style={{ justifyContent: 'flex-start', background: activeTab === 'Asesorías' ? 'rgba(var(--primary-rgb), 0.1)' : 'transparent', color: activeTab === 'Asesorías' ? 'var(--primary)' : 'inherit', borderRadius: '12px' }}
                    >
                        <CalendarIcon size={20} /> Asesorías / Citas
                    </button>
                </nav>

                <div style={{ marginTop: 'auto' }}>
                    <button onClick={() => setIsAuthenticated(false)} className="btn" style={{ color: '#ef4444', width: '100%', justifyContent: 'flex-start', borderRadius: '12px' }}>
                        <LogOut size={20} /> Cerrar Sesión
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main style={{ flex: 1, padding: '3rem', maxWidth: '1400px', margin: '0 auto', width: '100%' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '3rem' }}>
                    <div>
                        <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.5rem' }}>
                            {activeTab === 'All' ? 'Panel General' : activeTab === 'Pedidos' ? 'Gestión de Pedidos' : 'Calendario de Asesorías'}
                        </h1>
                        <p style={{ color: 'var(--muted-foreground)' }}>Tienes {filteredLeads.length} registros en esta categoría.</p>
                    </div>
                    <button onClick={fetchLeads} className="btn btn-primary" style={{ borderRadius: '12px' }}>Refrescar Datos</button>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3" style={{ marginBottom: '3rem', gap: '1.5rem' }}>
                    <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', padding: '1.5rem', borderRadius: '20px' }}>
                        <div style={{ background: 'rgba(59, 130, 246, 0.12)', padding: '1rem', borderRadius: '16px' }}>
                            <Users color="#3b82f6" />
                        </div>
                        <div>
                            <div style={{ fontSize: '0.85rem', color: 'var(--muted-foreground)', fontWeight: 600 }}>Total General</div>
                            <div style={{ fontSize: '1.75rem', fontWeight: 800 }}>{leads.length}</div>
                        </div>
                    </div>
                    <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', padding: '1.5rem', borderRadius: '20px' }}>
                        <div style={{ background: 'rgba(234, 179, 8, 0.12)', padding: '1rem', borderRadius: '16px' }}>
                            <Clock color="#eab308" />
                        </div>
                        <div>
                            <div style={{ fontSize: '0.85rem', color: 'var(--muted-foreground)', fontWeight: 600 }}>Nuevos Pedidos</div>
                            <div style={{ fontSize: '1.75rem', fontWeight: 800 }}>{leads.filter(l => l.status === 'Nuevo' || l.status === 'New').length}</div>
                        </div>
                    </div>
                    <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', padding: '1.5rem', borderRadius: '20px' }}>
                        <div style={{ background: 'rgba(34, 197, 94, 0.12)', padding: '1rem', borderRadius: '16px' }}>
                            <CalendarIcon color="#22c55e" />
                        </div>
                        <div>
                            <div style={{ fontSize: '0.85rem', color: 'var(--muted-foreground)', fontWeight: 600 }}>Citas Agendadas</div>
                            <div style={{ fontSize: '1.75rem', fontWeight: 800 }}>{leads.filter(l => l.status === 'Agendado' || l.status === 'Scheduled').length}</div>
                        </div>
                    </div>
                </div>

                {/* Table */}
                <div className="card" style={{ padding: 0, overflow: 'hidden', borderRadius: '24px', border: '1px solid var(--border)', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead style={{ background: '#f8fafc', textAlign: 'left', borderBottom: '1px solid var(--border)' }}>
                                <tr>
                                    <th style={thStyle}>CLIENTE</th>
                                    <th style={thStyle}>PRODUCTO / SERVICIO</th>
                                    <th style={thStyle}>ESTADO</th>
                                    <th style={thStyle}>FECHA</th>
                                    <th style={thStyle}>ACCIONES</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr><td colSpan={5} style={{ padding: '4rem', textAlign: 'center', color: 'var(--muted-foreground)' }}>Cargando registros...</td></tr>
                                ) : filteredLeads.length === 0 ? (
                                    <tr><td colSpan={5} style={{ padding: '4rem', textAlign: 'center', color: 'var(--muted-foreground)' }}>No hay datos para mostrar en esta categoría.</td></tr>
                                ) : filteredLeads.map((lead) => (
                                    <tr key={lead.id} style={{ borderBottom: '1px solid #f1f5f9', transition: 'background 0.2s' }}>
                                        <td style={tdStyle}>
                                            <div style={{ fontWeight: 700, color: 'var(--primary)' }}>{lead.name}</div>
                                            <div style={{ fontSize: '0.8rem', color: 'var(--muted-foreground)' }}>{lead.email}</div>
                                            <div style={{ fontSize: '0.8rem', color: 'var(--muted-foreground)' }}>{lead.phone}</div>
                                        </td>
                                        <td style={tdStyle}>
                                            <div style={{ fontSize: '0.9rem', fontWeight: 600, maxWidth: '400px' }}>{lead.product}</div>
                                        </td>
                                        <td style={tdStyle}>
                                            <select
                                                value={lead.status}
                                                onChange={(e) => updateLeadStatus(lead.id, e.target.value)}
                                                style={{
                                                    padding: '0.4rem 0.8rem',
                                                    borderRadius: '20px',
                                                    fontSize: '0.8rem',
                                                    fontWeight: 700,
                                                    border: 'none',
                                                    cursor: 'pointer',
                                                    color: 'white',
                                                    background: getStatusColor(lead.status),
                                                    outline: 'none',
                                                    appearance: 'none',
                                                    textAlign: 'center'
                                                }}
                                            >
                                                <option value="Nuevo">NUEVO</option>
                                                <option value="Agendado">AGENDADO</option>
                                                <option value="En Producción">EN PRODUCCIÓN</option>
                                                <option value="Cliente Perdido">CLIENTE PERDIDO</option>
                                                <option value="Llamar Después">LLAMAR DESPUÉS</option>
                                                <option value="En Proceso">EN PROCESO</option>
                                                <option value="En Negociación">EN NEGOCIACIÓN</option>
                                                <option value="Pago">PAGO</option>
                                                <option value="Debe">DEBE</option>
                                            </select>
                                        </td>
                                        <td style={tdStyle}>
                                            <div style={{ fontSize: '0.85rem' }}>
                                                {isNaN(Date.parse(lead.created_at)) ? lead.created_at : new Date(lead.created_at).toLocaleDateString()}
                                            </div>
                                            <div style={{ fontSize: '0.75rem', color: 'var(--muted-foreground)' }}>
                                                {isNaN(Date.parse(lead.created_at)) ? '' : new Date(lead.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </div>
                                        </td>
                                        <td style={tdStyle}>
                                            <div style={{ display: 'flex', gap: '0.75rem' }}>
                                                <button
                                                    className="btn hover-scale"
                                                    title="Contactar por WhatsApp"
                                                    style={{
                                                        padding: '0.6rem',
                                                        background: '#22c55e',
                                                        color: 'white',
                                                        borderRadius: '12px',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        boxShadow: '0 4px 12px rgba(34, 197, 94, 0.3)'
                                                    }}
                                                    onClick={() => window.open(`https://wa.me/57${lead.phone.replace(/\D/g, '')}`, '_blank')}
                                                >
                                                    <MessageSquare size={18} />
                                                </button>
                                                <a href={`mailto:${lead.email}`} style={{ padding: '0.6rem', background: '#f1f5f9', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                    <Mail size={18} color="#64748b" />
                                                </a>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>
        </div>
    );
}

const getStatusColor = (status: string) => {
    switch (status) {
        case 'Nuevo': return '#22c55e'; // Verde
        case 'Agendado': return '#3b82f6'; // Azul
        case 'En Producción': return '#8b5cf6'; // Morado
        case 'Cliente Perdido': return '#ef4444'; // Rojo
        case 'Llamar Después': return '#f59e0b'; // Naranja
        case 'En Proceso': return '#06b6d4'; // Cyan
        case 'En Negociación': return '#ec4899'; // Rosa
        case 'Pago': return '#10b981'; // Esmeralda
        case 'Debe': return '#f43f5e'; // Fucsia/Rojo suave
        default: return '#64748b';
    }
};

const inputStyle = {
    padding: '0.85rem 1rem',
    borderRadius: '12px',
    border: '1px solid var(--border)',
    background: 'white',
    fontFamily: 'inherit',
    width: '100%',
    fontSize: '0.95rem'
};
const thStyle = { padding: '1.25rem 1.5rem', fontSize: '0.75rem', fontWeight: 800, color: 'var(--muted-foreground)', letterSpacing: '0.05em' };
const tdStyle = { padding: '1.25rem 1.5rem' };

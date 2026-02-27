'use client';

import React, { useState } from 'react';
import { ShoppingCart, Plus, Minus, Trash2, X, Send, User, Phone as PhoneIcon, Mail, MapPin, CheckCircle } from 'lucide-react';

interface Product {
    id: string;
    name: string;
    image: string;
    description: string;
}

const PRODUCTS: Product[] = [
    { id: '1', name: 'Tope Llanta', image: '/images/TOPE LLANTA.jpeg', description: 'Tope de llanta en concreto de alta resistencia para parqueaderos.' },
    { id: '2', name: 'Pasos', image: '/images/PASOS.jpeg', description: 'Pasos prefabricados para senderos y jardines.' },
    { id: '3', name: 'Lagrimal', image: '/images/LAGRIMAL.jpeg', description: 'Soluciones de drenaje y lagrimales en concreto.' },
    { id: '4', name: 'Fabricación en Sitio', image: '/images/FABRICACION  EN SITIO.jpeg', description: 'Personal especializado para fabricación de elementos en su obra.' },
    { id: '5', name: 'Cordón', image: '/images/CORDON.jpeg', description: 'Cordones de confinamiento para vías y andenes.' },
    { id: '6', name: 'Carcamo', image: '/images/CARCAMO.jpeg', description: 'Cárcomos industriales para manejo de aguas.' },
    { id: '7', name: 'Calados', image: '/images/CALADOS.jpeg', description: 'Calados arquitectónicos para ventilación y diseño.' },
    { id: '8', name: 'Caja para Contador', image: '/images/CAJA PARA CONTADOR.jpeg', description: 'Cajas de protección para medidores de servicios públicos.' },
    { id: '9', name: 'Butaco', image: '/images/BUTACO.jpeg', description: 'Mobiliario urbano: butacos de concreto minimalistas.' },
    { id: '10', name: 'Adobe en Concreto', image: '/images/ADOBE EN CONCRETO.jpeg', description: 'Bloques y adobes estructurales de máxima durabilidad.' },
];

interface CartItem extends Product {
    quantity: number;
}

export default function Catalog() {
    const [cart, setCart] = useState<CartItem[]>([]);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [showCheckoutForm, setShowCheckoutForm] = useState(false);
    const [loading, setLoading] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [userData, setUserData] = useState({
        name: '',
        email: '',
        phone: '',
        address: ''
    });

    const addToCart = (product: Product) => {
        setCart(prev => {
            const existing = prev.find(item => item.id === product.id);
            if (existing) {
                return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
            }
            return [...prev, { ...product, quantity: 1 }];
        });
    };

    const updateQuantity = (id: string, delta: number) => {
        setCart(prev => prev.map(item => {
            if (item.id === id) {
                const newQty = Math.max(1, item.quantity + delta);
                return { ...item, quantity: newQty };
            }
            return item;
        }));
    };

    const manualSetQuantity = (id: string, value: string) => {
        const qty = parseInt(value);
        if (isNaN(qty)) return;
        setCart(prev => prev.map(item => item.id === id ? { ...item, quantity: Math.max(1, qty) } : item));
    };

    const removeItem = (id: string) => {
        setCart(prev => prev.filter(item => item.id !== id));
    };

    const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);

    const handleFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const leadData = {
            "id (Identificador único del registro)": 'ID-' + Date.now(),
            "name (Nombre del Cliente)": userData.name,
            "email (Correo Electrónico)": userData.email,
            "phone (Teléfono / WhatsApp)": userData.phone,
            "product (Detalle de los productos o de la cita técnica)": cart.map(item => `${item.name} (x${item.quantity})`).join(', ') + ` | Entrega: ${userData.address}`,
            "priority (Prioridad: Alta, Media o Baja)": 'High',
            "status (Estado: Nuevo, Agendado, Procesado)": 'Nuevo',
            "created_at (Fecha y hora exacta del registro)": new Date().toLocaleString()
        };

        // PRIMARY: Google Sheets via SheetDB
        try {
            await fetch('https://sheetdb.io/api/v1/5w6qrdltna61x', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    data: [leadData]
                })
            });
            // Success handling
            setShowSuccessModal(true);
        } catch (sheetErr) {
            console.error('SheetDB Error:', sheetErr);
            alert('Hubo un error al registrar su pedido. Por favor verifique su conexión e intente nuevamente.');
        }

        // Finalize
        setCart([]);
        setUserData({ name: '', email: '', phone: '', address: '' });
        setShowCheckoutForm(false);
        setIsCartOpen(false);
        setLoading(false);
    };

    return (
        <section id="productos" style={{ padding: '5rem 1.5rem', position: 'relative' }}>
            <div className="container">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
                    <div>
                        <h2 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>Nuestro Catálogo</h2>
                        <p style={{ color: 'var(--muted-foreground)' }}>Selecciona los productos para cotizar tu pedido.</p>
                    </div>
                </div>

                <div className="grid grid-cols-3">
                    {PRODUCTS.map((product) => (
                        <div key={product.id} className="card product-card" style={{ padding: 0, border: '1px solid #eee', display: 'flex', flexDirection: 'column', transition: 'all 0.4s ease' }}>
                            <div style={{ position: 'relative', height: '300px', overflow: 'hidden' }}>
                                <img
                                    src={product.image}
                                    alt={product.name}
                                    className="product-image"
                                    style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)' }}
                                />
                                <div className="image-overlay" style={{
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    width: '100%',
                                    height: '100%',
                                    background: 'linear-gradient(to bottom, transparent 40%, rgba(33,37,41,0.8))',
                                    opacity: 0.8,
                                    transition: 'opacity 0.3s ease'
                                }} />
                                <div style={{ position: 'absolute', bottom: '1.5rem', left: '1.5rem' }}>
                                    <span style={{ fontSize: '0.65rem', background: 'var(--accent)', padding: '4px 10px', fontWeight: 800, color: 'var(--accent-foreground)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>REF: {product.id.padStart(3, '0')}</span>
                                </div>
                            </div>
                            <div style={{ padding: '2rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                                <h4 style={{ margin: '0 0 1rem', fontSize: '1.4rem', fontWeight: 900, textTransform: 'uppercase' }}>{product.name}</h4>
                                <p style={{ fontSize: '0.95rem', color: 'var(--muted-foreground)', marginBottom: '2rem', flex: 1, lineHeight: 1.6, fontWeight: 400 }}>
                                    {product.description}
                                </p>
                                <button
                                    onClick={() => addToCart(product)}
                                    className="btn btn-accent add-button"
                                    style={{ width: '100%', fontWeight: 800 }}
                                >
                                    <Plus size={18} /> Agregar a Cotización
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {totalItems > 0 && (
                    <div style={{ marginTop: '4rem', display: 'flex', justifyContent: 'center' }}>
                        <button
                            onClick={() => setIsCartOpen(true)}
                            className="btn btn-accent"
                            style={{
                                padding: '1.5rem 4rem',
                                fontSize: '1.4rem',
                                fontWeight: 900,
                                borderRadius: '50px',
                                boxShadow: '0 15px 35px rgba(209, 210, 29, 0.4)',
                                border: 'none',
                                animation: 'pulse 2s infinite'
                            }}
                        >
                            <ShoppingCart size={32} />
                            VER MI PEDIDO ({totalItems})
                        </button>
                    </div>
                )}
            </div>

            {/* Cart Sidebar/Overlay */}
            {isCartOpen && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    right: 0,
                    width: '100%',
                    height: '100%',
                    background: 'rgba(15, 23, 42, 0.4)',
                    zIndex: 1000,
                    display: 'flex',
                    justifyContent: 'flex-end',
                    backdropFilter: 'blur(8px)',
                    transition: 'all 0.3s ease'
                }} onClick={() => { if (!showCheckoutForm) setIsCartOpen(false); }}>
                    <div
                        className="cart-sidebar"
                        style={{
                            width: '450px',
                            maxWidth: '90%',
                            background: 'white',
                            height: '100%',
                            padding: '2.5rem',
                            display: 'flex',
                            flexDirection: 'column',
                            boxShadow: '-10px 0 30px rgba(0,0,0,0.15)',
                            animation: 'slideIn 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                            position: 'relative'
                        }}
                        onClick={e => e.stopPropagation()}
                    >
                        {!showCheckoutForm ? (
                            <>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
                                    <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '1.5rem', fontWeight: 800 }}>
                                        <ShoppingCart size={28} color="var(--accent)" /> Tu Pedido
                                    </h3>
                                    <button onClick={() => setIsCartOpen(false)} style={{ padding: '0.6rem', borderRadius: '50%', background: 'var(--muted)', transition: 'background 0.2s' }}>
                                        <X size={20} />
                                    </button>
                                </div>

                                <div style={{ flex: 1, overflowY: 'auto', marginBottom: '2rem', paddingRight: '0.5rem' }} className="custom-scrollbar">
                                    {cart.length === 0 ? (
                                        <div style={{ textAlign: 'center', padding: '5rem 0' }}>
                                            <div style={{
                                                width: '100px',
                                                height: '100px',
                                                background: 'var(--muted)',
                                                borderRadius: '50%',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                margin: '0 auto 1.5rem',
                                                opacity: 0.5
                                            }}>
                                                <ShoppingCart size={40} color="var(--muted-foreground)" />
                                            </div>
                                            <h4 style={{ marginBottom: '0.5rem' }}>¿Aún no has elegido?</h4>
                                            <p style={{ color: 'var(--muted-foreground)', fontSize: '0.95rem' }}>Agrega productos del catálogo para solicitar una cotización.</p>
                                        </div>
                                    ) : (
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                                            {cart.map(item => (
                                                <div key={item.id} style={{
                                                    display: 'flex',
                                                    gap: '1.25rem',
                                                    alignItems: 'center',
                                                    background: '#f8fafc',
                                                    padding: '1rem',
                                                    borderRadius: '16px',
                                                    border: '1px solid var(--border)',
                                                    animation: 'fadeIn 0.3s ease'
                                                }}>
                                                    <img src={item.image} alt={item.name} style={{ width: '70px', height: '70px', objectFit: 'cover', borderRadius: '12px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }} />
                                                    <div style={{ flex: 1 }}>
                                                        <h5 style={{ margin: 0, fontSize: '1rem', fontWeight: 700 }}>{item.name}</h5>
                                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '0.75rem' }}>
                                                            <div style={{ display: 'flex', alignItems: 'center', background: 'white', borderRadius: '25px', padding: '4px 12px', border: '1px solid var(--border)' }}>
                                                                <button onClick={() => updateQuantity(item.id, -1)} style={{ color: 'var(--primary)' }}><Minus size={14} /></button>
                                                                <input
                                                                    type="number"
                                                                    value={item.quantity}
                                                                    onChange={(e) => manualSetQuantity(item.id, e.target.value)}
                                                                    style={{
                                                                        width: '50px',
                                                                        textAlign: 'center',
                                                                        fontWeight: 800,
                                                                        fontSize: '0.9rem',
                                                                        border: 'none',
                                                                        background: 'transparent',
                                                                        padding: 0
                                                                    }}
                                                                />
                                                                <button onClick={() => updateQuantity(item.id, 1)} style={{ color: 'var(--primary)' }}><Plus size={14} /></button>
                                                            </div>
                                                            <button onClick={() => removeItem(item.id)} style={{ color: '#ef4444', opacity: 0.7, padding: '0.5rem' }}><Trash2 size={16} /></button>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {cart.length > 0 && (
                                    <div style={{ background: '#f1f5f9', borderRadius: '24px', padding: '1.5rem' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem', fontSize: '1.2rem', fontWeight: 800 }}>
                                            <span>Total Productos</span>
                                            <span style={{ color: 'var(--accent)' }}>{totalItems}</span>
                                        </div>
                                        <button
                                            onClick={() => setShowCheckoutForm(true)}
                                            className="btn btn-primary"
                                            style={{ width: '100%', padding: '1.2rem', fontSize: '1.1rem', fontWeight: 800, borderRadius: '18px' }}
                                        >
                                            Continuar con el Pedido
                                        </button>
                                    </div>
                                )}
                            </>
                        ) : (
                            <>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                                    <h3 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Tus Datos</h3>
                                    <button onClick={() => setShowCheckoutForm(false)} style={{ padding: '0.6rem', borderRadius: '50%', background: 'var(--muted)' }}>
                                        <X size={20} />
                                    </button>
                                </div>
                                <p style={{ color: 'var(--muted-foreground)', marginBottom: '2rem', fontSize: '0.9rem' }}>
                                    Por favor completa tus datos para registrar el pedido y contactarte.
                                </p>
                                <form onSubmit={handleFormSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', flex: 1 }}>
                                    <div className="input-group">
                                        <label style={labelStyle}><User size={16} /> Nombre Completo</label>
                                        <input
                                            required
                                            style={inputStyle}
                                            placeholder="Ej: Juan Pérez"
                                            value={userData.name}
                                            onChange={e => setUserData({ ...userData, name: e.target.value })}
                                        />
                                    </div>
                                    <div className="input-group">
                                        <label style={labelStyle}><PhoneIcon size={16} /> Teléfono / WhatsApp</label>
                                        <input
                                            required
                                            style={inputStyle}
                                            placeholder="Ej: 300 123 4567"
                                            value={userData.phone}
                                            onChange={e => setUserData({ ...userData, phone: e.target.value })}
                                        />
                                    </div>
                                    <div className="input-group">
                                        <label style={labelStyle}><Mail size={16} /> Correo Electrónico</label>
                                        <input
                                            type="email"
                                            required
                                            style={inputStyle}
                                            placeholder="ejemplo@correo.com"
                                            value={userData.email}
                                            onChange={e => setUserData({ ...userData, email: e.target.value })}
                                        />
                                    </div>
                                    <div className="input-group">
                                        <label style={labelStyle}><MapPin size={16} /> Dirección de Entrega</label>
                                        <input
                                            required
                                            style={inputStyle}
                                            placeholder="Ciudad, Barrio, Dirección"
                                            value={userData.address}
                                            onChange={e => setUserData({ ...userData, address: e.target.value })}
                                        />
                                    </div>

                                    <div style={{ marginTop: 'auto', paddingTop: '2rem' }}>
                                        <button
                                            type="submit"
                                            disabled={loading}
                                            className="btn btn-primary"
                                            style={{ width: '100%', padding: '1.2rem' }}
                                        >
                                            {loading ? 'Procesando...' : (
                                                <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                    <Send size={18} /> Confirmar Cotización
                                                </span>
                                            )}
                                        </button>
                                    </div>
                                </form>
                            </>
                        )}
                    </div>
                </div>
            )}
            <style jsx>{`
                .product-card:hover .product-image {
                    transform: scale(1.1);
                }
                .product-card:hover .image-overlay {
                    opacity: 1;
                }
                .add-button:active {
                    transform: scale(0.95);
                }
                @keyframes slideIn {
                    from { transform: translateX(100%); }
                    to { transform: translateX(0); }
                }
                .custom-scrollbar::-webkit-scrollbar {
                    width: 6px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: var(--muted);
                    border-radius: 10px;
                }
                /* Quitar flechas por defecto del input de número */
                input::-webkit-outer-spin-button,
                input::-webkit-inner-spin-button {
                    -webkit-appearance: none;
                    margin: 0;
                }
                input[type=number] {
                    -moz-appearance: textfield;
                }
            `}</style>
            {/* Modal de Éxito Custom */}
            {showSuccessModal && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100vw',
                    height: '100vh',
                    background: 'rgba(0,0,0,0.85)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 9999,
                    backdropFilter: 'blur(5px)'
                }}>
                    <div className="card" style={{
                        maxWidth: '500px',
                        width: '90%',
                        textAlign: 'center',
                        padding: '3rem 2rem',
                        position: 'relative',
                        borderTop: '5px solid var(--accent)',
                        animation: 'modalSlideIn 0.3s ease-out'
                    }}>
                        <style>{`
                        @keyframes modalSlideIn {
                            from { transform: translateY(20px); opacity: 0; }
                            to { transform: translateY(0); opacity: 1; }
                        }
                    `}</style>
                        <div style={{
                            width: '70px',
                            height: '70px',
                            background: '#dcfce7',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            margin: '0 auto 1.5rem'
                        }}>
                            <CheckCircle size={40} color="#16a34a" />
                        </div>
                        <h2 style={{ fontSize: '1.8rem', fontWeight: 900, marginBottom: '1rem', textTransform: 'uppercase' }}>
                            ¡Pedido Recibido!
                        </h2>
                        <p style={{ color: 'var(--muted-foreground)', lineHeight: '1.6', marginBottom: '2rem' }}>
                            Su solicitud ha sido registrada exitosamente en nuestro sistema industrial. Nuestro equipo comercial lo contactará en breve para coordinar los detalles.
                        </p>
                        <button
                            onClick={() => setShowSuccessModal(false)}
                            className="btn btn-primary"
                            style={{ width: '100%', padding: '1rem', fontWeight: 900 }}
                        >
                            LO ANTES POSIBLE TE CONTACTAREMOS
                        </button>
                    </div>
                </div>
            )}
        </section>
    );
}

const inputStyle = {
    padding: '0.85rem 1rem',
    borderRadius: '12px',
    border: '1px solid var(--border)',
    background: '#f8fafc',
    fontFamily: 'inherit',
    width: '100%',
    fontSize: '0.95rem'
};

const labelStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    marginBottom: '0.5rem',
    fontSize: '0.85rem',
    fontWeight: 700,
    color: 'var(--primary)'
};

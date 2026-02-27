'use client';

import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send, User, Bot, Loader2 } from 'lucide-react';

type Step = 'greeting' | 'product' | 'scale' | 'urgency' | 'contact' | 'thanks';

interface LeadData {
    product?: string;
    scale?: string;
    urgency?: string;
    name?: string;
    email?: string;
    phone?: string;
    priority?: 'High' | 'Medium' | 'Low';
}

export default function Chatbot() {
    const [isOpen, setIsOpen] = useState(false);
    const [step, setStep] = useState<Step>('greeting');
    const [messages, setMessages] = useState<{ role: 'bot' | 'user'; text: string }[]>([]);
    const [leadData, setLeadData] = useState<LeadData>({});
    const [isTyping, setIsTyping] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (isOpen && messages.length === 0) {
            addBotMessage('¡Hola! Soy el asistente virtual de CONSTRU WT. ¿En qué podemos ayudarte hoy?');
            setTimeout(() => {
                addBotMessage('¿Qué tipo de producto estás buscando?');
                setStep('product');
            }, 1000);
        }
    }, [isOpen]);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, isTyping]);

    const addBotMessage = (text: string) => {
        setIsTyping(true);
        setTimeout(() => {
            setMessages(prev => [...prev, { role: 'bot', text }]);
            setIsTyping(false);
        }, 1000);
    };

    const addUserMessage = (text: string) => {
        setMessages(prev => [...prev, { role: 'user', text }]);
    };

    const handleSelection = async (option: string, value: string) => {
        addUserMessage(option);
        const updatedData = { ...leadData, [step]: value };
        setLeadData(updatedData);

        if (step === 'product') {
            addBotMessage('Interesante. ¿Tu proyecto es de carácter personal o empresarial?');
            setStep('scale');
        } else if (step === 'scale') {
            addBotMessage('Entendido. ¿Qué tan pronto necesitas el material?');
            setStep('urgency');
        } else if (step === 'urgency') {
            // Detect urgency
            let priority: 'High' | 'Medium' | 'Low' = 'Medium';
            if (value === 'Immediate') priority = 'High';
            if (value === 'Later') priority = 'Low';

            setLeadData(prev => ({ ...prev, priority }));
            addBotMessage('¡Perfecto! Déjanos tus datos de contacto para que un asesor te envíe una cotización personalizada.');
            setStep('contact');
        }
    };

    const handleSubmitContact = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const name = formData.get('name') as string;
        const email = formData.get('email') as string;
        const phone = formData.get('phone') as string;

        const finalData = { ...leadData, name, email, phone };
        addUserMessage(`Nombre: ${name}, Email: ${email}, Tel: ${phone}`);
        setLeadData(finalData);

        addBotMessage('Estamos procesando tu solicitud...');

        try {
            await fetch('https://sheetdb.io/api/v1/5w6qrdltna61x', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    data: [{
                        "id (Identificador único del registro)": 'CHAT-' + Date.now(),
                        "name (Nombre del Cliente)": name,
                        "email (Correo Electrónico)": email,
                        "phone (Teléfono / WhatsApp)": phone,
                        "product (Detalle de los productos o de la cita técnica)": `Chat: ${finalData.product} | Proyecto: ${finalData.scale}`,
                        "priority (Prioridad: Alta, Media o Baja)": 'High',
                        "status (Estado: Nuevo, Agendado, Procesado)": 'Nuevo',
                        "created_at (Fecha y hora exacta del registro)": new Date().toLocaleString()
                    }]
                })
            });

            addBotMessage('¡Gracias! Hemos recibido tu información. Un asesor te contactará muy pronto.');
            setStep('thanks');
        } catch (err) {
            console.error('Error saving lead:', err);
            addBotMessage('Parece que hubo un error al guardar tus datos, pero no te preocupes, ya lo estamos revisando.');
            setStep('thanks');
        }
    };

    return (
        <div className="chatbot-container">
            {/* Trigger Button */}
            {!isOpen && (
                <button
                    onClick={() => setIsOpen(true)}
                    style={{
                        width: '64px',
                        height: '64px',
                        borderRadius: '50%',
                        background: 'var(--accent)',
                        color: 'white',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: 'var(--shadow-lg)',
                        transition: 'transform 0.3s ease'
                    }}
                    className="hover-scale"
                >
                    <MessageCircle size={32} />
                </button>
            )}

            {/* Chat Window */}
            {isOpen && (
                <div className="chatbot-window">
                    {/* Header */}
                    <div style={{
                        padding: '1.25rem',
                        background: 'var(--primary)',
                        color: 'white',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <div style={{ width: '10px', height: '10px', background: '#22c55e', borderRadius: '50%' }}></div>
                            <span style={{ fontWeight: 600 }}>Asistente CONSTRU WT</span>
                        </div>
                        <button onClick={() => setIsOpen(false)} style={{ color: 'white' }}>
                            <X size={20} />
                        </button>
                    </div>

                    {/* Messages area */}
                    <div
                        ref={scrollRef}
                        style={{
                            flex: 1,
                            padding: '1.25rem',
                            overflowY: 'auto',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '1rem'
                        }}
                    >
                        {messages.map((m, i) => (
                            <div key={i} style={{
                                alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start',
                                maxWidth: '80%',
                                background: m.role === 'user' ? 'var(--accent)' : 'var(--muted)',
                                color: m.role === 'user' ? 'white' : 'var(--foreground)',
                                padding: '0.75rem 1rem',
                                borderRadius: '12px',
                                borderBottomRightRadius: m.role === 'user' ? '2px' : '12px',
                                borderBottomLeftRadius: m.role === 'bot' ? '2px' : '12px',
                                fontSize: '0.95rem'
                            }}>
                                {m.text}
                            </div>
                        ))}
                        {isTyping && (
                            <div style={{ alignSelf: 'flex-start', background: 'var(--muted)', padding: '0.75rem', borderRadius: '12px', display: 'flex', gap: '4px' }}>
                                <Loader2 size={16} className="animate-spin" />
                            </div>
                        )}
                    </div>

                    {/* Options area */}
                    <div style={{ padding: '1.25rem', borderTop: '1px solid var(--border)' }}>
                        {step === 'product' && !isTyping && (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                <button className="btn btn-primary" onClick={() => handleSelection('Adobes de Concreto', 'Adobes')}>Adobes de Concreto</button>
                                <button className="btn btn-primary" onClick={() => handleSelection('Prefabricados', 'Prefab')}>Prefabricados</button>
                                <button className="btn btn-primary" onClick={() => handleSelection('Mobiliario en Concreto', 'Mobiliario')}>Mobiliario en Concreto</button>
                            </div>
                        )}
                        {step === 'scale' && !isTyping && (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                <button className="btn btn-primary" onClick={() => handleSelection('Proyecto Personal', 'Personal')}>Personal (Casa, Remodelación)</button>
                                <button className="btn btn-primary" onClick={() => handleSelection('Empresa / Construcción', 'Empresa')}>Empresarial / Obra Civil</button>
                            </div>
                        )}
                        {step === 'urgency' && !isTyping && (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                <button className="btn btn-primary" onClick={() => handleSelection('¡Inmediato! (Urgente)', 'Immediate')}>Inmediato</button>
                                <button className="btn btn-primary" onClick={() => handleSelection('En 1 o 2 semanas', 'Soon')}>1-2 semanas</button>
                                <button className="btn btn-primary" onClick={() => handleSelection('En un mes o más', 'Later')}>Más de un mes</button>
                            </div>
                        )}
                        {step === 'contact' && !isTyping && (
                            <form onSubmit={handleSubmitContact} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                <input name="name" placeholder="Nombre completo" required style={inputStyle} />
                                <input name="email" type="email" placeholder="Email" required style={inputStyle} />
                                <input name="phone" placeholder="Teléfono / WhatsApp" required style={inputStyle} />
                                <button type="submit" className="btn btn-accent">Enviar Datos</button>
                            </form>
                        )}
                        {step === 'thanks' && (
                            <div style={{ textAlign: 'center' }}>
                                <button className="btn btn-primary" onClick={() => { setMessages([]); setStep('greeting'); setIsOpen(false); }}>Cerrar Chat</button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

const inputStyle = {
    padding: '0.75rem',
    borderRadius: 'var(--radius)',
    border: '1px solid var(--border)',
    background: 'var(--muted)',
    fontFamily: 'inherit',
    width: '100%'
};

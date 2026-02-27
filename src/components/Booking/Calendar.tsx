'use client';

import React, { useState, useEffect } from 'react';
import {
    format,
    addDays,
    startOfToday,
    isSameDay,
} from 'date-fns';
import { es } from 'date-fns/locale';
import { Calendar as CalendarIcon, Clock, CheckCircle } from 'lucide-react';

export default function BookingCalendar() {
    const [selectedDate, setSelectedDate] = useState<Date>(startOfToday());
    const [selectedTime, setSelectedTime] = useState<string | null>(null);
    const [isBooked, setIsBooked] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: ''
    });

    const [bookedSlots, setBookedSlots] = useState<string[]>([]);

    const days = Array.from({ length: 7 }, (_, i) => addDays(startOfToday(), i));
    const timeSlots = ['08:00', '09:00', '10:00', '11:00', '14:00', '15:00', '16:00'];

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const response = await fetch('https://sheetdb.io/api/v1/5w6qrdltna61x');
                const data = await response.json();
                if (Array.isArray(data)) {
                    const slots = data
                        .filter(item =>
                            item["product (Detalle de los productos o de la cita técnica)"] &&
                            item["product (Detalle de los productos o de la cita técnica)"].includes("Asesoría Técnica")
                        )
                        .map(item => {
                            const detail = item["product (Detalle de los productos o de la cita técnica)"];
                            const match = detail.match(/\d{4}-\d{2}-\d{2} \d{2}:\d{2}/);
                            return match ? match[0] : null;
                        })
                        .filter((s): s is string => !!s);
                    setBookedSlots(slots);
                }
            } catch (err) {
                console.error("Error fetching bookings:", err);
            }
        };
        fetchBookings();
    }, []);

    const isSlotBooked = (date: Date, time: string) => {
        const slotString = `${format(date, "yyyy-MM-dd")} ${time}`;
        return bookedSlots.includes(slotString);
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);

        const appointmentInfo = `${format(selectedDate, "yyyy-MM-dd")} ${selectedTime}`;

        const leadData = {
            "id (Identificador único del registro)": 'ID-' + Date.now(),
            "name (Nombre del Cliente)": formData.name,
            "email (Correo Electrónico)": formData.email,
            "phone (Teléfono / WhatsApp)": formData.phone,
            "product (Detalle de los productos o de la cita técnica)": `Asesoría Técnica | Cita: ${appointmentInfo}`,
            "priority (Prioridad: Alta, Media o Baja)": 'High',
            "status (Estado: Nuevo, Agendado, Procesado)": 'Agendado',
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
            // Show success
            setIsBooked(true);
            setFormData({ name: '', email: '', phone: '' }); // Clear data
        } catch (sheetErr) {
            console.error('SheetDB Error:', sheetErr);
            alert('Hubo un error al agendar su cita. Por favor intente de nuevo.');
        }
        setLoading(false);
    };

    if (isBooked) {
        return (
            <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
                <div style={{ background: '#dcfce7', width: '80px', height: '80px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
                    <CheckCircle size={40} color="#22c55e" />
                </div>
                <h2>¡Cita Agendada!</h2>
                <p style={{ margin: '1rem 0', opacity: 0.8 }}>Hemos recibido tu solicitud. Nos contactaremos pronto para confirmar.</p>
                <div style={{ background: 'var(--muted)', padding: '1.5rem', borderRadius: 'var(--radius)', margin: '1.5rem 0' }}>
                    <p style={{ fontWeight: 800, fontSize: '1.1rem', margin: 0 }}>{format(selectedDate, "EEEE, d 'de' MMMM", { locale: es })}</p>
                    <p style={{ fontWeight: 500, color: 'var(--accent)', margin: '0.25rem 0 0' }}>a las {selectedTime}</p>
                </div>
                <button
                    onClick={() => { setIsBooked(false); setShowForm(false); }}
                    className="btn btn-primary"
                    style={{ marginTop: '1rem', width: '100%', fontWeight: 900 }}
                >
                    LO ANTES POSIBLE TE CONTACTAREMOS
                </button>
            </div>
        );
    }

    if (showForm) {
        return (
            <div className="card">
                <h3 style={{ marginBottom: '1.5rem' }}>Completa tu registro</h3>
                <p style={{ marginBottom: '1.5rem', fontSize: '0.9rem', color: 'var(--muted-foreground)' }}>
                    Cita para el {format(selectedDate, "d 'de' MMMM", { locale: es })} a las {selectedTime}
                </p>
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Nombre Completo</label>
                        <input
                            required
                            style={inputStyle}
                            placeholder="Tu nombre"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Correo Electrónico</label>
                        <input
                            type="email"
                            required
                            style={inputStyle}
                            placeholder="tu@email.com"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        />
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Teléfono / WhatsApp</label>
                        <input
                            required
                            style={inputStyle}
                            placeholder="Tu número de contacto"
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        />
                    </div>
                    <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                        <button type="button" onClick={() => setShowForm(false)} className="btn btn-secondary" style={{ flex: 1 }}>Volver</button>
                        <button type="submit" disabled={loading} className="btn btn-accent" style={{ flex: 2 }}>
                            {loading ? 'Confirmando...' : 'Confirmar Agenda'}
                        </button>
                    </div>
                </form>
            </div>
        );
    }

    return (
        <div className="card">
            <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <CalendarIcon size={20} color="var(--accent)" /> Reservar Consulta Técnica
            </h3>

            <div style={{ marginBottom: '2rem' }}>
                <p style={{ fontSize: '0.9rem', marginBottom: '1rem', color: 'var(--muted-foreground)' }}>Selecciona un día:</p>
                <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
                    {days.map((day) => (
                        <button
                            key={day.toISOString()}
                            onClick={() => setSelectedDate(day)}
                            style={{
                                flex: '0 0 auto',
                                padding: '1rem',
                                borderRadius: 'var(--radius)',
                                border: '1px solid var(--border)',
                                background: isSameDay(day, selectedDate) ? 'var(--primary)' : 'white',
                                color: isSameDay(day, selectedDate) ? 'white' : 'var(--foreground)',
                                textAlign: 'center',
                                minWidth: '90px',
                                transition: 'all 0.2s ease'
                            }}
                        >
                            <div style={{ fontSize: '0.7rem', opacity: 0.8, textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.05em' }}>{format(day, 'EEE', { locale: es })}</div>
                            <div style={{ fontWeight: 900, fontSize: '1.4rem' }}>{format(day, 'd')}</div>
                        </button>
                    ))}
                </div>
            </div>

            <div style={{ marginBottom: '2rem' }}>
                <p style={{ fontSize: '0.9rem', marginBottom: '1rem', color: 'var(--muted-foreground)' }}>Selecciona una hora:</p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(80px, 1fr))', gap: '0.5rem' }}>
                    {timeSlots.map((time) => {
                        const isTaken = isSlotBooked(selectedDate, time);
                        return (
                            <button
                                key={time}
                                onClick={() => !isTaken && setSelectedTime(time)}
                                disabled={isTaken}
                                style={{
                                    padding: '0.75rem',
                                    borderRadius: 'var(--radius)',
                                    border: '1px solid var(--border)',
                                    background: isTaken ? '#fee2e2' : selectedTime === time ? 'var(--accent)' : 'white',
                                    color: isTaken ? '#ef4444' : selectedTime === time ? 'var(--accent-foreground)' : 'var(--foreground)',
                                    fontSize: '0.9rem',
                                    fontWeight: 800,
                                    cursor: isTaken ? 'not-allowed' : 'pointer',
                                    transition: 'all 0.2s ease',
                                    opacity: isTaken ? 0.8 : 1,
                                    textDecoration: isTaken ? 'line-through' : 'none'
                                }}
                            >
                                {time}
                                {isTaken && <div style={{ fontSize: '0.6rem', fontWeight: 600 }}>OCUPADO</div>}
                            </button>
                        );
                    })}
                </div>
            </div>

            <button
                className="btn btn-primary"
                style={{ width: '100%', opacity: (!selectedDate || !selectedTime) ? 0.5 : 1 }}
                disabled={!selectedDate || !selectedTime}
                onClick={() => setShowForm(true)}
            >
                Continuar con la reserva
            </button>
        </div>
    );
}

const inputStyle = {
    padding: '0.85rem 1rem',
    borderRadius: 'var(--radius)',
    border: '1px solid var(--border)',
    background: '#f8fafc',
    fontFamily: 'inherit',
    width: '100%',
    fontSize: '0.95rem'
};

import React, { useState } from 'react'
import { updateStatusBooking } from '../../services/bookingsServices';
import "bootstrap/dist/css/bootstrap.min.css";

export default function BookingDetailsModal({ isOpen, onClose, booking }) {
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Calcula el total de noches
    const calculateNights = (checkInDate, checkOutDate) => {
        const startDate = new Date(checkInDate);
        const endDate = new Date(checkOutDate);
        return Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
    };

    // Función para cancelar la reservación
    const handleCancelReservation = async () => {
        isModalOpen(true);
        try {
            await updateStatusBooking(booking.id, "CANCELLED");
            alert('Reservación cancelada con éxito');
            onClose(); // Cierra el modal al cancelar
        } catch (error) {
            alert('Error al cancelar la reservación');
        } finally {
            setIsModalOpen(false);
        }
    };

    return (
        <div>
            {/* Button trigger modal */}
            <button type="button" className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#staticBackdrop"><i className="bi bi-pencil-square pe-2"></i>
                Detalles Reservación
            </button>

            <div className="modal fade" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
                <div className="modal-dialog modal-dialog-scrollable">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h1 className="modal-title fs-5" id="staticBackdropLabel">Detalles de la Reservación</h1>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <div className="row d-flex justify-content-between">
                                <div className="col-4">
                                    <p className="bg-info bg-opacity-25 rounded-pill p-1"><i class="bi bi-check-circle pe-2"></i>Confirmada</p>
                                </div>
                                <div className="col-2">
                                    <p>ID: #</p>
                                </div>
                            </div>
                            <h4>Nombre Alojamiento</h4>
                            <p>
                                <i className="bi bi-geo-alt pe-2"></i>Direccion Alojamiento
                            </p>
                            <img src="https://res.cloudinary.com/dpo0d4fre/image/upload/v1722400856/samples/cup-on-a-table.jpg" className="img-fluid rounded" alt="Imagen del Alojamiento" />
                            <div className="row d-flex justify-content-between pt-3">
                                <div className="col">
                                    <p>Check-in</p>
                                    <p><i class="bi bi-calendar-week pe-2 "></i>Fecha</p>
                                </div>
                                <div className="col">
                                    <p>check-out</p>
                                    <p><i class="bi bi-calendar-week pe-2 "></i>Fecha</p>
                                </div>
                            </div>
                            <h4>Información del Huésped</h4>
                            <p><i class="bi bi-person-fill pe-2"></i>Nombre</p>
                            <div className="bg-info bg-opacity-10 rounded p-2">
                                <h4>Resumen de la Estancia</h4>
                                <p><i class="bi bi-moon-fill pe-2"></i>0 noches</p>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-danger" data-bs-dismiss="modal">Cancelar Reservación</button>
                            <button type="button" className="btn btn-secondary">Cerrar</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

import { useState, useEffect } from "react";
import NewBookingModal from "./NewBookingModal";

const Bookings = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    return (
        <div>
            <div className="row align-items-center justify-content-center">
                <div className="col-md-5 col-sm-12">
                    <h1 className="mb-3">Lista de Reservaciones</h1>
                </div>
                <div className="col-md-4 col-sm-12 mb-3 d-flex align-items-center">
                    <button
                        type="button"
                        className="btn btn-dark"
                        onClick={() => setIsModalOpen(true)}
                    >
                        <i className="bi bi-plus"></i> Agrega una reservación
                    </button>
                </div>
                {isModalOpen && (
                    <>
                        {/* Renderiza el backdrop */}
                        <div className="modal-backdrop fade show"></div>
                        <NewBookingModal
                            isOpen={isModalOpen}
                            onClose={() => setIsModalOpen(false)}
                        />
                    </>
                )}
            </div>
        </div>
    );
}

export default Bookings;
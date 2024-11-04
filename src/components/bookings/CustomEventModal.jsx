import React, { useState } from 'react';
import { updateStatusBooking } from '../../services/bookingsServices';
import { Modal, Button, Row, Col } from 'react-bootstrap';
import "bootstrap/dist/css/bootstrap.min.css";
import Swal from 'sweetalert2';

const CustomEventModal = ({ calendarEvent }) => {

  const [show, setShow] = useState(true)
  console.log("datos del CalendarEvent", calendarEvent);

  const handleClose = () => {
    setShow(!show)
  }

  //Convertir la fecha a formato largo
  const formatDateLong = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("es-ES", {
      weekday: 'long',     // Nombre del día (lunes, martes...)
      year: 'numeric',     // Año en 4 dígitos
      month: 'long',       // Nombre completo del mes (enero, febrero...)
      day: 'numeric',      // Día del mes
    });
  };

  // Calcula el total de noches
  const calculateNights = (checkInDate, checkOutDate) => {
    const startDate = new Date(checkInDate);
    const endDate = new Date(checkOutDate);
    return Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
  };

  // Función para cancelar la reservación
  const handleCancelBooking = () => {
    Swal.fire({
      title: "¿Estás seguro de cancelar la reservación?",
      text: "Si continúas, no podrás revertir los cambios.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      cancelButtonText: "Cerrar",
      confirmButtonText: "Sí, cancelar reservación"
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          // Llama al servicio para cancelar la reservación
          await updateStatusBooking(calendarEvent.id);

          // Muestra mensaje de éxito
          Swal.fire({
            icon: 'success',
            title: 'Reservación cancelada',
            text: 'La reservación ha sido cancelada con éxito.',
            timer: 1500,
            showConfirmButton: false,
          });

          // Cierra el modal después de cancelar
          handleClose();
        } catch (error) {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No se pudo cancelar la reservación. Inténtalo de nuevo.',
          });
        }
      } else {
        handleClose();
      }
    });
  };

  return (
    <Modal show={show} onHide={handleClose} backdrop="static"
      keyboard={false} scrollable={true}>
      <Modal.Header closeButton>
        <Modal.Title>Detalles de la Reservación</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Row>
          <Col xs={6}>
            <p className="bg-info bg-opacity-25 rounded-pill p-1"><i class="bi bi-check-circle pe-2"></i>{calendarEvent.calendarId}</p>
          </Col>
          <Col xs={6}>
            <p className="text-end">ID: {calendarEvent.id}</p>
          </Col>
        </Row>

        <Row>
          <Col xs={12}>
            <h4>{calendarEvent.location}</h4>
            <p><i className="bi bi-geo-alt pe-2"></i>{calendarEvent.addressAccomodation}</p>
            <img src={calendarEvent.imageUrlAccomodation} className="img-fluid rounded" alt="Imagen del Alojamiento" />
          </Col>
        </Row>
        <Row className="py-3">
          <Col xs={12} md={6}>
            <p>Check-in</p>
            <p><i class="bi bi-calendar-week pe-2 "></i>{formatDateLong(calendarEvent.start)}</p>
          </Col>
          <Col xs={12} md={6}>
            <p>check-out</p>
            <p><i class="bi bi-calendar-week pe-2 "></i>{formatDateLong(calendarEvent.end)}</p>
          </Col>
        </Row>
        <Row>
          <Col xs={12}>
            <h4>Información del Huésped</h4>
            <p><i class="bi bi-person-fill pe-2"></i>{calendarEvent.people}</p>
          </Col>
          <Col xs={12}>
            <div className="bg-info bg-opacity-10 rounded p-2">
              <h4>Resumen de la Estancia</h4>
              <p><i class="bi bi-moon-fill pe-2"></i>{calculateNights(calendarEvent.start, calendarEvent.end)} Noches</p>
            </div>
          </Col>
        </Row>

      </Modal.Body>
      <Modal.Footer>
        {/* Renderiza el botón de cancelar solo si el estado es "CONFIRM" */}
        {calendarEvent.calendarId === "CONFIRMED" && (
          <Button variant="danger" onClick={handleCancelBooking}><i class="bi bi-slash-circle pe-2"></i>
            Cancelar Reservación
          </Button>
        )}
        <Button variant="secondary" onClick={handleClose}>
          Cerrar
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default CustomEventModal;

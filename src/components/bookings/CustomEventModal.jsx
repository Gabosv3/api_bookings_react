import React, {useState} from 'react';
import { Modal, Button } from 'react-bootstrap';

const CustomEventModal = ({ calendarEvent, showM }) => {

    const [show, setShow] = useState(true)
    console.log(calendarEvent);

    const handleClose = () => {
        setShow(!show)
    }
    
  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Editando: <strong>{calendarEvent.title}</strong></Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>User: {calendarEvent.people}</p>
        <p>Accomodation: {calendarEvent.Location}</p>
        <p>Check In Date: {calendarEvent.start}</p>
        <p>Check Out Date: {calendarEvent.end}</p>
        <p>Amount: {}</p>
        <p></p>
        <p></p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
        <Button variant="primary" onClick={() => alert('Botón adicional clickeado!')}>
          Actualizar
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default CustomEventModal;

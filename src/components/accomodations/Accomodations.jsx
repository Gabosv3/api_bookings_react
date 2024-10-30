import { useEffect, useState } from "react";
import { getAccomodations } from "../../services/accomodationServices";
import Spinner from "react-bootstrap/Spinner";
import "bootstrap/dist/css/bootstrap.min.css"; // Asegúrate de tener Bootstrap instalado

const Accomodations = () => {
  const [accomodations, setAccomodations] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchData = async () => {
    try {
      const response = await getAccomodations();
      setAccomodations(response);
    } catch (error) {
      console.error("Error al obtener los alojamientos:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const session_token = sessionStorage.getItem("token_bookings");
    if (session_token) {
      setIsAuthenticated(true);
      fetchData();
    } else {
      setIsAuthenticated(false);
      setLoading(false);
    }
  }, []);

  return (
    <>
      <AccomodationsList
        accomodations={accomodations}
        isAuthenticated={isAuthenticated}
        loading={loading}
        onOpenModal={() => setIsModalOpen(true)}
      />
      {isModalOpen && (
        <>
          {/* Renderiza el backdrop */}
          <div className="modal-backdrop fade show"></div>
          <AccomodationsModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
          />
        </>
      )}
    </>
  );
};

const AccomodationsList = ({ accomodations, isAuthenticated, loading, onOpenModal }) => {
  if (!isAuthenticated) {
    return <h2>No estás autorizado, inicia sesión</h2>;
  }

  return (
    <div>
      {loading ? (
        <div className="d-flex justify-content-center align-items-center vh-100">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Cargando...</span>
          </Spinner>
        </div>
      ) : (
        <div className="row align-items-center justify-content-center">
          <div className="col-md-5 col-sm-12">
            <h1 className="mb-3">Lista de Alojamientos</h1>
          </div>
          <div className="col-md-4 col-sm-12 mb-3 d-flex align-items-center justify-content-end">
            <button
              type="button"
              className="btn btn-dark"
              onClick={onOpenModal}
            >
              <i className="bi bi-plus"></i> Nuevo alojamiento
            </button>
          </div>

          {accomodations.map((item) => (
            <div className="card mb-3 col-md-9 col-sm-12" key={item.id}>
              <div className="card-body">
                <div className="row">
                  <div className="col-md-8">
                    <h3 className="px-3">{item.name}</h3>
                    <p>
                      <i className="bi bi-geo-alt px-3"></i> Dirección: {item.address}
                    </p>
                    <p>
                      <i className="bi bi-info-circle px-3"></i> Descripción: {item.description}
                    </p>
                  </div>
                  <div className="col-md-4 d-flex align-items-center justify-content-end">
                    <button className="btn btn-primary mx-3">
                      <i className="bi bi-pencil-square"></i>
                    </button>
                    <button className="btn btn-danger">
                      <i className="bi bi-trash"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const AccomodationsModal = ({ isOpen, onClose }) => {
  const [nombre, setNombre] = useState("");
  const [direccion, setDireccion] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [imagen, setImagen] = useState(null);

  const handleImageChange = (e) => {
    setImagen(e.target.files[0]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Realiza la lógica para guardar los datos
    onClose();
  };

  useEffect(() => {
    if (isOpen) {
      // Enfoca el modal cuando se abra
      const modalElement = document.getElementById("staticBackdrop");
      if (modalElement) {
        modalElement.focus();
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="modal fade show" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true" style={{ display: "block" }}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h2 className="modal-title">Nuevo Alojamiento</h2>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              <div className="form-group mb-3">
                <label>Nombre *</label>
                <input
                  type="text"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  required
                  placeholder="Nombre del alojamiento"
                  className="form-control"
                />
              </div>
              <div className="form-group mb-3">
                <label>Dirección *</label>
                <input
                  type="text"
                  value={direccion}
                  onChange={(e) => setDireccion(e.target.value)}
                  required
                  placeholder="Dirección del alojamiento"
                  className="form-control"
                />
              </div>
              <div className="form-group mb-3">
                <label>Descripción</label>
                <textarea
                  value={descripcion}
                  onChange={(e) => setDescripcion(e.target.value)}
                  placeholder="Descripción"
                  className="form-control"
                ></textarea>
              </div>
              <div className="form-group mb-3">
                <label>Imagen</label>
                <div className="image-upload">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="form-control"
                  />
                  <p className="small mt-1">Subir una imagen o arrastra y suelta</p>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={onClose}>
                Cancelar
              </button>
              <button type="submit" className="btn btn-primary">
                Guardar Cambios
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Accomodations;

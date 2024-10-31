import React, { useEffect, useState } from 'react'

// materialUI
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import Spinner from "react-bootstrap/Spinner";
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
// getDataAPI
import { getAccomodations } from '../../services/accomodationServices'
import { getBookings } from '../../services/bookingsServices';
// calendar
import BookingsCalendar from './BookingsCalendar';
// components
import NewBookingModal from "./NewBookingModal";


export default function ViewBookings() {
  const [accomodations, setAccomodations] = useState([]);
  const [bookings, setBookings] = useState([])
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchData = async () => {
    try {
      const responseAccomodations = await getAccomodations();
      const responseBookings = await getBookings();
      setAccomodations(responseAccomodations);
      setBookings(responseBookings);
    } catch (error) {
      console.error("Error al obtener la información:", error);
    } finally {
      console.log("finalizo");
      
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
      <div className='w-100'>
        <div className='d-flex justify-content-center flex-column'>      
          <div>
            {
              loading ? (
                <div className="d-flex justify-content-center align-items-center vh-100">
                  <Spinner animation="border" role="status">
                    <span className="visually-hidden">Cargando...</span>
                  </Spinner>
                </div>
              ) : (    
                <>            
                  <div className='d-flex flex-column justify-content-center align-content-center pb-3'>
                    <div className='w-100 d-flex justify-content-end gap-3'>                  
                                        
                      <Button variant='text' color='grey' startIcon={<FilterAltIcon />}>Filtros</Button>
                      <Button variant="contained" 
                        className="bg-dark" 
                        onClick={() => setIsModalOpen(true)}
                        startIcon={<AddIcon />}>
                          Nueva Reservación
                      </Button>
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

                    <div className='d-flex justify-content-around align-content-center w-100'>
                      { /** mostrar select alojamientos */}
                      <Autocomplete
                          disablePortal
                          key={accomodations.map((accomodation) => (
                            accomodation.id
                          ))}
                          options={accomodations.map((accomodation) => (
                            accomodation.name
                          ))}
                          className='w-25'
                          renderInput={(params) => <TextField {...params} label="Alojamientos" variant="standard"/>
                        }
                      />

                      { /** mostrar select estados de bookings */}

                      <Autocomplete
                          disablePortal
                          options={["Confirmada", "Pendiente", "Cancelada"]}
                          className='w-25'
                          renderInput={(params) => <TextField {...params} label="Estado" variant="standard"/>
                        }
                      />
                      {/* mostrar buscador por nombre */}
                      <Autocomplete
                          freeSolo
                          id="search-by-name"
                          className='w-25'
                          key={bookings.map((booking) => (
                            booking.id
                          ))}
                          disableClearable
                          options={bookings.map((booking) => booking.user)}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              label="Nombre del huésped"
                              variant="standard"
                              
                              slotProps={{
                                input: {
                                  ...params.InputProps,
                                  type: 'search',
                                },
                              }}
                            />
                          )}
                      />
                    </div>
                  </div>
                  <BookingsCalendar />
                </>
              )
            }            
          </div>
        </div>     
      </div>
    </>
  )
}
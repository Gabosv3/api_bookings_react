import React, { useEffect, useState } from 'react'

// materialUI
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import Spinner from "react-bootstrap/Spinner";
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
// getDataAPI
import { getAccomodations } from '../../services/accomodationServices'
import getBookings from '../../services/bookingsServices';
// calendar
import BookingsCalendar from './BookingsCalendar';
import { grey } from '@mui/material/colors';


export default function Bookings() {
  const [accomodations, setAccomodations] = useState([]);
  const [bookings, setBookings] = useState([])
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const responseAccomodations = await getAccomodations();
      const responseBookings = await getBookings();
      setAccomodations(responseAccomodations);
      setBookings(responseBookings);
    } catch (error) {
      console.error("Error al obtener la información:", error);
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
                <div className='d-flex flex-column justify-content-center align-content-center pb-3'>
                  <div className='w-100 d-flex justify-content-end gap-3'>
                    <Button variant='text' color='grey' startIcon={<FilterAltIcon />}>Filtros</Button>
                    <Button variant="contained" className='bg-black' startIcon={<AddIcon />}>
                        Nueva Reservación
                    </Button>
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
              )
            }            
          </div>
          <BookingsCalendar />
        </div>     
      </div>
    </>
  )
}
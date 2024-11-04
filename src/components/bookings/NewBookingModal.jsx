import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import Swal from 'sweetalert2';
import Spinner from "react-bootstrap/Spinner";

import { useCreateBooking} from "../../services/bookingService";
import { useGetAccomodations } from "../../services/accomodationServices";
import { useGetUsers } from "../../services/userService";

const NewBookingModal = ({ isOpen, onClose }) => {
    const {data: accommodations, isLoading: isLoadingAccommodation, error:errorAccommodation} = useGetAccomodations();

    const {data: users, isLoading: isLoadingUsers, error:errorUsers} = useGetUsers();

    const { isPending: isPendingCreate, mutate: createBooking } = useCreateBooking();
    // useForm for handling form validation
    const {
        register,
        handleSubmit,
        formState: { errors },
        watch,
        reset,
    } = useForm({
        defaultValues: {
            booking: "",
            check_in_date: "",
            check_out_date: "",
            total_amount: 0,
            accomodation_id: 0,
            user_id: 0
        }
    });

    //for date validation
    const checkInDate = watch("check_in_date");

    const onSubmit = (data) => {
        createBooking(data, {
            onSuccess: () => {
                Swal.fire({
                    icon: 'success',
                    title: 'Reserva creada',
                    showConfirmButton: false,
                    timer: 4000
                });
                onClose(); 
            },
            onError: (error) => {
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: error?.message,
                    footer: 'Please try again later',
                    timer: 4000
                });
            }
        });
    };

    // Reset form on modal close
    useEffect(() => {
        if (!isOpen) {
            reset();
        }
    }, [isOpen, reset]);
  
    useEffect(() => {
      if (isOpen) {
            // focus on the first input when modal is opened
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
                        <h2 className="modal-title">Nueva Reserva</h2>
                        <button type="button" className="btn-close" onClick={onClose}></button>
                    </div>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="modal-body">
                            <div className="form-group mb-3">
                                <label>Codigo Reserva *</label>
                                <input
                                    id="booking"
                                    type="text"
                                    placeholder="BK0045"
                                    className="form-control" 
                                    {...register("booking", { required: "Booking code is required" })}
                                />
                                {errors.booking && <p className="text-danger mt-2">{errors.booking.message}</p>}
                            </div>
                            <div className="form-group mb-3">
                                <label>Check In *</label>
                                <input
                                    id="check_in_date"
                                    type="date"
                                    className="form-control"
                                    {...register("check_in_date", { required: "Check-in date is required" })}
                                />
                                {errors.check_in_date && <p className="text-danger mt-2">{errors.check_in_date.message}</p>}
                            </div>
                            <div className="form-group mb-3">
                                <label>Check Out *</label>
                                <input
                                    id="check_out_date"
                                    type="date"
                                    className="form-control"
                                    {...register("check_out_date", { 
                                        required: "Check-out date is required", 
                                        validate: value =>  new Date(value) >= new Date(checkInDate) || 
                                        "Check-out date must be after or equal check-in date" })}
                                />
                                {errors.check_out_date && <p className="text-danger mt-2">{errors.check_out_date.message}</p>}
                            </div>
                            <div className="form-group mb-3">
                                <label>Total *</label>
                                <input
                                    id="total_amount"
                                    type="number"
                                    step="0.01"
                                    className="form-control"
                                    {...register("total_amount", { required: "Total amount is required", min: { value: 0.01, message: "Total amount must be greater than 0" } })}
                                />
                                {errors.total_amount && <p className="text-danger mt-2">{errors.total_amount.message}</p>}
                            </div>
                            <div className="form-group mb-3">
                                <label>Usuario *</label>
                                {isLoadingUsers && (
                                    <div className="d-flex justify-content-center align-items-center mt-2 mb-2">
                                        <Spinner animation="border" role="status">
                                            <span className="visually-hidden">Cargando...</span>
                                        </Spinner>
                                    </div>
                                )}
                                {errorUsers && (
                                    <div className="d-flex justify-content-center align-items-center mt-2 mb-2">
                                        <p className="text-danger">{errorUsers?.message}</p>
                                    </div>
                                )}
                                {users && (
                                    <select className="form-select"
                                        id="user_id"
                                        {...register("user_id", { required: "User selection is required" })}
                                    >
                                        {users?.map((user) => (
                                            <option key={user.id} value={user.id}>
                                                {user.name}
                                            </option>
                                        ))}
                                    </select>
                                )}
                                {errors.user_id && <p className="text-danger mt-2">{errors.user_id.message}</p>}
                            </div>
                            <div className="form-group mb-3">
                                <label>Alojamiento *</label>
                                {isLoadingAccommodation && (
                                    <div className="d-flex justify-content-center align-items-center mt-2 mb-2">
                                        <Spinner animation="border" role="status">
                                            <span className="visually-hidden">Cargando...</span>
                                        </Spinner>
                                    </div>
                                )}
                                {errorAccommodation && (
                                    <div className="d-flex justify-content-center align-items-center mt-2 mb-2">
                                        <p className="text-danger">{errorAccommodation?.message}</p>
                                    </div>
                                )}
                                {accommodations && (
                                    <select className="form-select" 
                                        id="accomodation_id"
                                        {...register("accomodation_id", { required: "Accommodation selection is required" })}
                                    >
                                        {accommodations?.map((acc) => (
                                            <option key={acc.id} value={acc.id}>
                                                {acc.name}
                                            </option>
                                        ))}
                                    </select>
                                )}
                            
                                {errors.accomodation_id && <p className="text-danger mt-2">{errors.accomodation_id.message}</p>}
                            </div>
                        </div>
                        <div className="modal-footer">
                            {isPendingCreate ? (
                                <div className="d-flex justify-content-center align-items-center">
                                    <Spinner animation="border" role="status">
                                        <span className="visually-hidden">Cargando...</span>
                                    </Spinner>
                                </div>
                            ):(
                               <>
                                    <button type="button" className="btn btn-secondary" onClick={onClose}>
                                        Cancelar
                                    </button>
                                    <button type="submit" className="btn btn-primary">
                                        Guardar Cambios
                                    </button>
                               </>
                            )}
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default NewBookingModal;
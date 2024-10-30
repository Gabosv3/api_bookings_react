import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useCreateBooking} from "../../services/bookingService";
import { useGetAccomodations } from "../../services/accomodationServices";
import { useGetUsers } from "../../services/userService";

const NewBookingModal = ({ isOpen, onClose }) => {
    //TODO add more validations, handle error response on create, and fix style
    const {data: accommodations, isLoading: isLoadingAccommodation, error:errorAccommodation} = useGetAccomodations();

    const {data: users, isLoading: isLoadingUsers, error:errorUsers} = useGetUsers();
    
    const { mutate: createBooking } = useCreateBooking();
    // useForm for handling form validation
    const {
        register,
        handleSubmit,
        formState: { errors },
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

    const onSubmit = (data) => {
        createBooking(data, {
            onSuccess: () => {
                console.log("Form submitted:", data);
                onClose(); 
            },
            onError: (error) => {
                console.error("Booking creation failed:", error);
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
                                    {...register("check_out_date", { required: "Check-out date is required" })}
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
                                    {...register("total_amount", { required: "Total amount is required" })}
                                />
                                {errors.total_amount && <p className="text-danger mt-2">{errors.total_amount.message}</p>}
                            </div>
                            <div className="form-group mb-3">
                                <label>Usuario *</label>
                                <select className="form-select"
                                    id="user_id"
                                    {...register("user_id", { required: "User selection is required" })}
                                >
                                    {isLoadingUsers ? (
                                        <option>Loading users...</option>
                                    ) : errorUsers ? (
                                        <option>Error loading users</option>
                                    ) : (
                                        users?.map((user) => (
                                            <option key={user.id} value={user.id}>
                                                {user.name}
                                            </option>
                                        ))
                                    )}
                                </select>
                                {errors.user_id && <p className="text-danger mt-2">{errors.user_id.message}</p>}
                            </div>
                            <div className="form-group mb-3">
                                <label>Alojamiento *</label>
                                <select className="form-select" 
                                    id="accomodation_id"
                                    {...register("accomodation_id", { required: "Accommodation selection is required" })}
                                >
                                    {isLoadingAccommodation ? (
                                        <option>Loading accommodations...</option>
                                    ) : errorAccommodation ? (
                                        <option>Error loading accommodations</option>
                                    ) : (
                                        accommodations?.map((acc) => (
                                            <option key={acc.id} value={acc.id}>
                                                {acc.name}
                                            </option>
                                        ))
                                    )}
                                </select>
                                {errors.accomodation_id && <p className="text-danger mt-2">{errors.accomodation_id.message}</p>}
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
}

export default NewBookingModal;
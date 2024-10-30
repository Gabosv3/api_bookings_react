import { defaultAxios, defaultAxiosWithToken } from "../utils/http";
import { useMutation, useQuery } from "@tanstack/react-query";

const storeBooking = (booking) => defaultAxiosWithToken.post('/booking', booking);

export const useCreateBooking = (booking) => {
    return useMutation({
        mutationFn: (booking) => storeBooking(booking),
    });
}
import { defaultAxios, defaultAxiosWithToken } from "../utils/http";
import { useMutation, useQuery } from "@tanstack/react-query";

const findAllUsers = async () => (await defaultAxiosWithToken.get('/users')).data;

export const useGetUsers = () => {
    const { data, isLoading, isError, isSuccess, error } = useQuery({
        queryKey: ['users'],
        queryFn: () => findAllUsers(),
        refetchOnWindowFocus:false
    });
    return { data, isLoading, isError, isSuccess, error };
}
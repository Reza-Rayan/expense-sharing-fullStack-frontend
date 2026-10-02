import {useQuery} from '@tanstack/react-query';
import {getUsers} from '../api/users.api';
import {usersKeys} from '../query-keys';

export function useUsers() {
    return useQuery({
        queryKey: usersKeys.list(),
        queryFn: ({signal}) => getUsers(signal),
        staleTime: Infinity,
    });
}
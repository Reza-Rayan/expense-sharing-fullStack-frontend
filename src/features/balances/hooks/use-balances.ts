import {useQuery} from '@tanstack/react-query';
import {getBalances} from '../api/balances.api';
import {balancesKeys} from '../query-keys';

export function useBalances() {
    return useQuery({
        queryKey: balancesKeys.list(),
        queryFn: ({signal}) => getBalances(signal),
    });
}
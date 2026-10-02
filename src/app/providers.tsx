import {QueryClientProvider} from '@tanstack/react-query';
import {ReactQueryDevtools} from '@tanstack/react-query-devtools';
import type {PropsWithChildren} from 'react';
import {Toaster} from 'react-hot-toast';
import {queryClient} from './query-client';

export function Providers({children}: PropsWithChildren) {
    return (
        <QueryClientProvider client={queryClient}>
            {children}

            <Toaster
                position="top-center"
                toastOptions={{
                    duration: 3500,
                    style: {
                        background: 'rgb(30 20 70 / 0.92)',
                        color: '#fff',
                        border: '1px solid rgb(255 255 255 / 0.15)',
                        borderRadius: '9999px',
                        padding: '10px 18px',
                        fontSize: '0.95rem',
                    },
                    success: {iconTheme: {primary: '#34d399', secondary: '#0b0720'}},
                }}
            />

            <ReactQueryDevtools initialIsOpen={false}/>
        </QueryClientProvider>
    );
}
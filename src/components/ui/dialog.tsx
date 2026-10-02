import * as DialogPrimitive from '@radix-ui/react-dialog';
import {X} from 'lucide-react';
import type {ReactNode} from 'react';

export const Dialog = DialogPrimitive.Root;

interface DialogContentProps {
    title: string;
    description: string;
    children: ReactNode;
}

export function DialogContent({title, description, children}: DialogContentProps) {
    return (
        <DialogPrimitive.Portal>
            <DialogPrimitive.Overlay className="dialog-overlay fixed inset-0 z-40 bg-[#05020f]/70 backdrop-blur-sm"/>

            <DialogPrimitive.Content
                className="dialog-content glass fixed inset-0 z-50 m-auto h-fit max-h-[calc(100dvh-2rem)] w-[calc(100%-2rem)] max-w-md overflow-y-auto rounded-3xl p-6">
                <DialogPrimitive.Title className="text-gradient pe-10 text-2xl font-black leading-relaxed">
                    {title}
                </DialogPrimitive.Title>
                <DialogPrimitive.Description className="mb-6 mt-1 text-sm text-slate-400">
                    {description}
                </DialogPrimitive.Description>

                {children}

                <DialogPrimitive.Close
                    aria-label="بستن"
                    className="absolute inset-e-4 top-4 grid size-9 place-items-center rounded-full text-slate-300
                     transition hover:bg-white/10 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2
                      focus-visible:outline-fuchsia-300"
                >
                    <X className="size-5" aria-hidden="true"/>
                </DialogPrimitive.Close>
            </DialogPrimitive.Content>
        </DialogPrimitive.Portal>
    );
}
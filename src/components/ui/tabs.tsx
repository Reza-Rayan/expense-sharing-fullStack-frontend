import * as TabsPrimitive from '@radix-ui/react-tabs';
import type {ComponentProps} from 'react';

export function Tabs(props: ComponentProps<typeof TabsPrimitive.Root>) {
    return <TabsPrimitive.Root dir="rtl" {...props} />;
}

export function TabsList({
                             className = '',
                             ...props
                         }: ComponentProps<typeof TabsPrimitive.List>) {
    return (
        <TabsPrimitive.List
            className={`glass-soft mx-auto flex w-full max-w-md gap-1 rounded-full p-1 ${className}`}
            {...props}
        />
    );
}

export function TabsTrigger({
                                className = '',
                                ...props
                            }: ComponentProps<typeof TabsPrimitive.Trigger>) {
    return (
        <TabsPrimitive.Trigger
            className={`tab-trigger inline-flex flex-1 items-center justify-center gap-2 rounded-full px-4 py-2.5 text-sm 
            font-bold text-slate-300 transition-colors hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 
            focus-visible:outline-fuchsia-300 sm:text-base 
            ${className}`} {...props}
        />
    );
}

export function TabsContent({
                                className = '',
                                ...props
                            }: ComponentProps<typeof TabsPrimitive.Content>) {
    return (
        <TabsPrimitive.Content
            className={`fade-up mt-6 rounded-3xl focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fuchsia-300
             ${className}`}
            {...props}
        />
    );
}
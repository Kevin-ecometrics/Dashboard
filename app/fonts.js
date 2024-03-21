import { Roboto, Titillium_Web, Montserrat, League_Spartan, Inter } from "next/font/google";

export const inter = Inter({
    weight: ['200','400', '600', '700'],
    style: ['normal'],
    subsets: ['latin'],
    display: 'swap',
});
 
export const titillium = Titillium_Web({ 
    weight: ['200','400', '600', '700'],
    style: ['normal', 'italic'],
    subsets: ['latin'],
    display: 'swap',
});

export const roboto = Roboto({
    weight: ['300','400', '700'],
    style: ['normal', 'italic'],
    subsets: ['latin'],
    display: 'swap',
});

export const montse = Montserrat({
    weight: ['300','400', '700'],
    style: ['normal', 'italic'],
    subsets: ['latin'],
    display: 'swap',
});

export const league = League_Spartan({
    weight: ['400', '500'],
    style: ['normal'],
    subsets: ['latin'],
    display: 'swap',
});


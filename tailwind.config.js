/** @type {import('tailwindcss').Config} */
export default {
    content: [
        './src/**/*.{html,js,jsx,tsx,ts}',
        './src/components/**/*.{html,js,jsx,tsx,ts}',
        '!./node_modules/**/*.{html,js}',
    ],
    theme: {
        extend: {
            fontFamily: {
                satoshi: ['Satoshi'],
            },
            colors: {
                textcol: '#ffffff',
                bgcol: '#000000',
                bghover: '#2a2a2a',
                card: '#3c3c3c',
                cardhover: '#4e4e4e',
                accent: '#E66799',
            },
        },
    },
    plugins: [],
}

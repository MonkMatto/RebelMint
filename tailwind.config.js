/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        './src/**/*.{html,js,jsx,tsx,ts}',
        './src/components/**/*.{html,js,jsx,tsx,ts}',
        '!./node_modules/**/*.{html,js}',
    ],
    theme: {
        extend: {
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

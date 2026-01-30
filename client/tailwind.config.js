/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: {
                    50: '#1e3a5f',
                    100: '#1a3354',
                    200: '#162b49',
                    300: '#12233e',
                    400: '#0e1b33',
                    500: '#0a1428',
                    600: '#08111f',
                    700: '#060d19',
                    800: '#040a13',
                    900: '#02050a',
                },
                darkBlue: {
                    50: '#1a2f4d',
                    100: '#152842',
                    200: '#112037',
                    300: '#0d192c',
                    400: '#091221',
                    500: '#060c16',
                    600: '#050a12',
                    700: '#04080e',
                    800: '#03060a',
                    900: '#010305',
                },
            },
            animation: {
                'fade-in': 'fadeIn 0.3s ease-in-out',
                'slide-in': 'slideIn 0.3s ease-out',
            },
            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                slideIn: {
                    '0%': { transform: 'translateY(-10px)', opacity: '0' },
                    '100%': { transform: 'translateY(0)', opacity: '1' },
                },
            },
        },
    },
    plugins: [],
}

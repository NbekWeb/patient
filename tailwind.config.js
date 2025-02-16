module.exports = {
    purge: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
    darkMode: false,
    theme: {
        extend: {
            screens: {

            },
            colors: {
                "blue": {
                    100: '#F1FBFF',
                    700: '#07577A'
                },
                'red': {
                    500: '#EB6578',
                }
            },
            fontSize: {
                '3xl': '28px'
            },
            lineHeight: {
                '3xl': '32px'
            },
            spacing: {
                '13': '52px',
                '15': '60px',
                '17': '68px',
                '30': '120px',
                '80': '320px',
                '28':'112px'
            },
            width: {},
        },
    },
    variants: {
        extend: {},
    },
    plugins: [],
};
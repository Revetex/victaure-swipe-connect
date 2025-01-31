import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: '0.5rem',
        sm: '1rem',
        lg: '2rem',
      },
      screens: {
        '2xl': '1400px'
      }
    },
    extend: {
      spacing: {
        '0.5': '0.125rem',
        '1.5': '0.375rem',
        '2.5': '0.625rem',
      },
      fontFamily: {
        sans: ['Montserrat', 'sans-serif'],
        title: ['Poppins', 'sans-serif'],
      },
      colors: {
        border: {
          DEFAULT: 'hsl(var(--border))',
          light: 'hsl(24 5.7% 82.9%)',
        },
        input: {
          DEFAULT: 'hsl(var(--input))',
          light: 'hsl(24 5.7% 82.9%)',
        },
        ring: {
          DEFAULT: 'hsl(var(--ring))',
          light: 'hsl(20 14.3% 4.1%)',
        },
        background: {
          DEFAULT: 'hsl(var(--background))',
          light: 'hsl(0 0% 100%)',
        },
        foreground: {
          DEFAULT: 'hsl(var(--foreground))',
          light: 'hsl(20 14.3% 4.1%)',
        },
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
          light: {
            DEFAULT: 'hsl(20.5 90.2% 48.2%)',
            foreground: 'hsl(60 9.1% 97.8%)',
          },
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
          light: {
            DEFAULT: 'hsl(60 4.8% 95.9%)',
            foreground: 'hsl(24 9.8% 10%)',
          },
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
          light: {
            DEFAULT: 'hsl(0 84.2% 60.2%)',
            foreground: 'hsl(60 9.1% 97.8%)',
          },
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
          light: {
            DEFAULT: 'hsl(60 4.8% 95.9%)',
            foreground: 'hsl(25 5.3% 44.7%)',
          },
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
          light: {
            DEFAULT: 'hsl(60 4.8% 95.9%)',
            foreground: 'hsl(24 9.8% 10%)',
          },
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
          light: {
            DEFAULT: 'hsl(0 0% 100%)',
            foreground: 'hsl(20 14.3% 4.1%)',
          },
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
          light: {
            DEFAULT: 'hsl(0 0% 100%)',
            foreground: 'hsl(20 14.3% 4.1%)',
          },
        }
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' }
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' }
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' }
        },
        'fade-out': {
          '0%': { opacity: '1' },
          '100%': { opacity: '0' }
        }
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'fade-in': 'fade-in 0.2s ease-out',
        'fade-out': 'fade-out 0.2s ease-out'
      }
    }
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;

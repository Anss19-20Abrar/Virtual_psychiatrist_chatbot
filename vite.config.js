import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from 'tailwindcss';
import autoprefixer from 'autoprefixer';
import dotenv from 'dotenv'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    autoprefixer(),
  ],
  define:{
    'process.env.VITE_FIREBASE_API': JSON.stringify(process.env.VITE_FIREBASE_API),
    'process.env.VITE_AUTH_DOMAIN': JSON.stringify(process.env.VITE_AUTH_DOMAIN),
    'process.env.VITE_DATABASE_URL': JSON.stringify(process.env.VITE_DATABASE_URL),
    'process.env.VITE_PROJECT_ID': JSON.stringify(process.env.VITE_PROJECT_ID),
    'process.env.VITE_STOREAGE_BUCKET': JSON.stringify(process.env.VITE_STOREAGE_BUCKET),
    'process.env.VITE_MESSAGE_SENDER_ID': JSON.stringify(process.env.VITE_MESSAGE_SENDER_ID),
    'process.env.VITE_APP_ID': JSON.stringify(process.env.VITE_APP_ID),
    'process.env.VITE_AWS_KEY': JSON.stringify(process.env.VITE_AWS_KEY),
    'process.env.VITE_MODEL_NAME': JSON.stringify(process.env.VITE_MODEL_NAME),
    'process.env.VITE_API_LINK': JSON.stringify(process.env.VITE_API_LINK),
  }
});

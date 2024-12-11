/* eslint-disable no-undef */
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3005,
    open: true
  },
  define: {
    // Expose environment variables to your application
    'process.env': process.env
  
  },
  build: {
    chunkSizeWarningLimit: 1000,
    hash:true
  },
  preview: {
    // this ensures that the browser opens upon preview start
    open: true,
    // this sets a default port to 3000
    port: 3005
  }
  // server: {
  //   proxy: {
  //     '/': 'http://52.22.241.165:10015/' // Adjust the URL to match your backend server
  //   }
  // }
});

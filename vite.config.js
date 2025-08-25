import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
})
// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'
 
// export default defineConfig({
//   plugins: [react()],
//   server: {
// 	host: "0.0.0.0",  
//     port: 3001,
// 	proxy: {
//       // Proxy for settings APIs
//       '/settings': {
//         target: 'http://delbi2dev.deloptanalytics.com:3000',
//         changeOrigin: true,
//         secure: false,
//       }
//   }
// }})
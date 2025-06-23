import { defineConfig } from 'vite';

export default defineConfig({
  // Use the root directory as the source
  root: '.',
  
  // Configure the build output
  build: {
    // Output to the dist directory
    outDir: 'dist',
    
    // Don't minify for easier debugging
    minify: false,
    
    // Configure how Vite processes your JavaScript files
    rollupOptions: {
      input: {
        main: './index.html',
      },
    },
  },
});

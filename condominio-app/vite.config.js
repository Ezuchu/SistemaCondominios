import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import sass from 'sass'            // Asegúrate de haber instalado "sass"
import path from 'path'

export default defineConfig({
  plugins: [
    vue()
  ],

  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src')
    }
  },

  css: {
    preprocessorOptions: {
      scss: {
        implementation: sass,          // Fuerza Dart Sass (con initAsyncCompiler)
        quietDeps: true,               // Silencia advertencias de dependencias externas
        silenceDeprecations: [         // Silencia sólo las categorías que quieras
          'import',
          'mixed-decls',
          'color-functions',
          'global-builtin'
        ]
      }
    }
  }
})

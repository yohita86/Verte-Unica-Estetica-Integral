#!/bin/bash
# Script para redeploy en Render
# Ejecuta este script si necesitas forzar un redeploy

echo "Forzando redeploy en Render..."
echo "Asegúrate de estar logueado en GitHub"
echo ""
echo "Pasos:"
echo "1. Ve a https://dashboard.render.com"
echo "2. Selecciona 'verte-unica-backend'"
echo "3. Haz clic en 'Manual Deploy' > 'Deploy latest commit'"
echo "4. Espera a que termine (5-10 minutos)"
echo "5. Repite para 'verte-unica-frontend'"
echo ""
echo "Si siguen habiendo errores, ejecuta:"
echo "git push origin main --force"

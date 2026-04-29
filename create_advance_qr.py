#1. Importamos la libreria
import qrcode 
from PIL import Image

WEB_URL = 'https://idiucv.vercel.app'
LOGO_IMAGE = 'logo_idi.png'
FINAL_QR_NAME = 'QR_IDIUCV.png'

#2. Creamos el qr y configuramos su version, correccion y tamaño
qr = qrcode.QRCode(
    version=1,
    error_correction=qrcode.constants.ERROR_CORRECT_H,
    box_size=10,
    border=4,
)

#3. Le damos la data a convertir a QR (URL)
qr.add_data(WEB_URL)
qr.make(fit=True)

#4. Le damos el color de relleno y fondo y guardamos la imagen
img_qr = qr.make_image(fill_color="black", back_color="white").convert('RGB')

try:
    logo = Image.open(LOGO_IMAGE)
    ancho_qr, alto_qr = img_qr.size
    factor_escala = 4

    nuevo_ancho_logo = ancho_qr // factor_escala
    nuevo_alto_logo = alto_qr // factor_escala

    logo = logo.resize((nuevo_ancho_logo, nuevo_alto_logo), Image.Resampling.LANCZOS)

    posicion_x = (ancho_qr - nuevo_ancho_logo) // 2
    posicion_y = (alto_qr - nuevo_alto_logo) // 2

    img_qr.paste(logo, (posicion_x, posicion_y), logo if logo.mode == 'RGBA' else None)

    print('Logotipo Insertado con exito!')

except FileNotFoundError:
    print(f"Error: No se encontro el archivo '{LOGO_IMAGE}'. Generando QR sin logo")
except Exception as e:
    print(f"Ocurrio un error inesperado al insertar el logo: {e}")

img_qr.save(FINAL_QR_NAME)

#5. Imprimimos un mensaje de exito por consola
print(f"!Codigo QR profesional estatico generado en: '{FINAL_QR_NAME}'!")
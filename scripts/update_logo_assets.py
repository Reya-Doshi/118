import os
import base64
import cv2

src = r"C:\Users\reyad\.gemini\antigravity\brain\4b9c6758-5343-458b-a3ee-907e174fc3f5\.user_uploaded\media_1789452430900.jpg"
if not os.path.exists(src):
    raise FileNotFoundError(f"Source not found: {src}")

img = cv2.imread(src)

icon_512 = cv2.resize(img, (512, 512), interpolation=cv2.INTER_AREA)
icon_128 = cv2.resize(img, (128, 128), interpolation=cv2.INTER_AREA)
icon_64 = cv2.resize(img, (64, 64), interpolation=cv2.INTER_AREA)

for d in ['public', 'mobile/public']:
    os.makedirs(d, exist_ok=True)
    cv2.imwrite(os.path.join(d, 'sarvas_icon.png'), icon_512)
    cv2.imwrite(os.path.join(d, 'sarvas_logo.png'), icon_512)
    cv2.imwrite(os.path.join(d, 'sarvas_logo_v2.png'), icon_512)
    cv2.imwrite(os.path.join(d, 'sarvas_splash.jpg'), icon_512)
    cv2.imwrite(os.path.join(d, 'favicon.png'), icon_64)

# Update Android Launcher drawables too
android_drawable = os.path.join('mobile', 'android', 'app', 'src', 'main', 'res', 'drawable')
if os.path.exists(android_drawable):
    cv2.imwrite(os.path.join(android_drawable, 'ic_launcher.png'), icon_512)
    cv2.imwrite(os.path.join(android_drawable, 'ic_launcher_round.png'), icon_512)

# Generate an SVG favicon with embedded base64
_, buf = cv2.imencode('.png', icon_128)
b64_str = base64.b64encode(buf).decode('utf-8')

svg_content = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128" width="128" height="128">
  <clipPath id="rounded">
    <rect width="128" height="128" rx="28" ry="28"/>
  </clipPath>
  <image href="data:image/png;base64,{b64_str}" width="128" height="128" clip-path="url(#rounded)"/>
</svg>'''

with open(os.path.join('public', 'favicon.svg'), 'w', encoding='utf-8') as f:
    f.write(svg_content)

with open(os.path.join('mobile', 'public', 'favicon.svg'), 'w', encoding='utf-8') as f:
    f.write(svg_content)

print("SUCCESS: All logo assets, favicons, and Android launcher icons updated.")

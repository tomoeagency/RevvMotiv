import os
import urllib.request
import urllib.parse
from PIL import Image

output_dir = r"d:\work\personal\revvmotiv\frontend\public\images"
os.makedirs(output_dir, exist_ok=True)

# Generate a clean, high-res Indian compact SUV (Maruti Brezza / Grand Vitara style) in a pristine white studio
seed = 99245

# 1. Stock Factory Before
prompt_stock = (
    "A crisp commercial studio photograph of a stock factory 2024 Maruti Brezza compact SUV in pearl white color, "
    "parked inside a high-end clean white automotive photo studio. Bright overhead white LED square softbox ceiling lights, "
    "clean reflective light grey floor, pure white studio walls. 3/4 front three-quarter angle view showing side and front bumper. "
    "Completely factory stock OEM silver alloy wheels, standard factory ground clearance, standard OEM chrome front grille, "
    "clean showroom factory condition, sharp 8k focus, ultra detailed automotive commercial photoshoot"
)

# 2. RevvMotiv Tuned After (Exact same angle & studio, but tuned)
prompt_tuned = (
    "A crisp commercial studio photograph of a custom tuned 2024 Maruti Brezza compact SUV in pearl white color with gloss black roof, "
    "parked inside the exact same high-end clean white automotive photo studio. Bright overhead white LED square softbox ceiling lights, "
    "clean reflective light grey floor, pure white studio walls. Exact same 3/4 front three-quarter angle view showing side and front bumper. "
    "Fitted with aggressive carbon fiber front bumper lip splitter, sport lowered suspension stance, gloss black concave forged alloy wheels "
    "with bold white rubber tyre lettering decals, dechromed gloss black front grille, smoked LED headlights, sharp 8k focus, ultra detailed automotive commercial photoshoot"
)

def fetch_image(prompt, filename, seed_val):
    encoded = urllib.parse.quote(prompt)
    url = f"https://image.pollinations.ai/prompt/{encoded}?width=1400&height=1000&nologo=true&model=flux&seed={seed_val}"
    dest = os.path.join(output_dir, filename)
    print(f"Downloading {filename}...")
    
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
    with urllib.request.urlopen(req, timeout=45) as resp:
        data = resp.read()
        with open(dest, 'wb') as f:
            f.write(data)
    print(f"✓ Saved {filename} ({len(data)} bytes)")

fetch_image(prompt_stock, "transformation_stock_before.png", seed)
fetch_image(prompt_tuned, "transformation_tuned_after.png", seed)
print("Both Brezza Before/After images downloaded successfully!")

import os
from PIL import Image

image_dir = r"d:\work\personal\revvmotiv\frontend\public\images"

initial_size = 0
final_size = 0
optimized_count = 0

print("Starting image optimization & compression...")

for root, _, files in os.walk(image_dir):
    for f in files:
        if f.lower().endswith(('.png', '.jpg', '.jpeg')):
            full_path = os.path.join(root, f)
            sz = os.path.getsize(full_path)
            initial_size += sz
            
            try:
                with Image.open(full_path) as im:
                    # Convert RGBA or P to RGB if saving as JPEG/WebP or keeping RGBA for PNG
                    has_alpha = im.mode in ('RGBA', 'LA') or (im.mode == 'P' and 'transparency' in im.info)
                    
                    # 1. Save optimized WebP version
                    webp_path = os.path.splitext(full_path)[0] + ".webp"
                    if has_alpha:
                        im.save(webp_path, "WEBP", quality=82, method=6)
                    else:
                        im.convert("RGB").save(webp_path, "WEBP", quality=82, method=6)
                    
                    # 2. Also compress the original PNG/JPG in-place for backwards-compatibility
                    if f.lower().endswith('.png'):
                        if has_alpha:
                            im.save(full_path, "PNG", optimize=True)
                        else:
                            # Optimize RGB PNG
                            im.convert("RGB").save(full_path, "PNG", optimize=True)
                    elif f.lower().endswith(('.jpg', '.jpeg')):
                        im.convert("RGB").save(full_path, "JPEG", optimize=True, quality=82)
                    
                    new_sz = os.path.getsize(full_path)
                    final_size += new_sz
                    optimized_count += 1
            except Exception as e:
                print(f"Skipping {f}: {e}")
                final_size += sz

print(f"\nDone! Processed {optimized_count} images.")
print(f"Original size: {round(initial_size/(1024*1024), 2)} MB")
print(f"Optimized PNG/JPG size: {round(final_size/(1024*1024), 2)} MB")
print("Generated modern .webp versions for all images!")

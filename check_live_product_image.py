import urllib.request
import json

req = urllib.request.Request('http://api.revvmotiv.com/api/v1/products', headers={'User-Agent': 'Mozilla/5.0'})
try:
    with urllib.request.urlopen(req, timeout=10) as response:
        data = json.loads(response.read().decode('utf-8'))
        for p in data.get('data', []):
            if 'Matrix' in p.get('title', '') or 'Underbody' in p.get('title', ''):
                print("FOUND PRODUCT:", json.dumps(p, indent=2))
except Exception as e:
    print("ERROR:", e)

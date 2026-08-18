import io
import paramiko
import urllib.request
import json
import time

key_str = """-----BEGIN OPENSSH PRIVATE KEY-----
b3BlbnNzaC1rZXktdjEAAAAACmFlczI1Ni1jdHIAAAAGYmNyeXB0AAAAGAAAABBtobytsh
Ketzt0enmOBgBlAAAAEAAAAAEAAAEXAAAAB3NzaC1yc2EAAAADAQABAAABAQDQ0RWQjnkf
qZVRef1DDunzX3laXRooUYRWHV7TgaZLExstTsqLu2gA0Ukg4FHb7AXp5c3zit5oXt3XIh
zL+mwm40s95lmD9Mhn9RpK+ob7BPKot7lOA+11PA1SSty84lyWhFQZB0uX5c5x1thPpCgW
nWfOH+FlY9sLWKuiStGELamG1/qknuBauIKmnrd7niW/EM95Vec/Lmx8DERz41vRRVK5iO
62keFJ532EetbHO8Fkhvdt8pDHPDS0wzulq9ZlPBrPFKK/+xNzfVnutacDqIw1CF07PVsw
ICIhCzdpdRahDrsICr8dScLP2naSOeZUFXVzg7DRbeuXyRkbJbsHAAADwGkaJ4+3nrL5yp
Wx6ayI8zK+c0RQHJnSf2SXiz4Bgw5cCANfH1v8nmcGbrfEb+aDGa4LqFa8b2hKLwx6dCML
QjyLCwjWicDMaH5fmn4A941+YmvpfXDIlzaoCG9Z4gf6qlE36b5qOD+7J/pYZZEE0RASN5
v2DLJdwgLlBHZ+xT2CpUI9flfH6ZxV7qEPvoD7kPVfqZ2tztJ52BN9Wd7TbWYaTkDJvvg5
jNqzua76KELRDVPKSeMgbV6TEVVxgp2eA5wKW5M3gA/MsPGcWpXewweIpQB4eL8GkPsXym
PMItd4P6Hzmr+NGlqrUuDB2RyHsFD/2Yez/Eh5MJ0JI++5f37i6cKbIOkXD7R6DjTFRRC2
TqYYSQ3Rk5/T2/zKB5jIe2C0DSMVJA1FnkVzzfW9idf4ZPpnuj5lMcTPc53QnXuANEOM5X
0zFWhiN+NniZDCwpYCs/ev3GvdTGCAjiuRjfloieQr+AS1wydsxhV4hvR97BU0kBA5J4vp
PyU26ESEKTvVnfLGcL1K3jfjX23bdN4ynBjL4JtIj7inT40Zn4YuhC/BeZFMiAVupMgj7G
f0HeJA8n8ATpfBHRxMCArOvMI7hNevt62/ihtaQ1JfZk+hp0Zbb3HBHCEVQJ8wYXe8rTQJ
WKg/SeyYqoC7kbXPmPWEKxuEZL6/U80rExHV50HcRsP88kT87IFV55ZhOdltdeOP46yTnk
teRFgwN/HN9dgldVYkZrLYSzDShXEiFA14F66vno7EZ9VpdS3AcIwVmHe82XHFgIXu0Wia
aYsxGtO034spjX99TuFkcY5ejFjXknWKVWGnCKw0xLFBsyYBdm5ArwuOIgQznWczgpyIj+
MVN3x26NRJTayGQa/10HwHnzdpJySyjZGwAluclNf7WGs8styyeycQOTuwEWdvJe4q9XwF
BHgxCJp+Pg7fuVDZkOPwZmmCmLD8q/dpqI6H6nQG049cib8DQDi7FutnG3f/FdgqBjH3rI
DcAz6tSGzoMmzbZqWyBmAcPIB2adKjKdqyIpLbY2wC0L86ux1yaj/Wac3G9r6oBpsbNymM
pkZ7MFZ+CHQWFaWV7vHzpwJyIjeomYsudnOvVBb8qAaJxYfJSXhBYLjU4yAD5uMLqqE3iV
oYg8+wIdanpmcOw4TbCB5ECBNG1A9j9Bn1ymOa2XRRXKyIQIlzV/HMUARjbL8TG4Jh+90y
ehm9qkKVRlKlEg1sWVBRPnL6PmUIAdiPJOx4cA/U88uAH2QJCLI+AsfOwnRAxOexsSLgeN
UqylBYpw==
-----END OPENSSH PRIVATE KEY-----"""

php_code = """<?php
require __DIR__ . '/../vendor/autoload.php';
$app = require_once __DIR__ . '/../bootstrap/app.php';
$kernel = $app->make(Illuminate\\Contracts\\Console\\Kernel::class);
$kernel->bootstrap();

$orders = App\\Models\\Order::with('items')->get();
$restored_items = [];

foreach ($orders as $order) {
    if ($order->payment_status === 'pending' && $order->source === 'website') {
        foreach ($order->items as $item) {
            $product = App\\Models\\Product::find($item->product_id);
            if ($product) {
                $product->increment('stock', $item->quantity);
                $restored_items[] = [
                    'product' => $product->title,
                    'quantity_restored' => $item->quantity,
                    'new_stock' => $product->stock,
                ];
            }
        }
        $order->delete();
    }
}

header('Content-Type: application/json');
echo json_encode([
    'status' => 'success',
    'deleted_unpaid_orders_count' => count($orders),
    'restored_items' => $restored_items,
    'current_orders' => App\\Models\\Order::count(),
], JSON_PRETTY_PRINT);
"""

pkey = paramiko.RSAKey.from_private_key(io.StringIO(key_str), password='Revvmotiv@123')
client = paramiko.SSHClient()
client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
client.connect('api.revvmotiv.com', port=22, username='t4kgltlmxs1l', pkey=pkey, timeout=15)
sftp = client.open_sftp()

with sftp.file('public_html/public/fix_order.php', 'w') as f:
    f.write(php_code)

time.sleep(1)
req = urllib.request.Request('http://api.revvmotiv.com/fix_order.php', headers={'User-Agent': 'Mozilla/5.0'})
with urllib.request.urlopen(req, timeout=15) as resp:
    res = resp.read().decode('utf-8')
    print('Response:', res)

try:
    sftp.remove('public_html/public/fix_order.php')
except Exception:
    pass

sftp.close()
client.close()

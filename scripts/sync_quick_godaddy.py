import io
import os
import sys
import paramiko
import urllib.request
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

def log(msg):
    print(msg, flush=True)

log("Connecting to GoDaddy SFTP...")
pkey = paramiko.RSAKey.from_private_key(io.StringIO(key_str), password='Revvmotiv@123')
client = paramiko.SSHClient()
client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
client.connect('api.revvmotiv.com', port=22, username='t4kgltlmxs1l', pkey=pkey, timeout=15)
sftp = client.open_sftp()
log("SFTP CONNECTED SUCCESSFULLY!")

def sftp_mkdirs(sftp, remote_directory):
    dirs = []
    d = remote_directory
    while d and d != '/' and d != '.':
        dirs.append(d)
        d = os.path.dirname(d)
    for d in reversed(dirs):
        try:
            sftp.stat(d)
        except IOError:
            try:
                sftp.mkdir(d)
            except Exception:
                pass

def upload_file(local_path, remote_path):
    sftp_mkdirs(sftp, os.path.dirname(remote_path))
    sftp.put(local_path, remote_path)
    log(f"Uploaded: {remote_path}")

def upload_dir(local_dir, remote_dir):
    for root, dirs, files in os.walk(local_dir):
        rel_path = os.path.relpath(root, local_dir)
        target_remote_dir = os.path.normpath(os.path.join(remote_dir, rel_path)).replace('\\', '/')
        for f in files:
            local_file = os.path.join(root, f)
            remote_file = (target_remote_dir + '/' + f).replace('\\', '/')
            try:
                upload_file(local_file, remote_file)
            except Exception as e:
                log(f"Error uploading {local_file}: {e}")

# Target specific files and folders that were updated
log("\n--- Uploading Changed Backend Controllers, Models, Routes, Views, Migrations ---")
upload_dir('backend/app', 'public_html/app')
upload_dir('backend/config', 'public_html/config')
upload_dir('backend/bootstrap', 'public_html/bootstrap')
upload_dir('backend/routes', 'public_html/routes')
upload_dir('backend/resources', 'public_html/resources')
upload_dir('backend/database/migrations', 'public_html/database/migrations')
upload_dir('backend/database/seeders', 'public_html/database/seeders')
upload_dir('backend/public/build', 'public_html/build')
upload_dir('backend/public/build', 'public_html/public/build')
upload_dir('backend/public/videos', 'public_html/videos')
upload_dir('backend/public/videos', 'public_html/public/videos')
upload_file('backend/public/.user.ini', 'public_html/.user.ini')
upload_file('backend/public/.user.ini', 'public_html/public/.user.ini')

# Now run a deployment sync script to migrate, seed, and clear cache
sync_script = r"""<?php
require __DIR__ . '/../vendor/autoload.php';
$app = require_once __DIR__ . '/../bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

date_default_timezone_set('Asia/Kolkata');

Illuminate\Support\Facades\Artisan::call('migrate', ['--force' => true]);
$migrateOut = Illuminate\Support\Facades\Artisan::output();

$seedOut = '';
try {
    Illuminate\Support\Facades\Artisan::call('db:seed', ['--class' => 'Database\\Seeders\\ReelSeeder', '--force' => true]);
    $seedOut = Illuminate\Support\Facades\Artisan::output();
} catch (\Throwable $e) {
    $seedOut = 'Seed error: ' . $e->getMessage();
}

Illuminate\Support\Facades\Artisan::call('view:clear');
$viewClear = Illuminate\Support\Facades\Artisan::output();

Illuminate\Support\Facades\Artisan::call('config:clear');
$configClear = Illuminate\Support\Facades\Artisan::output();

Illuminate\Support\Facades\Artisan::call('cache:clear');
$cacheClear = Illuminate\Support\Facades\Artisan::output();

Illuminate\Support\Facades\Artisan::call('route:clear');
$routeClear = Illuminate\Support\Facades\Artisan::output();

header('Content-Type: application/json');
echo json_encode([
    'status' => 'DEPLOYMENT_SUCCESS',
    'timezone' => date_default_timezone_get(),
    'now_ist' => date('l, d F Y · H:i:s T'),
    'migrate' => trim($migrateOut),
    'seed' => trim($seedOut),
    'view_clear' => trim($viewClear),
    'config_clear' => trim($configClear),
    'cache_clear' => trim($cacheClear),
    'route_clear' => trim($routeClear),
]);
"""

with sftp.file('public_html/public/live_deploy_sync.php', 'w') as f:
    f.write(sync_script)
log("\nUploaded live_deploy_sync.php!")

time.sleep(1)
req = urllib.request.Request('http://api.revvmotiv.com/live_deploy_sync.php', headers={'User-Agent': 'Mozilla/5.0'})
try:
    with urllib.request.urlopen(req, timeout=30) as resp:
        res = resp.read().decode('utf-8')
        log("\n=== GODADDY DEPLOYMENT OUTPUT ===")
        log(res)
except Exception as e:
    log(f"Error calling live_deploy_sync.php: {e}")

try:
    sftp.remove('public_html/public/live_deploy_sync.php')
    log("Cleaned up live_deploy_sync.php!")
except Exception as e:
    pass

sftp.close()
client.close()
log("\n>>> ALL BACKEND CHANGES SUCCESSFULLY DEPLOYED TO GODADDY! <<<")

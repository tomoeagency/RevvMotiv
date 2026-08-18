import io
import os
import paramiko

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

print('Connecting to GoDaddy via SFTP...')
pkey = paramiko.RSAKey.from_private_key(io.StringIO(key_str), password='Revvmotiv@123')
client = paramiko.SSHClient()
client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
client.connect('api.revvmotiv.com', port=22, username='t4kgltlmxs1l', pkey=pkey, timeout=15)
sftp = client.open_sftp()
print('Connected successfully!')

files_to_sync = [
    # Core Components
    ('backend/resources/views/components/admin/layout.blade.php', 'public_html/resources/views/components/admin/layout.blade.php'),
    ('backend/resources/views/components/admin/data-table.blade.php', 'public_html/resources/views/components/admin/data-table.blade.php'),
    ('backend/resources/views/components/admin/status-badge.blade.php', 'public_html/resources/views/components/admin/status-badge.blade.php'),
    ('backend/resources/views/components/admin/source-badge.blade.php', 'public_html/resources/views/components/admin/source-badge.blade.php'),
    ('backend/resources/views/components/admin/delete-button.blade.php', 'public_html/resources/views/components/admin/delete-button.blade.php'),
    ('backend/resources/views/components/admin/form-field.blade.php', 'public_html/resources/views/components/admin/form-field.blade.php'),
    
    # Dashboard & Auth
    ('backend/resources/views/admin/dashboard.blade.php', 'public_html/resources/views/admin/dashboard.blade.php'),
    ('backend/resources/views/admin/auth/login.blade.php', 'public_html/resources/views/admin/auth/login.blade.php'),
    
    # Products
    ('backend/resources/views/admin/products/index.blade.php', 'public_html/resources/views/admin/products/index.blade.php'),
    ('backend/resources/views/admin/products/_form.blade.php', 'public_html/resources/views/admin/products/_form.blade.php'),
    
    # Categories
    ('backend/resources/views/admin/categories/index.blade.php', 'public_html/resources/views/admin/categories/index.blade.php'),
    ('backend/resources/views/admin/categories/_form.blade.php', 'public_html/resources/views/admin/categories/_form.blade.php'),
    
    # Orders
    ('backend/resources/views/admin/orders/index.blade.php', 'public_html/resources/views/admin/orders/index.blade.php'),
    ('backend/resources/views/admin/orders/show.blade.php', 'public_html/resources/views/admin/orders/show.blade.php'),
    
    # Coupons
    ('backend/resources/views/admin/coupons/index.blade.php', 'public_html/resources/views/admin/coupons/index.blade.php'),
    ('backend/resources/views/admin/coupons/_form.blade.php', 'public_html/resources/views/admin/coupons/_form.blade.php'),
    
    # Reviews
    ('backend/resources/views/admin/reviews/index.blade.php', 'public_html/resources/views/admin/reviews/index.blade.php'),
    
    # Projects
    ('backend/resources/views/admin/projects/index.blade.php', 'public_html/resources/views/admin/projects/index.blade.php'),
    ('backend/resources/views/admin/projects/edit.blade.php', 'public_html/resources/views/admin/projects/edit.blade.php'),
    ('backend/resources/views/admin/projects/_form.blade.php', 'public_html/resources/views/admin/projects/_form.blade.php'),
    ('backend/resources/views/admin/projects/views/_form.blade.php', 'public_html/resources/views/admin/projects/views/_form.blade.php'),
    
    # Gallery
    ('backend/resources/views/admin/gallery/index.blade.php', 'public_html/resources/views/admin/gallery/index.blade.php'),
    ('backend/resources/views/admin/gallery/create.blade.php', 'public_html/resources/views/admin/gallery/create.blade.php'),
    ('backend/app/Http/Requests/Admin/GalleryItemStoreRequest.php', 'public_html/app/Http/Requests/Admin/GalleryItemStoreRequest.php'),
    ('backend/app/Http/Controllers/Admin/GalleryController.php', 'public_html/app/Http/Controllers/Admin/GalleryController.php'),
    
    # Announcements
    ('backend/resources/views/admin/announcements/index.blade.php', 'public_html/resources/views/admin/announcements/index.blade.php'),
    ('backend/resources/views/admin/announcements/_form.blade.php', 'public_html/resources/views/admin/announcements/_form.blade.php'),
    
    # Policies
    ('backend/resources/views/admin/policies/index.blade.php', 'public_html/resources/views/admin/policies/index.blade.php'),
    ('backend/resources/views/admin/policies/_form.blade.php', 'public_html/resources/views/admin/policies/_form.blade.php'),
    
    # Expenses
    ('backend/resources/views/admin/expenses/index.blade.php', 'public_html/resources/views/admin/expenses/index.blade.php'),
    ('backend/resources/views/admin/expenses/_form.blade.php', 'public_html/resources/views/admin/expenses/_form.blade.php'),
    
    # Leads & Enquiries
    ('backend/resources/views/admin/leads-enquiries/index.blade.php', 'public_html/resources/views/admin/leads-enquiries/index.blade.php'),
    
    # Settings & Account
    ('backend/resources/views/admin/settings/edit.blade.php', 'public_html/resources/views/admin/settings/edit.blade.php'),
    ('backend/resources/views/admin/account/edit.blade.php', 'public_html/resources/views/admin/account/edit.blade.php'),
    
    # API & Core Services
    ('backend/app/Http/Controllers/Api/V1/ReviewController.php', 'public_html/app/Http/Controllers/Api/V1/ReviewController.php'),
    ('backend/app/Services/CloudinaryUploadService.php', 'public_html/app/Services/CloudinaryUploadService.php'),
    ('backend/routes/web.php', 'public_html/routes/web.php'),
]

for local_path, remote_path in files_to_sync:
    if os.path.exists(local_path):
        print(f'Uploading {local_path} -> {remote_path}...')
        try:
            sftp.put(local_path, remote_path)
            print(f'  ✓ Done')
        except Exception as e:
            print(f'  ✗ Failed: {e}')

# Sync build manifest and css/js assets
build_dir = 'backend/public/build'
if os.path.exists(build_dir):
    print('Syncing public/build assets...')
    for root, dirs, files in os.walk(build_dir):
        rel_root = os.path.relpath(root, 'backend')
        remote_root = f'public_html/{rel_root}'.replace('\\', '/')
        try:
            sftp.mkdir(remote_root)
        except Exception:
            pass
        for f in files:
            local_f = os.path.join(root, f)
            remote_f = f'{remote_root}/{f}'.replace('\\', '/')
            try:
                sftp.put(local_f, remote_f)
                print(f'  ✓ Uploaded build asset: {remote_f}')
            except Exception as e:
                print(f'  ✗ Failed asset {f}: {e}')

# Clear compiled view cache on remote server
print('Clearing compiled view cache on GoDaddy...')
try:
    view_cache_dir = 'public_html/storage/framework/views'
    for f in sftp.listdir(view_cache_dir):
        if f != '.' and f != '..':
            try:
                sftp.remove(f'{view_cache_dir}/{f}')
            except Exception:
                pass
    print('  ✓ View cache cleared!')
except Exception as e:
    print('View cache clear error:', e)

# Clear bootstrap cache
print('Clearing bootstrap route & config cache...')
try:
    boot_cache_dir = 'public_html/bootstrap/cache'
    for f in sftp.listdir(boot_cache_dir):
        if f.endswith('.php') and f != 'packages.php' and f != 'services.php':
            try:
                sftp.remove(f'{boot_cache_dir}/{f}')
                print(f'  ✓ Removed cache file: {f}')
            except Exception:
                pass
except Exception as e:
    print('Bootstrap cache error:', e)

sftp.close()
client.close()
print('\n🎉 COMPLETE FULL SYNC TO GODADDY LIVE SERVER!')

$cert = New-SelfSignedCertificate -Type CodeSigningCert -Subject "CN=VerdantIQ, O=VerdantIQ Ecosphere, C=US" -KeyUsage DigitalSignature -FriendlyName "VerdantIQ Code Signing" -CertStoreLocation "Cert:\CurrentUser\My" -NotAfter (Get-Date).AddYears(5)
$password = ConvertTo-SecureString -String "VerdantIQ2026!" -Force -AsPlainText
Export-PfxCertificate -Cert $cert -FilePath "certs\verdantiq-signing.pfx" -Password $password
Write-Output "Certificate created successfully at certs\verdantiq-signing.pfx"


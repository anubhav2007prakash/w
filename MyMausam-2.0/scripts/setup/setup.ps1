Write-Host "Setting up MyMausam 2.0 Environment..." -ForegroundColor Cyan

# Install web dependencies
Set-Location -Path "apps\web"
npm install

# Install python dependencies
Set-Location -Path "..\..\backend\python"
pip install -r requirements.txt

Set-Location -Path "..\.."
Write-Host "MyMausam 2.0 environment setup complete!" -ForegroundColor Green

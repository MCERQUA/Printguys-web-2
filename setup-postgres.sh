#!/bin/bash
# PostgreSQL Setup Script for Printguys
# Run with: sudo bash setup-postgres.sh

set -e

echo "=== Installing PostgreSQL ==="
apt-get update
apt-get install -y postgresql postgresql-contrib

echo "=== Starting PostgreSQL ==="
systemctl start postgresql
systemctl enable postgresql

echo "=== Creating Database and User ==="
sudo -u postgres psql << 'EOF'
CREATE DATABASE printguys;
CREATE USER printguys WITH ENCRYPTED PASSWORD 'printguys_secure_2026';
GRANT ALL PRIVILEGES ON DATABASE printguys TO printguys;
ALTER DATABASE printguys OWNER TO printguys;
\c printguys
GRANT ALL ON SCHEMA public TO printguys;
EOF

echo "=== Verifying ==="
sudo -u postgres psql -c "\l" | grep printguys

echo ""
echo "=== PostgreSQL Setup Complete! ==="
echo "Database: printguys"
echo "User: printguys"
echo "Password: printguys_secure_2026"
echo ""
echo "Now run: cd /home/nick/Nick/Printguys-AI/printguys-nextjs && npx prisma db push"

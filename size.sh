BASE_PATH=dist/a11y-dialog

# Build the dist files
npm run build -- --silent

# Gzip files
gzip -9fkc $BASE_PATH.min.js > $BASE_PATH.min.js.gz
gzip -9fkc $BASE_PATH.esm.min.js > $BASE_PATH.esm.min.js.gz

# Brotli files
brotli -8fkc $BASE_PATH.min.js > $BASE_PATH.min.js.br
brotli -8fkc $BASE_PATH.esm.min.js > $BASE_PATH.esm.min.js.br

# Print sizes
ls -lh $BASE_PATH.js            | awk '{print "UMD raw size    :", $5"B"}'
ls -lh $BASE_PATH.min.js        | awk '{print "UMD min size    :", $5"B"}'
ls -lh $BASE_PATH.min.js.gz     | awk '{print "UMD gzip size   :", $5"B"}'
ls -lh $BASE_PATH.min.js.br     | awk '{print "UMD brotli size :", $5"B"}'

echo ""

ls -lh $BASE_PATH.esm.js        | awk '{print "ESM raw size    :", $5"B"}'
ls -lh $BASE_PATH.esm.min.js    | awk '{print "ESM min size    :", $5"B"}'
ls -lh $BASE_PATH.esm.min.js.gz | awk '{print "ESM gzip size   :", $5"B"}'
ls -lh $BASE_PATH.esm.min.js.br | awk '{print "ESM brotli size :", $5"B"}'

# Clean up compressed files
rm -r dist/*.{br,gz}

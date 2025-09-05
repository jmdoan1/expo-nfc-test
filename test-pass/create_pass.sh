#!/bin/bash

# A script to regenerate an Apple Wallet pass after its contents have changed.
#
# Place this script in the same directory as your pass assets
# (pass.json, icon.png, signerCert.pem, etc.)
#
# Usage:
# ./create_pass.sh YourNewPassName.pkpass

# --- Configuration ---
# The name of the final .pkpass file. You can pass this as an argument.
OUTPUT_PASS_NAME=${1:-"MyTestPass.pkpass"}

# --- Main Script ---

# 1. Clean up old pass artifacts to ensure a fresh build.
echo "Cleaning up old files..."
rm -f manifest.json signature "$OUTPUT_PASS_NAME"

# 2. Generate the new manifest.json file.
echo "Creating new manifest..."
# This find command now explicitly excludes .cer files
find . -type f -not -name '.*' -not -name 'create_pass.sh' -not -name 'manifest.json' -not -name 'signature' -not -name '*.pkpass' -not -name '*.pem' -not -name '*.p12' -not -name '*.cer' | while read -r f; do
  shasum -a 1 "$f" | awk -v f="${f#./}" '{print "\""f"\": \""$1"\""}'
done | sed '1s/^/{/' | sed '$!s/$/,/' | sed '$s/$/}/' > manifest.json

# Check if manifest was created
if [ ! -f manifest.json ]; then
    echo "Error: manifest.json could not be created."
    exit 1
fi

# 3. Create the signature.
echo "Creating signature..."
openssl smime -binary -sign \
  -certfile AppleWWDRCAG4.cer \
  -signer signerCert.pem \
  -inkey signerKey.pem \
  -in manifest.json \
  -out signature \
  -outform DER

# Check if signature was created
if [ ! -f signature ]; then
    echo "Error: Signature could not be created. Check your certificates."
    exit 1
fi

# 4. Package the final .pkpass file.
echo "Zipping the pass into $OUTPUT_PASS_NAME..."
# The zip command also needs to exclude the .cer file
zip -r "$OUTPUT_PASS_NAME" . -x "*.DS_Store" -x "__MACOSX*" -x "create_pass.sh" -x "*.pem" -x "*.p12" -x "*.cer" -x "*.pkpass"

# 5. Final confirmation.
echo "✅ Done. Pass created at $OUTPUT_PASS_NAME"
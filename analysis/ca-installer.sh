#!/bin/sh

# Installs a temporary root CA in Android (will be gone after rebooting).
# Based on [HTTP Toolkit](https://github.com/httptoolkit/httptoolkit-server/blob/45d911c37ae3735769c15e300ba6cf8d7c9e127d/src/interceptors/android/adb-commands.ts#L219-L246s)



CA_PATH=/data/local/tmp/$(openssl x509 -subject_hash_old -in "$1" |head -1).0
adb push "$1" "$CA_PATH"

adb shell "
set -e # Fail on error

# Create a separate temp directory, to hold the current certificates
# Without this, when we add the mount we can't read the current certs anymore.
mkdir -m 700 /data/local/tmp/htk-ca-copy

# Copy out the existing certificates
cp /system/etc/security/cacerts/* /data/local/tmp/htk-ca-copy/

# Create the in-memory mount on top of the system certs folder
mount -t tmpfs tmpfs /system/etc/security/cacerts

# Copy the existing certs back into the tmpfs mount, so we keep trusting them
mv /data/local/tmp/htk-ca-copy/* /system/etc/security/cacerts/

# Copy our new cert in, so we trust that too
mv "$CA_PATH" /system/etc/security/cacerts/

# Update the perms & selinux context labels, so everything is as readable as before
chown root:root /system/etc/security/cacerts/*
chmod 644 /system/etc/security/cacerts/*
chcon u:object_r:system_file:s0 /system/etc/security/cacerts/*

# Delete the temp cert directory & this script itself
rm -r /data/local/tmp/htk-ca-copy

echo System cert successfully injected
"
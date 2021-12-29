# Packet Capturing

Rooted Android phone required. All commands should be run on a PC.

## Certificate Pinning

Install Frida on [PC](https://frida.re/docs/installation/) and [Android](https://frida.re/docs/android/).

Bypass the app's certificate pinning (keep running in background):

```sh
frida -U -l sslbypass.js -n com.moshbit.studo
```

## Proxy

Install [mitmproxy](https://mitmproxy.org/).

Import the (temporary) root certificate in Android so it can decrypt SSL:

```sh
adb root
./ca-installer.sh ~/.mitmproxy/mitmproxy-ca-cert.cer
```

Alternative: [Root Certificate Manager](https://play.google.com/store/apps/details?id=net.jolivier.cert.Importer).

Start the proxy:

```sh
./start-proxy.sh
```

Logs get written to `logs.md`

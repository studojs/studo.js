/* eslint-disable */
Java.perform(function() {
  console.log('');
  console.log('======');
  console.log('[#] Android Bypass for various Certificate Pinning methods [#]');
  console.log('======');


  const X509TrustManager = Java.use('javax.net.ssl.X509TrustManager');
  const SSLContext = Java.use('javax.net.ssl.SSLContext');


  // TrustManager (Android < 7)
  const TrustManager = Java.registerClass({
    // Implement a custom TrustManager
    name: 'dev.asd.test.TrustManager',
    implements: [X509TrustManager],
    methods: {
      checkClientTrusted(chain, authType) { },
      checkServerTrusted(chain, authType) { },
      getAcceptedIssuers() { return []; }
    }
  });
  // Prepare the TrustManager array to pass to SSLContext.init()
  const TrustManagers = [TrustManager.$new()];
  // Get a handle on the init() on the SSLContext class
  const SSLContext_init = SSLContext.init.overload(
    '[Ljavax.net.ssl.KeyManager;', '[Ljavax.net.ssl.TrustManager;', 'java.security.SecureRandom');
  try {
    // Override the init method, specifying the custom TrustManager
    SSLContext_init.implementation = function(keyManager, trustManager, secureRandom) {
      console.log('[+] Bypassing Trustmanager (Android < 7) request');
      SSLContext_init.call(this, keyManager, TrustManagers, secureRandom);
    };
  } catch (err) {
    console.log('[-] TrustManager (Android < 7) pinner not found');
    // console.log(err);
  }


  // OkHTTPv3 (quadruple bypass)
  try {
    // Bypass OkHTTPv3 {1}
    const okhttp3_Activity_1 = Java.use('okhttp3.CertificatePinner');
    okhttp3_Activity_1.check.overload('java.lang.String', 'java.util.List').implementation = function(a, b) {
      console.log('[+] Bypassing OkHTTPv3 {1}: ' + a);
      return true;
    };
  } catch (err) {
    console.log('[-] OkHTTPv3 {1} pinner not found');
    // console.log(err);
  }
  try {
    // Bypass OkHTTPv3 {2}
    // This method of CertificatePinner.check could be found in some old Android app
    const okhttp3_Activity_2 = Java.use('okhttp3.CertificatePinner');
    okhttp3_Activity_2.check.overload('java.lang.String', 'java.security.cert.Certificate').implementation = function(a, b) {
      console.log('[+] Bypassing OkHTTPv3 {2}: ' + a);
      return true;
    };
  } catch (err) {
    console.log('[-] OkHTTPv3 {2} pinner not found');
    // console.log(err);
  }
  try {
    // Bypass OkHTTPv3 {3}
    const okhttp3_Activity_3 = Java.use('okhttp3.CertificatePinner');
    okhttp3_Activity_3.check.overload('java.lang.String', '[Ljava.security.cert.Certificate;').implementation = function(a, b) {
      console.log('[+] Bypassing OkHTTPv3 {3}: ' + a);
      return true;
    };
  } catch (err) {
    console.log('[-] OkHTTPv3 {3} pinner not found');
    // console.log(err);
  }
  try {
    // Bypass OkHTTPv3 {4}
    const okhttp3_Activity_4 = Java.use('okhttp3.CertificatePinner');
    okhttp3_Activity_4['check$okhttp'].implementation = function(a, b) {
      console.log('[+] Bypassing OkHTTPv3 {4}: ' + a);
    };
  } catch (err) {
    console.log('[-] OkHTTPv3 {4} pinner not found');
    // console.log(err);
  }

  // TrustManagerImpl (Android > 7)
  try {
    const TrustManagerImpl = Java.use('com.android.org.conscrypt.TrustManagerImpl');
    TrustManagerImpl.verifyChain.implementation = function(untrustedChain, trustAnchorChain, host, clientAuth, ocspData, tlsSctData) {
      console.log('[+] Bypassing TrustManagerImpl (Android > 7): ' + host);
      return untrustedChain;
    };
  } catch (err) {
    console.log('[-] TrustManagerImpl (Android > 7) pinner not found');
    // console.log(err);
  }
});

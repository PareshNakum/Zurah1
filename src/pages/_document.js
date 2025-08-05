import { Html, Head, Main, NextScript } from "next/document";
export default function Document() {
  return (
    <Html lang="en">
      <Head>
        {/* Prefetch Fonts - make sure fonts are in the public folder */}
        
        <link
          rel="prefetch"
          href="/Assets/fonts/Poppins-Medium.woff"
          as="font"
          type="font/woff"
          crossOrigin="anonymous"
        />
        <link
          rel="prefetch"
          href="/Assets/fonts/Poppins-Bold.woff"
          as="font"
          type="font/woff"
          crossOrigin="anonymous"
        />
        <link
          rel="prefetch"
          href="/Assets/fonts/Poppins-Regular.woff"
          as="font"
          type="font/woff"
          crossOrigin="anonymous"
        />
        <link
          rel="prefetch"
          href="/Assets/fonts/Poppins-SemiBold.woff"
          as="font"
          type="font/woff"
          crossOrigin="anonymous"
        />
        <link
          rel="prefetch"
          href="/Assets/fonts/zurah-icon.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}

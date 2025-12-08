export default function Head() {
  return (
    <>
      <script
        async
        src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4567735221663784"
        crossOrigin="anonymous"
      />
      <script
        async
        src="https://www.googletagmanager.com/gtag/js?id=G-SW5RP3XC4T"
      />
      <script
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-SW5RP3XC4T');
          `,
        }}
      />
    </>
  );
}

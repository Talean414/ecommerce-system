// src/pages/_document.tsx
import Document, {
  Html,
  Head,
  Main,
  NextScript,
  DocumentContext,
  DocumentInitialProps,
} from "next/document";
import { AppProps } from "next/app";
import { JSX } from "react";
import React from "react";
import { ServerStyleSheets } from "@mui/styles";

class MyDocument extends Document {
  static async getInitialProps(
    ctx: DocumentContext
  ): Promise<DocumentInitialProps & { styles: JSX.Element }> {
    const sheets = new ServerStyleSheets();
    const originalRenderPage = ctx.renderPage;

    // Override renderPage to collect styles during SSR
    ctx.renderPage = () =>
      originalRenderPage({
        enhanceApp: (App: React.ComponentType<AppProps>) =>
          (props: AppProps) => sheets.collect(<App {...props} />),
      });

    const initialProps = await Document.getInitialProps(ctx);
    return {
      ...initialProps,
      styles: (
        <>
          {initialProps.styles}
          {sheets.getStyleElement()}
        </>
      ),
    };
  }

  render() {
    return (
      <Html lang="en">
        <Head />
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;

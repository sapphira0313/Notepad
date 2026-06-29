import type { Metadata } from "next";
import { ThemeProvider } from "next-themes";
import { MantineProvider, createTheme } from "@mantine/core";
import "@mantine/core/styles.css";
import "../src/styles/globals.css";

export const metadata: Metadata = {
  title: "云文档",
  description:
    "本地优先的 Notion 替代品，所有数据保存在你的浏览器中。",
  icons: {
    icon: "/favicon.ico",
  },
};

const theme = createTheme({
  primaryColor: "blue",
  fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="zh-CN"
      className="h-full antialiased"
      suppressHydrationWarning
    >
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
      </head>
      <body className="h-full">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem={true}
          disableTransitionOnChange={false}
        >
          <MantineProvider theme={theme}>
            {children}
          </MantineProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

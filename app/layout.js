export const metadata = {
  title: "MLB AI Insights",
  description: "AI-powered MLB analysis using Gemini 3 Flash Lite",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

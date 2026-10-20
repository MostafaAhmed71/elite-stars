import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'مدارس نخبة الشمال | نجوم الأسبوع - كوكبة التميز',
  description: 'منصة التكريم الرقمية الملكية لنجوم التميز الأسبوعي في مدارس نخبة الشمال الأهلية والعالمية بمحافظة رفحاء.',
  keywords: ['مدارس نخبة الشمال', 'نجوم الأسبوع', 'لوحة الشرف', 'التفوق المدرسي', 'رفحاء', 'Elite Stars'],
  openGraph: {
    title: 'مدارس نخبة الشمال | نجوم الأسبوع',
    description: 'كوكبة التميز لهذا الأسبوع - احتفاء بأبنائنا وبناتنا المتميزين في مدارس نخبة الشمال',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Tajawal:wght@300;400;500;700;800;900&family=Cairo:wght@400;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-[#FFF7E6] text-[#173331] font-sans antialiased min-h-screen selection:bg-[#F97316] selection:text-[#FFF7E6]">
        {children}
      </body>
    </html>
  );
}

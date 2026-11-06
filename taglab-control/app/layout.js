import "./globals.css";
export const metadata = {
  title: "TagLab Control · Central de conteúdo",
  description:
    "Questões, trilhas e atividades para o time ensinar e aprender com o TagLab.",
  robots: { index: false, follow: false },
};
export default function Layout({ children }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}

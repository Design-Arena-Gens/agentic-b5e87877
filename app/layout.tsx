import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Neuro-Symbolic CARS: Habits & Context",
  description: "Compositional generalization via habits in contextual recommendations",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div className="container">
          <header className="header">
            <h1>Neuro-Symbolic CARS: Habits & Context</h1>
            <p className="tag">Habits = Context [Behaviors (Repetition + Positive Reinforcement)]</p>
          </header>
          <main>{children}</main>
          <footer className="footer">Built for LDOS-CoMoDa-style contexts</footer>
        </div>
      </body>
    </html>
  );
}

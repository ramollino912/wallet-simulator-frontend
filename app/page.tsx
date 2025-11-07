"use client"
import { redirect } from 'next/navigation';

export default function Home() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-black overflow-hidden">
      <style jsx>{`
        @keyframes rainbow {
          0% { color: #ff0000; transform: scale(1) rotate(0deg); }
          14% { color: #ff7f00; transform: scale(1.1) rotate(5deg); }
          28% { color: #ffff00; transform: scale(1) rotate(-5deg); }
          42% { color: #00ff00; transform: scale(1.2) rotate(5deg); }
          56% { color: #0000ff; transform: scale(1) rotate(0deg); }
          70% { color: #4b0082; transform: scale(1.1) rotate(-5deg); }
          84% { color: #9400d3; transform: scale(1) rotate(5deg); }
          100% { color: #ff0000; transform: scale(1) rotate(0deg); }
        }
        .animated-text {
          animation: rainbow 3s infinite;
          font-size: 8rem;
          font-weight: bold;
          text-shadow: 0 0 20px currentColor;
        }
      `}</style>
      <h1 className="animated-text">RAMOLLINO PAGA</h1>
    </div>
  );
  redirect('/login');
}

'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { 
  ArrowLeft, 
  HelpCircle, 
  Phone, 
  Mail, 
  MessageCircle,
  Shield,
  Wallet,
  ArrowRightLeft,
  CreditCard
} from 'lucide-react';

export default function AyudaPage() {
  const router = useRouter();

  const faqs = [
    {
      icon: Wallet,
      pregunta: '¿Cómo puedo ingresar dinero a mi cuenta?',
      respuesta: 'Ve a la sección "Ingresar" desde el menú principal, ingresa el monto que deseas agregar y presiona "Aceptar". Tu saldo se actualizará inmediatamente.'
    },
    {
      icon: ArrowRightLeft,
      pregunta: '¿Cómo hago una transferencia?',
      respuesta: 'Ve a "Transferir", busca al destinatario por nombre o email, ingresa el monto y confirma la operación. El dinero se transferirá al instante.'
    },
    {
      icon: CreditCard,
      pregunta: '¿Puedo pagar servicios?',
      respuesta: 'Sí, en la sección "Servicios" puedes agregar tus facturas y pagarlas directamente desde tu billetera.'
    },
    {
      icon: Shield,
      pregunta: '¿Es segura la aplicación?',
      respuesta: 'Sí, todas tus transacciones están protegidas con encriptación de última generación. Tu información personal está completamente segura.'
    }
  ];

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <Button
          variant="ghost"
          onClick={() => router.push('/home')}
          className="mb-4 text-lg"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Volver
        </Button>
        <div className="flex items-center gap-4 mb-4">
          <HelpCircle className="h-12 w-12 text-blue-600" />
          <h1 className="text-4xl font-bold text-slate-800">Centro de Ayuda</h1>
        </div>
        <p className="text-xl text-slate-600">
          Estamos aquí para ayudarte. Encuentra respuestas a las preguntas más frecuentes o contáctanos directamente.
        </p>
      </div>

      {/* Preguntas Frecuentes */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-slate-800 mb-6">Preguntas Frecuentes</h2>
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <Card key={index} className="p-6">
              <div className="flex gap-4">
                <div className="bg-blue-100 rounded-full p-3 h-fit">
                  <faq.icon className="h-8 w-8 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-semibold text-slate-800 mb-3">
                    {faq.pregunta}
                  </h3>
                  <p className="text-lg text-slate-600 leading-relaxed">
                    {faq.respuesta}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

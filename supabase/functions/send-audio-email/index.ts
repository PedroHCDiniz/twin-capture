import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface AudioEmailRequest {
  audioData: string; // base64 encoded audio
  duration: number;
  timestamp: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { audioData, duration, timestamp }: AudioEmailRequest = await req.json();

    console.log("Sending audio email with duration:", duration, "seconds");

    // Convert base64 to Uint8Array
    const audioBuffer = Uint8Array.from(atob(audioData), c => c.charCodeAt(0));

    const emailResponse = await resend.emails.send({
      from: "Gravador de Áudio <onboarding@resend.dev>",
      to: ["pedrohcdiniz00@gmail.com"],
      subject: `Nova Gravação de Áudio - ${new Date(timestamp).toLocaleString('pt-BR')}`,
      html: `
        <h2>Nova Gravação de Áudio</h2>
        <p><strong>Data/Hora:</strong> ${new Date(timestamp).toLocaleString('pt-BR')}</p>
        <p><strong>Duração:</strong> ${Math.floor(duration / 60)}:${String(duration % 60).padStart(2, '0')}</p>
        <p>A gravação de áudio está anexada a este email.</p>
        <br>
        <p>Gravação gerada automaticamente pelo sistema.</p>
      `,
      attachments: [
        {
          filename: `gravacao_${timestamp.replace(/:/g, '-')}.wav`,
          content: audioBuffer,
        },
      ],
    });

    console.log("Email sent successfully:", emailResponse);

    return new Response(JSON.stringify({ 
      success: true, 
      message: "Email enviado com sucesso!",
      emailId: emailResponse.id 
    }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-audio-email function:", error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message 
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
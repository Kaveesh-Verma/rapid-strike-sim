import { useState } from "react";
import { Mail, Send, Smartphone, CheckCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Scenario } from "@/lib/scenarioGenerator";

interface EmailDeliverySectionProps {
  currentScenario: Scenario | null;
  userId: string | null;
}

const EmailDeliverySection = ({ currentScenario, userId }: EmailDeliverySectionProps) => {
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSendToDevice = async () => {
    if (!email) {
      toast({
        title: "Email Required",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      return;
    }

    if (!currentScenario) {
      toast({
        title: "Scenario Required",
        description: "No scenario selected.",
        variant: "destructive",
      });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      return;
    }

    setIsSending(true);
    try {
      // Call our API route instead of calling Resend directly
      const response = await fetch("/api/send-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email.trim(),
          subject: currentScenario.title,
          html: `
            <!DOCTYPE html>
            <html>
            <head>
              <meta charset="UTF-8">
              <style>
                body { font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; }
                .container { background: #fff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
                .banner { background: #1a1a2e; color: #00ff88; padding: 20px; text-align: center; font-weight: bold; }
                .content { padding: 20px; }
                .cta { display: inline-block; background: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
              </style>
            </head>
            <body>
              <div class="container">
                <div class="banner">🛡️ RAPID STRIKE SECURITY SIMULATION</div>
                <div class="content">
                  <h2>Security Training Scenario</h2>
                  <p><strong>Type:</strong> ${currentScenario.type}</p>
                  <p><strong>Difficulty:</strong> ${currentScenario.difficulty}</p>
                  <p><strong>Title:</strong> ${currentScenario.title}</p>
                  <p><strong>From:</strong> ${currentScenario.content?.from || 'Unknown'}</p>
                  <br>
                  <p>${currentScenario.content?.body?.substring(0, 300) || 'Training scenario content'}</p>
                  <br>
                  <p style="font-size: 12px; color: #666;">This is a training simulation from Rapid Strike Simulator.</p>
                </div>
              </div>
            </body>
            </html>
          `,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to send email");
      }

      setSent(true);
      toast({
        title: "Scenario Sent!",
        description: `Check your inbox at ${email}`,
      });

      setTimeout(() => {
        setSent(false);
        setEmail("");
      }, 5000);
    } catch (error: any) {
      console.error("Error sending scenario:", error);
      toast({
        title: "Failed to Send",
        description: error.message || "Could not send scenario. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="bg-black/50 rounded-xl border border-cyber-green/20 p-4 mt-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-lg bg-purple-500/10 border border-purple-500/30 flex items-center justify-center">
          <Smartphone className="w-5 h-5 text-purple-400" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-gray-200 font-mono">Practice on Your Device</h3>
          <p className="text-gray-500 text-sm font-mono">Get this scenario sent to your email for mobile training</p>
        </div>
      </div>

      {sent ? (
        <div className="flex items-center gap-3 p-4 bg-green-500/10 rounded-lg border border-green-500/30">
          <CheckCircle className="w-6 h-6 text-green-400" />
          <div>
            <p className="text-green-400 font-mono font-semibold">Scenario Sent!</p>
            <p className="text-gray-400 text-sm font-mono">Check your inbox at {email}</p>
          </div>
        </div>
      ) : (
        <div className="flex gap-3">
          <div className="flex-1 relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <Input
              type="email"
              placeholder="Enter your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="pl-10 bg-gray-900/50 border-gray-700 text-gray-200 font-mono placeholder:text-gray-600 focus:border-cyber-green"
            />
          </div>
          <Button
            onClick={handleSendToDevice}
            disabled={isSending || !currentScenario}
            className="bg-purple-500 hover:bg-purple-600 text-white font-mono gap-2"
          >
            {isSending ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Sending...
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                Send to Device
              </>
            )}
          </Button>
        </div>
      )}

      <p className="text-gray-600 text-xs font-mono mt-3">
        📱 You'll receive a link to complete this scenario on your phone or tablet. Great for realistic mobile phishing practice!
      </p>
    </div>
  );
};

export default EmailDeliverySection;

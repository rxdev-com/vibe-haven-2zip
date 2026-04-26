import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, ArrowLeft, Loader2, CheckCircle, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { authToken } from "@/lib/api";

const API_BASE = "/api";

async function callApi(path, body) {
  const token = authToken.get();
  const res = await fetch(`${API_BASE}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(body || {}),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || "Request failed");
  return data;
}

export default function VerifyEmail() {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  const passedEmail = location.state?.email || "";
  const passedDevCode = location.state?.devCode || "";

  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [submitting, setSubmitting] = useState(false);
  const [resending, setResending] = useState(false);
  const [success, setSuccess] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(60);
  const [devHint, setDevHint] = useState(passedDevCode);
  const inputs = useRef([]);

  useEffect(() => {
    if (!authToken.get()) {
      toast({
        title: "Please log in first",
        description: "You need an account to verify your email.",
        variant: "destructive",
      });
      navigate("/login");
    }
  }, [navigate, toast]);

  useEffect(() => {
    if (secondsLeft <= 0) return;
    const id = setInterval(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearInterval(id);
  }, [secondsLeft]);

  const setDigit = (idx, value) => {
    const v = value.replace(/\D/g, "").slice(-1);
    setCode((prev) => {
      const next = [...prev];
      next[idx] = v;
      return next;
    });
    if (v && idx < 5) inputs.current[idx + 1]?.focus();
  };

  const handleKeyDown = (idx, e) => {
    if (e.key === "Backspace" && !code[idx] && idx > 0) {
      inputs.current[idx - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    const pasted = (e.clipboardData.getData("text") || "")
      .replace(/\D/g, "")
      .slice(0, 6);
    if (!pasted) return;
    e.preventDefault();
    const next = ["", "", "", "", "", ""];
    for (let i = 0; i < pasted.length; i++) next[i] = pasted[i];
    setCode(next);
    inputs.current[Math.min(pasted.length, 5)]?.focus();
  };

  const handleVerify = async () => {
    const joined = code.join("");
    if (joined.length !== 6) {
      toast({
        title: "Enter all 6 digits",
        variant: "destructive",
      });
      return;
    }
    setSubmitting(true);
    try {
      await callApi("/auth/verify-email", { code: joined });
      setSuccess(true);
      toast({
        title: "Email verified",
        description: "Welcome to JugaduBazar!",
      });
      setTimeout(() => {
        const role = JSON.parse(localStorage.getItem("user_data") || "{}").role;
        navigate(role === "supplier" ? "/supplier/dashboard" : "/vendor/dashboard");
      }, 1200);
    } catch (e) {
      toast({
        title: "Verification failed",
        description: e.message,
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleResend = async () => {
    setResending(true);
    try {
      const data = await callApi("/auth/resend-verification");
      toast({
        title: "Code sent",
        description: "Check your inbox for a new 6-digit code.",
      });
      setSecondsLeft(60);
      if (data.devVerificationCode) setDevHint(data.devVerificationCode);
    } catch (e) {
      toast({
        title: "Could not resend",
        description: e.message,
        variant: "destructive",
      });
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-saffron-50 via-orange-50 to-emerald-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <Link
          to="/login"
          className="inline-flex items-center text-sm text-gray-600 hover:text-saffron-600 mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-1" /> Back to login
        </Link>

        <Card className="shadow-xl border-0">
          <CardHeader className="text-center pb-2">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200 }}
              className="mx-auto w-16 h-16 rounded-full bg-gradient-to-r from-saffron-500 to-orange-500 flex items-center justify-center mb-3"
            >
              {success ? (
                <CheckCircle className="w-8 h-8 text-white" />
              ) : (
                <Mail className="w-8 h-8 text-white" />
              )}
            </motion.div>
            <CardTitle className="text-2xl">Verify Your Email</CardTitle>
            <p className="text-sm text-gray-600 mt-2">
              We sent a 6-digit code to{" "}
              <span className="font-semibold text-gray-900">
                {passedEmail || "your email"}
              </span>
            </p>
          </CardHeader>

          <CardContent className="space-y-6 pt-4">
            {devHint && (
              <div className="text-xs text-center bg-amber-50 border border-amber-200 text-amber-800 rounded-md p-2">
                Dev code: <span className="font-mono font-bold">{devHint}</span>
              </div>
            )}

            <div
              className="flex justify-center gap-2"
              onPaste={handlePaste}
            >
              {code.map((digit, i) => (
                <input
                  key={i}
                  ref={(el) => (inputs.current[i] = el)}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => setDigit(i, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(i, e)}
                  className="w-12 h-14 text-center text-2xl font-bold border-2 border-gray-200 rounded-lg focus:border-saffron-500 focus:outline-none focus:ring-2 focus:ring-saffron-200 transition-all"
                  disabled={submitting || success}
                />
              ))}
            </div>

            <Button
              onClick={handleVerify}
              disabled={submitting || success || code.join("").length !== 6}
              className="w-full bg-gradient-to-r from-saffron-500 to-orange-500 hover:from-saffron-600 hover:to-orange-600 text-white"
            >
              {success ? (
                <>
                  <CheckCircle className="w-4 h-4 mr-2" /> Verified!
                </>
              ) : submitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Verifying...
                </>
              ) : (
                "Verify Email"
              )}
            </Button>

            <div className="text-center text-sm text-gray-600">
              Didn't receive the code?{" "}
              {secondsLeft > 0 ? (
                <span className="text-gray-400">
                  Resend in {secondsLeft}s
                </span>
              ) : (
                <button
                  onClick={handleResend}
                  disabled={resending}
                  className="text-saffron-600 font-semibold hover:underline inline-flex items-center"
                >
                  {resending ? (
                    <>
                      <Loader2 className="w-3 h-3 mr-1 animate-spin" /> Sending...
                    </>
                  ) : (
                    <>
                      <RefreshCw className="w-3 h-3 mr-1" /> Resend code
                    </>
                  )}
                </button>
              )}
            </div>

            <p className="text-xs text-center text-gray-500">
              Wrong email?{" "}
              <Link to="/register" className="text-saffron-600 hover:underline">
                Sign up again
              </Link>
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}

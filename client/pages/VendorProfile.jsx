import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  MapPin,
  Save,
  Loader2,
  Store,
} from "lucide-react";
import AppHeader from "@/components/AppHeader";
import ProfilePhoto from "@/components/ProfilePhoto";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

export default function VendorProfile() {
  const { user, updateProfile } = useAuth();
  const { toast } = useToast();
  const [form, setForm] = useState({
    name: "",
    phone: "",
    address: "",
    businessName: "",
  });
  const [saving, setSaving] = useState(false);
  const [profileImage, setProfileImage] = useState("");

  useEffect(() => {
    if (user) {
      setForm({
        name: user.name || "",
        phone: user.phone || "",
        address: user.address || "",
        businessName: user.businessName || "",
      });
    }
    setProfileImage(localStorage.getItem("profileImage") || "");
  }, [user]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateProfile(form);
      toast({ title: "Profile updated" });
    } catch (e) {
      toast({ title: "Save failed", description: e.message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <AppHeader title="Profile" />
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link
          to="/vendor/dashboard"
          className="inline-flex items-center text-sm text-gray-600 hover:text-saffron-600 mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-1" /> Back to dashboard
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="mb-6 overflow-hidden">
            <div className="h-24 bg-gradient-to-r from-saffron-500 to-orange-500" />
            <CardContent className="pt-0 pb-6">
              <div className="flex items-end gap-4 -mt-12 mb-4">
                <div className="ring-4 ring-white rounded-full">
                  <ProfilePhoto
                    currentImage={profileImage}
                    userName={user?.name || "Vendor"}
                    size="lg"
                    onImageChange={(url) => {
                      setProfileImage(url);
                      if (url) localStorage.setItem("profileImage", url);
                    }}
                  />
                </div>
                <div className="pb-2">
                  <h1 className="text-2xl font-bold">{user?.name}</h1>
                  <Badge className="bg-saffron-100 text-saffron-700">Vendor</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Personal Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name" className="flex items-center gap-1">
                    <User className="w-3 h-3" /> Name
                  </Label>
                  <Input
                    id="name"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="email" className="flex items-center gap-1">
                    <Mail className="w-3 h-3" /> Email
                  </Label>
                  <Input id="email" value={user?.email || ""} disabled />
                </div>
                <div>
                  <Label htmlFor="phone" className="flex items-center gap-1">
                    <Phone className="w-3 h-3" /> Phone
                  </Label>
                  <Input
                    id="phone"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    placeholder="+91 ..."
                  />
                </div>
                <div>
                  <Label htmlFor="biz" className="flex items-center gap-1">
                    <Store className="w-3 h-3" /> Business Name
                  </Label>
                  <Input
                    id="biz"
                    value={form.businessName}
                    onChange={(e) =>
                      setForm({ ...form, businessName: e.target.value })
                    }
                    placeholder="e.g. Rajesh Chaat Corner"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="addr" className="flex items-center gap-1">
                  <MapPin className="w-3 h-3" /> Address
                </Label>
                <Textarea
                  id="addr"
                  rows={3}
                  value={form.address}
                  onChange={(e) => setForm({ ...form, address: e.target.value })}
                  placeholder="Shop/stall location, area, city, pincode"
                />
              </div>
              <Button
                onClick={handleSave}
                disabled={saving}
                className="bg-gradient-to-r from-saffron-500 to-orange-500"
              >
                {saving ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" /> Save Changes
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}

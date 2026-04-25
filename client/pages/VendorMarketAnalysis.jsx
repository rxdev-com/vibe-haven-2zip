import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, TrendingUp, Loader2, Star, Package } from "lucide-react";
import AppHeader from "@/components/AppHeader";
import { useToast } from "@/hooks/use-toast";
import { materialsAPI } from "@/lib/api";

export default function VendorMarketAnalysis() {
  const { toast } = useToast();
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    materialsAPI
      .getAll({ limit: 200, isActive: true })
      .then((d) => setMaterials(d.materials || []))
      .catch((e) =>
        toast({ title: "Could not load", description: e.message, variant: "destructive" }),
      )
      .finally(() => setLoading(false));
  }, [toast]);

  const analysis = useMemo(() => {
    const byCat = {};
    materials.forEach((m) => {
      if (!byCat[m.category])
        byCat[m.category] = { count: 0, totalPrice: 0, items: [] };
      byCat[m.category].count++;
      byCat[m.category].totalPrice += m.price || 0;
      byCat[m.category].items.push(m);
    });
    const categories = Object.entries(byCat).map(([name, d]) => ({
      name,
      count: d.count,
      avgPrice: d.totalPrice / d.count,
      items: d.items,
    }));
    const topRated = [...materials]
      .filter((m) => (m.rating || 0) > 0)
      .sort((a, b) => (b.rating || 0) - (a.rating || 0))
      .slice(0, 5);
    return { categories, topRated };
  }, [materials]);

  return (
    <div className="min-h-screen bg-gray-50">
      <AppHeader title="Market Insights" />
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link
          to="/vendor/dashboard"
          className="inline-flex items-center text-sm text-gray-600 hover:text-saffron-600 mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-1" /> Back
        </Link>

        <motion.h1
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 flex items-center gap-2"
        >
          <TrendingUp className="w-7 h-7 text-emerald-500" /> Market Insights
        </motion.h1>

        {loading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
          </div>
        ) : (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">By Category</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid sm:grid-cols-2 gap-3">
                  {analysis.categories.map((c, i) => (
                    <motion.div
                      key={c.name}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.04 }}
                      className="border rounded-lg p-4 hover:border-saffron-300 transition-colors"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold">{c.name}</h3>
                        <Badge variant="outline">{c.count} items</Badge>
                      </div>
                      <p className="text-sm text-gray-600">
                        Avg price:{" "}
                        <span className="font-semibold text-saffron-600">
                          ₹{Math.round(c.avgPrice)}
                        </span>
                      </p>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Top Rated Products</CardTitle>
              </CardHeader>
              <CardContent>
                {analysis.topRated.length === 0 ? (
                  <p className="text-center text-gray-500 py-6">
                    No ratings yet
                  </p>
                ) : (
                  <div className="space-y-2">
                    {analysis.topRated.map((m, i) => (
                      <Link to={`/material/${m._id}`} key={m._id}>
                        <motion.div
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.05 }}
                          className="flex items-center justify-between p-3 rounded-lg border hover:border-emerald-300 hover:shadow-sm transition-all"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <Package className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                            <div className="min-w-0">
                              <p className="font-medium truncate">{m.name}</p>
                              <p className="text-xs text-gray-500">
                                ₹{m.price}/{m.unit}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-1 flex-shrink-0">
                            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                            <span className="font-semibold text-sm">
                              {(m.rating || 0).toFixed(1)}
                            </span>
                          </div>
                        </motion.div>
                      </Link>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}

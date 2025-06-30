
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Loader2, Search, TrendingUp, TrendingDown, Minus, Home, MapPin, Bed } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const PropertyTracker = () => {
  const [selectedProperty, setSelectedProperty] = useState("");
  const [bedrooms, setBedrooms] = useState("");
  const [webhookUrl, setWebhookUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState(null);
  const { toast } = useToast();

  // Predefined property list
  const predefinedProperties = [
    "Luxury Downtown Apartments",
    "Riverside Condominiums", 
    "Garden View Townhouses",
    "Metropolitan Heights",
    "Sunset Villa Complex",
    "Oceanfront Residences",
    "City Center Lofts",
    "Hillside Manor",
    "Parkside Estates",
    "Waterfront Towers",
    "Green Valley Homes",
    "Executive Suites",
    "Penthouse Collection",
    "Suburban Retreat",
    "Urban Living Complex"
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedProperty || !bedrooms || !webhookUrl) {
      toast({
        title: "Missing Information",
        description: "Please fill in all fields including the n8n webhook URL",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    console.log("Sending data to n8n webhook:", { selectedProperty, bedrooms, webhookUrl });

    try {
      const response = await fetch(webhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          propertyName: selectedProperty,
          bedrooms: parseInt(bedrooms),
          timestamp: new Date().toISOString(),
          requestSource: "Competitor Price Tracker"
        }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Response from n8n:", data);
        
        // Simulate AI-powered competitor analysis results
        const mockResults = {
          propertyName: selectedProperty,
          bedrooms: parseInt(bedrooms),
          averagePrice: Math.round(Math.random() * 500000 + 300000),
          competitorCount: Math.floor(Math.random() * 15) + 5,
          priceRange: {
            min: Math.round(Math.random() * 200000 + 250000),
            max: Math.round(Math.random() * 300000 + 600000)
          },
          marketTrend: Math.random() > 0.5 ? "up" : "down",
          trendPercentage: Math.round(Math.random() * 15) + 1,
          topCompetitors: [
            { name: "Premium Properties Ltd", price: Math.round(Math.random() * 100000 + 400000) },
            { name: "Elite Real Estate", price: Math.round(Math.random() * 100000 + 350000) },
            { name: "Prime Locations Inc", price: Math.round(Math.random() * 100000 + 380000) }
          ],
          insights: [
            "Your pricing is competitive within the market range",
            "Consider adjusting rates during peak season",
            "Location premium applies for waterfront views",
            "Market shows strong demand for this property type"
          ],
          ...data
        };
        
        setResults(mockResults);
        toast({
          title: "Analysis Complete!",
          description: "AI-powered competitor analysis has been generated successfully.",
        });
      } else {
        throw new Error("Failed to get response from webhook");
      }
    } catch (error) {
      console.error("Error calling n8n webhook:", error);
      toast({
        title: "Connection Error",
        description: "Failed to connect to n8n webhook. Please check your URL and try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <section className="py-12 px-4 sm:px-6 lg:px-8 bg-white/30">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Start Your Price Analysis
          </h2>
          <p className="text-lg text-gray-600">
            Select your property and get instant competitor insights
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Input Form */}
          <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-t-lg">
              <CardTitle className="flex items-center space-x-2">
                <Search className="h-5 w-5 text-blue-600" />
                <span>Property Analysis Form</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="property" className="text-sm font-medium text-gray-700 flex items-center space-x-2">
                    <Home className="h-4 w-4" />
                    <span>Select Property</span>
                  </Label>
                  <Select value={selectedProperty} onValueChange={setSelectedProperty}>
                    <SelectTrigger className="w-full h-12 border-2 border-gray-200 focus:border-blue-500 transition-colors">
                      <SelectValue placeholder="Choose from predefined properties..." />
                    </SelectTrigger>
                    <SelectContent className="max-h-60 bg-white border border-gray-200 shadow-lg">
                      {predefinedProperties.map((property) => (
                        <SelectItem key={property} value={property} className="hover:bg-blue-50">
                          <div className="flex items-center space-x-2">
                            <MapPin className="h-4 w-4 text-gray-400" />
                            <span>{property}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bedrooms" className="text-sm font-medium text-gray-700 flex items-center space-x-2">
                    <Bed className="h-4 w-4" />
                    <span>Number of Bedrooms</span>
                  </Label>
                  <Select value={bedrooms} onValueChange={setBedrooms}>
                    <SelectTrigger className="w-full h-12 border-2 border-gray-200 focus:border-blue-500 transition-colors">
                      <SelectValue placeholder="Select bedroom count..." />
                    </SelectTrigger>
                    <SelectContent className="bg-white border border-gray-200 shadow-lg">
                      {[1, 2, 3, 4, 5, 6].map((num) => (
                        <SelectItem key={num} value={num.toString()} className="hover:bg-blue-50">
                          {num} {num === 1 ? 'Bedroom' : 'Bedrooms'}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="webhook" className="text-sm font-medium text-gray-700">
                    n8n Webhook URL
                  </Label>
                  <Input
                    id="webhook"
                    type="url"
                    value={webhookUrl}
                    onChange={(e) => setWebhookUrl(e.target.value)}
                    placeholder="https://your-n8n-instance.com/webhook/..."
                    className="h-12 border-2 border-gray-200 focus:border-blue-500 transition-colors"
                  />
                  <p className="text-xs text-gray-500">
                    Enter your n8n webhook URL to receive and process the analysis data
                  </p>
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium rounded-lg transition-all duration-200 transform hover:scale-[1.02]"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Analyzing Competitors...
                    </>
                  ) : (
                    <>
                      <Search className="mr-2 h-4 w-4" />
                      Start AI Analysis
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Results Display */}
          <div className="space-y-6">
            {results ? (
              <>
                <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
                  <CardHeader className="bg-gradient-to-r from-green-50 to-blue-50 rounded-t-lg">
                    <CardTitle className="flex items-center justify-between">
                      <span>Analysis Results</span>
                      <Badge variant="secondary" className="bg-green-100 text-green-700">
                        AI Powered
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div className="text-center p-4 bg-blue-50 rounded-lg">
                        <p className="text-sm text-gray-600">Average Price</p>
                        <p className="text-2xl font-bold text-blue-600">
                          {formatPrice(results.averagePrice)}
                        </p>
                      </div>
                      <div className="text-center p-4 bg-purple-50 rounded-lg">
                        <p className="text-sm text-gray-600">Competitors Found</p>
                        <p className="text-2xl font-bold text-purple-600">
                          {results.competitorCount}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium text-gray-900">Market Trend</p>
                          <p className="text-sm text-gray-600">
                            {results.trendPercentage}% {results.marketTrend === 'up' ? 'increase' : 'decrease'} this month
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          {results.marketTrend === 'up' ? (
                            <TrendingUp className="h-6 w-6 text-green-500" />
                          ) : (
                            <TrendingDown className="h-6 w-6 text-red-500" />
                          )}
                        </div>
                      </div>

                      <div className="p-4 bg-yellow-50 rounded-lg">
                        <p className="font-medium text-gray-900 mb-2">Price Range</p>
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-gray-600">
                            Min: {formatPrice(results.priceRange.min)}
                          </span>
                          <Minus className="h-4 w-4 text-gray-400" />
                          <span className="text-sm font-medium text-gray-600">
                            Max: {formatPrice(results.priceRange.max)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle>Top Competitors</CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="space-y-3">
                      {results.topCompetitors.map((competitor, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <span className="font-medium text-gray-900">{competitor.name}</span>
                          <span className="font-bold text-blue-600">{formatPrice(competitor.price)}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle>AI Insights</CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="space-y-3">
                      {results.insights.map((insight, index) => (
                        <div key={index} className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg">
                          <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                          <p className="text-sm text-gray-700">{insight}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </>
            ) : (
              <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
                <CardContent className="p-12 text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Search className="h-8 w-8 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Ready for Analysis
                  </h3>
                  <p className="text-gray-600">
                    Fill out the form on the left to start your AI-powered competitor price analysis
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default PropertyTracker;

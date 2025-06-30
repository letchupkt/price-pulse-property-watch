
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Loader2, Search, FileText, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const PropertyTracker = () => {
  const [selectedProperty, setSelectedProperty] = useState("");
  const [bedrooms, setBedrooms] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState(null);
  const { toast } = useToast();

  // Fixed webhook URL (hidden from user)
  const webhookUrl = "http://localhost:5678/webhook-test/input";

  // Limited predefined properties
  const predefinedProperties = [
    "Changi Court",
    "Changi Green"
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedProperty || !bedrooms) {
      toast({
        title: "Missing Information",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    // Format data as plain text: "property_name X bedrooms"
    const plainTextData = `${selectedProperty} ${bedrooms} bedrooms`;
    console.log("Sending plain text data to n8n webhook:", plainTextData);

    try {
      const response = await fetch(webhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "text/plain",
        },
        body: plainTextData,
      });

      if (response.ok) {
        const data = await response.text();
        console.log("Response from n8n:", data);
        
        // Check if we have actual data
        if (data && data.trim() !== "" && !data.includes("Data not exists")) {
          setResults({
            propertyName: selectedProperty,
            bedrooms: parseInt(bedrooms),
            rawResponse: data,
            hasData: true
          });
          toast({
            title: "Analysis Complete!",
            description: "Property analysis has been retrieved successfully.",
          });
        } else {
          setResults({
            propertyName: selectedProperty,
            bedrooms: parseInt(bedrooms),
            rawResponse: data || "No data available for this property configuration.",
            hasData: false
          });
          toast({
            title: "No Data Found",
            description: "No analysis data exists for the selected property configuration.",
            variant: "destructive",
          });
        }
      } else {
        throw new Error("Failed to get response from webhook");
      }
    } catch (error) {
      console.error("Error calling n8n webhook:", error);
      toast({
        title: "Connection Error",
        description: "Failed to connect to n8n webhook. Please check your connection and try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const formatMarkdownContent = (content: string) => {
    // Split content into sections and format for better display
    const sections = content.split('---').filter(section => section.trim() !== '');
    
    return sections.map((section, index) => {
      const lines = section.split('\n').filter(line => line.trim() !== '');
      
      return (
        <div key={index} className="mb-6 p-4 bg-gray-50 rounded-lg">
          {lines.map((line, lineIndex) => {
            const trimmedLine = line.trim();
            
            // Handle headers
            if (trimmedLine.startsWith('####')) {
              return <h4 key={lineIndex} className="text-lg font-semibold text-blue-700 mb-2">{trimmedLine.replace('####', '').trim()}</h4>;
            }
            if (trimmedLine.startsWith('###')) {
              return <h3 key={lineIndex} className="text-xl font-bold text-blue-800 mb-3">{trimmedLine.replace('###', '').trim()}</h3>;
            }
            
            // Handle bold text
            if (trimmedLine.startsWith('**') && trimmedLine.endsWith('**')) {
              return <p key={lineIndex} className="font-semibold text-gray-800 mb-2">{trimmedLine.replace(/\*\*/g, '')}</p>;
            }
            
            // Handle bullet points
            if (trimmedLine.startsWith('- ')) {
              return <li key={lineIndex} className="ml-4 text-gray-700 mb-1 list-disc">{trimmedLine.replace('- ', '')}</li>;
            }
            
            // Handle numbered lists
            if (/^\d+\./.test(trimmedLine)) {
              return <p key={lineIndex} className="font-medium text-gray-800 mb-2">{trimmedLine}</p>;
            }
            
            // Regular paragraphs
            if (trimmedLine.length > 0) {
              return <p key={lineIndex} className="text-gray-700 mb-2 leading-relaxed">{trimmedLine}</p>;
            }
            
            return null;
          })}
        </div>
      );
    });
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
                  <Label htmlFor="property" className="text-sm font-medium text-gray-700">
                    Select Property
                  </Label>
                  <Select value={selectedProperty} onValueChange={setSelectedProperty}>
                    <SelectTrigger className="w-full h-12 border-2 border-gray-200 focus:border-blue-500 transition-colors">
                      <SelectValue placeholder="Choose from available properties..." />
                    </SelectTrigger>
                    <SelectContent className="max-h-60 bg-white border border-gray-200 shadow-lg">
                      {predefinedProperties.map((property) => (
                        <SelectItem key={property} value={property} className="hover:bg-blue-50">
                          {property}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bedrooms" className="text-sm font-medium text-gray-700">
                    Number of Bedrooms
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

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium rounded-lg transition-all duration-200 transform hover:scale-[1.02]"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Analyzing Property...
                    </>
                  ) : (
                    <>
                      <Search className="mr-2 h-4 w-4" />
                      Start Analysis
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Results Display */}
          <div className="space-y-6">
            {results ? (
              <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
                <CardHeader className="bg-gradient-to-r from-green-50 to-blue-50 rounded-t-lg">
                  <CardTitle className="flex items-center justify-between">
                    <span>Analysis Results</span>
                    <Badge variant={results.hasData ? "default" : "destructive"} className={results.hasData ? "bg-green-100 text-green-700" : ""}>
                      {results.hasData ? (
                        <>
                          <FileText className="h-4 w-4 mr-1" />
                          Data Available
                        </>
                      ) : (
                        <>
                          <AlertCircle className="h-4 w-4 mr-1" />
                          No Data
                        </>
                      )}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                    <p className="text-sm text-gray-600">
                      <strong>Property:</strong> {results.propertyName} ({results.bedrooms} {results.bedrooms === 1 ? 'bedroom' : 'bedrooms'})
                    </p>
                  </div>
                  
                  {results.hasData ? (
                    <div className="prose prose-sm max-w-none">
                      {formatMarkdownContent(results.rawResponse)}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600 mb-2">No analysis data available</p>
                      <p className="text-sm text-gray-500">{results.rawResponse}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
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
                    Fill out the form on the left to start your property analysis
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

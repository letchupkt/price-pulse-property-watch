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

  const parseAndFormatResponse = (content: string) => {
    try {
      // Try to parse as JSON first
      const jsonData = JSON.parse(content);
      if (jsonData && jsonData[0] && jsonData[0].output) {
        return formatAnalysisContent(jsonData[0].output);
      }
    } catch (e) {
      // If not JSON, treat as plain text
      return formatAnalysisContent(content);
    }
    
    return formatAnalysisContent(content);
  };

  const formatAnalysisContent = (content: string) => {
    // Clean up the content by removing unwanted characters and normalizing spacing
    let cleanContent = content
      .replace(/\\n/g, '\n')           // Replace literal \n with actual newlines
      .replace(/\n\s*\n\s*\n/g, '\n\n') // Normalize multiple newlines to double newlines
      .replace(/^\s+|\s+$/g, '')       // Trim leading/trailing whitespace
      .replace(/\t/g, '    ');         // Replace tabs with 4 spaces

    const sections = cleanContent.split(/---+/).filter(section => section.trim() !== '');
    
    return sections.map((section, sectionIndex) => {
      const lines = section.split('\n').filter(line => line.trim() !== '');
      
      return (
        <div key={sectionIndex} className="mb-8 last:mb-0">
          {lines.map((line, lineIndex) => {
            const trimmedLine = line.trim();
            
            // Skip empty lines
            if (!trimmedLine) return null;
            
            // Handle main headers (###)
            if (trimmedLine.startsWith('### ')) {
              return (
                <h2 key={lineIndex} className="text-2xl font-bold text-blue-900 mb-4 mt-6 first:mt-0 border-b-2 border-blue-200 pb-2">
                  {trimmedLine.replace(/^###\s*/, '')}
                </h2>
              );
            }
            
            // Handle sub headers (####)
            if (trimmedLine.startsWith('#### ')) {
              return (
                <h3 key={lineIndex} className="text-xl font-semibold text-blue-800 mb-3 mt-5 first:mt-0">
                  {trimmedLine.replace(/^####\s*/, '')}
                </h3>
              );
            }
            
            // Handle smaller headers (#####)
            if (trimmedLine.startsWith('##### ')) {
              return (
                <h4 key={lineIndex} className="text-lg font-medium text-blue-700 mb-2 mt-4 first:mt-0">
                  {trimmedLine.replace(/^#####\s*/, '')}
                </h4>
              );
            }
            
            // Handle bold text (**text**)
            if (trimmedLine.match(/^\*\*.*\*\*:?\s*$/)) {
              return (
                <div key={lineIndex} className="font-bold text-gray-900 mb-3 mt-4 first:mt-0 bg-gray-50 p-3 rounded-lg border-l-4 border-blue-500">
                  {trimmedLine.replace(/\*\*/g, '')}
                </div>
              );
            }
            
            // Handle bullet points
            if (trimmedLine.startsWith('- ')) {
              return (
                <li key={lineIndex} className="ml-6 text-gray-700 mb-2 list-disc leading-relaxed">
                  {trimmedLine.replace(/^-\s*/, '')}
                </li>
              );
            }
            
            // Handle numbered lists
            if (/^\d+\.\s/.test(trimmedLine)) {
              return (
                <div key={lineIndex} className="font-medium text-gray-800 mb-3 pl-4 border-l-2 border-gray-300">
                  {trimmedLine}
                </div>
              );
            }
            
            // Handle special formatting patterns
            if (trimmedLine.includes(':') && trimmedLine.length < 100) {
              const [label, ...valueParts] = trimmedLine.split(':');
              const value = valueParts.join(':').trim();
              
              return (
                <div key={lineIndex} className="mb-2 p-2 bg-blue-50 rounded border-l-4 border-blue-300">
                  <span className="font-semibold text-blue-900">{label.trim()}:</span>
                  <span className="text-gray-700 ml-2">{value}</span>
                </div>
              );
            }
            
            // Regular paragraphs
            return (
              <p key={lineIndex} className="text-gray-700 mb-3 leading-relaxed text-justify">
                {trimmedLine}
              </p>
            );
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
                  <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200">
                    <p className="text-sm text-gray-700 font-medium">
                      <span className="text-blue-800">Property:</span> {results.propertyName} 
                      <span className="mx-2">•</span>
                      <span className="text-blue-800">Bedrooms:</span> {results.bedrooms}
                    </p>
                  </div>
                  
                  {results.hasData ? (
                    <div className="prose prose-sm max-w-none bg-white rounded-lg p-6 shadow-inner border border-gray-100">
                      {parseAndFormatResponse(results.rawResponse)}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <AlertCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-gray-700 mb-2">No Analysis Data Available</h3>
                      <p className="text-gray-500 max-w-md mx-auto">{results.rawResponse}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ) : (
              <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
                <CardContent className="p-12 text-center">
                  <div className="w-20 h-20 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Search className="h-10 w-10 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    Ready for Analysis
                  </h3>
                  <p className="text-gray-600 max-w-md mx-auto">
                    Fill out the form on the left to start your comprehensive property analysis and get detailed competitor insights.
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

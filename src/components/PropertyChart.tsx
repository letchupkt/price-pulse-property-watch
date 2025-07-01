
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { useToast } from "@/hooks/use-toast";
import { Loader2, TrendingUp, RefreshCw } from "lucide-react";

interface PropertyData {
  property_id: string;
  dates: string[];
  rent: (number | null)[];
  rate_psf: (number | null)[];
}

interface ChartData {
  date: string;
  [key: string]: string | number | null;
}

const PropertyChart = () => {
  const [rentChartData, setRentChartData] = useState<ChartData[]>([]);
  const [ratePsfChartData, setRatePsfChartData] = useState<ChartData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [chartType, setChartType] = useState<"rent" | "rate_psf" | "both">("both");
  const [inputValue, setInputValue] = useState("");
  const { toast } = useToast();

  // Webhook URL
  const webhookUrl = "https://rajigenzi.app.n8n.cloud/webhook-test/input";

  // Generate dynamic colors for properties
  const generateColors = (count: number) => {
    const colors = [
      "#3b82f6", "#ef4444", "#10b981", "#f59e0b", "#8b5cf6", 
      "#06b6d4", "#84cc16", "#f97316", "#ec4899", "#6366f1",
      "#14b8a6", "#eab308", "#dc2626", "#059669", "#7c3aed"
    ];
    
    if (count <= colors.length) {
      return colors.slice(0, count);
    }
    
    // Generate additional colors if needed
    const additionalColors = [];
    for (let i = colors.length; i < count; i++) {
      const hue = (i * 137.508) % 360; // Golden angle approximation
      additionalColors.push(`hsl(${hue}, 70%, 50%)`);
    }
    
    return [...colors, ...additionalColors];
  };

  // Generate placeholder dates if dates array is empty
  const generatePlaceholderDates = (dataLength: number) => {
    const dates = [];
    const today = new Date();
    for (let i = dataLength - 1; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      dates.push(date.toISOString().split('T')[0]);
    }
    return dates;
  };

  // Process the JSON data and create chart data
  const processData = (data: PropertyData[]) => {
    console.log("Processing data:", data);
    
    if (data.length === 0) {
      setRentChartData([]);
      setRatePsfChartData([]);
      return;
    }

    // Determine dates to use - either from data or generate placeholders
    let datesArray: string[] = [];
    const firstProperty = data[0];
    
    if (firstProperty.dates && firstProperty.dates.length > 0) {
      // Use dates from the data
      const allDates = new Set<string>();
      data.forEach(property => {
        property.dates.forEach(date => allDates.add(date));
      });
      datesArray = Array.from(allDates).sort();
    } else {
      // Generate placeholder dates based on data length
      const maxDataLength = Math.max(...data.map(p => Math.max(p.rent.length, p.rate_psf.length)));
      datesArray = generatePlaceholderDates(maxDataLength);
    }

    // Create rent chart data
    const rentData: ChartData[] = datesArray.map((date, index) => {
      const dataPoint: ChartData = { date };
      
      data.forEach(property => {
        if (property.rent[index] !== null && property.rent[index] !== undefined) {
          dataPoint[`Property_${property.property_id}`] = property.rent[index];
        }
      });
      
      return dataPoint;
    });

    // Create rate_psf chart data
    const ratePsfData: ChartData[] = datesArray.map((date, index) => {
      const dataPoint: ChartData = { date };
      
      data.forEach(property => {
        if (property.rate_psf[index] !== null && property.rate_psf[index] !== undefined) {
          dataPoint[`Property_${property.property_id}`] = property.rate_psf[index];
        }
      });
      
      return dataPoint;
    });

    setRentChartData(rentData);
    setRatePsfChartData(ratePsfData);
  };

  // Fetch data from n8n webhook
  const fetchData = async (input: string = "") => {
    setIsLoading(true);
    
    try {
      console.log("Sending request to n8n webhook:", { input });
      
      const response = await fetch(webhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ input: input.trim() }),
      });

      if (response.ok) {
        const responseData = await response.json();
        console.log("Response from n8n:", responseData);
        
        // Handle different response formats
        let propertyData: PropertyData[] = [];
        
        if (Array.isArray(responseData) && responseData.length > 0) {
          if (responseData[0].data && Array.isArray(responseData[0].data)) {
            propertyData = responseData[0].data;
          } else if (responseData[0] && typeof responseData[0] === 'object') {
            propertyData = responseData;
          }
        } else if (responseData.data && Array.isArray(responseData.data)) {
          propertyData = responseData.data;
        } else if (Array.isArray(responseData)) {
          propertyData = responseData;
        }

        if (propertyData.length > 0) {
          processData(propertyData);
          toast({
            title: "Success",
            description: `Chart data loaded successfully with ${propertyData.length} properties`,
          });
        } else {
          toast({
            title: "No Data",
            description: "No property data found in the response",
            variant: "destructive",
          });
        }
      } else {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
    } catch (error) {
      console.error('Error fetching data from n8n webhook:', error);
      toast({
        title: "Error",
        description: "Failed to fetch data from webhook. Please check the connection.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Auto-fetch data on component mount
  useEffect(() => {
    fetchData();
  }, []);

  // Get chart lines for rent data
  const getRentChartLines = () => {
    if (rentChartData.length === 0) return [];

    const propertyKeys = Object.keys(rentChartData[0]).filter(key => key !== 'date');
    const colors = generateColors(propertyKeys.length);

    return propertyKeys.map((key, index) => (
      <Line
        key={key}
        type="monotone"
        dataKey={key}
        stroke={colors[index]}
        strokeWidth={2}
        dot={{ r: 4 }}
        name={key.replace('Property_', 'Property ')}
        connectNulls={false}
      />
    ));
  };

  // Get chart lines for rate_psf data
  const getRatePsfChartLines = () => {
    if (ratePsfChartData.length === 0) return [];

    const propertyKeys = Object.keys(ratePsfChartData[0]).filter(key => key !== 'date');
    const colors = generateColors(propertyKeys.length);

    return propertyKeys.map((key, index) => (
      <Line
        key={key}
        type="monotone"
        dataKey={key}
        stroke={colors[index]}
        strokeWidth={2}
        dot={{ r: 4 }}
        name={key.replace('Property_', 'Property ')}
        connectNulls={false}
      />
    ));
  };

  const chartConfig = {
    rent: {
      label: "Rent (SGD)",
      color: "#3b82f6",
    },
    rate_psf: {
      label: "Rate per sqft (SGD)",
      color: "#ef4444",
    },
  };

  return (
    <section className="py-12 px-4 sm:px-6 lg:px-8 bg-white/30">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Property Data Visualization
          </h2>
          <p className="text-lg text-gray-600">
            Real-time rent and rate per sqft trends from n8n webhook
          </p>
        </div>

        <div className="grid gap-8">
          {/* Controls */}
          <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-t-lg">
              <CardTitle className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5 text-blue-600" />
                <span>Chart Controls</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="space-y-2">
                <Label htmlFor="inputValue" className="text-sm font-medium text-gray-700">
                  Input (Optional)
                </Label>
                <Input
                  id="inputValue"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Enter optional input parameter..."
                  className="w-full h-12 border-2 border-gray-200 focus:border-blue-500 transition-colors"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="chartType" className="text-sm font-medium text-gray-700">
                  Chart Type
                </Label>
                <Select value={chartType} onValueChange={(value: "rent" | "rate_psf" | "both") => setChartType(value)}>
                  <SelectTrigger className="w-full h-12 border-2 border-gray-200 focus:border-blue-500 transition-colors">
                    <SelectValue placeholder="Select chart type..." />
                  </SelectTrigger>
                  <SelectContent className="bg-white border border-gray-200 shadow-lg">
                    <SelectItem value="both" className="hover:bg-blue-50">Both Charts</SelectItem>
                    <SelectItem value="rent" className="hover:bg-blue-50">Rent Only</SelectItem>
                    <SelectItem value="rate_psf" className="hover:bg-blue-50">Rate per sqft Only</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex gap-4">
                <Button
                  onClick={() => fetchData(inputValue)}
                  disabled={isLoading}
                  className="flex-1 h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium rounded-lg transition-all duration-200 transform hover:scale-[1.02]"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Loading...
                    </>
                  ) : (
                    <>
                      <TrendingUp className="mr-2 h-4 w-4" />
                      Fetch Data
                    </>
                  )}
                </Button>
                
                <Button
                  onClick={() => fetchData()}
                  disabled={isLoading}
                  variant="outline"
                  className="h-12 px-6 border-2 border-gray-200 hover:border-blue-500 transition-colors"
                >
                  <RefreshCw className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Rent Chart */}
          {(chartType === "rent" || chartType === "both") && (
            <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader className="bg-gradient-to-r from-green-50 to-blue-50 rounded-t-lg">
                <CardTitle>Rent Trends Over Time (SGD/month)</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                {rentChartData.length > 0 ? (
                  <ChartContainer config={chartConfig} className="h-96 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={rentChartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                        <XAxis 
                          dataKey="date" 
                          tick={{ fontSize: 12 }}
                          angle={-45}
                          textAnchor="end"
                          height={60}
                        />
                        <YAxis tick={{ fontSize: 12 }} />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Legend />
                        {getRentChartLines()}
                      </LineChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                ) : (
                  <div className="h-96 flex items-center justify-center">
                    <div className="text-center">
                      <TrendingUp className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-gray-700 mb-2">
                        No Rent Data
                      </h3>
                      <p className="text-gray-500">
                        Click "Fetch Data" to load rent trends from webhook
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Rate per sqft Chart */}
          {(chartType === "rate_psf" || chartType === "both") && (
            <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-t-lg">
                <CardTitle>Rate per Sqft Trends Over Time (SGD/sqft)</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                {ratePsfChartData.length > 0 ? (
                  <ChartContainer config={chartConfig} className="h-96 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={ratePsfChartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                        <XAxis 
                          dataKey="date" 
                          tick={{ fontSize: 12 }}
                          angle={-45}
                          textAnchor="end"
                          height={60}
                        />
                        <YAxis tick={{ fontSize: 12 }} />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Legend />
                        {getRatePsfChartLines()}
                      </LineChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                ) : (
                  <div className="h-96 flex items-center justify-center">
                    <div className="text-center">
                      <TrendingUp className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-gray-700 mb-2">
                        No Rate per Sqft Data
                      </h3>
                      <p className="text-gray-500">
                        Click "Fetch Data" to load rate per sqft trends from webhook
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </section>
  );
};

export default PropertyChart;

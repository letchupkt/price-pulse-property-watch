
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Loader2, TrendingUp } from "lucide-react";

interface ChartData {
  date: string;
  [key: string]: string | number;
}

interface PropertyData {
  property: string;
  rentData: Array<{ date: string; value: number }>;
  rateData: Array<{ date: string; value: number }>;
}

const PropertyChart = () => {
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [propertyColumns, setPropertyColumns] = useState<string[]>([]);
  const [selectedProperty, setSelectedProperty] = useState("");
  const [bedrooms, setBedrooms] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [chartType, setChartType] = useState<"rent" | "rate" | "both">("both");
  const { toast } = useToast();

  // Predefined properties matching PropertyTracker
  const predefinedProperties = [
    "Changi Court",
    "Changi Green"
  ];

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

  // Fetch available property columns from rent_data table
  const fetchPropertyColumns = async () => {
    try {
      const { data, error } = await supabase
        .from('rent_data')
        .select('*')
        .limit(1);

      if (error) throw error;

      if (data && data.length > 0) {
        const columns = Object.keys(data[0]).filter(key => 
          key.startsWith('url_') && key !== 'date'
        );
        setPropertyColumns(columns);
      }
    } catch (error) {
      console.error('Error fetching property columns:', error);
      toast({
        title: "Error",
        description: "Failed to fetch available properties",
        variant: "destructive",
      });
    }
  };

  // Fetch data for charts
  const fetchChartData = async () => {
    if (!selectedProperty && !bedrooms) {
      toast({
        title: "Missing Selection",
        description: "Please select a property or bedroom count",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      let rentData = [];
      let rateData = [];

      if (selectedProperty) {
        // Check if it's a predefined property name or URL-based property
        if (predefinedProperties.includes(selectedProperty)) {
          // Handle predefined properties by searching rent_track table
          const { data: trackResults, error: trackError } = await supabase
            .from('rent_track')
            .select('*')
            .eq('property_name', selectedProperty);

          if (trackError) throw trackError;

          // Transform rent_track data to chart format
          if (trackResults && trackResults.length > 0) {
            const dateColumns = Object.keys(trackResults[0]).filter(key => 
              key.match(/^\d{4}_\d{2}_\d{2}$/)
            );

            const transformedData: ChartData[] = [];
            dateColumns.forEach(dateCol => {
              const formattedDate = dateCol.replace(/_/g, '-');
              const dataPoint: ChartData = { date: formattedDate };

              trackResults.forEach((row, index) => {
                const propertyName = row.property_name || `Property ${index + 1}`;
                if (row[dateCol]) {
                  const value = parseFloat(row[dateCol]);
                  if (!isNaN(value)) {
                    dataPoint[`${propertyName}_rent`] = value;
                  }
                }
              });

              if (Object.keys(dataPoint).length > 1) {
                transformedData.push(dataPoint);
              }
            });

            setChartData(transformedData);
            setIsLoading(false);
            return;
          }
        } else {
          // Handle URL-based properties from rent_data and rate_psf tables
          // Fetch rent data
          const { data: rentResults, error: rentError } = await supabase
            .from('rent_data')
            .select(`date, ${selectedProperty}`)
            .not(selectedProperty, 'is', null)
            .order('date', { ascending: true });

          if (rentError) throw rentError;

          // Fetch rate data
          const { data: rateResults, error: rateError } = await supabase
            .from('rate_psf')
            .select(`date, ${selectedProperty}`)
            .not(selectedProperty, 'is', null)
            .order('date', { ascending: true });

          if (rateError) throw rateError;

          rentData = rentResults || [];
          rateData = rateResults || [];
        }
      } else if (bedrooms) {
        // Fetch from rent_track table based on bedrooms
        const { data: trackResults, error: trackError } = await supabase
          .from('rent_track')
          .select('*')
          .eq('bedrooms', parseInt(bedrooms));

        if (trackError) throw trackError;

        // Transform rent_track data to chart format
        if (trackResults && trackResults.length > 0) {
          const dateColumns = Object.keys(trackResults[0]).filter(key => 
            key.match(/^\d{4}_\d{2}_\d{2}$/)
          );

          const transformedData: ChartData[] = [];
          dateColumns.forEach(dateCol => {
            const formattedDate = dateCol.replace(/_/g, '-');
            const dataPoint: ChartData = { date: formattedDate };

            trackResults.forEach((row, index) => {
              const propertyName = row.property_name || `Property ${index + 1}`;
              if (row[dateCol]) {
                const value = parseFloat(row[dateCol]);
                if (!isNaN(value)) {
                  dataPoint[`${propertyName}_rent`] = value;
                }
              }
            });

            if (Object.keys(dataPoint).length > 1) {
              transformedData.push(dataPoint);
            }
          });

          setChartData(transformedData);
          setIsLoading(false);
          return;
        }
      }

      // Combine rent and rate data for URL-based properties
      const combinedData: ChartData[] = [];
      const allDates = new Set([
        ...rentData.map(item => item.date),
        ...rateData.map(item => item.date)
      ]);

      allDates.forEach(date => {
        if (date) {
          const rentItem = rentData.find(item => item.date === date);
          const rateItem = rateData.find(item => item.date === date);

          const dataPoint: ChartData = { date };

          if (rentItem && rentItem[selectedProperty]) {
            dataPoint[`${selectedProperty}_rent`] = rentItem[selectedProperty] as number;
          }

          if (rateItem && rateItem[selectedProperty]) {
            dataPoint[`${selectedProperty}_rate`] = parseFloat(rateItem[selectedProperty] as string) || 0;
          }

          if (Object.keys(dataPoint).length > 1) {
            combinedData.push(dataPoint);
          }
        }
      });

      combinedData.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
      setChartData(combinedData);

      if (combinedData.length === 0) {
        toast({
          title: "No Data Found",
          description: "No data available for the selected property",
          variant: "destructive",
        });
      }

    } catch (error) {
      console.error('Error fetching chart data:', error);
      toast({
        title: "Error",
        description: "Failed to fetch chart data",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPropertyColumns();
  }, []);

  // Get dynamic lines for the chart
  const getChartLines = () => {
    if (chartData.length === 0) return [];

    const lines = [];
    const colors = generateColors(propertyColumns.length * 2);
    let colorIndex = 0;

    // Get all property keys from data
    const propertyKeys = new Set<string>();
    chartData.forEach(item => {
      Object.keys(item).forEach(key => {
        if (key !== 'date') {
          propertyKeys.add(key);
        }
      });
    });

    propertyKeys.forEach(key => {
      const isRent = key.includes('_rent');
      const isRate = key.includes('_rate');

      if ((chartType === 'rent' && isRent) || 
          (chartType === 'rate' && isRate) || 
          (chartType === 'both')) {
        
        const displayName = key.replace(/_rent|_rate/, '').replace(/url_/, '');
        const suffix = isRent ? ' (Rent)' : isRate ? ' (Rate/sqft)' : '';
        
        lines.push(
          <Line
            key={key}
            type="monotone"
            dataKey={key}
            stroke={colors[colorIndex % colors.length]}
            strokeWidth={2}
            dot={{ r: 4 }}
            name={`${displayName}${suffix}`}
            connectNulls={false}
          />
        );
        colorIndex++;
      }
    });

    return lines;
  };

  const chartConfig = {
    rent: {
      label: "Rent (SGD)",
      color: "#3b82f6",
    },
    rate: {
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
            View rent and rate per sqft trends over time
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
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
                <Label htmlFor="property" className="text-sm font-medium text-gray-700">
                  Select Property
                </Label>
                <Select value={selectedProperty} onValueChange={setSelectedProperty}>
                  <SelectTrigger className="w-full h-12 border-2 border-gray-200 focus:border-blue-500 transition-colors">
                    <SelectValue placeholder="Choose property..." />
                  </SelectTrigger>
                  <SelectContent className="max-h-60 bg-white border border-gray-200 shadow-lg">
                    {/* Predefined properties */}
                    {predefinedProperties.map((property) => (
                      <SelectItem key={property} value={property} className="hover:bg-blue-50">
                        {property}
                      </SelectItem>
                    ))}
                    {/* URL-based properties */}
                    {propertyColumns.map((column) => (
                      <SelectItem key={column} value={column} className="hover:bg-blue-50">
                        {column.replace('url_', 'Property ')}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="text-center text-gray-500 font-medium">OR</div>

              <div className="space-y-2">
                <Label htmlFor="bedrooms" className="text-sm font-medium text-gray-700">
                  Select by Bedrooms
                </Label>
                <Select value={bedrooms} onValueChange={setBedrooms}>
                  <SelectTrigger className="w-full h-12 border-2 border-gray-200 focus:border-blue-500 transition-colors">
                    <SelectValue placeholder="Choose bedroom count..." />
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
                <Label htmlFor="chartType" className="text-sm font-medium text-gray-700">
                  Chart Type
                </Label>
                <Select value={chartType} onValueChange={(value: "rent" | "rate" | "both") => setChartType(value)}>
                  <SelectTrigger className="w-full h-12 border-2 border-gray-200 focus:border-blue-500 transition-colors">
                    <SelectValue placeholder="Select chart type..." />
                  </SelectTrigger>
                  <SelectContent className="bg-white border border-gray-200 shadow-lg">
                    <SelectItem value="both" className="hover:bg-blue-50">Both Rent & Rate</SelectItem>
                    <SelectItem value="rent" className="hover:bg-blue-50">Rent Only</SelectItem>
                    <SelectItem value="rate" className="hover:bg-blue-50">Rate per sqft Only</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button
                onClick={fetchChartData}
                disabled={isLoading || (!selectedProperty && !bedrooms)}
                className="w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium rounded-lg transition-all duration-200 transform hover:scale-[1.02]"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Loading Chart...
                  </>
                ) : (
                  <>
                    <TrendingUp className="mr-2 h-4 w-4" />
                    Generate Chart
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Chart Display */}
          <div className="lg:col-span-2">
            <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader className="bg-gradient-to-r from-green-50 to-blue-50 rounded-t-lg">
                <CardTitle>Property Trends Over Time</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                {chartData.length > 0 ? (
                  <ChartContainer config={chartConfig} className="h-96 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
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
                        {getChartLines()}
                      </LineChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                ) : (
                  <div className="h-96 flex items-center justify-center">
                    <div className="text-center">
                      <TrendingUp className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-gray-700 mb-2">
                        No Chart Data
                      </h3>
                      <p className="text-gray-500">
                        Select a property or bedroom count and click "Generate Chart" to view trends
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PropertyChart;

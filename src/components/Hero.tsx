
import { BarChart3, Zap, Target } from "lucide-react";

const Hero = () => {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto text-center">
        <div className="mb-8">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Track Competitor Prices with
            <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              AI Intelligence
            </span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Stay ahead of the competition with real-time property price analysis. 
            Get instant insights on competitor pricing strategies and market trends.
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8 mt-16">
          <div className="bg-white/60 backdrop-blur-sm p-6 rounded-2xl border border-gray-200 hover:shadow-lg transition-all duration-300">
            <div className="bg-blue-100 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-4">
              <BarChart3 className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Real-time Analysis</h3>
            <p className="text-gray-600">Get instant competitor price analysis powered by advanced AI algorithms</p>
          </div>
          
          <div className="bg-white/60 backdrop-blur-sm p-6 rounded-2xl border border-gray-200 hover:shadow-lg transition-all duration-300">
            <div className="bg-purple-100 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Zap className="h-6 w-6 text-purple-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Lightning Fast</h3>
            <p className="text-gray-600">Get results in seconds with our optimized AI processing pipeline</p>
          </div>
          
          <div className="bg-white/60 backdrop-blur-sm p-6 rounded-2xl border border-gray-200 hover:shadow-lg transition-all duration-300">
            <div className="bg-green-100 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Target className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Precise Insights</h3>
            <p className="text-gray-600">Accurate market positioning data to help you price competitively</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;

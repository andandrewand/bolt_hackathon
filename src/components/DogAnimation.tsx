import React from 'react';

interface DogAnimationProps {
  position: number;
  progress: number;
  color: string;
  name: string;
  isLeading?: boolean;
}

const DogAnimation: React.FC<DogAnimationProps> = ({ 
  position, 
  progress, 
  color, 
  name, 
  isLeading 
}) => {
  return (
    <div className="relative mb-6">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center">
          <span className="text-lg font-bold text-gray-800 mr-2">#{position}</span>
          <span className="text-lg font-bold text-gray-800">{name}</span>
          {isLeading && (
            <span className="ml-2 px-2 py-1 bg-yellow-400 text-yellow-900 text-xs font-bold rounded-full animate-bounce">
              🏆 WOW LEADER! 🏆
            </span>
          )}
        </div>
        <span className="text-sm text-gray-600 font-medium">{progress.toFixed(1)}%</span>
      </div>
      
      {/* Race track */}
      <div className="relative h-16 bg-gradient-to-r from-green-200 via-green-100 to-green-200 rounded-xl border-4 border-green-300 overflow-hidden shadow-lg">
        {/* Track grass pattern */}
        <div className="absolute inset-0 opacity-30">
          <div className="h-full w-full bg-gradient-to-r from-green-300 to-green-200"></div>
          <div className="absolute inset-0 bg-repeat-x opacity-20" style={{
            backgroundImage: `repeating-linear-gradient(90deg, transparent, transparent 10px, rgba(34, 197, 94, 0.3) 10px, rgba(34, 197, 94, 0.3) 20px)`
          }}></div>
        </div>
        
        {/* Track lines */}
        <div className="absolute inset-0 flex items-center">
          <div className="w-full h-px bg-white opacity-60"></div>
        </div>
        
        {/* Finish line */}
        <div className="absolute right-2 top-0 w-2 h-full bg-gradient-to-b from-red-500 via-white to-red-500 opacity-80 animate-pulse"></div>
        <div className="absolute right-0 top-0 w-1 h-full bg-black"></div>
        
        {/* Authentic Shiba Inu Dog */}
        <div 
          className="absolute top-1/2 transform -translate-y-1/2 transition-all duration-1000 ease-out z-10"
          style={{ left: `${Math.min(progress, 92)}%` }}
        >
          <div className={`relative ${isLeading ? 'animate-bounce' : ''}`}>
            {/* Main body - classic Shiba proportions */}
            <div className="relative w-14 h-8 bg-orange-400 rounded-full shadow-lg border border-orange-500">
              {/* White chest marking - authentic Shiba pattern */}
              <div className="absolute top-2 left-1 w-10 h-4 bg-white rounded-full opacity-90"></div>
              <div className="absolute bottom-1 left-2 w-8 h-3 bg-white rounded-full opacity-80"></div>
              
              {/* Shiba head - more authentic proportions */}
              <div className="absolute -right-5 -top-2 w-9 h-9 bg-orange-400 rounded-full shadow-md border border-orange-500">
                {/* White facial markings - classic Shiba pattern */}
                <div className="absolute top-3 left-1 w-7 h-4 bg-white rounded-full opacity-90"></div>
                <div className="absolute top-1 left-2 w-5 h-3 bg-white rounded-full opacity-80"></div>
                
                {/* Authentic Shiba snout */}
                <div className="absolute -right-3 top-3 w-4 h-4 bg-orange-300 rounded-full border border-orange-400">
                  {/* Black nose - more prominent */}
                  <div className="absolute right-0 top-1 w-2 h-2 bg-black rounded-full"></div>
                  {/* White snout marking */}
                  <div className="absolute top-1 left-0 w-3 h-2 bg-white rounded-full opacity-90"></div>
                </div>
                
                {/* Pointed Shiba ears - more accurate shape and position */}
                <div className="absolute -top-3 left-0 w-3 h-5 bg-orange-600 rounded-t-full transform -rotate-20 shadow-sm border border-orange-700"></div>
                <div className="absolute -top-3 right-0 w-3 h-5 bg-orange-600 rounded-t-full transform rotate-20 shadow-sm border border-orange-700"></div>
                
                {/* Pink inner ears */}
                <div className="absolute -top-2 left-0.5 w-2 h-3 bg-pink-300 rounded-t-full transform -rotate-20"></div>
                <div className="absolute -top-2 right-0.5 w-2 h-3 bg-pink-300 rounded-t-full transform rotate-20"></div>
                
                {/* Dark Shiba eyes - almond shaped */}
                <div className="absolute top-2 left-2 w-2 h-1.5 bg-black rounded-full transform -rotate-12"></div>
                <div className="absolute top-2 right-2 w-2 h-1.5 bg-black rounded-full transform rotate-12"></div>
                
                {/* Eye shine */}
                <div className="absolute top-2 left-2.5 w-1 h-1 bg-white rounded-full"></div>
                <div className="absolute top-2 right-2.5 w-1 h-1 bg-white rounded-full"></div>
                
                {/* Shiba mouth - subtle smile */}
                <div className="absolute top-4 left-1/2 transform -translate-x-1/2 w-4 h-1 border-b-2 border-black rounded-b-full"></div>
              </div>
              
              {/* Running legs with white socks - authentic Shiba markings */}
              <div className="absolute -bottom-5 left-2">
                {/* Front legs */}
                <div className="flex space-x-1">
                  <div className="relative">
                    <div className="w-2 h-6 bg-orange-400 rounded-full shadow-sm border border-orange-500" style={{ 
                      transform: `rotate(${Math.sin(Date.now() * 0.015) * 20}deg)`
                    }}></div>
                    {/* White sock marking */}
                    <div className="absolute bottom-0 left-0 w-2 h-2 bg-white rounded-full"></div>
                  </div>
                  <div className="relative">
                    <div className="w-2 h-6 bg-orange-400 rounded-full shadow-sm border border-orange-500" style={{ 
                      transform: `rotate(${Math.sin(Date.now() * 0.015 + Math.PI) * 20}deg)`
                    }}></div>
                    {/* White sock marking */}
                    <div className="absolute bottom-0 left-0 w-2 h-2 bg-white rounded-full"></div>
                  </div>
                </div>
                {/* Paws */}
                <div className="flex space-x-1 mt-0">
                  <div className="w-2 h-1 bg-black rounded-full opacity-70"></div>
                  <div className="w-2 h-1 bg-black rounded-full opacity-70"></div>
                </div>
              </div>
              
              <div className="absolute -bottom-5 right-2">
                {/* Back legs */}
                <div className="flex space-x-1">
                  <div className="relative">
                    <div className="w-2 h-6 bg-orange-400 rounded-full shadow-sm border border-orange-500" style={{ 
                      transform: `rotate(${Math.sin(Date.now() * 0.015 + Math.PI/2) * 25}deg)`
                    }}></div>
                    {/* White sock marking */}
                    <div className="absolute bottom-0 left-0 w-2 h-2 bg-white rounded-full"></div>
                  </div>
                  <div className="relative">
                    <div className="w-2 h-6 bg-orange-400 rounded-full shadow-sm border border-orange-500" style={{ 
                      transform: `rotate(${Math.sin(Date.now() * 0.015 + 3*Math.PI/2) * 25}deg)`
                    }}></div>
                    {/* White sock marking */}
                    <div className="absolute bottom-0 left-0 w-2 h-2 bg-white rounded-full"></div>
                  </div>
                </div>
                {/* Paws */}
                <div className="flex space-x-1 mt-0">
                  <div className="w-2 h-1 bg-black rounded-full opacity-70"></div>
                  <div className="w-2 h-1 bg-black rounded-full opacity-70"></div>
                </div>
              </div>
              
              {/* Authentic Shiba curly tail - more detailed */}
              <div className="absolute -left-6 -top-3 relative">
                {/* Tail base */}
                <div className="w-3 h-3 bg-orange-400 rounded-full border border-orange-500"></div>
                {/* Curly tail shape */}
                <div className="absolute top-0 left-2 w-6 h-6 border-4 border-orange-400 rounded-full border-b-transparent border-l-transparent transform rotate-45"></div>
                <div className="absolute -top-1 left-4 w-3 h-3 bg-orange-400 rounded-full border border-orange-500"></div>
                {/* White tail tip */}
                <div className="absolute -top-2 left-5 w-2 h-2 bg-white rounded-full"></div>
              </div>
            </div>
            
            {/* Enhanced speed effects */}
            <div className="absolute -left-10 top-1 flex space-x-1">
              <div className="w-5 h-1 bg-yellow-300 rounded-full animate-ping opacity-70"></div>
              <div className="w-4 h-1 bg-yellow-400 rounded-full animate-ping opacity-50" style={{ animationDelay: '0.2s' }}></div>
              <div className="w-3 h-1 bg-yellow-500 rounded-full animate-ping opacity-30" style={{ animationDelay: '0.4s' }}></div>
            </div>
            
            {/* Ground dust clouds */}
            <div className="absolute -left-8 bottom-0 flex space-x-1">
              <div className="w-4 h-3 bg-gray-300 rounded-full animate-bounce opacity-60"></div>
              <div className="w-3 h-2 bg-gray-400 rounded-full animate-bounce opacity-40" style={{ animationDelay: '0.1s' }}></div>
              <div className="w-2 h-1 bg-gray-500 rounded-full animate-bounce opacity-20" style={{ animationDelay: '0.2s' }}></div>
            </div>
            
            {/* Wow speech bubble for leader */}
            {isLeading && (
              <div className="absolute -top-10 -left-4 bg-white border-2 border-yellow-400 rounded-lg px-3 py-2 text-xs font-bold text-yellow-800 animate-bounce shadow-lg">
                SUCH WOW!
                <div className="absolute bottom-0 left-1/2 transform translate-y-1 -translate-x-1/2 w-0 h-0 border-l-2 border-r-2 border-t-2 border-transparent border-t-yellow-400"></div>
              </div>
            )}
            
            {/* Breathing/panting effect */}
            <div className="absolute inset-0 w-14 h-8 rounded-full animate-pulse opacity-10 bg-orange-300" style={{
              animationDuration: '1.2s'
            }}></div>
          </div>
        </div>
        
        {/* Cheering crowd */}
        <div className="absolute top-0 left-6 w-1 h-3 bg-gray-600 rounded-full opacity-50 animate-bounce" style={{ animationDelay: '0.1s' }}></div>
        <div className="absolute top-0 left-12 w-1 h-3 bg-gray-600 rounded-full opacity-50 animate-bounce" style={{ animationDelay: '0.3s' }}></div>
        <div className="absolute top-0 left-18 w-1 h-3 bg-gray-600 rounded-full opacity-50 animate-bounce" style={{ animationDelay: '0.5s' }}></div>
      </div>
      
      {/* Progress bar */}
      <div className="mt-3 w-full bg-gray-200 rounded-full h-3 shadow-inner border border-gray-300">
        <div 
          className="h-3 rounded-full transition-all duration-1000 ease-out bg-gradient-to-r from-orange-400 to-yellow-500 shadow-sm border-r border-orange-500"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
      
      {/* Authentic Shiba commentary */}
      <div className="mt-2 text-center">
        <span className="text-xs text-gray-600 font-medium">
          {progress < 25 ? 'Such Start • Very Begin' :
           progress < 50 ? 'Much Progress • Wow Speed' :
           progress < 75 ? 'Very Fast • So Close' :
           progress < 95 ? 'Almost There • Much Excite' :
           'FINISH LINE • VERY WOW!'}
        </span>
      </div>
    </div>
  );
};

export default DogAnimation;
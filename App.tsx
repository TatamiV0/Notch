import React from 'react';
import Notch from './components/Notch';

function App() {
  return (
    <div className="relative w-full h-screen bg-[#e0e5ec] overflow-hidden">
      {/* Background Wallpaper */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center transition-all duration-700"
        style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1620121692029-d088224ddc74?q=80&w=2832&auto=format&fit=crop')`,
        }}
      >
        <div className="absolute inset-0 bg-black/10 backdrop-blur-[2px]" />
      </div>

      {/* Main Content Area (Placeholder for desktop desktop) */}
      <div className="relative z-10 w-full h-full flex items-center justify-center">
        <div className="text-center text-white/80 space-y-4">
             {/* The Notch sits at the top fixed, so this content is just visual filler */}
        </div>
      </div>

      {/* The Dynamic Island Notch */}
      <Notch />
      
      {/* Footer / Dock Hint */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-white/20 backdrop-blur-md rounded-2xl h-16 w-64 flex items-center justify-center border border-white/20 shadow-xl z-0">
          <span className="text-white/50 text-xs font-medium">Dock Area</span>
      </div>
    </div>
  );
}

export default App;
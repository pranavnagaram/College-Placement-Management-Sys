import React from 'react';

function LandFooter() {
  return (
    <footer className="bg-gradient-to-br from-white via-slate-100 to-gray-100 text-gray-800 py-10 mt-16 border-t border-gray-300">
      <div className="max-w-7xl mx-auto px-6">
        {/* Footer Text */}
        <div className="text-center text-sm text-gray-600">
          <p>© 2026 <span className="text-green-600 font-semibold">College Placement Management System</span>. All rights reserved.</p>
          <p className="mt-1 text-xs text-gray-500">Developed by pre final students of IITISM Dhanbad</p>
        </div>
      </div>
    </footer>
  );
}

export default LandFooter;


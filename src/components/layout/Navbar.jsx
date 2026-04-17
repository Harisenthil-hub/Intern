import React from 'react';

const Navbar = () => {
    return (
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-6 bg-white shrink-0">
            <div className="flex flex-1 items-center justify-between">
                <h2 className="text-lg font-semibold">Cylinder Management Module</h2>
                <div className="flex items-center gap-4">
                    <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-sm font-medium">
                        AD
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Navbar;

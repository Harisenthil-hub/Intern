import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Beaker, ArrowRightLeft } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
    { name: 'Dashboard', href: '/', icon: LayoutDashboard },
    { name: 'Cylinder Filling', href: '/filling', icon: Beaker },
    { name: 'Cylinder Movement', href: '/movement', icon: ArrowRightLeft },
];

const Sidebar = () => {
    return (
        <div className="flex h-full w-64 flex-col border-r bg-white">
            <div className="flex h-16 shrink-0 items-center px-6 font-bold text-xl text-blue-600 border-b">
                IndustrialGas
            </div>
            <div className="flex-1 overflow-auto py-4">
                <nav className="grid gap-1 px-4">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        return (
                            <NavLink
                                key={item.href}
                                to={item.href}
                                className={({ isActive }) =>
                                    cn(
                                        "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                                        isActive
                                            ? "bg-blue-50 text-blue-700"
                                            : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                                    )
                                }
                            >
                                <Icon className="h-4 w-4" />
                                {item.name}
                            </NavLink>
                        );
                    })}
                </nav>
            </div>
        </div>
    );
};

export default Sidebar;

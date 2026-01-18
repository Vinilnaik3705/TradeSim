import React from 'react';
import { MousePointer2, TrendingUp, Minus, Square, Type, Eraser } from 'lucide-react';

const TOOLS = [
    { id: 'cursor', icon: MousePointer2, label: 'Cursor' },
    { id: 'trendline', icon: TrendingUp, label: 'Trendline' },
    { id: 'horizontal', icon: Minus, label: 'Horizontal Line' },
    { id: 'rectangle', icon: Square, label: 'Rectangle' },
    { id: 'text', icon: Type, label: 'Text' },
    { id: 'eraser', icon: Eraser, label: 'Eraser' },
];

export default function DrawingToolbar({ activeTool, onSelect }) {
    return (
        <div className="flex flex-col gap-2 p-2 bg-black/40 border-r border-white/5 h-full">
            {TOOLS.map((tool) => (
                <button
                    key={tool.id}
                    onClick={() => onSelect(tool.id)}
                    className={`p-2 rounded-lg transition-all group relative ${activeTool === tool.id
                            ? 'bg-accent text-white'
                            : 'text-slate-500 hover:bg-white/5 hover:text-white'
                        }`}
                    title={tool.label}
                >
                    <tool.icon size={18} />

                    {/* Tooltip */}
                    <div className="absolute left-full ml-2 px-2 py-1 bg-black border border-white/10 rounded text-[10px] font-bold text-white opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50">
                        {tool.label}
                    </div>
                </button>
            ))}
        </div>
    );
}

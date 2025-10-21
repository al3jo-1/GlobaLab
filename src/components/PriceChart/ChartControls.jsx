import React from 'react';
import { Button } from '@/components/ui/button';
import { Maximize, Minimize, TrendingUp, Edit2, Square, Circle, Type, Settings2, Clock } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';


const ChartControls = ({ 
  chartType, setChartType, 
  activeTool, setActiveTool, 
  isFullScreen, toggleFullScreen,
  toggleIndicators,
  currentTimeframe, setCurrentTimeframe
}) => {
  const controlButtons = [
    { type: 'candlestick', title: 'Velas', icon: <TrendingUp className="h-4 w-4" /> },
    { type: 'line', title: 'Línea', icon: <Type className="h-4 w-4 transform rotate-45" /> },
    { type: 'heikinashi', title: 'Heikin Ashi', icon: <TrendingUp className="h-4 w-4 opacity-70" /> },
  ];

  const drawingTools = [
    { tool: 'trendline', title: 'Línea de Tendencia (Sim.)', icon: <Edit2 className="h-4 w-4" /> },
    // { tool: 'rectangle', title: 'Rectángulo (Sim.)', icon: <Square className="h-4 w-4" /> },
    // { tool: 'ellipse', title: 'Elipse (Sim.)', icon: <Circle className="h-4 w-4" /> },
  ];

  const timeframes = [
    { value: "1S", label: "1S" }, { value: "30S", label: "30S" },
    { value: "1M", label: "1M" }, { value: "5M", label: "5M" }, { value: "15M", label: "15M" }, { value: "30M", label: "30M" },
    { value: "1H", label: "1H" }, { value: "2H", label: "2H" }, { value: "4H", label: "4H" }, 
    { value: "1D", label: "1D" },
  ];


  return (
    <div className="flex items-center space-x-1">
      <Select value={currentTimeframe} onValueChange={setCurrentTimeframe}>
        <SelectTrigger className="h-9 w-[70px] text-xs px-2">
          <Clock className="h-3 w-3 mr-1 opacity-70" />
          <SelectValue placeholder="TF" />
        </SelectTrigger>
        <SelectContent>
          {timeframes.map(tf => (
            <SelectItem key={tf.value} value={tf.value} className="text-xs">
              {tf.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <span className="mx-1 h-5 w-px bg-border" />

      {controlButtons.map(btn => (
        <Button
          key={btn.type}
          variant="ghost"
          size="icon"
          onClick={() => setChartType(btn.type)}
          className={chartType === btn.type ? 'bg-accent' : ''}
          title={btn.title}
        >
          {btn.icon}
        </Button>
      ))}
      <span className="mx-1 h-5 w-px bg-border" />
      {drawingTools.map(toolBtn => (
        <Button
          key={toolBtn.tool}
          variant="ghost"
          size="icon"
          onClick={() => setActiveTool(toolBtn.tool === activeTool ? null : toolBtn.tool)}
          className={activeTool === toolBtn.tool ? 'bg-accent' : ''}
          title={toolBtn.title}
        >
          {toolBtn.icon}
        </Button>
      ))}
      <Button variant="ghost" size="icon" onClick={toggleIndicators} title="Indicadores">
        <Settings2 className="h-4 w-4" />
      </Button>
       <span className="mx-1 h-5 w-px bg-border" />
      <Button variant="ghost" size="icon" onClick={toggleFullScreen} title={isFullScreen ? "Salir Pantalla Completa" : "Pantalla Completa"}>
        {isFullScreen ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
      </Button>
    </div>
  );
};

export default ChartControls;
import React, { useEffect, useRef, useState } from 'react';
import { createChart } from 'lightweight-charts';

/**
 * Professional TradingView-style Chart Component
 * Supports line charts and volume bars with technical indicators
 * Note: Using Area/Line series as candlestick may not be available in this version
 */
const CandlestickChart = ({
    data = [],
    height = 400,
    showVolume = true,
    chartType = 'candlestick',
    indicators = { sma: false, ema: false },
    onCrosshairMove = null
}) => {
    const chartContainerRef = useRef(null);
    const chartRef = useRef(null);
    const mainSeriesRef = useRef(null);
    const volumeSeriesRef = useRef(null);
    const smaSeriesRef = useRef(null);
    const emaSeriesRef = useRef(null);
    const [isLoading, setIsLoading] = useState(true);

    // Initialize chart
    useEffect(() => {
        if (!chartContainerRef.current) return;

        try {
            // Create chart instance with TradingView-style theme
            const chart = createChart(chartContainerRef.current, {
                width: chartContainerRef.current.clientWidth,
                height: height,
                layout: {
                    background: { color: 'transparent' },
                    textColor: '#94A3B8',
                },
                grid: {
                    vertLines: { color: '#1E293B' },
                    horzLines: { color: '#1E293B' },
                },
                crosshair: {
                    mode: 1,
                    vertLine: {
                        color: '#475569',
                        width: 1,
                        style: 3,
                        labelBackgroundColor: '#2962FF',
                    },
                    horzLine: {
                        color: '#475569',
                        width: 1,
                        style: 3,
                        labelBackgroundColor: '#2962FF',
                    },
                },
                rightPriceScale: {
                    borderColor: '#334155',
                },
                timeScale: {
                    borderColor: '#334155',
                    timeVisible: true,
                    secondsVisible: false,
                },
            });

            chartRef.current = chart;

            // Use Area series with gradient for main chart (works in all versions)
            const mainSeries = chart.addAreaSeries({
                topColor: chartType === 'candlestick' ? 'rgba(34, 197, 94, 0.4)' : 'rgba(41, 98, 255, 0.4)',
                bottomColor: 'rgba(34, 197, 94, 0.0)',
                lineColor: chartType === 'candlestick' ? '#22C55E' : '#2962FF',
                lineWidth: 2,
            });
            mainSeriesRef.current = mainSeries;

            // Add volume series if enabled
            if (showVolume) {
                const volumeSeries = chart.addHistogramSeries({
                    color: '#26a69a',
                    priceFormat: {
                        type: 'volume',
                    },
                    priceScaleId: '',
                    scaleMargins: {
                        top: 0.7,
                        bottom: 0,
                    },
                });
                volumeSeriesRef.current = volumeSeries;
            }

            // Add SMA series
            const smaSeries = chart.addLineSeries({
                color: '#F59E0B',
                lineWidth: 1.5,
            });
            smaSeriesRef.current = smaSeries;

            // Add EMA series
            const emaSeries = chart.addLineSeries({
                color: '#3B82F6',
                lineWidth: 1.5,
            });
            emaSeriesRef.current = emaSeries;

            // Subscribe to crosshair move events
            if (onCrosshairMove) {
                chart.subscribeCrosshairMove(onCrosshairMove);
            }

            // Handle resize
            const handleResize = () => {
                if (chartContainerRef.current && chartRef.current) {
                    chartRef.current.applyOptions({
                        width: chartContainerRef.current.clientWidth,
                    });
                }
            };

            window.addEventListener('resize', handleResize);

            // Cleanup
            return () => {
                window.removeEventListener('resize', handleResize);
                if (chartRef.current) {
                    chartRef.current.remove();
                    chartRef.current = null;
                }
            };
        } catch (error) {
            console.error('Error initializing chart:', error);
        }
    }, [height, showVolume, chartType]);

    // Update chart data when data or settings change
    useEffect(() => {
        if (!chartRef.current || !mainSeriesRef.current || !data || data.length === 0) {
            setIsLoading(false);
            return;
        }

        setIsLoading(true);

        try {
            // Transform data for area/line chart (use close price)
            const chartData = data.map(d => ({
                time: d.time,
                value: d.close || d.value,
            }));

            // Update main series
            mainSeriesRef.current.setData(chartData);

            // Update volume if available
            if (showVolume && volumeSeriesRef.current && data[0]?.volume !== undefined) {
                const volumeData = data.map(d => ({
                    time: d.time,
                    value: d.volume || 0,
                    color: (d.close || d.value) >= (d.open || d.value) ? '#22C55E40' : '#EF444440',
                }));
                volumeSeriesRef.current.setData(volumeData);
            }

            // Update SMA indicator
            if (indicators.sma && smaSeriesRef.current && data[0]?.sma !== undefined) {
                const smaData = data
                    .map(d => ({
                        time: d.time,
                        value: d.sma,
                    }))
                    .filter(d => d.value !== null && d.value !== undefined);
                smaSeriesRef.current.setData(smaData);
            } else if (smaSeriesRef.current) {
                smaSeriesRef.current.setData([]);
            }

            // Update EMA indicator
            if (indicators.ema && emaSeriesRef.current && data[0]?.ema !== undefined) {
                const emaData = data
                    .map(d => ({
                        time: d.time,
                        value: d.ema,
                    }))
                    .filter(d => d.value !== null && d.value !== undefined);
                emaSeriesRef.current.setData(emaData);
            } else if (emaSeriesRef.current) {
                emaSeriesRef.current.setData([]);
            }

            // Fit content to view
            chartRef.current.timeScale().fitContent();
        } catch (error) {
            console.error('Error updating chart data:', error);
        } finally {
            setIsLoading(false);
        }
    }, [data, chartType, indicators, showVolume]);

    return (
        <div className="relative w-full" style={{ height: `${height}px` }}>
            {isLoading && data.length === 0 && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/20 z-10 backdrop-blur-sm rounded-xl">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent"></div>
                </div>
            )}
            <div
                ref={chartContainerRef}
                className="w-full h-full rounded-xl overflow-hidden"
            />
        </div>
    );
};

export default CandlestickChart;

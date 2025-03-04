import React, { useEffect, useState } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

interface PortfolioChartProps {
    holdings: Array<{
        symbol: string;
        balanceUSD: number;
    }>;
    totalValue: number;
}

const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(value);
};

const generateColors = (count: number) => {
    const baseColors = [
        'rgba(54, 162, 235, 0.8)',
        'rgba(255, 99, 132, 0.8)',
        'rgba(75, 192, 192, 0.8)',
        'rgba(255, 206, 86, 0.8)',
        'rgba(153, 102, 255, 0.8)',
        'rgba(255, 159, 64, 0.8)',
        'rgba(199, 199, 199, 0.8)',
        'rgba(83, 102, 255, 0.8)',
        'rgba(255, 99, 255, 0.8)',
        'rgba(0, 162, 152, 0.8)',
    ];
    
    const colors = [...baseColors];
    while (colors.length < count) {
        const r = Math.floor(Math.random() * 200) + 55;
        const g = Math.floor(Math.random() * 200) + 55;
        const b = Math.floor(Math.random() * 200) + 55;
        colors.push(`rgba(${r}, ${g}, ${b}, 0.8)`);
    }
    
    return colors.slice(0, count);
};

const PortfolioChart: React.FC<PortfolioChartProps> = ({ holdings, totalValue }) => {
    const [chartData, setChartData] = useState<any>(null);
    
    useEffect(() => {
        if (holdings.length > 0) {
            const sortedHoldings = [...holdings].sort((a, b) => b.balanceUSD - a.balanceUSD);
            
            const topHoldings = sortedHoldings.slice(0, 8);
            const otherHoldings = sortedHoldings.slice(8);
            
            let labels = topHoldings.map(token => token.symbol);
            let values = topHoldings.map(token => token.balanceUSD);
            
            // if there are more than 8 tokens add "others"
            if (otherHoldings.length > 0) {
                const othersValue = otherHoldings.reduce((sum, token) => sum + token.balanceUSD, 0);
                labels.push('Others');
                values.push(othersValue);
            }
            
            // Generate colors
            const colors = generateColors(labels.length);
            
            setChartData({
                labels,
                datasets: [
                    {
                        data: values,
                        backgroundColor: colors,
                        borderColor: colors.map(color => color.replace('0.8', '1')),
                        borderWidth: 1,
                    },
                ],
            });
        }
    }, [holdings]);

    const chartOptions = {
        plugins: {
            legend: {
                position: 'right' as const,
                labels: {
                    color: "white",
                    boxWidth: 20,
                    padding: 10,
                    font: {
                        size: 12
                    }
                }
            },
            tooltip: {
                callbacks: {
                    label: (context: any) => {
                        const value = context.raw;
                        const percent = ((value / totalValue) * 100).toFixed(1);
                        return `${context.label}: ${formatCurrency(value)} (${percent}%)`;
                    }
                }
            }
        },
        maintainAspectRatio: false,
    };

    return (
        <div className="h-full">
            {chartData ? (
                <Pie data={chartData} options={chartOptions} />
            ) : (
                <div className="h-full flex items-center justify-center">
                    <p className="text-primary-50">No data available for chart</p>
                </div>
            )}
        </div>
    );
};

export default PortfolioChart;
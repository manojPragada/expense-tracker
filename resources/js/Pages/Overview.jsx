import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { useState } from 'react';
import * as XLSX from 'xlsx';
import { Download } from 'lucide-react';

export default function Overview({ yearlyBreakdown, categoryData, availableYears, selectedYear, categories }) {
    const [hoveredMonth, setHoveredMonth] = useState(null);
    const [hoveredCategory, setHoveredCategory] = useState(null);
    
    const handleYearChange = (e) => {
        router.get(route('overview'), { year: e.target.value }, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const exportToExcel = () => {
        // Prepare yearly overview table data
        const tableData = yearlyBreakdown.map(month => {
            const row = {
                'Month': `${month.month} ${selectedYear}`,
            };
            
            // Add category columns
            categories.forEach(category => {
                row[category.name] = month.categories[category.name] || 0;
            });
            
            // Calculate totals
            const monthTotal = Object.values(month.categories).reduce((sum, val) => sum + val, 0);
            row['Total Expenditure'] = monthTotal;
            row['Income'] = month.income || 0;
            row['Gross Savings'] = (month.income || 0) - monthTotal;
            
            return row;
        });

        // Add totals row
        const totalsRow = {
            'Month': 'Total',
        };
        categories.forEach(category => {
            const categoryTotal = yearlyBreakdown.reduce((sum, month) => sum + (month.categories[category.name] || 0), 0);
            totalsRow[category.name] = categoryTotal;
        });
        const yearlyExpenseTotal = yearlyBreakdown.reduce((sum, month) => sum + Object.values(month.categories).reduce((s, v) => s + v, 0), 0);
        const yearlyIncomeTotal = yearlyBreakdown.reduce((sum, month) => sum + (month.income || 0), 0);
        totalsRow['Total Expenditure'] = yearlyExpenseTotal;
        totalsRow['Income'] = yearlyIncomeTotal;
        totalsRow['Gross Savings'] = yearlyIncomeTotal - yearlyExpenseTotal;
        
        tableData.push(totalsRow);

        // Create workbook and worksheet
        const wb = XLSX.utils.book_new();
        const ws = XLSX.utils.json_to_sheet(tableData);

        // Set column widths
        const colWidths = [
            { wch: 15 }, // Month
            ...categories.map(() => ({ wch: 12 })), // Category columns
            { wch: 18 }, // Total Expenditure
            { wch: 12 }, // Income
            { wch: 15 }, // Gross Savings
        ];
        ws['!cols'] = colWidths;

        // Add worksheet to workbook
        XLSX.utils.book_append_sheet(wb, ws, `Overview ${selectedYear}`);

        // Generate file and download
        XLSX.writeFile(wb, `Overview_${selectedYear}.xlsx`);
    };
    
    // Build category colors from database categories
    const categoryColors = {};
    const categoryTextColors = {};
    
    if (categories && categories.length > 0) {
        categories.forEach(category => {
            categoryColors[category.name] = category.color;
            categoryTextColors[category.name] = '#FFFFFF';
        });
    }

    // Calculate max value for scaling bars
    const maxMonthTotal = Math.max(
        ...yearlyBreakdown.map(month => 
            Object.values(month.categories).reduce((sum, val) => sum + val, 0)
        ),
        1
    );

    // Prepare data for donut chart
    const pieData = categoryData.map((item) => ({
        name: item.category,
        value: parseFloat(item.amount),
        percentage: item.percentage,
    }));

    const formatCurrency = (value) => {
        return `$${parseFloat(value).toFixed(2)}`;
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                        Overview
                    </h2>
                    <select
                        value={selectedYear}
                        onChange={handleYearChange}
                        className="rounded-md border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 shadow-sm focus:border-indigo-500 dark:focus:border-indigo-600 focus:ring-indigo-500 dark:focus:ring-indigo-600 text-sm"
                    >
                        {availableYears.map((year) => (
                            <option key={year} value={year}>
                                {year}
                            </option>
                        ))}
                    </select>
                </div>
            }
        >
            <Head title="Overview" />

            <div className="py-0">
                <div className="mx-auto max-w-full">
                    <div className="grid grid-cols-1 gap-1 lg:grid-cols-2">
                        {/* Custom Yearly Breakdown Chart */}
                        <div className="overflow-hidden bg-white shadow-card dark:bg-gray-800 sm:rounded-xl border-2 border-gray-300 dark:border-gray-700">
                            <div className="p-4">
                                <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-gray-100">
                                    Yearly Breakdown
                                </h3>
                                

                                {/* Custom Bar Chart */}
                                <div className="space-y-3">
                                    {yearlyBreakdown.map((month, idx) => {
                                        const monthTotal = Object.values(month.categories).reduce((sum, val) => sum + val, 0);
                                        let cumulativeWidth = 0;

                                        return (
                                            <div 
                                                key={idx}
                                                className="group relative"
                                                onMouseEnter={() => setHoveredMonth(idx)}
                                                onMouseLeave={() => setHoveredMonth(null)}
                                            >
                                                {/* Desktop Layout: Month - Bar - Amount */}
                                                <div className="hidden md:flex items-center gap-3">
                                                    {/* Month Label - Fixed Width on Left */}
                                                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300 w-20 flex-shrink-0">
                                                        {month.month}
                                                    </span>

                                                    {/* Stacked Bar - Flexible Width in Middle */}
                                                    <div className="relative h-8 bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden flex-1">
                                                        {monthTotal > 0 ? (
                                                            <div className="absolute inset-0 flex">
                                                                {Object.entries(month.categories).map(([categoryName, amount]) => {
                                                                    if (amount <= 0) return null;
                                                                    
                                                                    const widthPercent = (amount / maxMonthTotal) * 100;
                                                                    const segmentStyle = {
                                                                        width: `${widthPercent}%`,
                                                                        backgroundColor: categoryColors[categoryName] || '#64748B',
                                                                        left: `${(cumulativeWidth / maxMonthTotal) * 100}%`
                                                                    };
                                                                    cumulativeWidth += amount;

                                                                    return (
                                                                        <div
                                                                            key={categoryName}
                                                                            className="absolute h-full transition-all duration-200 hover:opacity-80 cursor-pointer group/segment flex items-center justify-center"
                                                                            style={segmentStyle}
                                                                            onMouseEnter={() => setHoveredCategory({month: month.month, category: categoryName, amount})}
                                                                            onMouseLeave={() => setHoveredCategory(null)}
                                                                            title={`${categoryName}: ${formatCurrency(amount)}`}
                                                                        >
                                                                            {widthPercent > 8 && (
                                                                                <span className="text-xs font-medium text-white px-1 truncate">
                                                                                    ${amount.toFixed(0)}
                                                                                </span>
                                                                            )}
                                                                        </div>
                                                                    );
                                                                })}
                                                            </div>
                                                        ) : (
                                                            <div className="absolute inset-0 flex items-center justify-center">
                                                                <span className="text-xs text-gray-400 dark:text-gray-500">No data</span>
                                                            </div>
                                                        )}
                                                    </div>

                                                    {/* Amount - Fixed Width on Right */}
                                                    <span className="text-sm font-medium text-gray-900 dark:text-gray-100 w-24 flex-shrink-0 text-right">
                                                        {monthTotal > 0 ? formatCurrency(monthTotal) : '-'}
                                                    </span>
                                                </div>

                                                {/* Mobile Layout: Month and Amount on top, Bar full width below */}
                                                <div className="md:hidden">
                                                    {/* Month Label and Amount */}
                                                    <div className="flex justify-between items-center mb-1">
                                                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                                            {month.month}
                                                        </span>
                                                        <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                                            {monthTotal > 0 ? formatCurrency(monthTotal) : '-'}
                                                        </span>
                                                    </div>

                                                    {/* Stacked Bar - Full Width */}
                                                    <div className="relative h-8 bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden w-full">
                                                        {monthTotal > 0 ? (
                                                            <div className="absolute inset-0 flex">
                                                                {(() => {
                                                                    let mobileCumulativeWidth = 0;
                                                                    return Object.entries(month.categories).map(([categoryName, amount]) => {
                                                                        if (amount <= 0) return null;

                                                                        const widthPercent = (amount / maxMonthTotal) * 100;
                                                                        const segmentStyle = {
                                                                            width: `${widthPercent}%`,
                                                                            backgroundColor: categoryColors[categoryName] || '#64748B',
                                                                            left: `${(mobileCumulativeWidth / maxMonthTotal) * 100}%`
                                                                        };
                                                                        mobileCumulativeWidth += amount;

                                                                        return (
                                                                            <div
                                                                                key={categoryName}
                                                                                className="absolute h-full transition-all duration-200 flex items-center justify-center"
                                                                                style={segmentStyle}
                                                                                title={`${categoryName}: ${formatCurrency(amount)}`}
                                                                            >
                                                                                {widthPercent > 8 && (
                                                                                    <span className="text-xs font-medium text-white px-1 truncate">
                                                                                        ${amount.toFixed(0)}
                                                                                    </span>
                                                                                )}
                                                                            </div>
                                                                        );
                                                                    });
                                                                })()}
                                                            </div>
                                                        ) : (
                                                            <div className="absolute inset-0 flex items-center justify-center">
                                                                <span className="text-xs text-gray-400 dark:text-gray-500">No data</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Tooltip on Hover (Desktop only) - Absolute positioned */}
                                                {hoveredMonth === idx && monthTotal > 0 && (
                                                    <div className="hidden md:block absolute left-0 right-0 top-full mt-1 p-3 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-600 z-10 text-xs space-y-1">
                                                        {Object.entries(month.categories)
                                                            .filter(([_, amount]) => amount > 0)
                                                            .map(([categoryName, amount]) => (
                                                                <div key={categoryName} className="flex justify-between items-center">
                                                                    <div className="flex items-center gap-2">
                                                                        <div 
                                                                            className="w-3 h-3 rounded"
                                                                            style={{ backgroundColor: categoryColors[categoryName] }}
                                                                        />
                                                                        <span className="text-gray-700 dark:text-gray-300">{categoryName}</span>
                                                                    </div>
                                                                    <span className="font-medium text-gray-900 dark:text-gray-100">
                                                                        {formatCurrency(amount)}
                                                                    </span>
                                                                </div>
                                                            ))
                                                        }
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>


                                {/* Legend */}
                                <div className="mt-8 md:mt-12 flex justify-center items-center flex-wrap gap-3">
                                    {categories && categories.map((category) => (
                                        <div key={category.id} className="flex items-center gap-2">
                                            <div 
                                                className="w-4 h-4 rounded"
                                                style={{ backgroundColor: category.color }}
                                            />
                                            <span className="text-xs text-gray-700 dark:text-gray-300">
                                                {category.name}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Categories Donut Chart */}
                        <div className="overflow-hidden bg-white shadow-card dark:bg-gray-800 sm:rounded-xl border-2 border-gray-300 dark:border-gray-700">
                            <div className="p-4 w-full">
                                <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-gray-100">
                                    Categories
                                </h3>
                                {/* Responsive Pie chart with sensible breakpoints */}
                                <div className="w-full flex justify-center">
                                    <ResponsiveContainer
                                        width="100%"
                                        height={window.innerWidth < 640 ? 230 : window.innerWidth < 1024 ? 340 : 500}
                                    >
                                        <PieChart>
                                            {pieData.length > 0 ? (
                                                <Pie
                                                    data={pieData}
                                                    cx="50%"
                                                    cy="45%"
                                                    labelLine={false}
                                                    label={({ name, percentage }) =>
                                                        window.innerWidth < 768
                                                            ? `${name}`
                                                            : `${name}: ${percentage}%`
                                                    }
                                                    outerRadius={window.innerWidth < 640 ? 65 : window.innerWidth < 1024 ? 120 : 180}
                                                    fill="#8884d8"
                                                    dataKey="value"
                                                >
                                                    {pieData.map((entry, index) => (
                                                        <Cell key={`cell-${index}`} fill={categoryColors[entry.name] || '#64748B'} />
                                                    ))}
                                                </Pie>
                                            ) : (
                                                <Pie
                                                    data={[{ name: 'No Data', value: 1 }]}
                                                    cx="50%"
                                                    cy="45%"
                                                    labelLine={false}
                                                    outerRadius={window.innerWidth < 640 ? 65 : window.innerWidth < 1024 ? 120 : 180}
                                                    fill="#E5E7EB"
                                                    dataKey="value"
                                                    stroke="#D1D5DB"
                                                    strokeWidth={2}
                                                >
                                                    <Cell fill="#E5E7EB" />
                                                </Pie>
                                            )}
                                            {pieData.length > 0 && (
                                                <Tooltip formatter={(value) => `$${parseFloat(value).toFixed(2)}`} />
                                            )}
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>
                                {pieData.length === 0 && (
                                    <div className="text-center mt-4">
                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                            No expense data available for this year
                                        </p>
                                    </div>
                                )}
                                {pieData.length > 0 && (
                                    <div className="mt-6">
                                        <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                                            Category Breakdown
                                        </h4>
                                        <div className="flex flex-wrap gap-2">
                                            {pieData.map((item) => (
                                                <div
                                                    key={item.name}
                                                    className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium shadow-sm"
                                                    style={{
                                                        backgroundColor: categoryColors[item.name] || '#64748B',
                                                        color: categoryTextColors[item.name] || '#F8FAFC',
                                                    }}
                                                >
                                                    <span className="font-semibold">{item.name}</span>
                                                    <span className="mx-1.5">•</span>
                                                    <span>{item.percentage}%</span>
                                                    <span className="mx-1">•</span>
                                                    <span>${parseFloat(item.value).toFixed(2)}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Yearly Overview Table */}
                    <div className="mt-1 overflow-hidden bg-white shadow-card dark:bg-gray-800 sm:rounded-xl border-2 border-gray-300 dark:border-gray-700">
                        <div className="p-4">
                            <div className="flex items-center justify-between mb-2">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                                    Yearly Overview
                                </h3>
                                <button
                                    onClick={exportToExcel}
                                    className="flex items-center space-x-2 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm rounded-md shadow-sm transition-colors duration-200"
                                >
                                    <Download className="w-4 h-4" />
                                    <span>Export</span>
                                </button>
                            </div>
                            <div className="overflow-x-auto" style={{ fontSize: '10px' }}>
                                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                    <thead className="bg-gray-50 dark:bg-gray-700">
                                        <tr>
                                            <th className="sticky left-0 z-10 bg-gray-50 dark:bg-gray-700 px-3 py-2 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300 border-r border-gray-300 dark:border-gray-600">
                                                Month
                                            </th>
                                            {categories && categories.map((category) => (
                                                <th
                                                    key={category.id}
                                                    className="px-3 py-2 text-right text-xs font-medium uppercase tracking-wider whitespace-nowrap"
                                                    style={{
                                                        backgroundColor: category.color,
                                                        color: '#FFFFFF'
                                                    }}
                                                >
                                                    {category.name}
                                                </th>
                                            ))}
                                            <th className="px-3 py-2 text-right text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300 whitespace-nowrap border-l-2 border-gray-400 dark:border-gray-500 bg-gray-50 dark:bg-gray-700">
                                                Total Expenditure
                                            </th>
                                            <th className="px-3 py-2 text-right text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300 whitespace-nowrap bg-green-100 dark:bg-green-900">
                                                Income
                                            </th>
                                            <th className="px-3 py-2 text-right text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300 whitespace-nowrap bg-blue-100 dark:bg-blue-900">
                                                Gross Savings
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200 dark:divide-gray-700 dark:bg-gray-800">
                                        {yearlyBreakdown.map((month, idx) => {
                                            const monthTotal = Object.values(month.categories).reduce((sum, val) => sum + val, 0);
                                            const monthIncome = month.income || 0;
                                            const monthSavings = monthIncome - monthTotal;
                                            return (
                                                <tr key={idx} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                                                    <td className="sticky left-0 z-10 bg-white dark:bg-gray-800 px-3 py-2 whitespace-nowrap text-xs font-medium text-gray-900 dark:text-gray-100 border-r border-gray-300 dark:border-gray-600">
                                                        {month.month} {selectedYear}
                                                    </td>
                                                    {categories && categories.map((category) => {
                                                        const amount = month.categories[category.name] || 0;
                                                        return (
                                                            <td
                                                                key={category.id}
                                                                className="px-3 py-2 whitespace-nowrap text-xs text-right text-gray-700 dark:text-gray-300"
                                                                style={{
                                                                    backgroundColor: amount > 0 ? `${category.color}15` : 'transparent'
                                                                }}
                                                            >
                                                                {amount > 0 ? `$${amount.toFixed(2)}` : '-'}
                                                            </td>
                                                        );
                                                    })}
                                                    <td className="px-3 py-2 whitespace-nowrap text-xs text-right font-semibold text-gray-900 dark:text-gray-100 border-l-2 border-gray-400 dark:border-gray-500">
                                                        ${monthTotal.toFixed(2)}
                                                    </td>
                                                    <td className="px-3 py-2 whitespace-nowrap text-xs text-right font-medium text-green-700 dark:text-green-300 bg-green-50 dark:bg-green-900/20">
                                                        {monthIncome > 0 ? `$${monthIncome.toFixed(2)}` : '-'}
                                                    </td>
                                                    <td className={`px-3 py-2 whitespace-nowrap text-xs text-right font-medium ${monthSavings >= 0 ? 'text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-900/20' : 'text-red-700 dark:text-red-300 bg-red-50 dark:bg-red-900/20'}`}>
                                                        ${monthSavings.toFixed(2)}
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                        {/* Total Row */}
                                        <tr className="bg-gray-100 dark:bg-gray-700 font-bold">
                                            <td className="sticky left-0 z-10 bg-gray-100 dark:bg-gray-700 px-3 py-2 whitespace-nowrap text-xs font-bold text-gray-900 dark:text-gray-100 border-r border-gray-300 dark:border-gray-600">
                                                Total
                                            </td>
                                            {categories && categories.map((category) => {
                                                const categoryTotal = yearlyBreakdown.reduce((sum, month) => {
                                                    return sum + (month.categories[category.name] || 0);
                                                }, 0);
                                                return (
                                                    <td
                                                        key={category.id}
                                                        className="px-3 py-2 whitespace-nowrap text-xs text-right font-bold"
                                                        style={{
                                                            backgroundColor: categoryTotal > 0 ? `${category.color}25` : 'transparent',
                                                            color: categoryTotal > 0 ? category.color : 'inherit'
                                                        }}
                                                    >
                                                        {categoryTotal > 0 ? `$${categoryTotal.toFixed(2)}` : '-'}
                                                    </td>
                                                );
                                            })}
                                            <td className="px-3 py-2 whitespace-nowrap text-xs text-right font-bold text-gray-900 dark:text-gray-100 border-l-2 border-gray-400 dark:border-gray-500">
                                                ${yearlyBreakdown.reduce((sum, month) => {
                                                    return sum + Object.values(month.categories).reduce((s, v) => s + v, 0);
                                                }, 0).toFixed(2)}
                                            </td>
                                            <td className="px-3 py-2 whitespace-nowrap text-xs text-right font-bold text-green-700 dark:text-green-300 bg-green-100 dark:bg-green-900/40">
                                                ${yearlyBreakdown.reduce((sum, month) => sum + (month.income || 0), 0).toFixed(2)}
                                            </td>
                                            <td className={`px-3 py-2 whitespace-nowrap text-xs text-right font-bold ${
                                                (yearlyBreakdown.reduce((sum, month) => sum + (month.income || 0), 0) - 
                                                yearlyBreakdown.reduce((sum, month) => sum + Object.values(month.categories).reduce((s, v) => s + v, 0), 0)) >= 0 
                                                ? 'text-blue-700 dark:text-blue-300 bg-blue-100 dark:bg-blue-900/40' 
                                                : 'text-red-700 dark:text-red-300 bg-red-100 dark:bg-red-900/40'
                                            }`}>
                                                ${(yearlyBreakdown.reduce((sum, month) => sum + (month.income || 0), 0) - 
                                                yearlyBreakdown.reduce((sum, month) => sum + Object.values(month.categories).reduce((s, v) => s + v, 0), 0)).toFixed(2)}
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}


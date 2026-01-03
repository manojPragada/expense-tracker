import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import * as XLSX from 'xlsx';
import { Download } from 'lucide-react';

export default function WeeklyOverview({ weeklyData, categories, availableYears, selectedYear }) {
    const formatCurrency = (value) => {
        if (value === 0 || value === null || value === undefined) {
            return '-';
        }
        return `$${parseFloat(value).toFixed(2)}`;
    };

    const formatSavings = (value) => {
        if (value === 0 || value === null || value === undefined) {
            return '-';
        }
        if (value < 0) {
            return `($${Math.abs(parseFloat(value)).toFixed(2)})`;
        }
        return `$${parseFloat(value).toFixed(2)}`;
    };

    const formatCategoryValue = (value) => {
        if (value === 0 || value === null || value === undefined) {
            return '-';
        }
        return `$${parseFloat(value).toFixed(2)}`;
    };

    const handleYearChange = (e) => {
        router.get(route('weekly-overview'), { year: e.target.value }, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const exportToExcel = () => {
        // Prepare data for Excel
        const excelData = weeklyData.map(week => {
            const row = {
                'Week Starting': week.week_start,
            };
            
            // Add category columns
            categories.forEach(category => {
                row[category] = week.categories[category] || 0;
            });
            
            // Add totals
            row['Total Expenditure'] = week.total_expenditure;
            row['Income'] = week.income;
            row['Gross Savings'] = week.gross_savings;
            
            return row;
        });

        // Create workbook and worksheet
        const wb = XLSX.utils.book_new();
        const ws = XLSX.utils.json_to_sheet(excelData);

        // Set column widths
        const colWidths = [
            { wch: 15 }, // Week Starting
            ...categories.map(() => ({ wch: 12 })), // Category columns
            { wch: 18 }, // Total Expenditure
            { wch: 12 }, // Income
            { wch: 15 }, // Gross Savings
        ];
        ws['!cols'] = colWidths;

        // Add worksheet to workbook
        XLSX.utils.book_append_sheet(wb, ws, `Weekly ${selectedYear}`);

        // Generate file and download
        XLSX.writeFile(wb, `Weekly_Overview_${selectedYear}.xlsx`);
    };

    // Category column colors (matching the image description)
    const categoryColors = {
        'Bills': 'bg-green-100 dark:bg-green-900',
        'Subscriptions': 'bg-red-100 dark:bg-red-900',
        'Entertainment': 'bg-orange-100 dark:bg-orange-900',
        'Food & Drink': 'bg-blue-100 dark:bg-blue-900',
        'Groceries': 'bg-purple-100 dark:bg-purple-900',
        'Health & Wellbeing': 'bg-pink-100 dark:bg-pink-900',
        'Gifts': 'bg-indigo-100 dark:bg-indigo-900',
        'Shopping': 'bg-yellow-100 dark:bg-yellow-900',
        'Transport': 'bg-cyan-100 dark:bg-cyan-900',
        'Travel': 'bg-teal-100 dark:bg-teal-900',
        'Business': 'bg-amber-100 dark:bg-amber-900',
        'Other': 'bg-gray-100 dark:bg-gray-700',
    };

    const totalExpenditureColor = 'bg-red-100 dark:bg-red-900';
    const incomeColor = 'bg-green-100 dark:bg-green-900';
    const savingsColor = 'bg-blue-100 dark:bg-blue-900';

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                        Weekly Overview
                    </h2>
                    <div className="flex items-center space-x-2">
                        <label htmlFor="year-select" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            Year:
                        </label>
                        <select
                            id="year-select"
                            value={selectedYear}
                            onChange={handleYearChange}
                            className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300"
                        >
                            {availableYears.map((year) => (
                                <option key={year} value={year}>
                                    {year}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            }
        >
            <Head title="Weekly Overview" />

            <div className="py-0">
                <div className="mx-auto max-w-full">
                    <div className="overflow-hidden bg-white shadow-sm dark:bg-gray-800 sm:rounded-lg">
                        <div className="p-4 text-gray-900 dark:text-gray-100">
                            <div className="flex items-center justify-between mb-3">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                                    Weekly Breakdown
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
                                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 border-collapse">
                                    <thead>
                                        <tr>
                                            <th className="sticky left-0 z-10 bg-white dark:bg-gray-800 px-3 py-2 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300 border border-gray-300 dark:border-gray-600">
                                                Week Starting
                                            </th>
                                            {categories.map((category) => (
                                                <th
                                                    key={category}
                                                    className={`px-3 py-2 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300 border border-gray-300 dark:border-gray-600 ${categoryColors[category] || ''}`}
                                                >
                                                    {category}
                                                </th>
                                            ))}
                                            <th className={`px-3 py-2 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300 border border-gray-300 dark:border-gray-600 ${totalExpenditureColor}`}>
                                                Total Expenditure
                                            </th>
                                            <th className={`px-3 py-2 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300 border border-gray-300 dark:border-gray-600 ${incomeColor}`}>
                                                Income
                                            </th>
                                            <th className={`px-3 py-2 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300 border border-gray-300 dark:border-gray-600 ${savingsColor}`}>
                                                Gross Savings
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200 dark:divide-gray-700 dark:bg-gray-800">
                                        {weeklyData.map((week) => (
                                            <tr key={week.week_start_date} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                                                <td className="sticky left-0 z-10 bg-white dark:bg-gray-800 px-3 py-2 whitespace-nowrap text-xs text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-600">
                                                    {week.week_start}
                                                </td>
                                                {categories.map((category) => (
                                                    <td
                                                        key={category}
                                                        className={`px-3 py-2 whitespace-nowrap text-xs text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-600 ${categoryColors[category] || ''}`}
                                                    >
                                                        {formatCategoryValue(week.categories[category])}
                                                    </td>
                                                ))}
                                                <td className={`px-3 py-2 whitespace-nowrap text-xs font-semibold text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-600 ${totalExpenditureColor}`}>
                                                    {formatCurrency(week.total_expenditure)}
                                                </td>
                                                <td className={`px-3 py-2 whitespace-nowrap text-xs font-semibold text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-600 ${incomeColor}`}>
                                                    {formatCurrency(week.income)}
                                                </td>
                                                <td className={`px-3 py-2 whitespace-nowrap text-xs font-semibold text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-600 ${savingsColor}`}>
                                                    {formatSavings(week.gross_savings)}
                                                </td>
                                            </tr>
                                        ))}
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


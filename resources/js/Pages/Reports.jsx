import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

export default function Reports({ 
    activeTab = 'monthly',
    currentMonth,
    previousMonth,
    currentMonthIncome,
    previousMonthIncome,
    incomeChange,
    currentMonthExpenditure,
    previousMonthExpenditure,
    expenditureChange,
    monthlyData,
    currentWeek,
    previousWeek,
    currentWeekIncome,
    previousWeekIncome,
    currentWeekExpenditure,
    previousWeekExpenditure,
    weeklyData,
}) {
    const [activeTabState, setActiveTabState] = useState(activeTab);

    const handleTabChange = (tab) => {
        setActiveTabState(tab);
        router.get(route('reports'), { tab }, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const formatCurrency = (value) => {
        const num = parseFloat(value) || 0;
        return `$${num.toFixed(2)}`;
    };

    const formatPercentage = (change) => {
        if (change.isZero) {
            return '0%';
        }
        const sign = change.isPositive ? '+' : '-';
        return `${sign}${change.percentage}%`;
    };

    // Group monthly data by year for rowspan
    const groupedMonthlyData = monthlyData ? monthlyData.reduce((acc, month) => {
        const year = month.year;
        if (!acc[year]) {
            acc[year] = [];
        }
        acc[year].push(month);
        return acc;
    }, {}) : {};

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                    Reports
                </h2>
            }
        >
            <Head title="Reports" />

            <div className="py-0">
                <div className="mx-auto max-w-full px-1">
                    <div className="overflow-hidden bg-white shadow-sm dark:bg-gray-800 sm:rounded-lg">
                        <div className="p-4 text-gray-900 dark:text-gray-100">
                            {/* Tab Navigation */}
                            <div className="mb-4">
                                <div className="border-b border-gray-200 dark:border-gray-700">
                                    <nav className="-mb-px flex space-x-8">
                                        <button
                                            onClick={() => handleTabChange('monthly')}
                                            className={`whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                                                activeTabState === 'monthly'
                                                    ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400'
                                                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                                            }`}
                                        >
                                            Monthly
                                        </button>
                                        <button
                                            onClick={() => handleTabChange('weekly')}
                                            className={`whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                                                activeTabState === 'weekly'
                                                    ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400'
                                                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                                            }`}
                                        >
                                            Weekly
                                        </button>
                                    </nav>
                                </div>
                            </div>

                            {/* Monthly Reports */}
                            {activeTabState === 'monthly' && (
                                <div>
                                    {/* Current Month Summary */}
                                    <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                        <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">
                                            Current Month: {currentMonth}
                                        </h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                            {/* Income Section */}
                                            <div>
                                                <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Income</h4>
                                                <div className="grid grid-cols-1 gap-4">
                                                    <div>
                                                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Current Month</p>
                                                        <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                                                            {formatCurrency(currentMonthIncome || 0)}
                                                        </p>
                                                    </div>
                                                    <div>
                                                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Previous Month ({previousMonth})</p>
                                                        <p className="text-xl font-bold text-green-600 dark:text-green-400">
                                                            {formatCurrency(previousMonthIncome || 0)}
                                                        </p>
                                                    </div>
                                                    <div>
                                                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Change</p>
                                                        <div className="flex items-center gap-2">
                                                            {incomeChange.isZero ? (
                                                                <Minus className="w-6 h-6 text-gray-500" />
                                                            ) : incomeChange.isPositive ? (
                                                                <TrendingUp className="w-6 h-6 text-green-500" />
                                                            ) : (
                                                                <TrendingDown className="w-6 h-6 text-red-500" />
                                                            )}
                                                            <p className={`text-2xl font-bold ${
                                                                incomeChange.isZero 
                                                                    ? 'text-gray-500' 
                                                                    : incomeChange.isPositive 
                                                                        ? 'text-green-600 dark:text-green-400' 
                                                                        : 'text-red-600 dark:text-red-400'
                                                            }`}>
                                                                {formatPercentage(incomeChange)}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            {/* Expenditure Section */}
                                            <div>
                                                <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Expenditure</h4>
                                                <div className="grid grid-cols-1 gap-4">
                                                    <div>
                                                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Current Month</p>
                                                        <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                                                            {formatCurrency(currentMonthExpenditure || 0)}
                                                        </p>
                                                    </div>
                                                    <div>
                                                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Previous Month ({previousMonth})</p>
                                                        <p className="text-xl font-bold text-red-600 dark:text-red-400">
                                                            {formatCurrency(previousMonthExpenditure || 0)}
                                                        </p>
                                                    </div>
                                                    <div>
                                                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Change</p>
                                                        <div className="flex items-center gap-2">
                                                            {expenditureChange?.isZero ? (
                                                                <Minus className="w-6 h-6 text-gray-500" />
                                                            ) : expenditureChange?.isPositive ? (
                                                                <TrendingUp className="w-6 h-6 text-red-500" />
                                                            ) : (
                                                                <TrendingDown className="w-6 h-6 text-green-500" />
                                                            )}
                                                            <p className={`text-2xl font-bold ${
                                                                expenditureChange?.isZero 
                                                                    ? 'text-gray-500' 
                                                                    : expenditureChange?.isPositive 
                                                                        ? 'text-red-600 dark:text-red-400' 
                                                                        : 'text-green-600 dark:text-green-400'
                                                            }`}>
                                                                {formatPercentage(expenditureChange || { isZero: true, percentage: 0, isPositive: false })}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Monthly History Table */}
                                    <div className="overflow-x-auto">
                                        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                            <thead className="bg-gray-50 dark:bg-gray-700">
                                                <tr>
                                                    <th className="px-4 py-3 text-center text-base font-bold uppercase tracking-wider text-gray-500 dark:text-gray-300 border-r-2 border-gray-300 dark:border-gray-600" style={{ maxWidth: '80px', width: '80px' }}>
                                                        Year
                                                    </th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">
                                                        Month
                                                    </th>
                                                    <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">
                                                        Income
                                                    </th>
                                                    <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">
                                                        Income Change
                                                    </th>
                                                    <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">
                                                        Expenditure
                                                    </th>
                                                    <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">
                                                        Expenditure Change
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody className="bg-white divide-y divide-gray-200 dark:divide-gray-700 dark:bg-gray-800">
                                                {Object.keys(groupedMonthlyData).sort((a, b) => b - a).map((year) => {
                                                    const months = groupedMonthlyData[year];
                                                    return months.map((month, monthIndex) => (
                                                        <tr key={`${year}-${monthIndex}`} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                                                            {monthIndex === 0 && (
                                                                <td 
                                                                    rowSpan={months.length}
                                                                    className="px-4 py-4 whitespace-nowrap text-base font-bold text-gray-900 dark:text-gray-100 align-middle border-r-2 border-gray-300 dark:border-gray-600 text-center"
                                                                    style={{ maxWidth: '80px', width: '80px' }}
                                                                >
                                                                    {year}
                                                                </td>
                                                            )}
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                                                                {month.month}
                                                            </td>
                                                            <td className={`px-6 py-4 whitespace-nowrap text-sm text-right ${month.income && month.income > 0 ? 'text-green-600 dark:text-green-400' : 'text-gray-500 dark:text-gray-400'} font-semibold`}>
                                                                {formatCurrency(month.income || 0)}
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-right">
                                                                <div className="flex items-center justify-end gap-2">
                                                                    {month.incomeChange?.isZero ? (
                                                                        <Minus className="w-4 h-4 text-gray-500" />
                                                                    ) : month.incomeChange?.isPositive ? (
                                                                        <TrendingUp className="w-4 h-4 text-green-500" />
                                                                    ) : (
                                                                        <TrendingDown className="w-4 h-4 text-red-500" />
                                                                    )}
                                                                    <span className={`font-medium ${
                                                                        month.incomeChange?.isZero 
                                                                            ? 'text-gray-500' 
                                                                            : month.incomeChange?.isPositive 
                                                                                ? 'text-green-600 dark:text-green-400' 
                                                                                : 'text-red-600 dark:text-red-400'
                                                                    }`}>
                                                                        {formatPercentage(month.incomeChange || { isZero: true, percentage: 0, isPositive: false })}
                                                                    </span>
                                                                </div>
                                                            </td>
                                                            <td className={`px-6 py-4 whitespace-nowrap text-sm text-right ${month.expenditure && month.expenditure > 0 ? 'text-red-600 dark:text-red-400' : 'text-gray-500 dark:text-gray-400'} font-semibold`}>
                                                                {formatCurrency(month.expenditure || 0)}
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-right">
                                                                <div className="flex items-center justify-end gap-2">
                                                                    {month.expenditureChange?.isZero ? (
                                                                        <Minus className="w-4 h-4 text-gray-500" />
                                                                    ) : month.expenditureChange?.isPositive ? (
                                                                        <TrendingUp className="w-4 h-4 text-red-500" />
                                                                    ) : (
                                                                        <TrendingDown className="w-4 h-4 text-green-500" />
                                                                    )}
                                                                    <span className={`font-medium ${
                                                                        month.expenditureChange?.isZero 
                                                                            ? 'text-gray-500' 
                                                                            : month.expenditureChange?.isPositive 
                                                                                ? 'text-red-600 dark:text-red-400' 
                                                                                : 'text-green-600 dark:text-green-400'
                                                                    }`}>
                                                                        {formatPercentage(month.expenditureChange || { isZero: true, percentage: 0, isPositive: false })}
                                                                    </span>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    ));
                                                })}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}

                            {/* Weekly Reports */}
                            {activeTabState === 'weekly' && (
                                <div>
                                    {/* Current Week Summary */}
                                    <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                        <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">
                                            Current Week: {currentWeek}
                                        </h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                            {/* Income Section */}
                                            <div>
                                                <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Income</h4>
                                                <div className="grid grid-cols-1 gap-4">
                                                    <div>
                                                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Current Week</p>
                                                        <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                                                            {formatCurrency(currentWeekIncome || 0)}
                                                        </p>
                                                    </div>
                                                    <div>
                                                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Previous Week ({previousWeek})</p>
                                                        <p className="text-xl font-bold text-green-600 dark:text-green-400">
                                                            {formatCurrency(previousWeekIncome || 0)}
                                                        </p>
                                                    </div>
                                                    <div>
                                                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Change</p>
                                                        <div className="flex items-center gap-2">
                                                            {incomeChange.isZero ? (
                                                                <Minus className="w-6 h-6 text-gray-500" />
                                                            ) : incomeChange.isPositive ? (
                                                                <TrendingUp className="w-6 h-6 text-green-500" />
                                                            ) : (
                                                                <TrendingDown className="w-6 h-6 text-red-500" />
                                                            )}
                                                            <p className={`text-2xl font-bold ${
                                                                incomeChange.isZero 
                                                                    ? 'text-gray-500' 
                                                                    : incomeChange.isPositive 
                                                                        ? 'text-green-600 dark:text-green-400' 
                                                                        : 'text-red-600 dark:text-red-400'
                                                            }`}>
                                                                {formatPercentage(incomeChange)}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            {/* Expenditure Section */}
                                            <div>
                                                <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Expenditure</h4>
                                                <div className="grid grid-cols-1 gap-4">
                                                    <div>
                                                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Current Week</p>
                                                        <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                                                            {formatCurrency(currentWeekExpenditure || 0)}
                                                        </p>
                                                    </div>
                                                    <div>
                                                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Previous Week ({previousWeek})</p>
                                                        <p className="text-xl font-bold text-red-600 dark:text-red-400">
                                                            {formatCurrency(previousWeekExpenditure || 0)}
                                                        </p>
                                                    </div>
                                                    <div>
                                                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Change</p>
                                                        <div className="flex items-center gap-2">
                                                            {expenditureChange?.isZero ? (
                                                                <Minus className="w-6 h-6 text-gray-500" />
                                                            ) : expenditureChange?.isPositive ? (
                                                                <TrendingUp className="w-6 h-6 text-green-500" />
                                                            ) : (
                                                                <TrendingDown className="w-6 h-6 text-red-500" />
                                                            )}
                                                            <p className={`text-2xl font-bold ${
                                                                expenditureChange?.isZero 
                                                                    ? 'text-gray-500' 
                                                                    : expenditureChange?.isPositive 
                                                                        ? 'text-green-600 dark:text-green-400' 
                                                                        : 'text-red-600 dark:text-red-400'
                                                            }`}>
                                                                {formatPercentage(expenditureChange || { isZero: true, percentage: 0, isPositive: false })}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Weekly History Table */}
                                    <div className="overflow-x-auto">
                                        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                            <thead className="bg-gray-50 dark:bg-gray-700">
                                                <tr>
                                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">
                                                        Week
                                                    </th>
                                                    <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">
                                                        Income
                                                    </th>
                                                    <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">
                                                        Income Change
                                                    </th>
                                                    <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">
                                                        Expenditure
                                                    </th>
                                                    <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">
                                                        Expenditure Change
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody className="bg-white divide-y divide-gray-200 dark:divide-gray-700 dark:bg-gray-800">
                                                {weeklyData && weeklyData.map((week, index) => (
                                                    <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                                                            {week.week}
                                                        </td>
                                                        <td className={`px-6 py-4 whitespace-nowrap text-sm text-right ${week.income && week.income > 0 ? 'text-green-600 dark:text-green-400' : 'text-gray-500 dark:text-gray-400'} font-semibold`}>
                                                            {formatCurrency(week.income || 0)}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-right">
                                                            <div className="flex items-center justify-end gap-2">
                                                                {week.incomeChange?.isZero ? (
                                                                    <Minus className="w-4 h-4 text-gray-500" />
                                                                ) : week.incomeChange?.isPositive ? (
                                                                    <TrendingUp className="w-4 h-4 text-green-500" />
                                                                ) : (
                                                                    <TrendingDown className="w-4 h-4 text-red-500" />
                                                                )}
                                                                <span className={`font-medium ${
                                                                    week.incomeChange?.isZero 
                                                                        ? 'text-gray-500' 
                                                                        : week.incomeChange?.isPositive 
                                                                            ? 'text-green-600 dark:text-green-400' 
                                                                            : 'text-red-600 dark:text-red-400'
                                                                }`}>
                                                                    {formatPercentage(week.incomeChange || { isZero: true, percentage: 0, isPositive: false })}
                                                                </span>
                                                            </div>
                                                        </td>
                                                        <td className={`px-6 py-4 whitespace-nowrap text-sm text-right ${week.expenditure && week.expenditure > 0 ? 'text-red-600 dark:text-red-400' : 'text-gray-500 dark:text-gray-400'} font-semibold`}>
                                                            {formatCurrency(week.expenditure || 0)}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-right">
                                                            <div className="flex items-center justify-end gap-2">
                                                                {week.expenditureChange?.isZero ? (
                                                                    <Minus className="w-4 h-4 text-gray-500" />
                                                                ) : week.expenditureChange?.isPositive ? (
                                                                    <TrendingUp className="w-4 h-4 text-green-500" />
                                                                ) : (
                                                                    <TrendingDown className="w-4 h-4 text-red-500" />
                                                                )}
                                                                <span className={`font-medium ${
                                                                    week.expenditureChange?.isZero 
                                                                        ? 'text-gray-500' 
                                                                        : week.expenditureChange?.isPositive 
                                                                            ? 'text-green-600 dark:text-green-400' 
                                                                            : 'text-red-600 dark:text-red-400'
                                                                }`}>
                                                                    {formatPercentage(week.expenditureChange || { isZero: true, percentage: 0, isPositive: false })}
                                                                </span>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}


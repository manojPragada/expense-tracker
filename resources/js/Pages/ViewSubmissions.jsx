import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import DeleteConfirmationDialog from '@/Components/DeleteConfirmationDialog';
import { Head, useForm, router } from '@inertiajs/react';
import { useState, useEffect } from 'react';

export default function ViewSubmissions({ expenses, incomes, users, categories }) {
    // Get initial tab from URL query parameter
    const urlParams = new URLSearchParams(window.location.search);
    const initialTab = urlParams.get('type') === 'incomes' ? 'incomes' : 'expenses';
    
    const [editingExpense, setEditingExpense] = useState(null);
    const [editingIncome, setEditingIncome] = useState(null);
    const [deleteDialog, setDeleteDialog] = useState({ show: false, type: null, id: null, name: '' });
    const [cancelRecurringDialog, setCancelRecurringDialog] = useState({ show: false, type: null, id: null, name: '' });
    const [activeTab, setActiveTab] = useState(initialTab);

    // Update URL when tab changes
    const handleTabChange = (tab) => {
        setActiveTab(tab);
        router.get(route('submissions', { type: tab }), {}, {
            preserveState: true,
            preserveScroll: true,
            replace: true,
        });
    };

    const expenseForm = useForm({
        user_id: '',
        date: '',
        item: '',
        amount: '',
        category_id: '',
        description: '',
        is_recurring: false,
        recurring_frequency: 'monthly',
        recurring_end_date: '',
    });

    const incomeForm = useForm({
        user_id: '',
        date: '',
        income_source: '',
        amount: '',
        description: '',
        is_recurring: false,
        recurring_frequency: 'monthly',
        recurring_end_date: '',
    });

    const startEditExpense = (expense) => {
        setEditingExpense(expense.id);
        expenseForm.setData({
            user_id: expense.user_id,
            date: formatDateForInput(expense.date),
            item: expense.item,
            amount: expense.amount,
            category_id: expense.category_id,
            description: expense.description || '',
            is_recurring: expense.is_recurring || false,
            recurring_frequency: expense.recurring_frequency || 'monthly',
            recurring_end_date: formatDateForInput(expense.recurring_end_date),
        });
    };

    const startEditIncome = (income) => {
        setEditingIncome(income.id);
        incomeForm.setData({
            user_id: income.user_id,
            date: formatDateForInput(income.date),
            income_source: income.income_source,
            amount: income.amount,
            description: income.description || '',
            is_recurring: income.is_recurring || false,
            recurring_frequency: income.recurring_frequency || 'monthly',
            recurring_end_date: formatDateForInput(income.recurring_end_date),
        });
    };

    const cancelEdit = () => {
        setEditingExpense(null);
        setEditingIncome(null);
        expenseForm.reset();
        incomeForm.reset();
    };

    const submitExpense = (e, expenseId) => {
        e.preventDefault();
        expenseForm.put(route('expenses.update', expenseId), {
            onSuccess: () => {
                cancelEdit();
            },
        });
    };

    const submitIncome = (e, incomeId) => {
        e.preventDefault();
        incomeForm.put(route('incomes.update', incomeId), {
            onSuccess: () => {
                cancelEdit();
            },
        });
    };

    const confirmCancelRecurring = () => {
        const route_name = cancelRecurringDialog.type === 'expense' ? 'expenses.cancel-recurring' : 'incomes.cancel-recurring';
        
        expenseForm.post(route(route_name, cancelRecurringDialog.id), {
            onSuccess: () => {
                setCancelRecurringDialog({ show: false, type: null, id: null, name: '' });
            },
        });
    };

    const formatDateForInput = (dateValue) => {
        if (!dateValue) return '';
        // If it's already in YYYY-MM-DD format, return as is
        if (typeof dateValue === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(dateValue)) {
            return dateValue;
        }
        // Otherwise, parse it
        const date = new Date(dateValue);
        if (isNaN(date.getTime())) return '';
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const day = date.getDate();
        const month = date.toLocaleDateString('en-US', { month: 'short' });
        const year = date.getFullYear();
        return `${day} ${month} ${year}`;
    };

    const displayData = activeTab === 'expenses' ? expenses : incomes;

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                    View Submissions
                </h2>
            }
        >
            <Head title="View Submissions" />

            <div className="py-0">
                <div className="mx-auto max-w-full">
                    {/* Tab Navigation */}
                    <div className="mb-1">
                        <div className="border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-t-lg">
                            <nav className="-mb-px flex space-x-8 px-4">
                                <button
                                    onClick={() => {
                                        handleTabChange('expenses');
                                        cancelEdit();
                                    }}
                                    className={`whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium transition-colors ${
                                        activeTab === 'expenses'
                                            ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400'
                                            : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                                    }`}
                                >
                                    Expenses ({expenses.length})
                                </button>
                                <button
                                    onClick={() => {
                                        handleTabChange('incomes');
                                        cancelEdit();
                                    }}
                                    className={`whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium transition-colors ${
                                        activeTab === 'incomes'
                                            ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400'
                                            : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                                    }`}
                                >
                                    Incomes ({incomes.length})
                                </button>
                            </nav>
                        </div>
                    </div>

                    <div className="overflow-hidden bg-white shadow-sm dark:bg-gray-800 sm:rounded-lg">
                        <div className="p-6 text-gray-900 dark:text-gray-100">
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                    <thead className="bg-gray-50 dark:bg-gray-700">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">
                                                {activeTab === 'expenses' ? 'Spent By' : 'Received By'}
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">
                                                Date
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">
                                                {activeTab === 'expenses' ? 'Item' : 'Source'}
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">
                                                Amount
                                            </th>
                                            {activeTab === 'expenses' && (
                                                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">
                                                    Category
                                                </th>
                                            )}
                                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">
                                                Description
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-800">
                                        {activeTab === 'expenses' ? (
                                            // EXPENSES TAB
                                            expenses.map((expense) => (
                                                <tr key={expense.id}>
                                                    {editingExpense === expense.id ? (
                                                        <td colSpan="7" className="px-6 py-4">
                                                            <form onSubmit={(e) => submitExpense(e, expense.id)} className="space-y-4">
                                                                <div className="grid grid-cols-2 gap-4">
                                                                    <div>
                                                                        <InputLabel htmlFor={`expense_user_${expense.id}`} value="Spent By" />
                                                                        <select
                                                                            id={`expense_user_${expense.id}`}
                                                                            value={expenseForm.data.user_id}
                                                                            onChange={(e) => expenseForm.setData('user_id', e.target.value)}
                                                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300"
                                                                        >
                                                                            {users.map((user) => (
                                                                                <option key={user.id} value={user.id}>
                                                                                    {user.name}
                                                                                </option>
                                                                            ))}
                                                                        </select>
                                                                        <InputError message={expenseForm.errors.user_id} className="mt-2" />
                                                                    </div>
                                                                    <div>
                                                                        <InputLabel htmlFor={`expense_date_${expense.id}`} value="Date" />
                                                                        <input
                                                                            id={`expense_date_${expense.id}`}
                                                                            type="date"
                                                                            value={expenseForm.data.date || ''}
                                                                            onChange={(e) => expenseForm.setData('date', e.target.value)}
                                                                            onClick={(e) => e.target.showPicker && e.target.showPicker()}
                                                                            className="mt-1 block w-full cursor-pointer rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300"
                                                                            required
                                                                        />
                                                                        <InputError message={expenseForm.errors.date} className="mt-2" />
                                                                    </div>
                                                                    <div>
                                                                        <InputLabel htmlFor={`expense_item_${expense.id}`} value="Item" />
                                                                        <TextInput
                                                                            id={`expense_item_${expense.id}`}
                                                                            type="text"
                                                                            value={expenseForm.data.item}
                                                                            onChange={(e) => expenseForm.setData('item', e.target.value)}
                                                                            className="mt-1 block w-full"
                                                                        />
                                                                        <InputError message={expenseForm.errors.item} className="mt-2" />
                                                                    </div>
                                                                    <div>
                                                                        <InputLabel htmlFor={`expense_amount_${expense.id}`} value="Amount" />
                                                                        <div className="relative mt-1">
                                                                            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500 dark:text-gray-400">$</span>
                                                                            <TextInput
                                                                                id={`expense_amount_${expense.id}`}
                                                                                type="number"
                                                                                step="0.01"
                                                                                value={expenseForm.data.amount}
                                                                                onChange={(e) => expenseForm.setData('amount', e.target.value)}
                                                                                className="block w-full pl-7"
                                                                            />
                                                                        </div>
                                                                        <InputError message={expenseForm.errors.amount} className="mt-2" />
                                                                    </div>
                                                                    <div>
                                                                        <InputLabel htmlFor={`expense_category_${expense.id}`} value="Category" />
                                                                        <select
                                                                            id={`expense_category_${expense.id}`}
                                                                            value={expenseForm.data.category_id}
                                                                            onChange={(e) => expenseForm.setData('category_id', e.target.value)}
                                                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300"
                                                                        >
                                                                            {categories.map((category) => (
                                                                                <option key={category.id} value={category.id}>
                                                                                    {category.name}
                                                                                </option>
                                                                            ))}
                                                                        </select>
                                                                        <InputError message={expenseForm.errors.category_id} className="mt-2" />
                                                                    </div>
                                                                    <div>
                                                                        <InputLabel htmlFor={`expense_description_${expense.id}`} value="Description" />
                                                                        <TextInput
                                                                            id={`expense_description_${expense.id}`}
                                                                            type="text"
                                                                            value={expenseForm.data.description}
                                                                            onChange={(e) => expenseForm.setData('description', e.target.value)}
                                                                            className="mt-1 block w-full"
                                                                        />
                                                                        <InputError message={expenseForm.errors.description} className="mt-2" />
                                                                    </div>
                                                                </div>
                                                                <div className="flex gap-2">
                                                                    <PrimaryButton type="submit" disabled={expenseForm.processing}>
                                                                        Save
                                                                    </PrimaryButton>
                                                                    <button
                                                                        type="button"
                                                                        onClick={cancelEdit}
                                                                        className="rounded-md border border-gray-300 bg-white px-4 py-2 text-xs font-semibold uppercase tracking-widest text-gray-700 shadow-sm hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                                                                    >
                                                                        Cancel
                                                                    </button>
                                                                </div>
                                                            </form>
                                                        </td>
                                                    ) : (
                                                        <>
                                                            <td className="whitespace-nowrap px-6 py-4 text-sm">
                                                                {expense.user?.name}
                                                            </td>
                                                            <td className="whitespace-nowrap px-6 py-4 text-sm">
                                                                {formatDate(expense.date)}
                                                            </td>
                                                            <td className="whitespace-nowrap px-6 py-4 text-sm">
                                                                <div className="flex items-center gap-2 flex-wrap">
                                                                    <span>{expense.item}</span>
                                                                    {/* Parent entries: Always show Recurring badge */}
                                                                    {expense.is_recurring && !expense.parent_id && (
                                                                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                                                                            Recurring ({expense.recurring_frequency})
                                                                        </span>
                                                                    )}
                                                                    {/* Child entries: Show Generated badge */}
                                                                    {expense.parent_id && (
                                                                        <>
                                                                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                                                                                Recurring ({expense.parent?.recurring_frequency || expenses[expense.parent_id]?.recurring_frequency})
                                                                            </span>
                                                                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">
                                                                                Generated
                                                                            </span>
                                                                        </>
                                                                    )}
                                                                    {/* Show Cancelled badge if parent is cancelled (for child entries) */}
                                                                    {expense.parent_id && expense.parent && !expense.parent.is_recurring_active && (
                                                                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
                                                                            Cancelled
                                                                        </span>
                                                                    )}
                                                                    {/* Show Cancelled badge if parent entry is cancelled */}
                                                                    {expense.is_recurring && !expense.parent_id && !expense.is_recurring_active && (
                                                                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
                                                                            Cancelled
                                                                        </span>
                                                                    )}
                                                                </div>
                                                            </td>
                                                            <td className="whitespace-nowrap px-6 py-4 text-sm font-medium">
                                                                ${parseFloat(expense.amount).toFixed(2)}
                                                            </td>
                                                            <td className="whitespace-nowrap px-6 py-4 text-sm">
                                                                {expense.category ? (
                                                                    <span 
                                                                        className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium shadow-sm"
                                                                        style={{
                                                                            backgroundColor: expense.category.color,
                                                                            color: '#FFFFFF'
                                                                        }}
                                                                    >
                                                                        {expense.category.name}
                                                                    </span>
                                                                ) : '-'}
                                                            </td>
                                                            <td className="px-6 py-4 text-sm">
                                                                {expense.description || '-'}
                                                            </td>
                                                            <td className="whitespace-nowrap px-6 py-4 text-sm">
                                                                <div className="flex gap-2">
                                                                    <button
                                                                        onClick={() => startEditExpense(expense)}
                                                                        className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300"
                                                                    >
                                                                        Edit
                                                                    </button>
                                                                    <span className="text-gray-300 dark:text-gray-600">|</span>
                                                                    <button
                                                                        onClick={() => setDeleteDialog({
                                                                            show: true,
                                                                            type: 'expense',
                                                                            id: expense.id,
                                                                            name: expense.item
                                                                        })}
                                                                        className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                                                                    >
                                                                        Delete
                                                                    </button>
                                                                    {expense.is_recurring && !expense.parent_id && expense.is_recurring_active && (
                                                                        <>
                                                                            <span className="text-gray-300 dark:text-gray-600">|</span>
                                                                            <button
                                                                                onClick={() => setCancelRecurringDialog({
                                                                                    show: true,
                                                                                    type: 'expense',
                                                                                    id: expense.id,
                                                                                    name: expense.item
                                                                                })}
                                                                                className="text-orange-600 hover:text-orange-900 dark:text-orange-400 dark:hover:text-orange-300"
                                                                            >
                                                                                Cancel Subscription
                                                                            </button>
                                                                        </>
                                                                    )}
                                                                    {expense.parent_id && expense.parent && expense.parent.is_recurring_active && (
                                                                        <>
                                                                            <span className="text-gray-300 dark:text-gray-600">|</span>
                                                                            <button
                                                                                onClick={() => setCancelRecurringDialog({
                                                                                    show: true,
                                                                                    type: 'expense',
                                                                                    id: expense.parent.id,
                                                                                    name: expense.parent.item || expense.item
                                                                                })}
                                                                                className="text-orange-600 hover:text-orange-900 dark:text-orange-400 dark:hover:text-orange-300"
                                                                            >
                                                                                Cancel Subscription
                                                                            </button>
                                                                        </>
                                                                    )}
                                                                </div>
                                                            </td>
                                                        </>
                                                    )}
                                                </tr>
                                            ))
                                        ) : (
                                            // INCOMES TAB
                                            incomes.map((income) => (
                                                <tr key={income.id}>
                                                    {editingIncome === income.id ? (
                                                        <td colSpan="6" className="px-6 py-4">
                                                            <form onSubmit={(e) => submitIncome(e, income.id)} className="space-y-4">
                                                                <div className="grid grid-cols-2 gap-4">
                                                                    <div>
                                                                        <InputLabel htmlFor={`income_user_${income.id}`} value="Received By" />
                                                                        <select
                                                                            id={`income_user_${income.id}`}
                                                                            value={incomeForm.data.user_id}
                                                                            onChange={(e) => incomeForm.setData('user_id', e.target.value)}
                                                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300"
                                                                        >
                                                                            {users.map((user) => (
                                                                                <option key={user.id} value={user.id}>
                                                                                    {user.name}
                                                                                </option>
                                                                            ))}
                                                                        </select>
                                                                        <InputError message={incomeForm.errors.user_id} className="mt-2" />
                                                                    </div>
                                                                    <div>
                                                                        <InputLabel htmlFor={`income_date_${income.id}`} value="Date" />
                                                                        <input
                                                                            id={`income_date_${income.id}`}
                                                                            type="date"
                                                                            value={incomeForm.data.date || ''}
                                                                            onChange={(e) => incomeForm.setData('date', e.target.value)}
                                                                            onClick={(e) => e.target.showPicker && e.target.showPicker()}
                                                                            className="mt-1 block w-full cursor-pointer rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300"
                                                                            required
                                                                        />
                                                                        <InputError message={incomeForm.errors.date} className="mt-2" />
                                                                    </div>
                                                                    <div>
                                                                        <InputLabel htmlFor={`income_source_${income.id}`} value="Income Source" />
                                                                        <select
                                                                            id={`income_source_${income.id}`}
                                                                            value={incomeForm.data.income_source}
                                                                            onChange={(e) => incomeForm.setData('income_source', e.target.value)}
                                                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300"
                                                                        >
                                                                            <option value="Work">Work</option>
                                                                            <option value="Any Other">Any Other</option>
                                                                        </select>
                                                                        <InputError message={incomeForm.errors.income_source} className="mt-2" />
                                                                    </div>
                                                                    <div>
                                                                        <InputLabel htmlFor={`income_amount_${income.id}`} value="Amount" />
                                                                        <div className="relative mt-1">
                                                                            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500 dark:text-gray-400">$</span>
                                                                            <TextInput
                                                                                id={`income_amount_${income.id}`}
                                                                                type="number"
                                                                                step="0.01"
                                                                                value={incomeForm.data.amount}
                                                                                onChange={(e) => incomeForm.setData('amount', e.target.value)}
                                                                                className="block w-full pl-7"
                                                                            />
                                                                        </div>
                                                                        <InputError message={incomeForm.errors.amount} className="mt-2" />
                                                                    </div>
                                                                    <div className="col-span-2">
                                                                        <InputLabel htmlFor={`income_description_${income.id}`} value="Description" />
                                                                        <TextInput
                                                                            id={`income_description_${income.id}`}
                                                                            type="text"
                                                                            value={incomeForm.data.description}
                                                                            onChange={(e) => incomeForm.setData('description', e.target.value)}
                                                                            className="mt-1 block w-full"
                                                                        />
                                                                        <InputError message={incomeForm.errors.description} className="mt-2" />
                                                                    </div>
                                                                </div>
                                                                <div className="flex gap-2">
                                                                    <PrimaryButton type="submit" disabled={incomeForm.processing}>
                                                                        Save
                                                                    </PrimaryButton>
                                                                    <button
                                                                        type="button"
                                                                        onClick={cancelEdit}
                                                                        className="rounded-md border border-gray-300 bg-white px-4 py-2 text-xs font-semibold uppercase tracking-widest text-gray-700 shadow-sm hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                                                                    >
                                                                        Cancel
                                                                    </button>
                                                                </div>
                                                            </form>
                                                        </td>
                                                    ) : (
                                                        <>
                                                            <td className="whitespace-nowrap px-6 py-4 text-sm">
                                                                {income.user?.name}
                                                            </td>
                                                            <td className="whitespace-nowrap px-6 py-4 text-sm">
                                                                {formatDate(income.date)}
                                                            </td>
                                                            <td className="whitespace-nowrap px-6 py-4 text-sm">
                                                                <div className="flex items-center gap-2 flex-wrap">
                                                                    <span>{income.income_source}</span>
                                                                    {/* Parent entries: Always show Recurring badge */}
                                                                    {income.is_recurring && !income.parent_id && (
                                                                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                                                                            Recurring ({income.recurring_frequency})
                                                                        </span>
                                                                    )}
                                                                    {/* Child entries: Show Generated badge */}
                                                                    {income.parent_id && (
                                                                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">
                                                                            Generated
                                                                        </span>
                                                                    )}
                                                                    {/* Show Cancelled badge if parent is cancelled (for child entries) */}
                                                                    {income.parent_id && income.parent && !income.parent.is_recurring_active && (
                                                                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
                                                                            Cancelled
                                                                        </span>
                                                                    )}
                                                                    {/* Show Cancelled badge if parent entry is cancelled */}
                                                                    {income.is_recurring && !income.parent_id && !income.is_recurring_active && (
                                                                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
                                                                            Cancelled
                                                                        </span>
                                                                    )}
                                                                </div>
                                                            </td>
                                                            <td className="whitespace-nowrap px-6 py-4 text-sm font-medium">
                                                                ${parseFloat(income.amount).toFixed(2)}
                                                            </td>
                                                            <td className="px-6 py-4 text-sm">
                                                                {income.description || '-'}
                                                            </td>
                                                            <td className="whitespace-nowrap px-6 py-4 text-sm">
                                                                <div className="flex gap-2">
                                                                    <button
                                                                        onClick={() => startEditIncome(income)}
                                                                        className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300"
                                                                    >
                                                                        Edit
                                                                    </button>
                                                                    <span className="text-gray-300 dark:text-gray-600">|</span>
                                                                    <button
                                                                        onClick={() => setDeleteDialog({
                                                                            show: true,
                                                                            type: 'income',
                                                                            id: income.id,
                                                                            name: income.income_source
                                                                        })}
                                                                        className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                                                                    >
                                                                        Delete
                                                                    </button>
                                                                    {income.is_recurring && !income.parent_id && income.is_recurring_active && (
                                                                        <>
                                                                            <span className="text-gray-300 dark:text-gray-600">|</span>
                                                                            <button
                                                                                onClick={() => setCancelRecurringDialog({
                                                                                    show: true,
                                                                                    type: 'income',
                                                                                    id: income.id,
                                                                                    name: income.income_source
                                                                                })}
                                                                                className="text-orange-600 hover:text-orange-900 dark:text-orange-400 dark:hover:text-orange-300"
                                                                            >
                                                                                Cancel Subscription
                                                                            </button>
                                                                        </>
                                                                    )}
                                                                    {income.parent_id && income.parent && income.parent.is_recurring_active && (
                                                                        <>
                                                                            <span className="text-gray-300 dark:text-gray-600">|</span>
                                                                            <button
                                                                                onClick={() => setCancelRecurringDialog({
                                                                                    show: true,
                                                                                    type: 'income',
                                                                                    id: income.parent.id,
                                                                                    name: income.parent.income_source || income.income_source
                                                                                })}
                                                                                className="text-orange-600 hover:text-orange-900 dark:text-orange-400 dark:hover:text-orange-300"
                                                                            >
                                                                                Cancel Subscription
                                                                            </button>
                                                                        </>
                                                                    )}
                                                                </div>
                                                            </td>
                                                        </>
                                                    )}
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Delete Confirmation Dialog */}
            <DeleteConfirmationDialog
                show={deleteDialog.show}
                title={`Delete ${deleteDialog.type === 'expense' ? 'Expense' : 'Income'}`}
                message={`Are you sure you want to delete "${deleteDialog.name}"? This action cannot be undone.`}
                onClose={() => setDeleteDialog({ show: false, type: null, id: null, name: '' })}
                onConfirm={() => {
                    if (deleteDialog.type === 'expense') {
                        expenseForm.delete(route('expenses.destroy', deleteDialog.id), {
                            onSuccess: () => setDeleteDialog({ show: false, type: null, id: null, name: '' })
                        });
                    } else {
                        incomeForm.delete(route('incomes.destroy', deleteDialog.id), {
                            onSuccess: () => setDeleteDialog({ show: false, type: null, id: null, name: '' })
                        });
                    }
                }}
                isProcessing={expenseForm.processing || incomeForm.processing}
            />

            {/* Cancel Recurring Confirmation Dialog */}
            <DeleteConfirmationDialog
                show={cancelRecurringDialog.show}
                title={`Cancel Recurring ${cancelRecurringDialog.type === 'expense' ? 'Expense' : 'Income'}`}
                message={`Are you sure you want to cancel the recurring subscription for "${cancelRecurringDialog.name}"? Future entries will no longer be generated automatically.`}
                onClose={() => setCancelRecurringDialog({ show: false, type: null, id: null, name: '' })}
                onConfirm={confirmCancelRecurring}
                isProcessing={expenseForm.processing || incomeForm.processing}
            />
        </AuthenticatedLayout>
    );
}

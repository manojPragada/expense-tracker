import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Head, useForm, usePage } from '@inertiajs/react';
import { useState } from 'react';

export default function SubmitForm({ users, categories }) {
    const { auth } = usePage().props;
    const [type, setType] = useState('expense');
    // Use local time (not UTC) for today
    const now = new Date();
    const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;

    const expenseForm = useForm({
        user_id: auth?.user?.id || users[0]?.id || '',
        date: today,
        item: '',
        amount: '',
        category_id: categories[0]?.id || '',
        description: '',
    });

    const incomeForm = useForm({
        user_id: auth?.user?.id || (users.length > 0 ? users[0].id : ''),
        date: today,
        income_source: 'Work',
        amount: '',
        description: '',
    });

    const submitExpense = (e) => {
        e.preventDefault();
        expenseForm.post(route('expenses.store'), {
            onSuccess: () => {
                expenseForm.reset();
                expenseForm.setData('date', today);
                expenseForm.setData('user_id', auth.user?.id || users[0]?.id);
                expenseForm.setData('category_id', categories[0]?.id || '');
            },
        });
    };

    const submitIncome = (e) => {
        e.preventDefault();
        incomeForm.post(route('incomes.store'), {
            onSuccess: () => {
                incomeForm.reset();
                incomeForm.setData('date', today);
            },
        });
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                    Submit Income/Expense
                </h2>
            }
        >
            <Head title="Submit Income/Expense" />

            <div className="py-0">
                <div className="mx-auto max-w-full">
                    <div className="overflow-hidden bg-white shadow-card dark:bg-gray-800 sm:rounded-xl border-2 border-gray-300 dark:border-gray-700">
                        <div className="p-4 text-gray-900 dark:text-gray-100">
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Type
                                </label>
                                <div className="flex gap-4">
                                    <label className="flex items-center">
                                        <input
                                            type="radio"
                                            value="expense"
                                            checked={type === 'expense'}
                                            onChange={(e) => setType(e.target.value)}
                                            className="mr-2"
                                        />
                                        Expense
                                    </label>
                                    <label className="flex items-center">
                                        <input
                                            type="radio"
                                            value="income"
                                            checked={type === 'income'}
                                            onChange={(e) => setType(e.target.value)}
                                            className="mr-2"
                                        />
                                        Income
                                    </label>
                                </div>
                            </div>

                            {type === 'expense' ? (
                                <form onSubmit={submitExpense}>
                                    <div className="space-y-4">
                                        <div>
                                            <InputLabel htmlFor="user_id" value="Spent By" />
                                            <select
                                                id="user_id"
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
                                            <InputLabel htmlFor="date" value="Date" />
                                            <TextInput
                                                id="date"
                                                type="date"
                                                value={expenseForm.data.date}
                                                onChange={(e) => expenseForm.setData('date', e.target.value)}
                                                onClick={(e) => e.target.showPicker && e.target.showPicker()}
                                                className="mt-1 block w-full cursor-pointer"
                                            />
                                            <InputError message={expenseForm.errors.date} className="mt-2" />
                                        </div>

                                        <div>
                                            <InputLabel htmlFor="item" value="Item" />
                                            <TextInput
                                                id="item"
                                                type="text"
                                                value={expenseForm.data.item}
                                                onChange={(e) => expenseForm.setData('item', e.target.value)}
                                                className="mt-1 block w-full"
                                                required
                                            />
                                            <InputError message={expenseForm.errors.item} className="mt-2" />
                                        </div>

                                        <div>
                                            <InputLabel htmlFor="amount" value="Amount" />
                                            <div className="relative mt-1">
                                                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500 dark:text-gray-400 font-medium">
                                                    $
                                                </span>
                                                <TextInput
                                                    id="amount"
                                                    type="number"
                                                    step="0.01"
                                                    min="1"
                                                    value={expenseForm.data.amount}
                                                    onChange={(e) => expenseForm.setData('amount', e.target.value)}
                                                    className="block w-full pl-7"
                                                    required
                                                />
                                            </div>
                                            <InputError message={expenseForm.errors.amount} className="mt-2" />
                                        </div>

                                        <div>
                                            <InputLabel htmlFor="category_id" value="Category" />
                                            <select
                                                id="category_id"
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
                                            <InputLabel htmlFor="description" value="Description/Comments (Optional)" />
                                            <textarea
                                                id="description"
                                                value={expenseForm.data.description}
                                                onChange={(e) => expenseForm.setData('description', e.target.value)}
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300"
                                                rows="3"
                                            />
                                            <InputError message={expenseForm.errors.description} className="mt-2" />
                                        </div>

                                        <div className="flex items-center gap-4">
                                            <PrimaryButton disabled={expenseForm.processing}>
                                                Submit
                                            </PrimaryButton>
                                        </div>
                                    </div>
                                </form>
                            ) : (
                                <form onSubmit={submitIncome}>
                                    <div className="space-y-4">
                                        <div>
                                            <InputLabel htmlFor="income_user" value="Received By" />
                                            <select
                                                id="income_user"
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
                                            <InputLabel htmlFor="income_date" value="Date" />
                                            <TextInput
                                                id="income_date"
                                                type="date"
                                                value={incomeForm.data.date}
                                                onChange={(e) => incomeForm.setData('date', e.target.value)}
                                                onClick={(e) => e.target.showPicker && e.target.showPicker()}
                                                className="mt-1 block w-full cursor-pointer"
                                            />
                                            <InputError message={incomeForm.errors.date} className="mt-2" />
                                        </div>

                                        <div>
                                            <InputLabel htmlFor="income_source" value="Income Source" />
                                            <select
                                                id="income_source"
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
                                            <InputLabel htmlFor="income_amount" value="Income Amount" />
                                            <div className="relative mt-1">
                                                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500 dark:text-gray-400 font-medium">
                                                    $
                                                </span>
                                                <TextInput
                                                    id="income_amount"
                                                    type="number"
                                                    step="0.01"
                                                    min="1"
                                                    value={incomeForm.data.amount}
                                                    onChange={(e) => incomeForm.setData('amount', e.target.value)}
                                                    className="block w-full pl-7"
                                                    required
                                                />
                                            </div>
                                            <InputError message={incomeForm.errors.amount} className="mt-2" />
                                        </div>

                                        <div>
                                            <InputLabel htmlFor="income_description" value="Description (Optional)" />
                                            <textarea
                                                id="income_description"
                                                value={incomeForm.data.description}
                                                onChange={(e) => incomeForm.setData('description', e.target.value)}
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300"
                                                rows="3"
                                            />
                                            <InputError message={incomeForm.errors.description} className="mt-2" />
                                        </div>

                                        <div className="flex items-center gap-4">
                                            <PrimaryButton disabled={incomeForm.processing}>
                                                Submit
                                            </PrimaryButton>
                                        </div>
                                    </div>
                                </form>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}


import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import DeleteConfirmationDialog from '@/Components/DeleteConfirmationDialog';
import { Head, useForm } from '@inertiajs/react';
import { useState } from 'react';

export default function CategoriesIndex({ categories }) {
    const [editingCategory, setEditingCategory] = useState(null);
    const [showAddForm, setShowAddForm] = useState(false);
    const [deleteDialog, setDeleteDialog] = useState({ show: false, id: null, name: '' });

    const addForm = useForm({
        name: '',
        color: '#64748B',
        order: categories.length + 1,
    });

    const editForm = useForm({
        name: '',
        color: '',
        order: '',
    });

    const startEdit = (category) => {
        setEditingCategory(category.id);
        editForm.setData({
            name: category.name,
            color: category.color,
            order: category.order,
        });
    };

    const cancelEdit = () => {
        setEditingCategory(null);
        editForm.reset();
    };

    const submitAdd = (e) => {
        e.preventDefault();
        addForm.post(route('categories.store'), {
            onSuccess: () => {
                addForm.reset();
                setShowAddForm(false);
            },
        });
    };

    const submitEdit = (e, categoryId) => {
        e.preventDefault();
        editForm.put(route('categories.update', categoryId), {
            onSuccess: () => {
                setEditingCategory(null);
                editForm.reset();
            },
        });
    };

    const deleteCategory = (categoryId, categoryName) => {
        setDeleteDialog({ show: true, id: categoryId, name: categoryName });
    };

    const getContrastColor = (hexColor) => {
        // Convert hex to RGB
        const r = parseInt(hexColor.slice(1, 3), 16);
        const g = parseInt(hexColor.slice(3, 5), 16);
        const b = parseInt(hexColor.slice(5, 7), 16);
        
        // Calculate luminance
        const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
        
        return luminance > 0.5 ? '#000000' : '#FFFFFF';
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                        Categories Management
                    </h2>
                    <button
                        onClick={() => setShowAddForm(!showAddForm)}
                        className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700"
                    >
                        {showAddForm ? 'Cancel' : 'Add Category'}
                    </button>
                </div>
            }
        >
            <Head title="Categories" />

            <div className="py-1">
                <div className="mx-auto max-w-full sm:px-2 lg:px-2">
                    {/* Add Form */}
                    {showAddForm && (
                        <div className="mb-6 overflow-hidden bg-white shadow-sm dark:bg-gray-800 sm:rounded-lg border-2 border-gray-300 dark:border-gray-700">
                            <div className="p-6">
                                <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-gray-100">
                                    Add New Category
                                </h3>
                                <form onSubmit={submitAdd} className="space-y-4">
                                    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                                        <div>
                                            <InputLabel htmlFor="add_name" value="Category Name" />
                                            <TextInput
                                                id="add_name"
                                                type="text"
                                                value={addForm.data.name}
                                                onChange={(e) => addForm.setData('name', e.target.value)}
                                                className="mt-1 block w-full"
                                                required
                                            />
                                            <InputError message={addForm.errors.name} className="mt-2" />
                                        </div>

                                        <div>
                                            <InputLabel htmlFor="add_color" value="Color" />
                                            <div className="mt-1 flex gap-2">
                                                <input
                                                    id="add_color"
                                                    type="color"
                                                    value={addForm.data.color}
                                                    onChange={(e) => addForm.setData('color', e.target.value)}
                                                    className="h-10 w-20 cursor-pointer rounded border border-gray-300 dark:border-gray-600"
                                                />
                                                <TextInput
                                                    type="text"
                                                    value={addForm.data.color}
                                                    onChange={(e) => addForm.setData('color', e.target.value)}
                                                    className="flex-1"
                                                    placeholder="#000000"
                                                />
                                            </div>
                                            <InputError message={addForm.errors.color} className="mt-2" />
                                        </div>

                                        <div>
                                            <InputLabel htmlFor="add_order" value="Order" />
                                            <TextInput
                                                id="add_order"
                                                type="number"
                                                value={addForm.data.order}
                                                onChange={(e) => addForm.setData('order', e.target.value)}
                                                className="mt-1 block w-full"
                                                min="1"
                                                required
                                            />
                                            <InputError message={addForm.errors.order} className="mt-2" />
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <div
                                            className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium shadow-sm"
                                            style={{
                                                backgroundColor: addForm.data.color,
                                                color: getContrastColor(addForm.data.color),
                                            }}
                                        >
                                            Preview: {addForm.data.name || 'Category Name'}
                                        </div>
                                    </div>

                                    <div className="flex gap-2">
                                        <PrimaryButton type="submit" disabled={addForm.processing}>
                                            Add Category
                                        </PrimaryButton>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setShowAddForm(false);
                                                addForm.reset();
                                            }}
                                            className="rounded-md border border-gray-300 bg-white px-4 py-2 text-xs font-semibold uppercase tracking-widest text-gray-700 shadow-sm hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )}

                    {/* Categories List */}
                    <div className="overflow-hidden bg-white shadow-sm dark:bg-gray-800 sm:rounded-lg border-2 border-gray-300 dark:border-gray-700">
                        <div className="p-6">
                            <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-gray-100">
                                Existing Categories
                            </h3>
                            
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                    <thead className="bg-gray-50 dark:bg-gray-900">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">
                                                Order
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">
                                                Name
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">
                                                Color
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">
                                                Preview
                                            </th>
                                            <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-800">
                                        {categories.map((category) => (
                                            <tr key={category.id}>
                                                {editingCategory === category.id ? (
                                                    <>
                                                        <td colSpan="5" className="px-6 py-4">
                                                            <form onSubmit={(e) => submitEdit(e, category.id)} className="space-y-4">
                                                                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                                                                    <div>
                                                                        <InputLabel htmlFor={`edit_name_${category.id}`} value="Category Name" />
                                                                        <TextInput
                                                                            id={`edit_name_${category.id}`}
                                                                            type="text"
                                                                            value={editForm.data.name}
                                                                            onChange={(e) => editForm.setData('name', e.target.value)}
                                                                            className="mt-1 block w-full"
                                                                            required
                                                                        />
                                                                        <InputError message={editForm.errors.name} className="mt-2" />
                                                                    </div>

                                                                    <div>
                                                                        <InputLabel htmlFor={`edit_color_${category.id}`} value="Color" />
                                                                        <div className="mt-1 flex gap-2">
                                                                            <input
                                                                                id={`edit_color_${category.id}`}
                                                                                type="color"
                                                                                value={editForm.data.color}
                                                                                onChange={(e) => editForm.setData('color', e.target.value)}
                                                                                className="h-10 w-20 cursor-pointer rounded border border-gray-300 dark:border-gray-600"
                                                                            />
                                                                            <TextInput
                                                                                type="text"
                                                                                value={editForm.data.color}
                                                                                onChange={(e) => editForm.setData('color', e.target.value)}
                                                                                className="flex-1"
                                                                            />
                                                                        </div>
                                                                        <InputError message={editForm.errors.color} className="mt-2" />
                                                                    </div>

                                                                    <div>
                                                                        <InputLabel htmlFor={`edit_order_${category.id}`} value="Order" />
                                                                        <TextInput
                                                                            id={`edit_order_${category.id}`}
                                                                            type="number"
                                                                            value={editForm.data.order}
                                                                            onChange={(e) => editForm.setData('order', e.target.value)}
                                                                            className="mt-1 block w-full"
                                                                            min="1"
                                                                            required
                                                                        />
                                                                        <InputError message={editForm.errors.order} className="mt-2" />
                                                                    </div>
                                                                </div>

                                                                <div className="flex items-center gap-3">
                                                                    <div
                                                                        className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium shadow-sm"
                                                                        style={{
                                                                            backgroundColor: editForm.data.color,
                                                                            color: getContrastColor(editForm.data.color),
                                                                        }}
                                                                    >
                                                                        Preview: {editForm.data.name}
                                                                    </div>
                                                                </div>

                                                                <div className="flex gap-2">
                                                                    <PrimaryButton type="submit" disabled={editForm.processing}>
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
                                                    </>
                                                ) : (
                                                    <>
                                                        <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900 dark:text-gray-100">
                                                            {category.order}
                                                        </td>
                                                        <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900 dark:text-gray-100">
                                                            {category.name}
                                                        </td>
                                                        <td className="whitespace-nowrap px-6 py-4 text-sm">
                                                            <div className="flex items-center gap-2">
                                                                <div
                                                                    className="h-6 w-6 rounded border border-gray-300 dark:border-gray-600"
                                                                    style={{ backgroundColor: category.color }}
                                                                />
                                                                <span className="text-gray-700 dark:text-gray-300">{category.color}</span>
                                                            </div>
                                                        </td>
                                                        <td className="whitespace-nowrap px-6 py-4 text-sm">
                                                            <span
                                                                className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium shadow-sm"
                                                                style={{
                                                                    backgroundColor: category.color,
                                                                    color: getContrastColor(category.color),
                                                                }}
                                                            >
                                                                {category.name}
                                                            </span>
                                                        </td>
                                                        <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                                                            <div className="flex justify-end gap-2">
                                                                <button
                                                                    onClick={() => startEdit(category)}
                                                                    className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300"
                                                                >
                                                                    Edit
                                                                </button>
                                                                <span className="text-gray-300 dark:text-gray-600">|</span>
                                                                <button
                                                                    onClick={() => deleteCategory(category.id, category.name)}
                                                                    className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                                                                >
                                                                    Delete
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </>
                                                )}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {categories.length === 0 && (
                                <div className="text-center py-8">
                                    <p className="text-gray-500 dark:text-gray-400">
                                        No categories found. Click "Add Category" to create one.
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Delete Confirmation Dialog */}
            <DeleteConfirmationDialog
                show={deleteDialog.show}
                title="Delete Category"
                message={`Are you sure you want to delete "${deleteDialog.name}"? This action cannot be undone.`}
                onClose={() => setDeleteDialog({ show: false, id: null, name: '' })}
                onConfirm={() => {
                    editForm.delete(route('categories.destroy', deleteDialog.id), {
                        onSuccess: () => setDeleteDialog({ show: false, id: null, name: '' })
                    });
                }}
                isProcessing={editForm.processing}
            />
        </AuthenticatedLayout>
    );
}


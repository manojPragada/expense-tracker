import { Transition } from '@headlessui/react';
import { Link } from '@inertiajs/react';
import { createContext, useContext, useState } from 'react';
import { createPortal } from 'react-dom';

const DropDownContext = createContext();

const Dropdown = ({ children }) => {
    const [open, setOpen] = useState(false);
    const [position, setPosition] = useState({ top: 0, left: 0, width: 0 });

    const toggleOpen = () => {
        setOpen((previousState) => !previousState);
    };

    return (
        <DropDownContext.Provider value={{ open, setOpen, toggleOpen, position, setPosition }}>
            <div className="relative">{children}</div>
        </DropDownContext.Provider>
    );
};

const Trigger = ({ children }) => {
    const { open, setOpen, toggleOpen, setPosition } = useContext(DropDownContext);

    const handleClick = (e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        setPosition({
            top: rect.bottom,
            left: rect.left,
            width: rect.width
        });
        toggleOpen();
    };

    return (
        <>
            <div onClick={handleClick}>{children}</div>

            {open && (
                <div
                    className="fixed inset-0 z-[60]"
                    onClick={() => setOpen(false)}
                ></div>
            )}
        </>
    );
};

const Content = ({
    align = 'right',
    width = '48',
    contentClasses = 'py-1 bg-white dark:bg-gray-700',
    children,
    usePortal = false,
}) => {
    const { open, setOpen, position } = useContext(DropDownContext);

    let alignmentClasses = 'origin-top';

    if (align === 'left') {
        alignmentClasses = 'ltr:origin-top-left rtl:origin-top-right start-0';
    } else if (align === 'right') {
        alignmentClasses = 'ltr:origin-top-right rtl:origin-top-left end-0';
    }

    let widthClasses = '';

    if (width === '48') {
        widthClasses = 'w-48';
    }

    const dropdownContent = (
        <Transition
            show={open}
            enter="transition ease-out duration-200"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
        >
            <div
                className={`${usePortal ? 'fixed' : 'absolute'} z-[70] mt-2 rounded-md shadow-lg ${alignmentClasses} ${widthClasses}`}
                style={usePortal ? {
                    top: `${position.top}px`,
                    left: `${position.left}px`,
                } : {}}
                onClick={() => setOpen(false)}
            >
                <div
                    className={
                        `rounded-md ring-1 ring-black ring-opacity-5 ` +
                        contentClasses
                    }
                >
                    {children}
                </div>
            </div>
        </Transition>
    );

    return usePortal && typeof document !== 'undefined' ? createPortal(dropdownContent, document.body) : dropdownContent;
};

const DropdownLink = ({ className = '', children, ...props }) => {
    return (
        <Link
            {...props}
            className={
                'block w-full px-4 py-2 text-start text-sm leading-5 text-gray-700 transition duration-150 ease-in-out hover:bg-gray-100 focus:bg-gray-100 focus:outline-none dark:text-gray-300 dark:hover:bg-gray-800 dark:focus:bg-gray-800 ' +
                className
            }
        >
            {children}
        </Link>
    );
};

Dropdown.Trigger = Trigger;
Dropdown.Content = Content;
Dropdown.Link = DropdownLink;

export default Dropdown;

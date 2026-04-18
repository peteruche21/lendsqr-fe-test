import { useState } from 'react';
import { ArrowHeadDownIcon } from '@/assets/icons';

type PageSizeDropdownProps = {
    onChange: (value: number) => void;
    options?: number[];
    value: number;
};

export function PageSizeDropdown({ onChange, options = [20, 40, 60, 80, 100], value }: PageSizeDropdownProps) {
    const [open, setOpen] = useState(false);

    return (
        <div className="page-size-dropdown">
            <button className="page-size-dropdown__toggle" type="button" onClick={() => setOpen(!open)}>
                <span>{value}</span>
                <ArrowHeadDownIcon
                    style={{
                        transform: open ? 'rotate(180deg)' : 'none',
                        transition: 'transform 0.2s',
                    }}
                />
            </button>
            {open && (
                <>
                    <div aria-hidden="true" className="page-size-dropdown__backdrop" onClick={() => setOpen(false)} />
                    <div className="page-size-dropdown__menu">
                        {options.map((opt) => (
                            <button
                                key={opt}
                                className={`page-size-dropdown__option ${
                                    opt === value ? 'page-size-dropdown__option--active' : ''
                                }`}
                                type="button"
                                onClick={() => {
                                    onChange(opt);
                                    setOpen(false);
                                }}
                            >
                                {opt}
                            </button>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}

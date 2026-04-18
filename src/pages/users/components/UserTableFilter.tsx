import { Calendar, ChevronDown } from 'lucide-react';
import { useRef } from 'react';
import { Button, Card, Input } from '@/components';
import { USER_ORGANIZATIONS, USER_STATUSES } from '@/constants';
import type { UserFilterField, UserFilters, UserStatus } from '@/types';

type UserTableFilterProps = {
    field: UserFilterField;
    label: string;
    onChange: <Field extends UserFilterField>(field: Field, value: UserFilters[Field]) => void;
    onReset: (field: UserFilterField) => void;
    value: UserFilters[UserFilterField];
};

export function UserTableFilter({ field, label, onChange, onReset, value }: UserTableFilterProps) {
    const hasValue = value !== '';

    return (
        <Card as="div" className="user-table-filter">
            <FilterControl field={field} label={label} onChange={onChange} value={value} />

            {hasValue ? (
                <Button className="user-table-filter__button" variant="outline" onClick={() => onReset(field)}>
                    Reset
                </Button>
            ) : null}
        </Card>
    );
}

type FilterControlProps = Pick<UserTableFilterProps, 'field' | 'label' | 'onChange' | 'value'>;

function FilterControl({ field, label, onChange, value }: FilterControlProps) {
    switch (field) {
        case 'organization':
            return (
                <FilterSelect
                    label={label}
                    placeholder="Select"
                    value={value as OrganizationFilterValue}
                    onChange={(nextValue) => onChange('organization', nextValue)}
                    options={USER_ORGANIZATIONS.map((organization) => ({
                        label: organization,
                        value: organization,
                    }))}
                />
            );

        case 'status':
            return (
                <FilterSelect
                    label={label}
                    placeholder="Select"
                    value={value as UserFilters['status']}
                    onChange={(nextValue) => onChange('status', nextValue)}
                    options={USER_STATUSES.map((status) => ({
                        label: status,
                        value: status,
                    }))}
                />
            );

        case 'dateJoined':
            return (
                <FilterDate label={label} value={value} onChange={(nextValue) => onChange('dateJoined', nextValue)} />
            );

        case 'email':
        case 'phoneNumber':
        case 'username':
            return (
                <Input
                    className="user-table-filter__input"
                    label={label}
                    placeholder={getTextPlaceholder(field)}
                    value={value}
                    onChange={(event) => onChange(field, event.target.value)}
                />
            );
    }
}

type OrganizationFilterValue = UserFilters['organization'];

type FilterSelectProps<Value extends string> = {
    label: string;
    onChange: (value: Value | '') => void;
    options: Array<{
        label: string;
        value: Value;
    }>;
    placeholder: string;
    value: Value | '';
};

function FilterSelect<Value extends OrganizationFilterValue | UserStatus>({
    label,
    onChange,
    options,
    placeholder,
    value,
}: FilterSelectProps<Value>) {
    return (
        <label className="user-table-filter__field">
            <span className="user-table-filter__label">{label}</span>
            <span className="user-table-filter__control">
                <select
                    className="user-table-filter__select"
                    value={value}
                    onChange={(event) => onChange(event.target.value as Value | '')}
                >
                    <option value="">{placeholder}</option>
                    {options.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
                <ChevronDown aria-hidden="true" className="user-table-filter__icon" size={18} />
            </span>
        </label>
    );
}

type FilterDateProps = {
    label: string;
    onChange: (value: string) => void;
    value: string;
};

function FilterDate({ label, onChange, value }: FilterDateProps) {
    const inputRef = useRef<HTMLInputElement | null>(null);

    const openPicker = () => {
        inputRef.current?.showPicker?.();
        inputRef.current?.focus();
    };

    return (
        <label className="user-table-filter__field">
            <span className="user-table-filter__label">{label}</span>
            <span className="user-table-filter__control" role="presentation" onClick={openPicker}>
                <input
                    ref={inputRef}
                    className="user-table-filter__input-control"
                    data-empty={value === '' ? 'true' : 'false'}
                    placeholder="Date"
                    type="date"
                    value={value}
                    onChange={(event) => onChange(event.target.value)}
                />
                {value === '' ? <span className="user-table-filter__date-placeholder">Date</span> : null}
                <Calendar aria-hidden="true" className="user-table-filter__icon" size={18} />
            </span>
        </label>
    );
}

function getTextPlaceholder(field: UserFilterField): string {
    switch (field) {
        case 'email':
            return 'Email';
        case 'phoneNumber':
            return 'Phone Number';
        case 'username':
            return 'User';
        case 'dateJoined':
        case 'organization':
        case 'status':
            return 'Select';
    }
}

export type { UserTableFilterProps };

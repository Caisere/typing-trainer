import type { ReactNode } from 'react';

// Utility function for conditional classes
function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

// Form Container
type FormContainerProps = {
  children: ReactNode;
  onSubmit?: (e: React.FormEvent) => void;
};

export function FormContainer({ children, onSubmit }: FormContainerProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-8">
      {children}
    </form>
  );
}

// Form Section
type FormSectionProps = {
  title: string;
  description?: string;
  children: ReactNode;
  className?: string;
};

export function FormSection({
  title,
  description,
  children,
  className,
}: FormSectionProps) {
  return (
    <div className={classNames('pb-8', className || '')}>
      <div className="mb-6">
        <h2 className="text-base/7 font-semibold text-gray-900">
          {title}
        </h2>
        {description && (
          <p className="mt-1 text-sm/6 text-gray-600">
            {description}
          </p>
        )}
      </div>
      <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-6">
        {children}
      </div>
    </div>
  );
}

// Form Field (Input)
type FormFieldProps = {
  label: string;
  id: string;
  type?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  maxLength?: number;
  className?: string;
  colSpan?: 'full' | 1 | 2 | 3 | 4 | 5 | 6;
  prefix?: string;
  autoComplete?: string;
};

export function FormField({
  label,
  id,
  type = 'text',
  value,
  onChange,
  placeholder,
  required = false,
  maxLength,
  className,
  colSpan = 4,
  prefix,
  autoComplete,
}: FormFieldProps) {
  const colSpanClass = colSpan === 'full' ? 'col-span-full' : `sm:col-span-${colSpan}`;

  return (
    <div className={colSpanClass}>
      <label
        htmlFor={id}
        className="block text-sm/6 font-medium text-gray-900"
      >
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <div className="mt-2">
        {prefix
          ? (
              <div className="flex items-center rounded-md bg-white pl-3 outline-1 -outline-offset-1 outline-gray-300 focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-purple-600">
                <div className="shrink-0 text-base text-gray-500 select-none sm:text-sm/6">
                  {prefix}
                </div>
                <input
                  id={id}
                  name={id}
                  type={type}
                  value={value}
                  onChange={e => onChange(e.target.value)}
                  placeholder={placeholder}
                  required={required}
                  maxLength={maxLength}
                  autoComplete={autoComplete}
                  className={classNames(
                    'block min-w-0 grow bg-white py-1.5 pr-3 pl-1 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-sm/6',
                    className || '',
                  )}
                />
              </div>
            )
          : (
              <input
                id={id}
                name={id}
                type={type}
                value={value}
                onChange={e => onChange(e.target.value)}
                placeholder={placeholder}
                required={required}
                maxLength={maxLength}
                autoComplete={autoComplete}
                className={classNames(
                  'block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-purple-600 sm:text-sm/6',
                  className || '',
                )}
              />
            )}
      </div>
    </div>
  );
}

// Form Textarea
type FormTextareaProps = {
  label: string;
  id: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rows?: number;
  required?: boolean;
  description?: string;
  className?: string;
};

export function FormTextarea({
  label,
  id,
  value,
  onChange,
  placeholder,
  rows = 3,
  required = false,
  description,
  className,
}: FormTextareaProps) {
  return (
    <div className="col-span-full">
      <label
        htmlFor={id}
        className="block text-sm/6 font-medium text-gray-900"
      >
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <div className="mt-2">
        <textarea
          id={id}
          name={id}
          rows={rows}
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          required={required}
          className={classNames(
            'block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-purple-600 sm:text-sm/6',
            className || '',
          )}
        />
      </div>
      {description && (
        <p className="mt-3 text-sm/6 text-gray-600">{description}</p>
      )}
    </div>
  );
}

// Form Actions
type FormActionsProps = {
  onCancel?: () => void;
  onSubmit?: () => void;
  cancelText?: ReactNode;
  submitText?: ReactNode;
  submitDisabled?: boolean;
  className?: string;
};

export function FormActions({
  onCancel,
  onSubmit,
  cancelText = 'Cancel',
  submitText = 'Save',
  submitDisabled = false,
  className,
}: FormActionsProps) {
  return (
    <div
      className={classNames(
        'mt-6 flex items-center justify-end gap-x-6',
        className || '',
      )}
    >
      {onCancel && (
        <button
          type="button"
          onClick={onCancel}
          className="text-sm/6 font-semibold text-gray-900"
        >
          {cancelText}
        </button>
      )}
      <button
        type={onSubmit ? 'button' : 'submit'}
        onClick={onSubmit}
        disabled={submitDisabled}
        className="rounded-md bg-purple-600 px-4 py-2 text-sm font-semibold text-white shadow-xs hover:bg-purple-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-600 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {submitText}
      </button>
    </div>
  );
}

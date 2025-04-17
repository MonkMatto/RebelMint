import React from 'react'

interface ToggleProps {
    label: string
    checked: boolean
    onChange: (value: boolean) => void
}

const Toggle: React.FC<ToggleProps> = ({ label, checked, onChange }) => {
    return (
        <label className="flex cursor-pointer items-center gap-2">
            <span className="text-base-600">{label}</span>
            <span className="relative inline-block h-6 w-12">
                <input
                    type="checkbox"
                    className="peer h-0 w-0 opacity-0"
                    checked={checked}
                    onChange={(e) => {
                        onChange(e.target.checked)
                        e.stopPropagation()
                    }}
                />
                <span className="absolute inset-0 rounded-full bg-base-700 transition-colors duration-300 peer-checked:bg-blue-700"></span>
                <span className="absolute left-1 top-1 h-4 w-4 rounded-full bg-base-200 transition-transform duration-300 peer-checked:translate-x-6"></span>
            </span>
        </label>
    )
}

export default Toggle

"use client";
import React, { ReactElement } from "react";

interface SettingRowProps {
    label: string;
    value: string;
    options: { value: string; label: string }[];
    onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
}

const SettingRow = ({ label, value, options, onChange }: SettingRowProps): ReactElement => {
    return (
        <div className="flex font-bold capitalize items-center justify-between border-b border-gray-600 py-3">
            <label htmlFor={label}>{label}</label>
            <div>
                <select
                    id={label}
                    value={value}
                    onChange={onChange}
                    className="block bg-transparent capitalize border border-gray-600 rounded-md px-3 py-1 min-w-40 text-center appearance-none focus:outline-none focus:border-gray-400 pr-8"
                    style={{ WebkitAppearance: "none", MozAppearance: "none", textAlignLast: "center" }}
                >
                    {options.map((option) => (
                        <option key={option.value} value={option.value} className="bg-gray-900 text-center">
                            {option.label}
                        </option>
                    ))}
                </select>
            </div>
        </div>
    );
};

export default SettingRow;
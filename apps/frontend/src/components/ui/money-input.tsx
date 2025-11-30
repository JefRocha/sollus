"use client";

import * as React from "react";
import { NumericFormat, NumericFormatProps } from "react-number-format";
import { Input } from "./input";

export interface MoneyInputProps
    extends Omit<React.ComponentProps<typeof Input>, "onChange" | "value" | "type" | "defaultValue"> {
    value?: number;
    onValueChange?: (value: number | undefined) => void;
}

const MoneyInput = React.forwardRef<HTMLInputElement, MoneyInputProps>(
    ({ value, onValueChange, ...props }, ref) => {
        return (
            <NumericFormat
                customInput={Input}
                type="text"
                thousandSeparator="."
                decimalSeparator=","
                decimalScale={2}
                fixedDecimalScale
                value={value}
                onValueChange={(values) => {
                    onValueChange?.(values.floatValue);
                }}
                getInputRef={ref}
                {...props}
            />
        );
    }
);

MoneyInput.displayName = "MoneyInput";

export { MoneyInput };

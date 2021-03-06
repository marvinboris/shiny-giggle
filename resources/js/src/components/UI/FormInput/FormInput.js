import React, { useState } from 'react';
import { FormGroup, InputGroup, InputGroupAddon, InputGroupText, Input } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import DateTimeInput from './DateTimeInput/DateTimeInput';

import { checkValidity } from '../../../shared/utility';

export default ({ icon, addon, onChange, className = '', name, type = 'text', required, readonly, placeholder, value = '', validation = {}, append, disabled, children }) => {
    const [touched, setTouched] = useState(false);

    const inputChangedHandler = e => {
        setTouched(true);
        onChange(e);
    }

    let content;

    if (type === 'datetime-local') content = <DateTimeInput id={name} name={name} required={required} onChange={inputChangedHandler} readOnly={readonly} className={"w-100 d-flex text-small h-100"} value={value} placeholder={placeholder} />;
    else content = <InputGroup className="bg-input rounded-2" size="lg">
        <InputGroupAddon addonType="prepend">
            <InputGroupText className="bg-transparent border-left-0 border-top-0 border-bottom-0 border-border px-4">
                {icon ? <FontAwesomeIcon className="text-yellow mx-1" fixedWidth icon={icon} /> : addon}
            </InputGroupText>
        </InputGroupAddon>

        {children ?
            <Input invalid={touched && !checkValidity(value, validation)} onChange={inputChangedHandler} type={type} name={name} disabled={disabled} required={required} readOnly={readonly} value={value} className="bg-input border-right-0 border-top-0 border-bottom-0 border-border text-small text-light h-100 px-4 py-3" placeholder={placeholder}>{children}</Input>
            :
            <Input invalid={touched && !checkValidity(value, validation)} onChange={inputChangedHandler} type={type} name={name} disabled={disabled} required={required} readOnly={readonly} value={value} className="bg-transparent border-0 text-small text-light h-100 px-4 py-3" placeholder={placeholder} />
        }

        {append ?
            <InputGroupAddon addonType="append">
                <InputGroupText className="bg-transparent border-0 text-secondary text-small px-4">
                    {append}
                </InputGroupText>
            </InputGroupAddon>
            : null
        }
    </InputGroup>;

    return <FormGroup className={className}>
        {content}
    </FormGroup>;
};
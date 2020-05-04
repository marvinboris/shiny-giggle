import React from 'react';
import { FormGroup, InputGroup, InputGroupAddon, InputGroupText, Input } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const FormInput = ({ icon, addon, onChange, className = '', name, type = 'text', required, readonly, placeholder, value = '', append, children }) => <FormGroup className={className}>
    <InputGroup className="bg-input rounded-2" size="lg">
        <InputGroupAddon addonType="prepend">
            <InputGroupText className="bg-transparent border-left-0 border-top-0 border-bottom-0 border-border px-4">
                {icon ? <FontAwesomeIcon className="text-yellow mx-1" fixedWidth icon={icon} /> : addon}
            </InputGroupText>
        </InputGroupAddon>

        {children ?
            <Input onChange={onChange} type={type} name={name} required={required} readOnly={readonly} value={value} className="bg-input border-right-0 border-top-0 border-bottom-0 border-border text-small text-light h-100 px-4 py-3" placeholder={placeholder}>{children}</Input>
            :
            <Input onChange={onChange} type={type} name={name} required={required} readOnly={readonly} value={value} className="bg-transparent border-0 text-small text-light h-100 px-4 py-3" placeholder={placeholder} />
        }

        {append ?
            <InputGroupAddon addonType="append">
                <InputGroupText className="bg-transparent border-0 text-secondary text-small px-4">
                    {append}
                </InputGroupText>
            </InputGroupAddon>
            : null
        }
    </InputGroup>
</FormGroup>;

export default FormInput;
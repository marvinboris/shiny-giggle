import React from 'react';
import { Button, FormGroup } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const FormButton = ({ icon, children, type = 'submit', color, before, onClick, name, value }) => <FormGroup>
    <Button name={name} value={value} color={color} type={type} size="lg" className="rounded-2 text-700 py-3" onClick={onClick} block>
        {before ? <FontAwesomeIcon icon={icon} className="mr-3" /> : null}
        {children}
        {!before ? <FontAwesomeIcon icon={icon} className="ml-3" /> : null}
    </Button>
</FormGroup>

export default FormButton;
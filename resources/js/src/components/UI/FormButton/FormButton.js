import React from 'react';
import { Button, FormGroup } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const FormButton = ({ icon, children, color, onClick }) => <FormGroup>
    <Button color={color} size="lg" className="rounded-2 text-700 py-3" onClick={onClick} block>
        {children}<FontAwesomeIcon icon={icon} className="ml-3" />
    </Button>
</FormGroup>

export default FormButton;
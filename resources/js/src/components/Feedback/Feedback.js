import React from 'react';
import { Alert } from 'reactstrap';

export default ({ message }) => message ? <Alert color={message.type}>{message.content}</Alert> : null;
import React, { useState } from 'react';
import {
  InputGroup, FormControl,
  Glyphicon, FormGroup
} from 'react-bootstrap';

import PopUI from './PopUI';

export default function URL(props) {
  const [pop, setPop] = useState(true)

  return (
    <>
      {
        pop && <PopUI {...props} />
      }
    </>
  )
}
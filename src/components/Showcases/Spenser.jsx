import React, { useState } from 'react';
import { ButtonGroup, MODE } from 'baseui/button-group';
import { Button, KIND, SIZE } from "baseui/button";

import PopUI from './PopUI';
import HHUI from './HouseholdsUI';

export default function URL(props) {
  const [pop, setPop] = useState(true)


  return (
    <>
      <ButtonGroup
        mode={MODE.radio}
        selected={[pop ? 0 : 1]}
      >
        {
          ['POP', 'HH'].map(each =>
            <Button
              key={each}
              kind={KIND.secondary}
              size={SIZE.compact}
              onClick={() =>
                setPop(pop => !pop)
              }>
              {each}
            </Button>)
        }
      </ButtonGroup>
      <hr/>
      {
        pop ? <PopUI {...props} /> : <HHUI {...props}/>
      }
    </>
  )
}
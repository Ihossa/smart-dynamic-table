import React, { useState } from 'react';
import classNames from 'classnames';
import classes from './MoalRemove.module.scss';

import cancel from '../../assets/close.svg'
import attention from '../../assets/attention.svg'

const MoalRemove = ({ 
  tableElementName,
  onConfirm,
  onCancel,
  detectClass
}) => {

  return (
    <div 
      className={classNames(classes.container, detectClass('modalOverlay'))} 
      onClick={() => {onCancel()}}
      role="presentation"
    >
      <div className={classNames(classes.modal, detectClass('modal'))}>
        <button className={classNames(classes.closeBtn, detectClass('closeBtn'))}>
          <img src = {cancel} alt = 'close'/>
        </button>
        <img src = {attention} alt = 'attention' />
        <p className={classNames(classes.modalText, detectClass('modalText'))}>
          The data in the { tableElementName } will be deleted
        </p>
       
        <div  className={classes.buttonsWrapper}>
          <button 
            type="button"
            onClick={() => onConfirm()}
            className={classNames(classes.modalConfirmButton, detectClass('modalConfirmButton'))}
          >
            Confirm
          </button>
          <button 
            type="button"
            onClick={() => onCancel()}
            className={classNames(classes.modalCloseButton, detectClass('modalCloseButton'))}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}


export default MoalRemove;
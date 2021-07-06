/* eslint react/no-array-index-key: 0 */
import React, { useState } from 'react';

import TextareaAutosize from 'react-textarea-autosize';
import PropTypes from "prop-types";
import classNames from 'classnames';
import classes from './Body.module.scss';

import Plus from '../IconPlus/IconPlus'
import RemoveIcon from '../IconRemove/IconRemovePlus'

const Body = ({ 
  tableData, tableHeaders, emptyCellPlaceholder, editCeil, detectClass,
  onCeilBlur, minColumnSize, deleteRow, addRow
}) => {
  const [selectedRow, setSelectedRow] = useState(-1);

  return (
    <tbody className={detectClass('tableBody')}>
      {
        tableData.map((item, i) => {
          return (
            <tr 
              key={i} 
              className={classNames(classes.tr, detectClass('tableBodyRow'))}
              onMouseEnter={() => {
                setSelectedRow(i)
              }}
              onMouseLeave={() => {
                setSelectedRow(-1)
              }}
            >
              {
                tableHeaders.map((header, j) => {
                  const value = item[header] || emptyCellPlaceholder;
                  return (
                    <td key={j + i + header} style={{ minWidth: `${minColumnSize}px` }} className={detectClass('tableBodyCeil')}>
                      <TextareaAutosize 
                        className={classNames(classes.textarea, detectClass('tableBodyCeilTextarea'))}
                        value={value} 
                        onChange={(event) => editCeil(header, event.target.value, i)}
                        onBlur={() => onCeilBlur(tableData)}
                      />
                    </td>
                  )
                })
              }
              {
                i === selectedRow && (
                  <button 
                    type="button"
                    className={classNames(classes.deleteRowButton, detectClass('deleteRowButton'))}
                    onClick={() => deleteRow(i)}
                  >
                    <RemoveIcon />
                  </button>
                )
              }
              <td className={classNames(classes.lastCell, detectClass('lastCell'))}></td>
            </tr>
          )
        })
      }
      <tr>
        <td className={classNames(classes.lastRow, detectClass('lastRow'))}>
          <button 
            className={classNames(classes.addRowButton, detectClass('addRowButton'))}
            onClick={() => addRow()}
            type="button"
          >
            <Plus />
          </button>
        </td>
        {
          tableHeaders.map((header, j) => {
            return (<td key={j} className={classNames(classes.lastRow, detectClass('lastRow'))}></td>)
          })
        }
      </tr>
    </tbody>
  )
}

Body.propTypes = {
  emptyCellPlaceholder: PropTypes.string.isRequired,
  editCeil: PropTypes.func.isRequired,
  detectClass: PropTypes.func.isRequired,
  onCeilBlur: PropTypes.func.isRequired,
  minColumnSize: PropTypes.number.isRequired,
  tableHeaders: PropTypes.arrayOf(
    PropTypes.string
  ).isRequired,
  tableData: PropTypes.arrayOf(PropTypes.shape({})).isRequired
}

export default Body;
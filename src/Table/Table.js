/* eslint no-param-reassign: 0 */

import React, { useState, useRef, useEffect } from 'react';
import classNames from 'classnames';
import PropTypes from "prop-types";

import classes from './Table.module.scss';
import Header from './components/Header';
import Body from './components/Body';
import Modal from './components/Modal';
import MoalRemove from './components/ModalRemove';

import IconPrev from './components/IconPrev/IconPrev';
import IconNext from './components/IconNext/IconNext';
import arrow from './assets/arrow.svg'

import { getInitialProps } from './utils';

const Table = ({ 
  tableColumns,
  emptyCellPlaceholder = '',
  tableClasses = {},
  cellSpacing = "0",
  minColumnSize = 300,
  onCeilEdit = (value) => value,
  onCeilBlur = (value) => value,
  onHeaderEdit = (value) => value,
  onHeaderBlur = (value) => value,
  onSendData = (value) => value,
}) => {
  const [tableHeaders, setTableHeaders] = useState(getInitialProps(tableColumns).tableHeaders);
  const [tableData, setTableData] = useState(getInitialProps(tableColumns).tableData);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [activeHeaderValue, setActiveHeaderValue] = useState('');
  const [activeHeaderIndex, setActiveHeaderIndex] = useState(0);
  const [scroll, setScroll] = useState(0);
  const [isVisibleModalRemove, setIsVisibleModalRemove] = useState(false);
  const [indexElementRemove, setIndexElementRemove] = useState(null);
  const [nameElementRemove, setNameElementRemove] = useState('')

  const tableRef = useRef(null);
  const wrapperRef = useRef(null);

  useEffect(() => {
    if (wrapperRef.current) {
      wrapperRef.current.scrollLeft = scroll;
    }
  }, [scroll])

  const editHeaderTitle = (index, value) => {
    const newHeaders = [...tableHeaders];
    newHeaders[index] = value;
    setTableHeaders([...newHeaders]);
    const headerToEdit = tableHeaders[index];
    const newTableData = JSON.parse(JSON.stringify(tableData));
    newTableData.forEach(item => {
      item[value] = item[headerToEdit];
      delete item[headerToEdit];
    })
    setTableData(newTableData);
    onHeaderBlur({data: newTableData, headers: newHeaders});
  };

  const checkUniqueColumn = (index, value) => {
    const isValue = !!value.trim().length;
  
    const isHeaderExists = tableHeaders.findIndex(header => header === value);
    if (isHeaderExists === index) {
      return;
    }
    if (isHeaderExists !== -1 || !isValue) {
      setActiveHeaderValue(value);
      setActiveHeaderIndex(index);
      setIsModalVisible(true);
      return
    }
    editHeaderTitle(index, value);
    setIsModalVisible(false);
  }

  const handleClose = () => {
    const newHeaders = JSON.parse(JSON.stringify(tableHeaders))
    setTableHeaders(newHeaders);
    setIsModalVisible(false);
  }

  const editCeil = (head, value, index) => {
    const newTableData = JSON.parse(JSON.stringify(tableData));
    newTableData[index][head] = value;
    setTableData(newTableData);
    onCeilEdit(newTableData);
  }

  const sendData = () => {
    const editedData = {
      headers: [...tableHeaders],
      data: tableData
    };
    onSendData(editedData)
    return editedData;
  };

  const addColumn = () => {
    setTableHeaders([...tableHeaders, `Column ${tableHeaders.length + 1}`]);
    const hiddenWidth = tableRef.current.clientWidth;
    setScroll(hiddenWidth);
  };

  const addRow = () => {
    const newRow = {};
    tableHeaders.forEach(header => {
      newRow[header] = '';
    });
    setTableData([...tableData, newRow]);
  };

  const deleteColumn = (index) => {
    setIsVisibleModalRemove(true)
    setIndexElementRemove(index);
    setNameElementRemove('column')
  }
  const confirmDeleteColumn = (index) => {
    const activeHeaderTitle = tableHeaders[index];
    const newTableData = JSON.parse(JSON.stringify(tableData));
    newTableData.forEach(item => {
      delete item[activeHeaderTitle]
    })
    const newHeaders = [...tableHeaders];
    newHeaders.splice(index, 1);
    setTableData(newTableData);
    setTableHeaders(newHeaders);
  }

  const deleteRow = (index) => {
    setIsVisibleModalRemove(true)
    setIndexElementRemove(index);
    setNameElementRemove('row')
  }

  const confirmDeleteRow = (index) => {
    const newTableData = [...tableData.slice(0, index), ...tableData.slice(index + 1)];
    setTableData(newTableData);
  }

  const detectClass = (key) => {
    return tableClasses[key] || '';
  }

  const onCancel = () => {
    setIsVisibleModalRemove(false)
  }
  const onConfirm = () => {
    if(nameElementRemove === 'column'){
      confirmDeleteColumn(indexElementRemove)
    } else {
      confirmDeleteRow(indexElementRemove)
    }
    setIsVisibleModalRemove(false)
  }

  return (
    <div className={classNames(classes.container, detectClass('container'))}>
      <div className={classes.wrapper} ref={wrapperRef}>
        <table 
          className={classNames(classes.table, detectClass('table'))} 
          cellSpacing={cellSpacing}
          ref={tableRef}
        >
          <Header 
            tableHeaders={tableHeaders} 
            checkUniqueColumn={checkUniqueColumn} 
            addColumn={addColumn}
            detectClass={detectClass}
            onHeaderEdit={onHeaderEdit}
            deleteColumn={deleteColumn}
            minColumnSize={minColumnSize}
          />
          <Body 
            tableData={tableData}
            editCeil={editCeil}
            tableHeaders={tableHeaders}
            emptyCellPlaceholder={emptyCellPlaceholder}
            detectClass={detectClass}
            onCeilBlur={onCeilBlur}
            minColumnSize={minColumnSize}
            deleteRow={deleteRow}
            addRow={addRow}
          />
        </table>
      </div>
      {
        isModalVisible && (
          <Modal 
            index={activeHeaderIndex}
            headerValue={activeHeaderValue} 
            checkUniqueColumn={checkUniqueColumn}
            closeModal={handleClose}
            detectClass={detectClass}
          />
        )
      }
      <div className={classNames(classes.footer, detectClass('footer'))}>
        <button 
          type='button' 
          onClick={sendData}
          className={classNames(classes.sendButton, detectClass('sendButton'))}
        >
          Send data to user
          <img className={classNames(classes.arrowIcon, detectClass('arrowIcon'))} src = {arrow} alt="arrow" />
        </button>
      </div>
      {isVisibleModalRemove && <MoalRemove
        tableElementName = {nameElementRemove}
        onConfirm = {onConfirm}
        onCancel = {onCancel}
        detectClass={detectClass}
      />}
    </div>
  )
}

Table.defaultProps = {
  emptyCellPlaceholder: '',
  cellSpacing: '0',
  onCeilEdit: (value) => value,
  onCeilBlur: (value) => value,
  onHeaderEdit: (value) => value,
  onHeaderBlur: (value) => value,
  minColumnSize: 300,
  tableClasses: {}
}

Table.propTypes = {
  tableColumns: PropTypes.arrayOf(
    PropTypes.shape({
      header: PropTypes.string,
      columnData: PropTypes.arrayOf(PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
      ])),
    })
  ).isRequired,
  emptyCellPlaceholder: PropTypes.string,
  cellSpacing: PropTypes.string,
  onCeilEdit: PropTypes.func,
  onCeilBlur: PropTypes.func,
  onHeaderEdit: PropTypes.func,
  onHeaderBlur: PropTypes.func,
  minColumnSize: PropTypes.number,
  tableClasses: PropTypes.shape({})
}

export default Table;
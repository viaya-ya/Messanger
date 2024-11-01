import React, { useState, useEffect, useRef } from 'react';
import './CustomSelect.css';

export default function CustomSelect({ organizations, selectOrganizations, setPolicyToOrganizations, isPolicyToOrganizations }) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  const selectRef = useRef(null);

  useEffect(() => {
    const array = selectOrganizations?.map((item) => item.organization.id)
    if (selectOrganizations) {
      setSelectedItems(array);
      setPolicyToOrganizations(array);
    }
  }, [selectOrganizations]);

  useEffect(() => {
    if (isPolicyToOrganizations) {
      setSelectedItems([]);
    }
  }, [isPolicyToOrganizations]);

  const toggleDropdown = () => setIsOpen(!isOpen);

  const handleSelectItem = (id) => {
    const isSelected = selectedItems.includes(id);
    let newSelectedItems;

    if (isSelected) {
      newSelectedItems = selectedItems.filter((item) => item !== id);
    } else {
      newSelectedItems = [...selectedItems, id];
    }

    setSelectedItems(newSelectedItems);
    setPolicyToOrganizations(newSelectedItems);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (selectRef.current && !selectRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="custom-select" ref={selectRef}>
      <div className="select-header" onClick={toggleDropdown}>
        {selectedItems.length > 0
          ? (
            <>
              Организации <span style={{ color: "red" }}>*</span> : {selectedItems.length}
            </>
          ) 
          :(
            <>
              Организации <span style={{ color: "red" }}>*</span>
            </>
          ) } 
        <span className={`arrow ${isOpen ? 'open' : ''}`}>
          ▼
        </span>
      </div>

      {isOpen && (
        <ul className="select-list">
          {organizations?.map((item) => (
            <li key={item.id} onClick={() => handleSelectItem(item.id)}>
              <input
                type="checkbox"
                checked={selectedItems.includes(item.id)}
                readOnly
              />
              {item.organizationName}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
import React, { useState, useEffect } from 'react';
import './UserManagement.css'; 
import sampleData from './sampleData';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import FirstPageIcon from '@mui/icons-material/FirstPage';
import LastPageIcon from '@mui/icons-material/LastPage';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const pageSize = 10;

  useEffect(() => {
    setUsers(sampleData);
    setFilteredUsers(sampleData);
  }, []);

  const handleSearch = () => {
    const filteredData = users.filter((user) =>
      Object.values(user).some((value) =>
        String(value).toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
    setFilteredUsers(filteredData);
    setCurrentPage(1);
  };

  const handleCheckboxChange = (userId) => {
    setSelectedRows((prevSelectedRows) => {
      if (prevSelectedRows.includes(userId)) {
        return prevSelectedRows.filter((id) => id !== userId);
      } else {
        return [...prevSelectedRows, userId];
      }
    });
  };

  const handleSelectAll = () => {
    const allPageUserIds = filteredUsers
      .slice((currentPage - 1) * pageSize, currentPage * pageSize)
      .map((user) => user.id);

    if (selectedRows.length === allPageUserIds.length) {
     setSelectedRows([]);
    } else {
      
      setSelectedRows(allPageUserIds);
    }
  };

  const handleDeleteSelected = () => {
    const updatedUsers = users.filter((user) => !selectedRows.includes(user.id));
    setUsers(updatedUsers);
    setSelectedRows([]);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const totalPages = Math.ceil(filteredUsers.length / pageSize);

  return (
    <div className="user-management-container">
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              handleSearch();
            }
          }}
        />
        
        <button className="search-icon" onClick={handleSearch}>
          Search
        </button>
      </div>

      <table className="user-table">
        <thead>
          <tr>
            <th>
              <input type="checkbox" onChange={handleSelectAll} />
            </th>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {filteredUsers
            .slice((currentPage - 1) * pageSize, currentPage * pageSize)
            .map((user) => (
              <tr
                key={user.id}
                className={`${
                  selectedRows.includes(user.id) ? 'selected-row' : ''
                } ${searchTerm &&
                  user.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
                  'filtered-row'}`}
              >
                <td>
                  <input
                    type="checkbox"
                    checked={selectedRows.includes(user.id)}
                    onChange={() => handleCheckboxChange(user.id)}
                  />
                </td>
                <td>{user.id}</td>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.role}</td>
                <td>
                <EditIcon
                    className="edit"
                    onClick={() => console.log(`Edit user ${user.id}`)}
                  />
                  <DeleteIcon
                    className="delete"
                    onClick={() => console.log(`Delete user ${user.id}`)}
                  />
                </td>
              </tr>
            ))}
        </tbody>
      </table>
      <span  className="selected-info">
        {`${selectedRows.length} out of ${filteredUsers.length} row(s) selected.`}
      </span>

      <div className="pagination">

      <span className="current-page">Page {currentPage}</span>
   of 
  <span className="total-pages">{totalPages}</span>
      <FirstPageIcon
          className="first-page"
          onClick={() => handlePageChange(1)}
          disabled={currentPage === 1}
        />
        <NavigateBeforeIcon
          className="previous-page"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        />
        
        {Array.from({ length: totalPages }).map((_, index) => (
          <button key={index} onClick={() => handlePageChange(index + 1)}>
            {index + 1}
          </button>
        ))}
        <NavigateNextIcon
          className="next-page"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        />
        <LastPageIcon
          className="last-page"
          onClick={() => handlePageChange(totalPages)}
          disabled={currentPage === totalPages}
        />
      </div>

      <div className="delete-button">
        <button className="delete-selected" onClick={handleDeleteSelected}>
          Delete Selected
        </button>
      </div>
    </div>
    
  );
};

export default UserManagement;

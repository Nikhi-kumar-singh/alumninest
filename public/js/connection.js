// app.js

document.addEventListener('DOMContentLoaded', () => {
    // Placeholder data for users (replace this with actual API calls)
    const users = [
      { id: 1, name: 'Dr. Alice Smith', role: 'Faculty', department: 'Computer Science' },
      { id: 2, name: 'Bob Johnson', role: 'Alumni', department: 'Civil Engineering' },
      { id: 3, name: 'Charlie Lee', role: 'Student', department: 'Mechanical Engineering' },
      // Add more users
    ];
  
    // Function to render users in the user list
    const renderUsers = (users) => {
      const userList = document.getElementById('user-list');
      userList.innerHTML = ''; // Clear the list
  
      users.forEach(user => {
        const listItem = document.createElement('li');
        listItem.className = 'list-group-item d-flex justify-content-between align-items-center';
        listItem.innerHTML = `
          <span>
            <strong>${user.name}</strong> - ${user.role} (${user.department})
          </span>
          <button class="btn btn-success btn-sm" data-user-id="${user.id}">Connect</button>
        `;
  
        // Add event listener for connect button
        listItem.querySelector('button').addEventListener('click', () => sendConnectionRequest(user.id));
  
        userList.appendChild(listItem);
      });
    };
  
    // Simulate fetching data from the backend
    renderUsers(users);
  
    // Function to send connection request
    const sendConnectionRequest = async (userId) => {
      try {
        const response = await fetch('/api/connections/connect', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userFromId: 'yourUserId', // Replace with actual logged-in user ID
            userFromModel: 'Alumni',  // Replace with actual logged-in user model
            userToId: userId,
            userToModel: 'Faculty'  // Change dynamically based on the user role
          })
        });
  
        const result = await response.json();
        if (response.ok) {
          alert('Connection request sent!');
        } else {
          alert(`Failed to send request: ${result.error}`);
        }
      } catch (error) {
        console.error('Error sending connection request:', error);
      }
    };
  
    // Add search functionality
    document.getElementById('search-bar').addEventListener('input', (e) => {
      const searchTerm = e.target.value.toLowerCase();
      const filteredUsers = users.filter(user =>
        user.name.toLowerCase().includes(searchTerm) ||
        user.role.toLowerCase().includes(searchTerm) ||
        user.department.toLowerCase().includes(searchTerm)
      );
      renderUsers(filteredUsers);
    });
  });
  
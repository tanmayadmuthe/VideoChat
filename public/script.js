document.addEventListener('DOMContentLoaded', () => {
  // Get references to HTML elements
  const createRoomButton = document.getElementById('create-room-button');
  const joinRoomButton = document.getElementById('join-room-button');
  const roomNameInput = document.getElementById('room-name');  // Update this line to match your HTML
  const joinRoomNameInput = document.getElementById('join-room-name');

  // Add event listener for creating a room
  createRoomButton.addEventListener('click', () => {
    const roomName = roomNameInput.value.trim();

    if (roomName) {
      // Send a message to the server to create the room
      const message = { type: 'create-room', roomName };
      sendToServer(message);
    } else {
      alert('Please enter a room name.');
    }
  });

  // Add event listener for joining a room
  joinRoomButton.addEventListener('click', () => {
    const roomName = joinRoomNameInput.value.trim();

    if (roomName) {
      // Send a message to the server to join the room
      const message = { type: 'join-room', roomName };
      sendToServer(message);
    } else {
      alert('Please enter a room name to join.');
    }
  });

  // Function to send messages to the server using WebSocket
  function sendToServer(message) {
    // Replace 'ws://your-server-url' with the WebSocket server URL you are using
    const socket = new WebSocket('ws://192.168.171.53:3000');

    socket.onopen = () => {
      // WebSocket connection is open, send the message
      socket.send(JSON.stringify(message));
    };

    socket.onmessage = (event) => {
      // Handle server responses or messages sent from the server
      const serverMessage = JSON.parse(event.data);

      // You can add logic to handle different message types from the server here
      // For example:
      if (serverMessage.type === 'room-created') {
        // Handle room creation response
        console.log('Room created:', serverMessage.roomName);
      } else if (serverMessage.type === 'room-joined') {
        // Handle room joining response
        console.log('Joined room:', serverMessage.roomName);
      }
      // Add more cases as needed
    };

    socket.onclose = () => {
      // WebSocket connection is closed
      console.log('WebSocket connection closed');
    };

    socket.onerror = (error) => {
      // Handle any WebSocket connection errors
      console.error('WebSocket error:', error);
    };
  }
});

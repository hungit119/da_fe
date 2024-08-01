const SOCKET_URL = 'ws://localhost:80';

const socket = new WebSocket(SOCKET_URL);

socket.onopen = () => {
	console.log(';WebSocket connection established')
}

socket.onmessage = (event) => {
};
socket.onclose = () => {
	console.log('WebSocket connection closed');
};
socket.onerror = (error) => {
	console.error('WebSocket error:', error);
};

export default socket;

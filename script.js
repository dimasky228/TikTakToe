const contractAddress = '0x84c7c3586f1c5856970ba926af32bbe45654f95c';
const contractABI = [
	{
		"inputs": [],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "gameId",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "enum TicTacToe.GameState",
				"name": "result",
				"type": "uint8"
			},
			{
				"indexed": false,
				"internalType": "address",
				"name": "winner",
				"type": "address"
			}
		],
		"name": "GameEnded",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "gameId",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "address",
				"name": "player1",
				"type": "address"
			}
		],
		"name": "GameStarted",
		"type": "event"
	},
	{
		"inputs": [],
		"name": "joinGame",
		"outputs": [],
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint8",
				"name": "position",
				"type": "uint8"
			}
		],
		"name": "makeMove",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "gameId",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "address",
				"name": "player",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint8",
				"name": "position",
				"type": "uint8"
			}
		],
		"name": "MoveMade",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "gameId",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "address",
				"name": "player2",
				"type": "address"
			}
		],
		"name": "PlayerJoined",
		"type": "event"
	},
	{
		"inputs": [],
		"name": "startGame",
		"outputs": [],
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "board",
		"outputs": [
			{
				"internalType": "uint8",
				"name": "",
				"type": "uint8"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "currentPlayer",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "gameActive",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "gameId",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getBoard",
		"outputs": [
			{
				"internalType": "uint8[9]",
				"name": "",
				"type": "uint8[9]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getGameState",
		"outputs": [
			{
				"internalType": "enum TicTacToe.GameState",
				"name": "",
				"type": "uint8"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getStake",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "player1",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "player2",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "stake",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "state",
		"outputs": [
			{
				"internalType": "enum TicTacToe.GameState",
				"name": "",
				"type": "uint8"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
        ];


let web3;
let contract;
let userAccount;
let gameActive = false;

const statusEl = document.getElementById('status');
const balanceEl = document.getElementById('balance');
const connectWalletBtn = document.getElementById('connectWallet');
const startGameBtn = document.getElementById('startGame');
const joinGameBtn = document.getElementById('joinGame');
const gameBoard = document.getElementById('gameBoard');

connectWalletBtn.addEventListener('click', connectWallet);
startGameBtn.addEventListener('click', startGame);
joinGameBtn.addEventListener('click', joinGame);

async function connectWallet() {
    console.log("Connect Wallet button clicked");
    statusEl.textContent = "Attempting to connect wallet...";
    
    if (typeof window.ethereum !== 'undefined') {
        console.log("MetaMask is installed");
        try {
            console.log("Requesting accounts...");
            const accounts = await Promise.race([
                window.ethereum.request({ method: 'eth_requestAccounts' }),
                new Promise((_, reject) =>
                    setTimeout(() => reject(new Error('Timeout')), 10000)
                )
            ]);
            console.log("Accounts received:", accounts);
            web3 = new Web3(window.ethereum);
            userAccount = accounts[0];
            console.log("User account:", userAccount);
            
            // Инициализация контракта
            contract = new web3.eth.Contract(contractABI, contractAddress);
            console.log("Contract instance created");
            
            statusEl.textContent = `Connected: ${userAccount}`;
            connectWalletBtn.disabled = true;
            startGameBtn.disabled = false;
            joinGameBtn.disabled = false;
            console.log("Wallet connected successfully");

            // После успешного подключения:
            await updateBalance();
            await checkGameState();
            listenToEvents();
        } catch (error) {
            console.error("Error requesting accounts:", error);
            if (error.message === 'Timeout') {
                statusEl.textContent = 'Connection request timed out. Please try again.';
            } else {
                statusEl.textContent = 'Failed to connect wallet: ' + error.message;
            }
        }
    } else {
        console.log("MetaMask is not installed, trying WalletConnect");
        statusEl.textContent = "MetaMask not detected, trying WalletConnect...";
        try {
            const provider = new WalletConnectProvider({
                rpc: {
                    64165: 'https://rpc.testnet.soniclabs.com'
                }
            });
            await provider.enable();
            console.log("WalletConnect enabled");
            web3 = new Web3(provider);
            const accounts = await web3.eth.getAccounts();
            console.log("Accounts received:", accounts);
            userAccount = accounts[0];
            console.log("User account:", userAccount);
            
            // Инициализация контракта
            contract = new web3.eth.Contract(contractABI, contractAddress);
            console.log("Contract instance created");
            
            statusEl.textContent = `Connected: ${userAccount}`;
            connectWalletBtn.disabled = true;
            startGameBtn.disabled = false;
            joinGameBtn.disabled = false;
            console.log("Wallet connected successfully via WalletConnect");

            // После успешного подключения:
            await updateBalance();
            await checkGameState();
            listenToEvents();
        } catch (error) {
            console.error("Error connecting via WalletConnect:", error);
            statusEl.textContent = 'Failed to connect wallet: ' + error.message;
        }
    }
}

async function updateBalance() {
    const balance = await web3.eth.getBalance(userAccount);
    const balanceInS = web3.utils.fromWei(balance, 'ether');
    balanceEl.textContent = `Balance: ${balanceInS} S`;
}

async function checkGameState() {
    const gameActive = await contract.methods.gameActive().call();
    const player1 = await contract.methods.player1().call();
    const player2 = await contract.methods.player2().call();

    if (!gameActive) {
        startGameBtn.disabled = false;
        joinGameBtn.disabled = true;
        statusEl.textContent = "No active game. Start a new one!";
    } else if (player1 !== userAccount && player2 === '0x0000000000000000000000000000000000000000') {
        startGameBtn.disabled = true;
        joinGameBtn.disabled = false;
        statusEl.textContent = "Game waiting for second player. Join?";
    } else if (player1 === userAccount || player2 === userAccount) {
        startGameBtn.disabled = true;
        joinGameBtn.disabled = true;
        await updateBoard();
    } else {
        startGameBtn.disabled = true;
        joinGameBtn.disabled = true;
        statusEl.textContent = "Game in progress. Wait for it to finish.";
    }
}

async function startGame() {
    try {
        const stake = await contract.methods.getStake().call();
        await contract.methods.startGame().send({ from: userAccount, value: stake });
        gameActive = true;
        createBoard();
        statusEl.textContent = "Game started. Waiting for another player...";
        startGameBtn.disabled = true;
        joinGameBtn.disabled = true;
        await updateBalance();
        await checkGameState();
    } catch (error) {
        console.error("Error starting game:", error);
        statusEl.textContent = 'Failed to start game: ' + error.message;
    }
}

async function joinGame() {
    try {
        const stake = await contract.methods.getStake().call();
        console.log("Required stake:", web3.utils.fromWei(stake, 'ether'), "S");

        const gasEstimate = await contract.methods.joinGame().estimateGas({from: userAccount, value: stake});
        console.log("Estimated gas:", gasEstimate);

        const gasPrice = await web3.eth.getGasPrice();
        console.log("Current gas price:", web3.utils.fromWei(gasPrice, 'gwei'), "gwei");

        const totalCost = web3.utils.toBN(stake).add(web3.utils.toBN(gasEstimate).mul(web3.utils.toBN(gasPrice)));
        console.log("Total estimated cost:", web3.utils.fromWei(totalCost, 'ether'), "S");

        const balance = await web3.eth.getBalance(userAccount);
        console.log("Your balance:", web3.utils.fromWei(balance, 'ether'), "S");

        if (web3.utils.toBN(balance).lt(web3.utils.toBN(totalCost))) {
            throw new Error("Insufficient balance to cover stake and gas costs");
        }

        const transaction = await contract.methods.joinGame().send({
            from: userAccount,
            value: stake,
            gas: Math.floor(gasEstimate * 1.2), // Увеличиваем лимит газа на 20%
            gasPrice: gasPrice
        });

        console.log("Transaction successful:", transaction.transactionHash);
        gameActive = true;
        createBoard();
        statusEl.textContent = "Joined the game. Waiting for your turn...";
        joinGameBtn.disabled = true;
        await updateBalance();
        await updateBoard();
    } catch (error) {
        console.error("Error joining game:", error);
        statusEl.textContent = 'Failed to join game: ' + error.message;
    }
}

function createBoard() {
    gameBoard.innerHTML = '';
    for (let i = 0; i < 9; i++) {
        const cell = document.createElement('div');
        cell.className = 'cell';
        cell.dataset.index = i;
        cell.addEventListener('click', () => makeMove(i));
        gameBoard.appendChild(cell);
    }
}

async function makeMove(index) {
    if (!gameActive) return;
    
    try {
        await contract.methods.makeMove(index).send({ from: userAccount });
        await updateBoard();
        await updateBalance();
    } catch (error) {
        console.error("Error making move:", error);
        statusEl.textContent = 'Failed to make move: ' + error.message;
    }
}

async function updateBoard() {
    const board = await contract.methods.getBoard().call();
    const cells = gameBoard.getElementsByClassName('cell');
    for (let i = 0; i < 9; i++) {
        cells[i].textContent = board[i] === '1' ? 'X' : board[i] === '2' ? 'O' : '';
    }

    const gameState = await contract.methods.getGameState().call();
    const currentPlayer = await contract.methods.currentPlayer().call();

    if (gameState === '1') {
        statusEl.textContent = "Player X wins!";
        gameActive = false;
    } else if (gameState === '2') {
        statusEl.textContent = "Player O wins!";
        gameActive = false;
    } else if (gameState === '3') {
        statusEl.textContent = "It's a draw!";
        gameActive = false;
    } else {
        statusEl.textContent = currentPlayer === userAccount ? "Your turn" : "Opponent's turn";
    }

    if (!gameActive) {
        await checkGameState();
    }
}

function listenToEvents() {
    contract.events.GameStarted()
        .on('data', async (event) => {
            console.log("Game started:", event.returnValues);
            await checkGameState();
        });

    contract.events.PlayerJoined()
        .on('data', async (event) => {
            console.log("Player joined:", event.returnValues);
            await checkGameState();
        });

    contract.events.MoveMade()
        .on('data', async (event) => {
            console.log("Move made:", event.returnValues);
            await updateBoard();
        });

    contract.events.GameEnded()
        .on('data', async (event) => {
            console.log("Game ended:", event.returnValues);
            await checkGameState();
            await updateBalance();
        });
}
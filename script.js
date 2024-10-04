let ethereum;
let web3;
let contract;
let userAccount;
let gameActive = false;

const SONIC_TESTNET_PARAMS = {
    chainId: '0xFAA5', // 64165 в шестнадцатеричном формате
    chainName: 'Sonic Testnet',
    nativeCurrency: {
        name: 'S',
        symbol: 'S',
        decimals: 18
    },
    rpcUrls: ['https://rpc.testnet.soniclabs.com'],
    blockExplorerUrls: ['https://testnet.soniclabs.com']
};

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

const statusEl = document.getElementById('status');
const balanceEl = document.getElementById('balance');
const connectWalletBtn = document.getElementById('connectWallet');
const startGameBtn = document.getElementById('startGame');
const joinGameBtn = document.getElementById('joinGame');
const gameBoard = document.getElementById('gameBoard');

connectWalletBtn.addEventListener('click', connectWallet);
startGameBtn.addEventListener('click', startGame);
joinGameBtn.addEventListener('click', joinGame);

function getEthereum() {
    if (typeof window.ethereum !== 'undefined') {
        return window.ethereum;
    } else if (typeof window.web3 !== 'undefined') {
        return window.web3.currentProvider;
    }
    return null;
}

function isMetaMaskInstalled() {
    ethereum = getEthereum();
    return ethereum !== null;
}

async function switchToSonicTestnet() {
    try {
        await ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: SONIC_TESTNET_PARAMS.chainId }],
        });
        console.log("Successfully switched to Sonic Testnet");
    } catch (switchError) {
        console.log("Error switching chain:", switchError);
        if (switchError.code === 4902) {
            try {
                await ethereum.request({
                    method: 'wallet_addEthereumChain',
                    params: [SONIC_TESTNET_PARAMS],
                });
                console.log("Successfully added Sonic Testnet");
            } catch (addError) {
                console.error("Error adding Sonic Testnet:", addError);
                const message = `
                    Unable to automatically add Sonic Testnet. Please add it manually with these parameters:
                    Network Name: ${SONIC_TESTNET_PARAMS.chainName}
                    New RPC URL: ${SONIC_TESTNET_PARAMS.rpcUrls[0]}
                    Chain ID: ${parseInt(SONIC_TESTNET_PARAMS.chainId, 16)}
                    Currency Symbol: ${SONIC_TESTNET_PARAMS.nativeCurrency.symbol}
                    Block Explorer URL: ${SONIC_TESTNET_PARAMS.blockExplorerUrls[0]}
                `;
                alert(message);
                throw new Error("Failed to add Sonic Testnet: " + addError.message);
            }
        } else {
            throw new Error("Failed to switch to Sonic Testnet: " + switchError.message);
        }
    }
}

async function connectWallet() {
    console.log("Connect Wallet button clicked");
    statusEl.textContent = "Attempting to connect wallet...";
    
    if (isMetaMaskInstalled()) {
        console.log("MetaMask is installed");
        try {
            console.log("Requesting accounts...");
            const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
            console.log("Accounts received:", accounts);
            
            console.log("Switching to Sonic Testnet...");
            await switchToSonicTestnet();
            
            web3 = new Web3(ethereum);
            userAccount = accounts[0];
            console.log("User account:", userAccount);
            
            console.log("Initializing contract...");
            contract = new web3.eth.Contract(contractABI, contractAddress);
            console.log("Contract instance created");
            
            statusEl.textContent = `Connected: ${userAccount}`;
            connectWalletBtn.disabled = true;
            startGameBtn.disabled = false;
            joinGameBtn.disabled = false;
            console.log("Wallet connected successfully");

            await updateBalance();
            await checkGameState();
            listenToEvents();
        } catch (error) {
            console.error("Error in MetaMask connection process:", error);
            statusEl.textContent = 'Failed to connect wallet: ' + error.message;
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
            
            contract = new web3.eth.Contract(contractABI, contractAddress);
            console.log("Contract instance created");
            
            statusEl.textContent = `Connected: ${userAccount}`;
            connectWalletBtn.disabled = true;
            startGameBtn.disabled = false;
            joinGameBtn.disabled = false;
            console.log("Wallet connected successfully via WalletConnect");

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
    try {
        const balance = await web3.eth.getBalance(userAccount);
        const balanceInS = web3.utils.fromWei(balance, 'ether');
        balanceEl.textContent = `Balance: ${parseFloat(balanceInS).toFixed(4)} S`;
    } catch (error) {
        console.error("Error updating balance:", error);
        balanceEl.textContent = "Error fetching balance";
    }
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
        await contract.methods.joinGame().send({ from: userAccount, value: stake });
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

const bodyParser = require('body-parser');
const express = require('express');
const { Web3 } = require('web3');

const app = express();
const port = 3000;

const web3 = new Web3('http://127.0.0.1:7545');

const contractAddress = '0x7AAe646273DC7d9bB63BE0cE2891448fc8aB60A5';
const abi = [
	{
		"constant": false,
		"inputs": [
			{
				"name": "_bookId",
				"type": "uint256"
			},
			{
				"name": "_title",
				"type": "string"
			},
			{
				"name": "_author",
				"type": "string"
			},
			{
				"name": "_totalCopies",
				"type": "uint256"
			}
		],
		"name": "addBook",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"name": "",
				"type": "uint256"
			}
		],
		"name": "forms",
		"outputs": [
			{
				"name": "bookId",
				"type": "uint256"
			},
			{
				"name": "reader",
				"type": "address"
			},
			{
				"name": "returnDate",
				"type": "uint256"
			},
			{
				"name": "isTaken",
				"type": "bool"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "_bookId",
				"type": "uint256"
			},
			{
				"name": "_returnDate",
				"type": "uint256"
			}
		],
		"name": "borrowBook",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"name": "",
				"type": "uint256"
			}
		],
		"name": "books",
		"outputs": [
			{
				"name": "title",
				"type": "string"
			},
			{
				"name": "author",
				"type": "string"
			},
			{
				"name": "totalCopies",
				"type": "uint256"
			},
			{
				"name": "leftCopies",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"name": "",
				"type": "address"
			}
		],
		"name": "memberShips",
		"outputs": [
			{
				"name": "reader",
				"type": "address"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "_bookId",
				"type": "uint256"
			}
		],
		"name": "returnBook",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "admin",
		"outputs": [
			{
				"name": "",
				"type": "address"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "constructor"
	}
]

const contract = new web3.eth.Contract(abi, contractAddress);

app.use(express.json());
app.use(bodyParser.urlencoded({
	extended: true
}));

function isAdmin(req, res, next) {
	const userAddress = req.headers['user-address'];
	console.log(userAddress)
	next();
}

app.get('/admin', async (req, res) => {
	try {
		const admin = await contract.methods.admin().call();
		res.json({ admin });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

app.get('/books', async (req, res) => {
	const { bookId } = req.query;
	try {
		const book = await contract.methods.books(bookId).call();
		const responseEntity = {
			title: book.title,
			author: book.author,
			totalCopies: book.totalCopies,
			leftCopies: book.leftCopies
		}
		responseEntity.author = responseEntity.author.toString()
		responseEntity.title = responseEntity.title.toString()
		responseEntity.totalCopies = responseEntity.totalCopies.toString()
		responseEntity.leftCopies = responseEntity.leftCopies.toString()
		res.json(responseEntity);
	} catch (error) {
		console.log(error)
		res.status(500).json({ error: error.message });
	}
});
app.get('/forms', async (req, res) => {
	const { bookId } = req.query;
	try {
		const form = await contract.methods.forms(bookId).call()
		const date = new Date(parseInt(form.returnDate.toString()) * 1000);
		const responseEntity = {
			bookId: bookId,
			reader: form.reader,
			returnDate: date,
			isTaken: form.isTaken
		}
		responseEntity.bookId = responseEntity.bookId.toString()
		responseEntity.reader = responseEntity.reader.toString()
		responseEntity.returnDate = responseEntity.returnDate.toString()
		responseEntity.isTaken = responseEntity.isTaken.toString()
		res.json(responseEntity);
	} catch (error) {
		console.log(error)
		res.status(500).json({ msg: error.message })
	}
})
app.post('/addBook', async (req, res) => {
	const { bookId, title, author, totalCopies } = req.body
	try {
		const accounts = await web3.eth.getAccounts();
		const result = await contract.methods.addBook(bookId, title, author, totalCopies).send({ from: accounts[0], gas: 300000 });
		res.json({ transactionHash: result.transactionHash });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

app.post('/borrowBook', isAdmin, async (req, res) => {
	const { bookId, returnDate } = req.body;

	const returnTimestamp = new Date(returnDate).getTime() / 1000; // делим на 1000, чтобы получить время в секундах

	try {
		const accounts = await web3.eth.getAccounts();
		const result = await contract.methods.borrowBook(bookId, returnTimestamp).send({ from: accounts[0], gas: 300000 });
		res.json({ hash: result.transactionHash });
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: "Такие книги уже закончились." });
	}
});

app.post('/returnBook', async (req, res) => {
	const { bookId } = req.body;
	try {
		const accounts = await web3.eth.getAccounts();
		const result = await contract.methods.returnBook(bookId).send({ from: accounts[0], gas: 300000 });
		res.json({ transactionHash: result.transactionHash });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Подключение к статическим файлам в папке "public"
app.use(express.static('public'));

// Обработчик маршрута для основной страницы
app.get('/', (req, res) => {
	res.sendFile('C:/Users/timos/OneDrive/Рабочий стол/блохчей/prevedmedved/public/index.html');
});
app.get('/borrow-book', (req, res) => {
	res.sendFile('C:/Users/timos/OneDrive/Рабочий стол/блохчей/prevedmedved/public/bbok.html');
});
app.get('/book-form', (req, res) => {
	res.sendFile('C:/Users/timos/OneDrive/Рабочий стол/блохчей/prevedmedved/public/bookForm.html');
});
app.get('/book', (req, res) => {
	res.sendFile('C:/Users/timos/OneDrive/Рабочий стол/блохчей/prevedmedved/public/book.html');
});
app.get('/returnbook', (req, res) => {
	res.sendFile('C:/Users/timos/OneDrive/Рабочий стол/блохчей/prevedmedved/public/returnBook.html');
});
app.get('/admin', (req, res) => {
	res.sendFile('C:/Users/timos/OneDrive/Рабочий стол/блохчей/prevedmedved/public/admin.html');
});

app.listen(port, () => {
	console.log(`Server is running on http://localhost:${port}`);
});
function addBook() {
	const bookId = document.getElementById('bookId').value;
	const title = document.getElementById('title').value;
	const author = document.getElementById('author').value;
	const totalCopies = document.getElementById('totalCopies').value;

	fetch('/addBook', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({
			bookId,
			title,
			author,
			totalCopies,
		}),
	})
		.then(response => response.json())
		.then(data => {
			displayInfo(`Book added successfully. Transaction Hash: ${data.transactionHash}`);
		})
		.catch(error => {
			displayInfo(`Error: ${error.message}`);
		});
}

function displayInfo(message) {
	const infoContainer = document.getElementById('infoContainer');
	const infoParagraph = document.createElement('p');
	infoParagraph.textContent = message;
	infoContainer.appendChild(infoParagraph);
}

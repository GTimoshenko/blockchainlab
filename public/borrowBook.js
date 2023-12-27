async function borrowBook() {
	const bookId = document.getElementById('bookId').value;
	const returnDate = document.getElementById('returnDate').value;

	try {
		const response = await fetch('/borrowBook', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				bookId,
				returnDate,
			}),
		});

		const data = await response.json();

		// Обновите DOM с результатом транзакции
		const resultContainer = document.getElementById('resultContainer');
		resultContainer.innerHTML = `<p>Transaction Hash: ${data.hash}</p>`;
		window.location.href = '/book-form';
	} catch (error) {
		console.error(error);

		// Обновите DOM с сообщением об ошибке
		const resultContainer = document.getElementById('resultContainer');
		resultContainer.innerHTML = `<p>Error: ${error.message}</p>`;
	}
}

async function returnBook() {
	const bookId = document.getElementById('bookId').value;

	try {
		const response = await fetch('/returnBook', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ bookId: bookId }),
		});

		const data = await response.json();

		// Обновите DOM с полученной информацией
		document.getElementById('transactionHashResult').textContent = `Transaction Hash: ${data.transactionHash}`;

		// Перенаправление на страницу book после успешного возврата
		window.location.href = '/book';
	} catch (error) {
		console.error(error);
		// В случае ошибки, вы можете также обновить DOM с сообщением об ошибке
	}
}

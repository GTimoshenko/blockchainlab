async function getBookInfo() {
	const bookId = document.getElementById('bookId').value;

	try {
		const response = await fetch(`/forms?bookId=${bookId}`);
		const data = await response.json();

		// Обновите DOM с полученной информацией
		document.getElementById('bookIdResult').textContent = `Book ID: ${data.bookId}`;
		document.getElementById('reader').textContent = `Reader: ${data.reader}`;
		document.getElementById('returnDate').textContent = `Return Date: ${data.returnDate}`;
		document.getElementById('isTaken').textContent = `Is Taken: ${data.isTaken}`;
	} catch (error) {
		console.error(error);
		// В случае ошибки, вы можете также обновить DOM с сообщением об ошибке
	}
}

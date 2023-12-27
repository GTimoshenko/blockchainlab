async function getBookInfo() {
	const bookId = document.getElementById('bookId').value;

	try {
		const response = await fetch(`/books?bookId=${bookId}`);
		const data = await response.json();

		// Обновите DOM с полученной информацией
		document.getElementById('title').textContent = `Title: ${data.title}`;
		document.getElementById('author').textContent = `Author: ${data.author}`;
		document.getElementById('totalCopies').textContent = `Total Copies: ${data.totalCopies}`;
		document.getElementById('leftCopies').textContent = `Left Copies: ${data.leftCopies}`;
	} catch (error) {
		console.error(error);
		// В случае ошибки, вы можете также обновить DOM с сообщением об ошибке
	}
}

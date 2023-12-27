// Получение информации о админе при загрузке страницы
window.onload = async function () {
	try {
		const response = await fetch('/admin');
		const data = await response.json();

		// Обновите DOM с полученной информацией
		document.getElementById('adminInfoContainer').textContent = `Admin Address: ${data.admin}`;
	} catch (error) {
		console.error(error);
		// В случае ошибки, вы можете также обновить DOM с сообщением об ошибке
		document.getElementById('adminInfoContainer').textContent = 'Error fetching admin information.';
	}
};

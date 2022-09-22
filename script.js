window.addEventListener('DOMContentLoaded', () => {
	const STORAGE_KEY = 'TODO_APPS';
	const SAVED_EVENT = 'SAVED_EVENT';

	const getElement = (selector) => {
		return document.querySelector(selector);
	}

	const generateId = () => {
		return +new Date();
	}

	function isStorageExist() {
		if (typeof (Storage) === undefined) {
			alert('Browser kamu tidak mendukung local storage');
			return false;
		}
		return true;
	}

	const loadBookDataFromStorage = () => {
		const books = localStorage.getItem(STORAGE_KEY);
		return JSON.parse(books);
	}

	const saveBookData = (book) => {
		if (isStorageExist()) {
			const books = loadBookDataFromStorage();
			const parsed = JSON.stringify([...books, book]);
			localStorage.setItem(STORAGE_KEY, parsed);
			document.dispatchEvent(new Event(SAVED_EVENT));
		}
	}

	const deleteBook = (id) => {
		if (isStorageExist()) {
			const books = loadBookDataFromStorage();
			const filteredBook = books.filter((book) => book.id !== id);
			const parsed = JSON.stringify(filteredBook);
			localStorage.setItem(STORAGE_KEY, parsed);
			document.dispatchEvent(new Event(SAVED_EVENT));
		}
	}

	const changeCompleteRead = (id) => {
		if (isStorageExist()) {
			const books = loadBookDataFromStorage();
			const filteredBook = books.filter((book) => {
				if (book.id === id) {
					book.isComplete = !book.isComplete;
				}
				return book;
			});
			const parsed = JSON.stringify(filteredBook);
			localStorage.setItem(STORAGE_KEY, parsed);
			document.dispatchEvent(new Event(SAVED_EVENT));
		}
	}

	const initLocalStorage = () => {
		if (isStorageExist()) {
			const books = loadBookDataFromStorage();
			if (!books) {
				localStorage.setItem(STORAGE_KEY, JSON.stringify([]));
			}
		}
	}

	const handleAddBook = () => {
		const inputBookTitle = getElement('#inputBookTitle');
		const inputBookAuthor = getElement('#inputBookAuthor');
		const inputBookYear = getElement('#inputBookYear');
		const inputBookIsComplete = getElement('#inputBookIsComplete');

		const book = {
			id: generateId(),
			title: inputBookTitle?.value,
			author: inputBookAuthor?.value,
			year: inputBookYear?.value,
			isComplete: inputBookIsComplete?.checked,
		}

		saveBookData(book);
		toggleModalAddBook();
	}

	const handleSearchBook = () => {
		const inputSearchBook = getElement('#inputSearchBook');
		
	}

	const buttonAddBook = getElement('#buttonAddBook');
	const modalAddBook = getElement('#modalAddBook');
	const buttonCloseModalAddBook = getElement('#buttonCloseModalAddBook');
	const formAddBook = getElement('#formAddBook');
	const unfinishedRead = getElement('#unfinishedRead');
	const finishedRead = getElement('#finishedRead');
	const formSearchBook = getElement('#formSearchBook');

	const toggleModalAddBook = () => {
		const currentDisplay = modalAddBook.style.display;
		modalAddBook.style.display = currentDisplay === 'none' || !currentDisplay ? 'block' : 'none';
	};

	const showBooks = () => {
		const books = loadBookDataFromStorage();

		const unfinishedList = books.filter((book) => !book.isComplete);
		const finishedList = books.filter((book) => book.isComplete);

		const unfinishedListElement = unfinishedList?.map((book) => {
			return `
				<div class="book-item">
					<div style="display:none">${book.id}</div>
					<div>
						<div class="book-title">${book.title}</div>
						<div>${book.year}</div>
					</div>
					<div>${book.author}</div>
					<div class="book-action">
						<button onClick="(() => onClickButtonBook(${book.id}))()" class="btn btn-small">Selesai Dibaca</button>
						<button onClick="(() => onClickDeleteBook(${book.id}))()" class="btn btn-small btn-danger">Hapus</button>
					</div>
				</div>
			`
		});

		const finishedListElement = finishedList?.map((book) => {
			return `
				<div class="book-item">
					<div style="display:none">${book.id}</div>
					<div>
						<div class="book-title">${book.title}</div>
						<div>${book.year}</div>
					</div>
					<div>${book.author}</div>
					<div class="book-action">
						<button onClick="(() => onClickButtonBook(${book.id}))()" class="btn btn-small">Belum Selesai Dibaca</button>
						<button onClick="(() => onClickDeleteBook(${book.id}))()" class="btn btn-small btn-danger">Hapus</button>
					</div>
				</div>
			`
		});

		const emptyBook = () => {
			return '<div class="no-data-yet">Belum ada Data</div>';
		}

		unfinishedRead.innerHTML = "";
		finishedRead.innerHTML = "";
		unfinishedRead.insertAdjacentHTML('beforeend', unfinishedListElement.join(''));
		finishedRead.insertAdjacentHTML('beforeend', finishedListElement.join(''));

		if (unfinishedList.length === 0) {
			unfinishedRead.insertAdjacentHTML('beforeend', emptyBook());
		}
		if (finishedList.length === 0) {
			finishedRead.insertAdjacentHTML('beforeend', emptyBook());
		}
	}

	buttonAddBook.addEventListener('click', () => {
		toggleModalAddBook();
	});

	modalAddBook.addEventListener('click', function (e) {
		if (this === (window.event || e).target) {
			toggleModalAddBook();
		}
	});

	buttonCloseModalAddBook.addEventListener('click', function (e) {
		toggleModalAddBook();
		loadBookDataFromStorage();
	});

	formAddBook.addEventListener('submit', (e) => {
		e.preventDefault();
		handleAddBook();
	});

	document.addEventListener(SAVED_EVENT, () => {
		showBooks();
	});

	formSearchBook.addEventListener('submit', () => {
		handleSearchBook();
	});

	initLocalStorage();
	showBooks();

	window.onClickDeleteBook = (id) => {
		deleteBook(id);
	}

	window.onClickButtonBook = (id) => {
		changeCompleteRead(id);
	}
});
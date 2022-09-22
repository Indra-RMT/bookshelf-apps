window.addEventListener('DOMContentLoaded', () => {
	const STORAGE_KEY = 'TODO_APPS_INDRA_RAHMANTO';
	const SAVED_EVENT = 'SAVED_EVENT';

	const getElement = (selector) => {
		return document.querySelector(selector);
	}

	const generateId = () => {
		return +new Date();
	}

	const isStorageExist = () => {
		if (typeof (Storage) === undefined) {
			alert('Browser kamu tidak mendukung local storage');
			return false;
		}
		return true;
	}

	const filterByValue = (books, string) => {
		return books.filter((book) => book.title?.toString().toLowerCase().includes(string.toLowerCase()));
	}

	const loadBookDataFromStorage = () => {
		const books = localStorage.getItem(STORAGE_KEY);
		return JSON.parse(books);
	}

	const searchBook = (value) => {
		if (!value) return [];
		const books = loadBookDataFromStorage();
		const filteredBooks = filterByValue(books, value);
		return filteredBooks;
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
			if (!books && STORAGE_KEY.includes('APPS_INDRA')) {
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

		inputBookTitle.value = '';
		inputBookAuthor.value = '';
		inputBookYear.value = '';
		inputBookIsComplete.checked = false;

		saveBookData(book);
		toggleModalAddBook();
	}

	const toggleModalAddBook = () => {
		const modalAddBook = getElement('#modalAddBook');
		const currentDisplay = modalAddBook.style.display;
		modalAddBook.style.display = currentDisplay === 'none' || !currentDisplay ? 'block' : 'none';
	};

	const toggleModalConfirmDelete = () => {
		const modalConfirmDelete = getElement('#modalConfirmDelete');
		const currentDisplay = modalConfirmDelete.style.display;
		modalConfirmDelete.style.display = currentDisplay === 'none' || !currentDisplay ? 'block' : 'none';
	};

	const showBooks = (books) => {
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

		const unfinishedRead = getElement('#unfinishedRead');
		const finishedRead = getElement('#finishedRead');
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

	const initBooks = () => {
		const { value } = getElement('#inputSearchBook');
		const searchResult = getElement('#searchResult');
		const searchKeyword = getElement('#searchKeyword');
		let books = [];

		if (books.length === 0 && value === '') {
			searchResult.style.display = 'none';
		} else {
			searchKeyword.innerHTML = `"${value}"`;
			searchResult.style.display = 'block';
		}

		if (value) {
			books = searchBook(value);
		} else {
			books = loadBookDataFromStorage();
		}
		showBooks(books);
	}

	const initListeners = () => {
		const buttonAddBook = getElement('#buttonAddBook');
		const modalAddBook = getElement('#modalAddBook');
		const modalConfirmDelete = getElement('#modalConfirmDelete');
		const buttonCloseModalAddBook = getElement('#buttonCloseModalAddBook');
		const buttonCloseModalConfirmDelete = getElement('#buttonCloseModalConfirmDelete');
		const formAddBook = getElement('#formAddBook');
		const inputSearchBook = getElement('#inputSearchBook');

		buttonAddBook.addEventListener('click', () => {
			toggleModalAddBook();
		});

		modalAddBook.addEventListener('click', function (e) {
			if (this === (window.event || e).target) {
				toggleModalAddBook();
			}
		});

		modalConfirmDelete.addEventListener('click', function (e) {
			if (this === (window.event || e).target) {
				toggleModalConfirmDelete();
			}
		});

		buttonCloseModalAddBook.addEventListener('click', () => {
			toggleModalAddBook();
			loadBookDataFromStorage();
		});

		buttonCloseModalConfirmDelete.addEventListener('click', () => {
			toggleModalConfirmDelete();
		});

		formAddBook.addEventListener('submit', (e) => {
			e.preventDefault();
			handleAddBook();
		});

		document.addEventListener(SAVED_EVENT, () => {
			initBooks()
		});

		inputSearchBook.addEventListener('input', () => {
			initBooks();
		})
	}

	initLocalStorage();
	initBooks();
	initListeners();

	window.onClickDeleteBook = (id) => {
		toggleModalConfirmDelete();
		confirmDeleteBookId = id;
		const buttonDeleteBook = getElement('#buttonDeleteBook');
		buttonDeleteBook.addEventListener('click', () => {
			deleteBook(id);
			toggleModalConfirmDelete();
		})
	}

	window.onClickButtonBook = (id) => {
		changeCompleteRead(id);
	}
});
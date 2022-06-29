/* eslint-disable linebreak-style */
const { nanoid } = require('nanoid');
const books = require('./books');

const addBookHandler = (request, h) => {
  const {
    name, year, author, summary,
    publisher, pageCount, readPage, reading,
  } = request.payload;

  const id = nanoid(16);
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;

  const finished = (pageCount === readPage);

  const newBooks = {
    id,
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    finished,
    reading,
    insertedAt,
    updatedAt,
  };

  if (name == null) {
    const response = h.response({
      status: 'fail', // statusnya
      message: 'Gagal menambahkan buku. Mohon isi nama buku', // message
    });
    response.code(400); // code 201 berarti berhasil
    return response;
  }
  if (readPage > pageCount) {
    const response = h.response({
      status: 'fail', // statusnya
      message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount', // message
    });
    response.code(400); // code 201 berarti berhasil
    return response;
  }
  books.push(newBooks);

  const isSuccess = books.filter((book) => book.id === id).length > 0;

  if (isSuccess) { // kalo true
    const response = h.response({ // handler response
      status: 'success', // statusnya
      message: 'Catatan berhasil ditambahkan', // message
      data: {
        noteId: id,
      },
    });
    response.code(201); // code 201 berarti berhasil
    return response;
  }
  const response = h.response({
    status: 'fail',
    message: 'Catatan gagal ditambahkan',
  });
  response.code(500);
  return response;
};

const getAllBooksHandler = (request, h) => {
  const { name, reading, finished } = request.query;

  if (!reading && !finished && !name) {
    const response = h.response({
      status: 'success',
      data: {
        books: books.map((book) => ({
          id: book.id,
          name: book.name,
          publisher: book.publisher,
        })),
      },
    });
    response.code(200);
    return response;
  }

  if (name && !reading && !finished) {
    const booksByName = books.filter((book) => {
      const regex = new RegExp(name, 'gi');
      return regex.test(book.name);
    });

    const response = h.response({
      status: 'success',
      data: {
        books: booksByName.map((book) => ({
          id: book.id,
          name: book.name,
          publisher: book.publisher,
        })),
      },
    });
    response.code(200);
    return response;
  }

  if (!name && reading && !finished) {
    const booksByReading = books.filter((book) => book.reading === reading);

    const response = h.response({
      status: 'success',
      data: {
        books: booksByReading.map((book) => ({
          id: book.id,
          name: book.name,
          publisher: book.publisher,
        })),
      },
    });
    response.code(200);
    return response;
  }

  if (!name && !reading && finished) {
    const booksByFinished = books.filter((book) => book.finished === finished);

    const response = h.response({
      status: 'success',
      data: {
        books: booksByFinished.map((book) => ({
          id: book.id,
          name: book.name,
          publisher: book.publisher,
        })),
      },
    });
    response.code(200);
    return response;
  }

  const response = h.response({
    status: 'fail',
    message: 'Gagal mendapatkan data',
  });
  response.code(500);
  return response;
};

const getBookByIdHandler = (request, h) => {
  const { id } = request.params;

  const book = books.filter((b) => b.id === id)[0];

  if (book !== undefined) {
    return {
      status: 'success',
      data: {
        book,
      },
    };
  }

  const response = h.response({ // kalo undefined
    status: 'fail',
    message: 'Buku tidak ditemukan',
  });
  response.code(404);
  return response;
};

const editBookByIdHandler = (request, h) => {
  const { id } = request.params;

  const {
    name, year, author, summary, publisher, pageCount, readPage, reading,
  } = request.payload;
  const updatedAt = new Date().toISOString();

  const index = books.findIndex((book) => book.id === id);

  if (name === null) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Mohon isi nama buku',
    });
    response.code(400);
    return response;
  }
  if (readPage > pageCount) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
    });
    response.code(400);
    return response;
  }
  if (index !== -1) { // kalo index ditemukan
    books[index] = {
      ...books[index], // ambil index yang pertama
      name, // ambil title, tags, dll
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      reading,
      updatedAt,
    };

    const response = h.response({
      status: 'success',
      message: 'Buku berhasil diperbarui',
    });
    response.code(200);
    return response;
  }

  const response = h.response({ // kalo ga ketemu
    status: 'fail',
    message: 'Gagal memperbarui buku. Id tidak ditemukan',
  });
  response.code(404);
  return response;
};

const deleteBookByIdHandler = (request, h) => {
  const { id } = request.params; // ambil nilai id pake request.params

  // dapetin index array pada object sesuai id
  const index = books.findIndex((book) => book.id === id);

  if (index !== -1) {
    books.splice(index, 1); // menghapus data pada array berdasarkan index
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil dihapus',
    });
    response.code(200);
    return response;
  }

  const response = h.response({
    status: 'fail',
    message: 'Buku gagal dihapus. Id tidak ditemukan',
  });
  response.code(404);
  return response;
};

module.exports = {
  addBookHandler,
  getAllBooksHandler,
  getBookByIdHandler,
  editBookByIdHandler,
  deleteBookByIdHandler,
};

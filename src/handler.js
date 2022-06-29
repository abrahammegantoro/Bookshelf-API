/* eslint-disable linebreak-style */
/* eslint-disable consistent-return */
/* eslint-disable linebreak-style */
const { nanoid } = require('nanoid');
const books = require('./books');

const addBookHandler = (request, h) => {
  const {
    name, year, author, summary,
    publisher, pageCount, readPage,
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
};

const getAllBooksHandler = () => ({
  status: 'success',
  data: {
    books,
  },
});

module.exports = {
  addBookHandler,
  getAllBooksHandler,
};

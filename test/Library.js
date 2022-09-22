const {expect} = require("chai");
const {ethers} = require("hardhat");

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}
//start with the test the step to be taken

describe("Library Contract", function() {
  let Library;
  let library;
  let owner;
  //the owner will sign in a dummy contract

  const NUM_UNCOMPLETED_BOOK = 5;
  const NUM_COMPLETED_BOOK = 3;

  let uncompletedBookList;
  let completedBookList;
  //function for the verification of the books

  function verifyBook(bookChain, book) {
      expect(book.name).to.equal(bookChain.name);
      expect(book.year.toString()).to.equal(bookChain.year.toString());
      expect(book.author).to.equal(bookChain.author);
  }

  function verifyBookList(booksFromChain, bookList) {
      expect(booksFromChain.length).to.not.equal(0);
      expect(booksFromChain.length).to.equal(bookList.length);
      for (let i = 0; i < bookList.length; i++) {
          const bookChain = booksFromChain[i];
          const book = bookList[i];
          verifyBook(bookChain, book);
      }
  }

  beforeEach(async function() {
    Library = await ethers.getContractFactory("Library");
    [owner] = await ethers.getSigners();
    library = await Library.deploy();

    uncompletedBookList = [];
    completedBookList = [];



    for(let i=0; i<NUM_UNCOMPLETED_BOOK; i++) {
      let book = {
        'name': getRandomInt(1, 1000).toString(),
        'year': getRandomInt(1800, 2021),
        'author': getRandomInt(1, 1000).toString(),
        'completed': false
      };
      //after we have created book now we have to add book

      await library.addBook(book.name, book.year, book.author, book.completed);
      uncompletedBookList.push(book);
    }
    //now we will go for completed book

    for(let i=0; i<NUM_COMPLETED_BOOK; i++) {
      let book = {
        'name': getRandomInt(1, 1000).toString(),
        'year': getRandomInt(1800, 2021),
        'author': getRandomInt(1, 1000).toString(),
        'completed': true
      };
      //after we have created book now we have to add book

      await library.addBook(book.name, book.year, book.author, book.completed);
      completedBookList.push(book);
    }
  });
  //now in decribe we will add the groups of function in these there are four functions 
  describe("Add Book", function(){
    it("should emit AddBook event", async function() {
      let book = {
        'name': getRandomInt(1, 1000).toString(),
        'year': getRandomInt(1800, 2021),
        'author': getRandomInt(1, 1000).toString(),
        'completed': false
      };

      await expect(await library.addBook(book.name, book.year, book.author, book.completed)
    ).to.emit(library, 'AddBook').withArgs(owner.address, NUM_COMPLETED_BOOK + NUM_UNCOMPLETED_BOOK);
    //in the above line we sent two argument owner id and bookId
    })
  })
  //now we will describe getBook
  describe("Get Book", function() {
    //the test case for uncompleted books
    it("should return the correct uncompleted books", async function(){
      const booksFromChain = await library.getUncompletedBooks()
      expect(booksFromChain.length).to.equal(NUM_UNCOMPLETED_BOOK);
      verifyBookList(booksFromChain, uncompletedBookList);
    })
    //test for completed books
    it("should return the correct completed books", async function(){
      const booksFromChain = await library.getCompletedBooks()
      expect(booksFromChain.length).to.equal(NUM_COMPLETED_BOOK);
      verifyBookList(booksFromChain, completedBookList);
    })
  })
  //again here we are doing the same thing as above
  describe("Set Completed", function() {
      it("Should emit SetCompleted event", async function () {
          const BOOK_ID = 0;
          const BOOK_COMPLETED = true;

          await expect(
              library.setCompleted(BOOK_ID, BOOK_COMPLETED)
          ).to.emit(
              library, 'SetCompleted'
          ).withArgs(
              BOOK_ID, BOOK_COMPLETED
          )
      })
  })
  //above we have four unit test(describe) each unit test has a description
});
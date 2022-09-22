//SPDX-License-Identifier:MIT

pragma solidity ^0.8.0;

contract Library{

    event AddBook(address recipient, uint bookId);
    event SetCompleted(uint bookId,bool completed);
    
    struct Book{
        uint id;
        string name;
        uint year;
        string author;
        bool completed;    //completed will track whether the reading is finished or not
    }

    Book[] private bookList; // these act as the memory till now how many book is read

    mapping(uint=>address) bookToOwner; // these will be the mapping of the book id 
    //to the wallet address of the user adding the new book under their name

    function addBook(string memory name, uint year,string memory author,bool completed) public{
        uint bookId = bookList.length;
        bookList.push(Book(bookId, name, year, author, completed));
        bookToOwner[bookId]=msg.sender;
        emit AddBook(msg.sender, bookId);
    }

    function _getBookList(bool completed) private view returns(Book[] memory){
        Book[] memory temporary = new Book[](bookList.length);
        uint counter = 0;
        for(uint i =0;i<bookList.length;i++){
            if(bookToOwner[i]==msg.sender &&
            bookList[i].completed==completed //it should be match the variable passed is true or false
            ){
                temporary[counter]=bookList[i];
                counter++;
            }
        }
        Book[] memory result = new Book[](counter);
        for(uint i = 0;i<counter;i++){
            result[i] = temporary[i];
        }
        return result;
        
    }

    function getCompletedBooks() external view returns(Book[] memory){
        return _getBookList(true);
    }

    function getUncompletedBooks() external view returns(Book[] memory){
        return _getBookList(false);
    }

    function setCompleted(uint bookId, bool completed) external{
        if(bookToOwner[bookId] == msg.sender){
            bookList[bookId].completed=completed;
            emit SetCompleted(bookId, completed);
        }
    }
}


    





// SPDX-License-Identifier: MIT
pragma solidity = 0.8.19;

contract board{


    // 게시판에 등록될 구조를 생성
    struct contents_info{
        string title;
        string content;
        string writer;
        string image;
    }

    // mapping 데이터를 생성
    mapping(uint=>contents_info) internal contents;

    // 글 목록 배열 생성
    uint[] internal content_list ;

    // 글을 추가하는 함수 생성
    function add_content(
        uint _no,
        string memory _title, 
        string memory _content, 
        string memory _writer, 
        string memory _image
    ) public{
        contents[_no].title = _title;
        contents[_no].content = _content;
        contents[_no].writer = _writer;
        contents[_no].image = _image;
        content_list.push(_no);
    }
    // 게시글의 정보를 리턴해주는 함수
    function view_content(uint _no) public view returns (
        uint,
        string memory, 
        string memory, 
        string memory, 
        string memory){
            string memory title = contents[_no].title;
            string memory content = contents[_no].content;
            string memory writer = contents[_no].writer;
            string memory image = contents[_no].image;
            return (_no, title, content, writer, image);
        }

    // 글 목록 배열의 크기와 배열을 리턴해주는 함수
    function view_count() public view returns(uint, uint[] memory){
        return (content_list.length, content_list);
    }
}
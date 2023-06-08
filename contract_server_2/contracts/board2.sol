// SPDX-License-Identifier: MIT
pragma solidity = 0.8.19;

contract board2{

    // 글 번호 변수 선언
    uint internal count;


    // 생성자 함수  : 컨트렉트가 배포될때 최초로 한번만 실행하는 함수
    constructor(){
        count=1;
    }

    // 게시판에 등록될 구조를 생성
    struct contents_info{
        string title;
        string content;
        string writer;
        string image;
    }

    // mapping 데이터를 생성
    mapping(uint=>contents_info) internal contents;


    // 글을 추가하는 함수 생성
    function add_content(
        string memory _title, 
        string memory _content, 
        string memory _writer, 
        string memory _image
    ) public{
        contents[count].title = _title;
        contents[count].content = _content;
        contents[count].writer = _writer;
        contents[count].image = _image;
        // mapping에 정상적으로 데이터가 담기면 글 번호를 1씩 증가
        count++;
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

    // count 변수를 리턴해주는 함수
    function view_count() public view returns(uint){
        return (count);
    }
}
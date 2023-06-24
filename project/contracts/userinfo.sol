// SPDX-License-Identifier: MIT
pragma solidity >=0.4.0 < 0.9.0;
// 버전 명시
contract userinfo{
    // 유저의 정보를 저장 컨트렉트 

    // 유저의 정보를 저장하는 구조를 하나 생성
    // mysql table 설정과 흡사
    struct info{
        // 유저의 정보가 존재하는지 확인하는
        string id;
        string password;
        string name;
        string phone;
        string location;
        address walletAddress;
    }

    mapping (string => info) internal users;

    // 유저의 정보를 등록하는 함수 
    function add_user(
        string memory _id, 
        string memory _pass, 
        string memory _name, 
        string memory _phone,
        string memory _location,
        address _walletAddress
    ) public {
        // 회원 정보가 존재한다면 함수의 호출을 거절
        // state가 0이면 회원 정보가 존재하지 않는다. 
        // state가 0이 아니면 회원 정보가 존재.
 
        // mapping 데이터에 _id 값을 키 값으로 value 대입
        users[_id].id = _id;
        users[_id].password = _pass;
        users[_id].name = _name;
        users[_id].phone = _phone;
        users[_id].location = _location;
        users[_id].walletAddress = _walletAddress;

    }

    // 유저의 정보를 출력하는 함수 생성 
    function view_info(
        string memory _id
    ) public view returns(
        string memory, 
        string memory, 
        string memory, 
        string memory,
        string memory,
        address
    ){
        string memory id = users[_id].id;
        string memory pass = users[_id].password;
        string memory name = users[_id].name;
        string memory phone = users[_id].phone;
        string memory location = users[_id].location;
        address walletAddress = users[_id].walletAddress;
        return (id, pass, name, phone, location, walletAddress);
    }



}
// SPDX-Lisence-Identifier: MIT
pragma solidity ^0.8.19;

contract test {

    // 변수 선언
    // solidity에서 변수를 선언할때는 
    // (데이터의 타입) (사용 가능 권한) (변수의 이름)
    address internal owner;
    uint internal count;
    
    // 생성자 함수
    // 컨트렉트가 배포가 될때 최초로 한번만 실행이 되는 함수
    constructor() {
        // 컨트렉트를 배포하는 사람이 owner이다.
        // 컨트렉트를 배포하는 지갑의 주소 msg.sender
        owner = msg.sender;
        count = 0;
    }

    // 구조체 : 데이터의 구조의 틀을 만들어준다. 
    // js에 json의 구조를 만든다. 
    struct user_info{
        string name;
        uint8 age;
        string birth;
    }
    // 위의 구조체는 
    // {'name' : ????, 'age' : ????, 'brith' : ????}

    // mapping 데이터를 생성
    // {key : value, key2 : value2, key3 : value3, .....}
    // key의 형태는 string, address, uint
    // value의 형태는 string, addres, uint, [], struct
    mapping(address => user_info) internal users;

    // 배열을 생성
    address[] public user_list;

    // modifier 함수
    // 함수를 수정한다 -> 함수들의 행동을 결합
    modifier onlyOwner{
        // transaction을 일으킨 지갑의 주소가 owner와 같은 경우에만 실행
        require(owner == msg.sender, "Only owner can call funtion");
        _;
    }
    modifier count_user{
        _;
        count++;
    }

    function add_user(
        address _wallet, 
        string memory _name, 
        uint8 _age, 
        string memory _birth
    ) public onlyOwner count_user {
        // mapping에 데이터를 생성
        users[_wallet].name = _name;
        users[_wallet].age = _age;
        users[_wallet].birth = _birth;
        // 배열의 키 값들을 추가
        user_list.push(_wallet);
    }

    function view_user(
        address _wallet
    ) public view returns (
        string memory, 
        uint8, 
        string memory
    ){
        return (
            users[_wallet].name, 
            users[_wallet].age, 
            users[_wallet].birth
        );
    }
}
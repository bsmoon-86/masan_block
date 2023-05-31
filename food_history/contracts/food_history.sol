// SPDX-License-Identifier: MIT
pragma solidity >=0.4.0 <0.9.0;

contract food_history{

    // 구조체 생성 
    struct history{
        uint8 _state;
        string _name;
        address _wallet;
        string _type;
        string[] _hist;
        uint _price;
    }

    // mapping 생성
    mapping (string => history) internal foods;

    // 물품을 등록하는 함수 
    function regist_food(
        string memory _code, 
        string memory _name, 
        string memory _type
    ) public {
        // code가 등록되어 있으면 함수 호출 거절 
        require(foods[_code]._state == 0, "exist food");
        foods[_code]._name = _name;
        foods[_code]._type = _type;
        foods[_code]._state = 1;
        foods[_code]._wallet = msg.sender;
    }

    // 물품의 가격을 등록하는 함수 생성 
    function regist_price(
        string memory _code, 
        uint _price
    )public {
        require(foods[_code]._state != 0, "not exist food");
        foods[_code]._price = _price;
    }

    // 물품이 거래가 성사되었을때 상태를 변경하는 함수
    function change_state(
        string memory _code
    ) public {
        require(foods[_code]._state == 1, 'error');
        foods[_code]._state = 9;
    }

    // 물품에 대한 내역을 추가 함수 
    function add_hist(
        string memory _code, 
        string memory _hist
    ) public {
        // code가 등록되어 있지 않다면 거절
        require(foods[_code]._state != 0, "not exist food");
        // 구조체에 배열 부분에 내역 추가 
        // 배열에 데이터를 추가 
        foods[_code]._hist.push(_hist);
    }

    // mapping 데이터를 확인하는 함수 
    function view_food(
        string memory _code
    ) public view returns (
        string memory, 
        string memory, 
        string[] memory, 
        address, 
        uint, 
        uint8){
            string memory _name = foods[_code]._name;
            string memory _type = foods[_code]._type;
            string[] memory _hist = foods[_code]._hist;
            address _wallet = foods[_code]._wallet;
            uint _price = foods[_code]._price;
            uint8 _state = foods[_code]._state;
            return (_name, _type, _hist, _wallet, _price, _state);
        }


}
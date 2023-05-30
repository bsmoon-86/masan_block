// SPDX-License-Identifier: MIT
pragma solidity >=0.4.0 <0.9.0;

contract food_history{

    // 구조체 생성 
    struct history{
        uint8 _state;
        string _name;
        string _type;
        string[] _hist;
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
        string[] memory){
            string memory _name = foods[_code]._name;
            string memory _type = foods[_code]._type;
            string[] memory _hist = foods[_code]._hist;
            return (_name, _type, _hist);
        }


}
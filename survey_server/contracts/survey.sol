// SPDX-License-Identifier: MIT
pragma solidity = 0.8.15;

contract survey{

    uint internal count;
    address internal owner;
    // 생성자 함수
    // deploy가 될때 자동으로 실행하는 함수
    constructor() {
        count = 0;
        owner = msg.sender;
    }

    // modifier 생성
    // 함수의 동작을 변경 시키기 위한 방법
    // 함수를 실행하기 전에 동작
    // 함수를 실행하고 나서 동작
    modifier onlyOwner {
        require(msg.sender == owner, 'Only owner can call this function');
        // _의 뜻은 modifier가 포함되어 있는 함수의 코드
        _;
    }
    modifier increament_count {
        _;
        count++;
    }

    // 설문을 저장
    // 이름, 성별, 연령대, 커피선호도 구조체 생성
    // mapping을 이용하여 설문을 중복으로 받지 않는 형태
    // mapping key 값은 로그인을 한 ID 값

    // 구조체 생성
    struct survey_info{
        string name;
        uint8 gender; // 성별이 1이면 남자, 2이면 여자, 9이면 무응답
        uint8 age;
        string coffee;
    }

    // mapping 데이터 생성
    mapping (string => survey_info) internal surveys;

    // 전체 설문 내역 확인하기 위해 
    // 키값들의 배열 
    string[] internal survey_list;


    // 설문을 추가하는 함수 
    function add_survey(
        string memory _id, 
        string memory _name, 
        uint8 _gender, 
        uint8 _age, 
        string memory _coffee
    ) public onlyOwner increament_count {
        // 설문 내역을 mapping 데이터에 추가 
        surveys[_id].name = _name;
        surveys[_id].gender = _gender;
        surveys[_id].age = _age;
        surveys[_id].coffee = _coffee;
        // 배열 데이터에 키 값을 추가
        survey_list.push(_id);
    }

    // 설문의 참여 여부를 알려주는 함수 
    function check_survey(
        string memory _id
    ) public view returns(string memory){
        // 설문의 참여 여부 확인 하려면?
        // 입력받은 id 값을 기준으로 mapping data 확인
        // 숫자형태의 데이터에서는 데이터가 존재하지 않는다면 0으로 표시 
        if (surveys[_id].gender == 0){
            return '설문 참가 내역 없음';
        }else{
            return '설문 참사 내역 있음';
        }
    }

    // 설문의 정보를 출력 
    function view_survey(
        string memory _id
    ) public view returns (
        string memory, 
        string memory,
        uint8, 
        uint8
    ){
        return (
            surveys[_id].name, 
            surveys[_id].coffee,
            surveys[_id].gender, 
            surveys[_id].age
        );
    }

}